import { NextResponse } from "next/server"
import { advance, startSession } from "@/lib/chat-engine"
import type { ApiError, ChatDecision, ChatResponse, ErrorCode } from "@/lib/types"
import { createPageRef, getDomainLabel } from "@/lib/use-cases"
import { MAX_BODY_LENGTH, parseChatRequest } from "@/lib/validate"

/**
 * The only HTTP entry point. This file owns HTTP concerns and nothing else — no tree logic,
 * no content strings, no branching decisions about the conversation.
 */

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 30
const RATE_LIMIT_MAX_KEYS = 5_000

/**
 * A courtesy limit, not a security control: it is per-process (so per-instance on serverless)
 * and keyed on a client-supplied session id. A real limit needs a shared store, which would be
 * an architecture change.
 */
const rateLimitBuckets = new Map<string, number[]>()

const statusByCode: Record<ErrorCode, number> = {
  INVALID_REQUEST: 400,
  MESSAGE_TOO_LONG: 413,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
}

function errorResponse(error: ApiError) {
  return NextResponse.json({ error }, { status: statusByCode[error.code] })
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

export async function POST(request: Request) {
  try {
    const raw = await request.text()

    if (raw.length > MAX_BODY_LENGTH) {
      return errorResponse({
        code: "MESSAGE_TOO_LONG",
        message: "The request body is too large.",
      })
    }

    let body: unknown
    try {
      body = JSON.parse(raw)
    } catch {
      return errorResponse({
        code: "INVALID_REQUEST",
        message: "The request body must be valid JSON.",
      })
    }

    const parsed = parseChatRequest(body)
    if (!parsed.ok) return errorResponse(parsed.error)

    const { choice_id, message, state } = parsed.value

    if (!state && (choice_id || message)) {
      return errorResponse({
        code: "INVALID_REQUEST",
        message: "Start a conversation before sending a choice or message.",
      })
    }

    // A new conversation has no session id yet. Putting every new visitor in one shared
    // "anonymous" bucket lets any 30 requests block startup for everyone in this process.
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
      // The engine said the tree was complete but no page came back. Say so rather than
      // returning a success with a link that does not exist.
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

    return NextResponse.json(response)
  } catch {
    // Deliberately opaque: no stack, no node ids, no visitor text.
    console.error("POST /api/chat failed")
    return errorResponse({
      code: "INTERNAL_ERROR",
      message: "Something went wrong processing your message.",
    })
  }
}

export function GET() {
  return NextResponse.json(
    { error: { code: "INVALID_REQUEST", message: "Use POST for this endpoint." } },
    { status: 405, headers: { Allow: "POST" } },
  )
}
