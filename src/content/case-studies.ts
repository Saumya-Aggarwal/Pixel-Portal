import type { CaseStudy } from "@/types/content";

/**
 * Placeholder case studies. Structure is real; clients, numbers, and copy are
 * invented for layout purposes and must be replaced before launch.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "northwind-commerce-replatform",
    client: "Northwind Supply",
    industry: "Industrial B2B",
    title: "Replatforming a 40,000-SKU catalogue without losing a day of trade",
    summary:
      "A headless rebuild that cut page load by two thirds and moved a legacy catalogue onto architecture the team can actually extend.",
    services: ["headless-architecture", "ecommerce-platforms", "data-migration-scripting"],
    metrics: [
      { value: 68, suffix: "%", label: "Faster median page load" },
      { value: 41, suffix: "%", label: "Increase in checkout completion" },
      { value: 0, label: "Hours of trading downtime" },
      { value: 40, suffix: "k", label: "SKUs migrated" },
    ],
    challenge:
      "Fifteen years of catalogue data sat in a monolith nobody wanted to touch. Every merchandising change required a developer, and the mobile experience was effectively unusable below 768px.",
    approach: [
      "Audited and mapped the legacy schema before writing a line of migration code, recovering several thousand orphaned product images in the process.",
      "Rebuilt the storefront on Next.js with a headless commerce backend, moving merchandising control to the marketing team.",
      "Ran the migration as a series of reversible dry runs against production snapshots until integrity checks passed cleanly.",
    ],
    featured: true,
  },
  {
    slug: "meridian-health-demand",
    client: "Meridian Health",
    industry: "Healthcare",
    title: "Rebuilding a paid funnel around qualified consultations, not clicks",
    summary:
      "Restructured media across four platforms and rebuilt the measurement layer so spend could be defended to the board.",
    services: ["performance-ads", "performance-tracking-analytics", "search-engine-optimization"],
    metrics: [
      { value: 3, suffix: "x", label: "Qualified consultation volume" },
      { value: 54, suffix: "%", label: "Lower cost per acquisition" },
      { value: 12, label: "Weeks to payback" },
    ],
    challenge:
      "Reported lead volume looked healthy while the clinical team saw no change in bookings. Attribution was double-counting across platforms and nobody trusted the dashboard.",
    approach: [
      "Rebuilt the event taxonomy and moved conversion tracking server-side to end duplicate attribution.",
      "Restructured campaigns around consultation intent rather than form fills.",
      "Tied reporting to the booking system so media decisions ran on clinical outcomes.",
    ],
    featured: true,
  },
  {
    slug: "atlas-marketplace-launch",
    client: "Atlas Trade",
    industry: "Marketplace",
    title: "A two-sided marketplace taken from data model to launch in nineteen weeks",
    summary:
      "Vendor onboarding, faceted search, and commission logic built as one system rather than three bolt-ons.",
    services: ["listing-sites-marketplaces", "custom-web-applications", "api-integrations"],
    metrics: [
      { value: 19, label: "Weeks to public launch" },
      { value: 850, suffix: "+", label: "Vendors onboarded in year one" },
      { value: 96, suffix: "%", label: "Search queries under 200ms" },
    ],
    challenge:
      "A category-defining idea with no technical foundation, and a funding milestone that required a live platform with real vendors on it.",
    approach: [
      "Modelled the relational core first — listings, vendors, payouts — so search and moderation could be built against a stable shape.",
      "Shipped vendor onboarding ahead of the consumer front end to seed supply before launch.",
      "Instrumented commission and payout logic with reconciliation from day one.",
    ],
    featured: true,
  },
  {
    slug: "verdant-organic-search",
    client: "Verdant Living",
    industry: "Consumer Retail",
    title: "Recovering organic traffic after an indexation collapse",
    summary:
      "A technical audit that traced a 70% traffic loss to a sitemap misconfiguration, then rebuilt the crawl foundations.",
    services: ["search-engine-optimization", "ui-ux-mobile-optimization"],
    metrics: [
      { value: 214, suffix: "%", label: "Organic sessions recovered" },
      { value: 9, label: "Weeks to full recovery" },
      { value: 31, suffix: "k", label: "URLs re-indexed" },
    ],
    challenge:
      "Organic traffic fell by seventy percent over two months with no manual action and no obvious cause. Previous agencies had focused on content while the crawl was broken.",
    approach: [
      "Full technical crawl comparison against archived snapshots to isolate exactly when indexation broke.",
      "Remediated the sitemap, canonical, and pagination logic that was excluding most of the catalogue.",
      "Fixed Core Web Vitals failures on mobile templates that were suppressing recovery.",
    ],
  },
  {
    slug: "halcyon-internal-tooling",
    client: "Halcyon Group",
    industry: "Logistics",
    title: "Replacing eleven spreadsheets with one operational platform",
    summary:
      "An internal tool that cut a three-hour daily reconciliation process to under ten minutes.",
    services: ["custom-web-applications", "marketing-seo-tracking-systems", "api-integrations"],
    metrics: [
      { value: 94, suffix: "%", label: "Reduction in reconciliation time" },
      { value: 11, label: "Spreadsheets retired" },
      { value: 6, label: "Systems integrated" },
    ],
    challenge:
      "Operations ran on a fragile web of spreadsheets maintained by two people. Any absence stopped reporting entirely, and errors surfaced days late.",
    approach: [
      "Shadowed the operations team for a week to document the real process rather than the official one.",
      "Built ingestion from the six upstream systems feeding the spreadsheets.",
      "Shipped role-based dashboards with anomaly alerting so errors surface the same day.",
    ],
  },
  {
    slug: "solaris-lifecycle-email",
    client: "Solaris Energy",
    industry: "Renewables",
    title: "A lifecycle programme that turned a dormant list into a revenue channel",
    summary:
      "Segmentation, deliverability repair, and automated flows on a 400,000-address list that had gone quiet.",
    services: ["email-marketing", "performance-tracking-analytics"],
    metrics: [
      { value: 5, suffix: "x", label: "Revenue attributed to email" },
      { value: 22, suffix: "%", label: "Improvement in inbox placement" },
      { value: 400, suffix: "k", label: "Addresses re-engaged" },
    ],
    challenge:
      "A large list with poor deliverability and no segmentation. Broadcast sends were suppressing the domain reputation for every other campaign.",
    approach: [
      "Repaired authentication and ran a staged domain warm-up before sending volume.",
      "Segmented by engagement recency and suppressed the addresses damaging reputation.",
      "Replaced broadcast sends with triggered lifecycle flows.",
    ],
  },
];
