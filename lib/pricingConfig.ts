export const EDUCATION_PACKAGES = {
  suite: {
    name: "Teaching + assessment suite",
    minFee: 1500, // VALIDATED_ANCHOR — brief §3.4
    perStudent: 50, // VALIDATED_ANCHOR — brief §3.4
    includesTutor: true,
    includesGrading: true,
  },
  tutor: {
    name: "AI tutor",
    minFee: 1100, // RANGE_MIDPOINT — brief §3.1 ($1,000–$1,200)
    perStudent: 35, // UNVALIDATED_TEST_RANGE — brief §3.1 ($30–$40)
    includesTutor: true,
    includesGrading: false,
  },
  oral: {
    name: "AI oral examiner",
    minFee: 1200, // VALIDATED_ANCHOR — brief §3.2
    perStudent: 40, // TBD_DERIVED — replace after validation
    includesTutor: true,
    includesGrading: false,
  },
  grader: {
    name: "Autograder",
    minFee: 1000, // VALIDATED_ANCHOR — brief §3.3
    perStudent: 33, // TBD_DERIVED — replace after validation
    includesTutor: false,
    includesGrading: true,
  },
} as const

export type EducationPackageId = keyof typeof EDUCATION_PACKAGES

export const ALLOWANCES = {
  sessionsPerStudent: 4,
  submissionsPerStudent: 4,
  pagesPerSubmission: 3,
} as const

export const OVERAGE = {
  perSession: null,
  perSubmission: null,
  perPage: null,
} as const

export const VOLUME_BANDS = null
export const INSTITUTIONAL_TRIGGER = { students: null, contractValue: null } as const
export const COMPLEXITY = {
  standard: 1,
  moderate: null,
  advanced: null,
  enterprise: null,
} as const
export const FX = { AED_PER_USD: 3.67, PEER_TUTOR_AED_PER_HOUR: 40 } as const
export const HUMAN_BASELINE = {
  gradingMinutesPerSubmission: 10,
  tutorSessionHours: 1,
} as const

export const CONSULTANT_PRICING = {
  setupLow: null,
  setupHigh: null,
  monthlyLow: null,
  monthlyHigh: null,
} as const

export const INTERNAL_COMMERCIAL = {
  targetGrossMargin: null,
  partnerMargin: null,
  annualPrepayDiscount: null,
  pilotConversionAssumption: null,
} as const

export const PRICING_CONFIG = {
  educationPackages: EDUCATION_PACKAGES,
  allowances: ALLOWANCES,
  overage: OVERAGE,
  volumeBands: VOLUME_BANDS,
  institutionalTrigger: INSTITUTIONAL_TRIGGER,
  complexity: COMPLEXITY,
  fx: FX,
  humanBaseline: HUMAN_BASELINE,
  consultant: CONSULTANT_PRICING,
  internal: INTERNAL_COMMERCIAL,
} as const

export type PricingConfig = typeof PRICING_CONFIG
