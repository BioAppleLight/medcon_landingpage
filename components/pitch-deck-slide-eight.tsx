"use client"

import { useCallback, useEffect, useRef } from "react"
import styles from "./pitch-deck-slide-eight.module.css"

const INTRO_RANGES = [
  [0, 6.63],
  [6.63, 14.4],
] as const
const INTRO_PLAYBACK_MS = 1000

export function PitchDeckSlideEight() {
  const storyRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)

  const seek = useCallback((progress: number, from = 0, to?: number) => {
    const doc = frameRef.current?.contentDocument
    const timeline = doc?.querySelector<SVGSVGElement>(
      "[data-om-exportable-video-with-duration-secs]",
    )
    const FrameCustomEvent = doc?.defaultView?.CustomEvent
    if (!timeline || !FrameCustomEvent) return false

    const duration = Number(
      timeline.dataset.omExportableVideoWithDurationSecs,
    )
    if (!Number.isFinite(duration)) return false

    const rangeEnd = Math.min(duration, to ?? duration)
    const time = from + progress * (rangeEnd - from)

    timeline.dispatchEvent(
      new FrameCustomEvent("data-om-seek-to-time-frame", {
        detail: { time, sync: true },
      }),
    )
    return true
  }, [])

  useEffect(() => {
    let scrollFrame = 0
    let introFrame = 0
    let navigationTimer = 0
    let introPlaying = false
    let introStep = 0
    let returnToMyosOnNextDown = false
    let navigatingAway = false
    let lastScrollY = window.scrollY

    const returnToMyos = () => {
      const target = document.getElementById("myos-revolutionizes")
      if (!target) return
      navigatingAway = true
      returnToMyosOnNextDown = false
      const targetTop = window.scrollY + target.getBoundingClientRect().top
      const scrubDistance = Math.max(0, target.offsetHeight - window.innerHeight)
      window.scrollTo({
        top: targetTop + scrubDistance * 0.48,
        behavior: "smooth",
      })
      navigationTimer = window.setTimeout(() => {
        lastScrollY = window.scrollY
        navigatingAway = false
      }, 1200)
    }

    const playIntro = (direction: 1 | -1) => {
      const rangeIndex = direction === 1 ? introStep : introStep - 1
      const range = INTRO_RANGES[rangeIndex]
      if (introPlaying || !range) return
      introPlaying = true
      const [rangeStart, rangeEnd] = range
      const from = direction === 1 ? rangeStart : rangeEnd
      const to = direction === 1 ? rangeEnd : rangeStart
      let startedAt: number | null = null

      const tick = (now: number) => {
        if (startedAt === null) {
          if (!seek(0, from, to)) {
            introFrame = requestAnimationFrame(tick)
            return
          }
          startedAt = now
        }

        const progress = Math.min(1, (now - startedAt) / INTRO_PLAYBACK_MS)
        seek(progress, from, to)
        if (progress < 1) {
          introFrame = requestAnimationFrame(tick)
        } else {
          introPlaying = false
          introStep += direction
          if (direction === -1 && rangeIndex === 1) {
            returnToMyosOnNextDown = true
          }
        }
      }

      introFrame = requestAnimationFrame(tick)
    }

    const update = () => {
      const story = storyRef.current
      if (!story) return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        seek(1)
        return
      }
      if (introPlaying) return
      const rect = story.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / distance))
      const pendingRange = INTRO_RANGES[introStep]
      if (pendingRange) {
        seek(0, pendingRange[0], pendingRange[1])
      } else {
        seek(progress, INTRO_RANGES[1][1])
      }
    }
    const onScroll = () => {
      if (navigatingAway) return
      const story = storyRef.current
      const rect = story?.getBoundingClientRect()
      const scrollingDown = window.scrollY > lastScrollY
      const scrollingUp = window.scrollY < lastScrollY
      lastScrollY = window.scrollY

      if (scrollingDown && returnToMyosOnNextDown && !introPlaying) {
        returnToMyos()
        return
      }

      if (
        rect &&
        rect.top <= 1 &&
        rect.bottom > window.innerHeight &&
        ((scrollingDown && introStep < INTRO_RANGES.length) ||
          (scrollingUp && introStep > 0))
      ) {
        playIntro(scrollingDown ? 1 : -1)
        return
      }

      cancelAnimationFrame(scrollFrame)
      scrollFrame = requestAnimationFrame(update)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0
      if (
        direction === 0 ||
        (direction === 1 && introStep >= INTRO_RANGES.length) ||
        (direction === -1 && introStep <= 0) ||
        introPlaying
      ) return
      const rect = storyRef.current?.getBoundingClientRect()
      if (!rect || rect.top > 1 || rect.bottom <= window.innerHeight) return
      event.preventDefault()
      if (direction === 1 && returnToMyosOnNextDown) {
        returnToMyos()
        return
      }
      playIntro(direction)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      cancelAnimationFrame(scrollFrame)
      cancelAnimationFrame(introFrame)
      window.clearTimeout(navigationTimer)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [seek])

  return (
    <section ref={storyRef} className={styles.story} aria-label="Slide eight: Burjeel news impact">
      <div className={styles.sticky}>
        <div className={styles.slide}>
          <iframe
            ref={frameRef}
            className={styles.sourceSlide}
            src="/pitch-deck/slide-eight-source/slide-eight.dc.html?v=16"
            title="Burjeel News Impact"
            loading="lazy"
            onLoad={() => {
              for (const delay of [0, 250, 750, 1500]) {
                window.setTimeout(() => window.dispatchEvent(new Event("scroll")), delay)
              }
            }}
          />
        </div>
      </div>
    </section>
  )
}
