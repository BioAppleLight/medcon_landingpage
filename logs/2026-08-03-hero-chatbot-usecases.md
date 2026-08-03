# Hero chatbot → personalized Use Case pages

## Request
Turn the existing hero inquiry bar on the About page into a real chatbot that infers intent (Healthcare / Education / Government + goal) and generates a real page under `/use-cases/...`, styled like existing use-case pages, every time someone answers enough questions.

## Approved plan
See [plans/2026-08-03-hero-chatbot-usecases.md](../plans/2026-08-03-hero-chatbot-usecases.md). Key decisions confirmed with user before implementation:
- Rule-based (keyword) intent detection — no LLM API key available/wanted.
- Hosting assumed serverless (Vercel-style) — no server persistence, so generated pages are derived entirely from a base64url-encoded slug (`custom-<industry+goal>`), not written to disk or a database.

## Files changed
- `lib/use-cases.ts` — added explicit `UseCase`/`UseCaseId` types (replacing `as const` inference), `encodeCustomUseCase`, `buildPersonalizedUseCase`, and extended `getUseCase` to decode `custom-*` slugs on demand.
- `lib/chat-intent.ts` (new) — rule-based decision engine: industry keyword classifier, context carry-over from conversation history, goal-substantiveness check, decision object matching the CLAUDE.md schema.
- `app/api/chat/route.ts` (new) — `POST /api/chat`: validates message/history/conversation_id, caps sizes (2000 chars/message, 20-turn history), returns the CLAUDE.md response contract plus a `page` field when a page was generated.
- `components/hero-chat.tsx` (new) — chat UI: message thread, loading state, error state, and a generated-page CTA button, styled to match the existing hero card.
- `components/hero.tsx` — swapped the old single-shot inquiry `<form>` (which just opened the demo link) for `<HeroChat />`; removed the now-dead placeholder-typing effect and unused `SendHorizontal` import.

## Tests / checks run
- `npx tsc --noEmit` — clean (one stale `.next` cache error was resolved by clearing `.next`, unrelated to source).
- ESLint is not installed in this repo (`eslint` script exists in package.json but the binary is absent) — pre-existing gap, not something this change introduced or could run.
- Manual scenario matrix against `/api/chat` on a local dev server:
  - Clear intent ("I run a hospital…recovery") → generates a Healthcare page.
  - Ambiguous intent ("I want an AI assistant") → asks which industry.
  - Industry-only, no goal ("education") → asks a follow-up for the goal instead of generating prematurely.
  - Follow-up reusing industry from conversation history ("help students study for finals" after "education") → generates an Education page.
  - Missing `message` field → 400 `INVALID_REQUEST`.
  - Malformed JSON body → 400 `INVALID_REQUEST`.
  - Oversized message (3000 chars) → 400 `INVALID_REQUEST`.
- Rendered the generated `/use-cases/custom-...` page: 200 OK, personalized headline/summary, extra "Your request" section, same layout/CTAs as `/use-cases/healthcare`.
- Invalid custom slug (`/use-cases/custom-garbage`) → 404, as expected.
- Confirmed `/about` still renders the chat card.

## Deviations from plan
- Added a word-count check (≥3 words) on top of the character-length check for "is this goal substantive" — caught during testing that a single word like "education" would otherwise satisfy the length check and skip straight to page generation instead of asking what the visitor actually wants.
- Added the bare industry names ("education", "healthcare") to their own keyword lists — they were missing, causing the classifier to treat a message that was just the industry name as unrecognized.
- Minor grammar fix ("a Healthcare page" vs. "an Education page").

## Result
Working end to end: the About page hero chat infers industry + goal, asks one clarifying question when needed, and returns a real link to a personalized `/use-cases/custom-...` page matching the existing use-case design.

## Known limitations
- Classification is keyword-based, not semantic — phrasing that avoids all industry-related keywords will be treated as ambiguous even if a human would find it obvious.
- No distributed rate limiting (would require an external store/service, out of scope per the "no new infra" decision); only per-request input-size caps are enforced.
- Generated pages are not indexed/listed anywhere (not added to sitemap or the `/#use-cases` tab list) — they're only reachable via the link the chatbot returns. If discoverability is wanted, that's a follow-up decision, not assumed here.
- Personalized copy is templated (industry base content + inserted goal text), not freely generated prose, per the rule-based-only decision.
