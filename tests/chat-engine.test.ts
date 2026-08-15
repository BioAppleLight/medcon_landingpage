import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { advance, startSession } from "../lib/chat-engine.ts"
import { choiceReplies } from "../lib/preset-content.ts"
import { questionTree, REQUIRED_SLOTS, ROOT_NODE_ID } from "../lib/question-tree.ts"
import type { ChatDecision, SessionState } from "../lib/types.ts"
import { parseChatRequest, MAX_MESSAGE_LENGTH } from "../lib/validate.ts"
import {
  classifyFreeText,
  classifyPurpose,
  classifySectorGroup,
} from "../lib/free-text-classifier.ts"

function step(
  state: SessionState,
  input: { choice_id?: string; message?: string },
): ChatDecision {
  const result = advance(state, {
    choice_id: input.choice_id ?? null,
    message: input.message ?? null,
  })
  if (!result.ok) assert.fail(`expected success, got ${result.error.code}`)
  return result.value
}

describe("opening the conversation", () => {
  it("starts at the root node with nothing collected", () => {
    const decision = startSession("session-1")

    assert.equal(decision.status, "asking")
    assert.equal(decision.state.current_node, ROOT_NODE_ID)
    assert.deepEqual(decision.state.answers, {})
    assert.deepEqual(decision.missing, REQUIRED_SLOTS)
    assert.equal(decision.next_question?.id, ROOT_NODE_ID)
  })

  it("keeps every question to a compact set of choices", () => {
    for (const node of Object.values(questionTree)) {
      assert.ok(
        node.choices.length >= 2 && node.choices.length <= 6,
        `${node.id} has ${node.choices.length} choices`,
      )
    }
  })
})

describe("the happy path", () => {
  it("reaches a built page by clicking through every question", () => {
    const first = startSession("session-2")

    const afterGroup = step(first.state, { choice_id: "public_regulated" })
    const afterDomain = step(afterGroup.state, { choice_id: "healthcare" })
    assert.equal(afterDomain.status, "asking")
    assert.equal(afterDomain.state.answers.domain, "healthcare")
    assert.equal(afterDomain.reply, choiceReplies.sector_public_regulated.healthcare)

    const afterPurpose = step(afterDomain.state, { choice_id: "information" })
    assert.equal(afterPurpose.next_question?.id, "scenario_information")
    const afterScenario = step(afterPurpose.state, { choice_id: "faq_information" })
    assert.equal(afterScenario.state.answers.goal, "faq_information")
    assert.equal(afterScenario.next_question?.id, "interaction")

    const afterInteraction = step(afterScenario.state, { choice_id: "guided_chat" })
    const afterAudience = step(afterInteraction.state, { choice_id: "patients" })
    const afterTone = step(afterAudience.state, { choice_id: "warm" })
    const afterOutcome = step(afterTone.state, { choice_id: "access" })
    const afterRequirement = step(afterOutcome.state, { choice_id: "handoff" })
    assert.equal(afterRequirement.status, "ready")
    assert.equal(afterRequirement.state.current_node, null)
    assert.deepEqual(afterRequirement.missing, [])
    assert.equal(afterRequirement.next_question, null)
    assert.deepEqual(afterRequirement.state.answers, {
      domain: "healthcare",
      goal: "faq_information",
      interaction: "guided_chat",
      audience: "patients",
      tone: "warm",
      outcome: "access",
      requirement: "handoff",
    })
  })

  it("asks exactly one question at a time", () => {
    let decision = startSession("session-3")
    let steps = 0

    while (decision.status === "asking" && steps < 10) {
      assert.notEqual(decision.next_question, null)
      const choice = decision.next_question?.choices[0]
      assert.ok(choice)
      decision = step(decision.state, { choice_id: choice.id })
      steps += 1
    }

    assert.equal(decision.status, "ready")
    assert.equal(steps, REQUIRED_SLOTS.length + 2)
  })
})

