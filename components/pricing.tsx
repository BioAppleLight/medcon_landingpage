"use client"

import { useRef, useState, type PointerEvent } from "react"
import {
  BadgeDollarSign,
  Check,
  Cable,
  GitBranch,
  Headphones,
  Layers,
  Server,
  UserRoundCheck,
} from "lucide-react"
import { motion } from "motion/react"
import { buttonVariants } from "@/components/ui/button"
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives"
import { BOOKING_URL } from "@/lib/site"
import { PricingCalculator } from "@/components/PricingCalculator"

const plans = [
  {
    name: "Pilot",
    tagline: "1 doctor avatar + 3 videos",
    desc: "Ideal for trying MyOS.",
    features: [
      "1 doctor avatar",
      "3 recovery videos",
      "Standard delivery time",
      "Email support",
    ],
    cta: "Start a Pilot",
    featured: false,
  },
  {
    name: "Department",
    tagline: "3 to 5 doctors + 10 to 20 videos",
    desc: "Ideal for growing departments.",
    features: [
      "3 to 5 doctor avatars",
      "10 to 20 recovery videos",
      "Faster turnaround",
      "Dedicated account manager",
      "Priority support",
    ],
    cta: "Book Department Demo",
    featured: true,
  },
  {
    name: "Enterprise",
    tagline: "Multiple departments + integration",
    desc: "Built for hospitals and health systems.",
    features: [
      "Unlimited doctor avatars",
      "Unlimited videos",
      "App / API integration",
      "AI-powered FAQ assistant",
      "Custom workflows & analytics",
      "Dedicated success team & SLA",
    ],
    cta: "Talk to Sales",
    featured: false,
  },
]

const pricingModel = [
  {
    icon: Server,
    label: "Platform subscription",
    desc: "Core monthly access",
    x: 170,
    y: 84,
  },
  {
    icon: UserRoundCheck,
    label: "Avatar deployment fees",
    desc: "Per expert avatar",
    x: 500,
    y: 54,
  },
  {
    icon: Layers,
    label: "Enterprise onboarding",
    desc: "Launch and training",
    x: 830,
    y: 84,
  },
  {
    icon: Cable,
    label: "Custom integrations",
    desc: "Systems and workflows",
    x: 170,
    y: 280,
  },
  {
    icon: GitBranch,
    label: "Knowledge graph setup",
    desc: "Structured expert knowledge",
    x: 830,
    y: 280,
  },
  {
    icon: BadgeDollarSign,
    label: "API consumption pricing",
    desc: "Usage-based scale",
    x: 300,
    y: 492,
  },
  {
    icon: Headphones,
    label: "Ongoing support",
    desc: "Continuous assistance",
    x: 700,
    y: 492,
  },
]

type MapPosition = {
  x: number
  y: number
}

const mapWidth = 1000
const mapHeight = 560
const mapCenter = {
  x: mapWidth / 2,
  y: mapHeight / 2,
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

type PricingProps = {
  showModelDiagram?: boolean
}

export function Pricing({ showModelDiagram = true }: PricingProps) {
  const diagramRef = useRef<HTMLDivElement>(null)
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [nodePositions, setNodePositions] = useState<Record<string, MapPosition>>(
    () =>
      Object.fromEntries(
        pricingModel.map((item) => [item.label, { x: item.x, y: item.y }]),
      ),
  )

  const updateNodePosition = (label: string, event: PointerEvent) => {
    const diagram = diagramRef.current

    if (!diagram) {
      return
    }

    const rect = diagram.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * mapWidth
    const y = ((event.clientY - rect.top) / rect.height) * mapHeight

    setNodePositions((current) => ({
      ...current,
      [label]: {
        x: clamp(x, 105, mapWidth - 105),
        y: clamp(y, 45, mapHeight - 45),
      },
    }))
  }

  const startDraggingNode = (label: string, event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setDraggingNode(label)
    updateNodePosition(label, event)
  }

  const moveDraggingNode = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingNode) {
      return
    }

    updateNodePosition(draggingNode, event)
  }

  const stopDraggingNode = () => {
    setDraggingNode(null)
  }

  return (
    <section id="pricing" className="px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-5xl text-center">
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Start small.{" "}
          <span className="font-serif italic font-normal text-primary">
            Scale fast.
          </span>
        </h1>
        {showModelDiagram && (
        <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-border bg-card/70 p-4 text-left shadow-xl shadow-black/5 md:p-6">
          <div className="md:hidden">
            <div className="rounded-xl border border-primary/25 bg-primary/10 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                Pricing model
              </p>
              <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight">
                Platform pricing built around deployment depth.
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Each proposal is composed from the platform, deployment,
                integration, usage, and support layers needed for the rollout.
              </p>
            </div>

            <div className="mt-4 grid gap-3 border-l border-primary/30 pl-4">
              {pricingModel.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="relative flex items-start gap-3 rounded-xl border border-border bg-background p-3 before:absolute before:left-[-17px] before:top-7 before:h-px before:w-4 before:bg-primary/40"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                        {item.desc}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div
            ref={diagramRef}
            className="relative hidden h-[620px] overflow-hidden rounded-xl md:block"
            onPointerMove={moveDraggingNode}
            onPointerUp={stopDraggingNode}
            onPointerCancel={stopDraggingNode}
          >
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              aria-hidden="true"
            >
              {pricingModel.map((item) => {
                const position = nodePositions[item.label] ?? item
                return (
                  <line
                    key={item.label}
                    x1={mapCenter.x}
                    y1={mapCenter.y}
                    x2={position.x}
                    y2={position.y}
                    stroke="hsl(var(--primary) / 0.35)"
                    strokeWidth="2"
                  />
                )
              })}
            </svg>

            <div className="absolute left-1/2 top-1/2 z-10 w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-primary/35 bg-background p-6 shadow-2xl shadow-primary/10">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                Pricing model
              </p>
              <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight">
                Platform pricing built around deployment depth.
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Each proposal is composed from the platform, deployment,
                integration, usage, and support layers needed for the rollout.
              </p>
            </div>

            {pricingModel.map((item) => {
              const Icon = item.icon
              const position = nodePositions[item.label] ?? item
              const isDragging = draggingNode === item.label

              return (
                <div
                  key={item.label}
                  role="button"
                  tabIndex={0}
                  className={`absolute z-20 flex w-[220px] -translate-x-1/2 -translate-y-1/2 touch-none select-none items-start gap-3 rounded-xl border bg-background p-3 shadow-lg shadow-black/5 transition-shadow ${
                    isDragging
                      ? "cursor-grabbing border-primary shadow-2xl shadow-primary/20"
                      : "cursor-grab border-border hover:border-primary/60 hover:shadow-xl"
                  }`}
                  style={{
                    left: `${position.x / 10}%`,
                    top: `${(position.y / mapHeight) * 100}%`,
                  }}
                  onPointerDown={(event) =>
                    startDraggingNode(item.label, event)
                  }
                  onLostPointerCapture={stopDraggingNode}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                      {item.desc}
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        )}
        <p className="mt-4 text-muted-foreground">
          Ideal for hospitals and health systems.
        </p>
      </Reveal>

      <PricingCalculator />

      <Stagger className="mx-auto mt-14 grid max-w-5xl items-start gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <StaggerItem key={plan.name}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                plan.featured
                  ? "border-primary bg-gradient-to-b from-primary/10 to-card shadow-2xl shadow-primary/10 md:-mt-2"
                  : "border-border bg-card"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-medium">{plan.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">
                {plan.tagline}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: plan.featured ? "default" : "outline",
                  className: "mt-8 h-10",
                })}
              >
                {plan.cta}
              </a>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
