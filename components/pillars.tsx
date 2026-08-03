"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { Reveal } from "@/components/motion-primitives"

const knowledgeOutcomes = [
  "Preserve expertise",
  "Accelerate onboarding",
  "Improve training",
  "Enable knowledge access at scale",
]

export function Pillars() {
  return (
    <section
      id="solution"
      className="relative scroll-mt-16 overflow-hidden border-y border-border/70 bg-[#02020b] px-6 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-[#7c5cfc]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-[#2563eb]/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:gap-16">
        <Reveal className="max-w-2xl lg:justify-self-end">
          <span className="eyebrow text-primary">The Solution</span>
          <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            Create{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Expert
            </span>{" "}
            Digital Twins for Education, Healthcare, and{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Beyond
            </span>
          </h2>
          <p className="mt-8 max-w-[48ch] font-mono text-[clamp(1rem,1.35vw,1.35rem)] font-light leading-[1.6] tracking-[-0.035em] text-muted-foreground">
            Our AI creates a customizable human expert powered by RAG and an LLM knowledge layer, ensuring every answer remains accurate, cited, and on-message and provides to subscribers anytime, anywhere, and in any language.
          </p>
        </Reveal>

        <Reveal className="solution-artwork-blend relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <div className="relative aspect-[1086/1448]">
            <Image
              src="/the Solution.png"
              alt="AI expert digital twin surrounded by an interactive knowledge network"
              fill
              sizes="(min-width: 1024px) 38vw, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>

      <Reveal className="relative mx-auto mt-16 max-w-5xl rounded-2xl border border-primary/25 bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-background">
              <BrandLogo className="h-10 w-10" />
            </span>
            <div className="md:hidden">
              <p className="text-lg font-semibold tracking-tight">MYO&apos;S</p>
              <p className="text-sm text-muted-foreground">
                Organizational knowledge, made interactive.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
              MyOS transforms organizational knowledge into interactive AI
              avatars that:
            </h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {knowledgeOutcomes.map((outcome) => (
                <li key={outcome} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {outcome}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
