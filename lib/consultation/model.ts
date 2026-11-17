import type { z } from "zod"

/**
 * The seam between consultation logic and any LLM provider. The service only ever sees this
 * interface, so tests substitute a scripted client and the Gemini SDK stays in one file.
 */

export interface ModelContent {
  role: "user" | "model"
  text: string
}

export interface ModelRequest {
  model: string
  system: string
  contents: ModelContent[]
  jsonSchema: Record<string, unknown>
  temperature: number
  maxOutputTokens: number
  timeoutMs: number
  signal?: AbortSignal
}

export interface ModelClient {
  /** Returns the raw text of one JSON response. */
  generate(request: ModelRequest): Promise<string>
  /** Yields raw text chunks of one JSON response, when the provider supports streaming. */
  stream?(request: ModelRequest): AsyncIterable<string>
}

export type ModelErrorKind =
  | "timeout"
  | "rate_limited"
  | "unavailable"
  | "malformed"
  | "blocked"
  | "aborted"
  | "config"

export class ModelError extends Error {
  readonly kind: ModelErrorKind

  constructor(kind: ModelErrorKind, message: string) {
    super(message)
    this.kind = kind
  }

  get retryable(): boolean {
    return this.kind === "timeout" || this.kind === "rate_limited" || this.kind === "unavailable" || this.kind === "malformed"
  }
}

export function toModelError(error: unknown): ModelError {
  if (error instanceof ModelError) return error
  const record = (typeof error === "object" && error !== null ? error : {}) as Record<string, unknown>
  const status = typeof record.status === "number" ? record.status : null
  const name = typeof record.name === "string" ? record.name : ""
  const message = error instanceof Error ? error.message : String(error)

  if (name === "AbortError" || /aborted/i.test(message)) return new ModelError("aborted", "The model call was aborted.")
  if (/timed? ?out|timeout|ETIMEDOUT/i.test(message) || name === "TimeoutError") {
    return new ModelError("timeout", "The model call timed out.")
  }
  if (status === 429 || /RESOURCE_EXHAUSTED|rate limit|quota/i.test(message)) {
    return new ModelError("rate_limited", "The model provider is rate limiting requests.")
  }
  if (status === 401 || status === 403 || /API key/i.test(message)) {
    return new ModelError("config", "The model provider rejected the credentials.")
  }
  if (status === 400 && /safety|blocked/i.test(message)) return new ModelError("blocked", "The response was blocked.")
  if (status === 400) return new ModelError("config", "The model provider rejected the request.")
  return new ModelError("unavailable", "The model provider is unavailable.")
}

/** Strips a Markdown code fence if a model wraps its JSON in one. */
export function stripJsonFence(text: string): string {
  const trimmed = text.trim()
  const fenced = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed)
  return fenced ? fenced[1] : trimmed
}

export function parseStructured<T>(raw: string, schema: z.ZodType<T>): T {
  let data: unknown
  try {
    data = JSON.parse(stripJsonFence(raw))
  } catch {
    throw new ModelError("malformed", "The model returned invalid JSON.")
  }
  const result = schema.safeParse(data)
  if (!result.success) throw new ModelError("malformed", "The model returned JSON that does not match the schema.")
  return result.data
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new ModelError("aborted", "aborted"))
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(new ModelError("aborted", "aborted"))
    }, { once: true })
  })

export interface StructuredCallOptions<T> {
  retries: number
  /**
   * Streams when set and supported. Receives the accumulated raw text of the current attempt.
   * Called again from scratch on a retry, so consumers must handle a reset.
   */
  onPartial?: (accumulated: string, attempt: number) => void
  /** Extra validation after the schema passes; return a reason to reject and retry. */
  accept?: (value: T) => string | null
  baseDelayMs?: number
}

export interface StructuredCallResult<T> {
  value: T
  attempts: number
}

/**
 * One structured model call with bounded retries. Retries cover transient provider errors and
 * malformed or rejected output; configuration errors and aborts fail immediately.
 */
export async function callStructured<T>(
  client: ModelClient,
  request: ModelRequest,
  schema: z.ZodType<T>,
  options: StructuredCallOptions<T>,
): Promise<StructuredCallResult<T>> {
  const maxAttempts = Math.max(1, options.retries + 1)
  const baseDelay = options.baseDelayMs ?? 400
  let lastError: ModelError = new ModelError("unavailable", "No attempt was made.")

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      let raw = ""
      if (options.onPartial && client.stream) {
        for await (const chunk of client.stream(request)) {
          raw += chunk
          options.onPartial(raw, attempt)
        }
      } else {
        raw = await client.generate(request)
      }

      const value = parseStructured(raw, schema)
      const rejection = options.accept?.(value) ?? null
      if (rejection) throw new ModelError("malformed", `Output rejected: ${rejection}`)
      return { value, attempts: attempt }
    } catch (error) {
      lastError = toModelError(error)
      if (!lastError.retryable || attempt === maxAttempts || request.signal?.aborted) break
      const delay = baseDelay * 2 ** (attempt - 1) * (lastError.kind === "rate_limited" ? 2 : 1)
      await sleep(delay + Math.floor(Math.random() * 150), request.signal)
    }
  }

  throw lastError
}

/**
 * Reads the (possibly incomplete) value of a top-level string property from a JSON document
 * that is still streaming in. Used to show the reply while the rest of the JSON arrives.
 */
export function readPartialStringField(buffer: string, key: string): string | null {
  const match = new RegExp(`"${key}"\\s*:\\s*"`).exec(buffer)
  if (!match) return null

  let index = match.index + match[0].length
  let out = ""
  while (index < buffer.length) {
    const char = buffer[index]
    if (char === '"') return out
    if (char === "\\") {
      const next = buffer[index + 1]
      if (next === undefined) return out
      if (next === "u") {
        const hex = buffer.slice(index + 2, index + 6)
        if (hex.length < 4) return out
        out += String.fromCharCode(Number.parseInt(hex, 16))
        index += 6
        continue
      }
      out += ({ n: "\n", t: "\t", r: "", b: "", f: "", '"': '"', "\\": "\\", "/": "/" } as Record<string, string>)[next] ?? next
      index += 2
      continue
    }
    out += char
    index++
  }
  return out
}
