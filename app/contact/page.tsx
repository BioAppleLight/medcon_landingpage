import type { Metadata } from "next"
import Image from "next/image"
import { ArrowDown, Clock, Mail, MapPin, Phone } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"

export const metadata: Metadata = {
  title: "Contact Our AI Solutions Team",
  description:
    "Contact MYO'S to discuss AI expert avatars, healthcare, education, and government knowledge solutions.",
  alternates: { canonical: "/contact" },
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

      <section className="px-3 pb-3 pt-20 sm:px-5 sm:pb-5 md:pt-24">
        <div className="relative mx-auto min-h-[72svh] max-w-[112rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black sm:min-h-[80svh] md:rounded-[2.25rem]">
          <Image
            src="/Stay in Touch.png"
            alt="A visitor overlooking a modern library and collaborative public space"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,18,0.18)_0%,rgba(4,8,18,0.28)_32%,rgba(4,8,18,0.88)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,transparent_0%,rgba(3,7,18,0.18)_68%,rgba(3,7,18,0.48)_100%)]" />

          <div className="relative z-10 flex min-h-[72svh] flex-col justify-end px-6 pb-8 pt-28 text-white sm:min-h-[80svh] sm:px-10 sm:pb-10 md:px-16 md:pb-14 lg:px-20">
            <div className="mx-auto w-full max-w-6xl text-center">
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-white/70">
                Start a conversation
              </p>
              <h1 className="text-balance text-5xl font-medium leading-[0.96] tracking-[-0.045em] sm:text-7xl lg:text-[7rem]">
                Get In Touch
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-pretty text-base leading-7 text-white/75 sm:text-xl sm:leading-8">
                Ready to start your next project? Let&apos;s discuss how MYO&apos;S
                can bring your vision to life with trusted AI expert avatars.
              </p>
            </div>

            <a
              href="#contact-details"
              className="mt-10 ml-auto inline-flex items-center gap-4 text-sm text-white/80 transition-colors hover:text-white sm:text-base"
            >
              <span>Scroll to connect</span>
              <span className="flex h-11 w-11 rotate-45 items-center justify-center border border-white/70 bg-black/10 backdrop-blur-sm transition-transform hover:translate-y-1">
                <ArrowDown className="h-5 w-5 -rotate-45" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section id="contact-details" className="scroll-mt-24 px-6 py-20 md:py-28">
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
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
