import { hashToken, isId, isOwnerToken, newId, newOwnerToken, pageSlug, sameHash } from "./auth.ts"
import type { ConsultantConfig } from "./config.ts"
import {
  DEGRADED_NOTICE,
  fallbackPageSpec,
  fallbackProposal,
  fallbackTurn,
  inferSolutionType,
} from "./fallback.ts"
import {
  checkGeneratedText,
  checkGeneratedTexts,
  decideScope,
  heuristicRelevance,
  isTypedConfirmation,
  redirectFor,
  screenInput,
} from "./guardrails.ts"
import { industryLabel, offeringName, renderKnowledgeCatalog } from "./knowledge.ts"
import {
  callStructured,
  ModelError,
  readPartialStringField,
  type ModelClient,
  type ModelContent,
  type ModelRequest,
} from "./model.ts"
import { finalizePageSpec, proposalTexts } from "./page-spec.ts"
import {
  consultantSystemPrompt,
  conversationContents,
  pageSpecContents,
  pageSpecSystemPrompt,
  proposalContents,
  proposalSystemPrompt,
  relevanceContents,
  relevanceSystemPrompt,
} from "./prompts.ts"
import {
  appendHistory,
  emptyRequirements,
  FIELD_LABELS,
  mergeRequirements,
  mergeUnresolved,
  progressOf,
  setSolutionType,
} from "./requirements.ts"
import {
  pageSpecSchema,
  proposalSchema,
  relevanceSchema,
  toModelJsonSchema,
  turnSchema,
  type ModelProposal,
  type ModelTurn,
  type RelevanceResult,
} from "./schemas.ts"
import { canPresentProposal, canPreviewDraft, nextStage } from "./state-machine.ts"
import type { ConsultationRepository } from "./store.ts"
import { sanitizeText } from "./text.ts"
import {
  ConsultationError,
  type Consultation,
  type ConsultationMessage,
  type ConsultationView,
  type GeneratedPageRecord,
  type MessageKind,
  type PageRevision,
  type PageSpec,
  type Proposal,
  type PublicPageRef,
  type RequirementField,
} from "./types.ts"

/**
 * Consultation management: the only module that changes a consultation. It owns the order of
 * operations for every action — authorize, rate-limit, lock, screen, call the model, validate,
 * apply deterministic rules, persist — and never lets model output decide authorization,
 * persistence, or stage transitions.
 */

export const MAX_MESSAGE_LENGTH = 2_000
const MAX_STORED_MESSAGES = 80
const MAX_VIEW_MESSAGES = 60
const MAX_PROPOSALS = 20
const MAX_REVISIONS = 20

export const GREETING =
  "Hi — I'm MYO'S AI Digital Twin Solutions Consultant. Tell me what you'd like to achieve: who you want to help, and what problem they face. I'll help you shape a realistic AI digital twin solution and turn it into a personalized proposal page."

export const STARTER_SUGGESTIONS = [
  "Support patients after surgery",
  "Help students prepare for exams",
  "Train new employees faster",
  "What does MYO'S offer?",
]

const REVISE_SUGGESTIONS = [
  "Change the audience",
  "Add another language",
  "Adjust escalation rules",
  "Change the knowledge sources",
]

export interface ServiceDeps {
  repo: ConsultationRepository
  /** `null` runs the deterministic consultant only. */
  model: ModelClient | null
  config: ConsultantConfig
  now?: () => Date
  log?: (event: string, detail?: Record<string, string | number | boolean>) => void
}

export interface Actor {
  ownerToken: string | null
  consultationId: string | null
  ip: string | null
}

/** What the HTTP layer needs to send back: the view plus any cookies to (re)set. */
export interface ServiceResult {
  view: ConsultationView | null
  ownerToken: string
  ownerTokenIsNew: boolean
  consultationId: string | null
}

export type StreamEvent = { type: "delta"; text: string } | { type: "reset" } | { type: "status"; status: string }

interface Owner {
  token: string
  hash: string
  isNew: boolean
}

export class ConsultationService {
  private readonly repo: ConsultationRepository
  private readonly model: ModelClient | null
  private readonly config: ConsultantConfig
  private readonly now: () => Date
  private readonly log: NonNullable<ServiceDeps["log"]>
  private readonly catalog: string

  constructor(deps: ServiceDeps) {
    this.repo = deps.repo
    this.model = deps.model
    this.config = deps.config
    this.now = deps.now ?? (() => new Date())
    this.log = deps.log ?? (() => undefined)
    this.catalog = renderKnowledgeCatalog()
  }

  /* ---------------------------------------------------------------------------------------
   * Ownership and loading
   * ------------------------------------------------------------------------------------- */

