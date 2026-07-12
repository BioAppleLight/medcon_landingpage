"use client"

import { Clock, TrendingDown, BarChart3 } from "lucide-react"
import { motion } from "motion/react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

const pillars = [
  {
    icon: Clock,
    title: "Monthly doctor time saved",
    points: [
      "Automates repetitive recovery explanations",
      "One video, reused hundreds of times",
      "Frees clinicians to focus on care",
    ],
  },
  {
    icon: TrendingDown,
    title: "Monthly value saved",
    points: [
      "Fewer phone calls and follow-ups",
      "Lower no-show and complication rates",
      "Higher patient satisfaction and loyalty",
    ],
  },
  {
    icon: BarChart3,
    title: "Return on investment",
    points: [
      "Measurable time and cost savings",
      "Scalable across doctors and locations",
      "High impact on operational efficiency",
    ],
  },
]

export function BusinessModel() {
  return (
    <section
      id="roi"
      className="relative overflow-hidden border-y border-border/70 bg-gradient-to-br from-[#7c5cfc]/10 via-card/25 to-[#2563eb]/10 px-6 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#7c5cfc]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-[#2563eb]/20 blur-3xl" />

      <Reveal className="relative mx-auto max-w-3xl text-center">
        <span className="eyebrow text-primary">
          Business Model
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Doctor-led AI videos that pay for themselves.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Improve patient outcomes and reduce operational load, with a return
          you can measure.
        </p>
      </Reveal>

      <Stagger className="relative mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {pillars.map((p) => {
          const Icon = p.icon
          return (
            <StaggerItem key={p.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="h-full rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-6 text-lg font-medium">{p.title}</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {p.points.map((point) => (
                    <li
                      key={point}
                      className="text-pretty text-sm leading-relaxed text-muted-foreground"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </StaggerItem>
          )
        })}
      </Stagger>

      <Reveal
        delay={0.1}
        className="relative mx-auto mt-10 max-w-5xl rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-accent/10 px-8 py-10 text-center"
      >
        <p className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          Up to{" "}
          <span className="font-serif italic font-normal text-primary">
            40x return
          </span>{" "}
          vs. traditional diagnostic and recovery pathways.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-muted-foreground">
          A traditional MS diagnostic pathway runs €1,500 to €7,000. MyOS
          delivers comparable patient guidance from as little as €8.32 per scan
          at hospital scale.
        </p>
      </Reveal>
    </section>
  )
}
