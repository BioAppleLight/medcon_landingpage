"use client"

import { FileText, RefreshCw, Network } from "lucide-react"
import { motion } from "motion/react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

const tech = [
  {
    icon: FileText,
    title: "Reasoning Replication",
    desc: "Avatars emulate expert reasoning, not just appearance, grounded in the source material your experts approve.",
  },
  {
    icon: RefreshCw,
    title: "Reinforcement Feedback Loop",
    desc: "Every interaction is summarized and stored, surfacing where learners struggle so the system keeps improving.",
  },
  {
    icon: Network,
    title: "Multi-Domain Platform",
    desc: "A publisher and subscriber architecture lets one expert's knowledge reach many institutions and domains.",
  },
]

export function CoreTech() {
  return (
    <section
      id="technology"
      className="relative overflow-hidden border-y border-border/70 bg-gradient-to-br from-[#2563eb]/10 via-card/25 to-[#7c5cfc]/10 px-6 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 bottom-12 h-64 w-64 rounded-full bg-[#2563eb]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-12 h-72 w-72 rounded-full bg-[#7c5cfc]/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <span className="eyebrow text-primary">
            Core Technology
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Knowledge-based avatars that emulate expert reasoning.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            MyOS isn&apos;t a talking head. It&apos;s a knowledge engine wrapped
            in a human-like persona, built to reason like your best expert and
            improve with every conversation.
          </p>
        </Reveal>

        <Stagger className="flex flex-col gap-4">
          {tech.map((t) => {
            const Icon = t.icon
            return (
              <StaggerItem key={t.title}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15">
                    <Icon className="h-5 w-5 text-accent" />
                  </span>
                  <div>
                    <h3 className="font-medium">{t.title}</h3>
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {t.desc}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
