/**
 * Every visitor-facing string, keyed by node and answer, plus the single generic Use Case
 * template. Data only — no branching logic. Nothing here is generated at runtime; the only
 * runtime step is substituting collected answers into the template slots.
 */

export const systemReplies = {
  intro: "Welcome to Myos! We are here to help you make your interest come true!",
  unrecognized: "I didn't quite catch that — pick one of the options below.",
  restart: "Starting over.",
  ready: "Here's a use-case page put together from your answers.",
  /** Used only if a node/choice is missing an entry in `choiceReplies` — a content gap. */
  acknowledged: "Got it.",
} as const

/** The short acknowledgement shown after a choice is taken, keyed by node id then choice id. */
export const choiceReplies: Record<string, Record<string, string>> = {
  sector_group: {
    customer_growth: "Great — let's narrow down the customer-growth area.",
    people_learning: "Great — let's narrow down the learning or people area.",
    public_regulated: "Great — let's narrow down the health, public, or regulated area.",
    industry_technology: "Great — let's narrow down the technology or industrial area.",
    places_experiences: "Great — let's narrow down the property, hospitality, or cultural area.",
  },
  sector_customer_growth: {
    customer_service: "Customer service — understood.",
    sales: "Sales and lead generation — understood.",
    marketing: "Marketing and brand communication — understood.",
    retail: "Retail and e-commerce — understood.",
    events_conferences: "Events and conferences — understood.",
    professional_services: "Professional services — understood.",
  },
  sector_people_learning: {
    education: "Education — understood.",
    employee_training: "Employee training — understood.",
    human_resources: "Human resources — understood.",
    recruitment_career: "Recruitment and career services — understood.",
    productivity_coaching: "Personal productivity and coaching — understood.",
    internal_communication: "Internal organizational communication — understood.",
  },
  sector_public_regulated: {
    healthcare: "Healthcare and patient support — understood.",
    government: "Government and public services — understood.",
    financial_services: "Banking, insurance, and finance — understood.",
    legal: "Legal information — understood.",
    nonprofits_community: "Nonprofits and community organizations — understood.",
    accessibility_inclusion: "Accessibility and inclusion — understood.",
  },
  sector_industry_technology: {
    manufacturing: "Manufacturing and industrial operations — understood.",
    technology: "Technology and software — understood.",
    telecom_utilities: "Telecommunications and utilities — understood.",
    automotive_transport: "Automotive and transportation — understood.",
    research_science: "Research and scientific communication — understood.",
    safety_compliance: "Safety, emergency, and compliance — understood.",
  },
  sector_places_experiences: {
    real_estate: "Real estate and property management — understood.",
    travel_hospitality: "Travel and hospitality — understood.",
    restaurants_food: "Restaurants and food services — understood.",
    entertainment_media: "Entertainment and media — understood.",
    museums_culture: "Museums, culture, and heritage — understood.",
    knowledge_preservation: "Knowledge preservation — understood.",
  },
  purpose: {
    information: "We'll focus on clear explanations and trusted answers.",
    guidance: "We'll focus on guiding people through a process.",
    recommendation: "We'll focus on presenting options and helping people decide.",
    training: "We'll focus on teaching, practice, and assessment.",
    support: "We'll focus on support, troubleshooting, and escalation.",
  },
  scenario_information: {
    faq_information: "FAQs and common questions — selected.",
    product_policy_information: "Product, service, or policy information — selected.",
    status_updates: "Status, updates, and announcements — selected.",
    story_explainer: "Stories, research, and expert knowledge — selected.",
    public_education: "Public education and awareness — selected.",
  },
  scenario_guidance: {
    onboarding_setup: "Onboarding, setup, or activation — selected.",
    process_navigation: "Process or service navigation — selected.",
    booking_preparation: "Booking, check-in, or preparation — selected.",
    documents_forms: "Documents, forms, or checklists — selected.",
    tour_orientation: "Orientation, navigation, or tours — selected.",
  },
  scenario_recommendation: {
    selection_recommendation: "Product or service recommendation — selected.",
    demo_comparison: "Demonstration or comparison — selected.",
    lead_consultation: "Lead qualification or consultation — selected.",
    promotion_conversion: "Promotion, upsell, or call to action — selected.",
    showroom_catalog: "Listing, showroom, or catalog — selected.",
  },
  scenario_training: {
    onboarding_orientation_training: "Onboarding and orientation training — selected.",
    instruction_learning: "Instruction and concept learning — selected.",
    sop_safety_training: "Procedures, safety, and compliance — selected.",
    coaching_simulation: "Coaching, role-play, or simulation — selected.",
    assessment_certification: "Assessment or certification preparation — selected.",
  },
  scenario_support: {
    troubleshooting_support: "Troubleshooting and technical help — selected.",
    request_status_support: "Orders, returns, claims, or requests — selected.",
    intake_eligibility: "Intake, screening, or eligibility — selected.",
    feedback_survey: "Feedback, surveys, or follow-up — selected.",
    escalation_incident: "Escalation, complaints, or incidents — selected.",
  },
  domain: {
    healthcare: "Got it — healthcare.",
    education: "Got it — education.",
    government: "Got it — government.",
    other: "No problem, we'll keep it general.",
  },
  goal_healthcare: {
    intake: "Patient intake it is.",
    recovery: "Recovery guidance it is.",
    staff_training: "Staff training it is.",
    other: "Understood — we'll keep the focus broad.",
  },
  goal_education: {
    student_support: "Student questions it is.",
    oral_exams: "Oral exams it is.",
    course_scale: "Scaling a course it is.",
    other: "Understood — we'll keep the focus broad.",
  },
  goal_government: {
    staff_training: "Staff training it is.",
    certification: "Certification prep it is.",
    citizen_guidance: "Citizen guidance it is.",
    other: "Understood — we'll keep the focus broad.",
  },
  goal_generic: {
    staff_training: "Training and onboarding it is.",
    knowledge: "Answering repeat questions it is.",
    assessment: "Assessments and practice it is.",
    other: "Understood — we'll keep the focus broad.",
  },
  interaction: {
    guided_chat: "A guided conversation will keep each visitor on a clear path.",
    qa: "Questions and answers will make trusted knowledge easy to reach.",
    assessment: "An interactive assessment will make the experience participatory.",
    presentation: "A presenter-led experience will make the information visual and engaging.",
    other: "We'll use a flexible interaction pattern.",
  },
  audience: {
    customers: "Customers and prospects — understood.",
    employees: "Employees and partners — understood.",
    learners: "Learners and candidates — understood.",
    patients: "Patients and caregivers — understood.",
    community: "Citizens, members, and visitors — understood.",
  },
  tone: {
    warm: "Warm and reassuring — understood.",
    professional: "Clear and professional — understood.",
    encouraging: "Encouraging and engaging — understood.",
    conversational: "Natural and conversational — understood.",
    other: "The tone will adapt to each visitor.",
  },
  outcome: {
    access: "Faster access to knowledge is the priority.",
    consistency: "Consistent guidance is the priority.",
    engagement: "Higher engagement is the priority.",
    conversion: "More conversions and completed journeys are the priority.",
    other: "We'll balance access, consistency, and engagement.",
  },
  requirement: {
    multilingual: "Multiple languages will be prioritized.",
    accessible: "Accessible, plain-language delivery will be prioritized.",
    handoff: "Human handoff and escalation will be prioritized.",
    after_hours: "After-hours availability will be prioritized.",
    unsure: "We'll keep the delivery requirements flexible for now.",
  },
}

