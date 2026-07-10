"use client"

import { CalendarDays, HeartPulse, Newspaper, Stethoscope } from "lucide-react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

const newsItems = [
  {
    icon: Stethoscope,
    theme: "UAE digital health",
    title:
      "UAE healthcare licensing to become unified and AI-powered by 2026",
    date: "Aug 12, 2025",
  },
  {
    icon: HeartPulse,
    theme: "AI-assisted surgery",
    title:
      "Abu Dhabi procedure uses AI-assisted planning in landmark conjoined-twin separation",
    date: "Jun 19, 2026",
  },
  {
    icon: Newspaper,
    theme: "Global healthcare AI",
    title:
      "NHS app to use AI to guide patients toward the right care pathway",
    date: "Jul 4, 2026",
  },
]

export function IndustryNews() {
  return (
    <section
      id="industry-news"
      className="relative overflow-hidden border-y border-border/70 bg-gradient-to-br from-[#7c5cfc]/10 via-card/30 to-[#2563eb]/10 px-6 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#7c5cfc]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#2563eb]/20 blur-3xl" />

      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Industry{" "}
          <span className="bg-gradient-to-br from-[#7c5cfc] via-[#5b7cff] to-[#4db6e8] bg-clip-text text-transparent">
            News
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
          Updates of UAE and Global AI Integration with Healthcare and Beyond
        </p>
      </Reveal>

      <Stagger className="relative mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
        {newsItems.map((item) => {
          const Icon = item.icon

          return (
            <StaggerItem key={item.title}>
              <article className="h-full rounded-2xl border border-border bg-card/70 p-6 transition-colors hover:border-primary/40">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-[#9d8cff]">
                  {item.theme}
                </p>
                <h3 className="mt-3 text-pretty text-lg font-semibold leading-7 tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Published {item.date}
                </p>
              </article>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}
