export type UseCaseId = "healthcare" | "education" | "government"

export interface UseCase {
  id: UseCaseId
  label: string
  icon: "stethoscope" | "graduation-cap" | "landmark"
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
      src: "/demos/education-demo.mp4",
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
]

const CUSTOM_SLUG_PREFIX = "custom-"
const GOAL_MAX_LENGTH = 160

const headlineByIndustry: Record<UseCaseId, (goal: string) => string> = {
  healthcare: (goal) => `AI doctor avatars built around: "${goal}"`,
  education: (goal) => `An AI teaching avatar built around: "${goal}"`,
  government: (goal) => `An AI government training avatar built around: "${goal}"`,
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

/** Encodes {industry, goal} into a shareable slug — no server storage needed. */
export function encodeCustomUseCase(industry: UseCaseId, goal: string): string {
  const payload = JSON.stringify({ i: industry, g: truncate(goal.trim(), GOAL_MAX_LENGTH) })
  return `${CUSTOM_SLUG_PREFIX}${Buffer.from(payload, "utf-8").toString("base64url")}`
}

function decodeCustomSlug(slug: string): { industry: UseCaseId; goal: string } | null {
  if (!slug.startsWith(CUSTOM_SLUG_PREFIX)) return null

  try {
    const json = Buffer.from(slug.slice(CUSTOM_SLUG_PREFIX.length), "base64url").toString("utf-8")
    const data = JSON.parse(json) as { i?: unknown; g?: unknown }

    if (
      typeof data.g !== "string" ||
      data.g.length === 0 ||
      (data.i !== "healthcare" && data.i !== "education" && data.i !== "government")
    ) {
      return null
    }

    return { industry: data.i, goal: data.g }
  } catch {
    return null
  }
}

/** Builds a personalized use case by layering the visitor's goal onto the base industry template. */
export function buildPersonalizedUseCase(industry: UseCaseId, goal: string): UseCase {
  const base = useCases.find((useCase) => useCase.id === industry)
  if (!base) throw new Error(`Unknown industry: ${industry}`)

  const cleanGoal = truncate(goal.trim(), GOAL_MAX_LENGTH)

  return {
    ...base,
    headline: headlineByIndustry[industry](truncate(cleanGoal, 80)),
    summary: `Based on what you shared — "${cleanGoal}" — here's how MYO'S AI ${base.label.toLowerCase()} avatars can help.`,
    pageSections: [
      {
        title: "Your request",
        body: `You told us: "${cleanGoal}." Here's how that fits into a MYO'S ${base.label} deployment.`,
      },
      ...base.pageSections,
    ],
  }
}

export function getUseCase(id: string): UseCase | undefined {
  const custom = decodeCustomSlug(id)
  if (custom) return buildPersonalizedUseCase(custom.industry, custom.goal)

  return useCases.find((useCase) => useCase.id === id)
}
