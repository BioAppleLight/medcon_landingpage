"use client"

import { useEffect, useState } from "react"
import { Check, Target, X, Zap } from "lucide-react"
import { BOOKING_URL } from "@/lib/site"

export function SpecialOfferPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 700)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) {
    return null
  }

  return (
    <aside className="animate-rise fixed right-4 top-24 z-40 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-[#5b7cff]/30 bg-card shadow-2xl shadow-black/30 sm:right-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#2563eb] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">
        <span className="inline-flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Special Offer • Limited Time
        </span>
        <button
          type="button"
          aria-label="Close special offer"
          onClick={() => setVisible(false)}
          className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 py-7 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Target className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight">
          Ready to Get Started?
        </h2>
        <p className="mx-auto mt-3 max-w-xs leading-7 text-muted-foreground">
          Get a FREE consultation and discover how we can help your business
          grow.
        </p>

        <div className="mt-6 grid gap-3">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#2563eb] px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
          >
            Claim Your Free Consultation
          </a>
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
          >
            Learn More
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
          {["Free consultation", "No obligations"].map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
