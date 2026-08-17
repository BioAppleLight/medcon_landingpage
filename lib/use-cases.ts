import {
  audienceContent,
  contextContent,
  domainContent,
  goalContent,
  interactionContent,
  outcomeContent,
  requirementContent,
  toneContent,
  useCaseTemplate,
} from "./preset-content.ts"
import type { AnswerSet, PageRef } from "./types.ts"

export type IndustryUseCaseId = "healthcare" | "education" | "government"
export type UseCaseId = IndustryUseCaseId | "template"

export interface UseCase {
  id: UseCaseId
  label: string
  icon: "stethoscope" | "graduation-cap" | "landmark" | "layout-template"
  headline: string
  summary: string
  points: string[]
  pageSections: { title: string; body: string }[]
  outcomes: string[]
  image: string
  demoVideo: { src: string; poster: string; title: string } | null
  alt: string
}

export const useCases: UseCase[] = [
  {
    id: "healthcare",
    label: "Healthcare",
    icon: "stethoscope",
    headline: "AI doctor avatars for post-surgery recovery.",
    summary:
      "Give patients clear, consistent guidance after discharge while keeping clinical teams focused on the moments that truly need human attention.",
    points: [
      "Personalized video guidance for rehab exercises",
      "Patients ask questions and get answers any time",
      "Automatic red-flag alerts escalate to real clinicians",
    ],
    pageSections: [
      {
        title: "Recovery and Clinical Guideline support",
        body: "Patients can revisit care instructions, rehabilitation routines, and medication guidance through a familiar AI doctor avatar.",
      },
      {
        title: "Clinical escalation",
        body: "Risk signals and concerning answers can be surfaced quickly so clinicians spend time where their judgment matters most.",
      },
      {
        title: "Always available",
        body: "Patients get support outside check-in hours, across languages, and without waiting for a follow-up call.",
      },
    ],
    outcomes: ["Faster Staff and Employee Onboarding", "Fewer repeated calls", "Accurate medical knowledge and stimulation"],
    image: "/demos/healthcare-demo.png",
    demoVideo: null,
    alt: "AI doctor avatar guiding a patient through recovery exercises",
  },
  {
    id: "education",
    label: "Education",
    icon: "graduation-cap",
    headline: "AI Oral Examinator avatars that never stop teaching.",
    summary:
      "Extend a professor's presence beyond the lecture hall with trusted as your personal oral examinor, style-aware AI support for students.",
    points: [
      "Answers student questions with accurate sources",
      "Personalized teaching style",
      "Available across time zones and 24/7 for students",
    ],
    pageSections: [
      {
        title: "Professor-aligned answers",
        body: "Students receive guidance that reflects the course materials, preferred explanations, and tone of the instructor.",
      },
      {
        title: "Study help on demand",
        body: "The avatar can explain concepts, prepare learners for assessments, and support students who need help outside class time.",
      },
      {
        title: "Integration with LMS platforms ",
        body: "Supporting Brightspace, Canvas, Moodles, and other LMS platforms makes education easier to scale across campuses, online cohorts, and international programs.",
      },
    ],
    outcomes: ["Higher engagement", "More scalable office hours", "Consistent course support"],
    image: "/demos/education-demo.png",
    demoVideo: {
      src: "https://pub-9c0b5a57bb204edca8d45fe05db8821c.r2.dev/education-demo.mp4",
      poster: "/demos/education-demo.png",
      title: "Education use case demo",
    },
    alt: "AI professor avatar answering a student's question",
  },
  {
    id: "government",
    label: "Government",
    icon: "landmark",
    headline: "AI training assistants for government at scale.",
    summary:
      "Standardize training, assessments, and citizen-facing knowledge delivery across departments and regions.",
    points: [
      "Run oral assessments and certification prep",
      "Deliver consistent training to entire departments",
      "Supports multiple languages out of the box",
    ],
    pageSections: [
      {
        title: "Consistent training",
        body: "Teams receive the same approved guidance every time, reducing drift between trainers, departments, and locations.",
      },
      {
        title: "Assessment readiness",
        body: "Interactive oral practice helps staff prepare for certifications, compliance checks, and public-service scenarios.",
      },
      {
        title: "Quicker Transitions",
        body: "Government knowledge can be preserved across departments and turnovers of the governmental employees and officials for future use.",
      },
    ],
    outcomes: ["Standardized and accurate delivery", "Faster onboarding", "Preserves Knowledge"],
    image: "/demos/government-demo.png",
    demoVideo: null,
    alt: "AI government training assistant running an oral assessment",
  },
  {
    id: "template",
    label: "Use Case Template",
    icon: "layout-template",
    headline: "A flexible starting point for your AI expert.",
    summary:
      "Use this template to shape a MYO'S deployment around your audience, trusted knowledge, workflows, and desired outcomes.",
    points: [
      "Define the people your AI expert should support",
      "Connect approved knowledge and preferred guidance",
      "Set escalation rules and measurable outcomes",
    ],
    pageSections: [
      {
        title: "1. Define the audience and need",
        body: "Identify who needs support, the questions they ask most often, and the moments where expert guidance has the greatest value.",
      },
      {
        title: "2. Add trusted expertise",
        body: "Select the approved documents, processes, teaching materials, or institutional knowledge that should ground every response.",
      },
      {
        title: "3. Design the experience",
        body: "Choose the expert avatar, tone, languages, delivery channels, and human escalation path that fit your organization.",
      },
    ],
    outcomes: ["Consistent expert guidance", "Faster knowledge access", "A scalable personalized experience"],
    image: "/demos/my-graph.png",
    demoVideo: null,
    alt: "MYO'S AI knowledge graph illustrating a customizable expert use case",
  },
]

