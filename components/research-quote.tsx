"use client"

import { Reveal } from "@/components/motion-primitives"

export function ResearchQuote() {
  return (
    <section className="quote-band" aria-label="Research quotation">
      <Reveal className="quote-band__inner">
        <div className="quote-band__rule" aria-hidden="true" />
        <div className="quote-band__content">
          <p className="quote-band__quote">
            Personalization is a new frontier in LLM development, whereby
            models are tailored to individuals. In principle, this could
            minimize cultural hegemony, enhance usefulness and broaden access.
          </p>

          <div className="quote-band__citation">
            <p className="quote-band__source-label">SOURCE</p>
            <p className="quote-band__paper-title">
              The benefits, risks and bounds of personalizing the alignment of
              large language models to individuals
            </p>
            <p className="quote-band__venue">arXiv, 2026</p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
