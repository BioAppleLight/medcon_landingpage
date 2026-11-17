import { sanitizeText } from "./text.ts"
import type {
  ConsultationRequirements,
  RequirementChange,
  RequirementEntry,
  RequirementField,
  RequirementStatus,
  SolutionType,
} from "./types.ts"
import { REQUIREMENT_FIELDS } from "./types.ts"

/**
 * The structured consultation record and the deterministic rules for changing it. The model
 * proposes updates; this module decides which of them are allowed to land.
 */

export const FIELD_LABELS: Record<RequirementField, string> = {
  industry: "Industry",
  organization_type: "Organization type",
  target_audience: "Target audience",
  primary_problem: "Primary problem",
  desired_application: "Digital twin application",
  ai_capabilities: "AI capabilities",
  interaction_modes: "Interaction modes",
  knowledge_sources: "Knowledge and data sources",
  integrations: "Integrations",
  communication_style: "Communication style",
  expected_outcomes: "Expected outcomes",
  operational_constraints: "Operational constraints",
  privacy_security: "Privacy and security",
  human_escalation: "Human escalation",
  budget: "Budget",
  timeline: "Timeline",
}

/**
 * What must be understood before a proposal can be written. The first four must come from the
 * visitor (confirmed or inferred); the rest may be consultant proposals the visitor reviews.
 */
export const CORE_FIELDS: RequirementField[] = [
  "industry",
  "target_audience",
  "primary_problem",
  "desired_application",
]
export const SUPPORTING_FIELDS: RequirementField[] = [
  "interaction_modes",
  "knowledge_sources",
  "expected_outcomes",
  "human_escalation",
]
export const ESSENTIAL_FIELDS: RequirementField[] = [...CORE_FIELDS, ...SUPPORTING_FIELDS]

export const MAX_VALUE_LENGTH = 300
const MAX_HISTORY = 200
const MAX_UNRESOLVED = 6

export function emptyRequirements(): ConsultationRequirements {
  return { fields: {}, industry_id: null, solution_type: null, unresolved_questions: [] }
}

function isCovered(field: RequirementField, entry: RequirementEntry | undefined): boolean {
  if (!entry || !entry.value) return false
  if (CORE_FIELDS.includes(field)) return entry.status === "confirmed" || entry.status === "inferred"
  return entry.status !== "unresolved"
}

export function missingEssentials(requirements: ConsultationRequirements): RequirementField[] {
  return ESSENTIAL_FIELDS.filter((field) => !isCovered(field, requirements.fields[field]))
}

export function hasDiscoveryBasics(requirements: ConsultationRequirements): boolean {
  const { fields } = requirements
  const knowsIndustry = isCovered("industry", fields.industry) || requirements.industry_id !== null
  const knowsNeed =
    isCovered("primary_problem", fields.primary_problem) ||
    isCovered("desired_application", fields.desired_application)
  return knowsIndustry && knowsNeed
}

export function progressOf(requirements: ConsultationRequirements) {
  const missing = missingEssentials(requirements)
  return {
    covered: ESSENTIAL_FIELDS.length - missing.length,
    total: ESSENTIAL_FIELDS.length,
    missing: missing.map((field) => FIELD_LABELS[field]),
  }
}

export interface ProposedUpdate {
  field: RequirementField
  value: string
  status: RequirementStatus
}

export interface MergeResult {
  requirements: ConsultationRequirements
  changes: RequirementChange[]
  rejected: { field: RequirementField; reason: string }[]
}

const STATUS_RANK: Record<RequirementStatus, number> = {
  unresolved: 0,
  proposed: 1,
  inferred: 2,
  confirmed: 3,
}

/**
 * Applies model-proposed updates under fixed rules:
 *  - values are sanitized and length-bounded;
 *  - a confirmed value can only be replaced by another confirmed value (the visitor changed
 *    their mind) — never silently downgraded to a guess;
 *  - an identical value only ever moves *up* in certainty;
 *  - clearing a confirmed field is refused unless `allowClearConfirmed` (an explicit revision).
 */
export function mergeRequirements(
  current: ConsultationRequirements,
  updates: ProposedUpdate[],
  clears: RequirementField[],
  context: { turn: number; at: string; allowClearConfirmed?: boolean },
): MergeResult {
  const fields = { ...current.fields }
  const changes: RequirementChange[] = []
  const rejected: MergeResult["rejected"] = []

  for (const field of clears) {
    const existing = fields[field]
    if (!existing) continue
    if (existing.status === "confirmed" && !context.allowClearConfirmed) {
      rejected.push({ field, reason: "confirmed values are not cleared implicitly" })
      continue
    }
    delete fields[field]
    changes.push({ at: context.at, turn: context.turn, field, from: existing, to: null })
  }

  const seen = new Set<RequirementField>()
  for (const update of updates) {
    if (!REQUIREMENT_FIELDS.includes(update.field)) continue
    if (seen.has(update.field)) {
      rejected.push({ field: update.field, reason: "duplicate update in one turn" })
      continue
    }
    seen.add(update.field)

    const value = sanitizeText(update.value, MAX_VALUE_LENGTH)
    if (!value) {
      rejected.push({ field: update.field, reason: "empty value" })
      continue
    }

    const existing = fields[update.field]
    if (existing) {
      const sameValue = existing.value.toLowerCase() === value.toLowerCase()
      if (sameValue && STATUS_RANK[update.status] <= STATUS_RANK[existing.status]) continue
      if (!sameValue && existing.status === "confirmed" && update.status !== "confirmed") {
        rejected.push({ field: update.field, reason: "would overwrite a confirmed value with a guess" })
        continue
      }
    }

    const next: RequirementEntry = {
      value,
      status: update.status,
      updated_at: context.at,
      turn: context.turn,
    }
    fields[update.field] = next
    changes.push({ at: context.at, turn: context.turn, field: update.field, from: existing ?? null, to: next })
  }

  return {
    requirements: { ...current, fields },
    changes,
    rejected,
  }
}

export function appendHistory(
  history: RequirementChange[],
  changes: RequirementChange[],
): RequirementChange[] {
  const combined = [...history, ...changes]
  return combined.length > MAX_HISTORY ? combined.slice(combined.length - MAX_HISTORY) : combined
}

export function mergeUnresolved(current: string[], incoming: string[]): string[] {
  const cleaned = incoming.map((question) => sanitizeText(question, 200)).filter(Boolean)
  const merged = [...cleaned, ...current.filter((question) => !cleaned.includes(question))]
  return merged.slice(0, MAX_UNRESOLVED)
}

export function setSolutionType(
  requirements: ConsultationRequirements,
  solutionType: SolutionType | "undecided",
): ConsultationRequirements {
  if (solutionType === "undecided") return requirements
  return { ...requirements, solution_type: solutionType }
}

/** A compact, model-facing view of the record. */
export function requirementsForPrompt(requirements: ConsultationRequirements) {
  return {
    industry_id: requirements.industry_id,
    solution_type: requirements.solution_type,
    fields: Object.fromEntries(
      Object.entries(requirements.fields).map(([field, entry]) => [
        field,
        { value: entry.value, status: entry.status },
      ]),
    ),
    missing_essentials: missingEssentials(requirements),
    unresolved_questions: requirements.unresolved_questions,
  }
}
