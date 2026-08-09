import Link from "next/link"
import { ArrowRight, Home } from "lucide-react"

const linkFocusClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/** Rendered when a use-case slug is missing, malformed, or no longer supported. */
export default function UseCaseNotFound() {
  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(124,92,252,0.16),transparent_42%)]"
      />

      <header className="border-b border-border/70 px-6 py-5">
        <nav aria-label="Primary" className="mx-auto flex w-full max-w-6xl items-center">
          <Link
            href="/"
            className={`${linkFocusClasses} rounded-sm text-lg font-semibold tracking-tight`}
          >
            <span className="sr-only">Return to </span>
            MYO&apos;S
            <span className="sr-only"> home page</span>
          </Link>
        </nav>
      </header>

      <section
        aria-labelledby="not-found-title"
        className="flex flex-1 items-center px-6 py-20 sm:py-28"
      >
        <div className="mx-auto w-full max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Error 404
          </p>

          <h1
            id="not-found-title"
            className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
          >
            This use case could not be found.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            The link may be incomplete, malformed, or out of date. Browse the available use cases
            or start a new personalized conversation from the About page.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/#use-cases"
              className={`${linkFocusClasses} inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90`}
            >
              Browse use cases
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>

            <Link
              href="/about"
              className={`${linkFocusClasses} inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-6 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-primary/10`}
            >
              Build a personalized use case
            </Link>
          </div>

          <Link
            href="/"
            className={`${linkFocusClasses} mt-8 inline-flex items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground`}
          >
            <Home aria-hidden="true" className="h-4 w-4" />
            Return home
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/70 px-6 py-5 text-center text-sm text-muted-foreground">
        <p>MYO&apos;S AI expert experiences</p>
      </footer>
    </main>
  )
}
