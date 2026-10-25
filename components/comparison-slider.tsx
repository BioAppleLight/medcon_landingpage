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
    <section className="px-4 py-20 md:py-28">
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
        className="relative mx-auto mt-12 h-[clamp(22rem,32vw,36rem)] w-full max-w-[112rem] select-none overflow-hidden rounded-[2rem] border border-white/[0.04] md:rounded-[2.75rem]"
        style={{ touchAction: "pan-y" }}
        onPointerDown={(event) => {
          dragging.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          update(event.clientX)
        }}
        onPointerMove={(event) => {
          if (dragging.current) update(event.clientX)
        }}
        onPointerUp={() => { dragging.current = false }}
        onPointerCancel={() => { dragging.current = false }}
        onLostPointerCapture={() => { dragging.current = false }}
      >
        {/* Traditional Expert */}
        <div className="absolute inset-0 flex flex-col justify-center bg-[#1d2636] px-8 py-10 sm:px-12 md:px-[clamp(3rem,5.4vw,6rem)]">
          <div className="flex w-max max-w-[92%] flex-col gap-7 text-[#9ba4b5] md:gap-9">
            <span className="mb-1 text-sm font-medium uppercase tracking-[0.2em] md:mb-2 md:text-[clamp(1rem,1.35vw,1.5rem)]">
              Traditional Expert
            </span>
            {traditional.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.text} className="flex items-center gap-5 md:gap-6">
                  <Icon aria-hidden="true" className="h-7 w-7 shrink-0 stroke-[1.9] md:h-10 md:w-10" />
                  <span className="text-[clamp(1.125rem,1.85vw,2rem)] leading-tight">{item.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* MyOS (clipped overlay) */}
        <div
          className="absolute inset-0 flex flex-col items-end justify-center bg-[#30395c] px-8 py-10 text-right sm:px-12 md:px-[clamp(3rem,5.4vw,6rem)]"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        >
          <div className="flex w-max max-w-[92%] flex-col items-end gap-7 md:gap-9">
            <span className="mb-1 text-sm font-medium uppercase tracking-[0.2em] text-[#8dbdff] md:mb-2 md:text-[clamp(1rem,1.35vw,1.5rem)]">
              MyOS Expert
            </span>
            {myos.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.text} className="flex items-center gap-5 md:gap-6">
                  <span className="text-[clamp(1.125rem,1.85vw,2rem)] leading-tight text-white">{item.text}</span>
                  <Icon aria-hidden="true" className="h-7 w-7 shrink-0 stroke-[1.9] text-[#8dbdff] md:h-10 md:w-10" />
                </div>
              )
            })}
          </div>
        </div>

        <div
          role="slider"
          tabIndex={0}
          aria-label="Compare Traditional Expert and MyOS Expert"
          aria-valuemin={5}
          aria-valuemax={95}
          aria-valuenow={pos}
          aria-valuetext={`${100 - pos}% MyOS Expert visible`}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault()
              setPos((current) => Math.max(5, current - 5))
            } else if (event.key === "ArrowRight") {
              event.preventDefault()
              setPos((current) => Math.min(95, current + 5))
            }
          }}
          className="absolute inset-y-0 z-10 w-2 -translate-x-1/2 cursor-ew-resize bg-[#2388f5] outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#2388f5] text-xl font-light text-white shadow-lg md:h-20 md:w-20">
            <span aria-hidden="true">{"<>"}</span>
          </span>
        </div>
      </div>
    </section>
  )
}
