"use client"

import { useMemo } from "react"

const governmentAvatarQuestions = [
  "What is the process for business licensing in Dubai?",
  "What are the requirements for residency in the UAE?",
  "How does the Federal Decree-Law No. 45 of 2021 apply to my organization?",
  "What is the process of application of the Golden Visa?",
  "What are the new UAE data protection regulations?",
]

function shuffleQuestions(questions: readonly string[]) {
  return [...questions].sort(() => Math.random() - 0.5)
}

export function GovernmentQuestionPrompts() {
  const questions = useMemo(
    () => shuffleQuestions(governmentAvatarQuestions),
    [],
  )

  return (
    <section className="px-6 pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/10 md:grid-cols-[0.45fr_1fr] md:p-6">
          <div className="flex items-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-4xl">
              Questions MYO&apos;s CAN ANSWER
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {questions.map((question, index) => (
              <div
                key={question}
                className="animate-chat-question-pop ml-auto w-full max-w-3xl rounded-2xl rounded-br-sm border border-border bg-secondary px-5 py-4 text-sm leading-6 text-foreground shadow-lg shadow-black/10 md:text-base"
                style={{
                  animationDelay: `${index * 1.15}s`,
                }}
              >
                {question}
              </div>
            ))}
          </div>
        </div>

        <div id="demo" className="mt-8 scroll-mt-24">
          <h2 className="mb-6 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Demonstration to How MYO&apos;s Revolutizes Governmental Efficiency
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20">
            <video
              className="aspect-video w-full bg-background object-cover"
              controls
              playsInline
              preload="metadata"
              poster="/demos/government-demo.png"
              title="Government use case demo"
            >
              <source
                src="https://pub-9c0b5a57bb204edca8d45fe05db8821c.r2.dev/government-demo.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
