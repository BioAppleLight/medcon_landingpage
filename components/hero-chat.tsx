"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, RotateCcw, SendHorizontal } from "lucide-react"
import {
  resetPersonalizedUseCase,
  savePersonalizedIndustryLabel,
  savePersonalizedUseCaseUrl,
} from "@/lib/personalized-use-case-link"

/**
 * The chat surface. It renders whatever the backend returns and sends back the visitor's
 * choice plus the session state — it holds no question tree, no reply content, and no rule
 * about which answers are required.
 */

interface Choice {
  id: string
  label: string
}

interface Question {
  id: string
  text: string
  choices: Choice[]
  allow_free_text: boolean
}

interface SessionState {
  session_id: string
  current_node: string | null
  answers: Record<string, string>
  asked: string[]
}

interface GeneratedPage {
  slug: string
  url: string
  label: string
}

interface ChatResponse {
  status: "asking" | "unrecognized" | "ready" | "restart"
  reply: string
  state: SessionState
  next_question: Question | null
  page: GeneratedPage | null
  done: boolean
  industry_label: string | null
}

interface Bubble {
  role: "assistant" | "user"
  content: string
}

interface ChatRequestBody {
  choice_id?: string
  message?: string
  state?: SessionState | null
}

export function HeroChat() {
  const inputId = useId()
  const threadRef = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)

  const [messages, setMessages] = useState<Bubble[]>([])
  const [question, setQuestion] = useState<Question | null>(null)
  const [session, setSession] = useState<SessionState | null>(null)
  const [page, setPage] = useState<GeneratedPage | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = useCallback(async (body: ChatRequestBody, echo?: string) => {
    setIsLoading(true)
    setError(null)
    if (echo) setMessages((current) => [...current, { role: "user", content: echo }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = (await response.json()) as ChatResponse & {
        error?: { message?: string }
      }

      if (!response.ok) throw new Error(data?.error?.message ?? "Something went wrong.")

      setMessages((current) => [...current, { role: "assistant", content: data.reply }])
      setSession(data.state)
      setQuestion(data.next_question)
      setPage(data.page)
      if (data.status === "restart") {
        resetPersonalizedUseCase()
      } else {
        if (data.industry_label) savePersonalizedIndustryLabel(data.industry_label)
        if (data.page) savePersonalizedUseCaseUrl(data.page.url)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn't reach the assistant.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Ask the backend for the opening question — the frontend does not know what it is.
  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    void send({})
  }, [send])

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, question, page])

  function handleChoice(choice: Choice) {
    if (isLoading || !session) return
    void send({ choice_id: choice.id, state: session }, choice.label)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading || !session) return
    setInput("")
    void send({ message: trimmed, state: session }, trimmed)
  }

  function handleRestart() {
    if (isLoading || !session) return
    setMessages([])
    setPage(null)
    setInput("")
    void send({ message: "start over", state: session })
  }

  return (
    <div className="animate-rise mx-auto mt-8 max-w-2xl rounded-2xl border border-white/15 bg-black/55 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl [animation-delay:0.2s]">
      <div
        ref={threadRef}
        role="log"
        aria-live="polite"
        className="flex max-h-72 flex-col gap-3 overflow-y-auto px-5 pt-5 text-left"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
              message.role === "assistant"
                ? "self-start bg-white/10 text-white/90"
                : "self-end bg-primary text-primary-foreground"
            }`}
          >
            {message.content}
          </div>
        ))}

        {isLoading && (
          <div className="self-start rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white/60">
            Thinking…
          </div>
        )}

        {error && (
          <div className="self-start rounded-xl bg-red-500/15 px-4 py-2.5 text-sm text-red-200">
            <span>{error}</span>
            {!session && (
              <button
                type="button"
                onClick={() => void send({})}
                className="ml-2 underline underline-offset-2 hover:text-white"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {question && !isLoading && (
          <div className="self-start">
            <p className="text-sm leading-relaxed text-white/90">{question.text}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {question.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleChoice(choice)}
                  disabled={isLoading}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-primary/60 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {page && (
          <Link
            href={page.url}
            aria-label={`Open your use case page: ${page.label}`}
            className="self-start inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
          >
            {page.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3 p-2 pl-5">
        {question?.allow_free_text ? (
          <form className="flex flex-1 items-center gap-3" onSubmit={handleSubmit}>
            <label htmlFor={inputId} className="sr-only">
              Or describe it in your own words
            </label>
            <input
              id={inputId}
              name="inquiry"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Or type it in your own words…"
              maxLength={500}
              disabled={isLoading}
              className="min-w-0 flex-1 bg-transparent py-3 text-base text-white outline-none placeholder:text-white/55 disabled:opacity-60"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={isLoading || input.trim().length === 0}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:scale-105 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <span className="flex-1 py-3 text-sm text-white/55">
            {page ? "Your page is ready." : "Pick an option to continue."}
          </span>
        )}

        <button
          type="button"
          onClick={handleRestart}
          disabled={isLoading || !session}
          className="mr-1 inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Start over
        </button>
      </div>
    </div>
  )
}