/* ------------------------------------------------------------------------------------------
 * Personalized pages
 *
 * The answers collected by the chatbot are carried in the URL slug, so a personalized page is
 * shareable, reproducible, and stored nowhere. There is one generic template (in
 * `preset-content.ts`); domains differ only in what gets substituted into its slots.
 * ---------------------------------------------------------------------------------------- */

const SLUG_PREFIX = "c-"
const NOTE_MAX_LENGTH = 120
const MAX_SLUG_LENGTH = 512
const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/

function decodeBase64Url(payload: string): string | null {
  if (!payload || !BASE64URL_PATTERN.test(payload)) return null

  try {
    const buffer = Buffer.from(payload, "base64url")
    if (buffer.toString("base64url") !== payload) return null
    return buffer.toString("utf-8")
  } catch {
    return null
  }
}

/**
 * Reduces visitor free text to safe plain text before it reaches a template slot: no markup
 * characters, no control characters, bounded length. React escapes on render as well; this
 * keeps the stored and shared value clean rather than relying on the renderer alone.
 */
function toSafeText(text: string, maxLength: number): string {
  const cleaned = text
    .replace(/[\p{Cc}\p{Cf}]/gu, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1).trimEnd()}…` : cleaned
}

/** Substitutes `{slot}` placeholders. Unknown slots are left alone so gaps are visible. */
function fill(template: string, slots: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => slots[key] ?? match)
}

/** Encodes the answer set into a shareable base64url slug. */
export function encodeUseCaseAnswers(answers: AnswerSet): string {
  const note = answers.note ? toSafeText(answers.note, NOTE_MAX_LENGTH) : ""
  const payload: Record<string, string> = {
    d: answers.domain ?? "",
    g: answers.goal ?? "",
    a: answers.audience ?? "",
    i: answers.interaction ?? "",
    t: answers.tone ?? "",
    o: answers.outcome ?? "",
    r: answers.requirement ?? "",
  }
  if (note) payload.n = note

  return `${SLUG_PREFIX}${Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url")}`
}

