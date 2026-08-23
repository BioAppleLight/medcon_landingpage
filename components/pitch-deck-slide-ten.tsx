"use client"

import { useEffect, useRef } from "react"
import styles from "./pitch-deck-slide-ten.module.css"

export function PitchDeckSlideTen() {
  const storyRef = useRef<HTMLElement>(null)
  const careFrameRef = useRef<HTMLIFrameElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    let animationFrame = 0
    let diagramVisible = false
    const update = () => {
      const story = storyRef.current
      const careFrame = careFrameRef.current
      const pilotFrame = frameRef.current
      if (!story || !careFrame || !pilotFrame) return
      const rect = story.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / distance))
      const transition = Math.min(1, Math.max(0, (progress - .04) / .34))
      careFrame.style.opacity = String(1 - transition)
      careFrame.style.transform = `scale(${1 - transition * .035})`
      pilotFrame.style.opacity = String(transition)
      pilotFrame.style.transform = `scale(${1.035 - transition * .035})`
      pilotFrame.style.pointerEvents = transition > .5 ? "auto" : "none"

      const nextDiagramVisible = progress >= .72
      if (nextDiagramVisible !== diagramVisible) {
        diagramVisible = nextDiagramVisible
        pilotFrame.contentWindow?.postMessage({ type: "slide-ten:set-diagram", visible: diagramVisible }, "*")
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <section ref={storyRef} className={styles.story} aria-label="Slide ten: Burjeel ACL Recovery Companion pilot">
      <div className={styles.sticky}>
        <iframe ref={careFrameRef} className={`${styles.frame} ${styles.careFrame}`} src="/pitch-deck/slide-nine-source/Burjeel%20Care%20Layer.dc.html?v=2" title="Burjeel Care Layer" loading="lazy" allow="autoplay" onLoad={() => window.dispatchEvent(new Event("scroll"))} />
        <iframe ref={frameRef} className={`${styles.frame} ${styles.pilotFrame}`} src="/pitch-deck/slide-ten-source/index.html?v=13" title="Burjeel ACL Recovery Companion pilot" loading="lazy" allow="autoplay" onLoad={() => window.dispatchEvent(new Event("scroll"))} />
      </div>
    </section>
  )
}
