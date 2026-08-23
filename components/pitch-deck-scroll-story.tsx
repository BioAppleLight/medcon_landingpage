"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import styles from "./pitch-deck-scroll-story.module.css"

export function PitchDeckScrollStory() {
  const rootRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      const root = rootRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      setProgress(Math.min(1, Math.max(0, -rect.top / distance)))
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const center = Math.min(1, progress / .58)
  const swap = Math.min(1, Math.max(0, (progress - .3) / .3))

  return (
    <section id="myos-revolutionizes" ref={rootRef} className={styles.story} aria-label="Traditional video production to MyOS content engine">
      <div className={styles.sticky}>
        <div className={styles.bloom} />
        <h2 style={{ position: "absolute", zIndex: 9, left: "50%", top: "3.2%", margin: 0, color: "#F5F7FF", fontSize: "2.35cqw", fontWeight: 400, letterSpacing: "-.025em", opacity: swap, transform: `translate3d(-50%,${(1 - swap) * 12}px,0)`, whiteSpace: "nowrap" }}>MyOS Revolutionizes This…</h2>
        <div className={styles.copy} style={{ opacity: 1 - Math.min(1, progress / .34), transform: `translate3d(${-progress * 4}cqw,${-progress * 1.5}cqw,0)` }}>
          <h2>Traditional Video Making<br />Are Long Process.</h2>
          <p>Clinical videos depend on scripting, production, editing, review, and repeated approvals before they ever reach the patient.</p>
        </div>

        <div className={styles.frame} style={{ transform: `translate3d(${(1 - center) * 19}cqw,${(1 - center) * -1.5}cqw,0) scale(${.82 + center * .18})` }}>
          <div className={`${styles.layer} ${styles.back}`} />
          <div className={`${styles.layer} ${styles.middle}`} />
          <div className={styles.media}>
            <Image src="/pitch-deck/traditional-video-workflow.png" alt="Traditional clinical video production workflow" fill priority sizes="58vw" className={styles.image} style={{ opacity: 1 - swap, transform: `scale(${1 - swap * .025})` }} />
            <Image src="/pitch-deck/myos-avatar-pipeline-centered.png" alt="MyOS protocol-to-content and AI avatar pipeline" fill priority sizes="58vw" className={styles.image} style={{ opacity: swap, transform: `scale(${.975 + swap * .025})` }} />
            <div className={styles.ui}><i /></div>
          </div>
          <div className={`${styles.layer} ${styles.front}`} />
        </div>

        <p className={styles.caption} style={{ opacity: Math.min(1, Math.max(0, (progress - .6) / .15)) }}>Capture the clinical knowledge once. Generate patient content repeatedly.</p>
        <span className={styles.number}>07—08</span>
      </div>
    </section>
  )
}
