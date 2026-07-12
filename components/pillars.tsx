"use client"

import { Check, UserRound, Database, Globe } from "lucide-react"
import { motion } from "motion/react"
import { BrandLogo } from "@/components/brand-logo"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

const pillars = [
  {
    n: "01",
    icon: UserRound,
    title: "Customizable human expert persona",
    desc: "A real-time, human-like avatar with your expert's voice, tone, and mannerisms that delivers knowledge the way they would.",
  },
  {
    n: "02",
    icon: Database,
    title: "RAG + LLM knowledge layer",
    desc: "We turn your learning content into a grounded knowledge base, so answers stay accurate, cited, and on-message.",
  },
  {
    n: "03",
    icon: Globe,
    title: "Subscribe anytime, anywhere, any language",
    desc: "Learners and patients reach the expert across time zones and languages, in English, Arabic, or both.",
  },
]

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
      className="relative overflow-hidden border-y border-border/70 bg-gradient-to-br from-[#7c5cfc]/10 via-card/25 to-[#2563eb]/10 px-6 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-[#7c5cfc]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-[#2563eb]/20 blur-3xl" />

      <Reveal className="relative mx-auto max-w-3xl text-center">
        <span className="eyebrow text-primary">
          The Solution
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Expert digital twins for education, healthcare &amp; beyond.
        </h2>
      </Reveal>

      <Stagger className="relative mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {pillars.map((p) => {
          const Icon = p.icon
          return (
            <StaggerItem key={p.n}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <span className="pointer-events-none text-4xl font-semibold leading-none text-border/60 transition-colors group-hover:text-primary/20">
                    {p.n}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-medium text-balance">
                  {p.title}
                </h3>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </motion.div>
            </StaggerItem>
          )
        })}
      </Stagger>

      <Reveal className="relative mx-auto mt-12 max-w-5xl rounded-2xl border border-primary/25 bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
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
