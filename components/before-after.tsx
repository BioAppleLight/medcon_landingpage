"use client"

import { GraduationCap, HeartPulse, Building2, UserRound } from "lucide-react"
import { Reveal } from "@/components/motion-primitives"
import { useCountUp } from "@/components/use-count-up"

type Destination =
  | {
      icon: typeof GraduationCap
      title: string
      target: number
      prefix: string
      label: string
    }
  | {
      icon: typeof GraduationCap
      title: string
      detail: string
    }

const destinations: Destination[] = [
  {
    icon: GraduationCap,
    title: "Students",
    target: 10000,
    prefix: "+",
    label: "students",
  },
  {
    icon: HeartPulse,
    title: "Patients",
    target: 50,
    prefix: "+",
    label: "hospitals",
  },
  {
    icon: Building2,
    title: "Teams",
    detail: "Entire departments",
  },
]

function hasCountUp(
  destination: Destination,
): destination is Extract<Destination, { target: number }> {
  return "target" in destination
}

function CountUpDetail({
  target,
  prefix,
  label,
}: {
  target: number
  prefix: string
  label: string
}) {
  const { value, ref } = useCountUp(target, 2000, true)

  return (
    <p className="text-sm text-muted-foreground">
      {prefix}
      <span ref={ref}>{value.toLocaleString()}</span>
      {" "}
      {label}
    </p>
  )
}

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
        className="relative mx-auto mt-14 max-w-5xl overflow-visible rounded-3xl border border-border bg-card/60 px-5 pb-5 pt-3 shadow-2xl shadow-primary/5 md:px-8 md:pb-8 md:pt-4"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#7c5cfc]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-[#2563eb]/25 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#7c5cfc]/16 via-[#5b7cff]/10 to-[#2563eb]/16" />

        <div className="relative flex flex-col items-center">
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

          {/* Branching connector from one expert to many destinations */}
          <div className="relative my-5 h-16 w-full max-w-2xl" aria-hidden="true">
            <svg
              viewBox="0 0 640 64"
              fill="none"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="scale-network-flow"
                  x1="320"
                  y1="0"
                  x2="320"
                  y2="64"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#7c5cfc" />
                  <stop offset="55%" stopColor="#5b7cff" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <path
                d="M320 0 C320 12 320 18 320 24 M320 24 C252 24 222 30 190 45 C154 64 128 56 96 64 M320 24 C320 38 320 48 320 64 M320 24 C388 24 418 30 450 45 C486 64 512 56 544 64"
                className="text-border"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M320 0 C320 12 320 18 320 24 M320 24 C252 24 222 30 190 45 C154 64 128 56 96 64 M320 24 C320 38 320 48 320 64 M320 24 C388 24 418 30 450 45 C486 64 512 56 544 64"
                className="animate-network-flow"
                stroke="url(#scale-network-flow)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="absolute left-1/2 top-[20px] h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_18px_rgba(124,92,252,0.9)]" />
          </div>

          {/* destination cards */}
          <div className="grid w-full gap-3 sm:grid-cols-3">
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
                    {hasCountUp(d) ? (
                      <CountUpDetail
                        target={d.target}
                        prefix={d.prefix}
                        label={d.label}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {d.detail}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