type IconId = "stethoscope" | "graduation-cap" | "landmark" | "layout-template"
type PageId = "healthcare" | "education" | "government" | "template"

export interface DomainContent {
  label: string
  /** Fills the `{expert}` slot in the headline. */
  expert: string
  lead: string
  escalation: string
  points: string[]
  outcomes: string[]
  image: string
  alt: string
  icon: IconId
  /** Which existing use-case page identity the generated page renders as. */
  pageId: PageId
}

export const domainContent: Record<string, DomainContent> = {
  healthcare: {
    label: "Healthcare",
    expert: "AI doctor",
    lead: "MYO'S AI doctor avatars give patients and staff clear, consistent guidance in the moments between appointments.",
    escalation:
      "Red-flag answers and anything outside approved clinical material are surfaced to a named clinician rather than handled by the avatar.",
    points: [
      "Guidance delivered on video, in the patient's own language",
      "Answers grounded in your approved clinical material",
      "Concerning responses escalate to a real clinician",
    ],
    outcomes: ["Fewer repeat calls", "Faster staff onboarding", "Consistent clinical guidance"],
    image: "/demos/healthcare-demo.png",
    alt: "AI doctor avatar guiding a patient through recovery exercises",
    icon: "stethoscope",
    pageId: "healthcare",
  },
  education: {
    label: "Education",
    expert: "AI professor",
    lead: "MYO'S AI professor avatars extend an instructor's presence well beyond the lecture hall.",
    escalation:
      "Questions the avatar is not approved to answer are routed back to teaching staff with the student's question attached.",
    points: [
      "Explanations that match the course material and the instructor's style",
      "Available across time zones, outside office hours",
      "Connects to Brightspace, Canvas, Moodle and other LMS platforms",
    ],
    outcomes: ["Higher engagement", "Office hours that scale", "Consistent course support"],
    image: "/demos/education-demo.png",
    alt: "AI professor avatar answering a student's question",
    icon: "graduation-cap",
    pageId: "education",
  },
  government: {
    label: "Government",
    expert: "AI public-service trainer",
    lead: "MYO'S AI trainer avatars standardize what every department is told, in every language it needs.",
    escalation:
      "Anything touching a real case, a citizen's record, or an unapproved policy question is handed to a named officer.",
    points: [
      "The same approved guidance in every department and region",
      "Interactive oral practice for certifications and compliance checks",
      "Institutional knowledge preserved across staff turnover",
    ],
    outcomes: ["Standardized delivery", "Faster onboarding", "Knowledge that outlasts turnover"],
    image: "/demos/government-demo.png",
    alt: "AI government training assistant running an oral assessment",
    icon: "landmark",
    pageId: "government",
  },
  generic: {
    label: "Your organization",
    expert: "AI expert",
    lead: "MYO'S AI expert avatars carry your organization's trusted knowledge to the people who need it, on demand.",
    escalation:
      "Anything outside the approved material is handed to a named person on your team instead of being answered.",
    points: [
      "Grounded in the documents and processes you approve",
      "One consistent answer, however often the question is asked",
      "A clear escalation path to a real person",
    ],
    outcomes: ["Consistent expert guidance", "Faster knowledge access", "A scalable experience"],
    image: "/demos/my-graph.png",
    alt: "MYO'S AI knowledge graph illustrating a customizable expert use case",
    icon: "layout-template",
    pageId: "template",
  },
}

