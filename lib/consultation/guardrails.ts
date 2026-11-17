import { classifyFreeText } from "../free-text-classifier.ts"
import type { RelevanceResult } from "./schemas.ts"
import { normalizeForMatching, sanitizeReply } from "./text.ts"

/**
 * Guardrails that do not depend on the model following its instructions. Input screening runs
 * before any model call; output validation runs on everything the model returns. The model's
 * own scope judgement is one signal among several, never the only one.
 */

export const OFF_TOPIC_REPLY =
  "I'm here to help you explore AI digital twin solutions and MYO'S services. Would you like to discuss how we could apply these technologies to your project?"

export const INJECTION_REPLY =
  "I can't change how I work or share my internal configuration, but I'm glad to keep helping with your digital twin project. What would you like your AI expert to do?"

export const CLINICAL_REPLY =
  "I can't give medical advice, diagnoses, or treatment decisions — please speak with a qualified clinician about your own health. What I can help with is designing a digital twin that supports clinical teams and patients with approved guidance and clear escalation to professionals. Would you like to explore that?"

export const UNSAFE_REPLY =
  "I can't help with that. I'm here to help you explore AI digital twin solutions and MYO'S services — is there a project you'd like to discuss?"

/* ------------------------------------------------------------------------------------------
 * Input screening
 * ---------------------------------------------------------------------------------------- */

