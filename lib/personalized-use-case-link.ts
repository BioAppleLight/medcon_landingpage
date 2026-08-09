export const PERSONALIZED_USE_CASE_STORAGE_KEY = "myos-personalized-use-case-url"
export const PERSONALIZED_INDUSTRY_STORAGE_KEY = "myos-personalized-industry-label"
export const PERSONALIZED_USE_CASE_READY_KEY = "myos-personalized-use-case-ready"
export const PERSONALIZED_USE_CASE_EVENT = "myos:personalized-use-case"
export const DEFAULT_TEMPLATE_URL = "/use-cases/template"

export function readPersonalizedUseCaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_TEMPLATE_URL

  const value = window.localStorage.getItem(PERSONALIZED_USE_CASE_STORAGE_KEY)
  return value?.startsWith("/use-cases/template?brief=c-") ? value : DEFAULT_TEMPLATE_URL
}

export function hasPersonalizedUseCase(): boolean {
  if (typeof window === "undefined") return false

  const url = window.localStorage.getItem(PERSONALIZED_USE_CASE_STORAGE_KEY)
  const industryLabel = window.localStorage
    .getItem(PERSONALIZED_INDUSTRY_STORAGE_KEY)
    ?.trim()

  return (
    window.sessionStorage.getItem(PERSONALIZED_USE_CASE_READY_KEY) === "true" &&
    (url?.startsWith("/use-cases/template?brief=c-") ?? false) &&
    Boolean(industryLabel && industryLabel.length <= 80)
  )
}

export function savePersonalizedUseCaseUrl(url: string): void {
  if (typeof window === "undefined" || !url.startsWith("/use-cases/template?brief=c-")) return

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
