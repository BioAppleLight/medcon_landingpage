"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

const team = [
  { name: "Terezia Juras", role: "Founder, mMEDCON & MyOS" },
  { name: "Lenka Sadovska", role: "Marketing & PR" },
  { name: "Abbas Raza", role: "Backend Developer" },
  { name: "Ignatius Ratemo", role: "Systems Developer" },
  { name: "Emma Kortosova", role: "Associate @ mMEDCON" },
  { name: "Sayda Abusalih", role: "Management & Outreach" },
  { name: "Prof. Dr. Charmayne M. L. Hughes", role: "Advisor" },
]

type Mentor = {
  name: string
  logo?: string
  width?: number
  height?: number
  className?: string
}

const mentors: Mentor[] = [
  {
    name: "Yale",
    logo: "/institutions/Yale-University-Logo-Vector.png",
    width: 188,
    height: 30,
    className: "h-12",
  },
  {
    name: "New York University",
    logo: "/institutions/nyu-logo.svg",
  },
  { name: "Charles University" },
  { name: "TU Berlin" },
  { name: "University of Amsterdam" },
  { name: "NIMHANS" },
  { name: "Czech Technical University" },
  { name: "Comenius University" },
]

function initials(name: string) {
  return name
    .replace(/^(Prof\.|Dr\.)\s*/gi, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

export function Team() {
  return (
    <section id="team" className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="eyebrow text-primary">
          Our Team
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Built by clinicians, engineers, and educators.
        </h2>
      </Reveal>

      <Stagger className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <StaggerItem key={member.name}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {initials(member.name)}
              </span>
              <div>
                <p className="font-medium leading-tight">{member.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {member.role}
                </p>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.1} className="mx-auto mt-16 max-w-5xl text-center">
        <p className="eyebrow">
          Mentored by experts from leading institutions
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {mentors.map((mentor) => (
            <span key={mentor.name}>
              {mentor.logo ? (
                <Image
                  src={mentor.logo}
                  alt={`${mentor.name} logo`}
                  width={mentor.width ?? 110}
                  height={mentor.height ?? 36}
                  className={`${mentor.className ?? "h-9"} w-auto opacity-75 transition-opacity hover:opacity-100`}
                />
              ) : (
                <span className="text-sm font-medium text-muted-foreground/70 transition-colors hover:text-foreground">
                  {mentor.name}
                </span>
              )}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
