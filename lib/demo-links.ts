export const demoLinks = [
  "/use-cases/government#demo",
  "/use-cases/education#demo",
]

export function openNextDemo() {
  const storedDemoIndex = window.localStorage.getItem("myos-demo-index")
  const lastDemoIndex =
    storedDemoIndex === null ? -1 : Number(storedDemoIndex)
  const nextDemoIndex = Number.isInteger(lastDemoIndex)
    ? (lastDemoIndex + 1) % demoLinks.length
    : 0

  window.localStorage.setItem("myos-demo-index", String(nextDemoIndex))
  window.location.href = demoLinks[nextDemoIndex]
}