  private async owner(actor: Actor): Promise<Owner> {
    if (isOwnerToken(actor.ownerToken)) {
      return { token: actor.ownerToken, hash: await hashToken(actor.ownerToken), isNew: false }
    }
    const token = newOwnerToken()
    return { token, hash: await hashToken(token), isNew: true }
  }

  /** Loads the actor's consultation; anything not owned by them is treated as absent. */
  private async load(owner: Owner, consultationId: string | null): Promise<Consultation | null> {
    if (owner.isNew || !isId(consultationId)) return null
    const consultation = await this.repo.getConsultation(consultationId)
    if (!consultation || !sameHash(consultation.owner_hash, owner.hash)) return null
    return consultation
  }

  private result(owner: Owner, consultation: Consultation | null, view: ConsultationView | null): ServiceResult {
    return {
      view,
      ownerToken: owner.token,
      ownerTokenIsNew: owner.isNew,
      consultationId: consultation?.id ?? null,
    }
  }

  private fresh(owner: Owner): Consultation {
    const at = this.now().toISOString()
    return {
      id: newId(),
      version: 0,
      owner_hash: owner.hash,
      created_at: at,
      updated_at: at,
      stage: "DISCOVERY",
      turn_count: 0,
      messages: [{ role: "assistant", content: GREETING, at, kind: "reply" }],
      requirements: emptyRequirements(),
      requirement_history: [],
      proposals: [],
      current_proposal_version: null,
      confirmed_proposal_version: null,
      page_id: null,
      suggestions: STARTER_SUGGESTIONS,
      pending_field: this.model ? null : "industry",
      degraded: this.model === null,
      strikes: { off_topic: 0, injection: 0 },
    }
  }

  private async persist(consultation: Consultation, expectedVersion: number | null): Promise<Consultation> {
    const trimmed: Consultation = {
      ...consultation,
      updated_at: this.now().toISOString(),
      messages: consultation.messages.slice(-MAX_STORED_MESSAGES),
      proposals: consultation.proposals.slice(-MAX_PROPOSALS),
    }
    return this.repo.saveConsultation(trimmed, expectedVersion)
  }

  /* ---------------------------------------------------------------------------------------
   * Public actions
   * ------------------------------------------------------------------------------------- */

  /** The current consultation for this browser, or `null` when there is none. */
  async getState(actor: Actor): Promise<ServiceResult> {
    const owner = await this.owner(actor)
    const consultation = await this.load(owner, actor.consultationId)
    return this.result(owner, consultation, consultation ? await this.view(consultation) : null)
  }

  /** Resumes the existing consultation, or starts one. */
  async start(actor: Actor): Promise<ServiceResult> {
    const owner = await this.owner(actor)
    const existing = await this.load(owner, actor.consultationId)
    if (existing) return this.result(owner, existing, await this.view(existing))
    await this.rateLimit(owner, actor.ip)
    const created = await this.persist(this.fresh(owner), null)
    return this.result(owner, created, await this.view(created))
  }

  /** Abandons the current consultation (it stays stored, with its pages) and starts afresh. */
  async reset(actor: Actor): Promise<ServiceResult> {
    const owner = await this.owner(actor)
    await this.rateLimit(owner, actor.ip)
    const created = await this.persist(this.fresh(owner), null)
    return this.result(owner, created, await this.view(created))
  }

  async message(actor: Actor, rawMessage: string, onEvent?: (event: StreamEvent) => void): Promise<ServiceResult> {
    const text = sanitizeText(rawMessage, MAX_MESSAGE_LENGTH + 1)
    if (!text) throw new ConsultationError("INVALID_REQUEST", "Please type a message.")
    if (text.length > MAX_MESSAGE_LENGTH) {
      throw new ConsultationError("MESSAGE_TOO_LONG", `Messages are limited to ${MAX_MESSAGE_LENGTH} characters.`)
    }

    const owner = await this.owner(actor)
    await this.rateLimit(owner, actor.ip)
    const loaded = (await this.load(owner, actor.consultationId)) ?? (await this.persist(this.fresh(owner), null))

    const saved = await this.repo.withLock(loaded.id, async () => {
      const current = (await this.repo.getConsultation(loaded.id)) ?? loaded
      if (current.turn_count >= this.config.maxTurnsPerConsultation) {
        throw new ConsultationError(
          "LIMIT_REACHED",
          "This consultation has reached its length limit. Book a call with our team, or start a new consultation.",
        )
      }
      const next = await this.handleMessage(current, text, onEvent)
      return this.persist(next, current.version)
    })

    return this.result(owner, saved, await this.view(saved))
  }

  /** Explicit confirmation of one proposal version, followed by page generation. */
  async confirm(actor: Actor, proposalVersion: number): Promise<ServiceResult> {
    const owner = await this.owner(actor)
    await this.rateLimit(owner, actor.ip)
    const loaded = await this.requireConsultation(owner, actor.consultationId)

    const saved = await this.repo.withLock(loaded.id, async () => {
      const current = (await this.repo.getConsultation(loaded.id)) ?? loaded
      const next = await this.confirmAndGenerate(current, proposalVersion)
      return next === current ? current : this.persist(next, current.version)
    })
    return this.result(owner, saved, await this.view(saved))
  }

