"use client"

import {
  useEffect,
  useRef,
  useState,
  Children,
  isValidElement,
  cloneElement,
  type ReactNode,
  type CSSProperties,
} from "react"

/**
 * Resilient scroll reveal.
 *
 * IMPORTANT: content is VISIBLE BY DEFAULT (during SSR and before hydration).
 * The hidden/pre-animation state is only applied inside a client effect, so if
 * JS never runs or hydration fails, the content still shows — it can never
 * leave a blank/black page.
 */
type RevealProps = {
  children: ReactNode
  className?: string
  /** delay in seconds */
  delay?: number
  /** vertical offset in px the element animates up from */
  y?: number
  as?: "div" | "section" | "li" | "span"
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  // mounted => hydration succeeded and effects run
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    setMounted(true)
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -80px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Only ever hide AFTER mount. Pre-hydration => visible.
  const hidden = mounted && !shown

  const style: CSSProperties = {
    opacity: hidden ? 0 : 1,
    transform: hidden ? `translateY(${y}px)` : "none",
    transition: mounted
      ? `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`
      : undefined,
    willChange: mounted ? "opacity, transform" : undefined,
  }

  const Tag = as as keyof JSX.IntrinsicElements

  return (
    // @ts-expect-error -- ref typing across the union of tags is fine at runtime
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}

/**
 * Staggered container. Wraps children; each direct child fades/slides up in
 * sequence once scrolled into view. Same resilience guarantee as Reveal:
 * everything is visible until hydration runs.
 */
export function Stagger({
  children,
  className,
  as = "div",
  step = 0.1,
}: {
  children: ReactNode
  className?: string
  as?: "div" | "ul"
  step?: number
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    setMounted(true)
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const hidden = mounted && !shown
  const Tag = as as keyof JSX.IntrinsicElements

  const items = Children.toArray(children)

  return (
    // @ts-expect-error -- ref typing across the union of tags is fine at runtime
    <Tag ref={ref} className={className}>
      {items.map((child, i) => {
        const style: CSSProperties = {
          opacity: hidden ? 0 : 1,
          transform: hidden ? "translateY(20px)" : "none",
          transition: mounted
            ? `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${i * step}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i * step}s`
            : undefined,
        }
        if (isValidElement(child)) {
          const prev = (child.props as { style?: CSSProperties }).style
          return cloneElement(child as React.ReactElement<{ style?: CSSProperties }>, {
            style: { ...prev, ...style },
          })
        }
        return (
          <div key={i} style={style}>
            {child}
          </div>
        )
      })}
    </Tag>
  )
}

/**
 * Kept for API compatibility with existing imports. With the new Stagger the
 * per-item animation is applied by the parent, so this is just a passthrough
 * wrapper that preserves the element tag.
 */
export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode
  className?: string
  as?: "div" | "li"
}) {
  const Tag = as as keyof JSX.IntrinsicElements
  return (
    // @ts-expect-error -- union tag typing is fine at runtime
    <Tag className={className}>{children}</Tag>
  )
}
