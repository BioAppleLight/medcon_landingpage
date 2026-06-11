"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import { useCountUp } from "@/components/use-count-up"
import { Reveal } from "@/components/motion-primitives"

function Counter({
  target,
  suffix = "",
  label,
}: {
  target: number
  suffix?: string
  label: string
}) {
  const { value, ref } = useCountUp(target)
  return (
    <div>
      <p className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        <span ref={ref}>{value.toLocaleString()}</span>
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function BeforeAfter() {
  return (
    <section className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-5xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          One expert.{" "}
          <span className="font-serif italic font-normal text-primary">
            Infinite reach.
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          A single specialist can only be in one place at a time. MyOS removes
          that limit.
        </p>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-5xl items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        {/* Before */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-border bg-card/50 p-8"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Before MyOS
          </span>
          <div className="mt-6 flex flex-col gap-5">
            {[
              { n: "1", label: "student" },
              { n: "1", label: "patient" },
              { n: "1", label: "employee" },
            ].map((item) => (
              <div key={item.label} className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-muted-foreground">
                  {item.n}
                </span>
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: "backOut" }}
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card md:h-14 md:w-14"
        >
          <ArrowRight className="h-5 w-5 text-primary md:h-6 md:w-6" />
        </motion.div>

        {/* After */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-accent/10 p-8"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            After MyOS
          </span>
          <div className="mt-6 flex flex-col gap-5">
            <div className="flex items-baseline gap-3">
              <Counter target={10000} suffix="" label="students" />
            </div>
            <div className="flex items-baseline gap-3">
              <Counter target={50} suffix="" label="hospitals" />
            </div>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Entire
                <span className="ml-2 text-base font-normal text-muted-foreground">
                  government departments
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
