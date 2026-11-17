import { GoogleGenAI, type GenerateContentParameters, type GenerateContentResponse } from "@google/genai"
import { ModelError, type ModelClient, type ModelRequest } from "./model.ts"

/**
 * Google Gemini via the official `@google/genai` SDK. Server-only: the key is read from the
 * server environment by the caller and never leaves this process.
 */

function toParams(request: ModelRequest, signal: AbortSignal): GenerateContentParameters {
  return {
    model: request.model,
    contents: request.contents.map((content) => ({
      role: content.role,
      parts: [{ text: content.text }],
    })),
    config: {
      systemInstruction: request.system,
      responseMimeType: "application/json",
      responseJsonSchema: request.jsonSchema,
      temperature: request.temperature,
      maxOutputTokens: request.maxOutputTokens,
      abortSignal: signal,
      httpOptions: { timeout: request.timeoutMs },
    },
  }
}

function withDeadline(timeoutMs: number, outer?: AbortSignal) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new ModelError("timeout", "timed out")), timeoutMs)
  const onAbort = () => controller.abort(outer?.reason)
  outer?.addEventListener("abort", onAbort, { once: true })
  return {
    signal: controller.signal,
    timedOut: () => controller.signal.reason instanceof ModelError,
    dispose: () => {
      clearTimeout(timer)
      outer?.removeEventListener("abort", onAbort)
    },
  }
}

function assertUsable(response: GenerateContentResponse): string {
  const blockReason = response.promptFeedback?.blockReason
  if (blockReason) throw new ModelError("blocked", "The request was blocked by the provider.")
  const finish = response.candidates?.[0]?.finishReason
  if (finish === "SAFETY" || finish === "PROHIBITED_CONTENT" || finish === "BLOCKLIST") {
    throw new ModelError("blocked", "The response was blocked by the provider.")
  }
  const text = response.text
  if (!text) throw new ModelError("malformed", "The model returned an empty response.")
  if (finish === "MAX_TOKENS") throw new ModelError("malformed", "The model response was truncated.")
  return text
}

export function createGeminiClient(apiKey: string, baseUrl: string | null = null): ModelClient {
  const ai = new GoogleGenAI({ apiKey, ...(baseUrl ? { httpOptions: { baseUrl } } : {}) })

  return {
    async generate(request) {
      const deadline = withDeadline(request.timeoutMs, request.signal)
      try {
        const response = await ai.models.generateContent(toParams(request, deadline.signal))
        return assertUsable(response)
      } catch (error) {
        if (deadline.timedOut()) throw new ModelError("timeout", "The model call timed out.")
        throw error
      } finally {
        deadline.dispose()
      }
    },

    async *stream(request) {
      const deadline = withDeadline(request.timeoutMs, request.signal)
      try {
        const stream = await ai.models.generateContentStream(toParams(request, deadline.signal))
        let finish: string | undefined
        for await (const chunk of stream) {
          if (chunk.promptFeedback?.blockReason) throw new ModelError("blocked", "The request was blocked.")
          finish = chunk.candidates?.[0]?.finishReason ?? finish
          const text = chunk.text
          if (text) yield text
        }
        if (finish === "SAFETY" || finish === "PROHIBITED_CONTENT" || finish === "BLOCKLIST") {
          throw new ModelError("blocked", "The response was blocked by the provider.")
        }
        if (finish === "MAX_TOKENS") throw new ModelError("malformed", "The model response was truncated.")
      } catch (error) {
        if (deadline.timedOut()) throw new ModelError("timeout", "The model call timed out.")
        throw error
      } finally {
        deadline.dispose()
      }
    },
  }
}
