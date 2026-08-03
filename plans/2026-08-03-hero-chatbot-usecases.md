# Hero chatbot → personalized Use Case pages

## Goal
Turn the existing hero inquiry field on the About page ([components/hero.tsx](../components/hero.tsx)) into a real chat interface that infers the visitor's industry (Healthcare / Education / Government) and need, asks one clarifying question when uncertain, and generates a real, navigable page under `/use-cases/...` personalized to what they said — styled like the existing use-case detail page.

## Assumptions (confirmed with user)
- No LLM API key available/wanted → intent detection is rule-based keyword matching, not a model call.
- Site runs on Vercel-style serverless hosting → no persistent server filesystem, no database. Personalized page content is therefore derived entirely from the URL (base64url-encoded industry + goal in the slug), not written to disk. This makes generated pages stateless, shareable, and compatible with Next.js's on-demand rendering for dynamic-route params not covered by `generateStaticParams` (`dynamicParams` defaults to `true`, confirmed no `output: "export"` in `next.config.mjs`).

## Files likely to change
- `lib/use-cases.ts` — drop `as const` rigidity, add explicit `UseCase` type, add `encodeCustomUseCase`, `buildPersonalizedUseCase`, extend `getUseCase` to decode `custom-*` slugs.
- `lib/chat-intent.ts` (new) — rule-based decision engine matching the CLAUDE.md decision schema.
- `app/api/chat/route.ts` (new) — `POST /api/chat`, validates input, calls the decision engine, returns the CLAUDE.md response contract.
- `components/hero-chat.tsx` (new) — chat UI (message thread, input, loading state, generated-page CTA).
- `components/hero.tsx` — swap the single `<form>` inquiry bar for `<HeroChat />`.
- `app/use-cases/[slug]/page.tsx` — no logic changes expected; verify it renders custom slugs correctly since `getUseCase` now handles them.

## Ordered implementation steps
1. Refactor `lib/use-cases.ts` types + add encode/decode/personalize helpers.
2. Add `lib/chat-intent.ts` rule-based classifier + decision builder.
3. Add `app/api/chat/route.ts` with input validation and error handling.
4. Build `components/hero-chat.tsx` and wire into `hero.tsx`.
5. Manually verify: clear intent, ambiguous intent, follow-up context, missing info, malformed request, generated page renders and matches design.

## Validation method
- `npm run lint` / `npx tsc --noEmit` for type safety.
- `npm run dev` and exercise the chat via curl against `/api/chat` for the scenario matrix in CLAUDE.md §15 (clear intent, ambiguous, follow-up pronoun-style context, missing info, malformed request).
- Visually check a generated `/use-cases/custom-...` page against an existing one (e.g. `/use-cases/healthcare`) for style parity.

## Risks / unresolved decisions
- Rule-based classification is coarser than an LLM — ambiguous phrasing may need one extra clarifying turn. Accepted per user's choice.
- No distributed rate limiting (would require an external store, which is out of scope per the "no new infra" decision). Basic input-size caps are applied instead; documented as a known limitation.
- Generated URLs encode the visitor's raw text (truncated, JSON-escaped) — treated as non-sensitive marketing input, not stored server-side.
