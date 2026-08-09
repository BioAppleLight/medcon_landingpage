import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  audienceContent,
  domainContent,
  goalContent,
  interactionContent,
  outcomeContent,
  requirementContent,
  toneContent,
} from "../lib/preset-content.ts"
import { questionTree } from "../lib/question-tree.ts"
import type { AnswerSet } from "../lib/types.ts"
import {
  buildUseCasePage,
  createPageRef,
  decodeUseCaseSlug,
  encodeUseCaseAnswers,
  getUseCase,
  getDomainLabel,
  getPersonalizedPresentation,
  personalizedImageLibrary,
  selectUseCaseImage,
  useCases,
} from "../lib/use-cases.ts"

const complete: AnswerSet = {
  domain: "healthcare",
  goal: "faq_information",
  audience: "patients",
  interaction: "guided_chat",
  tone: "warm",
  outcome: "access",
  requirement: "handoff",
}

describe("the slug", () => {
  it("round-trips an answer set without loss", () => {
    const answers: AnswerSet = { ...complete, note: "we run a small clinic" }
    const decoded = decodeUseCaseSlug(encodeUseCaseAnswers(answers))

    assert.deepEqual(decoded, answers)
  })

  it("round-trips without a note", () => {
    assert.deepEqual(decodeUseCaseSlug(encodeUseCaseAnswers(complete)), complete)
  })

  it("stays a reasonable length", () => {
    const slug = encodeUseCaseAnswers({ ...complete, note: "x".repeat(200) })
    assert.ok(slug.length < 360, `slug was ${slug.length} characters`)
  })

  it("returns null for a malformed slug instead of throwing", () => {
    for (const slug of ["c-garbage", "c-", "c-!!!!", "not-a-slug", ""]) {
      assert.equal(decodeUseCaseSlug(slug), null, `accepted ${slug}`)
    }
  })

  it("rejects non-canonical and oversized slug payloads", () => {
    const valid = encodeUseCaseAnswers(complete)

    assert.equal(decodeUseCaseSlug(`${valid}!`), null)
    assert.equal(decodeUseCaseSlug(`c-${"a".repeat(600)}`), null)
  })

  it("returns null when a required answer is missing from the payload", () => {
    const slug = `c-${Buffer.from(JSON.stringify({ d: "healthcare" }), "utf-8").toString("base64url")}`
    assert.equal(decodeUseCaseSlug(slug), null)
  })
})