  /** A clearly-labelled draft page, available before confirmation. */
  async preview(actor: Actor): Promise<ServiceResult> {
    const owner = await this.owner(actor)
    await this.rateLimit(owner, actor.ip)
    const loaded = await this.requireConsultation(owner, actor.consultationId)

    const saved = await this.repo.withLock(loaded.id, async () => {
      const current = (await this.repo.getConsultation(loaded.id)) ?? loaded
      const next = await this.createDraft(current)
      return this.persist(next, current.version)
    })
    return this.result(owner, saved, await this.view(saved))
  }

  /** Re-opens the requirements after review or completion, keeping everything confirmed. */
  async revise(actor: Actor): Promise<ServiceResult> {
    const owner = await this.owner(actor)
    const loaded = await this.requireConsultation(owner, actor.consultationId)

    const saved = await this.repo.withLock(loaded.id, async () => {
      const current = (await this.repo.getConsultation(loaded.id)) ?? loaded
      if (current.stage === "GENERATION" || current.stage === "CONFIRMATION") {
        throw new ConsultationError("BUSY", "Your page is still being generated — one moment.")
      }
      const at = this.now().toISOString()
      const next: Consultation = {
        ...current,
        stage: nextStage(current.stage, { type: "revise" }, current.requirements),
        messages: [
          ...current.messages,
          {
            role: "assistant",
            content: "Of course. What would you like to change? Everything you've confirmed is kept, and your earlier proposals and pages stay in your history.",
            at,
            kind: "reply",
          },
        ],
        suggestions: REVISE_SUGGESTIONS,
        pending_field: null,
      }
      return this.persist(next, current.version)
    })
    return this.result(owner, saved, await this.view(saved))
  }

  /** Creates (or rotates) a share link for the visitor's page. */
  async share(actor: Actor, pageId: string | null = null): Promise<{ result: ServiceResult; url: string }> {
    const owner = await this.owner(actor)
    const consultation = await this.load(owner, actor.consultationId)
    const targetId = pageId ?? consultation?.page_id ?? null
    if (!isId(targetId)) throw new ConsultationError("NOT_FOUND", "There is no page to share yet.")
    const page = await this.repo.getPage(targetId)
    if (!page || owner.isNew || !sameHash(page.owner_hash, owner.hash)) {
      throw new ConsultationError("NOT_FOUND", "Page not found.")
    }
    if (!latestFinal(page)) throw new ConsultationError("CONFLICT", "Only confirmed pages can be shared.")

    const token = newOwnerToken()
    await this.repo.savePage({ ...page, share_token_hash: await hashToken(token), updated_at: this.now().toISOString() })
    return {
      result: this.result(owner, consultation, consultation ? await this.view(consultation) : null),
      url: `/use-cases/${pageSlug(page.id)}?k=${token}`,
    }
  }

  /**
   * Server-side authorization for a generated page: the owner's cookie, or a valid share token.
   * Anything else is indistinguishable from a page that does not exist.
   */
  async loadPageForViewer(
    pageId: string,
    viewer: { ownerToken: string | null; shareToken: string | null },
    revisionNumber: number | null = null,
  ): Promise<{ page: GeneratedPageRecord; revision: PageRevision; isOwner: boolean } | null> {
    if (!isId(pageId)) return null
    const page = await this.repo.getPage(pageId)
    if (!page) return null

    const isOwner = isOwnerToken(viewer.ownerToken) && sameHash(await hashToken(viewer.ownerToken), page.owner_hash)
    const hasShare =
      typeof viewer.shareToken === "string" &&
      isOwnerToken(viewer.shareToken) &&
      page.share_token_hash !== null &&
      sameHash(await hashToken(viewer.shareToken), page.share_token_hash)
    if (!isOwner && !hasShare) return null

    // Shared links only ever show the latest final revision.
    const revision = isOwner && revisionNumber !== null
      ? page.revisions.find((candidate) => candidate.revision === revisionNumber)
      : latestFinal(page) ?? (isOwner ? page.revisions.at(-1) : undefined)
    if (!revision) return null
    return { page, revision, isOwner }
  }

  /* ---------------------------------------------------------------------------------------
   * Conversation turn
   * ------------------------------------------------------------------------------------- */

