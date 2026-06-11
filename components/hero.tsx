"use client"

import { useEffect, useState } from "react"
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react"
import { Play, Calendar, Stethoscope, GraduationCap, Landmark } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

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
  const reduce = useReducedMotion()

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
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-float-slow absolute left-1/2 top-0 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="animate-float-slow absolute right-10 top-40 h-[320px] w-[320px] rounded-full bg-accent/20 blur-[120px] [animation-delay:-4s]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.a
          href="#book-demo"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.03 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-[#ff6600] text-[9px] font-bold text-white">
            Y
          </span>
          Backed by Y Combinator
        </motion.a>

        <motion.h1
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
        >
          Every expert,{" "}
          <span className="font-serif italic font-normal text-primary">
            available 24/7.
          </span>
        </motion.h1>

        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          Deploy AI-powered doctors, professors, and government assistants that
          teach, guide, and answer questions in real time.
        </motion.p>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
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
            href="#book-demo"
            className={buttonVariants({
              variant: "outline",
              className:
                "h-11 gap-2 px-6 text-base transition-transform hover:-translate-y-0.5",
            })}
          >
            <Calendar className="h-4 w-4" />
            Book Demo
          </a>
        </motion.div>
      </div>

      {/* Cycling avatar card */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-16 max-w-lg"
      >
        <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={scenario.role}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
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
            </motion.div>
          </AnimatePresence>

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
      </motion.div>
    </section>
  )
}