describe("the tree itself", () => {
  it("has no dead ends: every branch terminates with all required slots filled", () => {
    const visited = new Set<string>([ROOT_NODE_ID])
    let terminals = 0

    function walk(state: SessionState, depth: number) {
      assert.ok(depth <= 10, "tree walk exceeded its depth budget")
      const nodeId = state.current_node
      assert.ok(nodeId, "expected a current node")
      const node = questionTree[nodeId]
      assert.ok(node, `unknown node ${nodeId}`)

      for (const choice of node.choices) {
        const decision = step(state, { choice_id: choice.id })

        if (decision.status === "ready") {
          terminals += 1
          for (const slot of REQUIRED_SLOTS) {
            assert.ok(decision.state.answers[slot], `${slot} unset on a completed run`)
          }
          continue
        }

        assert.equal(decision.status, "asking")
        const next = decision.state.current_node
        assert.ok(next)
        visited.add(next)
        walk(decision.state, depth + 1)
      }
    }

    walk(startSession("session-4").state, 1)

    assert.ok(terminals > 0)
    assert.deepEqual(
      [...visited].sort(),
      Object.keys(questionTree).sort(),
      "some nodes are unreachable",
    )
  })

  it("points every edge at a node that exists", () => {
    for (const node of Object.values(questionTree)) {
      for (const choice of node.choices) {
        if (choice.next === null) continue
        assert.ok(questionTree[choice.next], `${node.id}/${choice.id} → missing ${choice.next}`)
      }
    }
  })

  it("has a preset reply for every choice", () => {
    for (const node of Object.values(questionTree)) {
      for (const choice of node.choices) {
        assert.ok(
          choiceReplies[node.id]?.[choice.id],
          `no preset reply for ${node.id}/${choice.id}`,
        )
      }
    }
  })
})

describe("free text", () => {
  it("recognizes a direct one-word healthcare interest", () => {
    const decision = step(startSession("health-keyword").state, { message: "health" })

    assert.equal(decision.status, "asking")
    assert.equal(decision.state.answers.domain, undefined)
    assert.equal(decision.next_question?.id, "sector_public_regulated")
  })

  it("votes across the full message for the opening organization category", () => {
    assert.equal(classifySectorGroup("customer retention and digital marketing"), "customer_growth")
    assert.equal(classifySectorGroup("employee onboarding and skills training"), "people_learning")
    assert.equal(classifySectorGroup("We want to train nurses in our hospital"), "public_regulated")
    assert.equal(classifySectorGroup("industrial safety for factory equipment"), "industry_technology")
    assert.equal(classifySectorGroup("museum visitor experience and cultural heritage"), "places_experiences")
  })

  it("matches short abbreviations as whole words", () => {
    assert.equal(classifySectorGroup("AI software"), "industry_technology")
    assert.equal(classifySectorGroup("HR onboarding"), "people_learning")
    assert.equal(classifySectorGroup("a chair for the room"), null)
  })

  it("votes across the full message for the primary AI purpose", () => {
    assert.equal(classifyPurpose("answer customer questions and explain our services"), "information")
    assert.equal(classifyPurpose("walk students through enrollment and the next steps"), "guidance")
    assert.equal(classifyPurpose("recommend the right product and convert visitors into leads"), "recommendation")
    assert.equal(classifyPurpose("train employees and assess them with a quiz"), "training")
    assert.equal(classifyPurpose("troubleshoot problems and escalate urgent requests"), "support")
  })

  it("uses purpose keywords on the purpose question", () => {
    const first = startSession("purpose-keywords")
    const group = step(first.state, { choice_id: "public_regulated" })
    const domain = step(group.state, { choice_id: "healthcare" })
    const purpose = step(domain.state, { message: "answer patient questions and explain procedures" })

    assert.equal(purpose.next_question?.id, "scenario_information")
  })

  it("recognizes direct keywords across the supplied category bank", () => {
    const examples: Array<[string, string]> = [
      ["health", "healthcare"],
      ["classroom", "education"],
      ["genetics", "research_science"],
      ["programming", "technology"],
      ["mechatronics", "professional_services"],
      ["entrepreneurship", "professional_services"],
      ["advertising", "marketing"],
      ["crm", "sales"],
      ["investing", "financial_services"],
      ["lawsuit", "legal"],
      ["diplomacy", "government"],
      ["payroll", "human_resources"],
      ["humanitarian", "nonprofits_community"],
      ["shopify", "retail"],
      ["resort", "travel_hospitality"],
      ["culinary", "restaurants_food"],
      ["housing", "real_estate"],
      ["journalism", "entertainment_media"],
      ["illustration", "professional_services"],
      ["athletics", "productivity_coaching"],
      ["anxiety", "healthcare"],
      ["pharmaceutical", "healthcare"],
      ["sustainability", "telecom_utilities"],
      ["livestock", "research_science"],
      ["logistics", "automotive_transport"],
      ["construction", "professional_services"],
      ["cosmetics", "retail"],
      ["congregation", "nonprofits_community"],
      ["archaeology", "museums_culture"],
      ["resume", "recruitment_career"],
    ]

    for (const [keyword, domain] of examples) {
      assert.equal(classifyFreeText(keyword).answers.domain, domain, keyword)
    }
  })

  it("classifies four dimensions independently inside a long paragraph", () => {
    const paragraph = `I have worked in higher education for more than a decade and I am a
      professor. Our school wants to improve outreach without replacing our admissions team.
      I want an avatar to help recruit prospective students, explain our programs, and generate
      leads for a human adviser to follow up.`
    const classified = classifyFreeText(paragraph)

    assert.deepEqual(classified.answers, {
      domain: "education",
      career: "professor",
      audience: "learners",
      goal: "lead_consultation",
      avatar_function: "information_lead_generation",
      interaction: "presentation",
    })
  })

  it("keeps career separate from the requested use case", () => {
    const classified = classifyFreeText(
      "I'm a doctor. Our hospital is growing, and I want to train new nurses across the team.",
    )
    assert.deepEqual(classified.answers, {
      domain: "healthcare",
      career: "physician",
      audience: "employees",
      goal: "instruction_learning",
      avatar_function: "instructor",
      interaction: "assessment",
    })
  })

  it("prefills clear paragraph matches and asks the first unresolved question", () => {
    const decision = step(startSession("long-paragraph").state, {
      message: "I'm a doctor at a hospital and I want an avatar to train new nurses.",
    })
    assert.equal(decision.next_question?.id, "tone")
    assert.equal(decision.state.answers.career, "physician")
    assert.equal(decision.state.answers.audience, "employees")
  })

  it("advances when it matches exactly one choice", () => {
    const afterGroup = step(startSession("session-5").state, {
      message: "we run a small clinic",
    })
    const decision = step(afterGroup.state, { message: "we run a small clinic" })

    assert.equal(decision.status, "asking")
    assert.equal(decision.state.answers.domain, "healthcare")
    assert.equal(decision.state.answers.note, "we run a small clinic")
  })

  it("re-offers the same question when it matches nothing, leaving state untouched", () => {
    const first = startSession("session-6")
    const decision = step(first.state, { message: "purple bicycle" })

    assert.equal(decision.status, "unrecognized")
    assert.equal(decision.next_question?.id, ROOT_NODE_ID)
    assert.deepEqual(decision.state, first.state)
  })

  it("treats a match on two choices as unrecognized rather than picking one", () => {
    const first = startSession("session-7")
    const decision = step(first.state, { message: "we work in sales and education" })

    assert.equal(decision.status, "unrecognized")
    assert.deepEqual(decision.state.answers, {})
  })

  it("matches on word boundaries, not substrings", () => {
    const decision = step(startSession("session-8").state, {
      message: "a chairperson joined us",
    })

    assert.equal(decision.status, "unrecognized")
  })

  it("lets choice_id win when both are sent", () => {
    const decision = step(startSession("session-9").state, {
      choice_id: "people_learning",
      message: "we run a hospital",
    })

    assert.equal(decision.state.current_node, "sector_people_learning")
    assert.equal(decision.state.answers.domain, undefined)
    assert.equal(decision.state.answers.note, undefined)
  })

  it("maps an exact catalog phrase to the appropriate purpose", () => {
    const afterGroup = step(startSession("session-catalog").state, {
      choice_id: "industry_technology",
    })
    const afterSector = step(afterGroup.state, { choice_id: "technology" })
    const afterPurpose = step(afterSector.state, { message: "developer documentation guide" })
    const decision = step(afterPurpose.state, { message: "developer documentation guide" })

    assert.equal(decision.state.answers.goal, "process_navigation")
    assert.equal(decision.state.answers.note, "developer documentation guide")
  })
})

