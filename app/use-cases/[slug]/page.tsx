import Image from "next/image"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { cache, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Landmark,
  LayoutTemplate,
  Stethoscope,
} from "lucide-react"
import { GeneratedPageToolbar } from "@/components/generated-page-toolbar"
import { GovernmentQuestionPrompts } from "@/components/government-question-prompts"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { OWNER_COOKIE, pageIdFromSlug } from "@/lib/consultation/auth"
import { getConsultantRuntime } from "@/lib/consultation/runtime"
import {
  DEFAULT_CTA_LINKS,
  DEFAULT_HERO_LINKS,
  generatedPageContent,
  getUseCase,
  legacyPageContent,
  useCases,
  type PageLink,
  type PersonalizedPageContent,
  type UseCase,
} from "@/lib/use-cases"

const icons = {
  "graduation-cap": GraduationCap,
  landmark: Landmark,
  stethoscope: Stethoscope,
  "layout-template": LayoutTemplate,
}

const transformationCtas = {
  healthcare: {
    theme: "Medical Procedures",
    body: "Let's discuss how MYO'S AI solutions can help your healthcare team improve patient guidance, streamline recovery, and scale trusted medical knowledge.",
  },
  education: {
    theme: "Education Programs",
    body: "Let's discuss how MYO'S AI solutions can help educators extend expert teaching, personalize learning support, and scale trusted academic guidance.",
  },
  government: {
    theme: "Government Operations",
    body: "Let's discuss how MYO'S AI solutions can help public-sector teams standardize training, improve knowledge access, and support service success at scale.",
  },
  template: {
    theme: "AI Expert Use Case",
    body: "Let's turn this flexible template into a MYO'S AI expert designed around your audience, knowledge, workflows, and goals.",
  },
} as const

type SearchParams = {
  brief?: string | string[]
  k?: string | string[]
  rev?: string | string[]
}

type PageProps = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<SearchParams>
}

function single(value: string | string[] | undefined): string | null {
  return typeof value === "string" ? value : null
}

function resolveUseCaseSlug(
  slug: string,
  brief: string | string[] | undefined,
): string | null {
  if (slug !== "template") return slug

  // The template is not a public, generic use-case page. It only exists as the
  // destination of a completed chatbot conversation.
  return typeof brief === "string" && brief.startsWith("c-") ? brief : null
}

/** A generated page, authorized server-side by the owner cookie or a share token. */
const loadGeneratedPage = cache(async (pageId: string, shareToken: string | null, rev: string | null) => {
  const cookieStore = await cookies()
  const revision = rev && /^\d{1,4}$/.test(rev) ? Number.parseInt(rev, 10) : null
  return getConsultantRuntime().service.loadPageForViewer(
    pageId,
    { ownerToken: cookieStore.get(OWNER_COOKIE)?.value ?? null, shareToken },
    revision,
  )
})

type ResolvedPage =
  | { kind: "static"; useCase: UseCase; slug: string }
  | { kind: "personalized"; content: PersonalizedPageContent; slug: string }
  | {
      kind: "generated"
      pageId: string
      content: PersonalizedPageContent
      draft: boolean
      isOwner: boolean
      revision: number
      revisions: { revision: number; status: "draft" | "final" }[]
    }

async function resolvePage(slug: string, searchParams: SearchParams): Promise<ResolvedPage | null> {
  const pageId = pageIdFromSlug(slug)
  if (pageId) {
    const loaded = await loadGeneratedPage(pageId, single(searchParams.k), single(searchParams.rev))
    if (!loaded) return null
    return {
      kind: "generated",
      pageId,
      content: generatedPageContent(loaded.revision),
      draft: loaded.revision.status === "draft",
      isOwner: loaded.isOwner,
      revision: loaded.revision.revision,
      revisions: loaded.isOwner
        ? loaded.page.revisions.map(({ revision, status }) => ({ revision, status }))
        : [],
    }
  }

  const effectiveSlug = resolveUseCaseSlug(slug, searchParams.brief)
  if (!effectiveSlug) return null
  const legacy = legacyPageContent(effectiveSlug)
  if (legacy) return { kind: "personalized", content: legacy, slug: effectiveSlug }
  const useCase = getUseCase(effectiveSlug)
  return useCase ? { kind: "static", useCase, slug: effectiveSlug } : null
}

export function generateStaticParams() {
  return useCases.filter((useCase) => useCase.id !== "template").map((useCase) => ({
    slug: useCase.id,
  }))
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const resolved = await resolvePage(slug, await searchParams)

  if (!resolved) {
    return {
      title: "Use Case Not Found | MYO'S",
      robots: { index: false, follow: false },
    }
  }

  if (resolved.kind === "generated") {
    // Private by default: never indexed, and no referrer so share tokens cannot leak.
    return {
      title: `${resolved.content.useCase.label} AI Digital Twin Proposal`,
      description: resolved.content.useCase.summary,
      robots: { index: false, follow: false, nocache: true },
      referrer: "no-referrer",
    }
  }

  const useCase = resolved.kind === "static" ? resolved.useCase : resolved.content.useCase
  return {
    title: `${useCase.label} AI Expert Avatar Use Case`,
    description: useCase.summary,
    alternates: { canonical: `/use-cases/${useCase.id}` },
    robots: resolved.kind === "personalized"
      ? { index: false, follow: true }
      : { index: true, follow: true },
  }
}

