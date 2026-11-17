import { advance, startSession } from "./chat-engine.ts"
import type { ApiError, ChatDecision, ChatResponse, ErrorCode } from "./types.ts"
import { createPageRef, getDomainLabel } from "./use-cases.ts"
import { parseChatRequest } from "./validate.ts"

/**
 * The original rule-based protocol of `POST /api/chat` (a request body without an `action`),
 * moved here verbatim from the route so the route can also serve the AI consultant. Kept for
 * clients and open tabs that still speak it; new clients use the consultation protocol.
 */

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 30
const RATE_LIMIT_MAX_KEYS = 5_000

/**
 * A courtesy limit, not a security control: it is per-process (so per-instance on serverless)
 * and keyed on a client-supplied session id.
 */
const rateLimitBuckets = new Map<string, number[]>()

const statusByCode: Record<ErrorCode, number> = {
  INVALID_REQUEST: 400,
  MESSAGE_TOO_LONG: 413,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
}

function errorResponse(error: ApiError) {
  return Response.json({ error }, { status: statusByCode[error.code] })
}

function isRateLimited(key: string): boolean {
  const now = Date.now()

  if (rateLimitBuckets.size >= RATE_LIMIT_MAX_KEYS) rateLimitBuckets.clear()

  const recent = (rateLimitBuckets.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  )

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitBuckets.set(key, recent)
    return true
  }

  recent.push(now)
  rateLimitBuckets.set(key, recent)
  return false
}

/** Handles an already-parsed legacy request body. */
export function handleLegacyChat(body: unknown): Response {
  try {
    const parsed = parseChatRequest(body)
    if (!parsed.ok) return errorResponse(parsed.error)

    const { choice_id, message, state } = parsed.value

    if (!state && (choice_id || message)) {
      return errorResponse({
        code: "INVALID_REQUEST",
        message: "Start a conversation before sending a choice or message.",
      })
    }

    if (state && isRateLimited(state.session_id)) {
      return errorResponse({
        code: "RATE_LIMITED",
        message: "Too many messages. Please wait a moment and try again.",
      })
    }

    let decision: ChatDecision

    if (!state) {
      decision = startSession(crypto.randomUUID())
    } else {
      const result = advance(state, { choice_id, message })
      if (!result.ok) return errorResponse(result.error)
      decision = result.value
    }

    const page = decision.status === "ready" ? createPageRef(decision.state.answers) : null

    if (decision.status === "ready" && !page) {
      return errorResponse({
        code: "INTERNAL_ERROR",
        message: "The use case page could not be built.",
      })
    }

    const response: ChatResponse = {
      status: decision.status,
      reply: decision.reply,
      state: decision.state,
      next_question: decision.next_question,
      page,
      done: decision.status === "ready",
      industry_label: getDomainLabel(decision.state.answers.domain),
    }

    return Response.json(response)
  } catch {
    console.error("POST /api/chat (legacy) failed")
    return errorResponse({
      code: "INTERNAL_ERROR",
      message: "Something went wrong processing your message.",
    })
  }
}
