import { NextResponse } from "next/server"
import { getChatDecision, type ChatMessage } from "@/lib/chat-intent"

const MAX_MESSAGE_LENGTH = 2000
const MAX_HISTORY_LENGTH = 20

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status })
}

function isValidHistory(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value)) return false
  if (value.length > MAX_HISTORY_LENGTH) return false

  return value.every(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      (entry.role === "user" || entry.role === "assistant") &&
      typeof entry.content === "string" &&
      entry.content.length <= MAX_MESSAGE_LENGTH,
  )
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return errorResponse("INVALID_REQUEST", "Request body must be valid JSON.", 400)
  }

  if (!body || typeof body !== "object") {
    return errorResponse("INVALID_REQUEST", "The message field is required.", 400)
  }

  const { message, conversation_id, history } = body as Record<string, unknown>

  if (typeof message !== "string" || message.trim().length === 0) {
    return errorResponse("INVALID_REQUEST", "The message field is required.", 400)
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return errorResponse("INVALID_REQUEST", "The message field is too long.", 400)
  }

  if (history !== undefined && !isValidHistory(history)) {
    return errorResponse("INVALID_REQUEST", "The history field is malformed.", 400)
  }

  if (conversation_id !== undefined && typeof conversation_id !== "string") {
    return errorResponse("INVALID_REQUEST", "The conversation_id field must be a string.", 400)
  }

  try {
    const decision = getChatDecision(message, (history as ChatMessage[] | undefined) ?? [])

    return NextResponse.json({
      reply: decision.reply,
      conversation_id: conversation_id ?? null,
      needs_clarification: decision.needs_clarification,
      requires_confirmation: decision.requires_confirmation,
      page: decision.page,
    })
  } catch {
    return errorResponse("INTERNAL_ERROR", "Something went wrong processing your message.", 500)
  }
}
