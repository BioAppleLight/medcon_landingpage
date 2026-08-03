"use client"

import { useId, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, SendHorizontal } from "lucide-react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface GeneratedPage {
  url: string
  label: string
}

const INTRO_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Tell me what you're working on — Healthcare, Education, or Government — and I'll build you a personalized use-case page.",
}

export function HeroChat() {
  const inputId = useId()
  const conversationId = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `chat-${Date.now()}`,
  )

  const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedPage, setGeneratedPage] = useState<GeneratedPage | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const nextHistory = [...messages, { role: "user" as const, content: trimmed }]
    setMessages(nextHistory)
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          conversation_id: conversationId.current,
          history: messages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Something went wrong.")
      }

      setMessages([...nextHistory, { role: "assistant", content: data.reply }])
      setGeneratedPage(data.page ? { url: data.page.url, label: data.page.label } : null)
    } catch {
      setError("Couldn't reach the assistant. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-rise mx-auto mt-8 max-w-2xl rounded-2xl border border-white/15 bg-black/55 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl [animation-delay:0.2s]">
      <div
        role="log"
        aria-live="polite"
        className="flex max-h-64 flex-col gap-3 overflow-y-auto px-5 pt-5 text-left"
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
            {error}
          </div>
        )}

        {generatedPage && (
          <Link
            href={generatedPage.url}
            className="self-start inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7c5cfc] via-[#5b7cff] to-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
          >
            View your {generatedPage.label} page
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <form
        className="flex items-center gap-3 p-2 pl-5"
        onSubmit={handleSubmit}
      >
        <label htmlFor={inputId} className="sr-only">
          What are your inquiries?
        </label>
        <input
          id={inputId}
          name="inquiry"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="What are your inquiries?"
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
    </div>
  )
}