const STRONG_INJECTION_PATTERNS = [
  /\b(ignore|disregard|forget|override|bypass)\b[^.!?\n]{0,40}\b(previous|prior|above|earlier|preceding|system|all|your|the)\b[^.!?\n]{0,20}\b(instructions?|rules|prompts?|directions|guidelines|guardrails)\b/i,
  /\b(reveal|show|print|repeat|output|display|leak|tell me)\b[^.!?\n]{0,30}\b(system|hidden|internal|developer|initial)\s+(prompt|instructions?|message|rules)\b/i,
  /\byour\s+(system\s+)?(prompt|instructions)\b[^.!?\n]{0,20}\b(verbatim|word for word|exactly)\b/i,
  /\b(you are now|from now on,? you|new instructions:|developer mode|jailbreak|do anything now|\bDAN\b mode)/i,
  /<\|?(im_start|im_end|system|endoftext)\|?>|\[\/?INST\]|^\s*(system|assistant)\s*:/im,
  /\b(api[_ ]?key|GEMINI_API_KEY|environment variables?|access token)\b[^.!?\n]{0,30}\b(show|reveal|print|give|send|what is)\b|\b(show|reveal|print|give|send)\b[^.!?\n]{0,30}\b(api[_ ]?key|GEMINI_API_KEY|secrets?)\b/i,
  /\b(other (users?|visitors?|customers?)'?s?|all)\s+(conversations?|consultations?|records?|chats?|pages?)\b[^.!?\n]{0,30}\b(show|list|give|read|access|dump)\b|\b(show|list|give|read|access|dump)\b[^.!?\n]{0,30}\b(other (users?|visitors?)'?s?|everyone'?s?|all)\s+(conversations?|consultations?|records?|chats?|data)\b/i,
]

const CLINICAL_PATTERNS = [
  /\bwhat\s+(medication|medicine|drug|dose|dosage|treatment)s?\s+should\s+i\b/i,
  /\b(do|could|might)\s+i\s+have\s+(a|an)?\s*\w*\s*(cancer|infection|disease|disorder|syndrome|condition|diabetes|covid)\b/i,
  /\b(diagnose|diagnosis for)\s+(me|my)\b/i,
  /\bshould\s+i\s+(stop|start|take|increase|decrease|double)\s+(my\s+)?(medication|meds|pills|dose|insulin|antibiotics)\b/i,
  /\bmy\s+(symptoms?|rash|lump|pain|fever|blood pressure)\b[^.!?]{0,60}\b(what|is it|should i|serious)\b/i,
]

/** Words that show the visitor is talking *about* patients or a system, not about themselves. */
const THIRD_PARTY_FRAMING =
  /\b(patients?|users?|visitors?|students?|learners?|they|their|avatar|twin|assistant|bot|chatbot|platform|clinic|hospital|our)\b/i

export interface InputScreen {
  injection: "strong" | null
  clinical: boolean
}

export function screenInput(message: string): InputScreen {
  const injection = STRONG_INJECTION_PATTERNS.some((pattern) => pattern.test(message)) ? "strong" : null
  const clinical =
    CLINICAL_PATTERNS.some((pattern) => pattern.test(message)) && !THIRD_PARTY_FRAMING.test(message)
  return { injection, clinical }
}

/* ------------------------------------------------------------------------------------------
 * Heuristic relevance — used alongside the model classifier, and alone when it is unavailable.
 * ---------------------------------------------------------------------------------------- */

const IN_DOMAIN_TERMS = [
  "digital twin", "twin", "avatar", "digital human", "ai", "artificial intelligence", "agent",
  "chatbot", "assistant", "consultation", "expert", "myos", "myo s", "knowledge", "faq",
  "onboarding", "training", "train", "teach", "tutor", "exam", "assessment", "course",
  "patients", "students", "customers", "employees", "staff", "citizens", "visitors", "members",
  "deploy", "deployment", "integrate", "integration", "lms", "crm", "erp", "website", "portal",
  "multilingual", "languages", "escalation", "handoff", "pricing", "price", "cost", "budget",
  "timeline", "demo", "pilot", "privacy", "security", "compliance", "gdpr", "hipaa", "data",
  "documents", "sop", "sops", "policies", "simulation", "automation", "workflow", "service",
  "services", "product", "use case", "solution", "proposal", "voice", "video", "lip sync",
  "platform", "app", "support", "guidance", "clinic", "hospital", "university", "school",
  "government", "company", "business", "organization", "organisation", "team", "department",
]

const OFF_TOPIC_TERMS = [
  "recipe", "weather", "poem", "joke", "song lyrics", "horoscope", "capital of", "homework",
  "football", "soccer score", "nba", "movie recommendation", "stock price", "bitcoin price",
  "lottery", "dating advice", "write my essay", "solve this equation", "translate this",
  "who won", "celebrity", "video game cheats",
]

function containsTerm(padded: string, term: string): boolean {
  return padded.includes(` ${normalizeForMatching(term)} `)
}

export type HeuristicRelevance = "in" | "out" | "unclear"

export function heuristicRelevance(
  message: string,
  context: { midConversation: boolean },
): HeuristicRelevance {
  const padded = ` ${normalizeForMatching(message)} `
  const words = padded.trim().split(" ").filter(Boolean)

  const offTopic = OFF_TOPIC_TERMS.some((term) => containsTerm(padded, term))
  const explicitlyInDomain = IN_DOMAIN_TERMS.some((term) => containsTerm(padded, term))
  // The industry classifier is generous ("recipe" → restaurants), so it only counts when
  // nothing in the message marks it as an unrelated request.
  const industryMentioned = !offTopic && Boolean(classifyFreeText(message).answers.domain)

  if (offTopic && !explicitlyInDomain) return "out"
  if ((explicitlyInDomain || industryMentioned) && !offTopic) return "in"
  // Short replies mid-conversation ("about 200", "yes, Spanish too") answer the last question.
  if (context.midConversation && words.length <= 12 && !offTopic) return "in"
  return "unclear"
}

export type ScopeDecision = "in_scope" | "off_topic" | "injection" | "clinical" | "unsafe"

export interface ScopeSignals {
  screen: InputScreen
  heuristic: HeuristicRelevance
  classifier: RelevanceResult | null
  modelScope: "in_scope" | "off_topic" | "clinical_advice" | "injection_attempt" | null
}

/**
 * Combines independent signals. A redirect needs agreement, or one very confident signal, so a
 * single misjudgement does not derail a genuine consultation.
 */
export function decideScope(signals: ScopeSignals): ScopeDecision {
  const { screen, heuristic, classifier, modelScope } = signals

  if (screen.injection === "strong") return "injection"
  if (screen.clinical) return "clinical"

  if (classifier) {
    const { category, confidence } = classifier
    if (category === "unsafe" && confidence >= 0.6) return "unsafe"
    if (category === "injection_attempt" && (confidence >= 0.8 || modelScope === "injection_attempt")) {
      return "injection"
    }
    if (category === "clinical_advice" && (confidence >= 0.8 || modelScope === "clinical_advice")) {
      return "clinical"
    }
    if (category === "off_topic") {
      if (heuristic === "in" && confidence < 0.9) return "in_scope"
      if (confidence >= 0.75 || modelScope === "off_topic" || heuristic === "out") return "off_topic"
    }
    return "in_scope"
  }

  if (modelScope === "injection_attempt") return "injection"
  if (modelScope === "clinical_advice") return "clinical"
  if (modelScope === "off_topic" && heuristic !== "in") return "off_topic"
  if (modelScope === null && heuristic === "out") return "off_topic"
  return "in_scope"
}

export function redirectFor(decision: Exclude<ScopeDecision, "in_scope">): string {
  switch (decision) {
    case "injection":
      return INJECTION_REPLY
    case "clinical":
      return CLINICAL_REPLY
    case "unsafe":
      return UNSAFE_REPLY
    default:
      return OFF_TOPIC_REPLY
  }
}

/* ------------------------------------------------------------------------------------------
 * Output validation
 * ---------------------------------------------------------------------------------------- */

const NEGATION = /\b(not|never|no|without|cannot|can't|won't|doesn't|don't|isn't|aren't|nor|instead of)\b|n't\b/i

function negatedBefore(text: string, index: number): boolean {
  return NEGATION.test(text.slice(Math.max(0, index - 48), index))
}

const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s)]+/gi
const CURRENCY_PATTERN =
  /(?:[$€£¥]\s?\d[\d,.]*\s?[kKmM]?\b|\b\d[\d,.]*\s?[kKmM]?\s?(?:USD|AED|EUR|GBP|dollars|euros|dirhams|pounds)\b|\b(?:USD|AED|EUR|GBP)\s?\d[\d,.]*)/g