/** Decodes a slug back into an answer set, or `null` if it is not a well-formed one. */
export function decodeUseCaseSlug(slug: string): AnswerSet | null {
  if (!slug.startsWith(SLUG_PREFIX) || slug.length > MAX_SLUG_LENGTH) return null

  try {
    const json = decodeBase64Url(slug.slice(SLUG_PREFIX.length))
    if (json === null) return null
    const data: unknown = JSON.parse(json)

    if (typeof data !== "object" || data === null || Array.isArray(data)) return null

    const { d, g, a, i, t, o, r, s, n } = data as Record<string, unknown>
    if (typeof d !== "string" || typeof g !== "string") return null
    if (!d || !g) return null
    if (n !== undefined && typeof n !== "string") return null
    if (a !== undefined && typeof a !== "string") return null
    if (r !== undefined && typeof r !== "string") return null

    // Older guided links used a scale field. Defaults keep those links usable while all new
    // links carry the five current personalization dimensions.
    const isLegacyGuided = typeof s === "string" && s.length > 0
    if (!isLegacyGuided && (typeof i !== "string" || typeof t !== "string" || typeof o !== "string")) return null
    if (!isLegacyGuided && (!i || !t || !o)) return null

    const answers: AnswerSet = {
      domain: d,
      goal: g,
      audience: typeof a === "string" && a ? a : "community",
      interaction: isLegacyGuided ? "guided_chat" : i as string,
      tone: isLegacyGuided ? "professional" : t as string,
      outcome: isLegacyGuided ? "balanced" : o as string,
      requirement: typeof r === "string" && r ? r : "flexible",
    }
    const note = typeof n === "string" ? toSafeText(n, NOTE_MAX_LENGTH) : ""
    if (note) answers.note = note

    return answers
  } catch {
    return null
  }
}

/**
 * Resolves the content each slot is filled from. A missing entry falls back to the generic
 * branch rather than failing, so a content gap degrades instead of 404ing.
 */
function resolveSlots(answers: AnswerSet) {
  const domain = domainContent[answers.domain ?? ""] ?? domainContent.generic
  const goal = goalContent[answers.goal ?? ""] ?? goalContent.general
  const audience = audienceContent[answers.audience ?? ""] ?? audienceContent.community
  const interaction = interactionContent[answers.interaction ?? ""] ?? interactionContent.general
  const tone = toneContent[answers.tone ?? ""] ?? toneContent.adaptive
  const outcome = outcomeContent[answers.outcome ?? ""] ?? outcomeContent.balanced
  const requirement =
    requirementContent[answers.requirement ?? ""] ?? requirementContent.flexible

  const note = answers.note ? toSafeText(answers.note, NOTE_MAX_LENGTH) : ""
  const isSpecificBrief = note.split(/\s+/).filter(Boolean).length >= 3
  const headline = isSpecificBrief
    ? `${domain.expert} avatars built around: “${note}”`
    : `${domain.expert} avatars for ${goal.phrase}.`
  const briefSummary = isSpecificBrief
    ? `Built around the visitor's question: “${note}.”`
    : `Built around ${goal.phrase}.`

  const base: Record<string, string> = {
    domainLabel: domain.label,
    expert: domain.expert,
    headline,
    briefSummary,
    lead: domain.lead,
    escalation: domain.escalation,
    goalPhrase: goal.phrase,
    goalShort: goal.short,
    goalTitle: goal.title,
    goalBody: goal.body,
    audiencePhrase: audience.phrase,
    audienceBody: audience.body,
    interactionPhrase: interaction.phrase,
    interactionBody: interaction.body,
    tonePhrase: tone.phrase,
    toneBody: tone.body,
    outcomePhrase: outcome.phrase,
    outcomeBody: outcome.body,
    requirementPhrase: requirement.phrase,
    requirementBody: requirement.body,
  }

  const context = note
    ? fill(contextContent.withNote, { ...base, note })
    : fill(contextContent.withoutNote, base)
  const slots: Record<string, string> = { ...base, note, context }

  return { domain, outcome, slots }
}

/** Predefined, local image library. Selection is deterministic and uses collected answers. */
export const personalizedImageLibrary = {
  healthcare: "/demos/healthcare-demo.png",
  education: "/demos/education-demo.png",
  government: "/demos/government-demo.png",
  guided_chat: "/demos/human-delivery.png",
  qa: "/demos/my-graph.png",
  assessment: "/demos/1660314198561.png",
  general: "/the Solution.png",
  presenter: "/Homepage design.jpg",
  brand: "/mission.png",
} as const

