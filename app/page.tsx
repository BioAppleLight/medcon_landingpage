import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { BeforeAfter } from "@/components/before-after"
import { UseCases } from "@/components/use-cases"
import { HowItWorks } from "@/components/how-it-works"
import { HumanDelivery } from "@/components/human-delivery"
import { MetricsStrip } from "@/components/metrics-strip"
import { ComparisonSlider } from "@/components/comparison-slider"
import { Partners } from "@/components/partners"
import { Pricing } from "@/components/pricing"
import { FinalCta } from "@/components/final-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <BeforeAfter />
      <UseCases />
      <HowItWorks />
      <HumanDelivery />
      <MetricsStrip />
      <ComparisonSlider />
      <Partners />
      <Pricing />
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
