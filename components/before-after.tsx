"use client"

import { GraduationCap, HeartPulse, Building2, UserRound } from "lucide-react"
import { Reveal } from "@/components/motion-primitives"

const destinations = [
  {
    icon: GraduationCap,
    title: "Students",
    detail: "10,000+ learners",
  },
  {
    icon: HeartPulse,
    title: "Patients",
    detail: "50+ hospitals",
  },
  {
    icon: Building2,
    title: "Teams",
    detail: "Entire departments",
  },
]

export function BeforeAfter() {
  return (
    <section className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-5xl text-center">
        <span className="eyebrow block">Scale</span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          One expert.{" "}
          <span className="font-serif italic font-normal text-primary">
            Infinite reach.
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          A single specialist can only be in one place at a time. MyOS lets the
          same expert help thousands of people at once.
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="mx-auto mt-14 max-w-5xl rounded-3xl border border-border bg-card/50 p-8 md:p-12"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          {/* The single source: one expert */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <UserRound className="h-9 w-9" />
              </span>
            </div>
            <div className="text-center">
              <p className="font-medium">Your expert</p>
              <p className="text-sm text-muted-foreground">trained once</p>
            </div>
          </div>

          {/* Connector + the many destinations */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* branching connector lines (desktop) */}
            <div
              className="relative hidden h-48 w-16 shrink-0 md:block"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 64 192"
                fill="none"
                className="h-full w-full text-border"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 96 H20 M20 96 C40 96 44 32 64 32 M20 96 H64 M20 96 C40 96 44 160 64 160"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="absolute left-[18px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
            </div>

            {/* destination cards */}
            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              {destinations.map((d) => {
                const Icon = d.icon
                return (
                  <div
                    key={d.title}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-background/60 p-5 transition-colors hover:border-primary/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium">{d.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {d.detail}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          Available 24/7, in every time zone, in English and Arabic.
        </p>
      </Reveal>
    </section>
  )
}