const trainingImageGoals = new Set([
  "onboarding_orientation_training",
  "instruction_learning",
  "sop_safety_training",
  "coaching_simulation",
  "assessment_certification",
  "training",
  "assessment",
  "oral_exams",
  "certification",
])

const presenterImageGoals = new Set([
  "selection_recommendation",
  "demo_comparison",
  "lead_consultation",
  "promotion_conversion",
  "showroom_catalog",
  "recommendation",
])

const supportImageGoals = new Set([
  "troubleshooting_support",
  "request_status_support",
  "intake_eligibility",
  "feedback_survey",
  "escalation_incident",
  "support",
])

const informationImageGoals = new Set([
  "faq_information",
  "product_policy_information",
  "status_updates",
  "story_explainer",
  "public_education",
  "information",
  "knowledge",
])

export function selectUseCaseImage(answers: AnswerSet): string {
  if (trainingImageGoals.has(answers.goal ?? "")) {
    return personalizedImageLibrary.assessment
  }
  if (presenterImageGoals.has(answers.goal ?? "") || answers.interaction === "presentation") {
    return personalizedImageLibrary.presenter
  }
  if (supportImageGoals.has(answers.goal ?? "")) return personalizedImageLibrary.guided_chat
  if (informationImageGoals.has(answers.goal ?? "") || answers.interaction === "qa") {
    return answers.outcome === "engagement"
      ? personalizedImageLibrary.guided_chat
      : personalizedImageLibrary.qa
  }
  if (answers.goal === "staff_training" || answers.interaction === "guided_chat") {
    return personalizedImageLibrary.guided_chat
  }

  return domainContent[answers.domain ?? ""]?.image ?? personalizedImageLibrary.general
}

/**
 * Builds the personalized page by substituting the collected answers into the generic
 * template. Returns `null` when a required answer is missing — never a half-built page.
 */
export function buildUseCasePage(answers: AnswerSet): UseCase | null {
  if (
    !answers.domain ||
    !answers.goal ||
    !answers.audience ||
    !answers.interaction ||
    !answers.tone ||
    !answers.outcome ||
    !answers.requirement
  ) return null

  const { domain, outcome, slots } = resolveSlots(answers)

  return {
    id: domain.pageId,
    label: `${domain.label} · ${slots.goalShort}`,
    icon: domain.icon,
    headline: fill(useCaseTemplate.headline, slots),
    summary: fill(useCaseTemplate.summary, slots),
    points: [
      `Interaction: ${slots.interactionPhrase}`,
      `Audience: ${slots.audiencePhrase}`,
      `Voice: ${slots.tonePhrase}`,
      `Priority: ${slots.requirementPhrase}`,
    ],
    pageSections: useCaseTemplate.sections.map((section) => ({
      title: fill(section.title, slots),
      body: fill(section.body, slots),
    })),
    outcomes: [...outcome.highlights],
    image: selectUseCaseImage(answers),
    demoVideo: null,
    alt: `${domain.label} use case for ${slots.audiencePhrase}: ${slots.goalPhrase}`,
  }
}

export interface PersonalizedPresentation {
  eyebrow: string
  howItWorksTitle: string
  ctaTheme: string
  ctaBody: string
  audience: string
  audienceBody: string
  interaction: string
  interactionBody: string
  tone: string
  toneBody: string
  outcome: string
  outcomeBody: string
  requirement: string
  requirementBody: string
  domainLead: string
  escalation: string
}

