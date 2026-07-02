export const useCases = [
  {
    id: "healthcare",
    label: "Healthcare",
    icon: "stethoscope",
    headline: "AI doctor avatars for post-surgery recovery.",
    summary:
      "Give patients clear, consistent guidance after discharge while keeping clinical teams focused on the moments that truly need human attention.",
    points: [
      "Personalized video guidance for rehab exercises",
      "Patients ask questions and get answers any time",
      "Automatic red-flag alerts escalate to real clinicians",
    ],
    pageSections: [
      {
        title: "Recovery and Clinical Guideline support",
        body: "Patients can revisit care instructions, rehabilitation routines, and medication guidance through a familiar AI doctor avatar.",
      },
      {
        title: "Clinical escalation",
        body: "Risk signals and concerning answers can be surfaced quickly so clinicians spend time where their judgment matters most.",
      },
      {
        title: "Always available",
        body: "Patients get support outside check-in hours, across languages, and without waiting for a follow-up call.",
      },
    ],
    outcomes: ["Faster Staff and Employee Onboarding", "Fewer repeated calls", "Accurate medical knowledge and stimulation"],
    image: "/demos/healthcare-demo.png",
    demoVideo: null,
    alt: "AI doctor avatar guiding a patient through recovery exercises",
  },
  {
    id: "education",
    label: "Education",
    icon: "graduation-cap",
    headline: "AI Oral Examinator avatars that never stop teaching.",
    summary:
      "Extend a professor's presence beyond the lecture hall with trusted as your personal oral examinor, style-aware AI support for students.",
    points: [
      "Answers student questions with accurate sources",
      "Personalized teaching style",
      "Available across time zones and 24/7 for students",
    ],
    pageSections: [
      {
        title: "Professor-aligned answers",
        body: "Students receive guidance that reflects the course materials, preferred explanations, and tone of the instructor.",
      },
      {
        title: "Study help on demand",
        body: "The avatar can explain concepts, prepare learners for assessments, and support students who need help outside class time.",
      },
      {
        title: "Integration with LMS platforms ",
        body: "Supporting Brightspace, Canvas, Moodles, and other LMS platforms makes education easier to scale across campuses, online cohorts, and international programs.",
      },
    ],
    outcomes: ["Higher engagement", "More scalable office hours", "Consistent course support"],
    image: "/demos/education-demo.png",
    demoVideo: {
      src: "/demos/education-demo.mp4",
      poster: "/demos/education-demo.png",
      title: "Education use case demo",
    },
    alt: "AI professor avatar answering a student's question",
  },
  {
    id: "government",
    label: "Government",
    icon: "landmark",
    headline: "AI training assistants for government at scale.",
    summary:
      "Standardize training, assessments, and citizen-facing knowledge delivery across departments and regions.",
    points: [
      "Run oral assessments and certification prep",
      "Deliver consistent training to entire departments",
      "Supports multiple languages out of the box",
    ],
    pageSections: [
      {
        title: "Consistent training",
        body: "Teams receive the same approved guidance every time, reducing drift between trainers, departments, and locations.",
      },
      {
        title: "Assessment readiness",
        body: "Interactive oral practice helps staff prepare for certifications, compliance checks, and public-service scenarios.",
      },
      {
        title: "Accessible delivery",
        body: "Government knowledge can be delivered in multiple languages through an approachable, always-on assistant.",
      },
    ],
    outcomes: ["Standardized delivery", "Faster onboarding", "Retains Knowledge across staff turnovers"],
    image: "/demos/government-demo.png",
    demoVideo: null,
    alt: "AI government training assistant running an oral assessment",
  },
] as const

export type UseCase = (typeof useCases)[number]
export type UseCaseId = UseCase["id"]

export function getUseCase(id: string) {
  return useCases.find((useCase) => useCase.id === id)
}
