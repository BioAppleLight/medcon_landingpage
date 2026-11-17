import type { Metadata } from "next"
import { ChatShell } from "@/components/chat/chat-shell"

export const metadata: Metadata = {
  title: "AI Digital Twin Consultation",
  description: "Shape an AI digital twin solution with MYO'S AI consultant and generate a personalized proposal page.",
  // A visitor's private consultation — nothing here is useful to a search engine.
  robots: { index: false, follow: false },
}

export default function ChatPage() {
  return <ChatShell />
}
