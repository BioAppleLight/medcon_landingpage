/**
 * The consultation contract shared by the service, the storage adapters, the HTTP layer, and
 * the page renderer. Types only.
 */

export const STAGES = [
  "DISCOVERY",
  "REQUIREMENTS",
  "SOLUTION_DESIGN",
  "REVIEW",
  "CONFIRMATION",
  "GENERATION",
  "COMPLETED",
] as const
export type Stage = (typeof STAGES)[number]

export const REQUIREMENT_FIELDS = [
  "industry",
  "organization_type",
  "target_audience",
  "primary_problem",
  "desired_application",
  "ai_capabilities",
  "interaction_modes",
  "knowledge_sources",
  "integrations",
  "communication_style",
  "expected_outcomes",
  "operational_constraints",
  "privacy_security",
  "human_escalation",
  "budget",
  "timeline",
] as const
export type RequirementField = (typeof REQUIREMENT_FIELDS)[number]

/**
 * confirmed  — the visitor stated it or explicitly agreed to it.
 * inferred   — reasonably implied by what the visitor said, not stated outright.
 * proposed   — suggested by the consultant; needs the visitor's agreement.
 * unresolved — known to matter, but not yet answered.
 */
export const REQUIREMENT_STATUSES = ["confirmed", "inferred", "proposed", "unresolved"] as const
export type RequirementStatus = (typeof REQUIREMENT_STATUSES)[number]

export interface RequirementEntry {
  value: string
  status: RequirementStatus
  updated_at: string
  /** The user turn that last changed this entry. */
  turn: number
}

export type RequirementRecord = Partial<Record<RequirementField, RequirementEntry>>

export const SOLUTION_TYPES = [
  "ai_expert_avatar",
  "digital_human_presenter",
  "knowledge_agent",
  "simulation_digital_twin",
  "hybrid",
] as const
export type SolutionType = (typeof SOLUTION_TYPES)[number]

export interface ConsultationRequirements {
  fields: RequirementRecord
  /** One of the approved industry ids from `preset-content.ts`, when known. */
  industry_id: string | null
  solution_type: SolutionType | null
  unresolved_questions: string[]
}

export interface RequirementChange {
  at: string
  turn: number
  field: RequirementField
  from: RequirementEntry | null
  to: RequirementEntry | null
}

export type MessageRole = "user" | "assistant"
export type MessageKind = "reply" | "redirect" | "notice"

export interface ConsultationMessage {
  role: MessageRole
  content: string
  at: string
  kind?: MessageKind
}

export const OFFERING_FITS = ["current", "customization", "new_development", "unconfirmed"] as const
export type OfferingFit = (typeof OFFERING_FITS)[number]

export interface ProposalOffering {
  offering_id: string
  fit: OfferingFit
  note: string
}

export interface ProposalContent {
  title: string
  solution_type: SolutionType
  summary: string
  components: string[]
  offerings: ProposalOffering[]
  human_oversight: string
  open_questions: string[]
  assumptions: string[]
}

export type ProposalStatus = "draft" | "confirmed" | "superseded"

export interface Proposal extends ProposalContent {
  version: number
  status: ProposalStatus
  created_at: string
  confirmed_at: string | null
  source: "gemini" | "fallback"
  /** The requirements exactly as they were when this proposal was written. */
  requirements_snapshot: ConsultationRequirements
}

export interface Consultation {
  id: string
  /** Incremented on every save; used to detect concurrent writes. */
  version: number
  owner_hash: string
  created_at: string
  updated_at: string
  stage: Stage
  turn_count: number
  messages: ConsultationMessage[]
  requirements: ConsultationRequirements
  requirement_history: RequirementChange[]
  proposals: Proposal[]
  current_proposal_version: number | null
  confirmed_proposal_version: number | null
  page_id: string | null
  suggestions: string[]
  /** The field the deterministic fallback last asked about, so a bare answer can be filed. */
  pending_field: RequirementField | null
  /** True when the last reply came from the deterministic fallback rather than Gemini. */
  degraded: boolean
  strikes: { off_topic: number; injection: number }
}

/* ------------------------------------------------------------------------------------------
 * Generated page specification — content only, never markup or code.
 * ---------------------------------------------------------------------------------------- */

export const CTA_ACTIONS = [
  "book_demo",
  "watch_demo",
  "view_pricing",
  "explore_product",
  "explore_technology",
  "contact",
  "refine_proposal",
] as const
export type CtaAction = (typeof CTA_ACTIONS)[number]

export const PAGE_IMAGE_KEYS = [
  "healthcare",
  "education",
  "government",
  "guided_chat",
  "qa",
  "assessment",
  "general",
  "presenter",
  "brand",
] as const
export type PageImageKey = (typeof PAGE_IMAGE_KEYS)[number]

export interface PageCta {
  label: string
  action: CtaAction
}

export interface PageSpec {
  hero: {
    headline: string
    description: string
    image: PageImageKey
    primary_cta: PageCta
    secondary_cta: PageCta
  }
  told: {
    eyebrow: string
    headline: string
    summary: string
    /** Each tag must point at a requirement the visitor actually gave. */
    tags: { label: string; field: RequirementField }[]
    highlight_field: RequirementField | "none"
  }
  details: { eyebrow: string; items: { title: string; body: string }[] }[]
  cta: {
    theme: string
    body: string
    primary: PageCta
    secondary: PageCta
  }
}

export type PageRevisionStatus = "draft" | "final"

export interface PageRevision {
  revision: number
  status: PageRevisionStatus
  proposal_version: number | null
  created_at: string
  source: "gemini" | "fallback"
  industry_id: string | null
  industry_label: string
  /** Hash of the requirements the revision was built from, to avoid duplicate drafts. */
  fingerprint: string
  spec: PageSpec
}

export interface GeneratedPageRecord {
  id: string
  consultation_id: string
  owner_hash: string
  created_at: string
  updated_at: string
  /** Hash of the share token, when the owner has created a share link. */
  share_token_hash: string | null
  revisions: PageRevision[]
}

/* ------------------------------------------------------------------------------------------
 * What the browser sees.
 * ---------------------------------------------------------------------------------------- */

export interface PublicRequirement {
  field: RequirementField
  label: string
  value: string
  status: RequirementStatus
}

export interface PublicProposal extends ProposalContent {
  version: number
  status: ProposalStatus
  offerings_detail: (ProposalOffering & { name: string })[]
}

export interface PublicPageRef {
  id: string
  url: string
  label: string
  revision: number
  status: PageRevisionStatus
}

export interface ConsultationView {
  id: string
  stage: Stage
  messages: { role: MessageRole; content: string; kind: MessageKind }[]
  suggestions: string[]
  requirements: PublicRequirement[]
  industry_label: string | null
  progress: { covered: number; total: number; missing: string[] }
  ready_for_review: boolean
  proposal: PublicProposal | null
  page: PublicPageRef | null
  draft_page: PublicPageRef | null
  degraded: boolean
  limits: { max_message_length: number; turns_remaining: number }
}

export type ConsultationErrorCode =
  | "INVALID_REQUEST"
  | "MESSAGE_TOO_LONG"
  | "RATE_LIMITED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BUSY"
  | "FORBIDDEN"
  | "LIMIT_REACHED"
  | "INTERNAL_ERROR"

export class ConsultationError extends Error {
  readonly code: ConsultationErrorCode
  readonly publicMessage: string

  constructor(code: ConsultationErrorCode, publicMessage: string) {
    super(publicMessage)
    this.code = code
    this.publicMessage = publicMessage
  }
}
