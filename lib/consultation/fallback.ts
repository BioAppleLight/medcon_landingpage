import { classifyFreeText, classifyPurpose } from "../free-text-classifier.ts"
import { goalContent } from "../preset-content.ts"
import { questionTree } from "../question-tree.ts"
import { industryLabel } from "./knowledge.ts"
import { FIELD_LABELS, missingEssentials, type ProposedUpdate } from "./requirements.ts"
import type { ModelProposal, ModelTurn } from "./schemas.ts"
import { normalizeForMatching, sanitizeText } from "./text.ts"
import type { Consultation, ConsultationRequirements, PageSpec, RequirementField, SolutionType } from "./types.ts"

/**
 * The deterministic consultant. Used when no Gemini key is configured, or when Gemini fails
 * after its retries, so a visitor is never left without an answer. It reuses the original
 * keyword classifier and question-tree vocabulary, asks for the next missing essential, and
 * writes proposals and pages from templates. It never claims to be the AI.
 */

export const DEGRADED_NOTICE =
  "Our AI consultant is temporarily running in a simplified mode, so I'll guide you with a few structured questions."

const ASK_ORDER: RequirementField[] = [
  "industry",
  "primary_problem",
  "target_audience",
  "desired_application",
  "interaction_modes",
  "knowledge_sources",
  "expected_outcomes",
  "human_escalation",
]

function labelsOf(nodeId: string): string[] {
  return questionTree[nodeId]?.choices.map((choice) => choice.label) ?? []
}

function choiceLabel(nodeId: string, id: string | undefined): string | null {
  if (!id) return null
  return questionTree[nodeId]?.choices.find((choice) => choice.id === id)?.label ?? null
}

const QUESTIONS: Record<RequirementField, { text: string; suggestions: () => string[] }> = {
  industry: {
    text: "Which industry or type of organization is this for?",
    suggestions: () => ["Healthcare", "Education", "Government", "Business services"],
  },
  primary_problem: {
    text: "What problem are you trying to solve, or what should the digital twin help people do?",
    suggestions: () => [],
  },
  target_audience: {
    text: "Who will mainly use it?",
    suggestions: () => labelsOf("audience").slice(0, 4),
  },
  desired_application: {
    text: "What should the AI expert primarily help people do?",
    suggestions: () => labelsOf("purpose").slice(0, 4),
  },
  interaction_modes: {
    text: "How should people interact with it?",
    suggestions: () => labelsOf("interaction").slice(0, 4),
  },
  knowledge_sources: {
    text: "What knowledge should it be grounded in?",
    suggestions: () => ["Policies and SOPs", "Course materials", "Clinical guidelines", "Not sure yet"],
  },
  expected_outcomes: {
    text: "What outcome matters most?",
    suggestions: () => labelsOf("outcome").slice(0, 4),
  },
  human_escalation: {
    text: "When should a person step in?",
    suggestions: () => ["Anything outside approved material", "Urgent or sensitive cases", "Not sure yet"],
  },
  organization_type: { text: "What type of organization are you?", suggestions: () => [] },
  ai_capabilities: { text: "Which AI capabilities matter most?", suggestions: () => [] },
  integrations: { text: "Which systems should it connect to?", suggestions: () => [] },
  communication_style: { text: "How should it sound?", suggestions: () => labelsOf("tone").slice(0, 4) },
  operational_constraints: { text: "Any operational constraints?", suggestions: () => [] },
  privacy_security: { text: "Any privacy or security requirements?", suggestions: () => [] },
  budget: { text: "Do you have a budget range in mind?", suggestions: () => [] },
  timeline: { text: "What timeline are you working towards?", suggestions: () => [] },
}

/** Defaults offered (as proposals, never as the visitor's words) when they are unsure. */
const PROPOSED_DEFAULTS: Partial<Record<RequirementField, string>> = {
  knowledge_sources: "Approved documents your experts review before launch",
  human_escalation: "Questions outside approved material are handed to a named staff member",
  expected_outcomes: "Faster, more consistent access to trusted guidance",
  interaction_modes: "Guided conversation with an AI expert avatar",
}

