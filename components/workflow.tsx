import { ArrowRight, ClipboardList, Wand2, Smartphone } from "lucide-react"

const columns = [
  {
    icon: ClipboardList,
    tag: "Input",
    title: "The hospital provides",
    items: [
      "Procedure name & recovery script",
      "Exercise instructions",
      "Expected & red-flag symptoms",
      "Doctor headshots or rotation video",
    ],
  },
  {
    icon: Wand2,
    tag: "MyOS Production",
    title: "MyOS creates",
    items: [
      "A lifelike doctor avatar",
      "A 2–4 minute personalized video",
      "Step-by-step exercise demonstrations",
      "An approved patient FAQ layer",
    ],
  },
  {
    icon: Smartphone,
    tag: "Patient Delivery",
    title: "The patient receives",
    items: [
      "A personalized recovery video",
      "A clear recovery timeline",
      "Safety reminders & red flags",
      "A link inside the hospital app",
    ],
  },
]

export function Workflow() {
  return (
    <section id="workflow" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-medium uppercase tracking-wider text-primary">
          Healthcare Workflow
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          From procedure to personalized recovery.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Content stays physician-approved and standardized — then scales to
          hundreds of patients.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {columns.map((col, i) => {
          const Icon = col.icon
          return (
            <div key={col.tag} className="contents">
              <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {col.tag}
                  </span>
                </div>
                <h3 className="mt-5 font-medium">{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="text-pretty text-sm text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {i < columns.length - 1 && (
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 rotate-90 text-primary md:rotate-0" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