function catalogDomain(
  label: string,
  expert: string,
  lead: string,
  image: string,
  icon: IconId = "layout-template",
  escalation = "Anything outside the approved material or requiring human judgment is handed to a named member of the organization.",
): DomainContent {
  return {
    label,
    expert,
    lead,
    escalation,
    points: [
      "Grounded in approved organizational knowledge",
      "Available whenever customers, staff, or visitors need it",
      "A clear escalation path to a real person",
    ],
    outcomes: ["Faster access", "Consistent delivery", "A scalable experience"],
    image,
    alt: `${label} AI avatar use case`,
    icon,
    pageId: "template",
  }
}

Object.assign(domainContent, {
  customer_service: catalogDomain(
    "Customer service",
    "AI customer-service expert",
    "MYO'S AI service avatars answer common questions, guide routine requests, and hand complex cases to the right person.",
    "/demos/human-delivery.png",
  ),
  sales: catalogDomain(
    "Sales and lead generation",
    "AI sales representative",
    "MYO'S AI sales avatars explain offers, qualify interest, and help each visitor take a relevant next step.",
    "/Homepage design.jpg",
  ),
  marketing: catalogDomain(
    "Marketing and brand communication",
    "AI brand presenter",
    "MYO'S AI brand avatars turn campaigns, launches, and stories into interactive, multilingual experiences.",
    "/mission.png",
  ),
  retail: catalogDomain(
    "Retail and e-commerce",
    "AI shopping expert",
    "MYO'S AI retail avatars help shoppers understand, compare, choose, set up, and care for products.",
    "/the Solution.png",
  ),
  employee_training: catalogDomain(
    "Employee training",
    "AI workplace trainer",
    "MYO'S AI trainers deliver onboarding, procedures, safety, compliance, practice, and refreshers consistently across teams.",
    "/demos/education-demo.png",
    "graduation-cap",
  ),
  human_resources: catalogDomain(
    "Human resources",
    "AI people-services guide",
    "MYO'S AI HR avatars make benefits, policies, hiring, development, and internal support easier to navigate.",
    "/demos/human-delivery.png",
  ),
  professional_services: catalogDomain(
    "Professional services",
    "AI professional-services guide",
    "MYO'S AI avatars explain specialist services, prepare consultations, onboard clients, and present projects and proposals.",
    "/demos/my-graph.png",
  ),
  financial_services: catalogDomain(
    "Banking, insurance and financial services",
    "AI financial-information guide",
    "MYO'S AI avatars explain products and processes, support onboarding, and deliver approved financial education.",
    "/demos/government-demo.png",
    "landmark",
    "The avatar provides approved educational information only and routes personalized advice, suitability decisions, and outcome claims to qualified professionals.",
  ),
  legal: catalogDomain(
    "Legal information",
    "AI legal-information guide",
    "MYO'S AI avatars explain general processes, checklists, service options, and approved legal information in accessible language.",
    "/demos/government-demo.png",
    "landmark",
    "The avatar does not impersonate a lawyer or provide unreviewed jurisdiction-specific advice; those requests are escalated to qualified counsel.",
  ),
  manufacturing: catalogDomain(
    "Manufacturing and industrial operations",
    "AI operations trainer",
    "MYO'S AI operations avatars guide assembly, equipment use, maintenance, safety, quality, and incident processes.",
    "/the Solution.png",
  ),
  technology: catalogDomain(
    "Technology and software",
    "AI product expert",
    "MYO'S AI product avatars support onboarding, feature discovery, setup, documentation, troubleshooting, and adoption.",
    "/demos/my-graph.png",
  ),
  telecom_utilities: catalogDomain(
    "Telecommunications and utilities",
    "AI service guide",
    "MYO'S AI service avatars guide setup, activation, billing, troubleshooting, outages, safety, and usage education.",
    "/the Solution.png",
  ),
  automotive_transport: catalogDomain(
    "Automotive and transportation",
    "AI mobility expert",
    "MYO'S AI mobility avatars explain vehicles, guide ownership and service, and train drivers and transport teams.",
    "/demos/human-delivery.png",
  ),
  real_estate: catalogDomain(
    "Real estate and property management",
    "AI property guide",
    "MYO'S AI property avatars present listings, educate buyers and sellers, onboard tenants, and support resident services.",
    "/Homepage design.jpg",
  ),
  travel_hospitality: catalogDomain(
    "Travel and hospitality",
    "AI concierge",
    "MYO'S AI hospitality avatars guide reservations, arrivals, destinations, facilities, activities, safety, and guest services.",
    "/mission.png",
  ),
  restaurants_food: catalogDomain(
    "Restaurants and food services",
    "AI food-service host",
    "MYO'S AI food-service avatars explain menus, dietary information, reservations, ordering, loyalty, and staff training.",
    "/demos/human-delivery.png",
  ),
  entertainment_media: catalogDomain(
    "Entertainment and media",
    "AI media presenter",
    "MYO'S AI media avatars host, narrate, recommend, teach, and create interactive audience experiences.",
    "/Homepage design.jpg",
  ),
  museums_culture: catalogDomain(
    "Museums, culture and heritage",
    "AI cultural guide",
    "MYO'S AI cultural avatars explain collections, host exhibitions, recreate historical voices, and guide multilingual tours.",
    "/mission.png",
  ),
  events_conferences: catalogDomain(
    "Events and conferences",
    "AI event host",
    "MYO'S AI event avatars support registration, agendas, navigation, session discovery, exhibitors, livestreams, and follow-up.",
    "/Homepage design.jpg",
  ),
  recruitment_career: catalogDomain(
    "Recruitment and career services",
    "AI career guide",
    "MYO'S AI career avatars explain roles and culture, guide applications, prepare candidates, and support career exploration.",
    "/demos/human-delivery.png",
  ),
  accessibility_inclusion: catalogDomain(
    "Accessibility and inclusion",
    "accessible AI guide",
    "MYO'S AI avatars make information easier to access through plain language, multilingual delivery, and alternative communication formats.",
    "/demos/human-delivery.png",
  ),
  productivity_coaching: catalogDomain(
    "Personal productivity and coaching",
    "AI coach",
    "MYO'S AI coaching avatars support practice, planning, habits, communication, accountability, and guided personal learning.",
    "/demos/education-demo.png",
    "graduation-cap",
  ),
  nonprofits_community: catalogDomain(
    "Nonprofits and community organizations",
    "AI community guide",
    "MYO'S AI community avatars explain programs, onboard volunteers and members, guide resources, and share impact stories.",
    "/mission.png",
  ),
  research_science: catalogDomain(
    "Research and scientific communication",
    "AI research presenter",
    "MYO'S AI research avatars explain papers, protocols, studies, data, equipment, ethics, and scientific findings.",
    "/demos/my-graph.png",
  ),
  safety_compliance: catalogDomain(
    "Safety, emergency and compliance",
    "AI safety trainer",
    "MYO'S AI safety avatars deliver procedures, preparedness, incident guidance, regulatory education, and certification practice.",
    "/the Solution.png",
  ),
  knowledge_preservation: catalogDomain(
    "Knowledge preservation",
    "AI knowledge avatar",
    "MYO'S AI knowledge avatars preserve expert experience, institutional memory, oral histories, and training content for future access.",
    "/demos/my-graph.png",
  ),
  internal_communication: catalogDomain(
    "Internal organizational communication",
    "AI internal-communications host",
    "MYO'S AI internal avatars deliver leadership messages, policy updates, change guidance, benefits, news, and organizational knowledge.",
    "/Homepage design.jpg",
  ),
})

