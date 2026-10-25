import type { Metadata } from "next"
import { ArrowUpRight, Network, PlugZap } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Technology",
  description: "Explore the core technology and integrations behind MYO'S AI expert avatars.",
  alternates: { canonical: "/technology" },
}

const destinations = [
  {
    href: "/technology/core",
    title: "Core Technology",
    description: "See how approved knowledge, conversational AI, lip synchronization, and a feedback loop work together.",
    icon: Network,
  },
  {
    href: "/technology/apis",
    title: "APIs",
    description: "Explore the video and avatar services used to deliver MYO'S experiences.",
    icon: PlugZap,
  },
]

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="px-6 pb-24 pt-36 md:pb-32 md:pt-48">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">Technology</p>
          <h1 className="mt-8 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-tight md:text-7xl">
            The intelligence behind every interaction.
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            Explore how MYO&apos;S turns trusted expertise into a responsive digital expert, and how its avatar experience connects with supporting services.
          </p>
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {destinations.map(({ href, title, description, icon: Icon }) => (
              <a key={href} href={href} className="group flex flex-col border border-border bg-card p-8 transition-colors hover:border-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <Icon aria-hidden="true" className="h-8 w-8 text-primary" />
                <h2 className="mt-8 flex items-center justify-between gap-4 text-2xl font-semibold tracking-tight">
                  {title}<ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </h2>
                <p className="mt-4 max-w-md leading-7 text-muted-foreground">{description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