  private async handleMessage(
    consultation: Consultation,
    text: string,
    onEvent?: (event: StreamEvent) => void,
  ): Promise<Consultation> {
    if (consultation.stage === "GENERATION" || consultation.stage === "CONFIRMATION") {
      throw new ConsultationError("BUSY", "Your page is still being generated — one moment.")
    }

    const at = this.now().toISOString()
    const withUser: Consultation = {
      ...consultation,
      turn_count: consultation.turn_count + 1,
      messages: [...consultation.messages, { role: "user", content: text, at }],
    }

    // Typed confirmation is matched deterministically and only while a proposal is on screen.
    if (consultation.stage === "REVIEW" && consultation.current_proposal_version !== null && isTypedConfirmation(text)) {
      return this.confirmAndGenerate(withUser, consultation.current_proposal_version)
    }

    const screen = screenInput(text)
    const heuristic = heuristicRelevance(text, { midConversation: consultation.turn_count > 0 })
    const userText = withUser.messages.filter((message) => message.role === "user").map((message) => message.content).join("\n")

    // Clear injection or personal clinical requests never reach the model.
    const early = decideScope({ screen, heuristic, classifier: null, modelScope: "in_scope" })
    if (early !== "in_scope") return this.redirect(withUser, early)

    let turn: ModelTurn
    let degraded = false
    let pendingField: RequirementField | null = null
    let classifier: RelevanceResult | null = null

    if (this.model) {
      const abort = new AbortController()
      let gateOpen = false
      let pending: StreamEvent[] = []
      const emit = (event: StreamEvent) => {
        if (!onEvent) return
        if (gateOpen) onEvent(event)
        else pending.push(event)
      }

      const classifierPromise = callStructured(
        this.model,
        this.request({
          model: this.config.classifierModel,
          system: relevanceSystemPrompt(),
          contents: relevanceContents(consultation, text),
          schema: relevanceSchema,
          temperature: 0,
          maxOutputTokens: 256,
          timeoutMs: Math.min(this.config.turnTimeoutMs, 10_000),
          signal: abort.signal,
        }),
        relevanceSchema,
        { retries: 0 },
      )
        .then((result) => result.value)
        .catch(() => {
          this.log("classifier_unavailable")
          return null
        })

      const turnPromise = this.runTurn(consultation, text, userText, abort.signal, onEvent ? emit : undefined)
      // Handled below; this keeps an early failure from surfacing as an unhandled rejection.
      turnPromise.catch(() => undefined)

      classifier = await classifierPromise
      const preliminary = decideScope({ screen, heuristic, classifier, modelScope: null })
      const confident = classifier !== null && (classifier.confidence >= 0.85 || classifier.category === "injection_attempt" || classifier.category === "unsafe")
      if (preliminary !== "in_scope" && confident) {
        abort.abort()
        return this.redirect(withUser, preliminary)
      }
      gateOpen = true
      if (onEvent) for (const event of pending) onEvent(event)
      pending = []

      try {
        turn = await turnPromise
      } catch (error) {
        const kind = error instanceof ModelError ? error.kind : "unknown"
        this.log("turn_fallback", { kind })
        onEvent?.({ type: "reset" })
        ;({ turn, pendingField } = fallbackTurn(consultation, text))
        degraded = true
      }
    } else {
      ;({ turn, pendingField } = fallbackTurn(consultation, text))
      degraded = true
    }

    const scope = decideScope({
      screen,
      heuristic,
      classifier,
      modelScope: degraded ? null : turn.scope,
    })
    if (scope !== "in_scope") {
      onEvent?.({ type: "reset" })
      return this.redirect(withUser, scope)
    }

    return this.applyTurn(withUser, turn, { degraded, userText, at, pendingField })
  }

  private async runTurn(
    consultation: Consultation,
    text: string,
    userText: string,
    signal: AbortSignal,
    emit?: (event: StreamEvent) => void,
  ): Promise<ModelTurn> {
    let emittedAttempt = 0
    let emittedLength = 0
    let halted = false

    const onPartial = emit && this.config.streaming
      ? (accumulated: string, attempt: number) => {
          if (attempt !== emittedAttempt) {
            if (emittedLength > 0) emit({ type: "reset" })
            emittedAttempt = attempt
            emittedLength = 0
            halted = false
          }
          if (halted) return
          const partial = readPartialStringField(accumulated, "reply")
          if (!partial || partial.length <= emittedLength) return
          // Never stream text that would fail the final output check.
          if (!checkGeneratedText(partial, { userText }).ok) {
            halted = true
            return
          }
          emit({ type: "delta", text: partial.slice(emittedLength).replace(/[<>]/g, "") })
          emittedLength = partial.length
        }
      : undefined

    const { value } = await callStructured(
      this.model!,
      this.request({
        model: this.config.geminiModel,
        system: consultantSystemPrompt(consultation, this.catalog),
        contents: conversationContents(consultation, text),
        schema: turnSchema,
        temperature: 0.6,
        maxOutputTokens: this.config.maxOutputTokens,
        timeoutMs: this.config.turnTimeoutMs,
        signal,
      }),
      turnSchema,
      {
        retries: this.config.maxRetries,
        onPartial,
        accept: (turn) => {
          const check = checkGeneratedText(turn.reply, { userText })
          return check.ok ? null : check.violations.join(",")
        },
      },
    )
    return value
  }

