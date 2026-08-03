"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { BOOKING_URL } from "@/lib/site"

const links = [
  { label: "About", href: "/about" },
  { label: "Product", href: "/#product" },
  { label: "Use Cases", href: "/#use-cases" },
  { label: "Technology", href: "/technology" },
  { label: "Services", href: "/services" },
  { label: "Partnerships and Collaborations", href: "/partnerships" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
]

const aboutLinks = [
  {
    label: "About Overview",
    href: "/about",
    description: "Learn about our mission, impact, and business.",
  },
  {
    label: "Team",
    href: "/team",
    description: "Meet the people building MYO'S.",
  },
]

const useCaseLinks = [
  {
    label: "Use Case Template",
    href: "/use-cases/template",
    description: "Start with a flexible blueprint for your own AI expert.",
  },
  {
    label: "Healthcare",
    href: "/use-cases/healthcare",
    description: "AI doctor avatars for post-surgery recovery.",
  },
  {
    label: "Education",
    href: "/use-cases/education",
    description: "AI Oral Examinator avatars that never stop teaching.",
  },
  {
    label: "Government",
    href: "/use-cases/government",
    description: "AI training assistants for government at scale.",
  },
]

const technologyLinks = [
  {
    label: "Technology Overview",
    href: "/technology",
    description: "Explore the intelligence stack behind MYO'S.",
  },
  {
    label: "APIs",
    href: "/technology/apis",
    description: "See the video and avatar APIs we work with.",
  },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [useCasesOpen, setUseCasesOpen] = useState(false)
  const [technologyOpen, setTechnologyOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const closeMenus = () => {
    setAboutOpen(false)
    setUseCasesOpen(false)
    setTechnologyOpen(false)
    setOpen(false)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2.5" aria-label="MYO'S home">
          <BrandLogo className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight">
            MYO&apos;S
          </span>
        </a>

        <div className="hidden items-center gap-5 md:flex">
          {links.map((link) =>
            link.href === "/about" ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={aboutOpen}
                  aria-haspopup="menu"
                  onClick={() => setAboutOpen((value) => !value)}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      aboutOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {aboutOpen && (
                  <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-4">
                    <div
                      role="menu"
                      className="overflow-hidden rounded-xl border border-border bg-card/95 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl"
                    >
                      {aboutLinks.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={closeMenus}
                          className="block rounded-lg px-4 py-3 transition-colors hover:bg-primary/10"
                        >
                          <span className="block text-sm font-semibold text-foreground">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-pretty text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : link.href === "/#use-cases" ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setUseCasesOpen(true)}
                onMouseLeave={() => setUseCasesOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={useCasesOpen}
                  aria-haspopup="menu"
                  onClick={() => setUseCasesOpen((value) => !value)}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      useCasesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {useCasesOpen && (
                  <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-4">
                    <div
                      role="menu"
                      className="overflow-hidden rounded-xl border border-border bg-card/95 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl"
                    >
                      {useCaseLinks.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={closeMenus}
                          className="block rounded-lg px-4 py-3 transition-colors hover:bg-primary/10"
                        >
                          <span className="block text-sm font-semibold text-foreground">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-pretty text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : link.href === "/technology" ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setTechnologyOpen(true)}
                onMouseLeave={() => setTechnologyOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={technologyOpen}
                  aria-haspopup="menu"
                  onClick={() => setTechnologyOpen((value) => !value)}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      technologyOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {technologyOpen && (
                  <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-4">
                    <div
                      role="menu"
                      className="overflow-hidden rounded-xl border border-border bg-card/95 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl"
                    >
                      {technologyLinks.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={closeMenus}
                          className="block rounded-lg px-4 py-3 transition-colors hover:bg-primary/10"
                        >
                          <span className="block text-sm font-semibold text-foreground">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-pretty text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ),
          )}
        </div>

        <div className="hidden md:block">
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
            {links.map((link) =>
              link.href === "/about" ? (
                <div key={link.href} className="flex flex-col gap-3">
                  <button
                    type="button"
                    aria-expanded={aboutOpen}
                    onClick={() => setAboutOpen((value) => !value)}
                    className="flex items-center justify-between text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        aboutOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {aboutOpen && (
                    <div className="grid gap-2 border-l border-border pl-4">
                      {aboutLinks.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={closeMenus}
                          className="rounded-lg px-3 py-2 transition-colors hover:bg-primary/10"
                        >
                          <span className="block text-sm font-semibold text-foreground">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.href === "/#use-cases" ? (
                <div key={link.href} className="flex flex-col gap-3">
                  <button
                    type="button"
                    aria-expanded={useCasesOpen}
                    onClick={() => setUseCasesOpen((value) => !value)}
                    className="flex items-center justify-between text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        useCasesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {useCasesOpen && (
                    <div className="grid gap-2 border-l border-border pl-4">
                      {useCaseLinks.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={closeMenus}
                          className="rounded-lg px-3 py-2 transition-colors hover:bg-primary/10"
                        >
                          <span className="block text-sm font-semibold text-foreground">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.href === "/technology" ? (
                <div key={link.href} className="flex flex-col gap-3">
                  <button
                    type="button"
                    aria-expanded={technologyOpen}
                    onClick={() => setTechnologyOpen((value) => !value)}
                    className="flex items-center justify-between text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        technologyOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {technologyOpen && (
                    <div className="grid gap-2 border-l border-border pl-4">
                      {technologyLinks.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={closeMenus}
                          className="rounded-lg px-3 py-2 transition-colors hover:bg-primary/10"
                        >
                          <span className="block text-sm font-semibold text-foreground">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ),
            )}
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
