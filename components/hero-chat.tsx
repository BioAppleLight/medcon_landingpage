"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUp, Expand, FileText, RotateCcw } from "lucide-react"
import { ProposalCard } from "@/components/chat/proposal-card"
import { STAGE_LABELS, useConsultation } from "@/components/chat/use-consultation"

/**
 * The chat surface on the About hero. It renders whatever the consultation backend returns —
 * it holds no conversation logic, no reply content, and no rule about what is required.
 * The same consultation continues in the full-screen view at /chat.
 */
export function HeroChat() {
  const threadRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState("")
  const consultation = useConsultation()
  const { view, pendingMessage, streamingReply, busy, error } = consultation

  const maxLength = view?.limits.max_message_length ?? 2_000
  const thinking = busy === "message" && !streamingReply
  const canType = busy === null && view !== null && view.stage !== "GENERATION"

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" })
  }, [view, pendingMessage, streamingReply, busy])

  function submit(event: FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || !canType) return
    setDraft("")
    void consultation.send(text)
  }

  function handleSuggestion(suggestion: string) {
    if (!canType) return
    if (suggestion === "Confirm" && view?.stage === "REVIEW") return void consultation.confirm()
    if (suggestion === "Preview a draft page") return void consultation.preview()
    if (suggestion === "Change something" && (view?.stage === "REVIEW" || view?.stage === "COMPLETED")) {
      return void consultation.revise()
    }
    void consultation.send(suggestion)
  }

  return (
    <div className="animate-rise mx-auto mt-8 max-w-2xl rounded-2xl border border-white/15 bg-black/55 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl [animation-delay:0.2s]">
      {view && (
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-2.5 text-left text-xs text-white/55">
          <span className="font-medium text-white/75">{STAGE_LABELS[view.stage]}</span>
          <div
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Consultation progress"
            aria-valuemin={0}
            aria-valuemax={view.progress.total}
            aria-valuenow={view.progress.covered}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7c5cfc] to-[#4db6e8] transition-[width] duration-500"
              style={{ width: `${(view.progress.covered / view.progress.total) * 100}%` }}
            />
          </div>
          <Link href="/chat" className="inline-flex items-center gap-1 transition-colors hover:text-white">
            <Expand className="h-3.5 w-3.5" />
            Full view
          </Link>
        </div>
      )}

      <div
        ref={threadRef}
        role="log"
        aria-live="polite"
        className="flex max-h-80 flex-col gap-3 overflow-y-auto px-5 pt-5 text-left"
      >
        {view?.messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[85%] whitespace-pre-line rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
              message.role === "assistant"
                ? message.kind === "notice"
                  ? "self-start border border-white/10 bg-white/[0.04] text-white/70"
                  : "self-start bg-white/10 text-white/90"
                : "self-end bg-primary text-primary-foreground"
            }`}
          >
            {message.content}
          </div>
        ))}

        {pendingMessage && (
          <div className="max-w-[85%] self-end whitespace-pre-line rounded-xl bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
            {pendingMessage}
          </div>
        )}

        {streamingReply && (
          <div className="max-w-[85%] self-start whitespace-pre-line rounded-xl bg-white/10 px-4 py-2.5 text-sm leading-relaxed text-white/90">
            {streamingReply}
          </div>
        )}

        {(thinking || busy === "loading" || busy === "confirm" || busy === "preview") && (
          <div className="self-start rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white/60">
            {busy === "confirm" ? "Generating your page…" : busy === "preview" ? "Drafting a preview…" : "Thinking…"}
          </div>
        )}

        {error && (
          <div className="self-start rounded-xl bg-red-500/15 px-4 py-2.5 text-sm text-red-200">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void consultation.retry()}
              className="ml-2 underline underline-offset-2 hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {view?.proposal && (
          <ProposalCard
            view={view}
            busy={busy}
            compact
            onConfirm={() => void consultation.confirm()}
            onPreview={() => void consultation.preview()}
            onRevise={() => void consultation.revise()}
          />
        )}

        {view && ((view.page && !view.proposal) || view.draft_page) && (
          <div className="flex flex-wrap gap-2 self-start">
            {view.page && !view.proposal && (
              <Link
                href={view.page.url}
                aria-label={`Open your use case page: ${view.page.label}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
              >
                {view.page.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {view.draft_page && (
              <Link
                href={view.draft_page.url}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm text-white/85 transition-colors hover:border-primary/60 hover:bg-primary/20"
              >
                <FileText className="h-4 w-4" />
                Open draft preview
              </Link>
            )}
          </div>
        )}

        {view && view.suggestions.length > 0 && busy === null && (
          <div className="flex flex-wrap gap-2 self-start pb-1">
            {view.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestion(suggestion)}
                disabled={!canType}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-primary/60 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 p-2 pl-5">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={maxLength}
          disabled={!canType}
          aria-label="Describe your digital twin idea"
          placeholder={view?.page ? "Ask for a change to your proposal…" : "Describe what you'd like your AI expert to do…"}
          className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/45 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!canType || !draft.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => void consultation.reset()}
          disabled={busy !== null || !view}
          className="mr-1 inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Start over
        </button>
      </form>
    </div>
  )
}
