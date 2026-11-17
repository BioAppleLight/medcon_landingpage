"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ConsultationView } from "@/lib/consultation/types"
import {
  resetPersonalizedUseCase,
  savePersonalizedIndustryLabel,
  savePersonalizedUseCaseUrl,
} from "@/lib/personalized-use-case-link"

/**
 * The one client for the consultation API, shared by every chat surface (the hero widget and
 * the full-screen /chat view). State lives on the server, keyed by an HttpOnly cookie, so a
 * refresh — or switching between the two surfaces — resumes the same consultation.
 */

type BusyAction = "loading" | "message" | "confirm" | "preview" | "revise" | "reset"

interface ApiErrorBody {
  error?: { code?: string; message?: string }
}

export interface ConsultationController {
  view: ConsultationView | null
  /** The visitor's message while it is in flight, before the server echoes it back. */
  pendingMessage: string | null
  /** Reply text streaming in, before the validated reply replaces it. */
  streamingReply: string | null
  busy: BusyAction | null
  error: string | null
  send: (message: string) => Promise<void>
  confirm: () => Promise<void>
  preview: () => Promise<void>
  revise: () => Promise<void>
  reset: () => Promise<void>
  retry: () => Promise<void>
}

async function readJson(response: Response): Promise<{ consultation?: ConsultationView | null } & ApiErrorBody> {
  try {
    return (await response.json()) as { consultation?: ConsultationView | null } & ApiErrorBody
  } catch {
    return {}
  }
}

async function post(body: Record<string, unknown>): Promise<ConsultationView | null> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await readJson(response)
  if (!response.ok) throw new Error(data.error?.message ?? "Something went wrong. Please try again.")
  return data.consultation ?? null
}

/** Parses a server-sent-events body, calling `onEvent` per complete event. */
async function readEvents(response: Response, onEvent: (event: string, data: unknown) => void) {
  const reader = response.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  let buffer = ""
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let boundary = buffer.indexOf("\n\n")
    while (boundary >= 0) {
      const block = buffer.slice(0, boundary)
      buffer = buffer.slice(boundary + 2)
      let event = "message"
      let data = ""
      for (const line of block.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim()
        else if (line.startsWith("data:")) data += line.slice(5).trim()
      }
      try {
        onEvent(event, data ? JSON.parse(data) : null)
      } catch {
        // ignore a malformed event; the final event is authoritative
      }
      boundary = buffer.indexOf("\n\n")
    }
  }
}

export function useConsultation(): ConsultationController {
  const [view, setView] = useState<ConsultationView | null>(null)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const [streamingReply, setStreamingReply] = useState<string | null>(null)
  const [busy, setBusy] = useState<BusyAction | null>("loading")
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)
  const lastFailed = useRef<(() => Promise<void>) | null>(null)

  // Keep the site navigation's "your use case" link in step with the server.
  useEffect(() => {
    if (!view) return
    if (view.page) {
      if (view.industry_label) savePersonalizedIndustryLabel(view.industry_label)
      savePersonalizedUseCaseUrl(view.page.url)
    }
  }, [view])

  const run = useCallback(async (action: BusyAction, task: () => Promise<void>) => {
    setBusy(action)
    setError(null)
    try {
      await task()
      lastFailed.current = null
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn't reach the consultant.")
      lastFailed.current = () => run(action, task)
    } finally {
      setBusy(null)
      setPendingMessage(null)
      setStreamingReply(null)
    }
  }, [])

  const load = useCallback(
    () =>
      run("loading", async () => {
        const response = await fetch("/api/chat", { method: "GET", cache: "no-store" })
        const data = await readJson(response)
        if (response.ok && data.consultation) {
          setView(data.consultation)
          return
        }
        setView(await post({ action: "start" }))
      }),
    [run],
  )

  useEffect(() => {
    if (started.current) return
    started.current = true
    void load()
  }, [load])

  const send = useCallback(
    (message: string) =>
      run("message", async () => {
        const text = message.trim()
        if (!text) return
        setPendingMessage(text)

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
          body: JSON.stringify({ action: "message", message: text }),
        })

        if (!(response.headers.get("content-type") ?? "").includes("text/event-stream")) {
          const data = await readJson(response)
          if (!response.ok) throw new Error(data.error?.message ?? "Something went wrong. Please try again.")
          setView(data.consultation ?? null)
          return
        }

        let failure: string | null = null
        await readEvents(response, (event, data) => {
          if (event === "delta") {
            const delta = (data as { text?: string } | null)?.text ?? ""
            setStreamingReply((current) => (current ?? "") + delta)
          } else if (event === "reset") {
            setStreamingReply(null)
          } else if (event === "final") {
            setView((data as { consultation?: ConsultationView | null }).consultation ?? null)
          } else if (event === "error") {
            failure = (data as ApiErrorBody | null)?.error?.message ?? "Something went wrong. Please try again."
          }
        })
        if (failure) throw new Error(failure)
      }),
    [run],
  )

  const confirm = useCallback(
    () =>
      run("confirm", async () => {
        const version = view?.proposal?.version
        if (!version) return
        setView(await post({ action: "confirm", proposal_version: version }))
      }),
    [run, view?.proposal?.version],
  )

  const preview = useCallback(
    () =>
      run("preview", async () => {
        setView(await post({ action: "preview" }))
      }),
    [run],
  )

  const revise = useCallback(
    () =>
      run("revise", async () => {
        setView(await post({ action: "revise" }))
      }),
    [run],
  )

  const reset = useCallback(
    () =>
      run("reset", async () => {
        resetPersonalizedUseCase()
        setView(await post({ action: "reset" }))
      }),
    [run],
  )

  const retry = useCallback(async () => {
    if (lastFailed.current) await lastFailed.current()
    else await load()
  }, [load])

  return { view, pendingMessage, streamingReply, busy, error, send, confirm, preview, revise, reset, retry }
}

export const STAGE_LABELS: Record<ConsultationView["stage"], string> = {
  DISCOVERY: "Discovery",
  REQUIREMENTS: "Requirements",
  SOLUTION_DESIGN: "Solution design",
  REVIEW: "Review",
  CONFIRMATION: "Confirmation",
  GENERATION: "Generating",
  COMPLETED: "Completed",
}
