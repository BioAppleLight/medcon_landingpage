import { questionTree } from "./question-tree.ts"
import type { AnswerSet, TreeChoice } from "./types.ts"

type Rule = { value: string; keywords: string[] }
type CareerRule = Rule & { domain: string }

export interface FreeTextClassification {
  answers: AnswerSet
  matches: {
    career_industry: boolean
    audience: boolean
    goal_interest: boolean
    avatar_function: boolean
  }
}

const careerRules: CareerRule[] = [
  { domain: "healthcare", value: "physician", keywords: ["doctor", "physician", "surgeon", "resident", "fellow", "clinician"] },
  { domain: "healthcare", value: "nurse", keywords: ["nurse", "rn"] },
  { domain: "healthcare", value: "allied_health", keywords: ["pharmacist", "dentist", "orthodontist", "hygienist", "therapist", "physical therapist", "occupational therapist", "psychologist", "psychiatrist", "counselor", "paramedic", "emt", "radiologist", "dermatologist", "oncologist", "cardiologist", "neurologist", "pediatrician", "pathologist", "veterinarian", "vet", "healthcare administrator"] },
  { domain: "education", value: "professor", keywords: ["professor", "lecturer", "dean", "academic advisor"] },
  { domain: "education", value: "educator", keywords: ["teacher", "tutor", "instructor", "educator", "teaching assistant", "principal", "curriculum designer", "instructional designer", "school administrator"] },
  { domain: "education", value: "student", keywords: ["medical student", "law student", "phd student", "graduate student", "undergraduate", "student"] },
  { domain: "research_science", value: "researcher", keywords: ["researcher", "scientist", "research assistant", "research associate", "lab technician", "lab manager", "principal investigator", "postdoc", "postdoctoral researcher", "biologist", "chemist", "physicist", "neuroscientist", "geneticist", "microbiologist", "immunologist", "biomedical scientist"] },
  { domain: "technology", value: "software_professional", keywords: ["software engineer", "developer", "programmer", "coder", "frontend developer", "backend developer", "full stack developer", "fullstack developer", "web developer", "mobile developer", "data scientist", "data analyst", "machine learning engineer", "ai engineer", "devops engineer", "cloud engineer", "cybersecurity analyst", "security engineer", "product engineer", "solutions architect", "cto"] },
  { domain: "professional_services", value: "engineer", keywords: ["engineer", "mechanical engineer", "electrical engineer", "civil engineer", "chemical engineer", "biomedical engineer", "bioengineer", "aerospace engineer", "robotics engineer", "manufacturing engineer", "systems engineer", "hardware engineer", "technician"] },
  { domain: "professional_services", value: "business_leader", keywords: ["founder", "cofounder", "ceo", "coo", "manager", "director", "executive", "consultant", "entrepreneur", "business owner", "business analyst", "operations manager", "project manager", "program manager", "general manager"] },
  { domain: "marketing", value: "marketer", keywords: ["marketer", "marketing manager", "marketing director", "brand manager", "social media manager", "content strategist", "copywriter", "pr specialist", "communications manager", "growth marketer", "cmo"] },
  { domain: "sales", value: "sales_professional", keywords: ["salesperson", "sales representative", "sales rep", "account executive", "account manager", "customer success manager", "customer service representative", "support agent", "sales manager", "business development representative", "bdr", "sdr"] },
  { domain: "financial_services", value: "finance_professional", keywords: ["banker", "accountant", "financial analyst", "investment banker", "trader", "portfolio manager", "financial advisor", "wealth manager", "economist", "auditor", "actuary", "insurance agent", "cpa", "cfo"] },
  { domain: "legal", value: "legal_professional", keywords: ["lawyer", "attorney", "paralegal", "judge", "prosecutor", "legal counsel", "general counsel", "compliance officer", "legal assistant"] },
  { domain: "government", value: "public_servant", keywords: ["government employee", "civil servant", "policy analyst", "diplomat", "public administrator", "government official", "politician", "legislative assistant", "foreign service officer", "city employee", "public servant"] },
  { domain: "human_resources", value: "hr_professional", keywords: ["recruiter", "hr manager", "hr specialist", "talent acquisition", "hiring manager", "people operations", "hr director", "chro", "career counselor"] },
  { domain: "nonprofits_community", value: "nonprofit_professional", keywords: ["nonprofit worker", "volunteer coordinator", "program coordinator", "community organizer", "fundraiser", "ngo worker", "social worker", "program director", "outreach coordinator"] },
  { domain: "retail", value: "retail_professional", keywords: ["retailer", "store manager", "ecommerce manager", "merchandiser", "buyer", "retail associate", "shop owner", "product seller", "marketplace seller"] },
  { domain: "travel_hospitality", value: "hospitality_professional", keywords: ["hotel manager", "concierge", "travel agent", "tour guide", "flight attendant", "airline employee", "hospitality manager", "tourism manager"] },
  { domain: "restaurants_food", value: "culinary_professional", keywords: ["chef", "cook", "baker", "restaurant owner", "restaurant manager", "caterer", "barista", "food service worker", "nutritionist"] },
  { domain: "real_estate", value: "real_estate_professional", keywords: ["realtor", "real estate agent", "broker", "property manager", "landlord", "real estate investor", "leasing agent"] },
  { domain: "entertainment_media", value: "media_professional", keywords: ["journalist", "reporter", "producer", "filmmaker", "director", "actor", "actress", "content creator", "youtuber", "podcaster", "editor", "videographer", "media producer"] },
  { domain: "professional_services", value: "creative_professional", keywords: ["designer", "graphic designer", "ux designer", "ui designer", "product designer", "artist", "illustrator", "photographer", "animator", "architect", "interior designer", "fashion designer", "creative director"] },
  { domain: "productivity_coaching", value: "fitness_professional", keywords: ["athlete", "coach", "personal trainer", "fitness instructor", "sports trainer", "athletic trainer", "strength coach", "yoga instructor", "sports manager"] },
  { domain: "healthcare", value: "life_sciences_professional", keywords: ["biotech researcher", "pharmaceutical scientist", "clinical researcher", "clinical research coordinator", "medical scientist", "regulatory affairs specialist", "pharmaceutical representative"] },
  { domain: "telecom_utilities", value: "sustainability_professional", keywords: ["environmental scientist", "sustainability manager", "climate researcher", "conservationist", "environmental engineer", "energy analyst"] },
  { domain: "research_science", value: "agriculture_professional", keywords: ["farmer", "agricultural scientist", "agronomist", "food scientist", "agricultural engineer"] },
  { domain: "automotive_transport", value: "transport_professional", keywords: ["driver", "logistics manager", "supply chain manager", "automotive engineer", "mechanic", "fleet manager", "warehouse manager", "transportation planner"] },
  { domain: "retail", value: "beauty_professional", keywords: ["beautician", "cosmetologist", "makeup artist", "aesthetician", "esthetician", "hairstylist", "salon owner"] },
  { domain: "nonprofits_community", value: "community_leader", keywords: ["pastor", "priest", "minister", "religious leader", "community leader", "membership coordinator"] },
  { domain: "museums_culture", value: "culture_professional", keywords: ["curator", "historian", "archivist", "archaeologist", "museum educator", "museum guide"] },
  { domain: "recruitment_career", value: "career_seeker", keywords: ["intern", "applicant", "job seeker", "retired", "freelancer", "contractor", "self employed"] },
]

