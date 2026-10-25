import { Camera, Mail, MapPin, Phone, Globe } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

const linkGroups = [
  { label: "About", href: "/about" },
  { label: "Mission & Vision", href: "/about/mission-vision" },
  { label: "Product", href: "/product" },
  { label: "Use Cases", href: "/#use-cases" },
  { label: "Technology", href: "/technology" },
  { label: "Core Technology", href: "/technology/core" },
  {
    label: "Partnerships and Collaborations",
    shortLabel: "Partnerships",
    href: "/partnerships",
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
]

export function SiteFooter() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-border px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <a href="/" className="flex items-center gap-2.5" aria-label="MYO'S home">
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

          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <a
              href="mailto:info@myos.sk"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              <span>
                info@myos.sk
                <span className="ml-1 text-xs">— General information</span>
              </span>
            </a>
            <a
              href="mailto:myos@myos.sk"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              <span>
                myos@myos.sk
                <span className="ml-1 text-xs">— Existing clients and consumers</span>
              </span>
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
            <a
              href="https://www.instagram.com/mmedcon/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Camera className="h-4 w-4" />
              Instagram
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Abu Dhabi, UAE
            </span>
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 sm:gap-x-6 lg:gap-x-8">
          {linkGroups.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
            >
              <span className="sm:hidden">
                {link.shortLabel ?? link.label}
              </span>
              <span className="hidden sm:inline">{link.label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} MyOS. All rights reserved. Powered by
          mMEDCON <span className="text-background">Ed</span>.
        </p>
      </div>
    </footer>
  )
}
