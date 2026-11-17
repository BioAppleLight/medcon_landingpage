/**
 * Anonymous ownership. Each browser gets a random 256-bit owner token in an HttpOnly cookie;
 * the server stores only its SHA-256 hash. Possession of the token is what proves ownership of
 * a consultation and its pages — ids alone grant nothing.
 *
 * Moving to accounts later: add a `user:<id>` owner alongside the anonymous hash and, on sign-in,
 * re-key records whose owner hash matches the visitor's current token.
 */

export const OWNER_COOKIE = "myos_owner"
export const CONSULTATION_COOKIE = "myos_consultation"
const OWNER_COOKIE_MAX_AGE = 60 * 60 * 24 * 180

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/
const ID_PATTERN = /^[A-Za-z0-9_-]{22}$/
const PAGE_SLUG_PATTERN = /^p-([A-Za-z0-9_-]{22})$/

function base64Url(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function randomBase64Url(byteLength: number): string {
  const bytes = new Uint8Array(byteLength)
  crypto.getRandomValues(bytes)
  return base64Url(bytes)
}

/** 256-bit secret. */
export function newOwnerToken(): string {
  return randomBase64Url(32)
}

/** 128-bit opaque, unguessable id for consultations and pages. */
export function newId(): string {
  return randomBase64Url(16)
}

export function isOwnerToken(value: unknown): value is string {
  return typeof value === "string" && TOKEN_PATTERN.test(value)
}

export function isId(value: unknown): value is string {
  return typeof value === "string" && ID_PATTERN.test(value)
}

export function pageIdFromSlug(slug: string): string | null {
  return PAGE_SLUG_PATTERN.exec(slug)?.[1] ?? null
}

export function pageSlug(id: string): string {
  return `p-${id}`
}

export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token))
  return base64Url(new Uint8Array(digest))
}

/** Constant-time comparison of two equal-format hashes. */
export function sameHash(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let index = 0; index < a.length; index++) diff |= a.charCodeAt(index) ^ b.charCodeAt(index)
  return diff === 0
}

export function parseCookies(header: string | null): Record<string, string> {
  const result: Record<string, string> = {}
  if (!header) return result
  for (const part of header.split(";")) {
    const index = part.indexOf("=")
    if (index <= 0) continue
    const name = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    try {
      result[name] = decodeURIComponent(value)
    } catch {
      // ignore malformed cookie values
    }
  }
  return result
}

export function serializeCookie(
  name: string,
  value: string,
  options: { maxAge: number; secure: boolean },
): string {
  return [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${options.maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
    options.secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ")
}

export function ownerCookie(token: string, secure: boolean): string {
  return serializeCookie(OWNER_COOKIE, token, { maxAge: OWNER_COOKIE_MAX_AGE, secure })
}

export function consultationCookie(id: string, secure: boolean): string {
  return serializeCookie(CONSULTATION_COOKIE, id, { maxAge: OWNER_COOKIE_MAX_AGE, secure })
}
