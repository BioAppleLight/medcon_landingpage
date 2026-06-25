"use client"

import { Play, Calendar, Stethoscope, GraduationCap, Briefcase } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { BOOKING_URL } from "@/lib/site"
import { useAdaptive } from "@/components/adaptive-provider"
import { VARIANT_HERO, type Variant } from "@/lib/variants"

const VARIANT_ICON: Record<Variant, typeof Stethoscope> = {
  healthcare: Stethoscope,
  education: GraduationCap,
  business: Briefcase,
}

export function Hero() {
  const { variant } = useAdaptive()
  const content = VARIANT_HERO[variant]
  const scenario = content.card
  const Icon = VARIANT_ICON[variant]

  return (
    <section
      id="product"
      className="relative overflow-hidden px-6 pb-20 pt-36 md:pb-28 md:pt-44"
    >
      {/* ambient wash */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <span key={`${variant}-badge`} className="eyebrow animate-fade-in mx-auto">
          {content.badge}
        </span>
        <h1
          key={`${variant}-head`}
          className="animate-fade-in mt-6 text-balance text-5xl font-semibold leading-[1.03] md:text-7xl"
        >
          {content.headlinePre}{" "}
          <span className="font-serif italic font-normal text-primary">
            {content.headlineAccent}
          </span>
        </h1>

        <p
          key={`${variant}-sub`}
          className="animate-fade-in mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          {content.subhead}
        </p>

        <div className="animate-rise mt-9 flex flex-col items-center justify-center gap-3 [animation-delay:0.25s] sm:flex-row">
          <a
            href="#demos"
            className={buttonVariants({
              className:
                "h-11 gap-2 px-6 text-base transition-transform hover:-translate-y-0.5",
            })}
          >
            <Play className="h-4 w-4" />
            Watch Live Demo
          </a>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "outline",
              className:
                "h-11 gap-2 px-6 text-base transition-transform hover:-translate-y-0.5",
            })}
          >
            <Calendar className="h-4 w-4" />
            Book Demo
          </a>
        </div>
      </div>

      {/* Variant-driven avatar card */}
      <div className="mx-auto mt-16 max-w-lg">
        <div
          key={variant}
          className="animate-fade-in relative rounded-2xl border border-border bg-card p-6 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <Icon className="h-7 w-7 text-primary-foreground" />
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{scenario.name}</p>
              <p className="text-xs text-muted-foreground">{scenario.title}</p>
            </div>
            <span className="ml-auto rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
              {scenario.role}
            </span>
          </div>

          <div className="mt-5 rounded-xl rounded-tl-sm bg-secondary px-4 py-3 text-left">
            <p className="text-pretty text-sm leading-relaxed">
              {scenario.quote}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
