import Image from "next/image"
import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { Reveal, MaskReveal, DrawLine, Parallax } from "@/components/gsap"

export const metadata: Metadata = {
  title: "AI Avatar and Knowledge Graph Technology",
  description:
    "Explore the MYO'S technology behind knowledge-based avatars and structured knowledge graphs.",
  alternates: { canonical: "/technology" },
}

const coreTech = [
  {
    title: "Reasoning Replication",
    desc: "Avatars emulate expert reasoning, not just appearance, grounded in the source material your experts approve.",
  },
  {
    title: "Reinforcement Feedback Loop",
    desc: "Every interaction is summarized and stored, surfacing where learners struggle so the system keeps improving.",
  },
  {
    title: "Multi-Domain Platform",
    desc: "A publisher and subscriber architecture lets one expert's knowledge reach many institutions and domains.",
  },
]

const graphSteps = [
  {
    title: "Convert unstructured data",
    desc: "MYO'S turns policies, manuals, transcripts, SOPs, and training files into structured entities and relationships.",
  },
  {
    title: "Connect operating knowledge",
    desc: "The graph links people, documents, procedures, expertise, and decisions so the avatar understands context, not just keywords.",
  },
  {
    title: "Reason through the graph",
    desc: "When a user asks a question, the avatar follows the right relationships, retrieves approved evidence, and gives a grounded answer.",
  },
]

const intelligenceLayers = [
  {
    eyebrow: "LLM + RAG",
    title: "Retrieval-Augmented Generation",
    desc: "MYO'S combines large language models with retrieval from approved enterprise knowledge, so Ed's answers are generated from the right source material instead of loose model memory.",
    points: [
      "Enterprise document search",
      "Hallucination reduction",
      "Source-grounded responses",
    ],
  },
  {
    eyebrow: "Audio-Based Human Interaction",
    title: "Human-like conversations",
    desc: "Users interact naturally through voice, making expert knowledge feel closer to a real conversation than a static search box.",
    points: [
      "Voice input/output",
      "Personalized avatars",
      "Natural back-and-forth dialogue",
    ],
  },
  {
    eyebrow: "AI Avatar Layer",
    title: "Digital experts",
    desc: "The avatar layer turns institutional knowledge into a recognizable expert presence that can teach, guide, assess, and answer in the organization's own context.",
    points: [
      "Personalized delivery",
      "Organization-specific knowledge",
      "Consistent expert guidance",
    ],
  },
]

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="px-6 pb-20 pt-32 md:pb-28 md:pt-44">
        <div className="mx-auto max-w-6xl">
          <MaskReveal
            as="p"
            className="font-mono text-xs uppercase tracking-[0.35em] text-primary"
          >
            Core Technology
          </MaskReveal>
          <MaskReveal
            as="h1"
            delay={0.08}
            className="mt-8 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
          >
            Knowledge-based avatars that{" "}
            <span className="font-serif italic font-normal text-primary">
              emulate expert reasoning.
            </span>
          </MaskReveal>
          <MaskReveal
            as="p"
            delay={0.16}
            className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground"
          >
            MyOS isn&apos;t a talking head. It&apos;s a knowledge engine wrapped
            in a human-like persona, built to reason like your best expert and
            improve with every conversation.
          </MaskReveal>

          {/* core tech — divided index rows, no boxes */}
          <Reveal as="ul" stagger className="mt-20 grid gap-px md:grid-cols-3">
            {coreTech.map((item) => (
              <li
                key={item.title}
                className="border-t border-border pt-6 md:pr-8"
              >
                <h2 className="text-lg font-medium tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* KNOWLEDGE GRAPHS */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
                Knowledge Graphs
              </p>
              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                How MYO&apos;S creates{" "}
                <span className="font-serif italic font-normal">
                  knowledge graphs.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-pretty leading-8 text-muted-foreground">
                MYO&apos;S organizes scattered institutional knowledge into a
                living graph, so avatars can understand how information,
                responsibilities, procedures, and decisions connect.
              </p>
            </Reveal>
          </div>

          {/* animated connective line + steps */}
          <div className="relative mt-20">
            <DrawLine className="absolute left-0 top-4 hidden h-px w-full bg-gradient-to-r from-primary/60 via-border to-transparent md:block" />
            <Reveal as="ul" stagger className="grid gap-12 md:grid-cols-3 md:gap-8">
              {graphSteps.map((step) => (
                <li key={step.title} className="relative md:pr-8">
                  <span className="relative z-10 hidden h-2 w-2 bg-primary md:block" />
                  <h3 className="text-xl font-semibold tracking-tight md:mt-6">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {step.desc}
                  </p>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* VISUAL GRAPH EXAMPLE */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
              Visual graph examples
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              From scattered inputs to{" "}
              <span className="font-serif italic font-normal">
                connected intelligence.
              </span>
            </h2>
            <p className="mt-6 text-pretty leading-8 text-muted-foreground">
              A user question can move through linked source material, expert
              ownership, procedures, and prior decisions before the avatar
              responds. The graph keeps answers explainable and grounded in the
              organization&apos;s approved knowledge.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="overflow-hidden">
            <Parallax amount={40}>
              <Image
                src="/demos/my-graph.png"
                alt="Visual example of an interactive knowledge graph"
                width={1600}
                height={900}
                className="h-auto w-full"
              />
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* INTELLIGENCE STACK — divided rows, no cards */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
              Intelligence Stack
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              The layers that turn knowledge into{" "}
              <span className="font-serif italic font-normal">
                human interaction.
              </span>
            </h2>
            <p className="mt-6 text-pretty leading-8 text-muted-foreground">
              MYO&apos;S connects retrieval, voice, and avatar delivery into one
              system, so organizations can give users source-grounded answers
              through a natural expert interface.
            </p>
          </Reveal>

          <Reveal as="ul" stagger className="mt-16 border-t border-border">
            {intelligenceLayers.map((layer) => (
              <li
                key={layer.title}
                className="grid gap-6 border-b border-border py-10 md:grid-cols-[0.9fr_1.1fr] md:gap-12"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                    {layer.eyebrow}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                    {layer.title}
                  </h3>
                </div>
                <div>
                  <p className="text-pretty leading-7 text-muted-foreground">
                    {layer.desc}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                    {layer.points.map((point) => (
                      <li
                        key={point}
                        className="text-sm text-foreground/80 before:mr-2 before:text-primary before:content-['—']"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
