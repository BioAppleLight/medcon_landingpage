import { handleLegacyChat } from "../chat-legacy-handler.ts"
import { MAX_BODY_LENGTH } from "../validate.ts"
import {
  CONSULTATION_COOKIE,
  consultationCookie,
  isOwnerToken,
  newOwnerToken,
  OWNER_COOKIE,
  ownerCookie,
  parseCookies,
} from "./auth.ts"
import type { ConsultantConfig } from "./config.ts"
import type { Actor, ConsultationService, ServiceResult, StreamEvent } from "./service.ts"
import { ConsultationError, type ConsultationErrorCode } from "./types.ts"

/**
 * HTTP concerns for `/api/chat`: origin check, body limits, protocol dispatch, cookies, error
 * mapping, and server-sent events. Uses only web-standard Request/Response so it is testable
 * without Next.js.
 *
 * Protocol: a body with `action` is the consultation protocol; a body without one is the legacy
 * rule-based protocol, served unchanged.
 */

const ACTIONS = ["start", "message", "confirm", "preview", "revise", "reset", "share"] as const
type Action = (typeof ACTIONS)[number]

const STATUS: Record<ConsultationErrorCode, number> = {
  INVALID_REQUEST: 400,
  MESSAGE_TOO_LONG: 413,
  RATE_LIMITED: 429,
  NOT_FOUND: 404,
  CONFLICT: 409,
  BUSY: 409,
  FORBIDDEN: 403,
  LIMIT_REACHED: 429,
  INTERNAL_ERROR: 500,
}

export interface HttpDeps {
  service: ConsultationService
  config: ConsultantConfig
}

const NO_STORE = { "Cache-Control": "no-store" }

function errorBody(code: ConsultationErrorCode, message: string) {
  return { error: { code, message } }
}

function errorResponse(error: ConsultationError): Response {
  return Response.json(errorBody(error.code, error.publicMessage), { status: STATUS[error.code], headers: NO_STORE })
}

function toConsultationError(error: unknown): ConsultationError {
  if (error instanceof ConsultationError) return error
  // Deliberately opaque: no stack, no ids, no visitor text in logs or responses.
  console.error("POST /api/chat failed:", error instanceof Error ? error.name : "unknown")
  return new ConsultationError("INTERNAL_ERROR", "Something went wrong processing your message.")
}

