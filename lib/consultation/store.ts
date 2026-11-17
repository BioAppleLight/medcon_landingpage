import type { Consultation, GeneratedPageRecord } from "./types.ts"
import { ConsultationError } from "./types.ts"

/**
 * Persistence. Consultations and pages are documents read and written by id, so a key-value
 * store fits: in production, Upstash Redis over its REST API (available on Vercel through the
 * Marketplace, no connection pooling, no schema migrations); in development, JSON files; in
 * tests, memory. All three implement the same small interface.
 */

export interface KeyValueStore {
  readonly kind: "memory" | "file" | "redis"
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttlMs?: number): Promise<void>
  /** Sets only if absent. Returns true when this call created the key. */
  setIfAbsent(key: string, value: string, ttlMs: number): Promise<boolean>
  delete(key: string): Promise<void>
  /** Deletes only if the current value equals `value` (safe lock release). */
  deleteIfEquals(key: string, value: string): Promise<void>
  /** Increments a counter, starting its expiry window on first use. */
  increment(key: string, ttlMs: number): Promise<number>
}

/* ------------------------------------------------------------------------------------------
 * Memory
 * ---------------------------------------------------------------------------------------- */

export class MemoryStore implements KeyValueStore {
  readonly kind: KeyValueStore["kind"] = "memory"
  private readonly data = new Map<string, { value: string; expiresAt: number | null }>()
  private readonly maxKeys: number
  private readonly now: () => number

  constructor(options: { maxKeys?: number; now?: () => number } = {}) {
    this.maxKeys = options.maxKeys ?? 20_000
    this.now = options.now ?? Date.now
  }

  private live(key: string) {
    const entry = this.data.get(key)
    if (!entry) return null
    if (entry.expiresAt !== null && entry.expiresAt <= this.now()) {
      this.data.delete(key)
      return null
    }
    return entry
  }

  private evictIfFull() {
    if (this.data.size < this.maxKeys) return
    const oldest = this.data.keys().next().value
    if (oldest !== undefined) this.data.delete(oldest)
  }

  async get(key: string) {
    return this.live(key)?.value ?? null
  }

  async set(key: string, value: string, ttlMs?: number) {
    this.evictIfFull()
    this.data.set(key, { value, expiresAt: ttlMs ? this.now() + ttlMs : null })
  }

  async setIfAbsent(key: string, value: string, ttlMs: number) {
    if (this.live(key)) return false
    await this.set(key, value, ttlMs)
    return true
  }

  async delete(key: string) {
    this.data.delete(key)
  }

  async deleteIfEquals(key: string, value: string) {
    if (this.live(key)?.value === value) this.data.delete(key)
  }

  async increment(key: string, ttlMs: number) {
    const entry = this.live(key)
    const next = (entry ? Number.parseInt(entry.value, 10) || 0 : 0) + 1
    this.data.set(key, { value: String(next), expiresAt: entry?.expiresAt ?? this.now() + ttlMs })
    return next
  }
}

/* ------------------------------------------------------------------------------------------
 * File (development only — serverless platforms have no durable writable disk)
 * ---------------------------------------------------------------------------------------- */

export class FileStore implements KeyValueStore {
  readonly kind: KeyValueStore["kind"] = "file"
  private readonly dir: string
  /** Locks and counters are process-local; a dev server is a single process. */
  private readonly ephemeral = new MemoryStore()

  constructor(dir: string) {
    this.dir = dir
  }

  private async fs() {
    return import("node:fs/promises")
  }

  private async pathFor(key: string) {
    const path = await import("node:path")
    return path.join(this.dir, `${encodeURIComponent(key)}.json`)
  }

  private isEphemeral(key: string) {
    return key.includes(":lock:") || key.includes(":rl:")
  }

  async get(key: string) {
    if (this.isEphemeral(key)) return this.ephemeral.get(key)
    try {
      const fs = await this.fs()
      const raw = await fs.readFile(await this.pathFor(key), "utf-8")
      const entry = JSON.parse(raw) as { value: string; expiresAt: number | null }
      if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
        await this.delete(key)
        return null
      }
      return entry.value
    } catch {
      return null
    }
  }

  async set(key: string, value: string, ttlMs?: number) {
    if (this.isEphemeral(key)) return this.ephemeral.set(key, value, ttlMs)
    const fs = await this.fs()
    await fs.mkdir(this.dir, { recursive: true })
    const target = await this.pathFor(key)
    const temp = `${target}.${process.pid}.${Date.now()}.tmp`
    await fs.writeFile(temp, JSON.stringify({ value, expiresAt: ttlMs ? Date.now() + ttlMs : null }), "utf-8")
    await fs.rename(temp, target)
  }

  async setIfAbsent(key: string, value: string, ttlMs: number) {
    if (this.isEphemeral(key)) return this.ephemeral.setIfAbsent(key, value, ttlMs)
    if ((await this.get(key)) !== null) return false
    const fs = await this.fs()
    await fs.mkdir(this.dir, { recursive: true })
    try {
      await fs.writeFile(await this.pathFor(key), JSON.stringify({ value, expiresAt: Date.now() + ttlMs }), {
        encoding: "utf-8",
        flag: "wx",
      })
      return true
    } catch {
      return false
    }
  }

  async delete(key: string) {
    if (this.isEphemeral(key)) return this.ephemeral.delete(key)
    try {
      const fs = await this.fs()
      await fs.unlink(await this.pathFor(key))
    } catch {
      // already gone
    }
  }

  async deleteIfEquals(key: string, value: string) {
    if (this.isEphemeral(key)) return this.ephemeral.deleteIfEquals(key, value)
    if ((await this.get(key)) === value) await this.delete(key)
  }

  async increment(key: string, ttlMs: number) {
    return this.ephemeral.increment(key, ttlMs)
  }
}

