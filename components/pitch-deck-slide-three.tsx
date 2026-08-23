"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import styles from "./pitch-deck-slide-three.module.css"

const RUNTIME = 42.2
const REVEAL_PACE = 1 // Increase to accelerate the complete sequence.
const ROUTINE_APPEAR = 2
const ROUTINE_START = 2.7
const questions = [
  "How soon can I resume regular activities?",
  "What kind of care will I need at home?",
  "Are there any activity limitations?",
  "What symptoms should I watch for and report?",
]
const topics = ["Daily activity", "Home care", "Limitations", "Warning signs"]
// Homography mapping the routine tab's own box (22.25cqw x 19.05cqw) onto the
// iPad screen's four corners as measured in myos-exercise-library-ipad-v2.png.
// matrix3d() only accepts unitless numbers (px), so the cqw-based translate (SCREEN_C/F)
// and perspective (SCREEN_G/H) terms are rescaled at runtime by the current px-per-cqw.
const SCREEN_A = 1.0375436690363866
const SCREEN_B = 0.04679064878877714
const SCREEN_D = 0.022071436563334927
const SCREEN_E = 1.024100668083672
const SCREEN_C = 3.774
const SCREEN_F = 1.889
const SCREEN_G = 0.0026196804279395498
const SCREEN_H = -0.0007064040615401547
const movements = [
  { name: "Heel slides", body: "Lie on your back, then slowly slide your heel toward your buttocks until you feel a stretch. Hold the deep bend for 5 to 10 seconds, then straighten." },
  { name: "Wall slides", body: "Lie on your back with your feet near a wall, wearing socks so your foot can smoothly glide down the wall using gravity to bend the knee." },
  { name: "Seated assisted bend", body: "Sit on a chair and slowly bend your knee. Scoot your hips forward while keeping your foot on the floor to increase the angle safely." },
  { name: "Stationary cycling", body: "Set a high seat with minimal resistance and rock the pedals back and forth to encourage gradual bending without heavy strain" },
]

