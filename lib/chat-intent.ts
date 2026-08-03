import { encodeCustomUseCase, type UseCaseId } from "@/lib/use-cases"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface ChatDecision {
  intent: "create_personalized_page" | "clarify_industry" | "clarify_goal"
  target: UseCaseId | null
  confidence: number
  missing_information: string[]
  action: "generate_page" | "ask_clarification"
  reply: string
  needs_clarification: boolean
  requires_confirmation: boolean
  page: { slug: string; url: string; label: string } | null
}

const industryLabels: Record<UseCaseId, string> = {
  healthcare: "Healthcare",
  education: "Education",
  government: "Government",
}

const keywordsByIndustry: Record<UseCaseId, string[]> = {
  healthcare: [
    "healthcare", "health care", "patient", "doctor", "medical", "health", "clinic",
    "hospital", "recovery", "surgery", "rehab", "nurse", "clinical", "therapy",
    "diagnosis", "care",
  ],
  education: [
    "education", "educator", "student", "teach", "professor", "class", "course",
    "school", "university", "exam", "tutor", "curriculum", "lecture", "study",
    "campus", "learner",
  ],
  government: [
    "government", "governmental", "citizen", "agency", "department", "compliance",
    "public sector", "regulation", "policy", "officer", "certification", "municipal",
    "civil service",
  ],
}

const MIN_GOAL_LENGTH = 8
const MIN_GOAL_WORDS = 3

function detectIndustry(text: string): { industry: UseCaseId | null; confidence: number } {
  const lower = text.toLowerCase()
  const scores = (Object.keys(keywordsByIndustry) as UseCaseId[]).map((industry) => ({
    industry,
    score: keywordsByIndustry[industry].filter((keyword) => lower.includes(keyword)).length,
  }))

  scores.sort((a, b) => b.score - a.score)
  const [top, second] = scores

  if (top.score === 0) return { industry: null, confidence: 0.15 }
  if (second && second.score === top.score) return { industry: null, confidence: 0.35 }
  if (top.score === 1) return { industry: top.industry, confidence: 0.6 }
  return { industry: top.industry, confidence: 0.9 }
}

function mostRecentIndustryFromHistory(history: ChatMessage[]): UseCaseId | null {
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const message = history[i]
    if (message.role !== "user") continue
    const { industry, confidence } = detectIndustry(message.content)
    if (industry && confidence >= 0.6) return industry
  }
  return null
}

function isSubstantiveGoal(text: string): boolean {
  const trimmed = text.trim()
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length
  return trimmed.length >= MIN_GOAL_LENGTH && wordCount >= MIN_GOAL_WORDS
}

/** Rule-based (no external LLM) intent + decision engine, matching the CLAUDE.md decision schema. */
export function getChatDecision(message: string, history: ChatMessage[]): ChatDecision {
  const trimmed = message.trim()
  const detected = detectIndustry(trimmed)
  const industry = detected.industry ?? mostRecentIndustryFromHistory(history)
  const goalCandidate = trimmed

  if (!industry) {
    return {
      intent: "clarify_industry",
      target: null,
      confidence: detected.confidence,
      missing_information: ["industry"],
      action: "ask_clarification",
      reply:
        "Which area is this for — Healthcare, Education, or Government? That tells me which MYO'S avatar experience to build for you.",
      needs_clarification: true,
      requires_confirmation: false,
      page: null,
    }
  }

  if (!isSubstantiveGoal(goalCandidate)) {
    return {
      intent: "clarify_goal",
      target: industry,
      confidence: 0.5,
      missing_information: ["goal"],
      action: "ask_clarification",
      reply: `Got it — ${industryLabels[industry]}. In a sentence, what would you like this AI assistant to help with?`,
      needs_clarification: true,
      requires_confirmation: false,
      page: null,
    }
  }

  const slug = encodeCustomUseCase(industry, goalCandidate)
  const url = `/use-cases/${slug}`

  return {
    intent: "create_personalized_page",
    target: industry,
    confidence: Math.max(detected.confidence, 0.6),
    missing_information: [],
    action: "generate_page",
    reply: `Here's ${industry === "education" ? "an" : "a"} ${industryLabels[industry]} page built around what you described.`,
    needs_clarification: false,
    requires_confirmation: false,
    page: { slug, url, label: `${industryLabels[industry]} for you` },
  }
}