export interface GoalContent {
  /** Fills `{goalPhrase}` — reads naturally mid-sentence. */
  phrase: string
  /** Fills `{goalShort}` in the link label. */
  short: string
  title: string
  body: string
}

export const goalContent: Record<string, GoalContent> = {
  information: {
    phrase: "explaining information and answering common questions",
    short: "trusted answers",
    title: "Approved answers, available on demand",
    body: "The avatar turns approved product, service, policy, status, or educational material into clear answers people can revisit whenever they need them.",
  },
  guidance: {
    phrase: "guiding onboarding and multi-step processes",
    short: "guided processes",
    title: "A clear next step at every stage",
    body: "The avatar walks people through setup, onboarding, preparation, applications, checklists, navigation, and other repeatable journeys without losing the approved sequence.",
  },
  recommendation: {
    phrase: "presenting options and helping people decide",
    short: "recommendations",
    title: "The right option, explained in context",
    body: "The avatar asks bounded questions, explains relevant products or services, compares approved options, handles common objections, and presents a clear next action.",
  },
  training: {
    phrase: "teaching, training, practice, and assessment",
    short: "training and practice",
    title: "Practice that is available whenever people are",
    body: "The avatar teaches approved material, demonstrates procedures, runs knowledge checks or simulations, and gives consistent feedback across repeated sessions.",
  },
  support: {
    phrase: "supporting requests, troubleshooting, and escalation",
    short: "guided support",
    title: "Routine support resolved; complex cases handed over",
    body: "The avatar gathers the right context, guides approved fixes or requests, explains status and next steps, and escalates exceptions with a structured summary.",
  },
  intake: {
    phrase: "patient intake",
    short: "patient intake",
    title: "Intake that starts before the waiting room",
    body: "Patients answer intake questions with an avatar that explains why each one is being asked, in their own language, before they arrive. Staff receive a structured summary instead of a half-filled form.",
  },
  recovery: {
    phrase: "recovery guidance",
    short: "recovery guidance",
    title: "Guidance that stays available after discharge",
    body: "Discharge instructions, rehabilitation routines and medication guidance can be revisited as often as the patient needs, without waiting for a follow-up call.",
  },
  staff_training: {
    phrase: "staff training",
    short: "staff training",
    title: "The same training, every time it runs",
    body: "New starters and existing staff work through approved material with an avatar that answers follow-up questions, so training does not drift between trainers, sites or shifts.",
  },
  student_support: {
    phrase: "student questions",
    short: "student questions",
    title: "Answers in the instructor's voice",
    body: "Students get explanations drawn from the course materials and the instructor's preferred way of teaching them, at the hour they actually sit down to study.",
  },
  oral_exams: {
    phrase: "oral exams",
    short: "oral exams",
    title: "Oral practice without the scheduling problem",
    body: "Learners rehearse against an examiner avatar as often as they want, and arrive at the real assessment having already spoken the material out loud.",
  },
  course_scale: {
    phrase: "scaling a course",
    short: "course scale",
    title: "More learners without more contact hours",
    body: "The teaching that does not need a human in the room is handled by the avatar, which keeps the instructor's time for the parts that do.",
  },
  certification: {
    phrase: "certification prep",
    short: "certification prep",
    title: "Certification practice on demand",
    body: "Staff prepare for certifications and compliance checks through interactive oral practice, with the approved answer given the same way every time.",
  },
  citizen_guidance: {
    phrase: "citizen guidance",
    short: "citizen guidance",
    title: "One consistent answer at the front desk",
    body: "Common enquiries are answered from approved public guidance, in multiple languages, so officers spend their time on the cases that genuinely need judgment.",
  },
  knowledge: {
    phrase: "answering repeat questions",
    short: "repeat questions",
    title: "The question you answer fifty times a week",
    body: "The avatar handles the questions your team already knows the answer to, drawn from your approved material, and hands over anything it has not been given an answer for.",
  },
  assessment: {
    phrase: "assessments and practice",
    short: "assessments",
    title: "Practice that is available whenever people are",
    body: "People rehearse against an avatar as often as they need, and the approved answer is delivered identically on the first attempt and the fiftieth.",
  },
  general: {
    phrase: "the work you described",
    short: "a custom brief",
    title: "Shaped around your brief",
    body: "The starting point is your approved knowledge, the people who need it, and the moment they need it. Everything else — avatar, tone, languages, escalation path — is configured around that.",
  },
}

