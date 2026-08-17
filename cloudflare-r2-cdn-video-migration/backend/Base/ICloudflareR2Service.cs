namespace Api.Base;

/// <summary>
/// Server-side access to Cloudflare R2. Write credentials live behind this interface and must
/// never be exposed to a browser.
/// </summary>
public interface ICloudflareR2Service
{
    /// <summary>
    /// Uploads a stream to <paramref name="key"/> and returns the public CDN URL, e.g.
    /// "https://assets.myos.ai/videos/education-demo.mp4".
    /// </summary>
    Task<string> UploadAsync(
        Stream fileStream,
        string key,
        string contentType,
        CancellationToken ct = default);

    /// <summary>Builds the public CDN URL for a key without touching the network.</summary>
    string GetPublicUrl(string key);

    /// <summary>
    /// Optional (see §21 of the implementation guide): issues a short-lived presigned PUT URL so a
    /// browser can upload directly to R2, keeping large media off the API server.
    /// </summary>
    PresignedUpload CreatePresignedUpload(
        string key,
        string contentType,
        TimeSpan expiresIn);
}

/// <summary>Result of <see cref="ICloudflareR2Service.CreatePresignedUpload"/>.</summary>
public record PresignedUpload(string UploadUrl, string PublicUrl, string Key);