  private redirect(consultation: Consultation, decision: Exclude<ReturnType<typeof decideScope>, "in_scope">): Consultation {
    this.log("redirect", { decision })
    const strikes = { ...consultation.strikes }
    if (decision === "injection") strikes.injection += 1
    else strikes.off_topic += 1
    return {
      ...consultation,
      strikes,
      messages: [...consultation.messages, { role: "assistant", content: redirectFor(decision), at: this.now().toISOString(), kind: "redirect" }],
      suggestions: consultation.turn_count > 1 && consultation.suggestions.length > 0 ? consultation.suggestions : STARTER_SUGGESTIONS,
    }
  }

  private async applyTurn(
    consultation: Consultation,
    turn: ModelTurn,
    context: { degraded: boolean; userText: string; at: string; pendingField: RequirementField | null },
  ): Promise<Consultation> {
    const merged = mergeRequirements(
      consultation.requirements,
      turn.updates.map((update) => ({ ...update, field: update.field as RequirementField })),
      turn.clear_fields as RequirementField[],
      { turn: consultation.turn_count, at: context.at },
    )
    if (merged.rejected.length > 0) this.log("updates_rejected", { count: merged.rejected.length })

    let requirements = setSolutionType(merged.requirements, turn.solution_type)
    if (turn.industry_id !== "unknown" && industryLabel(turn.industry_id)) {
      const changedIndustry = requirements.industry_id !== turn.industry_id
      // Never let the model switch a confirmed industry by itself.
      if (!changedIndustry || requirements.fields.industry?.status !== "confirmed" || merged.changes.some((change) => change.field === "industry")) {
        requirements = { ...requirements, industry_id: turn.industry_id }
      }
    }
    requirements = { ...requirements, unresolved_questions: mergeUnresolved(requirements.unresolved_questions, turn.unresolved_questions) }

    const requirementsChanged = merged.changes.length > 0 || requirements.industry_id !== consultation.requirements.industry_id
    let stage = nextStage(consultation.stage, { type: "turn", requirementsChanged }, requirements)

    const reply = context.degraded ? turn.reply : checkGeneratedText(turn.reply, { userText: context.userText }).text
    const messages: ConsultationMessage[] = [...consultation.messages]
    if (context.degraded && !consultation.degraded) {
      messages.push({ role: "assistant", content: DEGRADED_NOTICE, at: context.at, kind: "notice" })
    }
    messages.push({ role: "assistant", content: reply, at: context.at, kind: "reply" })

    let next: Consultation = {
      ...consultation,
      stage,
      requirements,
      requirement_history: appendHistory(consultation.requirement_history, merged.changes),
      messages,
      suggestions: this.cleanSuggestions(turn.suggestions, context.userText),
      degraded: context.degraded,
      pending_field: context.degraded ? context.pendingField : null,
    }

    const wantsSummary = turn.user_intent === "request_summary" || turn.ready_for_review
    if (stage === "SOLUTION_DESIGN" && wantsSummary && canPresentProposal(requirements)) {
      next = await this.presentProposal(next, context.userText)
      stage = next.stage
    } else if (turn.user_intent === "request_summary" && !canPresentProposal(requirements)) {
      const missing = progressOf(requirements).missing.slice(0, 3).join(", ").toLowerCase()
      next.messages.push({
        role: "assistant",
        content: `Before I can summarize a full proposal I still need: ${missing}. You can also ask for a draft preview now.`,
        at: context.at,
        kind: "notice",
      })
    }

    if (turn.user_intent === "request_preview") {
      next = canPreviewDraft(requirements)
        ? await this.createDraft(next)
        : {
            ...next,
            messages: [
              ...next.messages,
              {
                role: "assistant",
                content: "I need at least your industry and what you want the digital twin to do before I can draft a preview.",
                at: context.at,
                kind: "notice",
              },
            ],
          }
    }

    return next
  }

  private cleanSuggestions(suggestions: string[], userText: string): string[] {
    const cleaned = suggestions
      .map((suggestion) => sanitizeText(suggestion, 60))
      .filter((suggestion) => suggestion && checkGeneratedText(suggestion, { userText }, 60).ok)
    return [...new Set(cleaned)].slice(0, 4)
  }

  /* ---------------------------------------------------------------------------------------
   * Proposal, confirmation, generation
   * ------------------------------------------------------------------------------------- */