const domainExtras: Record<string, string[]> = {
  healthcare: ["health", "medicine", "treatment", "diagnosis", "surgery", "rehabilitation", "rehab", "therapy", "wellness", "disease", "cancer", "oncology", "cardiology", "neurology", "psychiatry", "pediatrics", "dermatology", "radiology", "pathology", "emergency medicine", "primary care", "family medicine", "pharmacy", "pharmacology", "dentistry", "dental", "nursing", "physical therapy", "occupational therapy", "speech therapy", "mental health", "psychology", "counseling", "behavioral health", "emotional health", "wellbeing", "stress", "anxiety", "depression", "biotechnology", "biomedical", "pharmaceutical", "clinical trial", "life sciences", "medical device"],
  education: ["teaching", "learning", "classroom", "curriculum", "tutoring", "academic", "lesson", "lecture", "studying", "instructional design", "e learning", "online learning"],
  research_science: ["science", "experiment", "laboratory", "lab", "scientific", "discovery", "publication", "hypothesis", "biology", "chemistry", "physics", "neuroscience", "genetics", "genomics", "molecular biology", "microbiology", "biochemistry", "immunology", "stem cells", "bioinformatics", "computational biology", "agriculture", "farming", "farm", "crop", "livestock", "agricultural science", "food science", "agritech", "agricultural technology"],
  technology: ["tech", "programming", "coding", "computer science", "artificial intelligence", "ai", "machine learning", "deep learning", "data science", "cloud", "cybersecurity", "blockchain", "web development", "app development", "automation", "robotics", "database", "api", "saas"],
  professional_services: ["engineering", "mechanical", "electrical", "electronics", "aerospace", "bioengineering", "cad", "mechatronics", "business", "entrepreneurship", "startup", "management", "strategy", "operations", "leadership", "consulting", "construction", "architecture", "infrastructure", "graphic design", "illustration", "drawing", "photography", "animation", "ux", "ui", "ux design", "ui design", "fashion", "interior design", "creative"],
  marketing: ["advertising", "branding", "social media", "seo", "public relations", "communications", "campaign", "influencer", "digital marketing", "content marketing"],
  sales: ["selling", "customer success", "leads", "lead generation", "conversion", "crm", "prospect", "account management"],
  financial_services: ["money", "investment", "investing", "stocks", "stock market", "trading", "portfolio", "wealth", "accounting", "tax", "economics", "fintech", "credit", "financial planning"],
  legal: ["attorney", "lawsuit", "regulation", "compliance", "legislation", "intellectual property", "criminal law", "corporate law", "immigration law"],
  government: ["public sector", "policy", "politics", "civic", "municipality", "federal", "local government", "diplomacy", "international relations", "public administration"],
  human_resources: ["recruiting", "hiring", "talent", "payroll", "employee engagement", "organizational development"],
  nonprofits_community: ["charity", "volunteering", "social impact", "ngo", "humanitarian", "advocacy", "fundraising", "community outreach", "religion", "church", "faith", "congregation"],
  retail: ["shopping", "merchandise", "shopify", "marketplace", "consumer", "beauty", "skincare", "makeup", "cosmetics", "salon", "personal care"],
  travel_hospitality: ["tourism", "resort", "airline", "vacation", "destination", "concierge"],
  restaurants_food: ["cooking", "culinary", "recipe", "catering", "nutrition", "menu", "dining", "bakery", "cafe"],
  real_estate: ["housing", "apartment", "realtor", "commercial real estate", "residential real estate"],
  entertainment_media: ["film", "movie", "television", "youtube", "streaming", "journalism", "content creation", "production"],
  productivity_coaching: ["sports", "fitness", "exercise", "gym", "workout", "athletics", "yoga", "strength", "running"],
  telecom_utilities: ["environment", "sustainability", "climate change", "renewable energy", "clean energy", "conservation", "recycling", "carbon", "green technology"],
  automotive_transport: ["logistics", "automobile", "electric vehicle", "shipping", "delivery", "supply chain", "warehouse", "fleet"],
  museums_culture: ["history", "art history", "archive", "archaeology"],
  recruitment_career: ["employment", "internship", "resume", "cv", "interview", "professional development", "career change", "job search"],
}

