import { SiteNav } from "@/components/site-nav"
import { SpecialOfferPopup } from "@/components/special-offer-popup"
import { Hero } from "@/components/hero"
import { Partners } from "@/components/partners"
import { Mission } from "@/components/mission"
import { Problem } from "@/components/problem"
import { Pillars } from "@/components/pillars"
import { BeforeAfter } from "@/components/before-after"
import { UseCases } from "@/components/use-cases"
import { HowItWorks } from "@/components/how-it-works"
import { Workflow } from "@/components/workflow"
import { HumanDelivery } from "@/components/human-delivery"
import { CoreTech } from "@/components/core-tech"
import { ComparisonSlider } from "@/components/comparison-slider"
import { BusinessModel } from "@/components/business-model"
import { IndustryNews } from "@/components/industry-news"
import { Pricing } from "@/components/pricing"
import { ImplementationTimeline } from "@/components/implementation-timeline"
import { FutureExpansion } from "@/components/future-expansion"
import { MetricsStrip } from "@/components/metrics-strip"
import { WhyUs } from "@/components/why-us"
import { Team } from "@/components/team"
import { FinalCta } from "@/components/final-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <SpecialOfferPopup />
      <Hero />
      <Partners />
      <Mission />
      <Problem />
      <Pillars />
      <BeforeAfter />
      <UseCases />
      <HowItWorks />
      <Workflow />
      <HumanDelivery />
      <CoreTech />
      <ComparisonSlider />
      <BusinessModel />
      <IndustryNews />
      <Pricing showModelDiagram={false} />
      <ImplementationTimeline />
      <FutureExpansion />
      <MetricsStrip />
      <WhyUs />
      <Team />
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
