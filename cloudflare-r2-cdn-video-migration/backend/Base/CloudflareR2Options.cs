namespace Api.Base;

/// <summary>
/// Bound from the "CloudflareR2" configuration section. In production every value here comes
/// from environment variables or deployment secrets — never from a committed appsettings file.
/// </summary>
public class CloudflareR2Options
{
    /// <summary>Cloudflare account id. Forms the S3 endpoint host.</summary>
    public string AccountId { get; set; } = "";

    /// <summary>R2 API token access key id. Secret.</summary>
    public string AccessKeyId { get; set; } = "";

    /// <summary>R2 API token secret access key. Secret.</summary>
    public string SecretAccessKey { get; set; } = "";

    /// <summary>Target bucket, e.g. "myos-assets".</summary>
    public string BucketName { get; set; } = "";

    /// <summary>
    /// Custom CDN domain in front of the bucket, e.g. "https://assets.myos.ai".
    /// This — not the bucket endpoint — is what the frontend ever sees.
    /// </summary>
    public string PublicBaseUrl { get; set; } = "";

    /// <summary>S3 endpoint derived from the account id.</summary>
    public string ServiceUrl => $"https://{AccountId}.r2.cloudflarestorage.com";
}
