import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { useCases } from "@/lib/use-cases"

const routes = [
  "/about", "/about/mission-vision", "/product", "/services", "/technology", "/technology/core", "/technology/apis",
  "/partnerships", "/pricing", "/team", "/contact",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "/about" ? "weekly" : "monthly",
    priority: route === "/about" ? 1 : route === "/product" ? 0.9 : 0.7,
  }))
  const useCasePages: MetadataRoute.Sitemap = useCases
    .filter((useCase) => useCase.id !== "template")
    .map((useCase) => ({
      url: `${SITE_URL}/use-cases/${useCase.id}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }))
  return [...staticPages, ...useCasePages]
}
