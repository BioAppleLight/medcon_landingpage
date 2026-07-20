"use client"

import {
  useRef,
  useLayoutEffect,
  type ReactNode,
  type ElementType,
} from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const EASE = "power3.out"

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/**
 * Scroll-triggered reveal.
 *
 * RESILIENCE: children render normally on the server and before hydration.
 * The hidden pre-animation state is only ever applied inside a client effect,
 * so if JS fails the content simply stays visible — never a blank page.
 *
 * With `stagger`, the element's direct children are revealed in sequence.
 */
export function Reveal({
  children,
  className,
  as = "div",
  y = 28,
  delay = 0,
  stagger,
  start = "top 82%",
}: {
  children: ReactNode
  className?: string
  as?: "div" | "section" | "ul" | "li" | "header"
  /** vertical offset in px the element rises from */
  y?: number
  delay?: number
  /** animate direct children in sequence instead of the element itself */
  stagger?: boolean
  /** ScrollTrigger start position */
  start?: string
}) {
  const ref = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.85,
        ease: EASE,
        delay,
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [y, delay, stagger, start])

  const Tag = as as ElementType
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/**
 * Line/word mask reveal for a heading. Splits on the provided children being a
 * plain string is NOT assumed — instead we mask the whole block by clipping and
 * sliding it up. Simple, dependency-free, and works with rich markup.
 */
export function MaskReveal({
  children,
  className,
  as = "h1",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  as?: "h1" | "h2" | "p" | "div"
  delay?: number
}) {
  const ref = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        yPercent: 18,
        duration: 1,
        ease: EASE,
        delay,
      })
    }, el)

    return () => ctx.revert()
  }, [delay])

  const Tag = as as ElementType
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/**
 * Draws an SVG line/path as it scrolls into view. Pass a ref'd path via the
 * render function. Used for the connective tissue between graph steps.
 */
export function DrawLine({
  className,
  vertical = false,
}: {
  className?: string
  vertical?: boolean
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.from(el, {
        scaleX: vertical ? 1 : 0,
        scaleY: vertical ? 0 : 1,
        transformOrigin: vertical ? "top center" : "left center",
        duration: 1.1,
        ease: "power2.inOut",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [vertical])

  return <div ref={ref} className={className} />
}

/** Subtle scroll parallax on the referenced element. */
export function Parallax({
  children,
  className,
  amount = 60,
}: {
  children: ReactNode
  className?: string
  amount?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: amount,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [amount])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