export function PitchDeckSlideThree() {
  const slideRef = useRef<HTMLElement>(null)
  const [time, setTime] = useState(0)
  const [started, setStarted] = useState(false)
  const [cqwPx, setCqwPx] = useState(0)

  useEffect(() => {
    const slide = slideRef.current
    if (!slide) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStarted(true)
    }, { threshold: 0.55 })
    observer.observe(slide)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const slide = slideRef.current
    if (!slide) return
    const resize = new ResizeObserver(([entry]) => setCqwPx(entry.contentRect.width / 100))
    resize.observe(slide)
    return () => resize.disconnect()
  }, [])

  const screenTransform = cqwPx
    ? `matrix3d(${SCREEN_A},${SCREEN_D},0,${SCREEN_G / cqwPx}, ${SCREEN_B},${SCREEN_E},0,${SCREEN_H / cqwPx}, 0,0,1,0, ${SCREEN_C * cqwPx},${SCREEN_F * cqwPx},0,1)`
    : undefined

  useEffect(() => {
    if (!started) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const next = (((now - start) / 1000) * REVEAL_PACE) % RUNTIME
      setTime(next)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [started])

  const questionIndex = time >= 7.4 && time < 16.2 ? Math.min(3, Math.floor((time - 7.4) / 2.2)) : 0
  const typedQuestion = questions[questionIndex]
  const routineIndex = time >= ROUTINE_START ? Math.min(3, Math.floor((time - ROUTINE_START) / 2.7)) : 0
  const routineLocal = time >= ROUTINE_START ? Math.min(1, (time - ROUTINE_START - routineIndex * 2.7) / 2.7) : 0
  const tabOpen = time >= ROUTINE_APPEAR

  return (
    <section ref={slideRef} className={styles.slide} aria-label="Slide three: MyOS Post-Surgery Companion">
      <div className={styles.backdrop} /><div className={styles.scrim} /><div className={styles.grid} />
      <header className={`${styles.header} ${styles.visible}`}>
        <h2>MyOS Post-Surgery Companion</h2><span />
      </header>

      <div className={styles.columns}>
        <section className={styles.columnA}>
          <ColumnHeading letter="A" title="Conversational recovery avatar" />
          <ul className={styles.bulletsA}>
            {["Answers recovery questions 24/7", "Speaks in Burjeel’s approved voice", "Guides the patient through next steps", "Keeps support personal and consistent", "Escalates warning signs to a clinician"].map((text, index) => (
              <li key={text} className={styles.shown}>{text}</li>
            ))}
          </ul>
          <div className={styles.phoneGlow} />
          <div className={styles.phone}>
            <div className={styles.phoneGlass} />
            <div className={styles.phoneScreen}>
              <div className={styles.phoneTop}><b>MYOS</b><span>Recovery companion</span></div>
              <div className={styles.avatarCrop}><Image src="/pitch-deck/recovery-avatar.png" alt="MyOS recovery avatar" fill sizes="220px" /></div>
              <p className={styles.avatarGreeting}>How can I support your recovery today?</p>
              <div className={styles.topicGrid}>
                {topics.map((topic, index) => <span key={topic} className={`${questionIndex === index ? styles.topicActive : ""} ${time >= 16.2 && index === 3 ? styles.topicCoral : ""}`}>{topic}{questionIndex === index && <i />}</span>)}
              </div>
              <div className={styles.phoneInput}><span>{typedQuestion}</span><i /></div>
            </div>
          </div>
          <div className={`${styles.escalate} ${styles.escalateShown}`}><i /> Escalate to clinician</div>
        </section>

        <section className={`${styles.columnB} ${styles.focused}`}>
          <ColumnHeading letter="B" title="Exercise library" />
          <ul className={styles.bulletsB}>
            {["Burjeel-approved movement library", "Clear visual demonstrations", "Step-by-step protocol guidance"].map((text) => <li key={text} className={styles.shown}>{text}</li>)}
          </ul>
          <div className={styles.tabletGlow} />
          <div className={styles.tablet}>
            <Image
              src="/pitch-deck/myos-exercise-library-ipad-v2.png"
              alt="MyOS Exercise Library on an iPad"
              fill
              sizes="560px"
              className={styles.iPadImage}
            />
            {time >= .85 && time < ROUTINE_APPEAR && (
              <>
                <i className={styles.iPadCardHighlight} />
                <i className={styles.iPadTap} />
              </>
            )}

            <div className={`${styles.routineTab} ${tabOpen ? styles.tabShown : ""}`} style={{ transform: screenTransform }}>
              <div className={styles.tabHeader}><span>‹</span><b>Knee Flexion (Seated)</b><small>Burjeel protocol</small></div>
              <div className={styles.tabBody}>
                <div className={styles.demoPanel}>
                  <div className={styles.floorGlow} />
                  <Image src="/pitch-deck/seated-demonstrator.png" alt="Seated knee flexion demonstrator" fill sizes="220px" className={styles.demonstrator} />
                  <span className={styles.flexArc} />
                  <b>REP {Math.max(1, Math.min(10, 1 + Math.floor((time - ROUTINE_START) / 1.15)))} / 10</b>
                </div>
                <div className={styles.movementList}>
                  {movements.map((movement, index) => <div key={movement.name} className={`${styles.movement} ${routineIndex === index ? styles.movementActive : ""} ${routineIndex > index ? styles.movementDone : ""}`}><i /><span>{movement.name}</span>{routineIndex === index && <em style={{ width: `${routineLocal * 100}%` }} />}</div>)}
                </div>
              </div>
              <p className={styles.instruction}><b>{movements[routineIndex].name}.</b> {movements[routineIndex].body}</p>
            </div>
          </div>
        </section>
      </div>

      <div className={`${styles.closing} ${styles.closingShown}`}><span /><p>The clinician defines the protocol. <b>MyOS</b> makes it continuously accessible.</p></div>
      <span className={styles.number}>03</span>
    </section>
  )
}

function ColumnHeading({ letter, title }: { letter: string; title: string }) {
  return <div className={styles.columnHeading}><span>{letter}</span><h3>{title}</h3></div>
}
