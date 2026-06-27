"use client"

import { useEffect, useState } from "react"
import { Menu, X, RotateCcw } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { BOOKING_URL } from "@/lib/site"
import { useAdaptive } from "@/components/adaptive-provider"

const links = [
  { label: "Product", href: "#product" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Technology", href: "#technology" },
  { label: "Pricing", href: "#pricing" },
  { label: "Team", href: "#team" },
]

export function SiteNav() {
  const { reset } = useAdaptive()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5" aria-label="MYO'S home">
          <BrandLogo className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight">
            MYO&apos;S
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Chat
          </button>
          <a
            href="/chat"
            className={buttonVariants({
              variant: "outline",
              className: "h-9 px-4",
            })}
          >
            Launch App
          </a>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ className: "h-9 px-4" })}
          >
            Book Demo
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-6 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                reset()
              }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Chat
            </button>
            <a
              href="/chat"
              onClick={() => setOpen(false)}
              className={buttonVariants({
                variant: "outline",
                className: "h-9 px-4",
              })}
            >
              Launch App
            </a>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={buttonVariants({ className: "h-9 px-4" })}
            >
              Book Demo
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