const audienceRules: Rule[] = [
  { value: "patients", keywords: ["patient", "patients", "caregiver", "caregivers", "my patients"] },
  { value: "learners", keywords: ["prospective students", "student", "students", "learner", "learners", "candidate", "candidates", "applicant", "applicants", "my students"] },
  { value: "employees", keywords: ["new nurses", "nurses", "employee", "employees", "staff", "workforce", "my employees", "my team"] },
  { value: "customers", keywords: ["customer", "customers", "client", "clients", "prospect", "prospects", "buyer", "buyers", "my customers", "my clients"] },
  { value: "community", keywords: ["citizen", "citizens", "member", "members", "visitor", "visitors", "resident", "residents", "public", "guests"] },
]

const goalRules: Rule[] = [
  { value: "lead_consultation", keywords: ["recruit", "recruitment", "lead generation", "lead qualification", "generate leads", "consultation"] },
  { value: "instruction_learning", keywords: ["teach", "teaching", "train", "training", "educate", "tutor", "learning"] },
  { value: "onboarding_setup", keywords: ["onboard", "onboarding", "setup", "activation"] },
  { value: "faq_information", keywords: ["answer questions", "faq", "common questions"] },
  { value: "product_policy_information", keywords: ["explain", "information", "inform", "policy", "features", "benefits"] },
  { value: "troubleshooting_support", keywords: ["troubleshoot", "technical support", "fix problems", "help desk"] },
  { value: "selection_recommendation", keywords: ["recommend", "recommendation", "help choose", "selection"] },
  { value: "demo_comparison", keywords: ["demonstrate", "demo", "compare", "comparison", "showcase"] },
  { value: "promotion_conversion", keywords: ["sell", "sales", "promote", "promotion", "convert", "fundraise", "donation"] },
  { value: "process_navigation", keywords: ["guide", "guidance", "navigate", "process", "automate", "automation"] },
  { value: "intake_eligibility", keywords: ["intake", "screen", "screening", "eligibility", "qualify"] },
]

