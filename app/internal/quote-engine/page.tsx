import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { QuoteEngine } from "@/components/internal/QuoteEngine"

export const metadata: Metadata = {
  title: "Internal Quote Engine",
  robots: { index: false, follow: false },
}

export default function InternalQuoteEnginePage() {
  if (process.env.INTERNAL_QUOTE_ENGINE_ENABLED !== "true") notFound()
  return <QuoteEngine />
}
