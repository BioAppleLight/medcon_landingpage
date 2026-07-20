import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"

export const metadata: Metadata = {
  title: "Contact | MYO'S",
  description:
    "Contact MYO'S to discuss AI expert avatars, healthcare, education, and government knowledge solutions.",
}

const contactItems = [
  {
    icon: Mail,
    label: "General Inquiry Email",
    value: "info@myos.sk",
    href: "mailto:info@myos.sk",
  },
  {
    icon: Mail,
    label: "For Existing Clients and Customers Email",
    value: "myos@myos.sk",
    href: "mailto:myos@myos.sk",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+421 902 950 910",
    href: "tel:+421902950910",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Abu Dhabi, UAE",
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#7c5cfc]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-48 h-80 w-80 rounded-full bg-[#2563eb]/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-7xl">
              Get In{" "}
              <span className="bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#4db6e8] bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground md:text-xl">
              Ready to start your next project? Let&apos;s discuss how MYO&apos;S
              can bring your vision to life with trusted AI expert avatars.
            </p>
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="space-y-10">
              {contactItems.map((item) => {
                const Icon = item.icon
                const content = (
                  <div className="flex gap-5">
                    <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc]/20 to-[#2563eb]/20 text-[#7c5cfc]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-2 text-xl font-medium tracking-tight">
                        {item.value}
                      </p>
                    </div>
                  </div>
                )

                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block transition-colors hover:text-[#9d8cff]"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                )
              })}

              <div className="border-t border-[#7c5cfc]/25 pt-8">
                <div className="flex gap-5">
                  <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc]/20 to-[#2563eb]/20 text-[#4db6e8]">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Availability
                    </p>
                    <p className="mt-2 text-xl font-medium tracking-tight">
                      Always available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form
              action="mailto:info@myos.sk"
              method="post"
              encType="text/plain"
              className="rounded-3xl border border-border bg-card/70 p-6 shadow-2xl shadow-black/10 md:p-8"
            >
              <div className="grid gap-6">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="h-12 rounded-xl border border-border bg-background px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#7c5cfc]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Email</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="h-12 rounded-xl border border-border bg-background px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#7c5cfc]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Message</span>
                  <textarea
                    name="message"
                    placeholder="Tell us about your project..."
                    rows={8}
                    className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#7c5cfc]"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex h-12 w-fit items-center justify-center rounded-xl bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#2563eb] px-8 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