const functionRules: Rule[] = [
  { value: "information_lead_generation", keywords: ["recruit", "lead generation", "lead qualification", "generate leads"] },
  { value: "instructor", keywords: ["teach", "teaching", "train", "training", "tutor", "instructor", "assess", "assessment"] },
  { value: "support_agent", keywords: ["support", "help", "troubleshoot", "answer questions", "customer service"] },
  { value: "guide", keywords: ["guide", "guidance", "onboard", "navigate", "coach"] },
  { value: "presenter", keywords: ["present", "presentation", "demonstrate", "demo", "explain", "inform"] },
  { value: "sales_assistant", keywords: ["sell", "sales", "recommend", "promote", "convert"] },
]

const identityPhrases = ["i am", "i m a", "i m an", "i work as", "i work in", "my job is", "my career is", "my profession is", "i study", "i m studying", "i major in", "my major is", "i teach", "i work at", "i own", "i run", "our company", "our hospital", "our school", "our business"]
const interestPhrases = ["i m interested in", "interested in", "i like", "i love", "i want to learn", "i want to explore", "i want to know about", "i m looking for", "i need help with", "i want to use ai for", "i want an avatar for", "we need", "our goal is", "i want to improve", "i want to automate", "i want to train", "i want to teach", "i want to support", "i want to sell", "i want to explain", "i want to guide"]

