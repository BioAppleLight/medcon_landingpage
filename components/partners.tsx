const partners = [
  "Bory Hospital",
  "Roosevelt Hospital",
  "University Hospital of Bratislava",
  "Kramáre Hospital",
  "Navan Clinic",
]

export function Partners() {
  // duplicate the list so the marquee can loop seamlessly
  const loop = [...partners, ...partners]

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <p className="eyebrow">
          Pilot partners who showed interest
        </p>

        <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-x-12 group-hover:[animation-play-state:paused]">
            {loop.map((partner, i) => (
              <span
                key={`${partner}-${i}`}
                className="whitespace-nowrap text-lg font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
                aria-hidden={i >= partners.length}
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
