import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { getCaseStudies, getCategories } from "@/lib/content";

/**
 * Generated from the same content the routes are, so a new service or case
 * study appears in the sitemap without anyone remembering to add it — which is
 * exactly the indexation failure the SEO service page describes fixing.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, studies] = await Promise.all([getCategories(), getCaseStudies()]);
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/case-studies", priority: 0.8 },
    { path: "/contact", priority: 0.9 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...categories.flatMap((category) => [
      {
        url: `${site.url}/${category.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      },
      ...category.services.map((service) => ({
        url: `${site.url}/${category.slug}/${service.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ]),
    ...studies.map((study) => ({
      url: `${site.url}/case-studies/${study.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