  private async writeProposal(consultation: Consultation, userText: string): Promise<{ proposal: ModelProposal; source: "gemini" | "fallback" }> {
    if (this.model) {
      try {
        const { value } = await callStructured(
          this.model,
          this.request({
            model: this.config.geminiModel,
            system: proposalSystemPrompt(this.catalog),
            contents: proposalContents(consultation.requirements, consultation),
            schema: proposalSchema,
            temperature: 0.3,
            maxOutputTokens: this.config.maxOutputTokens,
            timeoutMs: this.config.generationTimeoutMs,
          }),
          proposalSchema,
          {
            retries: this.config.maxRetries,
            accept: (proposal) => {
              const violations = checkGeneratedTexts(proposalTexts(proposal), { userText })
              return violations.length > 0 ? violations.join(",") : null
            },
          },
        )
        return { proposal: value, source: "gemini" }
      } catch (error) {
        this.log("proposal_fallback", { kind: error instanceof ModelError ? error.kind : "unknown" })
      }
    }
    return { proposal: fallbackProposal(consultation.requirements), source: "fallback" }
  }

  private async presentProposal(consultation: Consultation, userText: string): Promise<Consultation> {
    const { proposal, source } = await this.writeProposal(consultation, userText)
    const at = this.now().toISOString()
    const version = (consultation.proposals.at(-1)?.version ?? 0) + 1
    const clean = (text: string, max: number) => sanitizeText(text, max)

    const stored: Proposal = {
      title: clean(proposal.title, 110),
      solution_type: proposal.solution_type ?? inferSolutionType(consultation.requirements),
      summary: clean(proposal.summary, 800),
      components: proposal.components.map((item) => clean(item, 180)),
      offerings: proposal.offerings.map((offering) => ({ ...offering, note: clean(offering.note, 240) })),
      human_oversight: clean(proposal.human_oversight, 400),
      open_questions: proposal.open_questions.map((item) => clean(item, 220)),
      assumptions: proposal.assumptions.map((item) => clean(item, 220)),
      version,
      status: "draft",
      created_at: at,
      confirmed_at: null,
      source,
      requirements_snapshot: structuredClone(consultation.requirements),
    }

    return {
      ...consultation,
      stage: nextStage(consultation.stage, { type: "proposal_presented" }, consultation.requirements),
      proposals: [
        ...consultation.proposals.map((existing) => (existing.status === "draft" ? { ...existing, status: "superseded" as const } : existing)),
        stored,
      ],
      current_proposal_version: version,
      messages: [
        ...consultation.messages,
        {
          role: "assistant",
          content: "I've summarized the proposed solution below. Review it, then confirm to generate your personalized page — or tell me what to change.",
          at,
          kind: "notice",
        },
      ],
      suggestions: ["Confirm", "Change something", "Preview a draft page"],
    }
  }

  private async confirmAndGenerate(consultation: Consultation, proposalVersion: number): Promise<Consultation> {
    const proposal = consultation.proposals.find((candidate) => candidate.version === proposalVersion)
    if (!proposal || consultation.current_proposal_version !== proposalVersion) {
      throw new ConsultationError("CONFLICT", "That proposal has changed. Please review the latest summary before confirming.")
    }

    // Idempotent: confirming the same proposal twice returns the page already generated.
    if (consultation.confirmed_proposal_version === proposalVersion && consultation.page_id) {
      const existing = await this.repo.getGeneration(consultation.id, proposalVersion)
      if (existing) return consultation
    }
    if (consultation.stage !== "REVIEW" && consultation.stage !== "COMPLETED") {
      throw new ConsultationError("CONFLICT", "Please review the proposal summary before confirming.")
    }

    const at = this.now().toISOString()
    let working: Consultation = {
      ...consultation,
      stage: nextStage(nextStage("REVIEW", { type: "confirmed" }, consultation.requirements), { type: "generation_started" }, consultation.requirements),
      confirmed_proposal_version: proposalVersion,
      proposals: consultation.proposals.map((candidate) =>
        candidate.version === proposalVersion ? { ...candidate, status: "confirmed" as const, confirmed_at: at } : candidate,
      ),
    }

    const userText = working.messages.filter((message) => message.role === "user").map((message) => message.content).join("\n")
    const confirmedProposal = working.proposals.find((candidate) => candidate.version === proposalVersion)!

    try {
      const { spec, source } = await this.writePageSpec(confirmedProposal.requirements_snapshot, confirmedProposal, false, userText)
      const { page, revision } = await this.appendRevision(working, spec, source, "final", proposalVersion, confirmedProposal.requirements_snapshot)

      const claimed = await this.repo.claimGeneration(working.id, proposalVersion, `${page.id}:${revision.revision}`)
      if (!claimed) this.log("generation_already_claimed")
      await this.repo.savePage(page)

      working = {
        ...working,
        page_id: page.id,
        stage: nextStage(working.stage, { type: "generation_succeeded" }, working.requirements),
        messages: [
          ...working.messages,
          {
            role: "assistant",
            content: "Your personalized use-case page is ready. You can open it any time from here or from the Use Cases menu, and come back to refine it whenever you like.",
            at: this.now().toISOString(),
            kind: "notice",
          },
        ],
        suggestions: ["Change something", "What happens next?"],
      }
      return working
    } catch (error) {
      this.log("generation_failed", { kind: error instanceof ConsultationError ? error.code : "unknown" })
      throw new ConsultationError("INTERNAL_ERROR", "Your page could not be generated just now. Your confirmed proposal is saved — please try again.")
    }
  }