describe("the expanded catalog", () => {
  it("completes through a culture and heritage branch", () => {
    const first = startSession("session-10")
    const afterGroup = step(first.state, { choice_id: "places_experiences" })
    const afterDomain = step(afterGroup.state, { choice_id: "museums_culture" })
    assert.equal(afterDomain.state.answers.domain, "museums_culture")
    assert.equal(afterDomain.next_question?.id, "purpose")

    const afterPurpose = step(afterDomain.state, { choice_id: "information" })
    const afterScenario = step(afterPurpose.state, { choice_id: "story_explainer" })
    assert.equal(afterScenario.state.answers.goal, "story_explainer")

    const afterInteraction = step(afterScenario.state, { choice_id: "other" })
    const afterAudience = step(afterInteraction.state, { choice_id: "community" })
    const afterTone = step(afterAudience.state, { choice_id: "other" })
    const afterOutcome = step(afterTone.state, { choice_id: "other" })
    const afterRequirement = step(afterOutcome.state, { choice_id: "unsure" })
    assert.equal(afterRequirement.status, "ready")
  })

  it("includes all 30 supplied industry families as selectable sectors", () => {
    const sectorChoices = Object.values(questionTree)
      .filter((node) => node.id.startsWith("sector_") && node.id !== ROOT_NODE_ID)
      .flatMap((node) => node.choices)

    assert.equal(sectorChoices.length, 30)
  })
})

