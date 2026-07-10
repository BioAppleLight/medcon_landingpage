"use client"

import { ArrowRight, Check } from "lucide-react"
import { Reveal } from "@/components/motion-primitives"
import { BOOKING_URL } from "@/lib/site"

const points = [
  "Personalized to users",
  "First to solve demand for workforce skills and knowledge",
  "Supports all industries",
]

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-gradient-to-br from-[#7c5cfc]/12 via-card/40 to-[#2563eb]/12 px-6 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#7c5cfc]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#2563eb]/20 blur-3xl" />

      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-card/35 p-8 shadow-2xl shadow-black/10 backdrop-blur md:p-10">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1fr] md:items-center">
          <div>
            <span className="eyebrow text-primary">Why Us</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Established in 2026.
            </h2>
            <p className="mt-3 text-pretty text-lg text-muted-foreground">
              Evolves for the Future
            </p>
          </div>

          <div>
            <ul className="grid gap-4">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-pretty text-muted-foreground">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#4db6e8] px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
            >
              Let&apos;s Talk About Strategy
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