function scenarioGoal(
  phrase: string,
  short: string,
  title: string,
  body: string,
): GoalContent {
  return { phrase, short, title, body }
}

Object.assign(goalContent, {
  faq_information: scenarioGoal(
    "answering frequently asked questions",
    "FAQs and common questions",
    "A trusted answer to every common question",
    "The avatar answers repeat questions from approved material and routes anything outside that material to the appropriate human owner.",
  ),
  product_policy_information: scenarioGoal(
    "explaining products, services, and policies",
    "product and policy information",
    "Complex information, explained clearly",
    "Visitors can explore approved features, terms, policies, benefits, and service information in a consistent, conversational format.",
  ),
  status_updates: scenarioGoal(
    "sharing status, updates, and announcements",
    "status and updates",
    "The latest approved update, on demand",
    "The avatar communicates order or case status, outages, releases, policy changes, and announcements without creating unsupported claims.",
  ),
  story_explainer: scenarioGoal(
    "presenting stories, research, and expert knowledge",
    "stories and expert knowledge",
    "Knowledge people can explore, not just read",
    "Research, expert experience, case studies, heritage, and organizational stories become guided explanations with clear paths for deeper exploration.",
  ),
  public_education: scenarioGoal(
    "delivering public education and awareness",
    "public education",
    "Approved education with broader reach",
    "The avatar makes public-interest, health, rights, safety, literacy, and awareness information easier to understand and revisit.",
  ),
  onboarding_setup: scenarioGoal(
    "guiding onboarding, setup, and activation",
    "onboarding and setup",
    "A confident start from the first step",
    "New customers, employees, members, or users move through an approved setup journey with explanations at each decision point.",
  ),
  process_navigation: scenarioGoal(
    "guiding processes and service navigation",
    "process navigation",
    "A clear route through a complex process",
    "The avatar breaks applications, services, claims, platforms, and institutional processes into understandable, ordered steps.",
  ),
  booking_preparation: scenarioGoal(
    "supporting booking, check-in, and preparation",
    "booking and preparation",
    "Arrive prepared and ready for the next step",
    "Visitors receive the right booking, registration, check-in, appointment, or procedure guidance before the moment of service.",
  ),
  documents_forms: scenarioGoal(
    "guiding documents, forms, and checklists",
    "documents and forms",
    "Every requirement explained before submission",
    "The avatar explains required documents and walks through approved forms and checklists without making eligibility decisions itself.",
  ),
  tour_orientation: scenarioGoal(
    "providing orientation, navigation, and tours",
    "orientation and tours",
    "A guide that is always ready to show the way",
    "Sites, venues, facilities, stores, campuses, destinations, and collections become guided experiences available in the visitor's chosen path.",
  ),
  selection_recommendation: scenarioGoal(
    "helping people select products or services",
    "selection and recommendations",
    "Relevant options without the overwhelm",
    "The avatar asks bounded questions and presents relevant approved choices, comparisons, and next steps without inventing suitability claims.",
  ),
  demo_comparison: scenarioGoal(
    "demonstrating and comparing options",
    "demos and comparisons",
    "See the difference before deciding",
    "Features, products, software, vehicles, portfolios, and proposals are presented visually with approved comparisons and follow-up paths.",
  ),
  lead_consultation: scenarioGoal(
    "qualifying interest and preparing consultations",
    "lead and consultation preparation",
    "A better-prepared conversation for both sides",
    "The avatar gathers approved qualification details, explains services, and prepares a structured handoff for the sales or specialist team.",
  ),
  promotion_conversion: scenarioGoal(
    "presenting promotions and calls to action",
    "promotion and conversion",
    "A clear, relevant next action",
    "Campaigns, launches, offers, donations, upsells, and follow-up journeys are explained with an appropriate, measurable next step.",
  ),
  showroom_catalog: scenarioGoal(
    "hosting listings, showrooms, and catalogs",
    "showrooms and catalogs",
    "Explore the catalog through a guided host",
    "The avatar presents approved listings, exhibits, developments, and catalogs while helping visitors focus on relevant details.",
  ),
  onboarding_orientation_training: scenarioGoal(
    "delivering onboarding and orientation training",
    "onboarding training",
    "The same strong start for every new joiner",
    "New employees, learners, volunteers, and teams receive consistent orientation with questions, checks, and escalation built in.",
  ),
  instruction_learning: scenarioGoal(
    "teaching concepts and guided learning",
    "instruction and learning",
    "Expert instruction that stays available",
    "The avatar teaches approved concepts, demonstrates worked examples, supports practice, and directs learners back to human educators when needed.",
  ),
  sop_safety_training: scenarioGoal(
    "teaching procedures, safety, and compliance",
    "procedure and safety training",
    "Approved procedures, delivered consistently",
    "SOPs, equipment, safety, compliance, privacy, cybersecurity, and emergency material are taught without drift between sessions or locations.",
  ),
  coaching_simulation: scenarioGoal(
    "running coaching, role-play, and simulations",
    "coaching and simulation",
    "Practice the conversation before it matters",
    "Learners rehearse interviews, customer scenarios, conflict resolution, presentations, language, and expert decisions in a repeatable setting.",
  ),
  assessment_certification: scenarioGoal(
    "supporting assessment and certification preparation",
    "assessment and certification",
    "Practice, check, and prepare with confidence",
    "The avatar runs approved quizzes, oral practice, skills checks, and certification preparation while keeping formal decisions with authorized assessors.",
  ),
  troubleshooting_support: scenarioGoal(
    "providing troubleshooting and technical help",
    "troubleshooting support",
    "Resolve the repeatable issue; escalate the exception",
    "The avatar diagnoses only within an approved troubleshooting tree, guides safe fixes, and hands unresolved cases over with context.",
  ),
  request_status_support: scenarioGoal(
    "supporting orders, returns, claims, and requests",
    "request and status support",
    "Every request has a clear next step",
    "The avatar explains approved status, requirements, returns, warranties, claims, transfers, and service-request processes.",
  ),
  intake_eligibility: scenarioGoal(
    "collecting intake, screening, and eligibility information",
    "intake and eligibility",
    "Structured intake before human review",
    "The avatar collects the approved facts needed for intake or screening and clearly separates information gathering from final professional decisions.",
  ),
  feedback_survey: scenarioGoal(
    "collecting feedback, surveys, and follow-up",
    "feedback and follow-up",
    "Turn every response into usable feedback",
    "The avatar guides consistent surveys and follow-up questions, increasing completion while preserving the wording the organization approved.",
  ),
  escalation_incident: scenarioGoal(
    "handling escalation, complaints, and incidents",
    "escalation and incidents",
    "A calm path from issue to the right human",
    "The avatar gathers a structured account, provides approved immediate guidance, and routes complaints, incidents, hazards, or crises to the correct team.",
  ),
})

