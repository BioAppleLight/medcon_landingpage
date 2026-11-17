import { checkGeneratedTexts } from "./guardrails.ts"
import { fallbackPageSpec } from "./fallback.ts"
import type { ModelProposal } from "./schemas.ts"
import { normalizeForMatching, sanitizeText } from "./text.ts"
import type { ConsultationRequirements, PageCta, PageSpec, RequirementField } from "./types.ts"

/**
 * Turns a schema-valid page spec from the model into one that is safe to save:
 *  - every string is re-sanitized and length-bounded;
 *  - "What you told us" tags must point at a requirement the visitor actually gave, and must
 *    restate it — a tag the record cannot support is replaced with the record's own words;
 *  - all text passes the same output checks as chat replies.
 */

const STOPWORDS = new Set(["with", "from", "that", "this", "your", "their", "into", "they", "them", "have", "will", "able", "more", "less", "for", "and", "the"])

function significantWords(text: string): Set<string> {
  return new Set(
    normalizeForMatching(text)
      .split(" ")
      .filter((word) => word.length >= 4 && !STOPWORDS.has(word))
      .map((word) => word.replace(/(ing|ed|es|s)$/, "")),
  )
}

function supports(recordValue: string, label: string): boolean {
  const recordWords = significantWords(recordValue)
  for (const word of significantWords(label)) if (recordWords.has(word)) return true
  return false
}

function cta(value: PageCta): PageCta {
  return { label: sanitizeText(value.label, 32), action: value.action }
}

export interface FinalizedSpec {
  spec: PageSpec
  violations: string[]
}

export function finalizePageSpec(
  raw: PageSpec,
  requirements: ConsultationRequirements,
  userText: string,
): FinalizedSpec {
  const usable = (field: RequirementField) => {
    const entry = requirements.fields[field]
    return entry && entry.status !== "unresolved" ? entry : null
  }

  const seen = new Set<RequirementField>()
  const tags: PageSpec["told"]["tags"] = []
  for (const tag of raw.told.tags) {
    const entry = usable(tag.field)
    if (!entry || seen.has(tag.field)) continue
    seen.add(tag.field)
    const label = sanitizeText(tag.label, 48)
    tags.push({ field: tag.field, label: label && supports(entry.value, label) ? label : sanitizeText(entry.value, 40) })
  }
  const finalTags = tags.length > 0 ? tags : fallbackPageSpec(requirements, null).told.tags

  const highlight =
    raw.told.highlight_field !== "none" && finalTags.some((tag) => tag.field === raw.told.highlight_field)
      ? raw.told.highlight_field
      : "none"

  const spec: PageSpec = {
    hero: {
      headline: sanitizeText(raw.hero.headline, 120),
      description: sanitizeText(raw.hero.description, 360),
      image: raw.hero.image,
      primary_cta: cta(raw.hero.primary_cta),
      secondary_cta: cta(raw.hero.secondary_cta),
    },
    told: {
      eyebrow: sanitizeText(raw.told.eyebrow, 70),
      headline: sanitizeText(raw.told.headline, 160),
      summary: sanitizeText(raw.told.summary, 300),
      tags: finalTags,
      highlight_field: highlight,
    },
    details: raw.details.slice(0, 3).map((column) => ({
      eyebrow: sanitizeText(column.eyebrow, 40),
      items: column.items.slice(0, 2).map((item) => ({
        title: sanitizeText(item.title, 70),
        body: sanitizeText(item.body, 420),
      })),
    })),
    cta: {
      theme: sanitizeText(raw.cta.theme, 56),
      body: sanitizeText(raw.cta.body, 360),
      primary: cta(raw.cta.primary),
      secondary: cta(raw.cta.secondary),
    },
  }

  const texts = [
    spec.hero.headline,
    spec.hero.description,
    spec.told.eyebrow,
    spec.told.headline,
    spec.told.summary,
    ...spec.details.flatMap((column) => [column.eyebrow, ...column.items.flatMap((item) => [item.title, item.body])]),
    spec.cta.theme,
    spec.cta.body,
  ]
  const violations = checkGeneratedTexts(texts, { userText })
  if (texts.some((text) => !text)) violations.push("empty_text")

  return { spec, violations }
}

export function proposalTexts(proposal: ModelProposal): string[] {
  return [
    proposal.title,
    proposal.summary,
    proposal.human_oversight,
    ...proposal.components,
    ...proposal.open_questions,
    ...proposal.assumptions,
    ...proposal.offerings.map((offering) => offering.note),
  ]
}
