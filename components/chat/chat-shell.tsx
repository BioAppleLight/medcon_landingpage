"use client"

import { useEffect, useRef, useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatInput } from "@/components/chat/chat-input"
import { ExpertResult } from "@/components/chat/expert-result"
import { detectVariant, type Variant } from "@/lib/variants"

type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "assistant"; text: string }
  | { id: number; role: "result"; variant: Variant }

let counter = 0
const nextId = () => ++counter

const GREETING =
  "Hi, I'm your MyOS guide. Tell me what you're working on and I'll match you with the right expert."

export function ChatShell() {
  const [messages, setMessages] = useState<Message[]>([])
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const started = messages.length > 0

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, thinking])

  function reset() {
    setMessages([])
    setThinking(false)
  }

  function send(text: string) {
    if (thinking) return
    const userMsg: Message = { id: nextId(), role: "user", text }
    setMessages((m) => [...m, userMsg])
    setThinking(true)

    const variant = detectVariant(text)

    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: "assistant",
          text: `Got it. Based on what you shared, here's a ${variant} expert built for exactly this.`,
        },
        { id: nextId(), role: "result", variant },
      ])
      setThinking(false)
    }, 1100)
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <ChatSidebar onNewChat={reset} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="text-sm font-medium text-muted-foreground">
            MyOS Assistant
          </span>
          <button
            type="button"
            className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Connect workspace
          </button>
        </header>

        {/* conversation / hero */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl px-4 py-8">
            {!started ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
                <BrandLogo className="h-14 w-14" />
                <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                  Every expert,{" "}
                  <span className="font-serif italic font-normal text-primary">
                    one message away.
                  </span>
                </h1>
                <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
                  {GREETING}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {messages.map((msg) => {
                  if (msg.role === "result") {
                    return <ExpertResult key={msg.id} variant={msg.variant} />
                  }
                  if (msg.role === "user") {
                    return (
                      <div key={msg.id} className="flex justify-end">
                        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                          {msg.text}
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div key={msg.id} className="flex items-start gap-3">
                      <BrandLogo className="mt-0.5 h-7 w-7 shrink-0" />
                      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-sm leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  )
                })}

                {thinking && (
                  <div className="flex items-start gap-3">
                    <BrandLogo className="mt-0.5 h-7 w-7 shrink-0" />
                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-secondary px-4 py-3.5">
                      <Dot />
                      <Dot delay="0.15s" />
                      <Dot delay="0.3s" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* input */}
        <div className="border-t border-border px-4 py-4">
          <ChatInput onSend={send} disabled={thinking} />
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
