"use client"

import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Reveal } from "@/components/motion-primitives"
import { useCountUp } from "@/components/use-count-up"
import { ImpactGlobe, type ImpactGlobeHandle } from "@/components/impact-globe"

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger)

const impactMetrics = [
  { target: 70, prefix: "+", suffix: "K", label: "People reached across our channels" },
  { target: 50, prefix: "$", suffix: "K", label: "Invested in future health leaders" },
  { target: 140, prefix: "+", suffix: "", label: "Students mentored worldwide" },
  { target: 20, prefix: "+", suffix: "", label: "Countries reached" },
]

const scaleRows = [
  { label: "Students", target: 10000, prefix: "+", detail: "students", width: "100%" },
  { label: "Patients", target: 50, prefix: "+", detail: "hospitals", width: "72%" },
]

function CountUpValue({
  target,
  prefix = "",
  suffix = "",
}: {
  target: number
  prefix?: string
  suffix?: string
}) {
  const { value, ref } = useCountUp(target, 2000, true)

  return (
    <>
      {prefix}
      <span ref={ref}>{value.toLocaleString()}</span>
      {suffix}
    </>
  )
}

export function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const impactRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<HTMLDivElement>(null)
  const globeCanvasRef = useRef<ImpactGlobeHandle>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const impact = impactRef.current
    const globe = globeRef.current
    if (!section || !stage || !impact || !globe) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const media = gsap.matchMedia()
    media.add("(min-width: 1024px)", () => {
      gsap.set(globe, { autoAlpha: 0, scale: 0.92, y: 42 })

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top 72px",
          end: "+=140%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate() {
          const progress = timeline.progress()
          globeCanvasRef.current?.setProgress(Math.max(0, (progress - 0.24) / 0.76))
        },
      })

      timeline
        .to(impact, { autoAlpha: 0, y: -48, scale: 0.985, duration: 0.34 })
        .to(globe, { autoAlpha: 1, y: 0, scale: 1, duration: 0.46 }, 0.2)
        .to({}, { duration: 0.2 })

      return () => timeline.kill()
    })

    return () => media.revert()
  }, [])

  return (
    <section ref={sectionRef} id="impact" className="overflow-hidden border-y border-border/70 px-6 py-20 md:py-28">
      <div ref={stageRef} className="relative mx-auto max-w-6xl lg:flex lg:h-[calc(100svh-7rem)] lg:min-h-[720px] lg:max-h-[880px] lg:items-center">
        <div ref={impactRef} className="w-full">
        <Reveal className="text-center">
          <span className="eyebrow block">Our proven results</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Proven impact.{" "}
            <span className="font-serif font-normal italic text-primary">Built to scale.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid min-w-0 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal className="min-w-0 lg:border-r lg:border-border lg:pr-16">
            <div className="mb-8">
              <span className="eyebrow block">We boast of our impact</span>
              <p className="mt-3 max-w-md text-pretty text-muted-foreground">
                Real investment in people, knowledge, and the next generation of health leaders.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:gap-y-16">
              {impactMetrics.map((metric) => (
                <div key={metric.label}>
                  <p className="text-[clamp(2.75rem,6vw,5.5rem)] font-light leading-none tracking-[-0.06em] text-foreground">
                    <CountUpValue
                      target={metric.target}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                    />
                  </p>
                  <p className="mt-4 max-w-48 text-xs font-medium uppercase leading-5 tracking-[0.08em] text-muted-foreground sm:text-sm">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <div className="mb-8">
              <span className="eyebrow block">Scale</span>
              <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
                One expert. Infinite reach.
              </h3>
              <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
                A single specialist can only be in one place at a time. MyOS lets the same expert
                help thousands of people at once.
              </p>
            </div>

            <div className="space-y-7 pt-2">
              {scaleRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[5.5rem_1fr] items-center gap-4 sm:grid-cols-[7rem_1fr]">
                  <p className="text-right text-sm font-medium text-muted-foreground">{row.label}</p>
                  <div>
                    <div
                      className="flex min-h-12 items-center justify-end rounded-r-lg bg-gradient-to-r from-primary/55 to-primary px-4 text-lg font-semibold text-primary-foreground shadow-[0_8px_30px_rgba(124,92,252,0.2)]"
                      style={{ width: row.width }}
                    >
                      <CountUpValue target={row.target} prefix={row.prefix} />
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.08em] text-muted-foreground">
                      {row.detail}
                    </p>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-[5.5rem_1fr] items-center gap-4 sm:grid-cols-[7rem_1fr]">
                <p className="text-right text-sm font-medium text-muted-foreground">Teams</p>
                <div className="flex min-h-12 w-[86%] items-center rounded-r-lg border border-primary/35 bg-primary/10 px-4 text-lg font-semibold text-foreground">
                  Entire departments
                </div>
              </div>

              <div className="grid grid-cols-[5.5rem_1fr] items-center gap-4 sm:grid-cols-[7rem_1fr]">
                <p className="text-right text-sm font-medium text-muted-foreground">Training</p>
                <div className="flex items-baseline gap-3 border-t border-border pt-5">
                  <span className="text-4xl font-light tracking-[-0.05em] text-foreground">1</span>
                  <span className="text-sm uppercase tracking-[0.08em] text-muted-foreground">
                    expert, trained once
                  </span>
                </div>
              </div>
            </div>

          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-14 border-t border-border/70 pt-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            In collaboration with{" "}
            <span className="text-sm font-semibold tracking-[0.12em] text-foreground">mMEDCON</span>
          </p>
        </Reveal>
        </div>

        <div ref={globeRef} className="mt-12 w-full lg:invisible lg:absolute lg:inset-0 lg:mt-0 lg:flex lg:items-stretch">
          <ImpactGlobe
            ref={globeCanvasRef}
            scrollDriven
            className="!mt-0 w-full lg:flex lg:h-full lg:flex-col lg:justify-between lg:rounded-[2rem] lg:px-8 lg:py-6 [&_canvas]:lg:min-h-0 [&_canvas]:lg:flex-1 [&_canvas]:lg:object-contain"
          />
        </div>
      </div>
    </section>
  )
}
