"use client"

import Image from "next/image"
import { ArrowRight, Check } from "lucide-react"
import { Reveal } from "@/components/motion-primitives"
import { BOOKING_URL } from "@/lib/site"

const points = [
  "Personalized to users",
  "First to solve demand for workforce skills and knowledge",
  "Supports all industries",
]

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-gradient-to-br from-[#7c5cfc]/12 via-card/40 to-[#2563eb]/12 px-6 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#7c5cfc]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#2563eb]/20 blur-3xl" />

      <Reveal className="relative mx-auto min-h-[620px] max-w-7xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-black/20">
        <Image
          src="/Why US.webp"
          alt="Modern glass architecture opening toward the sky and surrounded by greenery"
          fill
          sizes="(min-width: 1280px) 80rem, 100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,12,0.05)_10%,rgba(2,4,12,0.4)_52%,rgba(2,4,12,0.96)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,12,0.68),transparent_68%)]" />

        <div className="absolute inset-x-0 bottom-0 grid gap-10 p-7 text-white sm:p-10 md:grid-cols-[0.9fr_1.1fr] md:items-end md:p-14 lg:p-16">
          <div>
            <span className="eyebrow text-blue-300">Why Us</span>
            <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight md:text-6xl">
              Established in 2026.
            </h2>
            <p className="mt-3 text-pretty text-xl text-white/75">
              Evolves for the Future
            </p>
          </div>

          <div className="md:justify-self-end">
            <ul className="grid gap-4">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-400/20 text-blue-300 backdrop-blur-sm">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-pretty text-white/80">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#4db6e8] px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
            >
              Let&apos;s Talk About Strategy
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
