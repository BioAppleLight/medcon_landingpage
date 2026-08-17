# Cloudflare R2 / CDN Video Migration — Integration Package

Everything needed to move the three large videos out of `medcon_landingpage` and serve them from
Cloudflare R2 behind a CDN domain, plus the ASP.NET backend upload path for future videos.

The frontend half is **already written, type-checked, tested, and built** — it exists as three git
commits you apply as patches (see [Part B](#part-b--frontend)). The third commit adds the plan and
implementation log under the repo's existing `plans/` and `logs/` convention.

`patches/` is the only thing that targets this repo — `lib/cdn.ts`, the tests, the upload script
and `.env.example` are all inside those commits, so there are no loose copies to keep in sync.
`backend/` and `cloudflare/` are for the ASP.NET repo and the Cloudflare dashboard respectively.

---

## Contents

```text
├── README.md                          ← you are here
│
├── patches/                           → BioAppleLight/medcon_landingpage
│   ├── 0001-feat-add-configurable-CDN-asset-helper.patch
│   ├── 0002-feat-serve-demo-videos-from-Cloudflare-CDN.patch
│   ├── 0003-docs-record-CDN-video-migration-plan-and-log.patch
│   └── all-changes.diff               ← same three commits as one plain diff
│
├── backend/                           → your ASP.NET repo (api-retail-e-commerce pattern)
│   ├── Base/CloudflareR2Options.cs
│   ├── Base/ICloudflareR2Service.cs
│   ├── Base/CloudflareR2Service.cs
│   ├── Controllers/UploadController.cs
│   ├── Models/UploadModels.cs         ← only if your repo lacks these types
│   ├── Program.snippet.cs             ← blocks to merge into your Program.cs
│   ├── appsettings.sample.json
│   └── .env.example
│
└── cloudflare/
    └── cors.json                      ← bucket CORS policy
```

---

## Status of the work

| Piece | State |
|---|---|
| `lib/cdn.ts` + `videoAssets` | Written, 6 unit tests passing |
| All 3 video references switched to CDN | Done — education, government, rehab |
| `npm run build` with CDN URL set | Passing, 15/15 static pages, no stale `public/` mp4 paths in output |
| `npx tsc --noEmit` | 0 errors |
| Migration + verification script | Written (needs your R2 credentials to run) |
| Backend R2 service + upload endpoint | Written — **not compiled**, no ASP.NET repo in this session |
| Videos uploaded to R2 | **Not done** — needs your Cloudflare account |
| Local MP4s deleted from `public/` | **Deliberately not done** — see [Part E](#part-e--cleanup) |

> **Why the branch wasn't pushed.** This session has read-only GitHub access; both `git push` and
> the GitHub API returned `403 Resource not accessible by integration`. The three commits are
> complete and are included here as patches — applying them gives you the identical history.

---

## The one thing to decide first

Pick your CDN hostname. Everything below assumes:

```text
https://assets.myos.ai
```

If you use something else (`cdn.myos.ai`, etc.), substitute it everywhere — it appears in
`.env.example`, `appsettings.sample.json`, the backend `.env.example`, and `cloudflare/cors.json`.

---

## Part A — Cloudflare setup

Do this first. Nothing else works without it.

1. **Create the bucket.** Cloudflare dashboard → R2 → Create bucket → `myos-assets`.
   Location hint: nearest your primary audience.

2. **Attach the custom domain.** Bucket → Settings → Public access → Custom Domains → Connect
   Domain → `assets.myos.ai`. Cloudflare creates the DNS record and provisions TLS. Use this, not
   the temporary `*.r2.dev` endpoint — the r2.dev endpoint is rate-limited and gives you no cache
   or WAF control.

3. **Verify the domain answers** before uploading anything:

   ```bash
   curl -I https://assets.myos.ai/
   ```

   A `404` here is fine and expected — it means DNS and TLS work. A DNS failure or a certificate
   error means step 2 is not finished; wait for provisioning.

4. **Create an API token.** R2 → Manage API Tokens → Create token → permission **Object Read &
   Write**, scoped to `myos-assets`. Save the Access Key ID and Secret Access Key — the secret is
   shown once. You also need your Account ID from the R2 overview page.

5. **CORS.** Bucket → Settings → CORS policy → paste `cloudflare/cors.json` and edit the origins to
   your real domains. The first rule covers video playback (`Range` header is what makes seeking
   work); the second only matters if you adopt presigned browser uploads later — delete it
   otherwise.

6. **Cache rule (optional but recommended).** A rule matching `assets.myos.ai/videos/*` with edge
   TTL of a year is safe, because the migration script sets
   `Cache-Control: public, max-age=31536000, immutable` and the convention is to version by rename
   (`rehab.mp4` → `rehab-v2.mp4`), never to overwrite an existing key.

---

## Part B — Frontend

### B1. Apply the patches

From the root of your `medcon_landingpage` checkout:

```bash
git checkout main
git pull
git checkout -b feature/cloudflare-cdn-media

git am /path/to/package/patches/000*.patch

chmod +x scripts/migrate-videos-to-r2.sh   # git am preserves this, but verify
```

Prefer a single squashed change? Use the plain diff instead:

```bash
git apply /path/to/package/patches/all-changes.diff
```

The patches apply cleanly on top of `ef96a1b` ("Add weighted chatbot keyword classification"). If
`main` has moved since, `git am -3` will three-way merge them.

### B2. What the patches change

**New — `lib/cdn.ts`:**

```ts
const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL?.replace(/\/+$/, "") ?? ""

export function cdn(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  if (!CDN_BASE_URL) return normalizedPath
  return `${CDN_BASE_URL}${normalizedPath}`
}

export const videoAssets = {
  rehab: cdn("/videos/rehab.mp4"),
  educationDemo: cdn("/videos/education-demo.mp4"),
  governmentDemo: cdn("/videos/government-demo.mp4"),
} as const
```

`videoAssets` is a small addition beyond the guide's spec. The guide only covers
`lib/use-cases.ts`, but **three** files in this repo hardcode video paths, and a shared map keeps
them from drifting and makes a future re-encode a one-line change:

| File | Was | Now |
|---|---|---|
| `lib/use-cases.ts` | `"/demos/education-demo.mp4"` | `videoAssets.educationDemo` |
| `components/government-question-prompts.tsx` | `"/demos/government-demo.mp4"` | `videoAssets.governmentDemo` |
| `components/human-delivery.tsx` | `"/Rehab.mp4"` | `videoAssets.rehab` |

The `<video>` elements themselves are unchanged, exactly as the guide predicts — the browser does
not care whether `src` is a path or an absolute URL.

**Also changed:** `.gitignore` gains `public/**/*.{mp4,mov,webm}`, `.DS_Store`, and a
`!.env.example` exception (the existing `.env*` rule would otherwise swallow the new example file).

**Poster images stay local.** The guide lists moving them as an optional later step (§16), and
they are small. `lib/cdn.ts` is ready for it — wrap the paths in `cdn()` when you want it.

### B3. Environment variable

Local development:

```bash
cp .env.example .env.local
# .env.local
NEXT_PUBLIC_CDN_BASE_URL=https://assets.myos.ai
```

Production (Vercel or wherever you deploy): add `NEXT_PUBLIC_CDN_BASE_URL=https://assets.myos.ai`
to the project's environment variables for Production **and** Preview.

If the variable is absent, `cdn()` returns the bare path — so a checkout with no CDN config still
resolves against `public/`. That fallback is a convenience for local work, not a production
strategy: **production must always have the variable set**, or it will 404 on paths like
`/videos/rehab.mp4` that never existed under `public/`.

> Never put R2 credentials in a `NEXT_PUBLIC_*` variable. That prefix means "compile this into
> browser JavaScript."

---

## Part C — Upload the existing videos

This is a one-time migration. These three files keep stable names and do **not** go through the
CMS upload endpoint, which mints dated `uploads/videos/...` keys.

```bash
export R2_ACCOUNT_ID=...
export R2_ACCESS_KEY_ID=...
export R2_SECRET_ACCESS_KEY=...
export R2_BUCKET=myos-assets
export CDN_BASE_URL=https://assets.myos.ai

./scripts/migrate-videos-to-r2.sh
```

Requires AWS CLI v2 (R2 speaks S3). The script uploads:

```text
public/Rehab.mp4                  → videos/rehab.mp4          (31 MB)
public/demos/education-demo.mp4   → videos/education-demo.mp4 (71 MB)
public/demos/government-demo.mp4  → videos/government-demo.mp4 (33 MB)
```

then verifies each public URL on three axes and refuses to report success unless all pass:

- `HEAD` returns **200**
- a ranged `GET` returns **206** — this is what makes video scrubbing work; without it the
  browser must download the whole file to seek
- `Content-Type` is `video/mp4` — a wrong type here is the most common cause of "the video
  element shows a black box"

Re-verify later without re-uploading:

```bash
./scripts/migrate-videos-to-r2.sh --verify
```

**Do not proceed to deploy until this prints `all videos verified`.**

---

## Part D — Backend (ASP.NET)

For future uploads through your admin/CMS. Independent of Parts A–C — the site works without it.

### D1. Install the SDK

```bash
dotnet add package AWSSDK.S3
```

Use **3.7.400 or newer** (or 4.x). `CloudflareR2Service` sets
`RequestChecksumCalculation = WHEN_REQUIRED`, which suppresses the flexible-checksum trailers that
R2 rejects on streaming uploads. Those two properties don't exist on older SDKs — if you're pinned
to one, delete the two lines (older SDKs don't send the trailers at all).

### D2. Copy the files

```text
backend/Base/CloudflareR2Options.cs      → Base/
backend/Base/ICloudflareR2Service.cs     → Base/
backend/Base/CloudflareR2Service.cs      → Base/
backend/Controllers/UploadController.cs  → Controllers/   ← merge, see below
backend/Models/UploadModels.cs           → Models/        ← only if missing
```

Change the `namespace Api.*` declarations to match your project.

**`UploadController.cs` is a merge, not a replacement.** Your repo already has an
`UploadController` with image endpoints. Copy these members into it:

- `ALLOWED_VIDEO_MIME_TYPES`, `MIME_TO_EXTENSION`, `MAX_VIDEO_SIZE`
- `Video()` — the `POST /api/upload/video` action
- `LooksLikeVideoAsync()` and `Fail()` helpers
- `VideoUploadUrl()` + `VideoUploadUrlRequest` — optional, see D5

`Models/UploadModels.cs` defines `ResultID`, `FileDetailCMS`, and `UploadFileResponceCMS`. Your
repo already has these — delete that file and keep yours.

### D3. Register in `Program.cs`

From `Program.snippet.cs`:

```csharp
builder.Services.Configure<CloudflareR2Options>(
    builder.Configuration.GetSection("CloudflareR2"));

builder.Services.AddScoped<ICloudflareR2Service, CloudflareR2Service>();
```

**Also raise the request size limits.** This is not in the guide but the endpoint will not work
without it: ASP.NET's default multipart limit is ~128 MB and Kestrel's default request body limit
is 30 MB, so a 250 MB video is rejected before your controller code runs.

```csharp
const long MAX_UPLOAD_BYTES = 250L * 1024L * 1024L;

builder.Services.Configure<FormOptions>(o => o.MultipartBodyLengthLimit = MAX_UPLOAD_BYTES);
builder.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = MAX_UPLOAD_BYTES);
```

Behind IIS add `IISServerOptions.MaxRequestBodySize` and `web.config`'s `maxAllowedContentLength`;
behind Nginx set `client_max_body_size 250m`.

### D4. Configuration

Merge the `CloudflareR2` section from `appsettings.sample.json` into your `appsettings.json` —
**with every secret left empty**. Real values come from environment (`backend/.env.example`):

```bash
CloudflareR2__AccountId=...
CloudflareR2__AccessKeyId=...
CloudflareR2__SecretAccessKey=...
CloudflareR2__BucketName=myos-assets
CloudflareR2__PublicBaseUrl=https://assets.myos.ai
```

Locally, prefer user secrets: `dotnet user-secrets set "CloudflareR2:AccountId" "..."`.

`CloudflareR2Service` validates all five at construction and throws naming the missing field — you
find out at startup, not with a confusing 403 mid-upload.

### D5. What the endpoint does

`POST /api/upload/video`, `multipart/form-data`, `[Authorize]`. Per upload it checks:

1. size ≤ 250 MB
2. MIME type in `{video/mp4, video/webm, video/quicktime}`
3. extension present and **matching the MIME type** (`video/mp4` ⇒ `.mp4`)
4. container magic bytes — MP4/MOV `ftyp` box at offset 4, WebM EBML `1A 45 DF A3`

Step 4 goes beyond the guide's minimum, which the guide itself recommends (§20): steps 2 and 3 both
trust strings the client sent, so on their own they stop an accident, not an attacker.

The stored key is generated, never the client's filename:

```text
uploads/videos/2026/08/15/18dd5c81f18f45eb8e4c4d59d2268bed.mp4
```

Response:

```json
{
  "ID": 1,
  "Message": "Success",
  "Data": [{
    "FileUrl": "https://assets.myos.ai/uploads/videos/2026/08/15/18dd5c81.mp4",
    "FileName": "18dd5c81.mp4",
    "Length": 74149185,
    "FileType": "video/mp4"
  }]
}
```

Error `Message` values: `VIDEO_TOO_LARGE`, `VIDEO_TYPE_NOT_ALLOWED`, `INVALID_FILE_EXTENSION`,
`EXTENSION_MIME_MISMATCH`, `VIDEO_CONTENT_NOT_RECOGNIZED`.

Uploads go through `TransferUtility`, which switches to multipart above 8 MiB — so a 250 MB video
is never buffered whole in memory.

**Optional: presigned direct upload.** `POST /api/upload/video-url` returns a 15-minute PUT URL the
browser uploads to directly, keeping video bytes off your API entirely. The guide lists this as a
later improvement (§21); it's included and ready but nothing depends on it. Enable it when upload
traffic justifies it, and keep it behind the same `[Authorize]` — a presigned URL can't enforce a
size cap or inspect bytes, which is the tradeoff you accept for the scaling win.

---

## Part E — Cleanup

**Deploy Parts A–C first and confirm the videos play in production.** The local MP4s are
deliberately still in `public/`, which is the guide's own rollback plan (§29): the first deploy
changes only where the videos are *served from*. If anything is wrong, revert
`NEXT_PUBLIC_CDN_BASE_URL` (or the patch) and the site falls back to files that still exist.

After a few days of confirmed playback:

```bash
git rm public/Rehab.mp4 public/demos/education-demo.mp4 public/demos/government-demo.mp4
git commit -m "chore: remove large local demo videos"
```

That reclaims ~135 MB from the working tree. The `.gitignore` rules from patch 0001 stop them from
being recommitted.

**This does not shrink the repository.** The blobs stay in history and every clone still pays for
them. Shrinking requires `git filter-repo` and a force-push that rewrites every collaborator's
history — a separate, coordinated operation, worth doing only if clone size becomes a real problem.

---

## Verification checklist

**Cloudflare** — `assets.myos.ai` resolves with valid TLS · all 3 URLs return 200 · ranged request
returns 206 · `Content-Type: video/mp4` · CORS origins are your real domains

**Frontend** — `npm test` passes · `npx tsc --noEmit` clean · `npm run build` succeeds ·
`NEXT_PUBLIC_CDN_BASE_URL` set in production *and* preview · devtools Network shows the three
videos loading from `assets.myos.ai` · posters render · scrubbing forward and backward works ·
mobile Safari plays · no mixed-content, CORS, 404, or 403 errors

**Backend** — valid MP4 uploads and returns a CDN URL · oversized file rejected with
`VIDEO_TOO_LARGE` · `.mp4` renamed from `.txt` rejected · renamed non-video rejected with
`VIDEO_CONTENT_NOT_RECOGNIZED` · object visible in the R2 dashboard · no credentials in logs or in
any committed file

---

## Order of operations

```text
A. Cloudflare bucket + domain + token          ← blocks everything
        ↓
C. Run migration script, verify 3 URLs         ← blocks the deploy
        ↓
B. Apply patches, set env var, deploy          ← site now served from CDN
        ↓
E. Delete local MP4s (after days, not hours)
        ↓
D. Backend upload endpoint                     ← independent, do whenever
```

---

## Security

Committed files in this package contain **no credentials** — every secret field is empty. Before
your first commit, confirm no real value landed in `appsettings.json` or `.env.local`.

If an R2 key has ever been committed or pasted anywhere public, deleting the line is not enough:
revoke the token in the Cloudflare dashboard, issue a new one, update the deployment environment,
and treat the old key as compromised regardless of what the current source says.
