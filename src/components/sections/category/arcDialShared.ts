/**
 * Shared stations and spec-strip copy for ArcDial.
 *
 * Desktop (arc + window) and the phone stage (stepper + window + strip) are
 * different compositions of the same five services, so the content lives here
 * once. Window interiors are recomposed per canvas — they do not share markup.
 */

/**
 * A scope ladder. On desktop that puts e-commerce at the apex of the arc, which
 * is the dominant position and the reason the order is this one — the page is
 * headed "commercial weight". The phone stage has no apex and reads the same
 * sequence top to bottom, so the order has to hold on its own either way.
 */
export const STATIONS = [
  {
    slug: "informative-corporate-sites",
    title: "Corporate Sites",
    stepper: "Corp",
    lines: ["Component system", "CMS integration", "SEO foundations"],
    stat: ["Templates", "12"],
  },
  {
    slug: "ui-ux-mobile-optimization",
    title: "UI/UX & Mobile",
    stepper: "Mobile",
    lines: ["Responsive reflow", "Touch targets", "CSS refactor"],
    stat: ["Breakpoints", "4"],
  },
  {
    slug: "ecommerce-platforms",
    title: "E-Commerce",
    stepper: "Shop",
    lines: ["Stripe gateway", "ERP sync", "Cart state"],
    stat: ["SKUs", "1,200"],
  },
  {
    slug: "headless-architecture",
    title: "Headless",
    stepper: "Headless",
    lines: ["Content API", "Next.js surfaces", "Edge caching"],
    stat: ["Surfaces", "3"],
  },
  {
    slug: "listing-sites-marketplaces",
    title: "Marketplaces",
    stepper: "Market",
    lines: ["Two-sided auth", "Vendor payouts", "Faceted search"],
    stat: ["Vendors", "480"],
  },
] as const;

export const STOPS = STATIONS.map((_, i) => i / (STATIONS.length - 1));

export const SPEC_ROWS = [
  {
    label: "Architecture",
    values: ["Editorial", "Responsive", "Funnel", "Decoupled", "Two-sided"],
  },
  {
    label: "Tooling",
    values: [
      "Sanity CMS",
      "CSS refactor",
      "Stripe / ERP",
      "Content API",
      "KYC / payouts",
    ],
  },
  {
    label: "Scale",
    values: [
      "10–50 pages",
      "4 breakpoints",
      "10k+ SKUs",
      "Omnichannel",
      "100k+ rows",
    ],
  },
  {
    label: "Performance",
    values: ["Sub-20ms", "99/100 LCP", "Sub-50ms", "Edge renders", "Real-time"],
  },
] as const;

export function hrefFor(slug: string) {
  return `/website-development/${slug}`;
}
