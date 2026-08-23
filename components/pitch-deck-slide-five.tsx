"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import styles from "./pitch-deck-slide-five.module.css"

export function PitchDeckSlideFive() {
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const slide = ref.current
    const video = videoRef.current
    if (!slide || !video) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => undefined)
      else video.pause()
    }, { threshold: 0.35 })

    observer.observe(slide)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className={styles.slide} aria-label="Slide five: AI avatar animated exercises">
      <div className={styles.glow} />
      <div className={styles.grid} />

      <header className={styles.header}>
        <span>Demo 2</span>
        <div>
          <h2>AI avatar animated exercises</h2>
          <p>Exercise demonstration and patient-ready guidance</p>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.videoPanel}>
          <video
            ref={videoRef}
            src="/pitch-deck/bosu-balance-demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="auto"
            className={styles.video}
          />
        </div>

        <div className={styles.infographicPanel}>
          <Image
            src="/pitch-deck/bosu-balance-infographic.png"
            alt="Single-leg balance on BOSU with ball toss instructional infographic"
            fill
            priority
            sizes="45vw"
            className={styles.infographic}
          />
        </div>
      </div>

      <span className={styles.number}>05</span>
    </section>
  )
}
