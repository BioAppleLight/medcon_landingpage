import type { Metadata } from "next"
import { PitchDeckOpening } from "@/components/pitch-deck-opening"

export const metadata: Metadata = {
  title: "Burjeel × MyOS Pitch Deck",
  description: "A purpose-built Burjeel × MyOS patient recovery pitch.",
  alternates: { canonical: "/use-cases/pitch-deck" },
}

export default function PitchDeckPage() {
  return <PitchDeckOpening />
}
