namespace Api.Models;

// ---------------------------------------------------------------------------------------------
// These three types already exist in api-retail-e-commerce. Add this file ONLY if your copy of
// the backend does not have them; otherwise delete it and keep your existing definitions.
// ---------------------------------------------------------------------------------------------

public static class ResultID
{
    public const int ERROR = 0;
    public const int SUCCESS = 1;
}

public class FileDetailCMS
{
    /// <summary>Public CDN URL, e.g. https://assets.myos.ai/uploads/videos/2026/08/15/abc.mp4</summary>
    public string FileUrl { get; set; } = "";

    /// <summary>Generated (not user-supplied) file name.</summary>
    public string FileName { get; set; } = "";

    public long Length { get; set; }

    public string FileType { get; set; } = "";
}

public class UploadFileResponceCMS
{
    public int ID { get; set; }

    public string Message { get; set; } = "";

    public List<FileDetailCMS> Data { get; set; } = new();
}
