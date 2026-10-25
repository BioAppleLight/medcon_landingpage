"use client"

import { useEffect, useState } from "react"
import { Sparkles, X } from "lucide-react"

const SEEN_KEY = "myos-special-offer-seen"

export function SpecialOfferPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (window.localStorage.getItem(SEEN_KEY)) return
    } catch {
      // Still show the introduction when browser storage is unavailable.
    }

    const timer = window.setTimeout(() => {
      setVisible(true)
      try {
        window.localStorage.setItem(SEEN_KEY, "true")
      } catch {
        // Browser storage can be disabled; showing the introduction still works.
      }
    }, 3000)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) {
    return null
  }

  return (
    <aside aria-labelledby="myos-intro-title" className="animate-rise fixed right-4 top-24 z-40 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-[#5b7cff]/30 bg-card shadow-2xl shadow-black/30 sm:right-6">
      <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-[#7c5cfc]/15 via-[#5b7cff]/10 to-[#2563eb]/15 px-5 py-3 text-sm font-semibold tracking-wide text-foreground">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          Meet MYO&apos;S AI avatars
        </span>
        <button
          type="button"
          aria-label="Close introduction"
          onClick={() => setVisible(false)}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 py-6">
        <h2 id="myos-intro-title" className="text-balance text-2xl font-semibold leading-tight tracking-tight">
          Focus on More Important Work.
          <span className="mt-1 block bg-gradient-to-r from-[#a78bfa] via-[#7c9bff] to-[#67c9f3] bg-clip-text text-transparent">
            Let AI Handle the Repetitive Work.
          </span>
        </h2>
        <p className="mt-4 leading-6 text-muted-foreground">
          Save time, automate routine interactions, and simplify everyday workflows with MYO&apos;S AI avatars.
        </p>

        <div className="mt-6 grid gap-3">
          <a
            href="/use-cases/government#demo"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#2563eb] px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            See MYO&apos;S in Action
          </a>
          <a
            href="#solution"
            onClick={() => setVisible(false)}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Explore Solutions
          </a>
        </div>
      </div>
    </aside>
  )
}