  private async createDraft(consultation: Consultation): Promise<Consultation> {
    if (!canPreviewDraft(consultation.requirements)) {
      throw new ConsultationError("CONFLICT", "Tell me a little more about your industry and goal before I draft a preview.")
    }
    const at = this.now().toISOString()
    const fingerprint = await fingerprintOf(consultation.requirements)
    if (consultation.page_id) {
      const page = await this.repo.getPage(consultation.page_id)
      const latest = page?.revisions.at(-1)
      if (latest && latest.status === "draft" && latest.fingerprint === fingerprint) return consultation
    }

    const proposal = consultation.current_proposal_version !== null
      ? consultation.proposals.find((candidate) => candidate.version === consultation.current_proposal_version) ?? null
      : null
    const userText = consultation.messages.filter((message) => message.role === "user").map((message) => message.content).join("\n")
    const { spec, source } = await this.writePageSpec(consultation.requirements, proposal, true, userText)
    const { page } = await this.appendRevision(consultation, spec, source, "draft", proposal?.version ?? null, consultation.requirements)
    await this.repo.savePage(page)

    return {
      ...consultation,
      page_id: page.id,
      messages: [
        ...consultation.messages,
        {
          role: "assistant",
          content: "I've prepared a draft preview of your page. It's labelled as a draft and will change as we refine your requirements — nothing is final until you confirm.",
          at,
          kind: "notice",
        },
      ],
    }
  }

  private async writePageSpec(
    requirements: Consultation["requirements"],
    proposal: Proposal | null,
    draft: boolean,
    userText: string,
  ): Promise<{ spec: PageSpec; source: "gemini" | "fallback" }> {
    if (this.model) {
      try {
        let finalized: PageSpec | null = null
        await callStructured(
          this.model,
          this.request({
            model: this.config.geminiModel,
            system: pageSpecSystemPrompt(),
            contents: pageSpecContents(requirements, proposal, draft),
            schema: pageSpecSchema,
            temperature: 0.5,
            maxOutputTokens: this.config.maxOutputTokens,
            timeoutMs: this.config.generationTimeoutMs,
          }),
          pageSpecSchema,
          {
            retries: this.config.maxRetries,
            accept: (raw) => {
              const result = finalizePageSpec(raw as PageSpec, requirements, userText)
              if (result.violations.length > 0) return result.violations.join(",")
              finalized = result.spec
              return null
            },
          },
        )
        if (finalized) return { spec: finalized, source: "gemini" }
      } catch (error) {
        this.log("page_fallback", { kind: error instanceof ModelError ? error.kind : "unknown" })
      }
    }
    return { spec: fallbackPageSpec(requirements, proposal), source: "fallback" }
  }

  private async appendRevision(
    consultation: Consultation,
    spec: PageSpec,
    source: "gemini" | "fallback",
    status: "draft" | "final",
    proposalVersion: number | null,
    requirements: Consultation["requirements"],
  ): Promise<{ page: GeneratedPageRecord; revision: PageRevision }> {
    const at = this.now().toISOString()
    const existing = consultation.page_id ? await this.repo.getPage(consultation.page_id) : null
    const page: GeneratedPageRecord = existing ?? {
      id: newId(),
      consultation_id: consultation.id,
      owner_hash: consultation.owner_hash,
      created_at: at,
      updated_at: at,
      share_token_hash: null,
      revisions: [],
    }

    const revision: PageRevision = {
      revision: (page.revisions.at(-1)?.revision ?? 0) + 1,
      status,
      proposal_version: proposalVersion,
      created_at: at,
      source,
      industry_id: requirements.industry_id,
      industry_label: industryLabel(requirements.industry_id) ?? sanitizeText(requirements.fields.industry?.value ?? "Your use case", 40),
      fingerprint: await fingerprintOf(requirements),
      spec,
    }

    // Keep every final revision; trim only old drafts when over the cap.
    let revisions = [...page.revisions, revision]
    while (revisions.length > MAX_REVISIONS) {
      const dropIndex = revisions.findIndex((candidate) => candidate.status === "draft")
      revisions = revisions.filter((_, index) => index !== (dropIndex >= 0 ? dropIndex : 0))
    }
    return { page: { ...page, revisions, updated_at: at }, revision }
  }