const sectorGroupRules: Rule[] = [
  {
    value: "customer_growth",
    keywords: [
      "customer service", "customer support", "customer success", "customer experience", "customer", "customers", "client", "clients", "consumer", "consumers",
      "sales", "selling", "sales representative", "sales rep", "account executive", "account manager", "account management", "business development", "lead generation", "lead", "leads", "prospect", "prospects", "conversion", "conversions", "customer acquisition", "acquisition", "customer retention", "retention", "loyalty",
      "marketing", "digital marketing", "content marketing", "growth marketing", "advertising", "branding", "brand", "public relations", "pr", "communications", "social media", "seo",
      "e commerce", "ecommerce", "retail", "retailer", "store", "shop", "merchant", "marketplace", "shopping", "product sales", "product recommendation", "product advisor", "product marketing",
      "business", "company", "startup", "entrepreneur", "entrepreneurship", "small business", "business owner", "consulting", "consultant", "consultancy", "professional services", "agency",
      "financial services", "finance", "banking", "bank", "insurance", "fintech", "accounting", "accountant", "tax", "legal services", "law firm", "lawyer", "attorney",
      "real estate", "realtor", "real estate agent", "broker", "property management", "property manager", "recruitment agency", "staffing", "b2b", "b2c", "saas sales", "subscription", "membership", "booking", "appointments", "service business", "franchise", "dealer", "dealership", "commerce",
    ],
  },
  {
    value: "people_learning",
    keywords: [
      "education", "learning", "teaching", "training", "school", "university", "college", "academy", "classroom", "course", "courses", "curriculum", "student", "students", "teacher", "teachers", "professor", "professors", "lecturer", "instructor", "tutor", "tutoring", "teaching assistant", "ta", "academic", "academics", "study", "studying", "exam", "exams", "assessment", "quiz", "homework", "e learning", "online learning", "lms", "learning management system", "instructional design", "instructional designer", "education technology", "edtech",
      "corporate training", "employee training", "workplace training", "professional development", "career development", "coaching", "coach", "mentor", "mentoring", "human resources", "hr", "people operations", "people ops", "employee", "employees", "staff", "workforce", "workplace", "organization", "organizational development", "talent", "talent development", "talent management", "recruiting", "recruitment", "recruiter", "hiring", "onboarding", "new hire", "employee onboarding", "orientation", "employee engagement", "performance management", "performance review", "benefits", "payroll", "internal communications", "company culture", "workplace culture", "leadership development", "management training", "manager training", "compliance training", "skills training", "reskilling", "upskilling", "certification", "certification training", "knowledge transfer", "employee handbook", "sop training", "learning and development", "l d", "career services", "career counseling", "job training", "internship", "intern", "apprenticeship",
    ],
  },
  {
    value: "public_regulated",
    keywords: [
      "healthcare", "health care", "health", "medical", "medicine", "hospital", "clinic", "patient", "patients", "doctor", "physician", "nurse", "nurses", "nursing", "surgeon", "surgery", "clinical", "clinician", "pharmacy", "pharmacist", "pharmaceutical", "pharma", "dentistry", "dentist", "dental", "therapy", "therapist", "physical therapy", "occupational therapy", "mental health", "psychology", "psychiatry", "counseling", "wellness", "public health", "nutrition", "dietitian", "rehabilitation", "rehab", "oncology", "cancer", "cardiology", "neurology", "pediatrics", "dermatology", "radiology", "pathology", "emergency medicine", "primary care", "family medicine", "telehealth", "health insurance", "patient education", "patient support", "caregiver", "caregiving", "senior care", "elder care", "home care", "veterinary", "veterinarian",
      "government", "public sector", "public service", "government agency", "municipality", "municipal", "city government", "state government", "federal government", "civil service", "citizen services", "citizen", "citizens", "policy", "public policy", "nonprofit", "non profit", "ngo", "charity", "community", "community service", "community organization", "social services", "social work", "social worker", "volunteer", "volunteering", "humanitarian", "advocacy", "public safety", "emergency services", "fire department", "police department", "law enforcement", "public administration", "civic", "civic engagement", "social impact", "foundation", "association",
    ],
  },
  {
    value: "industry_technology",
    keywords: [
      "technology", "tech", "software", "software development", "software engineering", "developer", "programming", "coding", "computer science", "it", "information technology", "artificial intelligence", "ai", "machine learning", "ml", "data science", "data analytics", "cloud computing", "cloud", "cybersecurity", "cyber security", "information security", "network security", "devops", "saas", "api", "database", "web development", "app development", "mobile development", "automation", "robotics", "robot", "engineering", "engineer", "mechanical engineering", "electrical engineering", "civil engineering", "chemical engineering", "biomedical engineering", "aerospace", "mechatronics", "electronics", "hardware",
      "manufacturing", "factory", "industrial", "industry", "production", "assembly", "machine operation", "equipment", "maintenance", "quality control", "quality assurance", "qa", "supply chain", "logistics", "warehouse", "warehousing", "transportation", "automotive", "automobile", "vehicle", "vehicles", "electric vehicle", "ev", "fleet", "shipping", "delivery", "construction", "infrastructure", "energy", "utilities", "renewable energy", "oil and gas", "mining", "telecommunications", "telecom", "agriculture", "agritech", "food manufacturing",
      "safety", "workplace safety", "occupational safety", "industrial safety", "ehs", "hse", "osha", "compliance", "risk management", "hazard", "hazardous materials", "emergency response", "incident reporting", "security training", "safety training", "equipment training", "technical training", "field service",
    ],
  },
  {
    value: "places_experiences",
    keywords: [
      "travel", "tourism", "hospitality", "hotel", "hotels", "resort", "restaurant", "restaurants", "airline", "airport", "destination", "vacation", "trip", "tour", "tour guide", "travel agency", "travel agent", "concierge", "guest services", "booking",
      "events", "event", "conference", "conferences", "convention", "trade show", "expo", "exhibition", "festival", "venue", "event planning", "event management", "ticketing", "visitor", "visitors", "visitor experience",
      "museum", "museums", "gallery", "art gallery", "library", "libraries", "archive", "archives", "archivist", "history", "historical", "heritage", "culture", "cultural", "cultural heritage", "art", "arts", "theater", "theatre", "performing arts", "music", "entertainment", "media", "film", "movie", "television", "tv", "broadcasting", "journalism", "news", "podcast", "podcasting", "youtube", "content creator", "gaming", "game", "sports", "sports venue", "stadium", "theme park", "attraction", "tourist attraction", "zoo", "aquarium", "park", "recreation", "visitor center", "campus tour", "virtual tour", "real estate tour",
      "knowledge", "knowledge management", "knowledge base", "information center", "research", "researcher", "science communication", "expert knowledge", "institutional knowledge", "documentation", "reference", "faq", "information", "education outreach",
    ],
  },
]

