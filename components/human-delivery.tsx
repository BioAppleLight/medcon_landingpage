"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Check, Play } from "lucide-react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

const features = [
  { title: "Speaks naturally", desc: "Human cadence, tone, and expression." },
  { title: "Remembers context", desc: "Picks up where the conversation left off." },
  { title: "Supports multiple languages", desc: "One expert, many audiences." },
  { title: "Available 24/7", desc: "No queues, no out-of-office." },
]

export function HumanDelivery() {
  return (
    <section className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          It doesn&apos;t just look human. It sounds human.
        </h2>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                  <Check className="h-4 w-4 text-primary" />
                </span>
                <h3 className="mt-4 font-medium">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <button
            type="button"
            className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-border bg-secondary"
            aria-label="Play product demo video"
          >
            <Image
              src="/demos/human-delivery.png"
              alt="MyOS AI avatar speaking naturally to camera"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-background/30">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/40 [animation-duration:2s]" />
                <Play className="h-6 w-6 translate-x-0.5" />
              </span>
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  )
}
