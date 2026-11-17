"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatInput } from "@/components/chat/chat-input"
import { ProposalCard } from "@/components/chat/proposal-card"
import { STAGE_LABELS, useConsultation } from "@/components/chat/use-consultation"
import type { RequirementStatus } from "@/lib/consultation/types"

const STATUS_STYLES: Record<RequirementStatus, string> = {
  confirmed: "border-emerald-400/30 text-emerald-300",
  inferred: "border-sky-400/30 text-sky-300",
  proposed: "border-amber-400/30 text-amber-300",
  unresolved: "border-border text-muted-foreground",
}

/**
 * The full-screen consultation view. It shares its backend and its consultation with the hero
 * widget on the About page — a visitor can start in one and continue in the other.
 */
export function ChatShell() {
  const consultation = useConsultation()
  const { view, pendingMessage, streamingReply, busy, error } = consultation
  const scrollRef = useRef<HTMLDivElement>(null)

  const visitorHasSpoken = Boolean(pendingMessage) || (view?.messages.some((message) => message.role === "user") ?? false)
  const canType = busy === null && view !== null && view.stage !== "GENERATION"

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [view, pendingMessage, streamingReply, busy])

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
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <ChatSidebar onNewChat={() => void consultation.reset()} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
          <span className="text-sm font-medium text-muted-foreground">
            MYO&apos;S AI Digital Twin Consultant
          </span>
          {view && (
            <span className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground">
              {STAGE_LABELS[view.stage]} · {view.progress.covered}/{view.progress.total} essentials
            </span>
          )}
        </header>

        <div className="flex min-h-0 flex-1">
          {/* conversation / hero */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-2xl px-4 py-8">
              {!visitorHasSpoken ? (
                <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
                  <BrandLogo className="h-14 w-14" />
                  <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                    Every expert,{" "}
                    <span className="font-serif italic font-normal text-primary">
                      one message away.
                    </span>
                  </h1>
                  <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
                    {view?.messages[0]?.content ?? "Connecting to the consultant…"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {view?.messages.map((message, index) => {
                    if (message.role === "user") {
                      return (
                        <div key={index} className="flex justify-end">
                          <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                            {message.content}
                          </div>
                        </div>
                      )
                    }
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <BrandLogo className="mt-0.5 h-7 w-7 shrink-0" />
                        <div
                          className={`max-w-[80%] whitespace-pre-line rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed ${
                            message.kind === "notice" ? "border border-border bg-card/40 text-muted-foreground" : "bg-secondary"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    )
                  })}

                  {pendingMessage && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                        {pendingMessage}
                      </div>
                    </div>
                  )}

                  {streamingReply && (
                    <div className="flex items-start gap-3">
                      <BrandLogo className="mt-0.5 h-7 w-7 shrink-0" />
                      <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-sm leading-relaxed">
                        {streamingReply}
                      </div>
                    </div>
                  )}

                  {busy !== null && busy !== "revise" && !streamingReply && (
                    <div className="flex items-start gap-3">
                      <BrandLogo className="mt-0.5 h-7 w-7 shrink-0" />
                      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-secondary px-4 py-3.5">
                        <Dot />
                        <Dot delay="0.15s" />
                        <Dot delay="0.3s" />
                      </div>
                    </div>
                  )}

                  {view?.proposal && (
                    <ProposalCard
                      view={view}
                      busy={busy}
                      onConfirm={() => void consultation.confirm()}
                      onPreview={() => void consultation.preview()}
                      onRevise={() => void consultation.revise()}
                    />
                  )}

                  {view && ((view.page && !view.proposal) || view.draft_page) && (
                    <div className="flex flex-wrap gap-3">
                      {view.page && !view.proposal && (
                        <Link
                          href={view.page.url}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                        >
                          {view.page.label}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                      {view.draft_page && (
                        <Link
                          href={view.draft_page.url}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm transition-colors hover:border-primary/50 hover:bg-primary/10"
                        >
                          <FileText className="h-4 w-4" />
                          Open draft preview
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-2xl bg-red-500/15 px-4 py-2.5 text-sm text-red-200">
                  {error}
                  <button
                    type="button"
                    onClick={() => void consultation.retry()}
                    className="ml-2 underline underline-offset-2 hover:text-white"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* what has been captured so far */}
          {view && view.requirements.length > 0 && (
            <aside aria-label="Captured requirements" className="hidden w-72 shrink-0 overflow-y-auto border-l border-border bg-card/30 p-5 lg:block">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-primary">What I&apos;ve captured</p>
              <dl className="mt-4 grid gap-3 text-sm">
                {view.requirements.map((requirement) => (
                  <div key={requirement.field}>
                    <dt className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      {requirement.label}
                      <span className={`rounded-full border px-2 py-0.5 text-[0.65rem] ${STATUS_STYLES[requirement.status]}`}>
                        {requirement.status}
                      </span>
                    </dt>
                    <dd className="mt-1 leading-snug">{requirement.value}</dd>
                  </div>
                ))}
              </dl>
              {view.progress.missing.length > 0 && (
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                  Still to cover: {view.progress.missing.join(", ")}.
                </p>
              )}
            </aside>
          )}
        </div>

        {/* input */}
        <div className="border-t border-border px-4 py-4">
          <ChatInput
            onSend={(text) => void consultation.send(text)}
            onSuggestion={handleSuggestion}
            suggestions={busy === null ? (view?.suggestions ?? []) : []}
            disabled={!canType}
            maxLength={view?.limits.max_message_length}
            placeholder="Describe your digital twin idea…"
          />
          {view?.degraded && (
            <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-muted-foreground">
              Running in simplified mode — answers follow a structured guide.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
      style={{ animationDelay: delay }}
    />
  )
}
