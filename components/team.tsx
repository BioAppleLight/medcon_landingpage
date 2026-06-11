const team = [
  { name: "Terezia Juras", role: "Founder, mMEDCON & MyOS" },
  { name: "Lenka Sadovska", role: "Marketing & PR" },
  { name: "Abbas Raza", role: "Backend Developer" },
  { name: "Ignatius Ratemo", role: "Systems Developer" },
  { name: "Emma Kortosova", role: "Associate @ mMEDCON" },
  { name: "Sayda Abusalih", role: "Management & Outreach" },
  { name: "Prof. Dr. Charmayne M. L. Hughes", role: "Advisor" },
]

const mentors = [
  "Yale",
  "New York University",
  "Charles University",
  "TU Berlin",
  "University of Amsterdam",
  "NIMHANS",
  "Czech Technical University",
  "Comenius University",
]

function initials(name: string) {
  return name
    .replace(/^(Prof\.|Dr\.)\s*/gi, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

export function Team() {
  return (
    <section id="team" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-medium uppercase tracking-wider text-primary">
          Our Team
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Built by clinicians, engineers, and educators.
        </h2>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <div
            key={member.name}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              {initials(member.name)}
            </span>
            <div>
              <p className="font-medium leading-tight">{member.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {member.role}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-5xl text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Mentored by experts from leading institutions
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {mentors.map((m) => (
            <span
              key={m}
              className="text-sm font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