/* ------------------------------------------------------------------------------------------
 * Upstash Redis (REST)
 * ---------------------------------------------------------------------------------------- */

const RELEASE_IF_EQUALS =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end"

export class RedisRestStore implements KeyValueStore {
  readonly kind: KeyValueStore["kind"] = "redis"
  private readonly url: string
  private readonly token: string
  private readonly fetchImpl: typeof fetch

  constructor(url: string, token: string, fetchImpl: typeof fetch = fetch) {
    this.url = url.replace(/\/$/, "")
    this.token = token
    this.fetchImpl = fetchImpl
  }

  private async command<T>(args: (string | number)[]): Promise<T> {
    const response = await this.fetchImpl(this.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args.map(String)),
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    })
    const body = (await response.json().catch(() => null)) as { result?: T; error?: string } | null
    if (!response.ok || !body || body.error !== undefined) {
      throw new ConsultationError("INTERNAL_ERROR", "Storage is temporarily unavailable.")
    }
    return body.result as T
  }

  async get(key: string) {
    return this.command<string | null>(["GET", key])
  }

  async set(key: string, value: string, ttlMs?: number) {
    await this.command(ttlMs ? ["SET", key, value, "PX", ttlMs] : ["SET", key, value])
  }

  async setIfAbsent(key: string, value: string, ttlMs: number) {
    return (await this.command<string | null>(["SET", key, value, "PX", ttlMs, "NX"])) === "OK"
  }

  async delete(key: string) {
    await this.command(["DEL", key])
  }

  async deleteIfEquals(key: string, value: string) {
    await this.command(["EVAL", RELEASE_IF_EQUALS, 1, key, value])
  }

  async increment(key: string, ttlMs: number) {
    const count = await this.command<number>(["INCR", key])
    if (count === 1) await this.command(["PEXPIRE", key, ttlMs])
    return count
  }
}

/* ------------------------------------------------------------------------------------------
 * Typed repository
 * ---------------------------------------------------------------------------------------- */

const PREFIX = "myos"
const keys = {
  consultation: (id: string) => `${PREFIX}:c:${id}`,
  page: (id: string) => `${PREFIX}:p:${id}`,
  lock: (id: string) => `${PREFIX}:lock:c:${id}`,
  generation: (consultationId: string, proposalVersion: number) => `${PREFIX}:gen:${consultationId}:${proposalVersion}`,
  rateLimit: (scope: string, window: string) => `${PREFIX}:rl:${scope}:${window}`,
}

export class ConsultationRepository {
  readonly kv: KeyValueStore
  private readonly ttlMs: number

  constructor(kv: KeyValueStore, ttlDays: number) {
    this.kv = kv
    this.ttlMs = ttlDays * 24 * 60 * 60 * 1_000
  }

  async getConsultation(id: string): Promise<Consultation | null> {
    const raw = await this.kv.get(keys.consultation(id))
    return raw ? (JSON.parse(raw) as Consultation) : null
  }

  /**
   * Saves with an optimistic version check. Callers hold the consultation lock, so a mismatch
   * means a lock expired mid-operation — surfaced as a conflict rather than a silent overwrite.
   */
  async saveConsultation(consultation: Consultation, expectedVersion: number | null): Promise<Consultation> {
    if (expectedVersion !== null) {
      const current = await this.getConsultation(consultation.id)
      if (current && current.version !== expectedVersion) {
        throw new ConsultationError("CONFLICT", "This conversation changed in another tab. Please refresh.")
      }
    }
    const next = { ...consultation, version: (expectedVersion ?? 0) + 1 }
    await this.kv.set(keys.consultation(consultation.id), JSON.stringify(next), this.ttlMs)
    return next
  }

  async getPage(id: string): Promise<GeneratedPageRecord | null> {
    const raw = await this.kv.get(keys.page(id))
    return raw ? (JSON.parse(raw) as GeneratedPageRecord) : null
  }

  async savePage(page: GeneratedPageRecord): Promise<void> {
    await this.kv.set(keys.page(page.id), JSON.stringify(page), this.ttlMs)
  }

  /** Exclusive lock on one consultation for the duration of a turn. */
  async withLock<T>(consultationId: string, run: () => Promise<T>, ttlMs = 70_000): Promise<T> {
    const token = crypto.randomUUID()
    const acquired = await this.kv.setIfAbsent(keys.lock(consultationId), token, ttlMs)
    if (!acquired) {
      throw new ConsultationError("BUSY", "I'm still working on your previous message — one moment.")
    }
    try {
      return await run()
    } finally {
      await this.kv.deleteIfEquals(keys.lock(consultationId), token).catch(() => undefined)
    }
  }

  /** Records which page revision a confirmed proposal produced, so it is never generated twice. */
  async claimGeneration(consultationId: string, proposalVersion: number, value: string): Promise<boolean> {
    return this.kv.setIfAbsent(keys.generation(consultationId, proposalVersion), value, this.ttlMs)
  }

  async getGeneration(consultationId: string, proposalVersion: number): Promise<string | null> {
    return this.kv.get(keys.generation(consultationId, proposalVersion))
  }

  async releaseGeneration(consultationId: string, proposalVersion: number, value: string): Promise<void> {
    await this.kv.deleteIfEquals(keys.generation(consultationId, proposalVersion), value)
  }

  /** Fixed-window counter. Returns true when the request is over the limit. */
  async overLimit(scope: string, limit: number, windowMs: number, now = Date.now()): Promise<boolean> {
    const window = String(Math.floor(now / windowMs))
    const count = await this.kv.increment(keys.rateLimit(scope, window), windowMs)
    return count > limit
  }
}
