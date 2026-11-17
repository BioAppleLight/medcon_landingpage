"use client"

import Link from "next/link"
import { ArrowRight, Check, Eye, Loader2, PencilLine } from "lucide-react"
import type { ConsultationView, OfferingFit, SolutionType } from "@/lib/consultation/types"

const SOLUTION_LABELS: Record<SolutionType, string> = {
  ai_expert_avatar: "AI expert avatar",
  digital_human_presenter: "Digital-human presenter",
  knowledge_agent: "Knowledge-based AI agent",
  simulation_digital_twin: "Simulation digital twin",
  hybrid: "Hybrid solution",
}

const FIT_LABELS: Record<OfferingFit, { label: string; className: string }> = {
  current: { label: "Available today", className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" },
  customization: { label: "Customization", className: "border-sky-400/30 bg-sky-400/10 text-sky-200" },
  new_development: { label: "New development", className: "border-amber-400/30 bg-amber-400/10 text-amber-200" },
  unconfirmed: { label: "Feasibility to confirm", className: "border-white/20 bg-white/5 text-white/70" },
}

/**
 * The proposal summary shown before generation. Nothing is generated until the visitor presses
 * Confirm (or types a confirmation) — and the server checks they confirmed this exact version.
 */
export function ProposalCard({
  view,
  busy,
  onConfirm,
  onPreview,
  onRevise,
  compact = false,
}: {
  view: ConsultationView
  busy: string | null
  onConfirm: () => void
  onPreview: () => void
  onRevise: () => void
  compact?: boolean
}) {
  const proposal = view.proposal
  if (!proposal) return null

  const awaitingConfirmation = view.stage === "REVIEW"
  const generating = busy === "confirm" || view.stage === "GENERATION" || view.stage === "CONFIRMATION"
  const disabled = busy !== null

  return (
    <section
      aria-label="Proposed solution"
      className="animate-fade-in w-full overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] text-left"
    >
      <div className="border-b border-white/10 px-5 py-4">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[#a996ff]">
          Proposed solution · v{proposal.version} · {SOLUTION_LABELS[proposal.solution_type]}
        </p>
        <h3 className="mt-2 text-balance text-lg font-semibold leading-snug text-white">{proposal.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/75">{proposal.summary}</p>
      </div>

      <div className="grid gap-4 px-5 py-4 text-sm">
        {proposal.components.length > 0 && (
          <ul className="grid gap-1.5">
            {proposal.components.slice(0, compact ? 3 : 6).map((component) => (
              <li key={component} className="flex items-start gap-2 text-white/80">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a996ff]" />
                <span>{component}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-1.5">
          {proposal.offerings_detail.map((offering) => (
            <span
              key={offering.offering_id}
              title={offering.note}
              className={`rounded-full border px-2.5 py-1 text-xs ${FIT_LABELS[offering.fit].className}`}
            >
              {offering.name} · {FIT_LABELS[offering.fit].label}
            </span>
          ))}
        </div>

        <p className="text-white/70">
          <span className="font-medium text-white/90">Human oversight: </span>
          {proposal.human_oversight}
        </p>

        {!compact && proposal.assumptions.length > 0 && (
          <div>
            <p className="font-medium text-white/90">Assumptions to check</p>
            <ul className="mt-1 list-disc pl-5 text-white/70">
              {proposal.assumptions.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        )}
        {proposal.open_questions.length > 0 && (
          <div>
            <p className="font-medium text-white/90">Open questions</p>
            <ul className="mt-1 list-disc pl-5 text-white/70">
              {proposal.open_questions.slice(0, compact ? 2 : 6).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-5 py-4">
        {awaitingConfirmation || generating ? (
          <button
            type="button"
            onClick={onConfirm}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {generating ? "Generating your page…" : "Confirm & generate page"}
          </button>
        ) : (
          view.page && (
            <Link
              href={view.page.url}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
            >
              Open your page
              <ArrowRight className="h-4 w-4" />
            </Link>
          )
        )}
        <button
          type="button"
          onClick={onPreview}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-2 text-sm text-white/85 transition-colors hover:border-primary/60 hover:bg-primary/20 disabled:pointer-events-none disabled:opacity-50"
        >
          {busy === "preview" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
          Preview draft
        </button>
        <button
          type="button"
          onClick={onRevise}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-2 text-sm text-white/85 transition-colors hover:border-primary/60 hover:bg-primary/20 disabled:pointer-events-none disabled:opacity-50"
        >
          <PencilLine className="h-3.5 w-3.5" />
          Change something
        </button>
      </div>
    </section>
  )
}
