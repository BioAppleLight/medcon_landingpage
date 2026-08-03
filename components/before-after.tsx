"use client"

import { GraduationCap, HeartPulse, Building2 } from "lucide-react"
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
    <p className="text-[clamp(2.75rem,5vw,5.5rem)] font-light leading-none tracking-[-0.06em] text-foreground">
      {prefix}
      <span ref={ref}>{value.toLocaleString()}</span>
      <span className="sr-only"> {label}</span>
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

      <Reveal delay={0.1} className="mx-auto mt-16 max-w-4xl">
        <div className="grid grid-cols-2 gap-x-12 gap-y-14 text-center md:gap-x-20 md:gap-y-16">
          {destinations.map((destination) => (
            <div key={destination.title}>
              {hasCountUp(destination) ? (
                <CountUpDetail
                  target={destination.target}
                  prefix={destination.prefix}
                  label={destination.label}
                />
              ) : (
                <p className="text-[clamp(2rem,4vw,4rem)] font-light leading-none tracking-[-0.055em] text-foreground">
                  {destination.detail}
                </p>
              )}
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground md:text-base">
                {destination.title}
                {hasCountUp(destination) && ` · ${destination.label}`}
              </p>
            </div>
          ))}

          <div>
            <p className="text-[clamp(2.75rem,5vw,5.5rem)] font-light leading-none tracking-[-0.06em] text-foreground">
              1
            </p>
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground md:text-base">
              Your expert · trained once
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