export interface ScaleContent {
  /** Fills `{scalePhrase}`. */
  phrase: string
  body: string
}

export const scaleContent: Record<string, ScaleContent> = {
  team: {
    phrase: "a small team",
    body: "At this size a single avatar and one approved knowledge set is usually enough. Deployments of this shape typically go live in weeks, not quarters.",
  },
  department: {
    phrase: "a single department",
    body: "A department-wide rollout usually means one avatar per function and a shared escalation path, so answers stay consistent while ownership stays local.",
  },
  organization: {
    phrase: "an entire organization",
    body: "Organization-wide rollouts are staged: one group proves the material and the escalation rules, then the same approved knowledge is extended outward without rewriting it each time.",
  },
  unsure: {
    phrase: "a pilot group to start",
    body: "Starting with a pilot group is the usual answer. One team, one clearly bounded set of questions, and a decision point once there is real usage to look at.",
  },
}

export interface InteractionContent {
  phrase: string
  body: string
}

export const interactionContent: Record<string, InteractionContent> = {
  guided_chat: {
    phrase: "a guided, step-by-step conversation",
    body: "Visitors move through a clear sequence of preset choices, with each next step selected by the approved logic tree.",
  },
  qa: {
    phrase: "focused questions and answers",
    body: "Visitors ask from a bounded set of common questions and receive consistent, prewritten guidance grounded in approved material.",
  },
  assessment: {
    phrase: "an interactive assessment",
    body: "Visitors answer prompts, practise decisions, and receive immediate structured feedback from the AI expert.",
  },
  presentation: {
    phrase: "a presenter-led visual experience",
    body: "An avatar hosts the experience, walks through approved material, and gives visitors clear choices for what to explore next.",
  },
  general: {
    phrase: "a flexible guided interaction",
    body: "The experience combines selectable paths and bounded free text while keeping every response within approved content.",
  },
}

