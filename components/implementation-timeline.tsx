"use client"

import { Reveal } from "@/components/motion-primitives"

const weeks = [
  {
    week: "Week 1",
    title: "Data Collection",
    desc: "Collect scripts, doctor images, and the procedure list.",
  },
  {
    week: "Week 2",
    title: "Product Development",
    desc: "Generate the avatar and the first demo video.",
  },
  {
    week: "Week 3",
    title: "Product Validation",
    desc: "Clinical review and edits to ensure accuracy.",
  },
  {
    week: "Week 4",
    title: "Deployment",
    desc: "Pilot launch for the selected procedure.",
  },
  {
    week: "Week 5",
    title: "Scaling",
    desc: "Expand to more procedures and doctors.",
  },
]

export function ImplementationTimeline() {
  return (
    <section className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="eyebrow text-primary">
          Implementation
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Live in{" "}
          <span className="font-serif italic font-normal text-primary">
            five weeks.
          </span>
        </h2>
      </Reveal>

      <div className="mx-auto mt-14 max-w-5xl">
        <div className="relative grid gap-4 md:grid-cols-5">
          {/* connecting line (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-[22px] hidden h-px bg-border md:block">
            <div className="animate-grow-line h-full origin-left bg-primary" />
          </div>

          {weeks.map((w, i) => (
            <Reveal
              key={w.week}
              delay={i * 0.15}
              className="group relative transition-transform hover:-translate-y-1.5"
            >
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="mt-4 eyebrow">
                  {w.week}
                </span>
                <h3 className="mt-1 font-medium">{w.title}</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {w.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
