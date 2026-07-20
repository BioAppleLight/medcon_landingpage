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

export const metadata: Metadata = {
  title: "Services | MYO'S",
  description:
    "AI automation, web design, software development, custom AI agents, AI avatars, and AI consultation from MYO'S.",
}

const services = [
  {
    step: "01",
    art: AutomationArt,
    title: "AI Agent Automation",
    tagline: "Automate repetitive work with intelligent, reliable workflows.",
    desc: "We design AI-powered automations that connect your tools, handle routine processes, and give your team more time for high-value work.",
    points: [
      "Workflow and process automation",
      "CRM, ERP, and support integrations",
      "Human review and safety controls",
    ],
  },
  {
    step: "02",
    art: WebDesignArt,
    title: "Web Design",
    tagline: "High-performing digital experiences built around your brand.",
    desc: "We create responsive, accessible websites that look polished, communicate clearly, and turn visitors into customers.",
    points: [
      "UX and UI design",
      "Responsive development",
      "SEO and performance optimization",
    ],
  },
  {
    step: "03",
    art: SoftwareDevArt,
    title: "Software Development",
    tagline: "Custom software engineered for your operations and growth.",
    desc: "From focused internal tools to full-scale platforms, we build secure software tailored to your users, systems, and business goals.",
    points: [
      "Full-stack application development",
      "API and systems integration",
      "Maintenance and modernization",
    ],
  },
  {
    step: "04",
    art: AiAgentsArt,
    title: "Custom AI Agents",
    tagline: "Purpose-built AI assistants grounded in your knowledge.",
    desc: "We develop secure AI agents that answer questions, guide users, and take action using your approved information and business rules.",
    points: [
      "Knowledge-grounded assistants",
      "Tool use and multi-step reasoning",
      "Web, app, and platform deployment",
    ],
  },
  {
    step: "05",
    art: AvatarsArt,
    title: "AI Avatars",
    tagline: "Bring trusted expertise to life through a human presence.",
    desc: "Create multilingual digital experts that communicate naturally and deliver consistent guidance, training, and support at scale.",
    points: [
      "Custom voice and visual identity",
      "Multilingual conversations",
      "Training, onboarding, and support",
    ],
  },
  {
    step: "06",
    art: ConsultationArt,
    title: "AI Consultation",
    tagline: "A practical AI strategy aligned with real business value.",
    desc: "We help you identify the strongest opportunities, choose the right technology, and create a responsible roadmap from pilot to deployment.",
    points: [
      "AI readiness assessment",
      "Use-case and technology planning",
      "Governance and implementation roadmap",
    ],
  },
]

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
                  const Art = service.art
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
