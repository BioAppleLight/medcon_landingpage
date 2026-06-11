"use client"

import {
  MessageCircleQuestion,
  Sparkles,
  ListChecks,
  CalendarCheck,
  Activity,
} from "lucide-react"
import { motion } from "motion/react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

const items = [
  {
    icon: MessageCircleQuestion,
    title: "Interactive AI doctor assistant",
    desc: "Ask questions and get personalized answers, anytime.",
  },
  {
    icon: Sparkles,
    title: "Aesthetic treatment navigator",
    desc: "Personalized treatment guidance and aftercare recommendations.",
  },
  {
    icon: ListChecks,
    title: "Patient service recommender",
    desc: "AI-powered suggestions for relevant services and add-ons.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment booking assistant",
    desc: "Smart scheduling made simple.",
  },
  {
    icon: Activity,
    title: "Motion feedback for exercises",
    desc: "AI analyzes movement and gives real-time form feedback.",
  },
]

export function FutureExpansion() {
  return (
    <section className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="eyebrow text-primary">
          Roadmap
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Beyond post-surgery videos.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Recovery videos are just the start. Here&apos;s where the platform is
          headed.
        </p>
      </Reveal>

      <Stagger className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                  <Icon className="h-5 w-5 text-accent" />
                </span>
                <h3 className="mt-5 font-medium text-balance">{item.title}</h3>
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </motion.div>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}
