"use client"

import { Check } from "lucide-react"
import { motion } from "motion/react"
import { buttonVariants } from "@/components/ui/button"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

const plans = [
  {
    name: "Pilot",
    tagline: "1 doctor avatar + 3 videos",
    desc: "Ideal for trying MyOS.",
    features: [
      "1 doctor avatar",
      "3 recovery videos",
      "Standard delivery time",
      "Email support",
    ],
    cta: "Start a Pilot",
    featured: false,
  },
  {
    name: "Department",
    tagline: "3 to 5 doctors + 10 to 20 videos",
    desc: "Ideal for growing departments.",
    features: [
      "3 to 5 doctor avatars",
      "10 to 20 recovery videos",
      "Faster turnaround",
      "Dedicated account manager",
      "Priority support",
    ],
    cta: "Book Department Demo",
    featured: true,
  },
  {
    name: "Enterprise",
    tagline: "Multiple departments + integration",
    desc: "Built for hospitals and health systems.",
    features: [
      "Unlimited doctor avatars",
      "Unlimited videos",
      "App / API integration",
      "AI-powered FAQ assistant",
      "Custom workflows & analytics",
      "Dedicated success team & SLA",
    ],
    cta: "Talk to Sales",
    featured: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Start small.{" "}
          <span className="font-serif italic font-normal text-primary">
            Scale fast.
          </span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Ideal for hospitals and health systems.
        </p>
      </Reveal>

      <Stagger className="mx-auto mt-14 grid max-w-5xl items-start gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <StaggerItem key={plan.name}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                plan.featured
                  ? "border-primary bg-gradient-to-b from-primary/10 to-card shadow-2xl shadow-primary/10 md:-mt-2"
                  : "border-border bg-card"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-medium">{plan.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">
                {plan.tagline}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#book-demo"
                className={buttonVariants({
                  variant: plan.featured ? "default" : "outline",
                  className: "mt-8 h-10",
                })}
              >
                {plan.cta}
              </a>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
