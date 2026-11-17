import { handleChatGet, handleChatPost } from "@/lib/consultation/http"
import { getConsultantRuntime } from "@/lib/consultation/runtime"

/**
 * `/api/chat` — HTTP entry point for both chat protocols. All logic lives in
 * `lib/consultation/http.ts` (consultation protocol, with the legacy rule-based protocol
 * dispatched to `lib/chat-legacy-handler.ts`). Gemini is only ever called from the server.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function POST(request: Request) {
  return handleChatPost(request, getConsultantRuntime())
}

export async function GET(request: Request) {
  return handleChatGet(request, getConsultantRuntime())
}
