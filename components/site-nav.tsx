"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { BOOKING_URL } from "@/lib/site"
import {
  hasPersonalizedUseCase,
  PERSONALIZED_USE_CASE_EVENT,
  readPersonalizedIndustryLabel,
  readPersonalizedUseCaseUrl,
} from "@/lib/personalized-use-case-link"

const links = [
  { label: "About", href: "/about" },
  { label: "Product", href: "/product" },
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
  const [templateUrl, setTemplateUrl] = useState("/use-cases/template")
  const [industryLabel, setIndustryLabel] = useState<string | null>(null)
  const [showTemplate, setShowTemplate] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const sync = () => {
      setTemplateUrl(readPersonalizedUseCaseUrl())
      setIndustryLabel(readPersonalizedIndustryLabel())
      setShowTemplate(hasPersonalizedUseCase())
    }
    sync()
    window.addEventListener(PERSONALIZED_USE_CASE_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(PERSONALIZED_USE_CASE_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
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
      <nav className="mx-auto flex max-w-[1440px] items-center gap-5 px-5 py-4 lg:gap-7 lg:px-8">
        <a href="/" className="flex shrink-0 items-center gap-2.5" aria-label="MYO'S home">
          <BrandLogo className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight">
            MYO&apos;S
          </span>
        </a>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-[clamp(0.75rem,1.35vw,1.5rem)] xl:flex">
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
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                      {useCaseLinks
                        .filter((item) => item.href !== "/use-cases/template" || showTemplate)
                        .map((item) => (
                          <a
                            key={item.href}
                            href={item.href === "/use-cases/template" ? templateUrl : item.href}
                            role="menuitem"
                            onClick={closeMenus}
                            className="block rounded-lg px-4 py-3 transition-colors hover:bg-primary/10"
                          >
                            <span className="block text-sm font-semibold text-foreground">
                              {item.href === "/use-cases/template" && industryLabel
                                ? industryLabel
                                : item.label}
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
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                className="whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ),
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <a
            href="https://app.myos.sk/"
            className="group relative inline-flex h-10 items-center justify-center overflow-hidden bg-gradient-to-r from-[#6947e8] via-[#52a8ff] to-[#9b72ff] p-px text-sm font-semibold text-white shadow-[0_0_22px_rgba(82,168,255,0.22)] transition-all duration-300 [clip-path:polygon(10px_0,calc(100%_-_10px)_0,100%_50%,calc(100%_-_10px)_100%,10px_100%,0_50%)] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(124,92,252,0.5)]"
          >
            <span className="absolute inset-y-0 -left-10 w-8 -skew-x-12 bg-white/35 blur-sm transition-transform duration-700 group-hover:translate-x-48" />
            <span className="relative flex h-full items-center gap-2.5 bg-[#080d1b]/95 px-5 [clip-path:polygon(9px_0,calc(100%_-_9px)_0,100%_50%,calc(100%_-_9px)_100%,9px_100%,0_50%)] transition-colors group-hover:bg-[#111532]/90">
              <span className="relative h-3.5 w-3.5 rotate-45 border border-[#91c9ff] bg-gradient-to-br from-white via-[#65b5ff] to-[#7957f5] shadow-[0_0_10px_rgba(99,170,255,0.8)] transition-transform duration-500 group-hover:rotate-[225deg]">
                <span className="absolute left-1/2 top-0 h-full w-px bg-white/35" />
                <span className="absolute left-0 top-1/2 h-px w-full bg-[#202b72]/50" />
              </span>
              <span className="tracking-[0.02em]">Launch App</span>
            </span>
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
          className="ml-auto text-foreground xl:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-6 py-4 backdrop-blur-xl xl:hidden">
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
                            {item.href === "/use-cases/template" && industryLabel
                              ? industryLabel
                              : item.label}
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
                      {useCaseLinks
                        .filter((item) => item.href !== "/use-cases/template" || showTemplate)
                        .map((item) => (
                          <a
                            key={item.href}
                            href={item.href === "/use-cases/template" ? templateUrl : item.href}
                            onClick={closeMenus}
                            className="rounded-lg px-3 py-2 transition-colors hover:bg-primary/10"
                          >
                            <span className="block text-sm font-semibold text-foreground">
                              {item.href === "/use-cases/template" && industryLabel
                                ? industryLabel
                                : item.label}
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
