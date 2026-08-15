import { choiceReplies, systemReplies } from "./preset-content.ts"
import {
  classifyFreeText,
  classifyPurpose,
  classifySectorGroup,
  hasClassificationPhrase,
} from "./free-text-classifier.ts"
import {
  questionTree,
  REQUIRED_SLOTS,
  RESTART_KEYWORDS,
  ROOT_NODE_ID,
} from "./question-tree.ts"
import type {
  AnswerKey,
  AnswerSet,
  ChatDecision,
  ChatEngineInput,
  PublicQuestion,
  Result,
  SessionState,
  TreeChoice,
  TreeNode,
} from "./types.ts"

/**
 * The conversation as a pure function: `(state, input) -> decision`. No I/O, no HTTP, no
 * domain names — everything specific to a use case lives in `question-tree.ts` and
 * `preset-content.ts`. The whole tree is therefore exercisable without a server.
 */

/**
 * Captured free text is trimmed to this before it enters the answer set, so the state the
 * engine emits always survives the (more permissive) boundary check on the way back in.
 */
const CAPTURED_TEXT_MAX_LENGTH = 160

function ok(decision: ChatDecision): Result<ChatDecision> {
  return { ok: true, value: decision }
}

function invalid(message: string): Result<ChatDecision> {
  return { ok: false, error: { code: "INVALID_REQUEST", message } }
}

/** Lowercases and reduces everything that is not a letter or digit to a single space. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
}

/**
 * Plain keyword lookup on word boundaries — `care` must not match `career`. Multi-word
 * keywords are matched as a contiguous phrase. Nothing fuzzier than this by design.
 */
function containsKeyword(paddedText: string, keyword: string): boolean {
  const normalized = normalize(keyword)
  return normalized.length > 0 && paddedText.includes(` ${normalized} `)
}

function matchChoices(node: TreeNode, message: string): TreeChoice[] {
  const padded = ` ${normalize(message)} `
  return node.choices.filter(
    (choice) =>
      containsKeyword(padded, choice.label) ||
      choice.keywords.some((keyword) => containsKeyword(padded, keyword)),
  )
}

export function isRestartRequest(message: string): boolean {
  const padded = ` ${normalize(message)} `
  return RESTART_KEYWORDS.some((keyword) => containsKeyword(padded, keyword))
}

function publicQuestion(node: TreeNode): PublicQuestion {
  return {
    id: node.id,
    text: node.question,
    choices: node.choices.map((choice) => ({ id: choice.id, label: choice.label })),
    allow_free_text: node.allowFreeText,
  }
}

function missingSlots(answers: AnswerSet): AnswerKey[] {
  return REQUIRED_SLOTS.filter((slot) => !answers[slot])
}

/** Every slot any choice on this node could write. */
function slotsOf(node: TreeNode): AnswerKey[] {
  const slots = new Set<AnswerKey>()
  for (const choice of node.choices) {
    for (const key of Object.keys(choice.sets) as AnswerKey[]) slots.add(key)
  }
  return [...slots]
}

/** The node every choice leads to, or `undefined` when they diverge. */
function sharedNextOf(node: TreeNode): string | null | undefined {
  const first = node.choices[0]
  if (!first) return undefined
  return node.choices.every((choice) => choice.next === first.next) ? first.next : undefined
}

/**
 * Walks forward past any node whose slots are already answered, so a slot is never re-asked.
 * A node is only skipped when all of its choices lead to the same place — otherwise skipping
 * would mean guessing which branch the visitor would have taken.
 */
function resolveNextNodeId(startId: string | null, answers: AnswerSet): string | null {
  let id = startId
  const visited = new Set<string>()

  while (id !== null) {
    if (visited.has(id)) return null
    visited.add(id)

    const node: TreeNode | undefined = questionTree[id]
    if (!node) return null

    const slots = slotsOf(node)
    const alreadyAnswered = slots.length > 0 && slots.every((slot) => answers[slot] !== undefined)
    if (!alreadyAnswered) return id

    const shared = sharedNextOf(node)
    if (shared === undefined) return id
    id = shared
  }

  return null
}

function freshDecision(
  sessionId: string,
  status: "asking" | "restart",
  reply: string,
): ChatDecision {
  const root = questionTree[ROOT_NODE_ID]

  return {
    status,
    state: {
      session_id: sessionId,
      current_node: ROOT_NODE_ID,
      answers: {},
      asked: [ROOT_NODE_ID],
    },
    missing: missingSlots({}),
    reply,
    next_question: publicQuestion(root),
  }
}

/** The opening move: the root question, with nothing collected yet. */
export function startSession(sessionId: string): ChatDecision {
  return freshDecision(sessionId, "asking", systemReplies.intro)
}

/** Free text matched nothing, or matched several things — re-offer the same node, unchanged. */
function unrecognizedDecision(state: SessionState, node: TreeNode): ChatDecision {
  return {
    status: "unrecognized",
    state,
    missing: missingSlots(state.answers),
    reply: systemReplies.unrecognized,
    next_question: publicQuestion(node),
  }
}

