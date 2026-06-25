export type Variant = "healthcare" | "education" | "business"

export const VARIANT_KEYWORDS: Record<Variant, string[]> = {
  healthcare: [
    "doctor",
    "health",
    "medical",
    "medicine",
    "sick",
    "patient",
    "clinic",
    "hospital",
    "nurse",
    "therapy",
    "recovery",
    "care",
  ],
  education: [
    "learn",
    "school",
    "study",
    "tutor",
    "teach",
    "student",
    "course",
    "class",
    "education",
    "exam",
    "university",
    "professor",
    "lecture",
  ],
  business: [
    "business",
    "scale",
    "company",
    "marketing",
    "sales",
    "team",
    "enterprise",
    "startup",
    "organization",
    "revenue",
    "customer",
    "growth",
  ],
}

// Detect the page variant from a free-text message. Healthcare and education
// take priority; anything else (or no match) falls back to business.
export function detectVariant(message: string): Variant {
  const text = message.toLowerCase()
  const ordered: Variant[] = ["healthcare", "education", "business"]
  for (const variant of ordered) {
    if (VARIANT_KEYWORDS[variant].some((kw) => text.includes(kw))) {
      return variant
    }
  }
  return "business"
}

type ThemeVars = {
  "--primary": string
  "--ring": string
  "--accent": string
  "--chart-1": string
}

export const VARIANT_THEME: Record<Variant, ThemeVars> = {
  healthcare: {
    "--primary": "oklch(0.62 0.19 255)",
    "--ring": "oklch(0.62 0.19 255)",
    "--accent": "oklch(0.58 0.22 290)",
    "--chart-1": "oklch(0.62 0.19 255)",
  },
  education: {
    "--primary": "oklch(0.66 0.15 155)",
    "--ring": "oklch(0.66 0.15 155)",
    "--accent": "oklch(0.72 0.13 165)",
    "--chart-1": "oklch(0.66 0.15 155)",
  },
  business: {
    "--primary": "oklch(0.69 0.16 55)",
    "--ring": "oklch(0.69 0.16 55)",
    "--accent": "oklch(0.73 0.15 45)",
    "--chart-1": "oklch(0.69 0.16 55)",
  },
}

export type VariantHero = {
  label: string
  badge: string
  headlinePre: string
  headlineAccent: string
  subhead: string
  card: {
    role: string
    name: string
    title: string
    quote: string
  }
}

export const VARIANT_HERO: Record<Variant, VariantHero> = {
  healthcare: {
    label: "Healthcare",
    badge: "AI expert avatars",
    headlinePre: "Every expert,",
    headlineAccent: "available 24/7.",
    subhead:
      "Deploy AI-powered doctors that guide patients through recovery, answer questions, and extend specialist care in real time.",
    card: {
      role: "Healthcare",
      name: "Dr. Amira Hassan",
      title: "Orthopedic Recovery",
      quote: "Let's review your ACL recovery exercises for this week.",
    },
  },
  education: {
    label: "Education",
    badge: "AI expert tutors",
    headlinePre: "Every expert,",
    headlineAccent: "always learning.",
    subhead:
      "Deploy AI-powered professors that tutor students, explain hard concepts, and answer questions around the clock.",
    card: {
      role: "Education",
      name: "Prof. David Chen",
      title: "Calculus Tutor",
      quote: "Let's walk through why integration by parts actually works.",
    },
  },
  business: {
    label: "Business",
    badge: "AI expert assistants",
    headlinePre: "Every expert,",
    headlineAccent: "ready to scale.",
    subhead:
      "Deploy AI-powered specialists that onboard customers, train your team, and answer questions across the organization.",
    card: {
      role: "Business",
      name: "Sarah Jenkins",
      title: "Growth Strategist",
      quote: "Here's how to scale your onboarding without adding headcount.",
    },
  },
}