/** Rejects cross-site POSTs. SameSite=Lax cookies already cover most cases; this covers the rest. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || request.headers.get("x-real-ip") || null
}

function actorFrom(request: Request): Actor {
  const cookies = parseCookies(request.headers.get("cookie"))
  return {
    ownerToken: cookies[OWNER_COOKIE] ?? null,
    consultationId: cookies[CONSULTATION_COOKIE] ?? null,
    ip: clientIp(request),
  }
}

function cookieHeaders(result: Pick<ServiceResult, "ownerToken" | "ownerTokenIsNew" | "consultationId">, actor: Actor, secure: boolean): Headers {
  const headers = new Headers(NO_STORE)
  if (result.ownerTokenIsNew || actor.ownerToken !== result.ownerToken) {
    headers.append("Set-Cookie", ownerCookie(result.ownerToken, secure))
  }
  if (result.consultationId && result.consultationId !== actor.consultationId) {
    headers.append("Set-Cookie", consultationCookie(result.consultationId, secure))
  }
  return headers
}

interface ParsedAction {
  action: Action
  message: string | null
  proposalVersion: number | null
  pageId: string | null
}

function parseAction(body: Record<string, unknown>): ParsedAction {
  const { action, message, proposal_version: proposalVersion, page_id: pageId } = body
  if (typeof action !== "string" || !(ACTIONS as readonly string[]).includes(action)) {
    throw new ConsultationError("INVALID_REQUEST", "Unknown action.")
  }
  if (message !== undefined && message !== null && typeof message !== "string") {
    throw new ConsultationError("INVALID_REQUEST", "The message field must be a string.")
  }
  if (action === "message" && (typeof message !== "string" || !message.trim())) {
    throw new ConsultationError("INVALID_REQUEST", "Please type a message.")
  }
  if (
    action === "confirm" &&
    (typeof proposalVersion !== "number" || !Number.isInteger(proposalVersion) || proposalVersion < 1 || proposalVersion > 10_000)
  ) {
    throw new ConsultationError("INVALID_REQUEST", "Confirm a specific proposal version.")
  }
  return {
    action: action as Action,
    message: typeof message === "string" ? message : null,
    proposalVersion: typeof proposalVersion === "number" ? proposalVersion : null,
    pageId: typeof pageId === "string" && pageId.length <= 64 ? pageId : null,
  }
}

export async function handleChatPost(request: Request, deps: HttpDeps): Promise<Response> {
  if (!sameOrigin(request)) {
    return Response.json(errorBody("FORBIDDEN", "Cross-site requests are not allowed."), { status: 403, headers: NO_STORE })
  }

  const raw = await request.text()
  if (raw.length > MAX_BODY_LENGTH) {
    return Response.json(errorBody("MESSAGE_TOO_LONG", "The request body is too large."), { status: 413, headers: NO_STORE })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return Response.json(errorBody("INVALID_REQUEST", "The request body must be valid JSON."), { status: 400, headers: NO_STORE })
  }

  if (typeof body !== "object" || body === null || Array.isArray(body) || !("action" in body)) {
    return handleLegacyChat(body)
  }

  const actor = actorFrom(request)
  let parsed: ParsedAction
  try {
    parsed = parseAction(body as Record<string, unknown>)
  } catch (error) {
    return errorResponse(toConsultationError(error))
  }

  const wantsStream =
    parsed.action === "message" &&
    deps.config.streaming &&
    (request.headers.get("accept") ?? "").includes("text/event-stream")
  if (wantsStream) return streamMessage(actor, parsed.message!, deps)

  try {
    const { service } = deps
    let result: ServiceResult
    let shareUrl: string | undefined

    switch (parsed.action) {
      case "start":
        result = await service.start(actor)
        break
      case "message":
        result = await service.message(actor, parsed.message!)
        break
      case "confirm":
        result = await service.confirm(actor, parsed.proposalVersion!)
        break
      case "preview":
        result = await service.preview(actor)
        break
      case "revise":
        result = await service.revise(actor)
        break
      case "reset":
        result = await service.reset(actor)
        break
      case "share": {
        const shared = await service.share(actor, parsed.pageId)
        result = shared.result
        shareUrl = shared.url
        break
      }
    }

    return Response.json(
      { consultation: result.view, ...(shareUrl ? { share_url: shareUrl } : {}) },
      { headers: cookieHeaders(result, actor, deps.config.secureCookies) },
    )
  } catch (error) {
    return errorResponse(toConsultationError(error))
  }
}

/**
 * Server-sent events: `delta` (reply text as it is generated), `reset` (discard deltas),
 * `final` (the validated consultation view — always authoritative), `error`.
 * Cookies must be known before the stream starts, so the consultation is resolved first.
 */
async function streamMessage(actor: Actor, message: string, deps: HttpDeps): Promise<Response> {
  let established: ServiceResult
  const ensured: Actor = { ...actor, ownerToken: isOwnerToken(actor.ownerToken) ? actor.ownerToken : newOwnerToken() }
  try {
    established = await deps.service.start(ensured)
  } catch (error) {
    return errorResponse(toConsultationError(error))
  }

  const working: Actor = { ...ensured, consultationId: established.consultationId }
  const headers = cookieHeaders(
    { ownerToken: established.ownerToken, ownerTokenIsNew: actor.ownerToken !== established.ownerToken, consultationId: established.consultationId },
    actor,
    deps.config.secureCookies,
  )
  headers.set("Content-Type", "text/event-stream; charset=utf-8")
  headers.set("Cache-Control", "no-store, no-transform")
  headers.set("X-Accel-Buffering", "no")

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }
      try {
        const result = await deps.service.message(working, message, (event: StreamEvent) => {
          send(event.type, event.type === "delta" ? { text: event.text } : event.type === "status" ? { status: event.status } : {})
        })
        send("final", { consultation: result.view })
      } catch (error) {
        const failure = toConsultationError(error)
        send("error", errorBody(failure.code, failure.publicMessage))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, { headers })
}

export async function handleChatGet(request: Request, deps: HttpDeps): Promise<Response> {
  const actor = actorFrom(request)
  if (!isOwnerToken(actor.ownerToken)) {
    return Response.json({ consultation: null }, { headers: NO_STORE })
  }
  try {
    const result = await deps.service.getState(actor)
    return Response.json({ consultation: result.view }, { headers: NO_STORE })
  } catch (error) {
    return errorResponse(toConsultationError(error))
  }
}