describe("building the page", () => {
  it("exposes the approved industry label for dynamic navigation", () => {
    assert.equal(getDomainLabel("healthcare"), "Healthcare")
    assert.equal(getDomainLabel("events_conferences"), "Events and conferences")
    assert.equal(getDomainLabel("not-real"), null)
  })

  it("fills every template slot", () => {
    const page = buildUseCasePage(complete)
    assert.ok(page)

    const rendered = [
      page.headline,
      page.summary,
      ...page.pageSections.flatMap((section) => [section.title, section.body]),
    ]

    for (const text of rendered) {
      assert.doesNotMatch(text, /\{\w+\}/, `unresolved slot in: ${text}`)
      assert.ok(text.trim().length > 0)
    }
  })

  it("uses one template for every domain, differing only in content", () => {
    const shapes = Object.keys(domainContent).map((domain) => {
      const page = buildUseCasePage({ ...complete, domain })
      assert.ok(page)
      return page.pageSections.length
    })

    assert.equal(new Set(shapes).size, 1, "the template was forked per domain")
  })

  it("returns null rather than a half-built page when an answer is missing", () => {
    assert.equal(buildUseCasePage({ domain: "healthcare" }), null)
    assert.equal(buildUseCasePage({ domain: "healthcare", goal: "intake" }), null)
    assert.equal(buildUseCasePage({}), null)
  })

  it("falls back to the generic branch for an unknown answer value", () => {
    const page = buildUseCasePage({
      domain: "unknown",
      goal: "unknown",
      audience: "unknown",
      interaction: "unknown",
      tone: "unknown",
      outcome: "unknown",
      requirement: "unknown",
    })

    assert.ok(page)
    assert.equal(page.id, "template")
    assert.equal(page.label, `${domainContent.generic.label} · a custom brief`)
  })

  it("renders the visitor's own words as safe plain text", () => {
    const page = buildUseCasePage({
      ...complete,
      note: "<script>alert('x')</script> a clinic",
    })

    assert.ok(page)
    const rendered = [
      page.headline,
      page.summary,
      ...page.pageSections.map((section) => section.body),
    ].join(" ")
    assert.match(rendered, /a clinic/)
    assert.doesNotMatch(rendered, /[<>]/)
  })

  it("uses a recognized free-text question in the visible page headline", () => {
    const page = buildUseCasePage({
      ...complete,
      note: "help patients understand recovery exercises",
    })

    assert.ok(page)
    assert.match(page.headline, /help patients understand recovery exercises/)
    assert.match(page.summary, /visitor's question/)
  })

  it("keeps a personalized page shaped exactly like a static one", () => {
    const page = buildUseCasePage(complete)
    const staticPage = useCases[0]
    assert.ok(page)

    assert.deepEqual(Object.keys(page).sort(), Object.keys(staticPage).sort())
    assert.ok(useCases.some((useCase) => useCase.id === page.id))
    assert.ok(useCases.some((useCase) => useCase.icon === page.icon))
  })

  it("has content for every answer the tree can produce", () => {
    for (const node of Object.values(questionTree)) {
      for (const choice of node.choices) {
        if (choice.sets.domain) assert.ok(domainContent[choice.sets.domain], choice.sets.domain)
        if (choice.sets.goal) assert.ok(goalContent[choice.sets.goal], choice.sets.goal)
        if (choice.sets.audience) {
          assert.ok(audienceContent[choice.sets.audience], choice.sets.audience)
        }
        if (choice.sets.interaction) {
          assert.ok(interactionContent[choice.sets.interaction], choice.sets.interaction)
        }
        if (choice.sets.tone) assert.ok(toneContent[choice.sets.tone], choice.sets.tone)
        if (choice.sets.outcome) assert.ok(outcomeContent[choice.sets.outcome], choice.sets.outcome)
        if (choice.sets.requirement) {
          assert.ok(requirementContent[choice.sets.requirement], choice.sets.requirement)
        }
      }
    }
  })

  it("selects a page image from the predefined library using visitor answers", () => {
    assert.equal(
      selectUseCaseImage({ ...complete, goal: "assessment", interaction: "assessment" }),
      personalizedImageLibrary.assessment,
    )
    assert.equal(
      selectUseCaseImage({ ...complete, interaction: "qa" }),
      personalizedImageLibrary.qa,
    )
    assert.equal(
      selectUseCaseImage({ ...complete, goal: "staff_training", interaction: "guided_chat", outcome: "engagement" }),
      personalizedImageLibrary.guided_chat,
    )
    assert.equal(selectUseCaseImage(complete), personalizedImageLibrary.qa)
  })

  it("derives page-level headings and CTA copy from the same answers", () => {
    const slug = encodeUseCaseAnswers(complete)
    const presentation = getPersonalizedPresentation(slug)

    assert.ok(presentation)
    assert.match(presentation.eyebrow, /Healthcare/)
    assert.match(presentation.howItWorksTitle, /warm and reassuring/)
    assert.match(presentation.howItWorksTitle, /faster access/)
    assert.match(presentation.ctaBody, /guided, step-by-step conversation/)
  })
})

describe("the page reference", () => {
  it("points at a URL that resolves back to the same page", () => {
    const ref = createPageRef(complete)
    assert.ok(ref)

    assert.equal(ref.url, `/use-cases/template?brief=${ref.slug}`)
    assert.equal(ref.label, "Healthcare — FAQs and common questions")
    assert.deepEqual(getUseCase(ref.slug), buildUseCasePage(complete))
  })

  it("returns null when the answers cannot build a page", () => {
    assert.equal(createPageRef({ domain: "healthcare" }), null)
  })
})

describe("resolving a slug to a page", () => {
  it("still resolves the static use cases", () => {
    for (const useCase of useCases) {
      assert.equal(getUseCase(useCase.id)?.id, useCase.id)
    }
  })

  it("still resolves legacy custom- links so shared URLs keep working", () => {
    const payload = JSON.stringify({ i: "education", g: "help students revise" })
    const legacy = `custom-${Buffer.from(payload, "utf-8").toString("base64url")}`

    const page = getUseCase(legacy)
    assert.ok(page, "a previously shared link stopped resolving")
    assert.equal(page.id, "education")
    assert.match(page.summary, /help students revise/)
  })

  it("returns undefined for an unknown or malformed slug", () => {
    const whitespaceGoal = Buffer.from(
      JSON.stringify({ i: "education", g: "\u0000\u200b" }),
      "utf-8",
    ).toString("base64url")

    for (const slug of [
      "c-garbage",
      "custom-garbage",
      `custom-${whitespaceGoal}`,
      `custom-${"a".repeat(600)}`,
      "nope",
    ]) {
      assert.equal(getUseCase(slug), undefined, `resolved ${slug}`)
    }
  })
})
