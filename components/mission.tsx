"use client"

import Image from "next/image"
import { Reveal } from "@/components/motion-primitives"

export function Mission() {
  return (
    <section
      id="mission"
      className="relative overflow-hidden border-y border-border/70 bg-card/20 px-6 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-[#7c5cfc]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-[#4db6e8]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#5b7cff]/10 to-transparent" />

      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-card/80 p-6 shadow-2xl shadow-black/10 backdrop-blur md:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-[#7c5cfc]/30 to-[#4db6e8]/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-gradient-to-tr from-[#4db6e8]/20 to-[#7c5cfc]/20 blur-3xl" />

        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20">
              <Image
                src="/demos/1660314198561.png"
                alt="Doctor using an AI expert avatar for medical guidance"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="eyebrow text-primary">Our Mission</span>
            <h2 className="mt-4 bg-gradient-to-br from-[#7c5cfc] via-[#5b7cff] to-[#4db6e8] bg-clip-text text-balance text-3xl font-semibold tracking-tight text-transparent md:text-5xl">
              Preserve knowledge. Pass it forward with AI.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground">
              Our mission is to retain information and use AI to pass down
              information to drive:
            </p>
            <ul className="mt-4 grid gap-3 text-lg">
              {[
                { label: "Education Changes", className: "text-[#7c5cfc]" },
                { label: "Medical Improvements", className: "text-[#9d8cff]" },
                { label: "Governmental Success", className: "text-[#4db6e8]" },
              ].map((outcome) => (
                <li key={outcome.label} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(124,92,252,0.8)]" />
                  <span className={outcome.className}>{outcome.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
