import type { Metadata } from "next"
import { ChatShell } from "@/components/chat/chat-shell"

export const metadata: Metadata = {
  title: "MyOS Assistant · Find your expert",
  description:
    "Chat with the MyOS guide to get matched with an AI expert built for healthcare, education, or business.",
}

export default function ChatPage() {
  return <ChatShell />
}
