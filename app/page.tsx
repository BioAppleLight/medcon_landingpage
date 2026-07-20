import { SiteNav } from "@/components/site-nav"
import { SpecialOfferPopup } from "@/components/special-offer-popup"
import { Mission } from "@/components/mission"
import { UseCases } from "@/components/use-cases"
import { HowItWorks } from "@/components/how-it-works"
import { HumanDelivery } from "@/components/human-delivery"
import { CoreTech } from "@/components/core-tech"
import { ComparisonSlider } from "@/components/comparison-slider"
import { Pricing } from "@/components/pricing"
import { ImplementationTimeline } from "@/components/implementation-timeline"
import { FutureExpansion } from "@/components/future-expansion"
import { FinalCta } from "@/components/final-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <SpecialOfferPopup />
      <Mission />
      <UseCases />
      <HowItWorks />
      <HumanDelivery />
      <CoreTech />
      <ComparisonSlider />
      <Pricing showModelDiagram={false} />
      <ImplementationTimeline />
      <FutureExpansion />
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
