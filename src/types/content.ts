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
 *
 * Prose fields are optional throughout. Structural content — card titles, tag
 * chips, step names, row labels — is authored ahead of the copy that explains
 * it, so a block renders complete and animated with its narrative still
 * pending. A block never emits a placeholder; it simply omits the paragraph.
 * See docs/CONTENT-TODO.md for what is outstanding.
 */
export type ServiceSection =
  | { type: "narrative"; eyebrow: string; heading: string; body?: string[] }
  | { type: "metrics"; heading: string; items: Metric[]; live?: boolean }
  | { type: "process"; heading: string; steps: ProcessStep[] }
  | { type: "faq"; heading: string; items: { q: string; a: string }[] }
  | { type: "pillars"; items: Pillar[] }
  | { type: "capabilities"; heading: string; intro?: string; items: Capability[] }
  | { type: "tags"; heading: string; intro?: string; items: string[] }
  | { type: "checklist"; eyebrow: string; heading: string; body?: string[]; items: string[] }
  | { type: "comparison"; heading: string; intro?: string; columns: [string, string]; rows: ComparisonRow[] };

/** Three-across value proposition, directly under the hero. */
export interface Pillar {
  icon: IconName;
  title: string;
  body?: string;
}

/** One card in the six-across capabilities grid. */
export interface Capability {
  icon: IconName;
  title: string;
  body?: string;
}

/**
 * A single line of the comparison table. `ours` and `theirs` are booleans
 * rather than free text so the column stays a scannable ✓/— rail; anything
 * needing nuance belongs in the row label.
 */
export interface ComparisonRow {
  label: string;
  ours: boolean;
  theirs: boolean;
}

/**
 * Animated hero visual for a service page.
 *
 * Two generations live here at once, deliberately.
 *
 * **Bespoke depictions** draw the actual subject — a phone running a feed, a
 * browser assembling a page, a queue dropping a message. They carry their own
 * labels, because a scrubber reading `0:15 / 1:00` is part of the drawing
 * rather than content anyone would edit in a CMS.
 *
 * **Archetypes** are the earlier generation: abstract shapes configured from
 * content. They are being replaced one service at a time. Deleting them before
 * their last consumer migrates would strip the hero visual from nine pages
 * mid-flight, so they stay until wave 2 — and the exhaustive `switch` in
 * `ServiceHeroVisual` turns that eventual cleanup into a compile error rather
 * than a silently blank frame.
 */
export type ServiceVisual =
  // Bespoke depictions.
  | { kind: "social-feed" }
  | { kind: "page-assembly" }
  | { kind: "live-dashboard" }
  | { kind: "cart-checkout" }
  | { kind: "queue-retry" }
  // Archetypes — retiring.
  | { kind: "beams"; left: VisualNode[]; right: VisualNode[] }
  | { kind: "funnel"; stages: string[]; callouts?: string[] }
  | { kind: "dashboard"; panels: string[]; kpis: Metric[] }
  | { kind: "orbit"; nodes: string[] }
  | { kind: "stack"; layers: string[] };

export interface VisualNode {
  label: string;
  /** Optional figure shown beside the label, e.g. "6.3x" or "12,450+". */
  value?: string;
}

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
  /** Optional for the same reason the other prose fields are — see above. */
  description?: string;
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
  /** Animated hero visual. Absent falls back to the plain typographic hero. */
  visual?: ServiceVisual;
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
