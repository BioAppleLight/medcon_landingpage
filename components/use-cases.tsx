"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { Check, Stethoscope, GraduationCap, Landmark } from "lucide-react"
import { Reveal } from "@/components/motion-primitives"

const tabs = [
  {
    id: "healthcare",
    label: "Healthcare",
    icon: Stethoscope,
    headline: "AI doctor avatars for post-surgery recovery.",
    points: [
      "Personalized video guidance for rehab exercises",
      "Patients ask questions and get answers any time",
      "Automatic red-flag alerts escalate to real clinicians",
    ],
    image: "/demos/healthcare-demo.png",
    alt: "AI doctor avatar guiding a patient through recovery exercises",
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    headline: "AI professor avatars that never stop teaching.",
    points: [
      "Answer student questions with cited sources",
      "Adapt to each professor's teaching style",
      "Available across time zones and languages",
    ],
    image: "/demos/education-demo.png",
    alt: "AI professor avatar answering a student's question",
  },
  {
    id: "government",
    label: "Government",
    icon: Landmark,
    headline: "AI training assistants for compliance at scale.",
    points: [
      "Run oral assessments and certification prep",
      "Deliver consistent training to entire departments",
      "Supports multiple languages out of the box",
    ],
    image: "/demos/government-demo.png",
    alt: "AI government training assistant running an oral assessment",
  },
]

export function UseCases() {
  const [active, setActive] = useState(tabs[0].id)
  const tab = tabs.find((t) => t.id === active)!

  return (
    <section id="use-cases" className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Built for the industries that can&apos;t afford to get it wrong.
        </h2>
      </Reveal>

      <div className="mx-auto mt-10 max-w-5xl">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tabs.map((t) => {
            const Icon = t.icon
            const isActive = t.id === active
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(t.id)}
                className={`relative inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary text-primary-foreground"
                    : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="usecase-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="mt-10 grid items-center gap-8 overflow-hidden rounded-2xl border border-border bg-card p-6 md:grid-cols-2 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tab.id}-text`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <h3 className="text-balance text-2xl font-semibold tracking-tight">
                {tab.headline}
              </h3>
              <ul className="mt-6 flex flex-col gap-4">
                {tab.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    <span className="text-pretty text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${tab.id}-img`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative aspect-video overflow-hidden rounded-xl border border-border bg-secondary"
            >
              <Image
                src={tab.image || "/placeholder.svg"}
                alt={tab.alt}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
