"use client"

import { useMemo, useState } from "react"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"
import { BOOKING_URL } from "@/lib/site"
import {
  EDUCATION_PACKAGES,
  FX,
  HUMAN_BASELINE,
  type EducationPackageId,
} from "@/lib/pricingConfig"
import {
  calculateAutomationValue,
  quoteConsultant,
  quoteEducation,
  type QuoteReason,
} from "@/lib/pricingEngine"

type Family = "education" | "consultant" | "automation" | "deployment"

const families: { id: Family; label: string; description: string }[] = [
  { id: "education", label: "Education", description: "Per course and semester" },
  { id: "consultant", label: "AI consultant", description: "Setup plus monthly scope" },
  { id: "automation", label: "Automation", description: "Capacity-led discovery" },
  { id: "deployment", label: "Secure deployment", description: "Control and compliance" },
]

const reasonCopy: Record<QuoteReason, { title: string; body: string; cta: string }> = {
  institutional: {
    title: "Institutional pricing required",
    body: "This cohort is beyond the currently published pilot range. We will design volume bands around your rollout.",
    cta: "Request institutional pricing",
  },
  overage_unpriced: {
    title: "Custom usage quote required",
    body: "This configuration exceeds a published allowance whose overage rate is still pending validation.",
    cta: "Request institutional pricing",
  },
  no_usage_configured: {
    title: "Add at least one learning activity",
    body: "Choose tutor sessions, graded assignments, or both so we can recommend the right package.",
    cta: "Start a course pilot",
  },
  package_mismatch: {
    title: "A simpler package may fit better",
    body: "The selected package includes a capability set to zero. Review the focused alternative below.",
    cta: "Start a course pilot",
  },
  outside_published_packaging: {
    title: "This scope needs a tailored package",
    body: "The estimated capacity comparison falls outside the range supported by published packaging.",
    cta: "Request institutional pricing",
  },
  pricing_pending_validation: {
    title: "Pricing is scoped with your requirements",
    body: "Setup and recurring bands remain quote-led until implementation and usage rates are validated.",
    cta: "Design your AI consultant",
  },
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function number(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  muted,
  note,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  muted?: boolean
  note?: string
  onChange: (value: number) => void
}) {
  return (
    <label className={`block rounded-xl border p-3 ${muted ? "border-border/50 opacity-45" : "border-border bg-background/50"}`}>
      <span className="flex min-h-8 items-start justify-between gap-3 text-xs font-medium leading-4">
        <span>{label}</span>
        <span className="font-mono text-primary">{number(value)}{suffix}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={muted}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-violet-500"
      />
      {note && <span className="mt-1 block text-[0.68rem] leading-4 text-muted-foreground">{note}</span>}
    </label>
  )
}

function QuoteCta({ label }: { label: string }) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
    >
      {label}<ArrowRight className="h-4 w-4" />
    </a>
  )
}

