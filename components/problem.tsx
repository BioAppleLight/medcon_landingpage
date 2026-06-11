import { Banknote, Brain, MousePointerClick } from "lucide-react"

const problems = [
  {
    icon: Banknote,
    title: "Expert time is scarce and expensive",
    desc: "Top specialists cost thousands per hour, leaving learners and patients without access to the expertise they need.",
  },
  {
    icon: Brain,
    title: "Knowledge walks out the door",
    desc: "When an experienced expert retires or leaves, decades of hard-won institutional knowledge disappears with them.",
  },
  {
    icon: MousePointerClick,
    title: "Passive content doesn't stick",
    desc: "Static textbooks, recorded lectures, and discharge sheets fail because there's no interactive engagement.",
  },
]

export function Problem() {
  return (
    <section id="problem" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-medium uppercase tracking-wider text-primary">
          The Problem
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Expertise doesn&apos;t scale. Until now.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          The high cost of expert time creates inaccessibility for learners and
          patients alike.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {problems.map((p) => {
          const Icon = p.icon
          return (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/15">
                <Icon className="h-5 w-5 text-destructive" />
              </span>
              <h3 className="mt-6 text-lg font-medium">{p.title}</h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
