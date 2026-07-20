import type { Metadata } from "next"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { MaskReveal, Reveal } from "@/components/gsap"

export const metadata: Metadata = {
  title: "AI APIs | MYO'S",
  description:
    "Explore the video generation and AI avatar APIs available through MYO'S integrations.",
}

type ApiPlatform = {
  model: string
  brand: string
  logo: string
  category: "Video generation" | "AI avatars"
  description: string
}

const apiPlatforms: ApiPlatform[] = [
  {
    model: "Veo 3.1",
    brand: "Google Veo",
    logo: "/api-logos/veo.png",
    category: "Video generation",
    description: "Cinematic text-to-video and image-to-video generation.",
  },
  {
    model: "Sora 2",
    brand: "OpenAI Sora",
    logo: "/api-logos/sora.png",
    category: "Video generation",
    description: "Generative video for expressive scenes and visual storytelling.",
  },
  {
    model: "Runway Gen-4.5",
    brand: "Runway",
    logo: "/api-logos/runway.png",
    category: "Video generation",
    description: "Production-focused video generation and creative editing.",
  },
  {
    model: "Kling 3.0",
    brand: "Kling AI",
    logo: "/api-logos/kling.png",
    category: "Video generation",
    description: "High-motion video generation from text and visual prompts.",
  },
  {
    model: "Pika Labs",
    brand: "Pika",
    logo: "/api-logos/pika.png",
    category: "Video generation",
    description: "Fast creative video generation, effects, and transformations.",
  },
  {
    model: "PixVerse",
    brand: "PixVerse",
    logo: "/api-logos/pixverse.png",
    category: "Video generation",
    description: "Stylized video creation and image animation workflows.",
  },
  {
    model: "HeyGen",
    brand: "HeyGen",
    logo: "/api-logos/heygen.png",
    category: "AI avatars",
    description: "Talking avatars, voice localization, and personalized video.",
  },
  {
    model: "Synthesia",
    brand: "Synthesia",
    logo: "/api-logos/synthesia.png",
    category: "AI avatars",
    description: "Business video creation with multilingual AI presenters.",
  },
  {
    model: "Colossyan",
    brand: "Colossyan",
    logo: "/api-logos/colossyan.png",
    category: "AI avatars",
    description: "AI presenter videos for learning and workplace communication.",
  },
  {
    model: "Hailuo Minimax",
    brand: "MiniMax Hailuo",
    logo: "/api-logos/minimax.png",
    category: "Video generation",
    description: "Prompt-driven video generation with dynamic visual motion.",
  },
]

export default function ApisPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="px-6 pb-16 pt-32 md:pb-24 md:pt-44">
        <div className="mx-auto max-w-6xl">
          <MaskReveal
            as="p"
            className="font-mono text-xs uppercase tracking-[0.35em] text-primary"
          >
            Technology / APIs
          </MaskReveal>
          <MaskReveal
            as="h1"
            delay={0.08}
            className="mt-8 max-w-5xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
          >
            One integration layer for the world&apos;s leading{" "}
            <span className="font-serif font-normal italic text-primary">
              generative media APIs.
            </span>
          </MaskReveal>
          <MaskReveal
            as="p"
            delay={0.16}
            className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground"
          >
            MYO&apos;S brings video generation and AI avatar platforms into
            workflows designed around your content, users, and business needs.
          </MaskReveal>
        </div>
      </section>

      <section className="px-6 pb-24 md:pb-32">
        <Reveal
          as="ul"
          stagger
          className="mx-auto grid max-w-6xl border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {apiPlatforms.map((platform) => (
            <li
              key={platform.model}
              className="group relative isolate min-h-72 overflow-hidden border-b border-r border-border bg-card/30 p-7 transition-colors before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-purple-600/35 before:via-violet-500/25 before:to-blue-500/35 before:opacity-0 before:transition-opacity before:duration-300 hover:border-primary/60 hover:before:opacity-100 md:p-8"
            >
              <div className="flex items-start gap-5">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-border bg-white p-2 shadow-lg shadow-black/15">
                    <Image
                      src={platform.logo}
                      alt={`${platform.brand} logo`}
                      width={48}
                      height={48}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs text-muted-foreground">
                      {platform.brand}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight">
                      {platform.model}
                    </h2>
                  </div>
                </div>
              </div>

              <p className="mt-10 text-sm leading-7 text-muted-foreground">
                {platform.description}
              </p>

              <div className="mt-8 border-t border-border pt-4">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary">
                  {platform.category}
                </span>
              </div>
            </li>
          ))}
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  )
}
