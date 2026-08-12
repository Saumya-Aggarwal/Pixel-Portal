/**
 * Content model.
 *
 * These interfaces are the schema source of truth. They are shaped to become
 * Sanity documents verbatim — every field here maps to a field there, so the
 * CMS migration is a change to the body of lib/content.ts and nothing else.
 */

/** Key into the hand-authored SVG set in components/icons. */
export type IconName =
  | "megaphone"
  | "browser"
  | "terminal"
  | "share"
  | "target"
  | "search"
  | "envelope"
  | "chart"
  | "layers"
  | "cart"
  | "grid"
  | "bolt"
  | "device"
  | "app"
  | "gauge"
  | "database"
  | "plug";

/** Bento placement hint. Consumed as grid span classes, not raw CSS. */
export type BentoSize = "feature" | "wide" | "tall" | "standard";

/**
 * Optional rich blocks for a service page. Services without `sections` render
 * the base template; adding blocks raises a page to full fidelity without
 * forking the route component.
 */
export type ServiceSection =
  | { type: "narrative"; eyebrow: string; heading: string; body: string[] }
  | { type: "metrics"; heading: string; items: Metric[] }
  | { type: "process"; heading: string; steps: ProcessStep[] }
  | { type: "faq"; heading: string; items: { q: string; a: string }[] };

export interface Metric {
  /** Numeric portion, animated by CountUp. */
  value: number;
  /** Rendered after the number, e.g. "%", "x", "+". */
  suffix?: string;
  prefix?: string;
  label: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  /** Parent category slug — denormalised so a Service can route on its own. */
  category: string;
  title: string;
  /** Compact label for nav and cards where the full title is too long. */
  navTitle?: string;
  tagline: string;
  /** Verbatim from the SOW's service tables. */
  description: string;
  icon: IconName;
  deliverables: string[];
  sections?: ServiceSection[];
}

export interface Category {
  slug: string;
  title: string;
  eyebrow: string;
  headline: string;
  description: string;
  icon: IconName;
  services: Service[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  size: BentoSize;
  /** Absent until real photography lands; Portrait falls back to initials. */
  image?: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  title: string;
  summary: string;
  /** Service slugs this engagement covered. */
  services: string[];
  metrics: Metric[];
  challenge: string;
  approach: string[];
  featured?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  /** Present on the three service categories; drives the mega-menu. */
  categorySlug?: string;
}
