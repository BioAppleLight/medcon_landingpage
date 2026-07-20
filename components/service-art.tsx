/**
 * Small, self-contained animated illustrations for the services grid.
 * Each is a distinct motif for its service instead of a centered stock icon,
 * built from SVG + the animate-* keyframes in globals.css.
 */

export function AutomationArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 160" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5" className="text-primary/40" fill="none">
        <path d="M64 80H140" />
        <path d="M180 80H256" />
        <path d="M140 80V44H180V80" />
        <path d="M140 80V116H180V80" />
      </g>
      <path
        d="M64 80H140"
        className="animate-network-flow text-primary"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M180 80H256"
        className="animate-network-flow text-accent"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        style={{ animationDelay: "0.6s" }}
      />
      {[
        [64, 80],
        [180, 44],
        [180, 116],
        [256, 80],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="7"
          className="animate-node-glow fill-primary"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </svg>
  )
}

export function WebDesignArt({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg border border-primary/25 bg-background/40 ${className ?? ""}`}>
      <div className="flex items-center gap-1.5 border-b border-primary/15 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-accent/60" />
        <span className="h-2 w-2 rounded-full bg-primary/50" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        <div className="col-span-1 row-span-2 h-16 rounded-md bg-primary/15" />
        <div className="col-span-2 h-7 rounded-md bg-accent/15" />
        <div className="col-span-2 h-7 rounded-md bg-primary/10" />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-shimmer-sweep h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  )
}

export function SoftwareDevArt({ className }: { className?: string }) {
  const lines = ["w-3/5", "w-4/5", "w-2/5", "w-3/4", "w-1/2"]
  return (
    <div className={`flex flex-col justify-center gap-2.5 ${className ?? ""}`}>
      {lines.map((w, i) => (
        <div key={i} className={`flex items-center gap-2 ${w}`}>
          <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-accent/50" />
          <span className="h-2.5 flex-1 rounded-sm bg-primary/15" />
          {i === lines.length - 1 && (
            <span className="animate-blink-caret h-3 w-1.5 shrink-0 bg-primary" />
          )}
        </div>
      ))}
    </div>
  )
}

export function AiAgentsArt({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className ?? ""}`}>
      {[0, 0.6, 1.2].map((delay, i) => (
        <span
          key={i}
          className="animate-pulse-ring absolute h-16 w-16 rounded-full border border-primary/50"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
      <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent" />
    </div>
  )
}

export function AvatarsArt({ className }: { className?: string }) {
  const bars = [0.4, 0.75, 1, 0.6, 0.9, 0.5, 0.8]
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className ?? ""}`}>
      {bars.map((h, i) => (
        <span
          key={i}
          className="animate-eq-bar w-2 origin-bottom rounded-full bg-gradient-to-t from-primary to-accent"
          style={{
            height: `${h * 56}px`,
            animationDelay: `${i * 0.12}s`,
            animationDuration: `${0.9 + (i % 3) * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

export function ConsultationArt({ className }: { className?: string }) {
  return (
    <div className={`flex w-full items-center justify-center px-6 ${className ?? ""}`}>
      <div className="relative flex w-full max-w-[220px] items-center justify-between">
        <div className="absolute left-0 right-0 h-px origin-left animate-grow-line bg-gradient-to-r from-primary via-accent to-primary" />
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="animate-pop-in relative z-10 h-3 w-3 rounded-full bg-gradient-to-br from-primary to-accent"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  )
}
