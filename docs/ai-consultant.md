# AI Digital Twin Consultant

The chat on `/about` (hero widget) and `/chat` (full-screen view) is a Gemini-powered
consultant. It helps visitors shape an AI digital twin idea, keeps a structured record of
their requirements, and, after the visitor explicitly confirms, generates a private,
personalized use-case page at `/use-cases/p-<id>`. Both chat surfaces share one backend and
one consultation, so a visitor can switch between them.

## Setup

1. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`.
2. For production, add Upstash Redis (Vercel → Storage/Marketplace → Upstash for Redis) and
   set `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` (or the injected `KV_REST_API_*`).
   Without Redis, production falls back to in-memory storage, which is lost on cold starts.
   A warning is logged when that happens.
3. Pin `GEMINI_MODEL` to a specific model id once you have validated one.

Without a key, the consultant runs a deterministic "simplified mode" built on the original
keyword classifier and question tree. It does the same if Gemini fails after its retries.

## Architecture

| Module (`lib/consultation/`) | Responsibility |
| --- | --- |
| `http.ts` | `/api/chat`: origin check, body limits, cookies, SSE, error mapping; dispatches legacy requests (no `action`) to `lib/chat-legacy-handler.ts` |
| `service.ts` | Consultation management: authorize → rate-limit → lock → screen → model → validate → apply rules → persist |
| `state-machine.ts` | `DISCOVERY → REQUIREMENTS → SOLUTION_DESIGN → REVIEW → CONFIRMATION → GENERATION → COMPLETED`; decided only by code |
| `requirements.ts` | Requirement record (confirmed / inferred / proposed / unresolved), merge rules, readiness |
| `knowledge.ts` | Structured catalog of MYO'S offerings and capabilities, sourced from site content |
| `guardrails.ts` | Input screening, relevance decision, output validation, typed-confirmation matching |
| `prompts.ts`, `schemas.ts` | Prompts; zod schemas that validate every model output and generate Gemini's JSON schema |
| `model.ts`, `gemini-client.ts` | Provider interface, retries, error typing; the only file that imports `@google/genai` |
| `fallback.ts`, `page-spec.ts` | Deterministic consultant; validation of generated page content |
| `store.ts`, `auth.ts`, `runtime.ts` | Redis/file/memory storage, anonymous ownership, env wiring |

Page rendering: `lib/use-cases.ts` reduces legacy `?brief=c-…` briefs and generated specs to one
`PersonalizedPageContent` shape, which `app/use-cases/[slug]/page.tsx` renders with the existing
four-section design. Generated content is data only. Links come from a fixed action map, and
images come from the approved image library.

### API (`POST /api/chat`, JSON)

`{ "action": "start" | "message" | "confirm" | "preview" | "revise" | "reset" | "share", "message"?, "proposal_version"?, "page_id"? }`
→ `{ "consultation": ConsultationView, "share_url"? }`. Send `Accept: text/event-stream` with
`message` to stream: events `delta`, `reset` and `final` (authoritative view), plus `error`.
`GET /api/chat` returns the current consultation. Bodies without `action` use the original
rule-based protocol, which is unchanged.

## Security model

- Gemini is called only from the server, and the key is never exposed to the browser.
- Each browser has a random 256-bit owner token in an HttpOnly, SameSite=Lax cookie (Secure in
  production). Only its SHA-256 hash is stored. Consultations and pages are readable only by
  the owner, or through a share link whose token the owner can rotate. Anything else returns 404.
- Generated pages are always `noindex, nofollow` and send no referrer. Publishing for search is
  not implemented.
- The server, not the model, decides scope, state transitions, readiness, persistence and
  generation. A page is generated only after the visitor confirms a specific proposal version,
  either with the button or a strictly matched typed confirmation. Generation is idempotent
  per proposal version.
- Every model output is schema-validated and checked for URLs, markup, prices, statistics,
  guarantees, diagnoses, claims of replacing professionals, invented case studies, and leaked
  configuration. A failure triggers a bounded retry, then the deterministic fallback.
- Logs record event names and error kinds only, never visitor text, ids or tokens.

Moving to accounts later: add a user owner alongside the anonymous hash, and on sign-in re-key
records whose owner hash matches the visitor's current token.

## Testing

`npm test` runs `tests/consultation.test.ts` with a scripted model client, so no network or
key is needed. To exercise the real SDK against a mock, point `GEMINI_API_BASE_URL` at a
server that implements `models/<model>:generateContent` and `:streamGenerateContent?alt=sse`.
