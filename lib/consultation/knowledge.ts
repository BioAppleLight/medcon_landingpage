import { domainContent } from "../preset-content.ts"
import { services } from "../services-content.ts"
import { useCases } from "../use-cases.ts"

/**
 * The knowledge layer: a small, structured catalog of what MYO'S actually offers, grounded in
 * the site's own published content. Every entry names the file it came from.
 *
 * The whole catalog is a few thousand tokens, so it is sent to the model in full rather than
 * retrieved piecemeal. Retrieval (RAG) would only earn its complexity once this content grows
 * well past what fits comfortably in a prompt or changes faster than deploys.
 *
 * Availability vocabulary used everywhere:
 *   current          — offered today, as published on the site
 *   customization    — an existing offering configured or extended for the visitor
 *   new_development  — would require building something MYO'S does not publish today
 *   unconfirmed      — feasibility cannot be confirmed from published information
 */

export type Availability = "current" | "customization" | "new_development" | "unconfirmed" | "roadmap"

export interface Offering {
  id: string
  name: string
  availability: Availability
  summary: string
  includes: string[]
  source: string
}

export interface Capability {
  id: string
  name: string
  availability: Availability
  detail: string
  source: string
}

export const concepts = [
  {
    term: "AI expert avatar",
    meaning:
      "MYO'S core product: a conversational AI that represents a specific expert or role, answers from that organization's approved knowledge, and is delivered through a human-like video avatar with voice. It teaches, guides, assesses, and answers questions.",
  },
  {
    term: "Digital-human representation",
    meaning:
      "The visual and voice layer — a realistic presenter with lip-synchronized speech. It can deliver scripted or generated content and is not, by itself, an intelligent system.",
  },
  {
    term: "Knowledge-based AI agent",
    meaning:
      "An assistant grounded in approved documents and business rules that answers, guides, and can take actions through integrations. It may or may not have an avatar.",
  },
  {
    term: "Simulation-oriented digital twin",
    meaning:
      "A model of a physical asset, process, or system (for example a production line or building) fed by operational data to simulate, monitor, or predict behaviour. MYO'S does not publish this as a current product; any such work would be new development and needs a feasibility review.",
  },
] as const

const serviceOfferings: Offering[] = services.map((service) => ({
  id: service.id,
  name: service.title,
  availability: "current",
  summary: `${service.tagline} ${service.desc}`,
  includes: service.points,
  source: "lib/services-content.ts (/services)",
}))

export const offerings: Offering[] = [
  {
    id: "expert_avatar_platform",
    name: "MYO'S AI Expert Avatar Platform",
    availability: "current",
    summary:
      "Turns trusted human expertise into interactive AI expert avatars: upload knowledge, create the digital twin (voice, avatar, behaviour, language), and deploy it to a website, LMS, hospital portal, or government platform.",
    includes: [
      "Answers grounded in approved source material",
      "Voice conversation with a lip-synchronized avatar",
      "Multilingual delivery and 24/7 availability",
      "Conversation summaries that reveal knowledge gaps",
    ],
    source: "app/product/page.tsx, components/how-it-works.tsx, app/technology/core/page.tsx",
  },
  ...serviceOfferings,
]

