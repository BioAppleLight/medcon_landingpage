"use client"

import { useEffect, useState } from "react"
import { Play, Calendar, Stethoscope, GraduationCap, Landmark } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { BOOKING_URL } from "@/lib/site"

const scenarios = [
  {
    role: "Healthcare",
    name: "Dr. Amira Hassan",
    title: "Orthopedic Recovery",
    quote: "Let's review your ACL recovery exercises.",
    icon: Stethoscope,
  },
  {
    role: "Education",
    name: "Prof. Daniel Reyes",
    title: "Calculus Tutor",
    quote: "Can you explain why integration by parts works?",
    icon: GraduationCap,
  },
  {
    role: "Government",
    name: "Khalid Al Mansoori",
    title: "AI Governance Trainer",
    quote: "Would you like help preparing for your AI Governance assessment?",
    icon: Landmark,
  },
]

export function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((v) => (v + 1) % scenarios.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const scenario = scenarios[active]
  const Icon = scenario.icon

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
        <span className="eyebrow animate-rise mx-auto">
          AI expert avatars
        </span>
        <h1 className="animate-rise mt-6 text-balance text-5xl font-semibold leading-[1.03] md:text-7xl [animation-delay:0.05s]">
          Every expert,{" "}
          <span className="font-serif italic font-normal text-primary">
            available 24/7.
          </span>
        </h1>

        <p className="animate-rise mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground [animation-delay:0.15s]">
          Deploy AI-powered doctors, professors, and government assistants that
          teach, guide, and answer questions in real time.
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

      {/* Cycling avatar card */}
      <div className="animate-rise mx-auto mt-16 max-w-lg [animation-delay:0.35s]">
        <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <div key={scenario.role} className="animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                  <Icon className="h-7 w-7 text-primary-foreground" />
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{scenario.name}</p>
                <p className="text-xs text-muted-foreground">
                  {scenario.title}
                </p>
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

          <div className="mt-5 flex items-center justify-center gap-2">
            {scenarios.map((s, i) => (
              <button
                key={s.role}
                type="button"
                aria-label={`Show ${s.role} scenario`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
