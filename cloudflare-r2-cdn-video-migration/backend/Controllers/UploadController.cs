using Api.Base;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// Video upload endpoints. Image endpoints in the existing UploadController are untouched — merge
/// the members below into your existing class rather than replacing the file wholesale.
/// </summary>
[ApiController]
[Route("api/upload")]
[Authorize] // uploads are never anonymous — see §20 of the implementation guide
public class UploadController : ControllerBase
{
    private readonly ICloudflareR2Service _cloudflareR2Service;

    public UploadController(ICloudflareR2Service cloudflareR2Service)
    {
        _cloudflareR2Service = cloudflareR2Service;
    }

    // -----------------------------------------------------------------------------------------
    // Video validation
    // -----------------------------------------------------------------------------------------

    private static readonly HashSet<string> ALLOWED_VIDEO_MIME_TYPES =
    [
        "video/mp4",
        "video/webm",
        "video/quicktime",
    ];

    /// <summary>
    /// A declared MIME type is only trusted when it agrees with the extension. Both are supplied
    /// by the client, so agreement is a consistency check, not proof — the magic-byte sniff below
    /// is what actually inspects the bytes.
    /// </summary>
    private static readonly Dictionary<string, string> MIME_TO_EXTENSION = new()
    {
        ["video/mp4"] = ".mp4",
        ["video/webm"] = ".webm",
        ["video/quicktime"] = ".mov",
    };

    private const long MAX_VIDEO_SIZE = 250L * 1024L * 1024L;

    /// <summary>
    /// POST /api/upload/video — multipart/form-data with one or more files.
    /// Returns the public CDN URL for each stored object.
    /// </summary>
    [HttpPost("video")]
    [RequestSizeLimit(MAX_VIDEO_SIZE)]
    [RequestFormLimits(MultipartBodyLengthLimit = MAX_VIDEO_SIZE)]
    public async Task<UploadFileResponceCMS> Video()
    {
        var result = new UploadFileResponceCMS { ID = ResultID.ERROR };

        var data = new List<FileDetailCMS>();

        var files = Request.Form.Files;

        if (files == null || files.Count == 0)
            return result;

        foreach (var file in files)
        {
            if (file.Length <= 0)
                continue;

            if (file.Length > MAX_VIDEO_SIZE)
                return Fail("VIDEO_TOO_LARGE");

            var contentType = (file.ContentType ?? "").Trim().ToLowerInvariant();

            if (!ALLOWED_VIDEO_MIME_TYPES.Contains(contentType))
                return Fail("VIDEO_TYPE_NOT_ALLOWED");

            var ext = Path.GetExtension(file.FileName)?.ToLowerInvariant();

            if (string.IsNullOrWhiteSpace(ext))
                return Fail("INVALID_FILE_EXTENSION");

            if (MIME_TO_EXTENSION[contentType] != ext)
                return Fail("EXTENSION_MIME_MISMATCH");

            await using var stream = file.OpenReadStream();

            if (!await LooksLikeVideoAsync(stream, contentType, HttpContext.RequestAborted))
                return Fail("VIDEO_CONTENT_NOT_RECOGNIZED");

            // The stored name is generated, never the client's — an attacker does not get to
            // choose the key, and two uploads of "demo.mp4" cannot collide.
            var fileName = $"{Guid.NewGuid():N}{ext}";

            var folder = DateTime.UtcNow.ToString("yyyy/MM/dd");

            var key = $"uploads/videos/{folder}/{fileName}";

            var publicUrl = await _cloudflareR2Service.UploadAsync(
                stream,
                key,
                contentType,
                HttpContext.RequestAborted);

            data.Add(new FileDetailCMS
            {
                FileUrl = publicUrl,
                FileName = fileName,
                Length = file.Length,
                FileType = contentType,
            });
        }

        if (data.Count == 0)
            return result;

        return new UploadFileResponceCMS
        {
            ID = ResultID.SUCCESS,
            Message = "Success",
            Data = data,
        };
    }

    // -----------------------------------------------------------------------------------------
    // Optional: presigned direct-to-R2 upload (§21). Enable when videos outgrow proxying through
    // the API. The endpoint above stays as the fallback for small files and older clients.
    // -----------------------------------------------------------------------------------------

    public class VideoUploadUrlRequest
    {
        public string FileName { get; set; } = "";
        public string ContentType { get; set; } = "";
    }

    /// <summary>
    /// POST /api/upload/video-url — returns a short-lived PUT URL the browser uploads to directly,
    /// plus the public URL the object will have. No video bytes touch this server.
    /// </summary>
    [HttpPost("video-url")]
    public IActionResult VideoUploadUrl([FromBody] VideoUploadUrlRequest request)
    {
        var contentType = (request.ContentType ?? "").Trim().ToLowerInvariant();

        if (!ALLOWED_VIDEO_MIME_TYPES.Contains(contentType))
            return BadRequest(new { Message = "VIDEO_TYPE_NOT_ALLOWED" });

        var ext = Path.GetExtension(request.FileName)?.ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(ext) || MIME_TO_EXTENSION[contentType] != ext)
            return BadRequest(new { Message = "EXTENSION_MIME_MISMATCH" });

        var key = $"uploads/videos/{DateTime.UtcNow:yyyy/MM/dd}/{Guid.NewGuid():N}{ext}";

        // Presigning cannot enforce a size cap or inspect bytes, so keep the window short and
        // keep this endpoint behind the same authorization as the proxying one.
        var presigned = _cloudflareR2Service.CreatePresignedUpload(
            key,
            contentType,
            TimeSpan.FromMinutes(15));

        return Ok(new
        {
            uploadUrl = presigned.UploadUrl,
            publicUrl = presigned.PublicUrl,
            key = presigned.Key,
        });
    }

    // -----------------------------------------------------------------------------------------

    private static UploadFileResponceCMS Fail(string message) =>
        new() { ID = ResultID.ERROR, Message = message };

    /// <summary>
    /// Reads the container signature. MP4/MOV carry an "ftyp" box at offset 4; WebM is a Matroska
    /// EBML stream starting 1A 45 DF A3. This rejects a renamed .exe; it is not a full parse.
    /// </summary>
    private static async Task<bool> LooksLikeVideoAsync(
        Stream stream,
        string contentType,
        CancellationToken ct)
    {
        // Sniffing consumes bytes the upload still needs. ASP.NET buffers form files (in memory or
        // to disk) so this stream is seekable in practice; if some host ever hands us a forward-only
        // stream, skip the sniff rather than upload a truncated object. MIME and extension checks
        // have already run either way.
        if (!stream.CanSeek)
            return true;

        var header = new byte[12];

        var read = await stream.ReadAtLeastAsync(header, header.Length, throwOnEndOfStream: false, ct);

        stream.Position = 0;

        if (read < header.Length)
            return false;

        if (contentType == "video/webm")
            return header[0] == 0x1A && header[1] == 0x45 && header[2] == 0xDF && header[3] == 0xA3;

        // "ftyp"
        return header[4] == 0x66 && header[5] == 0x74 && header[6] == 0x79 && header[7] == 0x70;
    }
}
