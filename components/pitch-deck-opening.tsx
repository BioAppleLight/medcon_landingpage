"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PitchDeckSlideThree } from "@/components/pitch-deck-slide-three"
import { PitchDeckSlideFour } from "@/components/pitch-deck-slide-four"
import { PitchDeckSlideFive } from "@/components/pitch-deck-slide-five"
import { PitchDeckScrollStory } from "@/components/pitch-deck-scroll-story"
import { PitchDeckSlideEight } from "@/components/pitch-deck-slide-eight"
import { PitchDeckSlideTen } from "@/components/pitch-deck-slide-ten"
import styles from "./pitch-deck-opening.module.css"

export function PitchDeckOpening() {
  return (
    <main className={styles.page}>
      <Link href="/#use-cases" className={styles.back}><ArrowLeft /> Back to use cases</Link>
      <section className={styles.stage} aria-label="Burjeel and MyOS pitch deck opening slide">
        <iframe
          className={styles.sourceSlide}
          src="/pitch-deck/slide-one-source/index.html?v=3"
          title="Burjeel and MyOS opening slide"
          loading="eager"
          allow="autoplay"
        />
      </section>
      <SlideTwo />
      <PitchDeckSlideThree />
      <PitchDeckSlideFour />
      <PitchDeckSlideFive />
      <section className={styles.stage} aria-label="Slide six: How the content is created">
        <iframe
          className={styles.sourceSlide}
          src="/pitch-deck/slide-six-source/index.html?v=3"
          title="How the content is created"
          loading="lazy"
          allow="autoplay"
        />
      </section>
      <PitchDeckScrollStory />
      <PitchDeckSlideEight />
      <PitchDeckSlideTen />
    </main>
  )
}

function SlideTwo() {
  const questions = [
    { text: "“Is this swelling normal?”", className: styles.noteOne },
    { text: "“Can I sleep on my side?”", className: styles.noteTwo },
    { text: "“Am I doing this exercise correctly?”", className: styles.noteThree },
    { text: "“How much weight can I put on the leg?”", className: styles.noteFour },
    { text: "“Can I drive? Can I cycle again?”", className: styles.noteFive },
    { text: "“When can I return to sport?”", className: styles.noteSix },
  ]
  const impacts = [
    ["Repeated routine work for clinicians", "Variable adherence"],
    ["Hard to personalize written protocols", "Patients turn to Google/ChatGPT"],
    ["Poor patient recall", "No visibility into actual adherence"],
    ["Unneeded calls & appointments"],
  ]

  return (
    <section className={`${styles.stage} ${styles.slideTwo}`} aria-label="Slide two: The ACL recovery problem">
      <div className={styles.twoHeader}>
        <p className={styles.twoEyebrow}>The ACL recovery problem</p>
        <h2>The information exists. It doesn&apos;t reach the patient at the moment they need it.</h2>
        <p className={styles.twoSubtitle}>What actually happens after a real ACL reconstruction patient leaves Burjeel.</p>
      </div>

      <div className={styles.problemGrid}>
        <div className={styles.questionsPanel}>
          <p className={styles.panelLabel}>The questions start as soon as Katarina gets home</p>
          <div className={styles.noteStack}>
            {questions.map((question) => (
              <div key={question.text} className={`${styles.questionNote} ${question.className}`}>
                {question.text}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.evidencePanel}>
          <article className={`${styles.evidenceCard} ${styles.timelineCard}`}>
            <strong>9–12 months</strong>
            <p>typical total ACL rehab timeline before full return to sport — and reinjury risk climbs sharply for patients who return early</p>
            <small>Clinical rehab timelines</small>
          </article>
          <div className={styles.smallEvidenceRow}>
            <article className={styles.evidenceCard}>
              <strong>~30%</strong>
              <p>of patients complete any rehab beyond 6 months in typical care settings — only ~5% finish a full evidence-based program</p>
              <small>ACL adherence review</small>
            </article>
            <article className={styles.evidenceCard}>
              <strong>30–46%</strong>
              <p>of post-surgical patients call their care team within 2 weeks of discharge with questions</p>
              <small>Postop contact review (proxy)</small>
            </article>
          </div>
        </div>
      </div>

      <div className={styles.problemFooter}>
        <p className={styles.problemStatement}>The problem isn&apos;t that the information doesn&apos;t exist — it&apos;s scattered across appointments, discharge PDFs, phone calls, and generic search results.</p>
        <div className={styles.impactGrid}>
          {impacts.map((column, index) => (
            <ul key={index}>
              {column.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ))}
        </div>
        <p className={styles.sources}>Sources: rehab adherence — Edwards et al. 2017, cited in 2020 ACL adherence scoping review (PMC7367990); postoperative patient-initiated calls — AJMC scoping review of orthopedic/spine surgery; clinical ACL rehab timeline guides.</p>
      </div>
      <span className={styles.twoNumber}>02</span>
    </section>
  )
}
