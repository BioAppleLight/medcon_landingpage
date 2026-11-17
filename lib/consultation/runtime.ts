import { readConsultantConfig, type ConsultantConfig } from "./config.ts"
import { createGeminiClient } from "./gemini-client.ts"
import { ConsultationService } from "./service.ts"
import { ConsultationRepository, FileStore, MemoryStore, RedisRestStore, type KeyValueStore } from "./store.ts"

/**
 * Process-wide wiring from environment variables. Server-only: imported by route handlers and
 * server components, never by client components.
 */

interface Runtime {
  config: ConsultantConfig
  service: ConsultationService
}

let runtime: Runtime | null = null

function createStore(config: ConsultantConfig): KeyValueStore {
  if (config.store === "redis") {
    if (!config.redisUrl || !config.redisToken) {
      throw new Error("CONSULTATION_STORE=redis requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.")
    }
    return new RedisRestStore(config.redisUrl, config.redisToken)
  }
  if (config.store === "file") return new FileStore(config.fileStoreDir)
  return new MemoryStore()
}

function log(event: string, detail?: Record<string, string | number | boolean>) {
  // Event names and coarse codes only — never visitor text, ids, or tokens.
  console.warn(`[consultant] ${event}`, detail ?? "")
}

export function getConsultantRuntime(): Runtime {
  if (runtime) return runtime

  const config = readConsultantConfig()
  const store = createStore(config)
  if (store.kind === "memory" && process.env.NODE_ENV === "production") {
    log("store_not_durable", { hint: "set UPSTASH_REDIS_REST_URL/TOKEN" })
  }
  if (!config.geminiApiKey) log("gemini_not_configured", { mode: "deterministic" })

  const service = new ConsultationService({
    repo: new ConsultationRepository(store, config.recordTtlDays),
    model: config.geminiApiKey ? createGeminiClient(config.geminiApiKey, config.geminiBaseUrl) : null,
    config,
    log,
  })
  runtime = { config, service }
  return runtime
}
