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
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 rounded-2xl border border-border bg-card/50 p-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="text-center">
          <p className="text-4xl font-semibold tracking-tight md:text-5xl">
            24/7
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Availability</p>
        </div>
        <Metric target={10} suffix="x" label="More learners reached" />
        <Metric target={50} suffix="+" label="Expert interviews" />
        <Metric target={3} label="Industries piloted" />
      </div>
    </section>
  )
}
