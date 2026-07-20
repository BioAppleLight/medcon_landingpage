import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { Team } from "@/components/team"

export const metadata: Metadata = {
  title: "Team | MYO'S",
  description:
    "Meet the clinicians, engineers, educators, and advisors building MYO'S.",
}

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-background pt-16 text-foreground">
      <SiteNav />
      <Team />
      <SiteFooter />
    </main>
  )
}
