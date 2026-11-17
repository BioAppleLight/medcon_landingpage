/**
 * Plain-text hygiene shared by input validation and output validation. Nothing here interprets
 * text; it only removes what plain text never needs.
 */

/** Strips control/format characters and markup brackets, collapses whitespace, bounds length. */
export function sanitizeText(text: string, maxLength: number): string {
  const cleaned = text
    .replace(/[\p{Cc}\p{Cf}]/gu, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  if (cleaned.length <= maxLength) return cleaned
  const cut = cleaned.slice(0, maxLength - 1)
  const lastSpace = cut.lastIndexOf(" ")
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

/**
 * Like `sanitizeText` but keeps paragraph breaks, for chat replies. Markdown emphasis and
 * headings are flattened because the chat renders plain text.
 */
export function sanitizeReply(text: string, maxLength: number): string {
  const cleaned = text
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/[\p{Cc}\p{Cf}]/gu, (char) => (char === "\n" ? "\n" : " "))
    .replace(/[<>]/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim()

  return cleaned.length <= maxLength ? cleaned : `${cleaned.slice(0, maxLength - 1).trimEnd()}…`
}

export function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
}
