import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"
import { UseCases } from "@/components/use-cases"
import { HowItWorks } from "@/components/how-it-works"
import { HumanDelivery } from "@/components/human-delivery"
import { ComparisonSlider } from "@/components/comparison-slider"
import { ImplementationTimeline } from "@/components/implementation-timeline"
import { FutureExpansion } from "@/components/future-expansion"
import { FinalCta } from "@/components/final-cta"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "AI Expert Avatar Product",
  description:
    "Explore how MYO'S transforms trusted human expertise into interactive AI avatars for healthcare, education, government, and enterprise teams.",
  alternates: { canonical: "/product" },
}

export default function ProductPage() {
  return (
    <main id="product" className="min-h-screen bg-background pt-16 text-foreground">
      <SiteNav />
      <UseCases />
      <HowItWorks />
      <HumanDelivery />
      <ComparisonSlider />
      <ImplementationTimeline />
      <FutureExpansion />
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
