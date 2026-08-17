"use client"

import { useState } from "react"
import { EDUCATION_PACKAGES, INTERNAL_COMMERCIAL } from "@/lib/pricingConfig"

const scenarios = ["low", "base", "high"] as const

export function QuoteEngine() {
  const [cogs, setCogs] = useState<Record<(typeof scenarios)[number], number>>({ low: 0, base: 0, high: 0 })
  const [margin, setMargin] = useState(0)

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Internal only</p>
        <h1 className="mt-3 text-4xl font-semibold">MYO&apos;S quote engine</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">COGS → minimum viable → target-margin → value-based → list → quote. Empty commercial constants remain TBD in the shared config.</p>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Utilization scenarios</h2>
            <label className="mt-5 block text-sm">Target gross margin (%)
              <input type="number" min="0" max="99" value={margin} onChange={(event) => setMargin(Number(event.target.value))} className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3" />
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {scenarios.map((scenario) => <label key={scenario} className="text-sm capitalize">{scenario} COGS (USD)
                <input type="number" min="0" value={cogs[scenario]} onChange={(event) => setCogs((current) => ({ ...current, [scenario]: Number(event.target.value) }))} className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3" />
              </label>)}
            </div>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6">
            <h2 className="text-xl font-semibold">Minimum viable price</h2>
            <div className="mt-5 space-y-3">
              {scenarios.map((scenario) => {
                const viable = margin >= 100 ? null : cogs[scenario] / (1 - margin / 100)
                return <div key={scenario} className="flex justify-between border-b border-border py-3 capitalize"><span>{scenario}</span><strong>{viable === null ? "TBD" : `$${viable.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}</strong></div>
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Config target: {INTERNAL_COMMERCIAL.targetGrossMargin ?? "TBD"}. The calculated floor is not the public list price.</p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Shared education master sheet</h2>
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="text-muted-foreground"><tr><th className="pb-3">Package</th><th>Minimum</th><th>Per student</th><th>Tutor</th><th>Grading</th><th>Overage</th></tr></thead><tbody>{Object.values(EDUCATION_PACKAGES).map((pkg) => <tr key={pkg.name} className="border-t border-border"><td className="py-4 font-medium">{pkg.name}</td><td>${pkg.minFee}</td><td>${pkg.perStudent}</td><td>{pkg.includesTutor ? "Yes" : "No"}</td><td>{pkg.includesGrading ? "Yes" : "No"}</td><td>TBD</td></tr>)}</tbody></table></div>
        </section>
      </div>
    </main>
  )
}
