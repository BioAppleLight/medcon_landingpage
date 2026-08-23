"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { BookOpenCheck, BrainCircuit, Check, ShieldCheck, Stethoscope } from "lucide-react"
import styles from "./pitch-deck-slide-four.module.css"

const DURATION = 12.8

export function PitchDeckSlideFour() {
  const ref = useRef<HTMLElement>(null)
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const slide = ref.current
    if (!slide) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStarted(true)
    }, { threshold: .55 })
    observer.observe(slide)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      setTime(((now - start) / 1000) % DURATION)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [started])

  const patient = time >= .7
  const recognized = time >= 2.4
  const retrieved = time >= 3.5
  const contextual = time >= 4.6
  const answer = time >= 5.5
  const guardrail = time >= 7.8
  const position = time >= 9.6

  return (
    <section ref={ref} className={styles.slide} aria-label="Slide four: conversational AI demo">
      <div className={styles.glow} /><div className={styles.grid} />
      <header className={styles.header}>
        <span>Demo 1</span>
        <div><h2>Conversational AI</h2><p>Burjeel-approved recovery guidance, available in the moment.</p></div>
      </header>

      <div className={styles.demoGrid}>
        <div className={styles.avatarPanel}>
          <div className={styles.avatarHalo} />
          <Image src="/pitch-deck/recovery-avatar.png" alt="MyOS recovery avatar" fill sizes="420px" className={styles.avatar} />
          <div className={styles.avatarStatus}><i /> MyOS recovery companion</div>
        </div>

        <div className={styles.conversation}>
          <div className={`${styles.patientBubble} ${patient ? styles.visible : ""}`}>
            <small>Patient</small>
            <p>“When can I start cycling after ACL reconstruction?”</p>
          </div>

          <div className={styles.reasoning}>
            <ReasoningStep active={recognized} Icon={BrainCircuit} label="Procedure recognized" value="ACL reconstruction" />
            <ReasoningStep active={retrieved} Icon={BookOpenCheck} label="Approved knowledge retrieved" value="Burjeel recovery protocol" />
            <ReasoningStep active={contextual} Icon={ShieldCheck} label="Response composed" value="Contextual · restricted knowledge space" />
          </div>

          <div className={`${styles.answerBubble} ${answer ? styles.visible : ""}`}>
            <div className={styles.answerTop}><span>MyOS</span><b>Educational guidance</b></div>
            <p>Stationary cycling is often introduced gradually during ACL rehabilitation when your care plan allows it—typically with a high seat and minimal resistance.</p>
            <p className={styles.careTeam}>Your recovery is individual. If you have increased pain, swelling, instability, or uncertainty about your current stage, contact your Burjeel care team before progressing.</p>
          </div>
        </div>
      </div>

      <div className={`${styles.boundary} ${guardrail ? styles.visible : ""}`}>
        <Stethoscope /><div><b>Education, not diagnosis</b><span>Restricted to Burjeel-approved post-surgery knowledge—not unrestricted general medical conversation.</span></div>
      </div>

      <div className={`${styles.positioning} ${position ? styles.visible : ""}`}>
        <span><Check /></span>
        <p>Routine questions are handled digitally so clinicians can spend their time on decisions requiring clinical judgment.</p>
      </div>
      <span className={styles.number}>04</span>
    </section>
  )
}

function ReasoningStep({ active, Icon, label, value }: { active: boolean; Icon: typeof BrainCircuit; label: string; value: string }) {
  return <div className={`${styles.reasoningStep} ${active ? styles.active : ""}`}><Icon /><span><b>{label}</b><small>{value}</small></span><Check /></div>
}
