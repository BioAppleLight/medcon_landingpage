"use client"

import { useState, type FormEvent } from "react"
import { ArrowUp, Mic, Sparkles, Paperclip } from "lucide-react"

const SUGGESTIONS = [
  "Recovery guidance",
  "Exam prep",
  "Policy training",
  "Ask an expert",
]

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void
  disabled?: boolean
}) {
  const [value, setValue] = useState("")

  function submit(e: FormEvent) {
    e.preventDefault()
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue("")
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSend(s)}
            disabled={disabled}
            className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="rounded-2xl border border-border bg-card/80 p-2 shadow-2xl backdrop-blur"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) submit(e)
            }}
            rows={1}
            disabled={disabled}
            aria-label="Chat message"
            placeholder="Ask me anything..."
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-50"
          />
        </div>

        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Paperclip className="h-3.5 w-3.5" />
              Attach
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Deep think
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Voice input"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={disabled || !value.trim()}
              aria-label="Send message"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
