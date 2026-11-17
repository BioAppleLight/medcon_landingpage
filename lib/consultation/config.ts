/**
 * Server-only configuration for the AI consultant. Every value has a safe default so the site
 * still builds and runs without any of these set; the consultant then falls back to the
 * deterministic engine and says so.
 *
 * Nothing here is ever sent to the browser — none of these names carry `NEXT_PUBLIC_`.
 */

export interface ConsultantConfig {
  geminiApiKey: string | null
  /** Optional API base URL override (an egress proxy, or a local mock in tests). */
  geminiBaseUrl: string | null
  /** Main consultation model. An alias such as `gemini-flash-latest`, or a pinned id. */
  geminiModel: string
  /** Model for the relevance classifier. Defaults to the main model. */
  classifierModel: string
  turnTimeoutMs: number
  generationTimeoutMs: number
  maxRetries: number
  maxOutputTokens: number
  streaming: boolean
  /** Per-owner message limits. */
  messagesPerMinute: number
  messagesPerDay: number
  /** Per-IP request limit across all owners. */
  ipRequestsPerMinute: number
  /** User turns allowed in one consultation before the visitor is asked to book a call. */
  maxTurnsPerConsultation: number
  recordTtlDays: number
  store: "redis" | "file" | "memory"
  redisUrl: string | null
  redisToken: string | null
  fileStoreDir: string
  secureCookies: boolean
}

function intFrom(value: string | undefined, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(value ?? "", 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

function nonEmpty(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function readConsultantConfig(env: Record<string, string | undefined> = process.env): ConsultantConfig {
  const redisUrl = nonEmpty(env.UPSTASH_REDIS_REST_URL) ?? nonEmpty(env.KV_REST_API_URL)
  const redisToken = nonEmpty(env.UPSTASH_REDIS_REST_TOKEN) ?? nonEmpty(env.KV_REST_API_TOKEN)
  const requestedStore = nonEmpty(env.CONSULTATION_STORE)
  const isProduction = env.NODE_ENV === "production"

  let store: ConsultantConfig["store"]
  if (requestedStore === "redis" || requestedStore === "file" || requestedStore === "memory") {
    store = requestedStore
  } else if (redisUrl && redisToken) {
    store = "redis"
  } else {
    // Serverless production has no durable writable disk, so a file store there would silently
    // lose data. Memory is at least honest about being temporary (and is logged at startup).
    store = isProduction ? "memory" : "file"
  }

  const geminiModel = nonEmpty(env.GEMINI_MODEL) ?? "gemini-flash-latest"

  return {
    geminiApiKey: nonEmpty(env.GEMINI_API_KEY),
    geminiBaseUrl: nonEmpty(env.GEMINI_API_BASE_URL),
    geminiModel,
    classifierModel: nonEmpty(env.GEMINI_CLASSIFIER_MODEL) ?? geminiModel,
    turnTimeoutMs: intFrom(env.GEMINI_TIMEOUT_MS, 25_000, 2_000, 55_000),
    generationTimeoutMs: intFrom(env.GEMINI_GENERATION_TIMEOUT_MS, 40_000, 5_000, 55_000),
    maxRetries: intFrom(env.GEMINI_MAX_RETRIES, 2, 0, 4),
    maxOutputTokens: intFrom(env.GEMINI_MAX_OUTPUT_TOKENS, 4_096, 512, 16_384),
    streaming: env.CONSULTANT_STREAMING !== "false",
    messagesPerMinute: intFrom(env.CONSULTANT_MESSAGES_PER_MINUTE, 12, 1, 600),
    messagesPerDay: intFrom(env.CONSULTANT_MESSAGES_PER_DAY, 200, 1, 100_000),
    ipRequestsPerMinute: intFrom(env.CONSULTANT_IP_REQUESTS_PER_MINUTE, 60, 1, 6_000),
    maxTurnsPerConsultation: intFrom(env.CONSULTANT_MAX_TURNS, 60, 5, 500),
    recordTtlDays: intFrom(env.CONSULTATION_TTL_DAYS, 90, 1, 3_650),
    store,
    redisUrl,
    redisToken,
    fileStoreDir: nonEmpty(env.CONSULTATION_FILE_STORE_DIR) ?? ".data/consultations",
    secureCookies: isProduction,
  }
}
