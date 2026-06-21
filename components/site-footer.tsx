import { Mail, MapPin, Phone, Globe } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

const linkGroups = [
  { label: "Product", href: "#product" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Technology", href: "#technology" },
  { label: "Pricing", href: "#pricing" },
  { label: "Team", href: "#team" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <a href="#" className="flex items-center gap-2.5" aria-label="MYO'S home">
            <BrandLogo className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight">
              MYO&apos;S
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The Expert AI Platform. Turn your best experts into AI colleagues,
            available 24/7.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {linkGroups.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <a
            href="mailto:mmedcon@gmail.com"
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            mmedcon@gmail.com
          </a>
          <a
            href="tel:+421902950910"
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            +421 902 950 910
          </a>
          <a
            href="https://www.mmedcon.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            mmedcon.com
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Abu Dhabi, UAE
          </span>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} MyOS. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
