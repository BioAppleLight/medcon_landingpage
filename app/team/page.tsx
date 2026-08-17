import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { Team } from "@/components/team"

export const metadata: Metadata = {
  title: "Meet Our AI, Clinical and Education Team",
  description:
    "Meet the clinicians, engineers, educators, and advisors building MYO'S.",
  alternates: { canonical: "/team" },
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
