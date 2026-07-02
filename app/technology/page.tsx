import Image from "next/image"
import type { Metadata } from "next"
import {
  BrainCircuit,
  Bot,
  FileText,
  GitBranch,
  Mic,
  Network,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"

export const metadata: Metadata = {
  title: "Technology | MYO'S",
  description:
    "Explore the MYO'S technology behind knowledge-based avatars and structured knowledge graphs.",
}

const coreTech = [
  {
    icon: FileText,
    title: "Reasoning Replication",
    desc: "Avatars emulate expert reasoning, not just appearance, grounded in the source material your experts approve.",
  },
  {
    icon: RefreshCw,
    title: "Reinforcement Feedback Loop",
    desc: "Every interaction is summarized and stored, surfacing where learners struggle so the system keeps improving.",
  },
  {
    icon: Network,
    title: "Multi-Domain Platform",
    desc: "A publisher and subscriber architecture lets one expert's knowledge reach many institutions and domains.",
  },
]

const graphSteps = [
  {
    icon: FileText,
    title: "Convert unstructured data",
    desc: "MYO'S turns policies, manuals, transcripts, SOPs, and training files into structured entities and relationships.",
  },
  {
    icon: GitBranch,
    title: "Connect operating knowledge",
    desc: "The graph links people, documents, procedures, expertise, and decisions so the avatar understands context, not just keywords.",
  },
  {
    icon: BrainCircuit,
    title: "Reason through the graph",
    desc: "When a user asks a question, the avatar follows the right relationships, retrieves approved evidence, and gives a grounded answer.",
  },
]

const intelligenceLayers = [
  {
    eyebrow: "2. LLM + RAG",
    icon: Search,
    title: "Retrieval-Augmented Generation",
    desc: "MYO'S combines large language models with retrieval from approved enterprise knowledge, so answers are generated from the right source material instead of loose model memory.",
    points: [
      "Enterprise document search",
      "Hallucination reduction",
      "Source-grounded responses",
    ],
  },
  {
    eyebrow: "3. Audio-Based Human Interaction",
    icon: Mic,
    title: "Human-like conversations",
    desc: "Users interact naturally through voice, making expert knowledge feel closer to a real conversation than a static search box.",
    points: [
      "Voice input/output",
      "Personalized avatars",
      "Natural back-and-forth dialogue",
    ],
  },
  {
    eyebrow: "4. AI Avatar Layer",
    icon: Bot,
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

      <section className="px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="eyebrow text-primary">Core Technology</span>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              Knowledge-based avatars that emulate expert reasoning.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
              MyOS isn&apos;t a talking head. It&apos;s a knowledge engine
              wrapped in a human-like persona, built to reason like your best
              expert and improve with every conversation.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {coreTech.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-6"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15">
                    <Icon className="h-5 w-5 text-accent" />
                  </span>
                  <div>
                    <h2 className="font-medium">{item.title}</h2>
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/40 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="eyebrow text-primary">Knowledge Graphs</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              How MYO&apos;S creates knowledge graphs.
            </h2>
            <p className="mt-5 text-pretty leading-8 text-muted-foreground">
              MYO&apos;S organizes scattered institutional knowledge into a
              living graph, so avatars can understand how information,
              responsibilities, procedures, and decisions connect.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {graphSteps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className="rounded-2xl border border-border bg-background/60 p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="eyebrow text-primary">Visual graph examples</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              From scattered inputs to connected intelligence.
            </h2>
            <p className="mt-5 text-pretty leading-8 text-muted-foreground">
              A user question can move through linked source material, expert
              ownership, procedures, and prior decisions before the avatar
              responds. The graph keeps answers explainable and grounded in the
              organization&apos;s approved knowledge.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10">
            <Image
              src="/demos/my-graph.png"
              alt="Visual example of an interactive knowledge graph"
              width={1600}
              height={900}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/40 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="eyebrow text-primary">Intelligence Stack</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              The layers that turn knowledge into human interaction.
            </h2>
            <p className="mt-5 text-pretty leading-8 text-muted-foreground">
              MYO&apos;S connects retrieval, voice, and avatar delivery into one
              system, so organizations can give users source-grounded answers
              through a natural expert interface.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {intelligenceLayers.map((layer) => {
              const Icon = layer.icon
              return (
                <article
                  key={layer.title}
                  className="flex h-full flex-col rounded-2xl border border-border bg-background/60 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow text-primary">{layer.eyebrow}</p>
                      <h3 className="mt-4 text-xl font-semibold tracking-tight">
                        {layer.title}
                      </h3>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {layer.desc}
                  </p>

                  <ul className="mt-6 grid gap-3">
                    {layer.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <ShieldCheck className="h-3 w-3" />
                        </span>
                        <span className="text-sm leading-6 text-muted-foreground">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