const broadSectorKeywords = new Set(["customer", "client", "business", "company", "organization", "employee", "staff", "health", "community", "technology", "industry", "event", "visitor", "knowledge", "information", "research"])

const purposeRules: Rule[] = [
  {
    value: "information",
    keywords: [
      "answer", "answers", "question", "questions", "faq", "faqs", "explain", "explanation", "clarify", "clarification", "information", "inform", "tell me", "what is", "what are", "how does", "how do", "why", "understand", "understanding", "describe", "definition", "define", "educate", "knowledge", "knowledge base", "help desk", "information desk", "respond", "response", "inquiry", "inquiries", "common questions", "frequently asked questions", "policy questions", "product questions", "service questions", "course questions", "patient questions", "customer questions", "employee questions", "student questions", "provide information", "give information", "explain concepts", "explain policies", "explain procedures", "explain products", "explain services", "answer visitors", "answer customers", "answer students", "answer patients", "answer employees", "instant answers", "answer customer questions", "answer faqs", "help people understand", "provide information", "explain our policies",
    ],
  },
  {
    value: "guidance",
    keywords: [
      "guide", "guidance", "walk through", "walkthrough", "step by step", "steps", "process", "procedure", "workflow", "onboarding", "onboard", "orientation", "setup", "set up", "getting started", "registration", "register", "application", "apply", "sign up", "signup", "enrollment", "enroll", "check in", "intake", "form", "forms", "form completion", "documentation", "documents", "instructions", "instruction", "navigate", "navigation", "next step", "next steps", "complete a process", "finish application", "submit", "submission", "account setup", "employee onboarding", "customer onboarding", "student onboarding", "patient onboarding", "new hire", "new employee", "new customer", "new student", "new patient", "orientation guide", "process guide", "setup guide", "implementation", "installation", "activation", "booking process", "appointment process", "admission process", "checkout process", "claims process", "approval process", "guide customers through checkout", "onboard new employees", "walk students through enrollment", "help patients complete intake", "show users what to do next",
    ],
  },
  {
    value: "recommendation",
    keywords: [
      "recommend", "recommendation", "recommendations", "suggest", "suggestion", "suggestions", "find", "match", "matching", "choose", "choice", "select", "selection", "compare", "comparison", "best option", "right option", "personalized recommendation", "product recommendation", "service recommendation", "resource recommendation", "course recommendation", "present", "presentation", "showcase", "show", "display", "demonstrate", "demo", "demonstration", "introduce", "pitch", "sales", "sell", "selling", "convert", "conversion", "lead", "leads", "lead generation", "lead qualification", "qualify", "prospect", "prospects", "customer acquisition", "book a demo", "book consultation", "book appointment", "schedule consultation", "call to action", "cta", "upsell", "cross sell", "product discovery", "product finder", "service finder", "solution finder", "personalized offers", "promote", "promotion", "marketing", "campaign", "visitor conversion", "sales assistant", "sales representative", "virtual salesperson", "product advisor", "recommend the right product", "help customers choose", "present our services", "convert visitors into leads", "qualify prospects", "book more consultations",
    ],
  },
  {
    value: "training",
    keywords: [
      "teach", "teaching", "teacher", "train", "training", "trainer", "learn", "learning", "education", "educate", "instruction", "instructor", "lesson", "lessons", "course", "courses", "tutorial", "tutorials", "tutor", "tutoring", "coach", "coaching", "practice", "practise", "assessment", "assess", "test", "testing", "quiz", "quizzes", "exam", "exams", "oral exam", "oral examination", "evaluate", "evaluation", "score", "scoring", "certification", "certification prep", "simulation", "simulate", "role play", "scenario", "training scenario", "skills practice", "skill development", "employee training", "staff training", "student training", "patient education", "customer education", "product training", "compliance training", "safety training", "on the job training", "professional development", "upskill", "upskilling", "reskill", "reskilling", "knowledge check", "practice questions", "mock interview", "interview practice", "exam preparation", "study", "study help", "study support", "learning support", "train employees", "tutor students", "assess learners", "run oral exams", "practice interview questions", "teach customers how to use the product",
    ],
  },
  {
    value: "support",
    keywords: [
      "support", "customer support", "technical support", "help", "assist", "assistance", "troubleshoot", "troubleshooting", "problem", "problems", "issue", "issues", "error", "errors", "fix", "resolve", "resolution", "solve", "solution", "technical issue", "support ticket", "ticket", "tickets", "help desk", "service desk", "it support", "customer service", "complaint", "complaints", "incident", "incident report", "report issue", "diagnose", "diagnostic", "debug", "setup issue", "login issue", "account issue", "billing issue", "payment issue", "delivery issue", "order issue", "device issue", "software issue", "equipment issue", "maintenance", "repair", "escalate", "escalation", "human agent", "live agent", "transfer", "handoff", "human handoff", "contact support", "contact specialist", "contact representative", "urgent", "emergency", "red flag", "alert", "alerts", "notify", "notification", "send to staff", "route request", "route issue", "support request", "service request", "help troubleshoot problems", "resolve customer issues", "send difficult cases to a human", "escalate urgent requests", "provide technical support",
    ],
  },
]

