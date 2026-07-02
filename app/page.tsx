import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { Partners } from "@/components/partners"
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
import { Pricing } from "@/components/pricing"
import { ImplementationTimeline } from "@/components/implementation-timeline"
import { FutureExpansion } from "@/components/future-expansion"
import { MetricsStrip } from "@/components/metrics-strip"
import { Team } from "@/components/team"
import { FinalCta } from "@/components/final-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <Partners />
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
      <Pricing showModelDiagram={false} />
      <ImplementationTimeline />
      <FutureExpansion />
      <MetricsStrip />
      <Team />
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
