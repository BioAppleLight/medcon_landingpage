export const PERSONALIZED_USE_CASE_STORAGE_KEY = "myos-personalized-use-case-url"
export const PERSONALIZED_INDUSTRY_STORAGE_KEY = "myos-personalized-industry-label"
export const PERSONALIZED_USE_CASE_READY_KEY = "myos-personalized-use-case-ready"
export const PERSONALIZED_USE_CASE_EVENT = "myos:personalized-use-case"
export const DEFAULT_TEMPLATE_URL = "/use-cases/template"

const LEGACY_BRIEF_URL = /^\/use-cases\/template\?brief=c-[A-Za-z0-9_%-]+$/
/** A consultant-generated page: opaque id, optionally a specific draft revision. */
const GENERATED_PAGE_URL = /^\/use-cases\/p-[A-Za-z0-9_-]{22}(\?rev=\d{1,4})?$/

/** Only these two link shapes may ever be stored or shown in navigation. */
export function isPersonalizedUseCaseUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && (LEGACY_BRIEF_URL.test(url) || GENERATED_PAGE_URL.test(url))
}

function isGeneratedPageUrl(url: string | null | undefined): boolean {
  return typeof url === "string" && GENERATED_PAGE_URL.test(url)
}

export function readPersonalizedUseCaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_TEMPLATE_URL

  const value = window.localStorage.getItem(PERSONALIZED_USE_CASE_STORAGE_KEY)
  return isPersonalizedUseCaseUrl(value) ? value : DEFAULT_TEMPLATE_URL
}

export function hasPersonalizedUseCase(): boolean {
  if (typeof window === "undefined") return false

  const url = window.localStorage.getItem(PERSONALIZED_USE_CASE_STORAGE_KEY)
  const industryLabel = window.localStorage
    .getItem(PERSONALIZED_INDUSTRY_STORAGE_KEY)
    ?.trim()

  // Generated pages are stored server-side and owned by this browser, so they stay in the
  // navigation across sessions. Legacy brief links keep their original session-only behavior.
  const ready = isGeneratedPageUrl(url) ||
    (window.sessionStorage.getItem(PERSONALIZED_USE_CASE_READY_KEY) === "true" && isPersonalizedUseCaseUrl(url))

  return ready && Boolean(industryLabel && industryLabel.length <= 80)
}

export function savePersonalizedUseCaseUrl(url: string): void {
  if (typeof window === "undefined" || !isPersonalizedUseCaseUrl(url)) return

  window.localStorage.setItem(PERSONALIZED_USE_CASE_STORAGE_KEY, url)
  window.sessionStorage.setItem(PERSONALIZED_USE_CASE_READY_KEY, "true")
  window.dispatchEvent(new CustomEvent(PERSONALIZED_USE_CASE_EVENT, { detail: url }))
}

export function readPersonalizedIndustryLabel(): string | null {
  if (typeof window === "undefined") return null

  const value = window.localStorage.getItem(PERSONALIZED_INDUSTRY_STORAGE_KEY)?.trim()
  return value && value.length <= 80 ? value : null
}

export function savePersonalizedIndustryLabel(label: string): void {
  if (typeof window === "undefined") return

  const cleaned = label.trim().slice(0, 80)
  if (!cleaned) return
  window.localStorage.setItem(PERSONALIZED_INDUSTRY_STORAGE_KEY, cleaned)
  window.dispatchEvent(new CustomEvent(PERSONALIZED_USE_CASE_EVENT, { detail: cleaned }))
}

export function resetPersonalizedUseCase(): void {
  if (typeof window === "undefined") return

  window.localStorage.removeItem(PERSONALIZED_USE_CASE_STORAGE_KEY)
  window.localStorage.removeItem(PERSONALIZED_INDUSTRY_STORAGE_KEY)
  window.sessionStorage.removeItem(PERSONALIZED_USE_CASE_READY_KEY)
  window.dispatchEvent(new CustomEvent(PERSONALIZED_USE_CASE_EVENT, { detail: null }))
}