const broadPurposeKeywords = new Set(["answer", "question", "questions", "information", "help", "show", "find", "process", "support", "learn"])

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim()
}

function includesKeyword(text: string, keyword: string): boolean {
  const normalized = normalize(keyword)
  return normalized.length > 0 && ` ${text} `.includes(` ${normalized} `)
}

function score(text: string, keywords: string[]): number {
  return keywords.reduce((total, keyword) => includesKeyword(text, keyword)
    ? total + normalize(keyword).split(" ").length * 20 + keyword.length
    : total, 0)
}

function sectorScore(text: string, keywords: string[]): number {
  return keywords.reduce((total, keyword) => {
    if (!includesKeyword(text, keyword)) return total
    const normalized = normalize(keyword)
    const wordCount = normalized.split(" ").length
    if (broadSectorKeywords.has(normalized)) return total + 1
    if (wordCount >= 3) return total + 5
    if (wordCount === 2) return total + 4
    if (normalized.length <= 3) return total + 3
    return total + 2
  }, 0)
}

function purposeScore(text: string, keywords: string[]): number {
  return keywords.reduce((total, keyword) => {
    if (!includesKeyword(text, keyword)) return total
    const normalized = normalize(keyword)
    const wordCount = normalized.split(" ").length
    if (broadPurposeKeywords.has(normalized)) return total + 1
    if (wordCount >= 3) return total + 5
    if (wordCount === 2) return total + 4
    if (normalized.length <= 3) return total + 3
    return total + 2
  }, 0)
}

