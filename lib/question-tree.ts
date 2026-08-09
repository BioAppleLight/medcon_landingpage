import type { AnswerKey, QuestionTree, TreeChoice } from "./types.ts"

/**
 * Fixed, deterministic conversation tree. The first two levels keep 21 industries usable on
 * a small chat surface; the purpose level groups the supplied use-case catalog into five
 * customer-friendly choices. Free text only advances when it matches exactly one choice.
 */

export const ROOT_NODE_ID = "sector_group"

export const REQUIRED_SLOTS: AnswerKey[] = [
  "domain",
  "goal",
  "audience",
  "interaction",
  "tone",
  "outcome",
  "requirement",
]

export const RESTART_KEYWORDS = [
  "start over",
  "start again",
  "restart",
  "reset",
  "begin again",
  "from the top",
]

function sector(
  id: string,
  label: string,
  keywords: string[],
): TreeChoice {
  return {
    id,
    label,
    sets: { domain: id },
    next: "purpose",
    keywords,
  }
}

export const questionTree: QuestionTree = {
  sector_group: {
    id: "sector_group",
    question: "Which area best describes your organization?",
    allowFreeText: true,
    capture: "note",
    choices: [
      {
        id: "customer_growth",
        label: "Customer, growth & services",
        sets: {},
        next: "sector_customer_growth",
        keywords: [
          "customer service", "sales", "lead generation", "marketing", "brand communication",
          "retail", "e commerce", "ecommerce", "shopping", "event", "conference",
          "professional services", "consulting", "agency",
        ],
      },
      {
        id: "people_learning",
        label: "Learning, people & workplace",
        sets: {},
        next: "sector_people_learning",
        keywords: [
          "education", "employee training", "human resources", "hr", "school", "university",
          "workforce", "recruitment", "career services", "personal productivity", "coaching",
          "internal communication", "organizational communication",
        ],
      },
      {
        id: "public_regulated",
        label: "Health, public & community",
        sets: {},
        next: "sector_public_regulated",
        keywords: [
          "healthcare", "health care", "hospital", "clinic", "medical", "government", "public services", "banking", "insurance",
          "financial services", "finance", "legal", "law",
          "nonprofit", "community organization", "accessibility", "inclusion",
        ],
      },
      {
        id: "industry_technology",
        label: "Technology, industry & safety",
        sets: {},
        next: "sector_industry_technology",
        keywords: [
          "manufacturing", "industrial", "technology", "software", "telecommunications",
          "telecom", "utilities", "automotive", "transportation",
          "research", "scientific communication", "safety", "emergency", "compliance",
        ],
      },
      {
        id: "places_experiences",
        label: "Places, experiences & knowledge",
        sets: {},
        next: "sector_places_experiences",
        keywords: [
          "real estate", "property", "travel", "hospitality", "restaurant", "food service",
          "entertainment", "media", "museum", "culture", "heritage",
          "knowledge preservation",
        ],
      },
    ],
  },

  sector_customer_growth: {
    id: "sector_customer_growth",
    question: "Which customer-growth area is this for?",
    allowFreeText: true,
    capture: "note",
    choices: [
      sector("customer_service", "Customer service", [
        "customer service", "customer support", "support centre", "support center", "help desk",
      ]),
      sector("sales", "Sales and lead generation", [
        "sales", "lead generation", "lead qualification", "business development", "sales representative",
      ]),
      sector("marketing", "Marketing and brand communication", [
        "marketing", "brand", "campaign", "advertising", "social media", "brand communication",
      ]),
      sector("retail", "Retail and e-commerce", [
        "retail", "e commerce", "ecommerce", "online store", "shopping", "store",
      ]),
      sector("events_conferences", "Events and conferences", [
        "event", "events", "conference", "conferences", "venue", "exhibitor", "sponsor",
      ]),
      sector("professional_services", "Professional services", [
        "professional services", "consulting", "accounting", "architecture", "engineering", "agency",
      ]),
    ],
  },

  sector_people_learning: {
    id: "sector_people_learning",
    question: "Which learning or people area is this for?",
    allowFreeText: true,
    capture: "note",
    choices: [
      sector("education", "Education", [
        "education", "school", "university", "college", "student", "teaching", "course",
      ]),
      sector("employee_training", "Employee training", [
        "employee training", "workforce training", "staff training", "workplace training",
      ]),
      sector("human_resources", "Human resources", [
        "human resources", "hr", "people team", "recruitment", "employee benefits",
      ]),
      sector("recruitment_career", "Recruitment and career services", [
        "recruitment", "career services", "candidate", "applicant", "career fair", "internship",
      ]),
      sector("productivity_coaching", "Personal productivity and coaching", [
        "personal productivity", "coaching", "habit coach", "time management", "goal setting",
      ]),
      sector("internal_communication", "Internal organizational communication", [
        "internal communication", "organizational communication", "ceo announcement", "town hall",
        "change management", "internal news",
      ]),
    ],
  },

  sector_public_regulated: {
    id: "sector_public_regulated",
    question: "Which health, public, or regulated area is this for?",
    allowFreeText: true,
    capture: "note",
    choices: [
      sector("healthcare", "Healthcare and patient support", [
        "healthcare", "health care", "patient support", "hospital", "clinic", "medical", "clinical",
      ]),
      sector("government", "Government and public services", [
        "government", "public service", "public services", "municipal", "ministry", "citizen service",
      ]),
      sector("financial_services", "Banking, insurance and finance", [
        "banking", "bank", "insurance", "financial services", "finance", "mortgage", "loan",
      ]),
      sector("legal", "Legal information", [
        "legal", "law", "law firm", "court", "contract", "tenant rights", "consumer rights",
      ]),
      sector("nonprofits_community", "Nonprofits and community organizations", [
        "nonprofit", "nonprofits", "community organization", "community resource", "volunteer",
      ]),
      sector("accessibility_inclusion", "Accessibility and inclusion", [
        "accessibility", "inclusion", "sign language", "plain language", "audio description",
      ]),
    ],
  },

  sector_industry_technology: {
    id: "sector_industry_technology",
    question: "Which technology or industrial area is this for?",
    allowFreeText: true,
    capture: "note",
    choices: [
      sector("manufacturing", "Manufacturing and industrial operations", [
        "manufacturing", "factory", "industrial", "warehouse", "assembly", "machine operation",
      ]),
      sector("technology", "Technology and software", [
        "technology", "software", "saas", "api", "developer", "platform", "it help desk",
      ]),
      sector("telecom_utilities", "Telecommunications and utilities", [
        "telecommunications", "telecom", "internet provider", "utility", "utilities", "energy",
      ]),
      sector("automotive_transport", "Automotive and transportation", [
        "automotive", "vehicle", "car", "transportation", "public transit", "fleet", "logistics",
      ]),
      sector("research_science", "Research and scientific communication", [
        "research", "scientific communication", "research paper", "laboratory", "study participant",
      ]),
      sector("safety_compliance", "Safety, emergency and compliance", [
        "safety", "emergency", "compliance", "evacuation", "first aid", "hazardous materials",
      ]),
    ],
  },

  sector_places_experiences: {
    id: "sector_places_experiences",
    question: "Which property, hospitality, or cultural area is this for?",
    allowFreeText: true,
    capture: "note",
    choices: [
      sector("real_estate", "Real estate and property management", [
        "real estate", "property", "rental", "tenant", "building", "open house",
      ]),
      sector("travel_hospitality", "Travel and hospitality", [
        "travel", "hospitality", "hotel", "tourism", "airport", "cruise", "destination",
      ]),
      sector("restaurants_food", "Restaurants and food services", [
        "restaurant", "food service", "menu", "catering", "kitchen", "dining",
      ]),
      sector("entertainment_media", "Entertainment and media", [
        "entertainment", "media", "news", "game", "livestream", "podcast", "sports commentator",
      ]),
      sector("museums_culture", "Museums, culture and heritage", [
        "museum", "culture", "heritage", "artwork", "exhibition", "archaeological", "historical character",
      ]),
      sector("knowledge_preservation", "Knowledge preservation", [
        "knowledge preservation", "retired expert", "knowledge transfer", "institutional memory",
        "oral history", "succession planning",
      ]),
    ],
  },

  purpose: {
    id: "purpose",
    question: "What should the AI expert primarily help people do?",
    allowFreeText: true,
    capture: "note",
    choices: [
      {
        id: "information",
        label: "Explain and answer questions",
        sets: {},
        next: "scenario_information",
        keywords: [
          "frequently asked questions", "faq", "product information", "policy explanation",
          "feature explanation", "status information", "information presenter", "explainer",
          "public information", "benefits explanation", "billing explanation", "brand story",
          "news summary", "artwork explainer", "course navigation", "owner manual",
        ],
      },
      {
        id: "guidance",
        label: "Guide a process or onboarding",
        sets: {},
        next: "scenario_guidance",
        keywords: [
          "onboarding", "account setup", "setup guide", "application guide", "process guide",
          "appointment preparation", "document checklist", "form completion", "navigation assistant",
          "check in guide", "procedure preparation", "installation guide", "activation guide",
          "reservation assistant", "move in", "move out", "customer onboarding", "tenant onboarding",
          "developer documentation",
        ],
      },
      {
        id: "recommendation",
        label: "Recommend, present or convert",
        sets: {},
        next: "scenario_recommendation",
        keywords: [
          "product recommender", "service recommender", "lead qualification", "sales representative",
          "feature comparison", "product demonstration", "interactive sales presentation",
          "proposal walkthrough", "upselling", "cross selling", "promotional campaign",
          "listing presenter", "showroom host", "gift recommender", "call to action",
          "consultation booking", "service selection", "destination recommender",
        ],
      },
      {
        id: "training",
        label: "Teach, train or assess",
        sets: {},
        next: "scenario_training",
        keywords: [
          "training", "tutor", "instructor", "teaching assistant", "study coach", "pronunciation coach",
          "oral exam", "mock interview", "quiz", "exam preparation", "certification preparation",
          "simulation", "knowledge check", "safety instruction", "compliance training",
          "procedure training", "awareness trainer", "role play", "learning experience",
        ],
      },
      {
        id: "support",
        label: "Support, troubleshoot or escalate",
        sets: {},
        next: "scenario_support",
        keywords: [
          "troubleshooting", "technical support", "returns", "refund", "complaint intake",
          "service escalation", "intake assistant", "claims submission", "maintenance request",
          "feedback collection", "help desk", "payment troubleshooting", "order status",
          "symptom intake", "remote check in", "incident reporting", "after hours support",
        ],
      },
    ],
  },

  scenario_information: {
    id: "scenario_information",
    question: "Which information experience is closest to what you need?",
    allowFreeText: true,
    capture: "note",
    choices: [
      {
        id: "faq_information",
        label: "FAQs and common questions",
        sets: { goal: "faq_information" },
        next: "interaction",
        keywords: ["faq", "faqs", "frequently asked questions", "common questions", "customer faq", "conference faq"],
      },
      {
        id: "product_policy_information",
        label: "Product, service or policy information",
        sets: { goal: "product_policy_information" },
        next: "interaction",
        keywords: [
          "product information", "service information", "policy explanation", "policy explainer",
          "benefits explanation", "feature guide", "plan explainer", "legal information",
        ],
      },
      {
        id: "status_updates",
        label: "Status, updates and announcements",
        sets: { goal: "status_updates" },
        next: "interaction",
        keywords: [
          "order status", "case status", "outage information", "release notes", "announcement",
          "policy update", "internal news", "daily briefing",
        ],
      },
      {
        id: "story_explainer",
        label: "Stories, research and expert knowledge",
        sets: { goal: "story_explainer" },
        next: "interaction",
        keywords: [
          "brand story", "impact story", "case study", "research paper", "scientific poster",
          "founder story", "oral history", "knowledge archive", "artwork explainer",
        ],
      },
      {
        id: "public_education",
        label: "Public education and awareness",
        sets: { goal: "public_education" },
        next: "interaction",
        keywords: [
          "public awareness", "patient education", "financial literacy", "public health information",
          "fraud awareness", "consumer rights", "voter information", "science communicator",
        ],
      },
    ],
  },

  scenario_guidance: {
    id: "scenario_guidance",
    question: "Which guided journey is closest to what you need?",
    allowFreeText: true,
    capture: "note",
    choices: [
      {
        id: "onboarding_setup",
        label: "Onboarding, setup or activation",
        sets: { goal: "onboarding_setup" },
        next: "interaction",
        keywords: [
          "onboarding", "account setup", "product onboarding", "software setup", "device activation",
          "utility account setup", "tenant onboarding", "member onboarding", "applicant onboarding",
        ],
      },
      {
        id: "process_navigation",
        label: "Process or service navigation",
        sets: { goal: "process_navigation" },
        next: "interaction",
        keywords: [
          "process guide", "permit application", "immigration process", "court process", "claims submission",
          "rental application", "checkout", "hospital navigation", "platform navigation", "developer documentation",
        ],
      },
      {
        id: "booking_preparation",
        label: "Booking, check-in or preparation",
        sets: { goal: "booking_preparation" },
        next: "interaction",
        keywords: [
          "appointment preparation", "consultation preparation", "reservation assistant", "check in guide",
          "event registration", "procedure preparation", "visa checklist", "service booking",
        ],
      },
      {
        id: "documents_forms",
        label: "Documents, forms or checklists",
        sets: { goal: "documents_forms" },
        next: "interaction",
        keywords: [
          "document checklist", "document requirement", "form completion", "new hire document",
          "identity verification", "application process", "step by step form",
        ],
      },
      {
        id: "tour_orientation",
        label: "Orientation, navigation or tours",
        sets: { goal: "tour_orientation" },
        next: "interaction",
        keywords: [
          "orientation", "tour guide", "museum guide", "venue navigation", "store navigation",
          "airport navigation", "facility guide", "virtual field trip", "factory tour",
        ],
      },
    ],
  },

  scenario_recommendation: {
    id: "scenario_recommendation",
    question: "Which recommendation or presentation experience is closest?",
    allowFreeText: true,
    capture: "note",
    choices: [
      {
        id: "selection_recommendation",
        label: "Product or service recommendation",
        sets: { goal: "selection_recommendation" },
        next: "interaction",
        keywords: [
          "product recommender", "service recommender", "gift recommender", "size and fit",
          "parts selection", "training path recommender", "session recommender", "media recommender",
        ],
      },
      {
        id: "demo_comparison",
        label: "Demonstration or comparison",
        sets: { goal: "demo_comparison" },
        next: "interaction",
        keywords: [
          "product demonstration", "software demo", "interactive demo", "feature comparison",
          "vehicle feature", "proposal walkthrough", "portfolio presenter",
        ],
      },
      {
        id: "lead_consultation",
        label: "Lead qualification or consultation",
        sets: { goal: "lead_consultation" },
        next: "interaction",
        keywords: [
          "lead qualification", "lead capture", "consultation booking", "consultation preparation",
          "candidate pre screening", "research recruitment", "service selection",
        ],
      },
      {
        id: "promotion_conversion",
        label: "Promotion, upsell or call to action",
        sets: { goal: "promotion_conversion" },
        next: "interaction",
        keywords: [
          "upselling", "cross selling", "promotion", "promotional campaign", "call to action",
          "product launch", "event promotion", "donation guide", "campaign host",
        ],
      },
      {
        id: "showroom_catalog",
        label: "Listing, showroom or catalog",
        sets: { goal: "showroom_catalog" },
        next: "interaction",
        keywords: [
          "property listing", "open house", "virtual showroom", "interactive catalog",
          "product catalog", "new development sales", "exhibitor guide",
        ],
      },
    ],
  },

  scenario_training: {
    id: "scenario_training",
    question: "Which learning or training experience is closest?",
    allowFreeText: true,
    capture: "note",
    choices: [
      {
        id: "onboarding_orientation_training",
        label: "Onboarding and orientation",
        sets: { goal: "onboarding_orientation_training" },
        next: "interaction",
        keywords: [
          "new employee onboarding", "workplace orientation", "student orientation", "volunteer onboarding",
          "laboratory onboarding", "department onboarding", "warehouse onboarding",
        ],
      },
      {
        id: "instruction_learning",
        label: "Instruction and concept learning",
        sets: { goal: "instruction_learning" },
        next: "interaction",
        keywords: [
          "virtual tutor", "course instructor", "concept explainer", "homework guide", "language learning",
          "mathematics walkthrough", "reading comprehension", "adult literacy", "coding course",
        ],
      },
      {
        id: "sop_safety_training",
        label: "Procedures, safety and compliance",
        sets: { goal: "sop_safety_training" },
        next: "interaction",
        keywords: [
          "standard operating procedure", "safety training", "compliance training", "cybersecurity training",
          "equipment operation", "emergency response", "food safety", "privacy policy training",
        ],
      },
      {
        id: "coaching_simulation",
        label: "Coaching, role-play or simulation",
        sets: { goal: "coaching_simulation" },
        next: "interaction",
        keywords: [
          "coaching", "role play", "mock interview", "conflict resolution", "public speaking practice",
          "language conversation", "presentation rehearsal", "technical expert simulation",
        ],
      },
      {
        id: "assessment_certification",
        label: "Assessment or certification preparation",
        sets: { goal: "assessment_certification" },
        next: "interaction",
        keywords: [
          "oral exam", "quiz", "exam preparation", "certification preparation", "knowledge check",
          "skills assessment", "driver certification", "assessment host",
        ],
      },
    ],
  },

  scenario_support: {
    id: "scenario_support",
    question: "Which support experience is closest to what you need?",
    allowFreeText: true,
    capture: "note",
    choices: [
      {
        id: "troubleshooting_support",
        label: "Troubleshooting and technical help",
        sets: { goal: "troubleshooting_support" },
        next: "interaction",
        keywords: [
          "troubleshooting", "technical support", "payment troubleshooting", "router troubleshooting",
          "software support", "maintenance procedure", "field service", "it help desk",
        ],
      },
      {
        id: "request_status_support",
        label: "Orders, returns, claims or requests",
        sets: { goal: "request_status_support" },
        next: "interaction",
        keywords: [
          "order status", "returns", "refund", "warranty", "claims submission", "maintenance request",
          "service transfer", "complaint submission", "case status",
        ],
      },
      {
        id: "intake_eligibility",
        label: "Intake, screening or eligibility",
        sets: { goal: "intake_eligibility" },
        next: "interaction",
        keywords: [
          "intake", "symptom intake", "client intake", "complaint intake", "eligibility check",
          "program eligibility", "candidate screening", "study participant information",
        ],
      },
      {
        id: "feedback_survey",
        label: "Feedback, surveys or follow-up",
        sets: { goal: "feedback_survey" },
        next: "interaction",
        keywords: [
          "feedback collection", "customer feedback", "employee survey", "post event survey",
          "post demo follow up", "recognition presenter",
        ],
      },
      {
        id: "escalation_incident",
        label: "Escalation, complaints or incidents",
        sets: { goal: "escalation_incident" },
        next: "interaction",
        keywords: [
          "service escalation", "complaint", "incident reporting", "emergency information",
          "crisis resource", "fraud", "hazard", "human handoff", "after hours support",
        ],
      },
    ],
  },

  interaction: {
    id: "interaction",
    question: "How should people interact with the AI expert?",
    allowFreeText: true,
    capture: null,
    choices: [
      {
        id: "guided_chat",
        label: "Guided conversation",
        sets: { interaction: "guided_chat" },
        next: "audience",
        keywords: ["guided", "guided conversation", "conversation", "step by step"],
      },
      {
        id: "qa",
        label: "Questions and answers",
        sets: { interaction: "qa" },
        next: "audience",
        keywords: ["questions and answers", "question and answer", "q and a", "qa", "questions"],
      },
      {
        id: "assessment",
        label: "Interactive practice or assessment",
        sets: { interaction: "assessment" },
        next: "audience",
        keywords: ["interactive assessment", "assessment", "quiz", "exam", "practice", "simulation"],
      },
      {
        id: "presentation",
        label: "Presenter-led experience",
        sets: { interaction: "presentation" },
        next: "audience",
        keywords: ["presenter", "presentation", "host", "narrator", "demonstration", "walkthrough"],
      },
      {
        id: "other",
        label: "A flexible mix",
        sets: { interaction: "general" },
        next: "audience",
        keywords: ["flexible", "mix", "something else", "other", "not sure", "unsure"],
      },
    ],
  },

  audience: {
    id: "audience",
    question: "Who is the primary audience for this experience?",
    allowFreeText: true,
    capture: null,
    choices: [
      {
        id: "customers",
        label: "Customers and prospects",
        sets: { audience: "customers" },
        next: "tone",
        keywords: ["customers", "customer", "prospects", "buyers", "shoppers", "clients"],
      },
      {
        id: "employees",
        label: "Employees and partners",
        sets: { audience: "employees" },
        next: "tone",
        keywords: ["employees", "employee", "staff", "workforce", "partners", "team"],
      },
      {
        id: "learners",
        label: "Learners and candidates",
        sets: { audience: "learners" },
        next: "tone",
        keywords: ["learners", "learner", "students", "student", "candidates", "applicants"],
      },
      {
        id: "patients",
        label: "Patients and caregivers",
        sets: { audience: "patients" },
        next: "tone",
        keywords: ["patients", "patient", "caregivers", "caregiver", "families"],
      },
      {
        id: "community",
        label: "Citizens, members and visitors",
        sets: { audience: "community" },
        next: "tone",
        keywords: ["citizens", "citizen", "members", "visitors", "residents", "public", "guests"],
      },
    ],
  },

  tone: {
    id: "tone",
    question: "What tone should the AI expert use?",
    allowFreeText: true,
    capture: null,
    choices: [
      {
        id: "warm",
        label: "Warm and reassuring",
        sets: { tone: "warm" },
        next: "outcome",
        keywords: ["warm", "reassuring", "friendly", "empathetic", "supportive"],
      },
      {
        id: "professional",
        label: "Clear and professional",
        sets: { tone: "professional" },
        next: "outcome",
        keywords: ["clear", "professional", "formal", "authoritative"],
      },
      {
        id: "encouraging",
        label: "Encouraging and engaging",
        sets: { tone: "encouraging" },
        next: "outcome",
        keywords: ["encouraging", "engaging", "motivational", "energetic"],
      },
      {
        id: "conversational",
        label: "Natural and conversational",
        sets: { tone: "conversational" },
        next: "outcome",
        keywords: ["natural", "conversational", "casual", "approachable"],
      },
      {
        id: "other",
        label: "Adapt to the visitor",
        sets: { tone: "adaptive" },
        next: "outcome",
        keywords: ["adapt", "adaptive", "visitor", "other", "not sure", "unsure"],
      },
    ],
  },

  outcome: {
    id: "outcome",
    question: "What is the most important outcome?",
    allowFreeText: true,
    capture: null,
    choices: [
      {
        id: "access",
        label: "Faster access to knowledge",
        sets: { outcome: "access" },
        next: "requirement",
        keywords: ["access", "faster access", "knowledge", "answers", "speed"],
      },
      {
        id: "consistency",
        label: "More consistent guidance",
        sets: { outcome: "consistency" },
        next: "requirement",
        keywords: ["consistent", "consistency", "standardized", "standardised", "guidance"],
      },
      {
        id: "engagement",
        label: "Higher engagement",
        sets: { outcome: "engagement" },
        next: "requirement",
        keywords: ["engagement", "engage", "participation", "completion"],
      },
      {
        id: "conversion",
        label: "More conversions or completion",
        sets: { outcome: "conversion" },
        next: "requirement",
        keywords: ["conversion", "conversions", "sales", "leads", "completion", "adoption"],
      },
      {
        id: "other",
        label: "A balanced improvement",
        sets: { outcome: "balanced" },
        next: "requirement",
        keywords: ["balanced", "balance", "all", "other", "not sure", "unsure"],
      },
    ],
  },

  requirement: {
    id: "requirement",
    question: "Is there one delivery requirement to prioritize?",
    allowFreeText: true,
    capture: null,
    choices: [
      {
        id: "multilingual",
        label: "Multiple languages",
        sets: { requirement: "multilingual" },
        next: null,
        keywords: ["multilingual", "multiple languages", "languages", "translation", "localization"],
      },
      {
        id: "accessible",
        label: "Accessible, plain-language delivery",
        sets: { requirement: "accessible" },
        next: null,
        keywords: ["accessible", "accessibility", "plain language", "sign language", "audio description"],
      },
      {
        id: "handoff",
        label: "Human handoff and escalation",
        sets: { requirement: "handoff" },
        next: null,
        keywords: ["human handoff", "handoff", "escalation", "real person", "human support"],
      },
      {
        id: "after_hours",
        label: "After-hours availability",
        sets: { requirement: "after_hours" },
        next: null,
        keywords: ["after hours", "24 7", "always available", "overnight", "weekends"],
      },
      {
        id: "unsure",
        label: "Not sure yet",
        sets: { requirement: "flexible" },
        next: null,
        keywords: ["not sure", "unsure", "flexible", "no preference", "undecided"],
      },
    ],
  },
}