describe("session rules", () => {
  it("never re-asks a shared next-node slot that is already answered", () => {
    const tampered: SessionState = {
      session_id: "session-11",
      current_node: "interaction",
      answers: { audience: "patients" },
      asked: [ROOT_NODE_ID, "sector_public_regulated", "purpose", "scenario_information", "interaction"],
    }

    const decision = step(tampered, { choice_id: "guided_chat" })

    assert.equal(decision.next_question?.id, "tone", "the answered audience slot was re-asked")
    assert.equal(decision.state.answers.audience, "patients")
  })

  it("clears the answer set on restart", () => {
    const first = startSession("session-12")
    const afterDomain = step(first.state, { choice_id: "public_regulated" })

    const restarted = step(afterDomain.state, { message: "start over" })

    assert.equal(restarted.status, "restart")
    assert.deepEqual(restarted.state.answers, {})
    assert.equal(restarted.state.current_node, ROOT_NODE_ID)
    assert.equal(restarted.state.session_id, "session-12")
  })

  it("caps captured free text so the state it emits can be sent back", () => {
    const decision = step(startSession("session-13").state, {
      message: `hospital ${"x".repeat(400)}`,
    })

    const note = decision.state.answers.note ?? ""
    assert.ok(note.length <= 160, `note was ${note.length} characters`)

    const reparsed = parseChatRequest({ state: decision.state })
    assert.ok(reparsed.ok, "engine output failed the boundary check on the way back in")
  })
})

describe("rejected input", () => {
  it("accepts every answer key emitted by the expanded conversation", () => {
    const parsed = parseChatRequest({
      state: {
        session_id: "session-expanded",
        current_node: "outcome",
        answers: {
          domain: "healthcare",
          goal: "information",
          audience: "patients",
          interaction: "guided_chat",
          tone: "warm",
          outcome: "access",
          requirement: "handoff",
        },
        asked: ["sector_group", "sector_public_regulated", "purpose", "interaction", "tone", "outcome"],
      },
    })

    assert.ok(parsed.ok)
  })

  it("rejects an unknown choice_id", () => {
    const result = advance(startSession("session-14").state, {
      choice_id: "not_a_choice",
      message: null,
    })

    assert.equal(result.ok, false)
    assert.equal(result.ok ? null : result.error.code, "INVALID_REQUEST")
  })

  it("restarts a stale session whose current node came from an older tree", () => {
    const result = advance(
      {
        session_id: "session-15",
        current_node: "not_a_node",
        answers: {},
        asked: [],
      },
      { choice_id: "healthcare", message: null },
    )

    assert.equal(result.ok, true)
    assert.equal(result.ok ? result.value.status : null, "restart")
    assert.equal(result.ok ? result.value.state.current_node : null, ROOT_NODE_ID)
  })

  it("rejects a request carrying neither a choice nor a message", () => {
    const result = advance(startSession("session-16").state, {
      choice_id: null,
      message: null,
    })

    assert.equal(result.ok, false)
  })

  it("treats a missing state as a request to start a new conversation", () => {
    const parsed = parseChatRequest({})
    assert.ok(parsed.ok)
    assert.equal(parsed.value.state, null)
  })

  it("rejects a tampered session state at the boundary", () => {
    const tampered: unknown[] = [
      { session_id: "", current_node: "domain", answers: {}, asked: [] },
      { session_id: "s", current_node: "domain", answers: { domain: 12 }, asked: [] },
      { session_id: "s", current_node: "domain", answers: {}, asked: "domain" },
      { session_id: "s", current_node: "../etc/passwd", answers: {}, asked: [] },
      { session_id: "s", current_node: "domain", answers: [], asked: [] },
      // An own `__proto__` key, the way a hostile client would actually send one.
      JSON.parse('{"session_id":"s","current_node":"domain","answers":{"__proto__":"x"},"asked":[]}'),
      { session_id: "s", current_node: "domain", answers: { surprise: "x" }, asked: [] },
    ]

    for (const state of tampered) {
      const parsed = parseChatRequest({ state })
      assert.equal(parsed.ok, false, `accepted ${JSON.stringify(state)}`)
    }
  })

  it("rejects an oversized message with MESSAGE_TOO_LONG", () => {
    const parsed = parseChatRequest({ message: "x".repeat(MAX_MESSAGE_LENGTH + 1) })

    assert.equal(parsed.ok, false)
    assert.equal(parsed.ok ? null : parsed.error.code, "MESSAGE_TOO_LONG")
  })

  it("strips control and zero-width characters from free text at the boundary", () => {
    const parsed = parseChatRequest({ message: "  we run \u0000 a \u200b clinic  " })

    if (!parsed.ok) assert.fail("expected the message to be accepted")
    assert.equal(parsed.value.message, "we run a clinic")
  })
})
