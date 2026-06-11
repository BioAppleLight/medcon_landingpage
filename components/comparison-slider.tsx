"use client"

import { useCallback, useRef, useState } from "react"
import { Clock, DollarSign, UserX, Infinity as InfinityIcon, Sparkles, Users } from "lucide-react"

const traditional = [
  { icon: UserX, text: "One-on-one only" },
  { icon: DollarSign, text: "Expensive to scale" },
  { icon: Clock, text: "Limited hours" },
]

const myos = [
  { icon: InfinityIcon, text: "Always available" },
  { icon: Sparkles, text: "Personalized to each user" },
  { icon: Users, text: "Scales to thousands" },
]

export function ComparisonSlider() {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(95, Math.max(5, next)))
  }, [])

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Not a chatbot. Not a video. Something new.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Drag to compare the old way with MyOS.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto mt-12 h-80 max-w-4xl select-none overflow-hidden rounded-2xl border border-border md:h-72"
        onMouseMove={(e) => dragging.current && update(e.clientX)}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onTouchMove={(e) => update(e.touches[0].clientX)}
      >
        {/* Traditional (base layer) */}
        <div className="absolute inset-0 flex flex-col justify-center gap-5 bg-secondary p-8 md:p-12">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Traditional Expert
          </span>
          {traditional.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.text} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{item.text}</span>
              </div>
            )
          })}
        </div>

        {/* MyOS (clipped overlay) */}
        <div
          className="absolute inset-0 flex flex-col items-end justify-center gap-5 bg-gradient-to-br from-primary/20 to-accent/20 p-8 text-right md:p-12"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        >
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            MyOS Expert
          </span>
          {myos.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.text} className="flex items-center gap-3">
                <span className="font-medium text-foreground">{item.text}</span>
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )
          })}
        </div>

        {/* Handle */}
        <div
          className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 cursor-ew-resize bg-primary"
          style={{ left: `${pos}%` }}
          onMouseDown={() => (dragging.current = true)}
          onTouchStart={() => (dragging.current = true)}
        >
          <span className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground shadow-lg">
            <span className="text-xs">{"<>"}</span>
          </span>
        </div>
      </div>
    </section>
  )
}