function EducationCalculator() {
  const [packageId, setPackageId] = useState<EducationPackageId>("suite")
  const [students, setStudents] = useState(30)
  const [sessions, setSessions] = useState(4)
  const [assignments, setAssignments] = useState(4)
  const [pages, setPages] = useState(3)
  const [semesters, setSemesters] = useState(1)
  const [courses, setCourses] = useState(1)
  const [hourlyRate, setHourlyRate] = useState<number>(FX.PEER_TUTOR_AED_PER_HOUR)
  const [gradingMinutes, setGradingMinutes] = useState<number>(HUMAN_BASELINE.gradingMinutesPerSubmission)
  const pkg = EDUCATION_PACKAGES[packageId]
  const quote = useMemo(
    () => quoteEducation({
      packageId, students, sessionsPerStudent: sessions,
      assignmentsPerStudent: assignments, pagesPerSubmission: pages,
      semesters, courses, tutorHourlyRateAED: hourlyRate,
      gradingMinutesPerSubmission: gradingMinutes,
    }),
    [packageId, students, sessions, assignments, pages, semesters, courses, hourlyRate, gradingMinutes],
  )

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl border border-border bg-card p-4">
        <label className="block text-xs font-medium">
          Package
          <select
            value={packageId}
            onChange={(event) => setPackageId(event.target.value as EducationPackageId)}
            className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs"
          >
            {Object.entries(EDUCATION_PACKAGES).map(([id, item]) => (
              <option key={id} value={id}>{item.name}</option>
            ))}
          </select>
        </label>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <RangeField label="Students" value={students} min={1} max={400} onChange={setStudents} />
          <RangeField label="Courses" value={courses} min={1} max={10} onChange={setCourses} />
          <RangeField label="Semesters / year" value={semesters} min={1} max={3} onChange={setSemesters} />
          <RangeField label="Tutor / oral sessions per student" value={sessions} min={0} max={12} muted={!pkg.includesTutor} note={!pkg.includesTutor ? "Not included in this package." : undefined} onChange={setSessions} />
          <RangeField label="Graded assignments per student" value={assignments} min={0} max={12} muted={!pkg.includesGrading} note={!pkg.includesGrading ? "Not included in this package." : undefined} onChange={setAssignments} />
          <RangeField label="Pages per submission" value={pages} min={1} max={20} muted={!pkg.includesGrading} note={!pkg.includesGrading ? "Only applies to grading packages." : undefined} onChange={setPages} />
        </div>
      </div>

      <div className="rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/10 via-card to-card p-5">
        {quote.kind === "package" ? (
          <>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Live pilot estimate</p>
            <h3 className="mt-2 text-xl font-semibold">{quote.packageName}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{students} students · {courses} course{courses > 1 ? "s" : ""} · {semesters} semester{semesters > 1 ? "s" : ""}</p>
            <div className="mt-4 border-y border-border py-3">
              <p className="text-4xl font-semibold tracking-tight">{money(quote.total)}</p>
              <p className="mt-1 text-xs text-muted-foreground">per configured course period · ≈ {money(quote.perStudent)} per student</p>
            </div>
            <dl className="mt-3 space-y-2 text-xs">
              {quote.lines.map((line) => <div key={line.label} className="flex justify-between"><dt className="text-muted-foreground">{line.label}</dt><dd>{money(line.amount)}</dd></div>)}
            </dl>
            <div className="mt-4 rounded-xl bg-background/60 p-4">
              <p className="text-sm font-medium">Included capacity</p>
              <ul className="mt-2 grid gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-2">
                {pkg.includesTutor && <li>{quote.included.sessions.toLocaleString()} tutor / oral sessions</li>}
                {pkg.includesGrading && <li>{quote.included.submissions.toLocaleString()} graded submissions ({quote.included.pages.toLocaleString()} pages)</li>}
                <li>Course knowledge-base setup</li><li>Instructor dashboard</li>
              </ul>
            </div>
            <p className="mt-3 text-[0.68rem] leading-4 text-muted-foreground">{quote.notes[0]?.message}</p>
            <QuoteCta label="Start a course pilot" />

            {quote.showCapacityComparison && <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-semibold">Estimated capacity equivalent</p>
              <p className="mt-1 text-2xl font-semibold">{number(quote.capacityHours)} hours</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Approximately {number(quote.capacityValueAED)} AED of human capacity at the assumptions below. This is not a guaranteed saving.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <RangeField label="Tutor hourly rate" value={hourlyRate} min={10} max={200} suffix=" AED" onChange={setHourlyRate} />
                <RangeField label="Grading minutes" value={gradingMinutes} min={1} max={60} suffix=" min" onChange={setGradingMinutes} />
              </div>
            </div>}
          </>
        ) : quote.kind === "quote_required" ? (
          <>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Quote-led configuration</p>
            <h3 className="mt-3 text-2xl font-semibold">{reasonCopy[quote.reason].title}</h3>
            <p className="mt-3 leading-7 text-muted-foreground">{reasonCopy[quote.reason].body}</p>
            {quote.suggestion && (
              <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-5">
                <p className="text-sm font-medium">{quote.suggestion.name} alone covers this configuration — from {money(quote.suggestion.price)}/course/semester.</p>
              </div>
            )}
            <QuoteCta label={reasonCopy[quote.reason].cta} />
          </>
        ) : null}
      </div>
    </div>
  )
}

function ConsultantCalculator() {
  const [conversations, setConversations] = useState(1000)
  const [messages, setMessages] = useState(8)
  const [voice, setVoice] = useState(500)
  const [documents, setDocuments] = useState(50)
  const quote = quoteConsultant()
  return <div className="grid gap-6 lg:grid-cols-2"><div className="grid gap-3 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2"><RangeField label="Monthly conversations" value={conversations} min={100} max={10000} step={100} onChange={setConversations}/><RangeField label="Messages / conversation" value={messages} min={1} max={30} onChange={setMessages}/><RangeField label="Voice minutes" value={voice} min={0} max={5000} step={50} onChange={setVoice}/><RangeField label="Knowledge documents" value={documents} min={1} max={1000} onChange={setDocuments}/></div><div className="rounded-2xl border border-primary/35 bg-primary/10 p-7"><p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Setup + recurring scope</p><h3 className="mt-3 text-2xl font-semibold">{quote.kind === "quote_required" ? reasonCopy[quote.reason].title : "Estimated implementation range"}</h3><p className="mt-3 leading-7 text-muted-foreground">Setup is scoped prominently around conversation volume, voice, knowledge preparation, integrations, analytics, and administration. The rate card is intentionally TBD rather than guessed.</p><QuoteCta label="Design your AI consultant" /></div></div>
}

