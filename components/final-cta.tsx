"use client"

import { Play, Calendar } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/motion-primitives"

export function FinalCta() {
  return (
    <section id="book-demo" className="px-6 py-20 md:py-28">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.08] px-6 py-20 text-center md:px-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-20%] h-72 w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        </div>
        <h2 className="mx-auto max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Your best expert shouldn&apos;t have an{" "}
          <span className="font-serif italic font-normal text-primary">
            out-of-office.
          </span>
        </h2>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:mmedcon@gmail.com"
            className={buttonVariants({
              className:
                "h-11 gap-2 px-6 text-base transition-transform hover:-translate-y-0.5",
            })}
          >
            <Calendar className="h-4 w-4" />
            Book a Demo
          </a>
          <a
            href="#demos"
            className={buttonVariants({
              variant: "outline",
              className:
                "h-11 gap-2 px-6 text-base transition-transform hover:-translate-y-0.5",
            })}
          >
            <Play className="h-4 w-4" />
            Watch It Work
          </a>
        </div>
      </Reveal>
    </section>
  )
}
