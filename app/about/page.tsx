import type { Metadata } from "next"
import { BeforeAfter } from "@/components/before-after"
import { BusinessModel } from "@/components/business-model"
import { IndustryNews } from "@/components/industry-news"
import { Hero } from "@/components/hero"
import { MetricsStrip } from "@/components/metrics-strip"
import { Partners } from "@/components/partners"
import { Pillars } from "@/components/pillars"
import { Problem } from "@/components/problem"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { SpecialOfferPopup } from "@/components/special-offer-popup"
import { WhyUs } from "@/components/why-us"

export const metadata: Metadata = {
  title: "About | MYO'S",
  description:
    "Learn about the problem MYO'S solves, our solution, ability to scale, business model, and industry developments.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <SpecialOfferPopup />
      <Hero />
      <Partners />
      <Problem />
      <Pillars />
      <BeforeAfter />
      <BusinessModel />
      <IndustryNews />
      <MetricsStrip />
      <WhyUs />
      <SiteFooter />
    </main>
  )
}
