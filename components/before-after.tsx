"use client"

import { Reveal } from "@/components/motion-primitives"

const stats = [
  { value: "10,000+", label: "learners reached" },
  { value: "50+", label: "hospitals served" },
  { value: "24/7", label: "always available" },
]

export function BeforeAfter() {
  // 1 source node multiplying into a grid of recipients
  const cols = 12
  const rows = 5
  const total = cols * rows

  return (
    <section className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-5xl text-center">
        <span className="eyebrow block">Scale</span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          One expert.{" "}
          <span className="font-serif italic font-normal text-primary">
            Infinite reach.
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          A single specialist can only be in one place at a time. MyOS removes
          that limit.
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-3xl border border-border bg-card/50 p-8 md:p-12"
      >
        <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
          {/* The single source: one expert */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground">
                1
              </span>
            </div>
            <div className="text-center md:text-left">
              <p className="font-medium">One expert</p>
              <p className="text-sm text-muted-foreground">trained once</p>
            </div>
          </div>

          {/* The many: a grid of reached recipients */}
          <div className="relative">
            <div
              className="grid gap-2.5"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
              aria-hidden="true"
            >
              {Array.from({ length: total }).map((_, i) => {
                // a few highlighted nodes scattered through the crowd
                const highlight = i % 7 === 0 || i % 11 === 3
                return (
                  <span
                    key={i}
                    className={
                      highlight
                        ? "aspect-square rounded-md bg-primary/70"
                        : "aspect-square rounded-md bg-foreground/[0.08]"
                    }
                  />
                )
              })}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Delivered to thousands of learners, patients, and teams at the
              same time.
            </p>
          </div>
        </div>

        {/* Supporting figures */}
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-card p-6 text-center sm:text-left">
              <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