const UNSURE = /\b(not sure|unsure|no idea|don'?t know|you decide|whatever|any)\b/i

function industryFromText(text: string): string | null {
  const domain = classifyFreeText(text).answers.domain ?? null
  if (domain) return domain
  const normalized = normalizeForMatching(text)
  if (/\bbusiness services?\b/.test(normalized)) return "professional_services"
  return null
}

/** Words that name a requirement, so "change the audience" can be routed in review. */
const FIELD_MENTIONS: [RegExp, RequirementField][] = [
  [/\b(audience|users?|who it serves|serve)\b/i, "target_audience"],
  [/\b(knowledge|documents?|sources?|content|materials?)\b/i, "knowledge_sources"],
  [/\b(escalat\w*|hand ?off|human|person steps? in)\b/i, "human_escalation"],
  [/\b(outcomes?|results?|success)\b/i, "expected_outcomes"],
  [/\b(interact\w*|voice|chat|conversation style)\b/i, "interaction_modes"],
  [/\b(languages?|tone|style|sound)\b/i, "communication_style"],
  [/\b(industry|sector|organi[sz]ation)\b/i, "industry"],
  [/\b(problem|challenge|pain)\b/i, "primary_problem"],
  [/\b(application|purpose|use case|what it does)\b/i, "desired_application"],
  [/\b(integrat\w*|systems?|crm|lms|erp)\b/i, "integrations"],
  [/\b(privacy|security|compliance|gdpr|hipaa)\b/i, "privacy_security"],
  [/\b(budget|cost)\b/i, "budget"],
  [/\b(timeline|deadline|launch date)\b/i, "timeline"],
]

const CHANGE_REQUEST = /\b(change|update|edit|modify|adjust|revise|different|instead|replace|add)\b/i

export interface FallbackResult {
  turn: ModelTurn
  /** The field the reply asks about, so the next answer can be filed against it. */
  pendingField: RequirementField | null
}

export function fallbackTurn(consultation: Consultation, message: string): FallbackResult {
  const reviewing = ["SOLUTION_DESIGN", "REVIEW", "COMPLETED"].includes(consultation.stage)
  if (reviewing && !consultation.pending_field && CHANGE_REQUEST.test(message)) {
    const field = FIELD_MENTIONS.find(([pattern]) => pattern.test(message))?.[1] ?? null
    return {
      pendingField: field,
      turn: {
        reply: field
          ? `Sure — what should the ${FIELD_LABELS[field].toLowerCase()} be instead?`
          : "Sure — which part would you like to change?",
        scope: "in_scope",
        user_intent: "revise",
        updates: [],
        clear_fields: [],
        industry_id: consultation.requirements.industry_id ?? "unknown",
        solution_type: "undecided",
        unresolved_questions: [],
        suggestions: field ? QUESTIONS[field].suggestions() : ["The audience", "The knowledge sources", "The escalation rules", "The outcomes"],
        ready_for_review: false,
      },
    }
  }
  const turn = fallbackQuestionTurn(consultation, message)
  return { turn, pendingField: turn.ready_for_review ? null : nextFallbackField(projectedRequirements(consultation, turn)) }
}

function projectedRequirements(consultation: Consultation, turn: ModelTurn): ConsultationRequirements {
  return {
    ...consultation.requirements,
    industry_id: turn.industry_id === "unknown" ? consultation.requirements.industry_id : turn.industry_id,
    fields: {
      ...consultation.requirements.fields,
      ...Object.fromEntries(turn.updates.map((u) => [u.field, { value: u.value, status: u.status, updated_at: "", turn: 0 }])),
    },
  }
}

function fallbackQuestionTurn(consultation: Consultation, message: string): ModelTurn {
  const { requirements } = consultation
  const updates: ProposedUpdate[] = []
  const has = (field: RequirementField) => Boolean(requirements.fields[field]) || updates.some((u) => u.field === field)
  const add = (update: ProposedUpdate) => {
    if (!has(update.field)) updates.push(update)
  }

  const classified = classifyFreeText(message).answers
  const pending = consultation.pending_field
  let industryId = requirements.industry_id ?? null

  // A direct answer to the question just asked is the visitor's own words: confirmed.
  if (pending) {
    if (pending === "industry") {
      const domain = industryFromText(message)
      if (domain) {
        industryId = domain
        updates.push({ field: "industry", value: industryLabel(domain) ?? message, status: "confirmed" })
      } else {
        updates.push({ field: "industry", value: message, status: "confirmed" })
      }
    } else if (UNSURE.test(message) && PROPOSED_DEFAULTS[pending]) {
      updates.push({ field: pending, value: PROPOSED_DEFAULTS[pending]!, status: "proposed" })
    } else {
      updates.push({ field: pending, value: message, status: "confirmed" })
    }
  }

  if (classified.domain && !industryId) {
    industryId = classified.domain
    add({ field: "industry", value: industryLabel(classified.domain) ?? classified.domain, status: "inferred" })
  }
  const audience = choiceLabel("audience", classified.audience)
  if (audience) add({ field: "target_audience", value: audience, status: "inferred" })
  const purpose = classified.goal ?? classifyPurpose(message)
  const goal = purpose ? goalContent[purpose]?.phrase : null
  if (goal) add({ field: "desired_application", value: goal, status: "inferred" })
  const interaction = choiceLabel("interaction", classified.interaction)
  if (interaction) add({ field: "interaction_modes", value: interaction, status: "inferred" })

  const words = message.trim().split(/\s+/).length
  if (pending !== "primary_problem" && words >= 6) {
    add({ field: "primary_problem", value: sanitizeText(message, 200), status: "inferred" })
  }

  const projected: ConsultationRequirements = {
    ...requirements,
    industry_id: industryId,
    fields: {
      ...requirements.fields,
      ...Object.fromEntries(updates.map((u) => [u.field, { value: u.value, status: u.status, updated_at: "", turn: 0 }])),
    },
  }
  const missing = missingEssentials(projected)
  const nextField = ASK_ORDER.find((field) => missing.includes(field)) ?? null

  const acknowledgement = updates.length > 0
    ? `Thanks — I've noted ${updates.map((u) => FIELD_LABELS[u.field].toLowerCase()).join(", ")}.`
    : "Thanks."
  const reply = nextField
    ? `${acknowledgement} ${QUESTIONS[nextField].text}`
    : consultation.stage === "REVIEW" || consultation.stage === "COMPLETED"
      ? `${acknowledgement} You can confirm the proposal, or tell me which part to change.`
      : `${acknowledgement} I have what I need to summarize a proposed solution for you to review.`

  return {
    reply,
    scope: "in_scope",
    user_intent: "share_requirements",
    updates,
    clear_fields: [],
    industry_id: industryId ?? "unknown",
    solution_type: "undecided",
    unresolved_questions: [],
    suggestions: nextField ? QUESTIONS[nextField].suggestions() : [],
    ready_for_review: nextField === null,
  }
}

/** The field the fallback will ask about next, so the answer can be filed against it. */
export function nextFallbackField(requirements: ConsultationRequirements): RequirementField | null {
  const missing = missingEssentials(requirements)
  return ASK_ORDER.find((field) => missing.includes(field)) ?? null
}

function value(requirements: ConsultationRequirements, field: RequirementField): string | null {
  const entry = requirements.fields[field]
  return entry && entry.status !== "unresolved" ? entry.value : null
}

export function inferSolutionType(requirements: ConsultationRequirements): SolutionType {
  if (requirements.solution_type) return requirements.solution_type
  const text = normalizeForMatching(
    [value(requirements, "desired_application"), value(requirements, "primary_problem"), value(requirements, "interaction_modes")]
      .filter(Boolean)
      .join(" "),
  )
  if (/\b(simulat\w*|sensor\w*|iot|production line|plant|physical twin)\b/.test(text)) return "simulation_digital_twin"
  if (/\b(present\w*|video message\w*|spokesperson|presenter)\b/.test(text)) return "digital_human_presenter"
  if (/\b(automat\w*|workflow\w*|tickets?)\b/.test(text)) return "knowledge_agent"
  return "ai_expert_avatar"
}

export function fallbackProposal(requirements: ConsultationRequirements): ModelProposal {
  const industry = industryLabel(requirements.industry_id) ?? value(requirements, "industry") ?? "your organization"
  const audience = value(requirements, "target_audience") ?? "your audience"
  const application = value(requirements, "desired_application") ?? "trusted guidance"
  const solutionType = inferSolutionType(requirements)
  const offerings: ModelProposal["offerings"] = [
    {
      offering_id: "expert_avatar_platform",
      fit: solutionType === "simulation_digital_twin" ? "customization" : "current",
      note: "Knowledge-grounded AI expert with a voice and video avatar.",
    },
    { offering_id: "ai_consultation", fit: "current", note: "Readiness review, scoping, and an implementation roadmap." },
  ]
  if (value(requirements, "integrations")) {
    offerings.push({ offering_id: "custom_ai_agents", fit: "customization", note: "Integrations confirmed during scoping." })
  }
  if (solutionType === "simulation_digital_twin") {
    offerings.push({
      offering_id: "software_development",
      fit: "new_development",
      note: "Simulating a physical system is not a published MYO'S capability and needs a feasibility review.",
    })
  }

  const assumptions = Object.entries(requirements.fields)
    .filter(([, entry]) => entry.status === "inferred" || entry.status === "proposed")
    .map(([field, entry]) => `${FIELD_LABELS[field as RequirementField]}: ${entry.value}`)
    .slice(0, 6)

  return {
    title: sanitizeText(`${industry}: an AI expert for ${audience}`, 110),
    solution_type: solutionType,
    summary: sanitizeText(
      `A MYO'S AI expert focused on ${application}, serving ${audience} in ${industry.toLowerCase()}. It answers from approved knowledge${value(requirements, "knowledge_sources") ? ` (${value(requirements, "knowledge_sources")})` : ""} and hands anything outside that material to a person.`,
      800,
    ),
    components: [
      `Approved knowledge base: ${value(requirements, "knowledge_sources") ?? "to be agreed"}`,
      `Interaction: ${value(requirements, "interaction_modes") ?? "guided conversation"}`,
      `Outcome focus: ${value(requirements, "expected_outcomes") ?? "to be agreed"}`,
    ].map((item) => sanitizeText(item, 180)),
    offerings,
    human_oversight: sanitizeText(
      value(requirements, "human_escalation") ?? "Anything outside approved material is escalated to a named person.",
      400,
    ),
    open_questions: requirements.unresolved_questions.slice(0, 6),
    assumptions,
  }
}

function short(text: string, max: number): string {
  return sanitizeText(text, max)
}

export function fallbackPageSpec(requirements: ConsultationRequirements, proposal: ModelProposal | null): PageSpec {
  const industry = industryLabel(requirements.industry_id) ?? value(requirements, "industry") ?? "Your organization"
  const audience = value(requirements, "target_audience") ?? "the people you serve"
  const application = value(requirements, "desired_application") ?? "trusted guidance"
  const problem = value(requirements, "primary_problem")
  const outcome = value(requirements, "expected_outcomes") ?? "faster access to trusted knowledge"
  const escalation = value(requirements, "human_escalation") ?? "Anything outside approved material goes to a named person."

  const tagFields: RequirementField[] = ["target_audience", "interaction_modes", "knowledge_sources", "expected_outcomes", "human_escalation", "communication_style"]
  const tags = tagFields
    .filter((field) => value(requirements, field))
    .map((field) => ({ field, label: short(value(requirements, field)!, 40) }))
    .slice(0, 6)

  return {
    hero: {
      headline: short(proposal?.title ?? `An AI expert for ${audience}`, 120),
      description: short(proposal?.summary ?? `A MYO'S AI expert focused on ${application} for ${audience}.`, 360),
      image: "general",
      primary_cta: { label: "Book Demo", action: "book_demo" },
      secondary_cta: { label: "Refine Proposal", action: "refine_proposal" },
    },
    told: {
      eyebrow: short(`${industry} · ${application}`, 70),
      headline: short(`${outcome.charAt(0).toUpperCase()}${outcome.slice(1)} for ${audience}.`, 160),
      summary: short(problem ? `You told us: ${problem}` : `Built around ${application}.`, 300),
      tags: tags.length > 0 ? tags : [{ field: "industry", label: short(industry, 40) }],
      highlight_field: tags.some((tag) => tag.field === "human_escalation") ? "human_escalation" : "none",
    },
    details: [
      {
        eyebrow: "Application",
        items: [
          { title: "Who it serves", body: short(`Built for ${audience}.`, 420) },
          { title: "What it does", body: short(`Focused on ${application}.`, 420) },
        ],
      },
      {
        eyebrow: "Knowledge and interaction",
        items: [
          { title: "Grounded in", body: short(value(requirements, "knowledge_sources") ?? "Approved material your experts review before launch.", 420) },
          { title: "How people interact", body: short(value(requirements, "interaction_modes") ?? "A guided conversation with an AI expert.", 420) },
        ],
      },
      {
        eyebrow: "Guardrails",
        items: [
          { title: "Where a human steps in", body: short(escalation, 420) },
          {
            title: "Privacy and constraints",
            body: short(
              value(requirements, "privacy_security") ?? value(requirements, "operational_constraints") ?? "Privacy, data handling, and deployment constraints are agreed during scoping.",
              420,
            ),
          },
        ],
      },
    ],
    cta: {
      theme: short(industry, 56),
      body: short(`Let's scope a pilot of this AI expert for ${audience}, starting from your approved knowledge and a clear escalation path.`, 360),
      primary: { label: "Get Started Today", action: "book_demo" },
      secondary: { label: "Refine Proposal", action: "refine_proposal" },
    },
  }
}
