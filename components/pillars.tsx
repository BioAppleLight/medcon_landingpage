"use client"

import { UserRound, Database, Globe } from "lucide-react"
import { motion } from "motion/react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

const pillars = [
  {
    n: "01",
    icon: UserRound,
    title: "Customizable human expert persona",
    desc: "A real-time, human-like avatar with your expert's voice, tone, and mannerisms — delivering knowledge the way they would.",
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
    desc: "Learners and patients access the expert across time zones and languages — English, Arabic, or both.",
  },
]

export function Pillars() {
  return (
    <section id="solution" className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-medium uppercase tracking-wider text-primary">
          The Solution
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Expert digital twins for education, healthcare &amp; beyond.
        </h2>
      </Reveal>

      <Stagger className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {pillars.map((p) => {
          const Icon = p.icon
          return (
            <StaggerItem key={p.n}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-6 text-lg font-medium text-balance">
                  {p.title}
                </h3>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
                <span className="pointer-events-none absolute -bottom-4 right-4 text-6xl font-semibold text-border/60 transition-colors group-hover:text-primary/20">
                  {p.n}
                </span>
              </motion.div>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}
