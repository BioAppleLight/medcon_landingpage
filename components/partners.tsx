const partners = [
  "Burjeel Hospital",
  "NYUAD ARC",
  "Presight",
  "Khalifa Fund",
  "Marina Health",
]

export function Partners() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Piloting with leading partners
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
