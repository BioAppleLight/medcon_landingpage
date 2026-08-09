import type { AnswerSet, ChatRequest, Result, SessionState } from "./types.ts"

/**
 * The boundary. Everything here answers one question: is this well-formed? Malformed input is
 * rejected with a typed error — never repaired, never guessed at. Whether the values are
 * *meaningful* (a real node, a real choice) is the engine's job, re-derived from the tree.
 */

export const MAX_BODY_LENGTH = 4000
export const MAX_MESSAGE_LENGTH = 500
export const MAX_ID_LENGTH = 64
export const MAX_ANSWER_SLOTS = 9
export const MAX_ANSWER_KEY_LENGTH = 32
/** Deliberately looser than the engine's capture cap, so engine output always round-trips. */
export const MAX_ANSWER_VALUE_LENGTH = 200
export const MAX_ASKED_NODES = 24

const ID_PATTERN = /^[A-Za-z0-9_-]+$/
const ANSWER_KEY_PATTERN = /^[a-z]+(_[a-z]+)*$/
const ANSWER_KEYS = new Set([
  "domain",
  "goal",
  "audience",
  "interaction",
  "tone",
  "outcome",
  "requirement",
  // Accepted only for backward compatibility with sessions from the previous flow.
  "scale",
  "note",
])

function invalid(message: string): Result<never> {
  return { ok: false, error: { code: "INVALID_REQUEST", message } }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_ID_LENGTH &&
    ID_PATTERN.test(value)
  )
}

/** Strips control and formatting characters and collapses whitespace. Never interprets. */
export function sanitizeFreeText(text: string): string {
  return text
    .replace(/[\p{Cc}\p{Cf}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function parseAnswers(value: unknown): Result<AnswerSet> {
  if (!isPlainObject(value)) return invalid("The state.answers field must be an object.")

  const entries = Object.entries(value)
  if (entries.length > MAX_ANSWER_SLOTS) {
    return invalid("The state.answers field has too many entries.")
  }

  const answers: Record<string, string> = {}

  for (const [key, raw] of entries) {
    if (
      key.length > MAX_ANSWER_KEY_LENGTH ||
      !ANSWER_KEY_PATTERN.test(key) ||
      !ANSWER_KEYS.has(key)
    ) {
      return invalid("The state.answers field contains an unsupported key.")
    }
    if (typeof raw !== "string" || raw.length > MAX_ANSWER_VALUE_LENGTH) {
      return invalid("The state.answers field contains an unsupported value.")
    }

    const cleaned = sanitizeFreeText(raw)
    if (cleaned) answers[key] = cleaned
  }

  return { ok: true, value: answers as AnswerSet }
}

function parseState(value: unknown): Result<SessionState> {
  if (!isPlainObject(value)) return invalid("The state field must be an object.")

  if (!isId(value.session_id)) return invalid("The state.session_id field is malformed.")

  if (value.current_node !== null && !isId(value.current_node)) {
    return invalid("The state.current_node field is malformed.")
  }

  if (!Array.isArray(value.asked) || value.asked.length > MAX_ASKED_NODES) {
    return invalid("The state.asked field is malformed.")
  }
  if (!value.asked.every(isId)) return invalid("The state.asked field is malformed.")

  const answers = parseAnswers(value.answers)
  if (!answers.ok) return answers

  return {
    ok: true,
    value: {
      session_id: value.session_id,
      current_node: value.current_node as string | null,
      answers: answers.value,
      asked: value.asked as string[],
    },
  }
}

/** Parses a `POST /api/chat` body. A missing `state` means "start a new conversation". */
export function parseChatRequest(body: unknown): Result<ChatRequest> {
  if (!isPlainObject(body)) return invalid("The request body must be a JSON object.")

  const { choice_id, message, state } = body

  if (choice_id !== undefined && choice_id !== null && !isId(choice_id)) {
    return invalid("The choice_id field is malformed.")
  }

  if (message !== undefined && message !== null && typeof message !== "string") {
    return invalid("The message field must be a string.")
  }

  if (typeof message === "string" && message.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      error: {
        code: "MESSAGE_TOO_LONG",
        message: `Messages are limited to ${MAX_MESSAGE_LENGTH} characters.`,
      },
    }
  }

  let parsedState: SessionState | null = null

  if (state !== undefined && state !== null) {
    const result = parseState(state)
    if (!result.ok) return result
    parsedState = result.value
  }

  return {
    ok: true,
    value: {
      choice_id: typeof choice_id === "string" ? choice_id : null,
      message: typeof message === "string" ? sanitizeFreeText(message) || null : null,
      state: parsedState,
    },
  }
}
