// ---------------------------------------------------------------------------------------------
// Add these blocks to your existing Program.cs. This file is a snippet, not a drop-in replacement.
// ---------------------------------------------------------------------------------------------

using Api.Base;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Cloudflare R2 -------------------------------------------------------------------------

builder.Services.Configure<CloudflareR2Options>(
    builder.Configuration.GetSection("CloudflareR2"));

builder.Services.AddScoped<ICloudflareR2Service, CloudflareR2Service>();

// --- 2. Request size limits -------------------------------------------------------------------
//
// The default multipart body limit is ~128 MB and Kestrel's default request body limit is 30 MB.
// A 250 MB video fails on both before any controller code runs, so raise them here to match
// MAX_VIDEO_SIZE in UploadController.

const long MAX_UPLOAD_BYTES = 250L * 1024L * 1024L;

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = MAX_UPLOAD_BYTES;
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = MAX_UPLOAD_BYTES;
});

// If you host behind IIS, also add:
// builder.Services.Configure<IISServerOptions>(o => o.MaxRequestBodySize = MAX_UPLOAD_BYTES);
// and set <requestLimits maxAllowedContentLength="262144000" /> in web.config.
//
// Behind Nginx: client_max_body_size 250m;
//
// Note: if you adopt the presigned-URL flow (POST /api/upload/video-url), none of these limits
// matter for that path — the bytes go straight from the browser to R2.

// --- 3. Environment variables in development ---------------------------------------------------
//
// User secrets keep credentials out of the repo during local development:
//   dotnet user-secrets set "CloudflareR2:AccountId"       "..."
//   dotnet user-secrets set "CloudflareR2:AccessKeyId"     "..."
//   dotnet user-secrets set "CloudflareR2:SecretAccessKey" "..."
//
// In production, set CloudflareR2__AccountId etc. as environment variables or platform secrets.
// ASP.NET Core maps "__" to the ":" configuration separator automatically.

var app = builder.Build();

app.Run();
