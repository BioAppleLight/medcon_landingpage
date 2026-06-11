"use client"

import { useCountUp } from "@/components/use-count-up"

function Metric({
  target,
  prefix = "",
  suffix = "",
  label,
}: {
  target: number
  prefix?: string
  suffix?: string
  label: string
}) {
  const { value, ref } = useCountUp(target)
  return (
    <div className="text-center">
      <p className="text-4xl font-semibold tracking-tight md:text-5xl">
        {prefix}
        <span ref={ref}>{value}</span>
        {suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function MetricsStrip() {
  return (
    <section id="impact" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow block text-center">
          We boast of our impact
        </p>
        <div className="mt-8 grid gap-10 rounded-2xl border border-border bg-card/50 p-10 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            target={70}
            prefix="+"
            suffix="K"
            label="People reached across our channels"
          />
          <Metric
            target={50}
            prefix="$"
            suffix="K"
            label="Invested in future health leaders"
          />
          <Metric
            target={140}
            prefix="+"
            label="Students mentored worldwide"
          />
          <Metric target={20} prefix="+" label="Countries reached" />
        </div>
      </div>
    </section>
  )
}