/** Page-level copy that sits outside the generic UseCase data structure. */
export function getPersonalizedPresentation(slug: string): PersonalizedPresentation | null {
  const answers = decodeUseCaseSlug(slug)
  if (!answers) return null

  const { slots } = resolveSlots(answers)
  return {
    eyebrow: `${slots.domainLabel} · ${slots.goalShort}`,
    howItWorksTitle: `A ${slots.tonePhrase} ${slots.interactionPhrase} for ${slots.audiencePhrase}, built for ${slots.outcomePhrase}.`,
    ctaTheme: slots.goalShort,
    ctaBody: `Let's build this ${slots.interactionPhrase} for ${slots.audiencePhrase} in ${slots.domainLabel.toLowerCase()}, with a ${slots.tonePhrase} voice, ${slots.requirementPhrase}, and a clear focus on ${slots.outcomePhrase}.`,
    audience: slots.audiencePhrase,
    audienceBody: slots.audienceBody,
    interaction: slots.interactionPhrase,
    interactionBody: slots.interactionBody,
    tone: slots.tonePhrase,
    toneBody: slots.toneBody,
    outcome: slots.outcomePhrase,
    outcomeBody: slots.outcomeBody,
    requirement: slots.requirementPhrase,
    requirementBody: slots.requirementBody,
    domainLead: slots.lead,
    escalation: slots.escalation,
  }
}

/** Approved display label for the industry currently selected in the guided conversation. */
export function getDomainLabel(domain: string | undefined): string | null {
  if (!domain) return null
  return domainContent[domain]?.label ?? null
}

/** The slug, its URL, and the label the chatbot shows on the link. */
export function createPageRef(answers: AnswerSet): PageRef | null {
  if (!buildUseCasePage(answers)) return null

  const slug = encodeUseCaseAnswers(answers)

  return {
    slug,
    url: `/use-cases/template?brief=${encodeURIComponent(slug)}`,
    label: fill(useCaseTemplate.label, resolveSlots(answers).slots),
  }
}

/* ------------------------------------------------------------------------------------------
 * Legacy `custom-*` slugs
 *
 * Produced by the previous free-text chatbot. Kept decodable so links already shared keep
 * resolving; nothing generates this format any more.
 * ---------------------------------------------------------------------------------------- */

const LEGACY_SLUG_PREFIX = "custom-"
const LEGACY_GOAL_MAX_LENGTH = 160

const legacyHeadlineByIndustry: Record<IndustryUseCaseId, (goal: string) => string> = {
  healthcare: (goal) => `AI doctor avatars built around: "${goal}"`,
  education: (goal) => `An AI teaching avatar built around: "${goal}"`,
  government: (goal) => `An AI government training avatar built around: "${goal}"`,
}

function decodeLegacySlug(slug: string): { industry: IndustryUseCaseId; goal: string } | null {
  if (!slug.startsWith(LEGACY_SLUG_PREFIX) || slug.length > MAX_SLUG_LENGTH) return null

  try {
    const json = decodeBase64Url(slug.slice(LEGACY_SLUG_PREFIX.length))
    if (json === null) return null
    const data = JSON.parse(json) as { i?: unknown; g?: unknown }

    if (
      typeof data.g !== "string" ||
      data.g.length === 0 ||
      (data.i !== "healthcare" && data.i !== "education" && data.i !== "government")
    ) {
      return null
    }

    const goal = toSafeText(data.g, LEGACY_GOAL_MAX_LENGTH)
    return goal ? { industry: data.i, goal } : null
  } catch {
    return null
  }
}

function buildLegacyUseCase(industry: IndustryUseCaseId, goal: string): UseCase | undefined {
  const base = useCases.find((useCase) => useCase.id === industry)
  if (!base || !goal) return undefined

  return {
    ...base,
    headline: legacyHeadlineByIndustry[industry](toSafeText(goal, 80)),
    summary: `Based on what you shared — "${goal}" — here's how MYO'S AI ${base.label.toLowerCase()} avatars can help.`,
    pageSections: [
      {
        title: "Your request",
        body: `You told us: "${goal}." Here's how that fits into a MYO'S ${base.label} deployment.`,
      },
      ...base.pageSections,
    ],
  }
}

export function getUseCase(id: string): UseCase | undefined {
  if (id.startsWith(SLUG_PREFIX)) {
    const answers = decodeUseCaseSlug(id)
    return answers ? (buildUseCasePage(answers) ?? undefined) : undefined
  }

  const legacy = decodeLegacySlug(id)
  if (legacy) return buildLegacyUseCase(legacy.industry, legacy.goal)

  return useCases.find((useCase) => useCase.id === id)
}