export interface ToneContent {
  phrase: string
  body: string
}

export const toneContent: Record<string, ToneContent> = {
  warm: {
    phrase: "warm and reassuring",
    body: "Language is calm, empathetic, and supportive while remaining precise and transparent.",
  },
  professional: {
    phrase: "clear and professional",
    body: "Language is concise, authoritative, and suitable for formal organizational communication.",
  },
  encouraging: {
    phrase: "encouraging and engaging",
    body: "Language motivates visitors to continue, participate, and build confidence through each step.",
  },
  conversational: {
    phrase: "natural and conversational",
    body: "Language feels approachable and human while staying bounded by the organization's approved claims and guidance.",
  },
  adaptive: {
    phrase: "adapted to the visitor",
    body: "Language stays clear and respectful, adjusting its warmth and detail to the selected path.",
  },
}

export interface OutcomeContent {
  phrase: string
  body: string
  highlights: string[]
}

export const outcomeContent: Record<string, OutcomeContent> = {
  access: {
    phrase: "faster access to trusted knowledge",
    body: "Success means visitors reach an approved answer quickly, without waiting for an expert to become available.",
    highlights: ["Faster knowledge access", "Shorter response times", "Always-available guidance"],
  },
  consistency: {
    phrase: "more consistent guidance",
    body: "Success means every visitor receives the same approved explanation, regardless of time, location, or channel.",
    highlights: ["Consistent guidance", "Standardized delivery", "Clear escalation paths"],
  },
  engagement: {
    phrase: "higher visitor engagement",
    body: "Success means more visitors participate, complete the experience, and retain the guidance they receive.",
    highlights: ["Higher engagement", "Better completion", "More active learning"],
  },
  conversion: {
    phrase: "more completed journeys and conversions",
    body: "Success means more visitors understand the next step, complete the process, and take an appropriate action.",
    highlights: ["More completed journeys", "Clearer next actions", "Higher conversion"],
  },
  balanced: {
    phrase: "a balanced improvement across the experience",
    body: "Success combines faster access, consistent delivery, and an interaction visitors want to complete.",
    highlights: ["Faster access", "Consistent delivery", "Stronger engagement"],
  },
}