function CtaLink({ link, className, children }: { link: PageLink; className: string; children?: ReactNode }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children ?? link.label}
      </a>
    )
  }
  return (
    <Link href={link.href} className={className}>
      {children ?? link.label}
    </Link>
  )
}

export default async function UseCasePage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolved = await resolvePage(slug, await searchParams)

  if (!resolved) {
    notFound()
  }

  const personalized = resolved.kind === "static" ? null : resolved.content
  const useCase = resolved.kind === "static" ? resolved.useCase : resolved.content.useCase
  const Icon = icons[useCase.icon]
  const [heroPrimary, heroSecondary] = personalized
    ? [personalized.heroPrimary, personalized.heroSecondary]
    : DEFAULT_HERO_LINKS
  const transformationCta = personalized
    ? personalized.cta
    : { ...transformationCtas[useCase.id], primary: DEFAULT_CTA_LINKS[0], secondary: DEFAULT_CTA_LINKS[1] }

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

          {resolved.kind === "generated" && (
            <GeneratedPageToolbar
              draft={resolved.draft}
              isOwner={resolved.isOwner}
              revision={resolved.revision}
              revisions={resolved.revisions}
              basePath={`/use-cases/${slug}`}
              pageId={resolved.pageId}
            />
          )}

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
                <CtaLink
                  link={heroPrimary}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                />
                <CtaLink
                  link={heroSecondary}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
                />
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

      {personalized ? (
        <section className="border-y border-white/10 bg-[#080e19] px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(17rem,0.75fr)] lg:items-end">
              <div>
                <p className="max-w-md font-mono text-[0.68rem] uppercase leading-4 tracking-[0.28em] text-[#8190aa]">
                  {personalized.told.eyebrow}
                </p>
                <h2 className="mt-7 max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#f5f4fa] sm:text-6xl md:text-7xl">
                  {personalized.told.headline}
                </h2>
                <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-[#a5b2ca] md:text-xl">
                  {personalized.told.summary}
                </p>
              </div>

              <div className="lg:pb-2">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#8190aa]">
                  What you told us
                </p>
                <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                  {personalized.told.tags.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-medium text-[#d5dbea]">
                      {item}
                    </span>
                  ))}
                  {personalized.told.highlight && (
                    <span className="rounded-full bg-gradient-to-r from-[#a583ff] to-[#638dff] px-4 py-2 text-sm font-semibold text-[#080e19]">
                      {personalized.told.highlight}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-14 border-t border-white/10 pt-12 md:mt-16 md:pt-14">
              <div className="grid gap-12 md:grid-cols-3 md:gap-10 lg:gap-14">
                {personalized.columns.map((column) => (
                  <div key={column.eyebrow}>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-[#a996ff]">{column.eyebrow}</p>
                    {column.items.map((item, index) => (
                      <div key={item.title} className={index === 0 ? "mt-7" : "mt-6 border-t border-white/[0.07] pt-6"}>
                        <h3 className="font-semibold text-[#f5f4fa]">{item.title}</h3>
                        <p className="mt-2 leading-7 text-[#9eabc3]">{item.body}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
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
              {useCase.demoVideo.heading}
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
        </>
      )}

      <section className="px-6 pb-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-card/70 px-6 py-14 text-center shadow-2xl shadow-black/10 md:px-12 md:py-18">
          <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#2563eb]/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#7c5cfc]/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2563eb]/10 via-transparent to-[#7c5cfc]/10" />

          <div className="relative mx-auto max-w-4xl">
            <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#4db6e8] bg-clip-text text-transparent">
                {transformationCta.theme}
              </span>
              ?
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground md:text-xl">
              {transformationCta.body}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CtaLink
                link={transformationCta.primary}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#2563eb] px-7 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
              >
                {transformationCta.primary.label}
                <ArrowRight className="h-4 w-4" />
              </CtaLink>
              <CtaLink
                link={transformationCta.secondary}
                className="relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full p-px text-sm font-semibold text-[#c4b8ff] shadow-lg shadow-primary/10"
              >
                <span className="absolute -inset-8 animate-gradient-spin bg-[conic-gradient(from_0deg,transparent,#7c5cfc,#5b7cff,#4db6e8,#7c5cfc,transparent)] opacity-80 blur-sm" />
                <span className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-card/95 px-7 ring-1 ring-white/5 transition-colors hover:bg-primary/10">
                  {transformationCta.secondary.label}
                </span>
              </CtaLink>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
