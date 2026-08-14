"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, Stethoscope, GraduationCap, Landmark, LayoutTemplate } from "lucide-react"
import { Reveal } from "@/components/motion-primitives"
import { useCases, type UseCaseId } from "@/lib/use-cases"
import {
  hasPersonalizedUseCase,
  PERSONALIZED_USE_CASE_EVENT,
  readPersonalizedIndustryLabel,
  readPersonalizedUseCaseUrl,
} from "@/lib/personalized-use-case-link"

const icons = {
  "graduation-cap": GraduationCap,
  landmark: Landmark,
  stethoscope: Stethoscope,
  "layout-template": LayoutTemplate,
}

export function UseCases() {
  const [active, setActive] = useState<UseCaseId>(useCases[0].id)
  const [templateUrl, setTemplateUrl] = useState("/use-cases/template")
  const [industryLabel, setIndustryLabel] = useState<string | null>(null)
  const [showTemplate, setShowTemplate] = useState(false)
  const tab = useCases.find((useCase) => useCase.id === active)!

  useEffect(() => {
    const sync = () => {
      setTemplateUrl(readPersonalizedUseCaseUrl())
      setIndustryLabel(readPersonalizedIndustryLabel())
      setShowTemplate(hasPersonalizedUseCase())
    }
    sync()
    window.addEventListener(PERSONALIZED_USE_CASE_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(PERSONALIZED_USE_CASE_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  return (
    <section
      id="use-cases"
      className="relative overflow-hidden border-y border-border/70 bg-gradient-to-br from-[#2563eb]/10 via-card/25 to-[#7c5cfc]/10 px-6 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 bottom-12 h-64 w-64 rounded-full bg-[#2563eb]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-[#7c5cfc]/20 blur-3xl" />

      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Built for the industries that can&apos;t afford to get it wrong.
        </h2>
      </Reveal>

      <div className="relative mx-auto mt-10 max-w-5xl">
        <div
          role="tablist"
          aria-label="Use case industries"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {useCases
            .filter((useCase) => useCase.id !== "template" || showTemplate)
            .map((useCase) => {
              const Icon = icons[useCase.icon]
              const isActive = useCase.id === active
              return (
                <button
                  key={useCase.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${useCase.id}-panel`}
                  onClick={() => setActive(useCase.id)}
                  onMouseEnter={() => setActive(useCase.id)}
                  onFocus={() => setActive(useCase.id)}
                  className={`relative inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-primary text-primary-foreground"
                      : "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-primary" />
                  )}
                  <Icon className="h-4 w-4" />
                  {useCase.id === "template" && industryLabel ? industryLabel : useCase.label}
                </button>
              )
            })}
        </div>

        <div
          id={`${tab.id}-panel`}
          role="tabpanel"
          className="mt-10 grid items-center gap-8 overflow-hidden rounded-2xl border border-border bg-card p-6 md:grid-cols-2 md:p-8"
        >
          <div key={`${tab.id}-text`} className="animate-fade-in">
            <h3 className="text-balance text-2xl font-semibold tracking-tight">
              {tab.headline}
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {tab.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  <span className="text-pretty text-muted-foreground">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={tab.id === "template" ? templateUrl : `/use-cases/${tab.id}`}
              className="mt-8 inline-flex text-sm font-semibold text-white transition-colors hover:text-white/80"
            >
              Learn More
            </Link>
          </div>

          <div
            key={`${tab.id}-img`}
            className="animate-fade-in relative aspect-video overflow-hidden rounded-xl border border-border bg-secondary"
          >
            <Image
              src={tab.image || "/placeholder.svg"}
              alt={tab.alt}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
