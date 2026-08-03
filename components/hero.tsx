"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import {
  Play,
  Calendar,
  Stethoscope,
  GraduationCap,
  Landmark,
  SendHorizontal,
} from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { buttonVariants } from "@/components/ui/button"
import { openNextDemo } from "@/lib/demo-links"
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
  const [inquiryPrompt, setInquiryPrompt] = useState("")

  useEffect(() => {
    const id = setInterval(() => {
      setActive((v) => (v + 1) % scenarios.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const prompt = "What are your inquiries?"

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInquiryPrompt(prompt)
      return
    }

    let character = 0
    let typingTimer: ReturnType<typeof setTimeout> | undefined

    const startTimer = setTimeout(() => {
      const typeNextCharacter = () => {
        character += 1
        setInquiryPrompt(prompt.slice(0, character))

        if (character < prompt.length) {
          typingTimer = setTimeout(typeNextCharacter, 65)
        }
      }

      typeNextCharacter()
    }, 650)

    return () => {
      clearTimeout(startTimer)
      if (typingTimer) clearTimeout(typingTimer)
    }
  }, [])

  const scenario = scenarios[active]
  const Icon = scenario.icon

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

        <form
          className="animate-rise mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/15 bg-black/55 p-2 pl-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors focus-within:border-primary/70 [animation-delay:0.2s]"
          onSubmit={(event) => {
            event.preventDefault()
            openNextDemo()
          }}
        >
          <label htmlFor="hero-inquiry" className="sr-only">
            What are your inquiries?
          </label>
          <input
            id="hero-inquiry"
            name="inquiry"
            type="text"
            placeholder={inquiryPrompt}
            className="min-w-0 flex-1 bg-transparent py-3 text-base text-white outline-none placeholder:text-white/55"
          />
          <button
            type="submit"
            aria-label="Send inquiry"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:scale-105 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </form>

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
