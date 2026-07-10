import Image from "next/image"
const partners = [
  {
    name: "Bory Hospital",
    image: "/partners/bory-hospital.png",
  },
  {
    name: "F.D. Roosevelt University Hospital With Policlinic Banska Bystrica",
    image: "/partners/roosevelt-hospital2.png",
  },
  {
    name: "University Hospital of Bratislava",
    image: "/partners/university-hospital1.png",
  },
  {
    name: "Navan Clinic",
    image: "/partners/navan-clinic.png",
  },
]

export function Partners() {
  // duplicate the list so the marquee can loop seamlessly
  const loop = [...partners, ...partners]

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <p className="eyebrow">
          Trusted by Hospitals and Clinics
        </p>

        <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-x-12 group-hover:[animation-play-state:paused]">
            {loop.map((partner, i) => (
              <span
                key={`${partner.name}-${i}`}
                className="flex items-center gap-3 whitespace-nowrap text-lg font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
                aria-hidden={i >= partners.length}
              >
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={100}
                  height={56}
                  className={
                    partner.name === "Navan Clinic"
                      ? "h-14 w-14 rounded-full object-cover opacity-90 transition-opacity hover:opacity-100"
                      : "h-14 w-auto object-contain opacity-90 transition-opacity hover:opacity-100"
                  }
                />
                {partner.name !== "Kramáre Hospital" &&
                  partner.name !== "Bory Hospital" &&
                  !partner.name.startsWith("F.D. Roosevelt") &&
                  partner.name !== "University Hospital of Bratislava" &&
                  partner.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
  
