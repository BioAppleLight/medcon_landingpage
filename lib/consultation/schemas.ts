import { z } from "zod"
import { INDUSTRY_IDS, OFFERING_IDS } from "./knowledge.ts"
import {
  CTA_ACTIONS,
  OFFERING_FITS,
  PAGE_IMAGE_KEYS,
  REQUIREMENT_FIELDS,
  REQUIREMENT_STATUSES,
  SOLUTION_TYPES,
} from "./types.ts"

/**
 * Runtime schemas for everything the model returns. The same definitions produce the JSON
 * schema Gemini is asked to follow (`toModelJsonSchema`) and validate what actually comes back
 * — the model's compliance with its schema is never taken on trust.
 */

const field = z.enum(REQUIREMENT_FIELDS)
const text = (max: number) => z.string().max(max)

export const relevanceSchema = z.object({
  category: z.enum(["in_scope", "off_topic", "injection_attempt", "clinical_advice", "unsafe"]),
  confidence: z.number().min(0).max(1),
})
export type RelevanceResult = z.infer<typeof relevanceSchema>

export const turnSchema = z.object({
  reply: text(1_400).min(1),
  scope: z.enum(["in_scope", "off_topic", "clinical_advice", "injection_attempt"]),
  user_intent: z.enum([
    "share_requirements",
    "ask_about_offerings",
    "request_summary",
    "request_preview",
    "revise",
    "other",
  ]),
  updates: z
    .array(
      z.object({
        field,
        value: text(400).min(1),
        status: z.enum(REQUIREMENT_STATUSES),
      }),
    )
    .max(12),
  clear_fields: z.array(field).max(6),
  industry_id: z.enum(["unknown", ...INDUSTRY_IDS]),
  solution_type: z.enum([...SOLUTION_TYPES, "undecided"]),
  unresolved_questions: z.array(text(200)).max(6),
  suggestions: z.array(text(80)).max(4),
  ready_for_review: z.boolean(),
})
export type ModelTurn = z.infer<typeof turnSchema>

export const proposalSchema = z.object({
  title: text(110).min(3),
  solution_type: z.enum(SOLUTION_TYPES),
  summary: text(800).min(20),
  components: z.array(text(180)).min(1).max(6),
  offerings: z
    .array(
      z.object({
        offering_id: z.enum(OFFERING_IDS as [string, ...string[]]),
        fit: z.enum(OFFERING_FITS),
        note: text(240),
      }),
    )
    .min(1)
    .max(6),
  human_oversight: text(400).min(5),
  open_questions: z.array(text(220)).max(6),
  assumptions: z.array(text(220)).max(6),
})
export type ModelProposal = z.infer<typeof proposalSchema>

const cta = z.object({ label: text(32).min(2), action: z.enum(CTA_ACTIONS) })

export const pageSpecSchema = z.object({
  hero: z.object({
    headline: text(120).min(8),
    description: text(360).min(20),
    image: z.enum(PAGE_IMAGE_KEYS),
    primary_cta: cta,
    secondary_cta: cta,
  }),
  told: z.object({
    eyebrow: text(70).min(2),
    headline: text(160).min(8),
    summary: text(300).min(10),
    tags: z.array(z.object({ label: text(48).min(2), field })).min(1).max(7),
    /** "none" rather than null keeps the model-facing schema free of nullable types. */
    highlight_field: z.enum([...REQUIREMENT_FIELDS, "none"]),
  }),
  details: z
    .array(
      z.object({
        eyebrow: text(40).min(2),
        items: z
          .array(z.object({ title: text(70).min(2), body: text(420).min(10) }))
          .min(1)
          .max(2),
      }),
    )
    .length(3),
  cta: z.object({
    theme: text(56).min(2),
    body: text(360).min(20),
    primary: cta,
    secondary: cta,
  }),
})

/* ------------------------------------------------------------------------------------------
 * JSON schema for the model
 * ---------------------------------------------------------------------------------------- */

const ALLOWED_SCHEMA_KEYS = new Set([
  "type",
  "properties",
  "required",
  "items",
  "enum",
  "description",
  "minItems",
  "maxItems",
  "minimum",
  "maximum",
])

/**
 * Reduces zod's JSON Schema output to the subset Gemini's structured output accepts. Length
 * limits are deliberately dropped from the model-facing schema (they are enforced on the way
 * back in) because over-tight limits there make the model truncate mid-word.
 */
function simplify(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(simplify)
  if (typeof node !== "object" || node === null) return node

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node)) {
    if (!ALLOWED_SCHEMA_KEYS.has(key)) continue
    if (key === "properties" && typeof value === "object" && value !== null) {
      result.properties = Object.fromEntries(
        Object.entries(value).map(([name, child]) => [name, simplify(child)]),
      )
    } else {
      result[key] = simplify(value)
    }
  }

  return result
}

export function toModelJsonSchema(schema: z.ZodType): Record<string, unknown> {
  return simplify(z.toJSONSchema(schema)) as Record<string, unknown>
}
