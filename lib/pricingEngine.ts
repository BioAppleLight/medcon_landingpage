import {
  PRICING_CONFIG,
  type EducationPackageId,
  type PricingConfig,
} from "./pricingConfig.ts"

export type QuoteReason =
  | "institutional"
  | "overage_unpriced"
  | "no_usage_configured"
  | "package_mismatch"
  | "outside_published_packaging"
  | "pricing_pending_validation"

export type PackageSuggestion = {
  packageId: EducationPackageId
  name: string
  price: number
}

export type Notice = { code: string; message: string }
export type Line = { label: string; amount: number }
export type Capacity = {
  sessions: number
  submissions: number
  pages: number
}

export type PackageQuote = {
  kind: "package"
  packageId: EducationPackageId
  packageName: string
  total: number
  perStudent: number
  lines: Line[]
  included: Capacity
  notes: Notice[]
  capacityHours: number
  capacityValueAED: number
  priceAED: number
  showCapacityComparison: boolean
}

export type Quote =
  | PackageQuote
  | {
      kind: "range"
      setupLow: number
      setupHigh: number
      monthlyLow: number
      monthlyHigh: number
      notes: Notice[]
    }
  | {
      kind: "quote_required"
      reason: QuoteReason
      suggestion?: PackageSuggestion
    }

export type EducationInputs = {
  packageId: EducationPackageId
  students: number
  sessionsPerStudent: number
  assignmentsPerStudent: number
  pagesPerSubmission: number
  semesters: number
  courses: number
  tutorHourlyRateAED?: number
  gradingMinutesPerSubmission?: number
}

const positive = (value: number) => Math.max(0, value)

function suggestionFor(
  inputs: EducationInputs,
  config: PricingConfig,
): PackageSuggestion | undefined {
  const id = inputs.sessionsPerStudent === 0 ? "grader" : "tutor"
  const pkg = config.educationPackages[id]
  return { packageId: id, name: pkg.name, price: pkg.minFee }
}

export function quoteEducation(
  inputs: EducationInputs,
  config: PricingConfig = PRICING_CONFIG,
): Quote {
  const pkg = config.educationPackages[inputs.packageId]
  const students = Math.max(1, Math.round(inputs.students))
  const courses = Math.max(1, Math.round(inputs.courses))
  const semesters = Math.max(1, Math.round(inputs.semesters))
  const sessions = positive(inputs.sessionsPerStudent)
  const assignments = positive(inputs.assignmentsPerStudent)
  const pages = Math.max(1, inputs.pagesPerSubmission)

  if (sessions === 0 && assignments === 0) {
    return { kind: "quote_required", reason: "no_usage_configured" }
  }

  const mismatch =
    (pkg.includesTutor && sessions === 0) ||
    (pkg.includesGrading && assignments === 0)
  const suggestion = mismatch ? suggestionFor(inputs, config) : undefined

  // With volume bands still TBD, the published min-fee/per-student crossover is the
  // largest safely priceable pilot. Larger cohorts route to institutional quoting.
  const publishedPilotLimit = Math.floor(pkg.minFee / pkg.perStudent)
  if (config.volumeBands === null && students > publishedPilotLimit) {
    return { kind: "quote_required", reason: "institutional", suggestion }
  }

  if (mismatch) {
    return { kind: "quote_required", reason: "package_mismatch", suggestion }
  }

  const extraSessions = pkg.includesTutor
    ? students * positive(sessions - config.allowances.sessionsPerStudent)
    : 0
  const extraSubmissions = pkg.includesGrading
    ? students * positive(assignments - config.allowances.submissionsPerStudent)
    : 0
  const totalSubmissions = pkg.includesGrading ? students * assignments : 0
  const extraPages = totalSubmissions * positive(pages - config.allowances.pagesPerSubmission)

  if (
    (extraSessions > 0 && config.overage.perSession === null) ||
    (extraSubmissions > 0 && config.overage.perSubmission === null) ||
    (extraPages > 0 && config.overage.perPage === null)
  ) {
    return { kind: "quote_required", reason: "overage_unpriced", suggestion }
  }

  const unitBase = Math.max(pkg.minFee, students * pkg.perStudent)
  const floorBinds = pkg.minFee > students * pkg.perStudent
  const multiplier = courses * semesters
  const total = unitBase * multiplier
  const includedSessions = pkg.includesTutor
    ? students * Math.min(sessions, config.allowances.sessionsPerStudent) * multiplier
    : 0
  const includedSubmissions = pkg.includesGrading
    ? students * Math.min(assignments, config.allowances.submissionsPerStudent) * multiplier
    : 0
  const includedPages = includedSubmissions * Math.min(pages, config.allowances.pagesPerSubmission)
  const tutorHours = includedSessions * config.humanBaseline.tutorSessionHours
  const gradingHours =
    (includedSubmissions *
      (inputs.gradingMinutesPerSubmission ??
        config.humanBaseline.gradingMinutesPerSubmission)) /
    60
  const capacityHours = tutorHours + gradingHours
  const capacityValueAED =
    capacityHours * (inputs.tutorHourlyRateAED ?? config.fx.PEER_TUTOR_AED_PER_HOUR)
  const priceAED = total * config.fx.AED_PER_USD

  if (capacityValueAED < priceAED && !floorBinds) {
    return {
      kind: "quote_required",
      reason: "outside_published_packaging",
      suggestion,
    }
  }

  return {
    kind: "package",
    packageId: inputs.packageId,
    packageName: pkg.name,
    total,
    perStudent: total / (students * multiplier),
    lines: [
      { label: "Base package", amount: total },
      { label: "Additional capacity", amount: 0 },
    ],
    included: {
      sessions: includedSessions,
      submissions: includedSubmissions,
      pages: includedPages,
    },
    notes: floorBinds
      ? [{ code: "minimum_floor", message: `The $${pkg.minFee.toLocaleString()} course minimum applies.` }]
      : [
          {
            code: "enrolment_pricing",
            message: `Priced on enrolment, above the $${pkg.minFee.toLocaleString()} course minimum.`,
          },
        ],
    capacityHours,
    capacityValueAED,
    priceAED,
    showCapacityComparison: capacityValueAED >= priceAED,
  }
}

export type AutomationInputs = {
  workflows: number
  runsPerMonth: number
  minutesSavedPerRun: number
  failureReviewRate: number
  loadedLaborCost: number
  integrations: number
}

export function calculateAutomationValue(inputs: AutomationInputs) {
  const hoursSaved =
    inputs.workflows *
    inputs.runsPerMonth *
    inputs.minutesSavedPerRun *
    (1 - inputs.failureReviewRate / 100) /
    60
  return { hoursSaved, capacityValue: hoursSaved * inputs.loadedLaborCost }
}

export function quoteConsultant(config: PricingConfig = PRICING_CONFIG): Quote {
  const { setupLow, setupHigh, monthlyLow, monthlyHigh } = config.consultant
  if (
    setupLow === null || setupHigh === null ||
    monthlyLow === null || monthlyHigh === null
  ) {
    return { kind: "quote_required", reason: "pricing_pending_validation" }
  }
  return {
    kind: "range",
    setupLow,
    setupHigh,
    monthlyLow,
    monthlyHigh,
    notes: [],
  }
}
