import Image from "next/image"

export function Mission() {
  return (
    <section
      id="mission"
      aria-labelledby="mission-heading"
      className="grid overflow-hidden border-y border-border/70 bg-black lg:aspect-[1672/941] lg:grid-cols-[51%_49%]"
    >
      <div className="relative aspect-[852/941] overflow-hidden lg:aspect-auto">
        <Image
          src="/mission.png"
          alt="AI-assisted brain scan analysis and interactive human intelligence visualization"
          width={1672}
          height={941}
          sizes="(min-width: 1024px) 51vw, 100vw"
          className="absolute inset-0 h-full w-[196.25%] max-w-none"
        />
      </div>

      <div className="relative flex items-center overflow-hidden bg-[#261078] px-7 py-16 sm:px-12 lg:px-[10.5%] lg:py-[8%]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_36%,rgba(100,43,255,0.48),transparent_48%),linear-gradient(135deg,rgba(26,11,94,0.2),rgba(43,15,132,0.85))]" />

        <div className="relative z-10 max-w-2xl text-white">
          <h2
            id="mission-heading"
            className="text-balance text-[clamp(2.25rem,3.35vw,4rem)] font-light leading-[1.3] tracking-[-0.025em]"
          >
            Our mission is to <strong className="font-bold">preserve</strong>,{" "}
            <strong className="font-bold">improve</strong>, and{" "}
            <strong className="font-bold">democratize</strong> human expertise.
          </h2>

          <p className="mt-[8%] text-pretty text-[clamp(1.25rem,2vw,2.25rem)] font-light leading-[1.45] tracking-[-0.02em]">
            We transform the world&apos;s greatest knowledge into{" "}
            <strong className="font-bold">interactive intelligence</strong> that
            is accessible to everyone, regardless of age, race, location, or
            profession.
          </p>

          <p className="mt-[5%] text-[clamp(1.3rem,2.1vw,2.35rem)] font-light leading-[1.35]">
            <strong className="font-bold">We empower every individual</strong>
            <br /> in the world.
          </p>

          <a
            href="https://www.myos.sk/"
            className="mt-[8%] inline-flex min-h-14 min-w-52 items-center justify-center bg-[#090519] px-8 py-4 text-lg font-bold text-white shadow-[0_10px_30px_rgba(5,2,20,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:bg-[#12082d] hover:shadow-[0_16px_40px_rgba(124,92,252,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Our Platform
          </a>
        </div>
      </div>
    </section>
  )
}