function classifiedDecision(state: SessionState, node: TreeNode, message: string): ChatDecision | null {
  const canClassify = node.id === ROOT_NODE_ID || node.id.startsWith("sector_") ||
    node.id === "purpose" || node.id.startsWith("scenario_") ||
    node.id === "interaction" || node.id === "audience"
  if (!canClassify) return null

  const classified = classifyFreeText(message)
  const additions = Object.fromEntries(
    Object.entries(classified.answers).filter(([key]) => !state.answers[key as AnswerKey]),
  ) as AnswerSet
  if (Object.keys(additions).length === 0) return null

  const answers: AnswerSet = { ...state.answers, ...additions }
  if (!answers.note) {
    const captured = message.trim().slice(0, CAPTURED_TEXT_MAX_LENGTH).trim()
    if (captured) answers.note = captured
  }

  let nextNodeId = node.id
  if (answers.domain) {
    nextNodeId = "purpose"
    if (answers.goal) {
      nextNodeId = "interaction"
      if (answers.interaction) {
        nextNodeId = "audience"
        if (answers.audience) nextNodeId = "tone"
      }
    }
  }

  const resolved = resolveNextNodeId(nextNodeId, answers) ?? nextNodeId
  return {
    status: "asking",
    state: {
      ...state,
      current_node: resolved,
      answers,
      asked: state.asked.includes(resolved) ? state.asked : [...state.asked, resolved],
    },
    missing: missingSlots(answers),
    reply: systemReplies.acknowledged,
    next_question: publicQuestion(questionTree[resolved]),
  }
}

function applyChoice(
  state: SessionState,
  node: TreeNode,
  choice: TreeChoice,
  capturedText: string | null,
): Result<ChatDecision> {
  const answers: AnswerSet = { ...state.answers, ...choice.sets }

  if (node.capture && capturedText) {
    const captured = capturedText.trim().slice(0, CAPTURED_TEXT_MAX_LENGTH).trim()
    if (captured) answers[node.capture] = captured
  }

  const reply = choiceReplies[node.id]?.[choice.id] ?? systemReplies.acknowledged
  const nextNodeId = resolveNextNodeId(choice.next, answers)
  const missing = missingSlots(answers)

  if (nextNodeId === null) {
    if (missing.length > 0) {
      // The tree ran out of questions before the page had what it needs — a data bug, not
      // something the visitor did. Reported honestly rather than papered over with a page.
      return {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "This conversation could not be completed.",
        },
      }
    }

    return ok({
      status: "ready",
      state: { ...state, current_node: null, answers },
      missing,
      reply: systemReplies.ready,
      next_question: null,
    })
  }

  return ok({
    status: "asking",
    state: {
      ...state,
      current_node: nextNodeId,
      answers,
      asked: state.asked.includes(nextNodeId) ? state.asked : [...state.asked, nextNodeId],
    },
    missing,
    reply,
    next_question: publicQuestion(questionTree[nextNodeId]),
  })
}

/**
 * One step of the conversation. The current node is resolved from the tree by id — the
 * client's copy of the state is never treated as authoritative.
 */
export function advance(state: SessionState, input: ChatEngineInput): Result<ChatDecision> {
  const choiceId = input.choice_id ?? null
  const message = (input.message ?? "").trim()

  // `choice_id` wins if both arrive, so a restart can only ever be typed.
  if (!choiceId && message && isRestartRequest(message)) {
    return ok(freshDecision(state.session_id, "restart", systemReplies.restart))
  }

  const node: TreeNode | undefined = state.current_node
    ? questionTree[state.current_node]
    : undefined

  if (!node) {
    // A deployed tree can change while a visitor still has the previous state open in a tab.
    // Restart that stale session safely instead of surfacing an internal node-id error.
    return ok(freshDecision(state.session_id, "restart", systemReplies.restart))
  }

  if (choiceId) {
    const choice = node.choices.find((candidate) => candidate.id === choiceId)
    if (!choice) {
      return invalid("The choice_id field does not match any choice on this question.")
    }
    return applyChoice(state, node, choice, null)
  }

  if (!message) {
    return invalid("Send either a choice_id or a message.")
  }

  if (!node.allowFreeText) {
    return ok(unrecognizedDecision(state, node))
  }

  if (node.id === ROOT_NODE_ID && !hasClassificationPhrase(message)) {
    const sectorGroup = classifySectorGroup(message)
    if (sectorGroup) {
      const choice = node.choices.find((candidate) => candidate.id === sectorGroup)
      if (choice) return applyChoice(state, node, choice, message)
    }
  }

  if (node.id === "purpose") {
    const purpose = classifyPurpose(message)
    if (purpose) {
      const choice = node.choices.find((candidate) => candidate.id === purpose)
      if (choice) return applyChoice(state, node, choice, message)
    }
  }

  const matches = matchChoices(node, message)
  if (!hasClassificationPhrase(message)) {
    if (matches.length === 1) return applyChoice(state, node, matches[0], node.capture ? message : null)
    if (matches.length > 1) return ok(unrecognizedDecision(state, node))
  }

  const classified = classifiedDecision(state, node, message)
  if (classified) return ok(classified)

  if (matches.length !== 1) {
    return ok(unrecognizedDecision(state, node))
  }

  return applyChoice(state, node, matches[0], node.capture ? message : null)
}
