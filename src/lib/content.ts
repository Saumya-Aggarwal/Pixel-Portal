import { caseStudies } from "@/content/case-studies";
import { categories } from "@/content/services";
import { departments, team } from "@/content/team";
import type { CaseStudy, Category, NavItem, Service, TeamMember } from "@/types/content";

/**
 * The content access seam.
 *
 * Pages and components import from here and never from `@/content/*` directly.
 * When the headless CMS lands (SOW §4), only the bodies of these functions
 * change — every call site keeps working. Functions are async for exactly that
 * reason: awaiting them now means the CMS swap does not turn into a refactor
 * of every consuming Server Component.
 */

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}

export async function getService(
  categorySlug: string,
  serviceSlug: string,
): Promise<{ category: Category; service: Service } | undefined> {
  const category = categories.find((c) => c.slug === categorySlug);
  const service = category?.services.find((s) => s.slug === serviceSlug);
  if (!category || !service) return undefined;
  return { category, service };
}

/** Flat list of every service, used for sitemap and cross-linking. */
export async function getAllServices(): Promise<Service[]> {
  return categories.flatMap((c) => c.services);
}

/** Resolve service slugs (as stored on a case study) to full records. */
export async function getServicesBySlugs(slugs: string[]): Promise<Service[]> {
  const all = categories.flatMap((c) => c.services);
  return slugs
    .map((slug) => all.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));
}

export async function getTeam(): Promise<TeamMember[]> {
  return team;
}

export async function getDepartments(): Promise<string[]> {
  return [...departments];
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return caseStudies;
}

export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  return caseStudies.filter((c) => c.featured);
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  return caseStudies.find((c) => c.slug === slug);
}

/** Case studies that touched a given service — powers "related work" rails. */
export async function getCaseStudiesForService(serviceSlug: string): Promise<CaseStudy[]> {
  return caseStudies.filter((c) => c.services.includes(serviceSlug));
}

/** Primary navigation, derived from the service tree so the two cannot drift. */
export async function getNavigation(): Promise<NavItem[]> {
  return [
    { label: "About", href: "/about" },
    ...categories.map((c) => ({
      label: c.title,
      href: `/${c.slug}`,
      categorySlug: c.slug,
    })),
    { label: "Case Studies", href: "/case-studies" },
    { label: "Contact", href: "/contact" },
  ];
}

/** Route helpers — keeps URL shape in one place. */
export const routes = {
  category: (slug: string) => `/${slug}`,
  service: (categorySlug: string, serviceSlug: string) => `/${categorySlug}/${serviceSlug}`,
  caseStudy: (slug: string) => `/case-studies/${slug}`,
};
