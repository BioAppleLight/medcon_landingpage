"use client"

import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { useAdaptive } from "@/components/adaptive-provider"
import { detectVariant, type Variant } from "@/lib/variants"

type Message = { role: "ai" | "user"; text: string }
type Phase = "intent" | "clarify" | "done"

const WELCOME =
  "Welcome to MyOS. What kind of expertise are you looking for today?"

export function OnboardingChat() {
  const { finish } = useAdaptive()
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: WELCOME },
  ])
  const [input, setInput] = useState("")
  const [phase, setPhase] = useState<Phase>("intent")
  const [typing, setTyping] = useState(false)

  const variantRef = useRef<Variant>("business")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, typing])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function replyWithAI(text: string, after?: () => void) {
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { role: "ai", text }])
      after?.()
    }, 1100)
  }

  function handleSend() {
    const text = input.trim()
    if (!text || typing || phase === "done") return

    setMessages((prev) => [...prev, { role: "user", text }])
    setInput("")

    if (phase === "intent") {
      variantRef.current = detectVariant(text)
      setPhase("clarify")
      replyWithAI(
        "Got it. To better tailor your experience, are you looking for personal assistance, or something for your organization?",
      )
    } else if (phase === "clarify") {
      setPhase("done")
      replyWithAI("Perfect, setting up your workspace now...", () => {
        window.setTimeout(() => finish(variantRef.current), 1000)
      })
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/40" />

      <div className="animate-rise relative flex h-[34rem] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <BrandLogo className="h-8 w-8" />
          <div>
            <p className="text-sm font-medium leading-tight">MyOS Assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </p>
          </div>
        </div>

        {/* message history */}
        <div
          ref={scrollRef}
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] text-pretty rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-secondary text-secondary-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-secondary px-4 py-3">
                <Dot className="[animation-delay:0ms]" />
                <Dot className="[animation-delay:150ms]" />
                <Dot className="[animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {/* input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2 border-t border-border px-4 py-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={phase === "done"}
            placeholder={
              phase === "done" ? "Setting things up..." : "Type your message..."
            }
            aria-label="Chat message"
            className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing || phase === "done"}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`h-2 w-2 animate-bounce rounded-full bg-muted-foreground/70 ${className}`}
    />
  )
}
