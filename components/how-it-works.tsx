import { Upload, UserCog, Rocket } from "lucide-react"
import { motion } from "motion/react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

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
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          From expert to AI colleague in three steps.
        </h2>
      </Reveal>

      <Stagger className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <StaggerItem key={step.n}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group h-full rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <span className="text-3xl font-semibold text-border transition-colors group-hover:text-primary/30">
                    {step.n}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </motion.div>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}