export const capabilities: Capability[] = [
  {
    id: "grounded_answers",
    name: "Grounded answers (retrieval-augmented generation)",
    availability: "current",
    detail:
      "Combines large language models with retrieval from the organization's approved knowledge so answers come from the right source material.",
    source: "app/technology/core/page.tsx",
  },
  {
    id: "knowledge_graph",
    name: "Knowledge graph from unstructured documents",
    availability: "current",
    detail:
      "Converts policies, manuals, transcripts, SOPs, and training files into connected entities and relationships the avatar reasons over.",
    source: "app/technology/core/page.tsx",
  },
  {
    id: "voice_lipsync",
    name: "Voice and lip synchronization",
    availability: "current",
    detail: "Speech is generated and the avatar's mouth movements are timed to the audio.",
    source: "app/technology/core/page.tsx",
  },
  {
    id: "multilingual",
    name: "Multilingual conversations",
    availability: "current",
    detail: "One expert can serve audiences in several languages.",
    source: "components/human-delivery.tsx, /services",
  },
  {
    id: "availability_247",
    name: "24/7 availability and conversation context",
    availability: "current",
    detail: "Available around the clock and picks up where a conversation left off.",
    source: "components/human-delivery.tsx",
  },
  {
    id: "feedback_loop",
    name: "Feedback loop",
    availability: "current",
    detail:
      "Interactions are summarized so recurring questions and learner struggles surface and can guide knowledge updates.",
    source: "app/technology/core/page.tsx",
  },
  {
    id: "multi_domain",
    name: "Multi-domain publishing",
    availability: "current",
    detail: "A publisher/subscriber architecture lets one expert's knowledge reach several institutions.",
    source: "app/technology/core/page.tsx",
  },
  {
    id: "deployment_channels",
    name: "Deployment channels",
    availability: "current",
    detail: "Website, LMS, hospital portal, or government platform.",
    source: "components/how-it-works.tsx",
  },
  {
    id: "lms_integration",
    name: "LMS integration",
    availability: "customization",
    detail: "The education use case describes supporting Brightspace, Canvas, Moodle, and other LMS platforms; scope is confirmed per project.",
    source: "lib/use-cases.ts (education)",
  },
  {
    id: "business_integrations",
    name: "CRM, ERP, and support-system integrations",
    availability: "customization",
    detail: "Built per project through AI Agent Automation and Software Development; specific systems must be confirmed.",
    source: "lib/services-content.ts",
  },
  {
    id: "human_escalation",
    name: "Human escalation",
    availability: "current",
    detail:
      "Red-flag answers and anything outside approved material are escalated to a named person instead of being handled by the avatar.",
    source: "lib/preset-content.ts, lib/use-cases.ts",
  },
  {
    id: "generative_video_apis",
    name: "Third-party generative video and avatar APIs",
    availability: "customization",
    detail: "MYO'S works with external video-generation and AI-avatar APIs, listed on /technology/apis.",
    source: "app/technology/apis/page.tsx",
  },
  {
    id: "physical_simulation",
    name: "Physical or operational simulation twins",
    availability: "unconfirmed",
    detail:
      "Simulating machines, plants, or processes from sensor or operational data is not a published MYO'S capability. Treat as new development that needs a feasibility review.",
    source: "absence from published content",
  },
  {
    id: "motion_feedback",
    name: "Motion feedback for exercises",
    availability: "roadmap",
    detail: "Listed as future expansion: AI analyzes movement and gives form feedback. Not available today.",
    source: "components/future-expansion.tsx",
  },
  {
    id: "appointment_booking",
    name: "Appointment booking assistant",
    availability: "roadmap",
    detail: "Listed as future expansion. Not available today.",
    source: "components/future-expansion.tsx",
  },
]

export const implementationProcess = [
  "Data collection — gather scripts, approved materials, expert images and the scope list.",
  "Product development — generate the avatar and a first demo.",
  "Product validation — expert review and edits to ensure accuracy.",
  "Pilot launch for a defined scope.",
  "Expand to more scope, experts, or departments.",
] as const

export const policies = [
  "Pricing: packages are published on /pricing; custom scopes are quoted after a call. Never state prices, discounts, or totals in conversation.",
  "Never invent customer names, case studies, metrics, certifications, integrations, or guarantees.",
  "Example use cases on the site (healthcare, education, government) are illustrative deployments, not cited customer results.",
  "Digital twins support qualified professionals; they never replace them, and they never diagnose or make individual clinical, legal, or financial decisions.",
] as const

/** The approved industry ids and their display labels. `generic` is the unknown bucket. */
export const industries: { id: string; label: string }[] = Object.entries(domainContent)
  .filter(([id]) => id !== "generic")
  .map(([id, content]) => ({ id, label: content.label }))

export const INDUSTRY_IDS = industries.map((industry) => industry.id)

export function industryLabel(id: string | null | undefined): string | null {
  if (!id) return null
  return domainContent[id]?.label ?? null
}

export const OFFERING_IDS = offerings.map((offering) => offering.id)

export function offeringName(id: string): string | null {
  return offerings.find((offering) => offering.id === id)?.name ?? null
}

/** Published example use cases, as reference material — not customer evidence. */
const exampleUseCases = useCases
  .filter((useCase) => useCase.id !== "template")
  .map((useCase) => ({
    id: useCase.id,
    label: useCase.label,
    headline: useCase.headline,
    summary: useCase.summary,
    points: useCase.points,
    page: `/use-cases/${useCase.id}`,
  }))

/**
 * The catalog serialized for the prompt. Plain JSON inside a clearly delimited block — the
 * model is told it is reference data, never instructions.
 */
export function renderKnowledgeCatalog(): string {
  return JSON.stringify(
    {
      concepts,
      offerings: offerings.map(({ source: _source, ...offering }) => offering),
      capabilities: capabilities.map(({ source: _source, ...capability }) => capability),
      implementation_process: implementationProcess,
      example_use_cases: exampleUseCases,
      policies,
      industries,
    },
    null,
    0,
  )
}