function uniqueWinner<T>(rules: T[], getScore: (rule: T) => number): T | null {
  const ranked = rules.map((rule) => ({ rule, score: getScore(rule) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score)
  if (!ranked[0] || (ranked[1] && ranked[0].score === ranked[1].score)) return null
  return ranked[0].rule
}

function domainRules(): Rule[] {
  const choices = Object.values(questionTree).flatMap((node) => node.choices)
  const byDomain = new Map<string, Set<string>>()
  for (const choice of choices) {
    const domain = choice.sets.domain
    if (!domain) continue
    const keywords = byDomain.get(domain) ?? new Set<string>()
    for (const keyword of [choice.label, ...choice.keywords, ...(domainExtras[domain] ?? [])]) keywords.add(keyword)
    byDomain.set(domain, keywords)
  }
  return [...byDomain].map(([value, keywords]) => ({ value, keywords: [...keywords] }))
}

function identityContext(text: string): string {
  const starts = identityPhrases.map((phrase) => ({ phrase, index: text.indexOf(phrase) })).filter(({ index }) => index >= 0).sort((a, b) => a.index - b.index)
  if (!starts[0]) return text
  return text.slice(starts[0].index, starts[0].index + 120).split(/\b(?:and|but|because|while|so that|i want|we need)\b/, 1)[0]
}

function classifyRule(text: string, rules: Rule[]): string | null {
  return uniqueWinner(rules, (rule) => score(text, rule.keywords))?.value ?? null
}

function interactionFor(avatarFunction: string): string {
  if (avatarFunction === "instructor") return "assessment"
  if (avatarFunction === "presenter" || avatarFunction === "information_lead_generation") return "presentation"
  return "guided_chat"
}

export function hasClassificationPhrase(message: string): boolean {
  const text = normalize(message)
  return [...identityPhrases, ...interestPhrases].some((phrase) => includesKeyword(text, phrase))
}

/** Chooses one of the five opening categories by weighted whole-word voting. */
export function classifySectorGroup(message: string): string | null {
  const text = normalize(message)
  return uniqueWinner(sectorGroupRules, (rule) => sectorScore(text, rule.keywords))?.value ?? null
}

/** Chooses one of the five purpose answers by weighted whole-word voting. */
export function classifyPurpose(message: string): string | null {
  const text = normalize(message)
  return uniqueWinner(purposeRules, (rule) => purposeScore(text, rule.keywords))?.value ?? null
}

/** Scores the complete message, but resolves career identity from its identity clause first. */
export function classifyFreeText(message: string): FreeTextClassification {
  const text = normalize(message)
  const identity = identityContext(text)
  const career = uniqueWinner(careerRules, (rule) => score(identity, rule.keywords))
  const domain = career?.domain ?? classifyRule(text, domainRules())
  const audience = classifyRule(text, audienceRules)
  const goal = classifyRule(text, goalRules)
  const avatarFunction = classifyRule(text, functionRules)
  const answers: AnswerSet = {}

  if (domain) answers.domain = domain
  if (career) answers.career = career.value
  if (audience) answers.audience = audience
  if (goal) answers.goal = goal
  if (avatarFunction) {
    answers.avatar_function = avatarFunction
    answers.interaction = interactionFor(avatarFunction)
  }

  return {
    answers,
    matches: {
      career_industry: Boolean(domain),
      audience: Boolean(audience),
      goal_interest: Boolean(goal),
      avatar_function: Boolean(avatarFunction),
    },
  }
}
