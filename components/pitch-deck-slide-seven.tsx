"use client"

import Image from "next/image"
import styles from "./pitch-deck-slide-seven.module.css"

export function PitchDeckSlideSeven() {
  return (
    <section className={styles.slide} aria-label="Slide seven: Traditional video making">
      <div className={styles.bloom} />
      <div className={styles.copy}>
        <h2>Traditional Video Making<br />Are Long Process.</h2>
        <p className={styles.description}>Clinical videos depend on scripting, production, editing, review, and repeated approvals before they ever reach the patient.</p>
      </div>

      <div className={styles.visual} aria-label="Image placeholder">
        <div className={`${styles.plane} ${styles.back}`}><span>04</span><i /><i /><i /></div>
        <div className={`${styles.plane} ${styles.middle}`}><span>03</span><i /><i /><i /></div>
        <div className={`${styles.plane} ${styles.imagePlane}`}>
          <Image
            src="/pitch-deck/traditional-video-workflow.png"
            alt="Traditional clinical video production workflow"
            fill
            priority
            sizes="42vw"
            style={{ objectFit: "contain", padding: "2.2%" }}
          />
        </div>
        <div className={`${styles.plane} ${styles.front}`}><span>01</span><i /><i /><i /></div>
      </div>
      <span className={styles.number}>07</span>
    </section>
  )
}
