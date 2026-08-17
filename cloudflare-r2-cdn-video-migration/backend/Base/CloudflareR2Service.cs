using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Api.Base;

/// <summary>
/// Cloudflare R2 through its S3-compatible API. One instance per request (scoped); the underlying
/// <see cref="AmazonS3Client"/> is created per instance and disposed with it.
/// </summary>
public class CloudflareR2Service : ICloudflareR2Service, IDisposable
{
    private readonly CloudflareR2Options _options;
    private readonly ILogger<CloudflareR2Service> _logger;
    private readonly AmazonS3Client _client;

    /// <summary>
    /// Anything at or above this size is uploaded in parts. R2 requires parts of at least 5 MiB;
    /// 8 MiB keeps the part count reasonable for the ~70 MB demo videos.
    /// </summary>
    private const long MULTIPART_THRESHOLD = 8L * 1024L * 1024L;

    public CloudflareR2Service(
        IOptions<CloudflareR2Options> options,
        ILogger<CloudflareR2Service> logger)
    {
        _options = options.Value;
        _logger = logger;

        ValidateConfiguration();

        var config = new AmazonS3Config
        {
            ServiceURL = _options.ServiceUrl,
            // R2 has no regions, but the SigV4 signer needs one.
            AuthenticationRegion = "auto",
            ForcePathStyle = true,

            // R2 rejects the AWS SDK's default flexible-checksum trailers on streaming uploads.
            // Requires AWSSDK.Core >= 3.7.400 (AWSSDK.S3 >= 3.7.400 / 4.x). If you are pinned to an
            // older SDK, delete these two lines — older SDKs do not send the trailers at all.
            RequestChecksumCalculation = RequestChecksumCalculation.WHEN_REQUIRED,
            ResponseChecksumValidation = ResponseChecksumValidation.WHEN_REQUIRED,
        };

        _client = new AmazonS3Client(
            _options.AccessKeyId,
            _options.SecretAccessKey,
            config);
    }

    public async Task<string> UploadAsync(
        Stream fileStream,
        string key,
        string contentType,
        CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(fileStream);

        if (!fileStream.CanRead)
            throw new ArgumentException("Stream is not readable.", nameof(fileStream));

        key = NormalizeKey(key);

        if (string.IsNullOrWhiteSpace(contentType))
            contentType = "application/octet-stream";

        // TransferUtility switches to multipart above the threshold, so a 250 MB video does not
        // have to be buffered whole. Below it, this is a single PutObject.
        var request = new TransferUtilityUploadRequest
        {
            BucketName = _options.BucketName,
            Key = key,
            InputStream = fileStream,
            ContentType = contentType,
            AutoCloseStream = false,
            PartSize = MULTIPART_THRESHOLD,

            // Permanent media is versioned by renaming the key (rehab.mp4 -> rehab-v2.mp4), never
            // by overwriting, so the edge may cache it indefinitely.
            Headers = { CacheControl = "public, max-age=31536000, immutable" },
        };

        using var transfer = new TransferUtility(_client);

        try
        {
            await transfer.UploadAsync(request, ct);
        }
        catch (AmazonS3Exception ex)
        {
            // Never log _options — it carries the secret access key.
            _logger.LogError(
                ex,
                "R2 upload failed for key {Key} in bucket {Bucket} (status {Status})",
                key,
                _options.BucketName,
                ex.StatusCode);

            throw;
        }

        _logger.LogInformation("Uploaded {Key} to R2 bucket {Bucket}", key, _options.BucketName);

        return GetPublicUrl(key);
    }

    public string GetPublicUrl(string key)
    {
        var baseUrl = _options.PublicBaseUrl.TrimEnd('/');

        return $"{baseUrl}/{NormalizeKey(key)}";
    }

    public PresignedUpload CreatePresignedUpload(
        string key,
        string contentType,
        TimeSpan expiresIn)
    {
        key = NormalizeKey(key);

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _options.BucketName,
            Key = key,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.Add(expiresIn),
            ContentType = contentType,
        };

        // The browser must send exactly this Content-Type, or the signature will not match.
        return new PresignedUpload(
            _client.GetPreSignedURL(request),
            GetPublicUrl(key),
            key);
    }

    /// <summary>
    /// Object keys are relative and never traverse. A leading slash or a "../" segment would
    /// silently produce an object nobody can address through the CDN path we hand the frontend.
    /// </summary>
    private static string NormalizeKey(string key)
    {
        if (string.IsNullOrWhiteSpace(key))
            throw new ArgumentException("Object key is required.", nameof(key));

        key = key.Replace('\\', '/').TrimStart('/');

        if (key.Length == 0)
            throw new ArgumentException("Object key is required.", nameof(key));

        if (key.Split('/').Any(segment => segment is "." or ".."))
            throw new ArgumentException($"Object key '{key}' contains a traversal segment.", nameof(key));

        return key;
    }

    private void ValidateConfiguration()
    {
        // Fail at construction with a named field rather than at upload time with a 403.
        var missing = new List<string>();

        if (string.IsNullOrWhiteSpace(_options.AccountId)) missing.Add(nameof(_options.AccountId));
        if (string.IsNullOrWhiteSpace(_options.AccessKeyId)) missing.Add(nameof(_options.AccessKeyId));
        if (string.IsNullOrWhiteSpace(_options.SecretAccessKey)) missing.Add(nameof(_options.SecretAccessKey));
        if (string.IsNullOrWhiteSpace(_options.BucketName)) missing.Add(nameof(_options.BucketName));
        if (string.IsNullOrWhiteSpace(_options.PublicBaseUrl)) missing.Add(nameof(_options.PublicBaseUrl));

        if (missing.Count > 0)
        {
            throw new InvalidOperationException(
                $"CloudflareR2 configuration is incomplete. Missing: {string.Join(", ", missing)}. " +
                "Set them via CloudflareR2__<Name> environment variables.");
        }

        if (!Uri.TryCreate(_options.PublicBaseUrl, UriKind.Absolute, out var publicUri)
            || publicUri.Scheme != Uri.UriSchemeHttps)
        {
            throw new InvalidOperationException(
                "CloudflareR2:PublicBaseUrl must be an absolute https URL, e.g. https://assets.myos.ai");
        }
    }

    public void Dispose() => _client.Dispose();
}
