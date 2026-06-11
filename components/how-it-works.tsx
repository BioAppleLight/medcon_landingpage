import { Upload, UserCog, Rocket } from "lucide-react"

const steps = [
  {
    n: "01",
    icon: Upload,
    title: "Upload Knowledge",
    desc: "PDFs, SOPs, scripts, and course materials. Your expertise becomes the foundation.",
  },
  {
    n: "02",
    icon: UserCog,
    title: "Create a Digital Twin",
    desc: "Choose voice, avatar, behavior, and language. Shape how your expert shows up.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Deploy Anywhere",
    desc: "Website, LMS, hospital portal, or government platform. Live in minutes.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          From expert to AI colleague in three steps.
        </h2>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.n}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <span className="text-3xl font-semibold text-border">
                  {step.n}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-medium">{step.title}</h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
