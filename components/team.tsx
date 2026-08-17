"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"

type TeamMember = {
  name: string
  role: string
  image?: string
}

const team: TeamMember[] = [
  {
    name: "Terezia Juras",
    role: "Founder of mMEDCON and MyoMetrics",
    image: "/team/Tete.jpg",
  },
  {
    name: "Lenka Sadovska",
    role: "Marketing & PR",
    image: "/team/Lenka.jpg",
  },
  {
    name: "Abbas Raza",
    role: "Backend Developer",
    image: "/team/abbas.jpg",
  },
  {
    name: "Ignatius Ratemo",
    role: "Systems Developer",
    image: "/team/Ignatius.jpg",
  },
  {
    name: "Emma Kortosova",
    role: "Associate @ mMEDCON",
    image: "/team/Emma.jpg",
  },
  {
    name: "Sayda Abusalih",
    role: "Management and Outreach",
    image: "/team/Sayda.jpg",
  },
  {
    name: "Prof. Dr. Charmayne Mary Lee Hughes",
    role: "Advisor",
    image: "/team/Prof.%20Dr.%20Charmanye.jpg",
  },
  {
    name: "Dr. Osama Abdullah",
    role: "Advisor",
    image: "/team/Dr.%20Osama.jpg",
  },
  { name: "Seidou", role: "Backend Engineer Intern" },
  { name: "Edward Chen", role: "Frontend Designer Intern",
  image: "/team/342634775_3493591857634230_4602905074176546484_n.jpg",
},
]

type Mentor = {
  name: string
  logo: string
  width: number
  height: number
  imageClassName?: string
}

const mentors: Mentor[] = [
  {
    name: "Yale",
    logo: "/institutions/Yale-University-Logo-Vector%20.svg",
    width: 220,
    height: 35,
    imageClassName: "max-h-14 max-w-[90%]",
  },
  {
    name: "New York University",
    logo: "/institutions/nyu-logo.svg",
    width: 210,
    height: 63,
    imageClassName: "max-h-16 max-w-[90%]",
  },
  {
    name: "Charles University",
    logo: "/institutions/charles-university.svg",
    width: 220,
    height: 39,
    imageClassName: "max-h-14 max-w-[90%]",
  },
  {
    name: "TU Berlin",
    logo: "/institutions/tu-berlin.svg",
    width: 120,
    height: 88,
    imageClassName: "max-h-20 max-w-[80%]",
  },
  {
    name: "University of Amsterdam",
    logo: "/institutions/university-amsterdam.svg",
    width: 220,
    height: 39,
    imageClassName: "max-h-14 max-w-[90%]",
  },
  {
    name: "NIMHANS",
    logo: "/institutions/nimhans.jpeg",
    width: 82,
    height: 82,
    imageClassName: "max-h-20 max-w-[80%]",
  },
  {
    name: "Czech Technical University",
    logo: "/institutions/ctu-prague-blue.jpg",
    width: 866,
    height: 650,
    imageClassName: "max-h-24 max-w-[11rem] scale-150",
  },
  {
    name: "Comenius University",
    logo: "/institutions/comenius-university.svg",
    width: 108,
    height: 72,
    imageClassName: "max-h-24 max-w-[13rem] scale-[2.1]",
  },
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
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Built by clinicians, engineers, and educators.
        </h1>
      </Reveal>

      <Stagger className="mx-auto mt-14 grid max-w-7xl gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {team.map((member) => (
          <StaggerItem key={member.name}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="mx-auto flex h-full w-full max-w-xs flex-col text-center"
            >
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border-[3px] border-white/90 bg-primary/15 text-5xl font-semibold text-primary shadow-xl shadow-black/20">
                {member.image ? (
                  <>
                    <Image
                      src={member.image}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                      className="scale-125 object-cover blur-lg"
                    />
                    <Image
                      src={member.image}
                      alt={`${member.name} profile picture`}
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </>
                ) : (
                  initials(member.name)
                )}
              </div>
              <div className="flex flex-1 flex-col px-2 pt-5">
                <p className="text-lg font-semibold leading-tight text-foreground md:text-xl">
                  {member.name}
                </p>
                <p className="mt-1.5 text-base leading-snug text-muted-foreground md:text-lg">
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
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {mentors.map((mentor) => (
            <span
              key={mentor.name}
              title={mentor.name}
              className="flex h-24 items-center justify-center overflow-hidden border border-black/10 bg-white px-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Image
                src={mentor.logo}
                alt={`${mentor.name} logo`}
                width={mentor.width}
                height={mentor.height}
                className={`h-auto w-auto object-contain ${mentor.imageClassName ?? "max-h-12 max-w-[9rem]"}`}
              />
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
