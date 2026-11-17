"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Link2, MessageSquareText } from "lucide-react"

/**
 * The strip above a consultant-generated page: draft labelling, revision history, and — for the
 * owner — a way back to the consultation and a share link. Sharing goes through the server,
 * which rotates the link's secret each time.
 */
export function GeneratedPageToolbar({
  draft,
  isOwner,
  revision,
  revisions,
  basePath,
  pageId,
}: {
  draft: boolean
  isOwner: boolean
  revision: number
  revisions: { revision: number; status: "draft" | "final" }[]
  basePath: string
  pageId: string
}) {
  const [shareState, setShareState] = useState<"idle" | "working" | "copied" | "error">("idle")

  async function share() {
    setShareState("working")
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "share", page_id: pageId }),
      })
      const data = (await response.json()) as { share_url?: string }
      if (!response.ok || !data.share_url) throw new Error("share failed")
      await navigator.clipboard.writeText(new URL(data.share_url, window.location.origin).toString())
      setShareState("copied")
    } catch {
      setShareState("error")
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {draft && (
        <div
          role="note"
          className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100"
        >
          <strong className="font-semibold">Draft preview.</strong> This page reflects your consultation so far and will
          change as you refine your requirements. Nothing is final until you confirm the proposal.
        </div>
      )}

      {isOwner && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-1">
            Private page · revision {revision}
            {draft ? " (draft)" : ""}
          </span>
          {revisions.length > 1 && (
            <nav aria-label="Page revisions" className="flex flex-wrap items-center gap-1">
              {revisions.map((item) => (
                <Link
                  key={item.revision}
                  href={`${basePath}?rev=${item.revision}`}
                  aria-current={item.revision === revision ? "page" : undefined}
                  className={`rounded-full px-2.5 py-1 text-xs transition-colors hover:bg-primary/10 hover:text-foreground ${
                    item.revision === revision ? "bg-primary/15 text-foreground" : ""
                  }`}
                >
                  v{item.revision}
                  {item.status === "draft" ? " draft" : ""}
                </Link>
              ))}
            </nav>
          )}
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <MessageSquareText className="h-3.5 w-3.5" />
            Refine in the consultation
          </Link>
          {!draft && (
            <button
              type="button"
              onClick={() => void share()}
              disabled={shareState === "working"}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-50"
            >
              {shareState === "copied" ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
              {shareState === "copied"
                ? "Share link copied"
                : shareState === "error"
                  ? "Couldn't create link"
                  : "Copy share link"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
