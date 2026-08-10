"use client"

import type { CSSProperties } from "react"
import {
  Stethoscope,
  GraduationCap,
  Briefcase,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { VARIANT_HERO, VARIANT_THEME, type Variant } from "@/lib/variants"
import { BOOKING_URL } from "@/lib/site"
import { buttonVariants } from "@/components/ui/button"

const VARIANT_ICON: Record<Variant, typeof Stethoscope> = {
  healthcare: Stethoscope,
  education: GraduationCap,
  business: Briefcase,
}

/**
 * Rich, variant-themed hero + expert card rendered directly inside the chat
 * feed. The variant's accent colors are applied locally via inline CSS
 * variables so `text-primary`, `bg-primary`, etc. pick up the right hue.
 */
export function ExpertResult({ variant }: { variant: Variant }) {
  const content = VARIANT_HERO[variant]
  const scenario = content.card
  const Icon = VARIANT_ICON[variant]
  const themeStyle = VARIANT_THEME[variant] as CSSProperties

  return (
    <div
      style={themeStyle}
      className="animate-fade-in mt-3 overflow-hidden rounded-2xl border border-border bg-card/50"
    >
      {/* hero band */}
      <div className="relative px-6 pt-7 pb-6 md:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/15 to-transparent"
        />
        <span className="eyebrow relative">{content.badge}</span>
        <h3 className="relative mt-3 text-balance text-2xl font-semibold leading-[1.1] md:text-3xl">
          {content.headlinePre}{" "}
          <span className="font-serif italic font-normal text-primary">
            {content.headlineAccent}
          </span>
        </h3>
        <p className="relative mt-3 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
          {content.subhead}
        </p>
      </div>

      {/* expert card */}
      <div className="px-6 pb-6 md:px-8">
        <div className="rounded-xl border border-border bg-background/60 p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">{scenario.name}</p>
              <p className="text-xs text-muted-foreground">{scenario.title}</p>
            </div>
            <span className="ml-auto rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
              {scenario.role}
            </span>
          </div>
          <div className="mt-4 rounded-xl rounded-tl-sm bg-secondary px-4 py-3">
            <p className="text-pretty text-sm leading-relaxed">
              {scenario.quote}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ className: "h-10 gap-2 px-5" })}
          >
            <Calendar className="h-4 w-4" />
            Book a Demo
          </a>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            Tailored for {content.label.toLowerCase()}
            <ArrowRight className="h-3.5 w-3.5 text-primary" />
          </span>
        </div>
      </div>
    </div>
  )
}
