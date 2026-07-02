import type { Metadata } from "next"
import { FinalCta } from "@/components/final-cta"
import { Pricing } from "@/components/pricing"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"

export const metadata: Metadata = {
  title: "Pricing | MYO'S",
  description:
    "Explore MYO'S pricing packages for pilot deployments, departments, and enterprise health systems.",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="pt-20">
        <Pricing />
      </div>
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