export interface AudienceContent {
  phrase: string
  body: string
}

export const audienceContent: Record<string, AudienceContent> = {
  customers: {
    phrase: "customers and prospects",
    body: "The journey is designed for people evaluating, buying, using, or seeking help with the organization's products and services.",
  },
  employees: {
    phrase: "employees and partners",
    body: "The journey assumes an internal or partner audience that needs approved knowledge, repeatable processes, and a clear route to expert support.",
  },
  learners: {
    phrase: "learners and candidates",
    body: "The journey supports explanation, practice, confidence, and preparation while keeping formal decisions with educators or assessors.",
  },
  patients: {
    phrase: "patients and caregivers",
    body: "The journey prioritizes clarity, reassurance, accessibility, and clinician escalation without diagnosing or prescribing.",
  },
  community: {
    phrase: "citizens, members, and visitors",
    body: "The journey makes approved public, community, membership, venue, and visitor information easier to navigate across languages and access needs.",
  },
}

export interface RequirementContent {
  phrase: string
  body: string
}

export const requirementContent: Record<string, RequirementContent> = {
  multilingual: {
    phrase: "multilingual delivery",
    body: "Approved content is prepared for consistent delivery across the languages the organization supports.",
  },
  accessible: {
    phrase: "accessible, plain-language delivery",
    body: "The experience prioritizes clear structure, plain language, and compatibility with the selected accessibility formats.",
  },
  handoff: {
    phrase: "human handoff and escalation",
    body: "Every bounded automated path includes an explicit trigger and destination for a qualified human handoff.",
  },
  after_hours: {
    phrase: "after-hours availability",
    body: "The avatar keeps approved guidance available outside staffed hours and clearly communicates when human follow-up will occur.",
  },
  flexible: {
    phrase: "a flexible delivery plan",
    body: "Language, accessibility, availability, and escalation requirements can be finalized during the pilot design.",
  },
}

/**
 * The single generic template. Domains differ only in what is substituted into these slots —
 * this template is never forked per domain.
 */
export const useCaseTemplate = {
  headline: "{headline}",
  summary: "{lead} {briefSummary} It helps {audiencePhrase} through {interactionPhrase}, delivered in a {tonePhrase} voice, to achieve {outcomePhrase}.",
  label: "{domainLabel} — {goalShort}",
  sections: [
    { title: "What you told us", body: "{context}" },
    { title: "{goalTitle}", body: "{goalBody}" },
    { title: "Who it serves", body: "{audienceBody}" },
    { title: "How visitors interact", body: "{interactionBody}" },
    { title: "How it should sound", body: "{toneBody}" },
    { title: "The outcome to optimize", body: "{outcomeBody}" },
    { title: "Delivery priority: {requirementPhrase}", body: "{requirementBody}" },
    { title: "Where a human steps in", body: "{escalation}" },
  ],
} as const

/** Two prewritten variants of the `{context}` slot — the choice between them is made in code. */
export const contextContent = {
  withNote:
    'You described it as: "{note}" — the rest of this page is built from that, plus the answers you picked.',
  withoutNote:
    "You selected {domainLabel}, focused on {goalPhrase} for {audiencePhrase}, using {interactionPhrase} in a {tonePhrase} voice to achieve {outcomePhrase} with {requirementPhrase}.",
} as const
