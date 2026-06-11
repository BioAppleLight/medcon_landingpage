import { Clock, TrendingDown, BarChart3 } from "lucide-react"

const pillars = [
  {
    icon: Clock,
    title: "Monthly doctor time saved",
    points: [
      "Automates repetitive recovery explanations",
      "One video, reused hundreds of times",
      "Frees clinicians to focus on care",
    ],
  },
  {
    icon: TrendingDown,
    title: "Monthly value saved",
    points: [
      "Fewer phone calls and follow-ups",
      "Lower no-show and complication rates",
      "Higher patient satisfaction and loyalty",
    ],
  },
  {
    icon: BarChart3,
    title: "Return on investment",
    points: [
      "Measurable time and cost savings",
      "Scalable across doctors and locations",
      "High impact on operational efficiency",
    ],
  },
]

export function BusinessModel() {
  return (
    <section id="roi" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-medium uppercase tracking-wider text-primary">
          Business Model
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Doctor-led AI videos that pay for themselves.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Improve patient outcomes and reduce operational load — with a return
          you can measure.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {pillars.map((p) => {
          const Icon = p.icon
          return (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                <Icon className="h-5 w-5 text-primary" />
              </span>
              <h3 className="mt-6 text-lg font-medium">{p.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {p.points.map((point) => (
                  <li
                    key={point}
                    className="text-pretty text-sm leading-relaxed text-muted-foreground"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-accent/10 px-8 py-10 text-center">
        <p className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          Up to <span className="text-primary">40x return</span> vs. traditional
          diagnostic and recovery pathways.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-muted-foreground">
          A traditional MS diagnostic pathway runs €1,500–€7,000. MyOS delivers
          comparable patient guidance from as little as €8.32 per scan at
          hospital scale.
        </p>
      </div>
    </section>
  )
}
