const partners = [
  "Burjeel Hospital",
  "NYUAD ARC",
  "Yale",
  "NYU",
  "Charles University",
  "TU Berlin",
  "University of Amsterdam",
]

export function Partners() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by leading institutions
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {partners.map((partner) => (
            <span
              key={partner}
              className="text-lg font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
