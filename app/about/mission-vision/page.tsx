import type { Metadata } from "next"
import { Mission } from "@/components/mission"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"

export const metadata: Metadata = {
  title: "Mission & Vision",
  description: "Learn why MYO'S makes trusted human expertise available through interactive AI, and the future we are working toward.",
  alternates: { canonical: "/about/mission-vision" },
}

export default function MissionVisionPage() {
  return (
    <main className="min-h-screen bg-background pt-16 text-foreground">
      <SiteNav />
      <Mission />
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">The problem we address</p>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight md:text-5xl">Expertise should travel further.</h2>
          </div>
          <p className="text-pretty text-lg leading-8 text-muted-foreground">
            People often need guidance when a specialist is unavailable. Valuable knowledge can also be locked in documents or lost when experienced people leave. MYO&apos;S works to make that knowledge easier to access through interactive, source-grounded conversations.
          </p>
        </div>
      </section>
      <section className="border-t border-border bg-card/40 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Our vision</p>
          <h2 className="mt-5 max-w-4xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            A future where trusted expertise is available when and where people need it.
          </h2>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            We aim to help organizations preserve what their experts know and share it across locations, languages, and generations, while keeping people and their approved knowledge at the center.
          </p>
          <a href="/technology/core" className="mt-9 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            See how the technology works →
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
