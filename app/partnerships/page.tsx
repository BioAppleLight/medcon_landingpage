import Image from "next/image"
import type { Metadata } from "next"
import {
  ArrowRight,
  Building2,
  Cloud,
  Code2,
  GraduationCap,
  Handshake,
  HeartPulse,
  Landmark,
  Network,
  ScrollText,
} from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { BOOKING_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Partnerships and Collaborations | MYO'S",
  description:
    "Explore MYO'S funding goals, UAE grant opportunities, venture capital partnerships, and strategic investor collaboration.",
}

const fundingGoals = [
  {
    icon: Landmark,
    title: "UAE grant opportunities",
    desc: "Align MYO'S with national innovation, AI adoption, workforce development, and institutional knowledge preservation programs.",
  },
  {
    icon: Handshake,
    title: "Venture capital partnerships",
    desc: "Work with capital partners who understand applied AI, enterprise software, and scalable human-centered delivery models.",
  },
  {
    icon: Building2,
    title: "Strategic investors",
    desc: "Collaborate with institutions, operators, and regional partners who can accelerate market access and real-world adoption.",
  },
]

const collaborationRequests = [
  {
    icon: Code2,
    title: "API partnerships",
    desc: "Connect MYO'S with the systems organizations already use, from learning platforms and CRMs to internal knowledge bases and workflow tools.",
  },
  {
    icon: Cloud,
    title: "Cloud partnerships",
    desc: "Collaborate on secure, scalable infrastructure that supports enterprise deployments, regional hosting requirements, and dependable AI delivery.",
  },
  {
    icon: Network,
    title: "UAE AI ecosystem collaborations",
    desc: "Partner with accelerators, innovation hubs, universities, and AI programs shaping the UAE's applied artificial intelligence ecosystem.",
  },
  {
    icon: Building2,
    title: "Enterprise pilot partners",
    desc: "Launch focused pilots with organizations ready to validate knowledge avatars in real training, service, onboarding, and expert-support workflows.",
  },
]

const currentFocus = [
  {
    icon: GraduationCap,
    title: "Education",
    desc: "AI teaching, tutoring, oral assessment, and institutional knowledge delivery for universities and learning providers.",
  },
  {
    icon: Landmark,
    title: "Government",
    desc: "Training, public-service knowledge, compliance guidance, and multilingual access for departments and public institutions.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare",
    desc: "Patient guidance, recovery education, staff training, and expert communication workflows across clinical environments.",
  },
  {
    icon: ScrollText,
    title: "Enterprise knowledge management",
    desc: "Preserving internal expertise and turning documents, procedures, and decisions into accessible AI expert support.",
  },
]

export default function PartnershipsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="eyebrow text-primary">
              Partnerships and Collaborations
            </span>
            <h1 className="mt-4 bg-gradient-to-br from-[#7c5cfc] via-[#5b7cff] to-[#4db6e8] bg-clip-text text-balance text-4xl font-semibold tracking-tight text-transparent md:text-6xl">
              Building MYO&apos;S with aligned capital and strategic partners.
            </h1>
            <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground">
              We are seeking funding and collaboration partners who can help
              MYO&apos;S scale trusted AI avatars across organizations that need
              reliable knowledge transfer, training, and expert guidance.
            </p>
          </div>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20">
              <Image
                src="/partnerships/uae-ai-skyline.svg"
                alt="UAE skyline with AI growth visual"
                width={1200}
                height={900}
                priority
                className="h-auto w-full"
              />
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#7c5cfc]/15 via-card/70 to-[#2563eb]/15 p-6 shadow-2xl shadow-black/10 md:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#7c5cfc]/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#2563eb]/20 blur-3xl" />

              <div className="relative">
                <span className="eyebrow text-primary">Funding Goals</span>
                <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                  Funding goals for regional growth.
                </h2>
                <p className="mt-5 text-pretty leading-8 text-muted-foreground">
                  MYO&apos;S is preparing for partnerships that combine capital,
                  regional insight, institutional credibility, and practical
                  deployment pathways.
                </p>
              </div>

              <div className="relative mt-8 grid gap-4">
                {fundingGoals.map((goal) => {
                  const Icon = goal.icon
                  return (
                    <div
                      key={goal.title}
                      className="flex gap-4 rounded-md border border-border bg-card/80 p-5 shadow-xl shadow-black/15"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-medium">{goal.title}</h3>
                        <p className="mt-1 text-sm leading-7 text-muted-foreground">
                          {goal.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/40 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="eyebrow text-primary">Collaboration Requests</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Partnerships that help MYO&apos;S deploy faster.
            </h2>
            <p className="mt-5 text-pretty leading-8 text-muted-foreground">
              We are looking for technical, cloud, ecosystem, and enterprise
              partners who can help bring trusted AI avatars into real
              organizational environments.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {collaborationRequests.map((request) => {
              const Icon = request.icon
              return (
                <div
                  key={request.title}
                  className="flex gap-4 rounded-2xl border border-border bg-background/60 p-6"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {request.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {request.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="eyebrow text-primary">Current Focus</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Markets where MYO&apos;S is building first.
            </h2>
            <p className="mt-5 text-pretty leading-8 text-muted-foreground">
              These focus areas share the same core need: preserving expert
              knowledge and delivering it through reliable, human-like AI
              avatars.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {currentFocus.map((focus) => {
              const Icon = focus.icon
              return (
                <div
                  key={focus.title}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {focus.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {focus.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/40 px-6 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <span className="eyebrow text-primary">Investor conversations</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Let&apos;s explore the right partnership structure.
            </h2>
          </div>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Book Demo
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
