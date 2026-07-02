import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Landmark,
  Stethoscope,
} from "lucide-react"
import { GovernmentQuestionPrompts } from "@/components/government-question-prompts"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { BOOKING_URL } from "@/lib/site"
import { getUseCase, useCases } from "@/lib/use-cases"

const icons = {
  "graduation-cap": GraduationCap,
  landmark: Landmark,
  stethoscope: Stethoscope,
}

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return useCases.map((useCase) => ({
    slug: useCase.id,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const useCase = getUseCase(slug)

  if (!useCase) {
    return {
      title: "Use Case Not Found | MYO'S",
    }
  }

  return {
    title: `${useCase.label} Use Case | MYO'S`,
    description: useCase.summary,
  }
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params
  const useCase = getUseCase(slug)

  if (!useCase) {
    notFound()
  }

  const Icon = icons[useCase.icon]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/#use-cases"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to use cases
          </Link>

          <div className="mt-10 grid items-center gap-10 md:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Icon className="h-4 w-4" />
                {useCase.label}
              </div>

              <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
                {useCase.headline}
              </h1>

              <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
                {useCase.summary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Book Demo
                </a>
                <Link
                  href="/#pricing"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20">
              <Image
                src={useCase.image}
                alt={useCase.alt}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/40 px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {useCase.outcomes.map((outcome) => (
            <div
              key={outcome}
              className="rounded-xl border border-border bg-background/50 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <Check className="h-4 w-4 text-primary" />
                </span>
                <p className="font-medium">{outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Built around the moments where guidance matters most.
            </h2>
          </div>

          <div className="grid gap-4">
            {useCase.pageSections.map((section) => (
              <div
                key={section.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h3 className="text-xl font-semibold tracking-tight">
                  {section.title}
                </h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {useCase.id === "government" && <GovernmentQuestionPrompts />}

      {useCase.demoVideo && (
        <section id="demo" className="scroll-mt-24 px-6 pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Demonstration to How MYO&apos;s Transforms Education
            </h2>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20">
              <video
                className="aspect-video w-full bg-background object-cover"
                controls
                playsInline
                preload="metadata"
                poster={useCase.demoVideo.poster}
                title={useCase.demoVideo.title}
              >
                <source src={useCase.demoVideo.src} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow">Core capabilities</p>
              <ul className="mt-5 grid gap-4 md:grid-cols-3">
                {useCase.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    <span className="text-sm leading-6 text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/#use-cases"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/10"
            >
              Explore all use cases
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