const PERCENT_PATTERN = /\b\d{1,3}(?:\.\d+)?\s?%/g
const GUARANTEE_PATTERN =
  /\b(guarantee[ds]?|guaranteeing|100% (?:accurate|accuracy|reliable|uptime)|error[- ]free|never makes? mistakes|zero errors|risk[- ]free)\b/gi
const REPLACEMENT_PATTERN =
  /\b(replaces?|replacing|eliminates?|eliminating|substitutes? for)\s+(?:the need for\s+)?(?:your\s+|human\s+|qualified\s+|real\s+)*(doctors?|physicians?|clinicians?|nurses?|teachers?|professors?|lawyers?|professionals?|experts?|staff)\b/gi
const DIAGNOSIS_PATTERN =
  /\b(you (?:likely |probably |may |might )?have (?:a |an )?\w*\s?(?:condition|disease|infection|disorder|syndrome)|i (?:can )?diagnose|your diagnosis is|you should (?:take|stop taking|increase|decrease) (?:your )?(?:medication|dose|meds))\b/gi
const LEAK_PATTERN =
  /\b(system prompt|my instructions (?:are|say)|BEGIN_KNOWLEDGE|END_KNOWLEDGE|GEMINI_API_KEY|responseJsonSchema)\b/gi
const CASE_STUDY_PATTERN = /\b(case stud(?:y|ies)|our clients? (?:include|such as|like)|trusted by \d+)\b/gi

export interface OutputCheckContext {
  /** Everything the visitor has typed — figures they supplied may be repeated back. */
  userText: string
}

export interface OutputCheck {
  ok: boolean
  text: string
  violations: string[]
}

