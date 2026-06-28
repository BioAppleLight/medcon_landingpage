"use client"

import { MessageSquarePlus, Compass, Clock, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"

const NAV = [
  { icon: MessageSquarePlus, label: "New chat", href: undefined },
  { icon: Compass, label: "Explore experts", href: "/about" },
  { icon: Clock, label: "History", href: undefined },
  { icon: Settings, label: "Settings", href: undefined },
]

export function ChatSidebar({ onNewChat }: { onNewChat: () => void }) {
  return (
    <aside className="flex w-16 flex-col items-center justify-between border-r border-border bg-card/40 py-5 backdrop-blur">
      <div className="flex flex-col items-center gap-6">
        <BrandLogo className="h-8 w-8" />

        <nav className="flex flex-col items-center gap-1">
          {NAV.map((item, i) => {
            const Icon = item.icon
            const className =
              "flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  title={item.label}
                  className={className}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              )
            }
            return (
              <button
                key={item.label}
                type="button"
                onClick={i === 0 ? onNewChat : undefined}
                aria-label={item.label}
                title={item.label}
                className={className}
              >
                <Icon className="h-5 w-5" />
              </button>
            )
          })}
        </nav>
      </div>

      <button
        type="button"
        aria-label="Sign out"
        title="Sign out"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </aside>
  )
}