function AutomationCalculator() {
  const [workflows, setWorkflows] = useState(2), [runs, setRuns] = useState(1000)
  const [minutes, setMinutes] = useState(5), [review, setReview] = useState(10)
  const [labor, setLabor] = useState(150), [integrations, setIntegrations] = useState(2)
  const result = calculateAutomationValue({ workflows, runsPerMonth: runs, minutesSavedPerRun: minutes, failureReviewRate: review, loadedLaborCost: labor, integrations })
  return <div className="grid gap-6 lg:grid-cols-2"><div className="grid gap-3 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2"><RangeField label="Workflows" value={workflows} min={1} max={20} onChange={setWorkflows}/><RangeField label="Runs / month" value={runs} min={100} max={20000} step={100} onChange={setRuns}/><RangeField label="Human minutes / run" value={minutes} min={1} max={60} onChange={setMinutes}/><RangeField label="Failure / review rate" value={review} min={0} max={100} suffix="%" onChange={setReview}/><RangeField label="Loaded labor cost" value={labor} min={20} max={500} suffix=" AED/h" onChange={setLabor}/><RangeField label="Integrations" value={integrations} min={0} max={15} onChange={setIntegrations}/></div><div className="rounded-2xl border border-primary/35 bg-primary/10 p-7"><p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Monthly capacity model</p><p className="mt-5 text-5xl font-semibold">{number(result.hoursSaved)} hours</p><p className="mt-3 text-muted-foreground">Estimated capacity equivalent: {number(result.capacityValue)} AED/month. No product price or guaranteed saving is implied.</p><QuoteCta label="Map an automation opportunity" /></div></div>
}

const deploymentTiers = [
  ["Standard cloud", "Managed shared infrastructure and standard controls."],
  ["Dedicated", "Dedicated resources, isolation, and deployment support."],
  ["Private customer environment", "Deployment inside customer-controlled infrastructure."],
  ["Regulated workflow", "Control mapping, governance, audit, and compliance scope."],
] as const

function DeploymentSelector() {
  const [tier, setTier] = useState(0)
  return <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><div className="grid gap-3 sm:grid-cols-2">{deploymentTiers.map(([name, body], index) => <button key={name} type="button" onClick={() => setTier(index)} className={`rounded-2xl border p-6 text-left transition-colors ${tier === index ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"}`}><ShieldCheck className="h-5 w-5 text-primary"/><h3 className="mt-4 font-semibold">{name}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></button>)}</div><div className="rounded-2xl border border-primary/35 bg-primary/10 p-7"><p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Selected control tier</p><h3 className="mt-3 text-2xl font-semibold">{deploymentTiers[tier][0]}</h3><p className="mt-3 leading-7 text-muted-foreground">Priced on control, environment, integration, and compliance scope—not a public usage estimate.</p><QuoteCta label="Discuss deployment" /></div></div>
}

export function PricingCalculator() {
  const [family, setFamily] = useState<Family>("education")
  return (
    <section aria-labelledby="calculator-heading" className="mx-auto mt-8 max-w-6xl">
      <div className="mb-4 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Interactive estimator</p>
        <h2 id="calculator-heading" className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">Model the right starting point.</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Choose a service family. Published anchors produce estimates; unresolved rates route to a transparent quote.</p>
      </div>
      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Pricing family">
        {families.map((item) => <button key={item.id} role="tab" aria-selected={family === item.id} type="button" onClick={() => setFamily(item.id)} className={`rounded-xl border px-4 py-3 text-left ${family === item.id ? "border-primary bg-primary/10" : "border-border bg-card"}`}><span className="block text-xs font-semibold">{item.label}</span><span className="mt-1 block text-[0.68rem] text-muted-foreground">{item.description}</span></button>)}
      </div>
      {family === "education" && <EducationCalculator />}
      {family === "consultant" && <ConsultantCalculator />}
      {family === "automation" && <AutomationCalculator />}
      {family === "deployment" && <DeploymentSelector />}
      <p className="mt-3 flex items-start gap-2 text-[0.68rem] leading-4 text-muted-foreground"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"/>Estimates are planning aids, exclude tax, and do not guarantee savings. Final scope is validated with your team.</p>
    </section>
  )
}
