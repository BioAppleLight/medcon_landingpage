"use client"

import {
  createContext,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { VARIANT_THEME, type Variant } from "@/lib/variants"
import { OnboardingChat } from "@/components/onboarding-chat"

type AdaptiveContextValue = {
  variant: Variant
  onboarded: boolean
  finish: (variant: Variant) => void
  reset: () => void
}

const AdaptiveContext = createContext<AdaptiveContextValue | null>(null)

export function useAdaptive() {
  const ctx = useContext(AdaptiveContext)
  if (!ctx) {
    throw new Error("useAdaptive must be used within an AdaptiveProvider")
  }
  return ctx
}

export function AdaptiveProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<Variant>("healthcare")
  const [onboarded, setOnboarded] = useState(true)

  function finish(next: Variant) {
    setVariant(next)
    setOnboarded(true)
  }

  function reset() {
    setOnboarded(false)
  }

  const themeStyle = VARIANT_THEME[variant] as CSSProperties

  return (
    <AdaptiveContext.Provider value={{ variant, onboarded, finish, reset }}>
      <div style={themeStyle} className="min-h-screen">
        <div
          aria-hidden={!onboarded}
          className={`transition-[filter,opacity] duration-700 ${
            onboarded
              ? ""
              : "pointer-events-none select-none blur-xl saturate-[0.85]"
          }`}
        >
          {children}
        </div>
        {!onboarded && <OnboardingChat />}
      </div>
    </AdaptiveContext.Provider>
  )
}
