"use client"

import { Hourglass, DoorOpen, BookX } from "lucide-react"
import { motion } from "motion/react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

const problems = [
  {
    icon: Hourglass,
    title: "Expert time is scarce and expensive",
    desc: "Top specialists cost thousands per hour, leaving learners and patients without access to the expertise they need.",
  },
  {
    icon: DoorOpen,
    title: "Knowledge walks out the door",
    desc: "When an experienced expert retires or leaves, decades of hard-won institutional knowledge disappears with them.",
  },
  {
    icon: BookX,
    title: "Passive content doesn't stick",
    desc: "Static textbooks, recorded lectures, and discharge sheets fail because there's no interactive engagement.",
  },
]

export function Problem() {
  return (
    <section id="problem" className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="eyebrow text-primary">
          The Problem
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Expertise doesn&apos;t{" "}
          <span className="font-serif italic font-normal text-primary">
            scale.
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          The cost of expert time keeps real guidance out of reach for the
          learners and patients who need it most.
        </p>
      </Reveal>

      <Stagger className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {problems.map((p) => {
          const Icon = p.icon
          return (
            <StaggerItem key={p.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="h-full rounded-2xl border border-border bg-card p-8 transition-colors hover:border-destructive/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/15">
                  <Icon className="h-5 w-5 text-destructive" />
                </span>
                <h3 className="mt-6 text-lg font-medium">{p.title}</h3>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </motion.div>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}
