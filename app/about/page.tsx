import type { Metadata } from "next"
import { BeforeAfter } from "@/components/before-after"
import { BusinessModel } from "@/components/business-model"
import { IndustryNews } from "@/components/industry-news"
import { Hero } from "@/components/hero"
import { Partners } from "@/components/partners"
import { Pillars } from "@/components/pillars"
import { Problem } from "@/components/problem"
import { ResearchQuote } from "@/components/research-quote"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { SpecialOfferPopup } from "@/components/special-offer-popup"
import { WhyUs } from "@/components/why-us"
import { ArrowUpRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About Our AI Expert Platform",
  description:
    "Learn about the problem MYO'S solves, our solution, ability to scale, business model, and industry developments.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <SpecialOfferPopup />
      <Hero />
      <Partners />
      <section aria-label="Explore MYO'S" className="border-y border-border bg-card/30 px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <a href="/about/mission-vision" className="group border border-border bg-background p-7 transition-colors hover:border-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:p-9">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">About MYO&apos;S</p>
            <h2 className="mt-5 flex items-center justify-between gap-4 text-2xl font-semibold tracking-tight">
              Mission &amp; Vision <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Why we work to make trusted expertise accessible, and the future we aim to build.
            </p>
          </a>
          <a href="/technology/core" className="group border border-border bg-background p-7 transition-colors hover:border-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:p-9">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Technology</p>
            <h2 className="mt-5 flex items-center justify-between gap-4 text-2xl font-semibold tracking-tight">
              Core Technology <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              How grounded answers, lip synchronization, and a feedback loop power the avatar experience.
            </p>
          </a>
        </div>
      </section>
      <Problem />
      <Pillars />
      <BeforeAfter />
      <ResearchQuote />
      <BusinessModel />
      <IndustryNews />
      <WhyUs />
      <SiteFooter />
    </main>
  )
}
