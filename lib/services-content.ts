/**
 * The services MYO'S offers, as published on `/services`. Shared by that page and the AI
 * consultant's knowledge catalog so the two cannot drift apart.
 */

export type ServiceArtId =
  | "automation"
  | "web_design"
  | "software_dev"
  | "ai_agents"
  | "avatars"
  | "consultation"

export interface ServiceOffering {
  id: string
  step: string
  art: ServiceArtId
  title: string
  tagline: string
  desc: string
  points: string[]
}

export const services: ServiceOffering[] = [
  {
    id: "ai_agent_automation",
    step: "01",
    art: "automation",
    title: "AI Agent Automation",
    tagline: "Automate repetitive work with intelligent, reliable workflows.",
    desc: "We design AI-powered automations that connect your tools, handle routine processes, and give your team more time for high-value work.",
    points: [
      "Workflow and process automation",
      "CRM, ERP, and support integrations",
      "Human review and safety controls",
    ],
  },
  {
    id: "web_design",
    step: "02",
    art: "web_design",
    title: "Web Design",
    tagline: "High-performing digital experiences built around your brand.",
    desc: "We create responsive, accessible websites that look polished, communicate clearly, and turn visitors into customers.",
    points: [
      "UX and UI design",
      "Responsive development",
      "SEO and performance optimization",
    ],
  },
  {
    id: "software_development",
    step: "03",
    art: "software_dev",
    title: "Software Development",
    tagline: "Custom software engineered for your operations and growth.",
    desc: "From focused internal tools to full-scale platforms, we build secure software tailored to your users, systems, and business goals.",
    points: [
      "Full-stack application development",
      "API and systems integration",
      "Maintenance and modernization",
    ],
  },
  {
    id: "custom_ai_agents",
    step: "04",
    art: "ai_agents",
    title: "Custom AI Agents",
    tagline: "Purpose-built AI assistants grounded in your knowledge.",
    desc: "We develop secure AI agents that answer questions, guide users, and take action using your approved information and business rules.",
    points: [
      "Knowledge-grounded assistants",
      "Tool use and multi-step reasoning",
      "Web, app, and platform deployment",
    ],
  },
  {
    id: "ai_avatars",
    step: "05",
    art: "avatars",
    title: "AI Avatars",
    tagline: "Bring trusted expertise to life through a human presence.",
    desc: "Create multilingual digital experts that communicate naturally and deliver consistent guidance, training, and support at scale.",
    points: [
      "Custom voice and visual identity",
      "Multilingual conversations",
      "Training, onboarding, and support",
    ],
  },
  {
    id: "ai_consultation",
    step: "06",
    art: "consultation",
    title: "AI Consultation",
    tagline: "A practical AI strategy aligned with real business value.",
    desc: "We help you identify the strongest opportunities, choose the right technology, and create a responsible roadmap from pilot to deployment.",
    points: [
      "AI readiness assessment",
      "Use-case and technology planning",
      "Governance and implementation roadmap",
    ],
  },
]
