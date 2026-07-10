"use client"

import { useEffect, useRef, useState } from "react"

export function useCountUp(target: number, duration = 2000, replayOnView = false) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!started.current || replayOnView)) {
            started.current = true
            setValue(0)
            if (frame.current) cancelAnimationFrame(frame.current)
            const start = performance.now()
            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1)
              // easeOutCubic
              const eased = 1 - Math.pow(1 - progress, 3)
              setValue(Math.round(eased * target))
              if (progress < 1) frame.current = requestAnimationFrame(tick)
            }
            frame.current = requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, duration, replayOnView])

  return { value, ref }
}