  /* ---------------------------------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------------------------------- */

  private request(options: {
    model: string
    system: string
    contents: ModelContent[]
    schema: Parameters<typeof toModelJsonSchema>[0]
    temperature: number
    maxOutputTokens: number
    timeoutMs: number
    signal?: AbortSignal
  }): ModelRequest {
    return {
      model: options.model,
      system: options.system,
      contents: options.contents,
      jsonSchema: toModelJsonSchema(options.schema),
      temperature: options.temperature,
      maxOutputTokens: options.maxOutputTokens,
      timeoutMs: options.timeoutMs,
      signal: options.signal,
    }
  }

  private async requireConsultation(owner: Owner, consultationId: string | null): Promise<Consultation> {
    const consultation = await this.load(owner, consultationId)
    if (!consultation) throw new ConsultationError("NOT_FOUND", "Start a conversation first.")
    return consultation
  }

  private async rateLimit(owner: Owner, ip: string | null): Promise<void> {
    const minute = 60_000
    const checks: Promise<boolean>[] = [
      this.repo.overLimit(`o:${owner.hash}:m`, this.config.messagesPerMinute, minute),
      this.repo.overLimit(`o:${owner.hash}:d`, this.config.messagesPerDay, 24 * 60 * minute),
    ]
    if (ip) checks.push(this.repo.overLimit(`ip:${await hashToken(ip)}:m`, this.config.ipRequestsPerMinute, minute))
    if ((await Promise.all(checks)).some(Boolean)) {
      throw new ConsultationError("RATE_LIMITED", "Too many messages. Please wait a moment and try again.")
    }
  }

  async view(consultation: Consultation): Promise<ConsultationView> {
    const page = consultation.page_id ? await this.repo.getPage(consultation.page_id) : null
    const showProposal = ["REVIEW", "CONFIRMATION", "GENERATION", "COMPLETED"].includes(consultation.stage)
    const proposal = showProposal && consultation.current_proposal_version !== null
      ? consultation.proposals.find((candidate) => candidate.version === consultation.current_proposal_version) ?? null
      : null
    const progress = progressOf(consultation.requirements)
    const final = page ? latestFinal(page) : undefined
    const latest = page?.revisions.at(-1)

    return {
      id: consultation.id,
      stage: consultation.stage,
      messages: consultation.messages.slice(-MAX_VIEW_MESSAGES).map((message) => ({
        role: message.role,
        content: message.content,
        kind: (message.kind ?? "reply") as MessageKind,
      })),
      suggestions: consultation.suggestions,
      requirements: Object.entries(consultation.requirements.fields).map(([field, entry]) => ({
        field: field as RequirementField,
        label: FIELD_LABELS[field as RequirementField],
        value: entry.value,
        status: entry.status,
      })),
      industry_label: industryLabel(consultation.requirements.industry_id) ?? consultation.requirements.fields.industry?.value ?? null,
      progress,
      ready_for_review: canPresentProposal(consultation.requirements),
      proposal: proposal
        ? {
            title: proposal.title,
            solution_type: proposal.solution_type,
            summary: proposal.summary,
            components: proposal.components,
            offerings: proposal.offerings,
            human_oversight: proposal.human_oversight,
            open_questions: proposal.open_questions,
            assumptions: proposal.assumptions,
            version: proposal.version,
            status: proposal.status,
            offerings_detail: proposal.offerings.map((offering) => ({
              ...offering,
              name: offeringName(offering.offering_id) ?? offering.offering_id,
            })),
          }
        : null,
      page: page && final ? pageRef(page, final) : null,
      draft_page: page && latest && latest.status === "draft" ? pageRef(page, latest) : null,
      degraded: consultation.degraded,
      limits: {
        max_message_length: MAX_MESSAGE_LENGTH,
        turns_remaining: Math.max(0, this.config.maxTurnsPerConsultation - consultation.turn_count),
      },
    }
  }
}

function latestFinal(page: GeneratedPageRecord): PageRevision | undefined {
  return [...page.revisions].reverse().find((revision) => revision.status === "final")
}

function pageRef(page: GeneratedPageRecord, revision: PageRevision): PublicPageRef {
  const base = `/use-cases/${pageSlug(page.id)}`
  return {
    id: page.id,
    url: revision.status === "draft" ? `${base}?rev=${revision.revision}` : base,
    label: `${revision.industry_label} use case`,
    revision: revision.revision,
    status: revision.status,
  }
}

async function fingerprintOf(requirements: Consultation["requirements"]): Promise<string> {
  const stable = JSON.stringify({
    industry: requirements.industry_id,
    solution: requirements.solution_type,
    fields: Object.entries(requirements.fields)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([field, entry]) => [field, entry.value, entry.status]),
  })
  return hashToken(stable)
}
