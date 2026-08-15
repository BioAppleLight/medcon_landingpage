/**
 * The contract every other backend module agrees on. Types only — no runtime behavior,
 * so this file disappears entirely at build time.
 */

/** Every slot the question tree can fill. `note` is the one free-text slot. */
export type AnswerKey =
  | "domain"
  | "goal"
  | "audience"
  | "interaction"
  | "tone"
  | "outcome"
  | "requirement"
  | "scale"
  | "career"
  | "avatar_function"
  | "note"

export type AnswerSet = Partial<Record<AnswerKey, string>>

export interface TreeChoice {
  id: string
  label: string
  /** What picking this choice writes into the answer set. */
  sets: AnswerSet
  /** Node to advance to, or `null` when the tree is complete. */
  next: string | null
  /** Lowercase synonyms used for plain keyword lookup on free text. */
  keywords: string[]
}

export interface TreeNode {
  id: string
  question: string
  choices: TreeChoice[]
  allowFreeText: boolean
  /** If set, free text typed on this node is stored (sanitized) into this slot. */
  capture: AnswerKey | null
}

export type QuestionTree = Record<string, TreeNode>

/** The whole "context" — held by the client, re-derived against the tree on every request. */
export interface SessionState {
  session_id: string
  current_node: string | null
  answers: AnswerSet
  asked: string[]
}

/** What the visitor is allowed to see of a node: the question and its labels. */
export interface PublicChoice {
  id: string
  label: string
}

export interface PublicQuestion {
  id: string
  text: string
  choices: PublicChoice[]
  allow_free_text: boolean
}

export interface PageRef {
  slug: string
  url: string
  label: string
}

/**
 * `asking` — required slots still empty; `unrecognized` — free text matched none or several;
 * `ready` — all required slots filled; `restart` — answer set cleared, back to the root.
 */
export type ChatStatus = "asking" | "unrecognized" | "ready" | "restart"

/**
 * What the engine returns. Deliberately has no `page` field: building the page belongs to
 * `use-cases.ts`, and the engine must not depend on it.
 */
export interface ChatDecision {
  status: ChatStatus
  state: SessionState
  missing: AnswerKey[]
  reply: string
  next_question: PublicQuestion | null
}

export interface ChatEngineInput {
  choice_id: string | null
  message: string | null
}

export type ErrorCode =
  | "INVALID_REQUEST"
  | "MESSAGE_TOO_LONG"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"

export interface ApiError {
  code: ErrorCode
  message: string
}

/** Failures are returned, not thrown, so every path stays a pure function. */
export type Result<T> = { ok: true; value: T } | { ok: false; error: ApiError }

export interface ChatRequest {
  choice_id: string | null
  message: string | null
  state: SessionState | null
}

/** The exact JSON shape `POST /api/chat` returns on success. */
export interface ChatResponse {
  status: ChatStatus
  reply: string
  state: SessionState
  next_question: PublicQuestion | null
  page: PageRef | null
  done: boolean
  industry_label: string | null
}
