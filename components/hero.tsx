"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Play, Calendar, Stethoscope, GraduationCap, Landmark } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { HeroChat } from "@/components/hero-chat"
import { buttonVariants } from "@/components/ui/button"
import { openNextDemo } from "@/lib/demo-links"
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
      className="relative isolate mt-16 overflow-hidden border-t border-border bg-black px-6 pb-20 pt-36 md:pb-28 md:pt-44"
    >
      <Image
        src="/Homepage design.png"
        alt="Collage showing the growing demand for AI expertise and digital twins"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Dark wash keeps the hero content legible over the collage. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,4,14,0.76)_0%,rgba(2,4,14,0.68)_42%,rgba(2,4,14,0.94)_100%)]">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="animate-rise mx-auto inline-flex items-center justify-center gap-4">
          <BrandLogo animated={false} className="h-14 w-14 md:h-20 md:w-20" />
          <span className="text-5xl font-semibold leading-[1.03] tracking-tight md:text-7xl">
            MYO&apos;S
          </span>
        </div>
        <h1 className="animate-rise mt-16 text-balance text-5xl font-semibold leading-[1.03] md:text-7xl [animation-delay:0.05s]">
          Every expert,{" "}
          <span className="bg-gradient-to-br from-[#7c5cfc] via-[#5b7cff] to-[#4db6e8] bg-clip-text font-serif italic font-normal text-transparent drop-shadow-[0_0_18px_rgba(124,92,252,0.5)]">
            available 24/7.
          </span>
        </h1>

        <p className="animate-rise mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/75 [animation-delay:0.15s]">
          Deploy AI-powered doctors, professors, and government assistants that
          teach, guide, and answer questions in real time.
        </p>

        <HeroChat />

        <div className="animate-rise mt-6 flex flex-col items-center justify-center gap-3 [animation-delay:0.25s] sm:flex-row">
          <button
            type="button"
            onClick={openNextDemo}
            className={buttonVariants({
              className:
                "h-11 gap-2 px-6 text-base transition-transform hover:-translate-y-0.5",
            })}
          >
            <Play className="h-4 w-4" />
            Watch Live Demo
          </button>
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
