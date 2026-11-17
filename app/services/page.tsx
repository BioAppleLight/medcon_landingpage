import type { Metadata } from "next"
import { Check } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { FinalCta } from "@/components/final-cta"
import { Reveal, MaskReveal, DrawLine } from "@/components/gsap"
import {
  AutomationArt,
  WebDesignArt,
  SoftwareDevArt,
  AiAgentsArt,
  AvatarsArt,
  ConsultationArt,
} from "@/components/service-art"
import { services } from "@/lib/services-content"

export const metadata: Metadata = {
  title: "AI Automation and Software Services",
  description:
    "AI automation, web design, software development, custom AI agents, AI avatars, and AI consultation from MYO'S.",
  alternates: { canonical: "/services" },
}

const serviceArt = {
  automation: AutomationArt,
  web_design: WebDesignArt,
  software_dev: SoftwareDevArt,
  ai_agents: AiAgentsArt,
  avatars: AvatarsArt,
  consultation: ConsultationArt,
} as const

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="px-6 pb-16 pt-32 text-center md:pb-24 md:pt-44">
        <div className="mx-auto max-w-4xl">
          <MaskReveal
            as="p"
            className="font-mono text-xs uppercase tracking-[0.35em] text-primary"
          >
            Our Services
          </MaskReveal>
          <MaskReveal
            as="h1"
            delay={0.08}
            className="mt-8 text-balance text-5xl font-semibold tracking-tight md:text-8xl"
          >
            <span className="text-foreground">Capture.</span>{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Curate.
            </span>{" "}
            <span className="text-accent">Connect.</span>
          </MaskReveal>
          <MaskReveal
            as="p"
            delay={0.16}
            className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground"
          >
            Scalable, secure, and custom-fit digital solutions that help your
            organization work smarter and grow faster.
          </MaskReveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <DrawLine className="h-px w-full bg-gradient-to-r from-primary via-accent to-transparent" />
      </div>

      {/* SERVICES */}
      <section className="py-20 md:py-28">
        <Reveal className="services-belt services-marquee-viewport w-screen max-w-none overflow-hidden py-8">
          <div className="services-marquee flex w-max hover:[animation-play-state:paused]">
            {[false, true].map((duplicate) => (
              <ul
                key={duplicate ? "duplicate" : "primary"}
                aria-hidden={duplicate || undefined}
                className={`flex gap-6 pr-6 md:gap-8 md:pr-8 ${duplicate ? "services-marquee-copy" : ""}`}
              >
                {services.map((service) => {
                  const Art = serviceArt[service.art]
                  return (
                    <li
                      key={service.step}
                      className="group flex h-[31rem] w-[min(21rem,calc(100vw-3rem))] shrink-0 flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 md:w-[23rem]"
                    >
                      <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-background p-6">
                        <Art className="w-full max-w-[220px] transition-transform duration-300 group-hover:scale-105" />
                        <span className="absolute right-5 top-5 font-serif text-lg italic text-accent/70">
                          {service.step}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-7 md:p-8">
                        <h2 className="text-xl font-semibold tracking-tight">
                          {service.title}
                        </h2>
                        <p className="mt-2 text-sm font-medium text-primary">
                          {service.tagline}
                        </p>
                        <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
                          {service.desc}
                        </p>

                        <ul className="mt-6 flex flex-1 flex-col gap-3">
                          {service.points.map((point) => (
                            <li
                              key={point}
                              className="flex items-start gap-3 text-sm"
                            >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                              <span className="text-muted-foreground">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ))}
          </div>
        </Reveal>
      </section>

      <FinalCta />
      <SiteFooter />
    </main>
  )
}