function figuresIn(text: string): Set<string> {
  return new Set((text.match(/\d[\d,.]*/g) ?? []).map((figure) => figure.replace(/[,.]$/, "")))
}

/**
 * Checks one piece of generated text. Cosmetic problems (links) are repaired; substantive ones
 * (prices, guarantees, statistics the visitor never gave, claims about replacing people,
 * diagnoses, leaked configuration, invented case studies) fail the check so the caller can
 * retry or fall back.
 */
export function checkGeneratedText(raw: string, context: OutputCheckContext, maxLength = 1_400): OutputCheck {
  const violations: string[] = []
  let text = sanitizeReply(raw, maxLength)

  if (URL_PATTERN.test(text)) {
    text = text.replace(URL_PATTERN, "").replace(/\(\s*\)/g, "").replace(/ {2,}/g, " ").trim()
    violations.push("url_removed")
  }
  URL_PATTERN.lastIndex = 0

  const userFigures = figuresIn(context.userText)
  const unsupported = (pattern: RegExp) =>
    [...text.matchAll(pattern)].some((match) => {
      const figures = [...figuresIn(match[0])]
      return figures.length === 0 || figures.some((figure) => !userFigures.has(figure))
    })

  if (unsupported(CURRENCY_PATTERN)) violations.push("price")
  if (unsupported(PERCENT_PATTERN)) violations.push("statistic")

  for (const [name, pattern] of [
    ["guarantee", GUARANTEE_PATTERN],
    ["replaces_professionals", REPLACEMENT_PATTERN],
  ] as const) {
    for (const match of text.matchAll(pattern)) {
      if (!negatedBefore(text, match.index ?? 0)) {
        violations.push(name)
        break
      }
    }
  }

  if (DIAGNOSIS_PATTERN.test(text)) violations.push("diagnosis")
  DIAGNOSIS_PATTERN.lastIndex = 0
  if (LEAK_PATTERN.test(text)) violations.push("leak")
  LEAK_PATTERN.lastIndex = 0
  if (CASE_STUDY_PATTERN.test(text)) violations.push("case_study")
  CASE_STUDY_PATTERN.lastIndex = 0

  const fatal = violations.filter((violation) => violation !== "url_removed")
  return { ok: fatal.length === 0 && text.length > 0, text, violations }
}

/** Checks several strings at once; fails if any fails. */
export function checkGeneratedTexts(texts: string[], context: OutputCheckContext): string[] {
  return texts.flatMap((text) => checkGeneratedText(text, context, 2_000).violations).filter(
    (violation) => violation !== "url_removed",
  )
}

/* ------------------------------------------------------------------------------------------
 * Confirmation
 * ---------------------------------------------------------------------------------------- */

/** Phrases that mean "yes, proceed" on their own. */
const CONFIRMING =
  "(?:yes|yep|yeah|confirm(?:ed)?|approve(?:d)?|looks (?:good|great|right)|that'?s (?:right|correct|perfect)|go ahead|sounds good|let'?s do it|(?:ok(?:ay)?|sure|great|perfect)[\\s,]+(?:go ahead|generate|confirm|create|build)(?: it| the page| my page)?|(?:generate|create|build|make)(?: it| the page| my page))"
/** Words that may follow, but never confirm alone ("thanks" is not a confirmation). */
const TRAILING = `(?:${CONFIRMING}|please|thanks|thank you|perfect|great)`
/** Only affirmative phrases and nothing else — "yes, but…" is not a confirmation. */
const CONFIRMATION_PATTERN = new RegExp(`^${CONFIRMING}[\\s.,!]*(?:${TRAILING}[\\s.,!]*){0,3}$`, "i")

/**
 * Typed confirmation is matched deterministically — the model's opinion that the visitor
 * "probably agreed" can never trigger page generation.
 */
export function isTypedConfirmation(message: string): boolean {
  return CONFIRMATION_PATTERN.test(message.trim())
}
