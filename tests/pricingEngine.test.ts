import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { quoteEducation } from "../lib/pricingEngine.ts"

const base = {
  students: 30,
  sessionsPerStudent: 4,
  assignmentsPerStudent: 4,
  pagesPerSubmission: 3,
  semesters: 1,
  courses: 1,
}

describe("education pricing engine", () => {
  it("matches the published suite anchor", () => {
    const quote = quoteEducation({ packageId: "suite", ...base })
    assert.equal(quote.kind, "package")
    if (quote.kind !== "package") return
    assert.equal(quote.total, 1500)
    assert.equal(quote.perStudent, 50)
    assert.equal(quote.included.sessions, 120)
    assert.equal(quote.included.submissions, 120)
    assert.equal(Math.round(quote.capacityHours), 140)
  })

  it("applies the course minimum", () => {
    const quote = quoteEducation({ packageId: "suite", ...base, students: 15 })
    assert.equal(quote.kind, "package")
    if (quote.kind !== "package") return
    assert.equal(quote.total, 1500)
    assert.equal(quote.perStudent, 100)
    assert.equal(quote.notes[0]?.code, "minimum_floor")
    assert.equal(quote.showCapacityComparison, false)
  })

  it("applies the autograder floor", () => {
    const quote = quoteEducation({
      packageId: "grader",
      ...base,
      sessionsPerStudent: 0,
    })
    assert.equal(quote.kind, "package")
    if (quote.kind === "package") assert.equal(quote.total, 1000)
  })

  it("routes the broken 376-student case to institutional pricing", () => {
    const quote = quoteEducation({
      packageId: "suite",
      ...base,
      students: 376,
      sessionsPerStudent: 0,
      pagesPerSubmission: 18,
    })
    assert.equal(quote.kind, "quote_required")
    if (quote.kind !== "quote_required") return
    assert.equal(quote.reason, "institutional")
    assert.equal(quote.suggestion?.packageId, "grader")
  })

  it("treats page volume as a pricing outcome driver", () => {
    const included = quoteEducation({
      packageId: "grader", ...base, sessionsPerStudent: 0,
    })
    const highPages = quoteEducation({
      packageId: "grader", ...base, sessionsPerStudent: 0, pagesPerSubmission: 18,
    })
    assert.equal(included.kind, "package")
    assert.equal(highPages.kind, "quote_required")
    if (highPages.kind === "quote_required") assert.equal(highPages.reason, "overage_unpriced")
  })

  it("rejects a configuration with no usage", () => {
    const quote = quoteEducation({
      packageId: "suite", ...base, sessionsPerStudent: 0, assignmentsPerStudent: 0,
    })
    assert.equal(quote.kind, "quote_required")
    if (quote.kind === "quote_required") assert.equal(quote.reason, "no_usage_configured")
  })
})
