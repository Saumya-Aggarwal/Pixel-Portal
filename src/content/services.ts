import type { Category, Service } from "@/types/content";

/**
 * The service tree. Descriptions are taken verbatim from the SOW's service
 * tables (§3 A/B/C); taglines and deliverables are placeholder copy for
 * layout purposes and should be replaced with real positioning.
 *
 * This array is the single source for routing, generateStaticParams, the
 * header mega-menu, and every service card on the site.
 */

const digitalMarketing: Service[] = [
  {
    slug: "social-media-handling",
    category: "digital-marketing",
    title: "Social Media Handling",
    tagline: "Own the feed, not just a slot in it.",
    description:
      "Comprehensive brand strategy, operational calendars, and cross-platform organic growth.",
    icon: "share",
    deliverables: [
      "Channel strategy and voice guidelines",
      "Monthly operational content calendar",
      "Creative production and copywriting",
      "Community management and response SLAs",
      "Organic growth reporting",
    ],
    // Exemplar page — carries the full block set. Every other service falls
    // back to the base template until its sections are authored.
    sections: [
      {
        type: "narrative",
        eyebrow: "The problem",
        heading: "Most brands post. Very few compound.",
        body: [
          "Posting on a schedule is not a strategy. Without a governing point of view, a content calendar becomes an obligation to fill space — and audiences learn to scroll past it.",
          "We start from positioning: what this brand is uniquely credible saying, and which of its audiences is actually worth reaching. Everything downstream — formats, cadence, creative direction — is a consequence of that decision rather than a template.",
        ],
      },
      {
        type: "metrics",
        heading: "What operating this way tends to produce",
        items: [
          { value: 3, suffix: "x", label: "Median engagement rate lift" },
          { value: 62, suffix: "%", label: "Reduction in cost per qualified follow" },
          { value: 18, label: "Months of average retained partnership" },
          { value: 40, suffix: "+", label: "Assets shipped per month" },
        ],
      },
      {
        type: "process",
        heading: "How the engagement runs",
        steps: [
          {
            title: "Audit & positioning",
            description:
              "Two weeks inside your channels and your competitors'. We leave with a documented voice, a content thesis, and an honest read on what is currently not working.",
          },
          {
            title: "Calendar architecture",
            description:
              "Recurring formats and pillars mapped to a monthly operating calendar, so production becomes repeatable instead of improvised.",
          },
          {
            title: "Production & publishing",
            description:
              "Creative, copy, scheduling, and community response handled end to end by a named team you actually meet.",
          },
          {
            title: "Read & adjust",
            description:
              "Monthly review against the metrics that map to pipeline — not vanity reach. Formats that underperform get cut, not defended.",
          },
        ],
      },
      {
        type: "faq",
        heading: "Common questions",
        items: [
          {
            q: "Do you work with our in-house team or replace it?",
            a: "Both arrangements are common. We can run the function end to end, or operate as the strategy and production layer while your team owns community and publishing.",
          },
          {
            q: "What is the minimum engagement length?",
            a: "Three months. Organic growth compounds, and anything shorter measures noise rather than the work.",
          },
          {
            q: "Which platforms do you cover?",
            a: "Instagram, LinkedIn, YouTube, TikTok, and X as standard. Platform mix is decided during the audit rather than assumed up front.",
          },
        ],
      },
    ],
  },
  {
    slug: "performance-ads",
    category: "digital-marketing",
    title: "Performance Ads",
    navTitle: "Performance Ads",
    tagline: "Google, Meta, LinkedIn, and YouTube — run as one funnel.",
    description:
      "Targeted ad set creation, media buying, and full-funnel lead generation campaigns.",
    icon: "target",
    deliverables: [
      "Account structure and audience architecture",
      "Creative testing matrix",
      "Media buying and budget pacing",
      "Landing page conversion support",
      "Weekly performance reporting",
    ],
  },
  {
    slug: "search-engine-optimization",
    category: "digital-marketing",
    title: "Search Engine Optimization",
    navTitle: "SEO",
    tagline: "Fix the crawl, then earn the ranking.",
    description:
      "Technical SEO audits, sitemap indexing troubleshooting, and on-page optimization.",
    icon: "search",
    deliverables: [
      "Full technical crawl and audit",
      "Sitemap and indexation remediation",
      "Core Web Vitals remediation plan",
      "On-page and schema optimization",
      "Content gap and keyword mapping",
    ],
  },
  {
    slug: "email-marketing",
    category: "digital-marketing",
    title: "Email Marketing Campaigns",
    navTitle: "Email Marketing",
    tagline: "The channel you own outright.",
    description:
      "Custom responsive HTML mailers and automated promotional workflows.",
    icon: "envelope",
    deliverables: [
      "Responsive HTML template system",
      "Lifecycle and automation flows",
      "Segmentation strategy",
      "Deliverability and domain warm-up",
      "A/B testing programme",
    ],
  },
  {
    slug: "performance-tracking-analytics",
    category: "digital-marketing",
    title: "Performance Tracking & Analytics",
    navTitle: "Tracking & Analytics",
    tagline: "Decisions need numbers you can defend.",
    description:
      "Implementation of cross-platform tracking sheets and conversion architecture.",
    icon: "chart",
    deliverables: [
      "Measurement plan and event taxonomy",
      "GA4, GTM, and server-side tagging",
      "Cross-platform attribution modelling",
      "Conversion architecture implementation",
      "Executive reporting dashboards",
    ],
  },
];

const websiteDevelopment: Service[] = [
  {
    slug: "informative-corporate-sites",
    category: "website-development",
    title: "Informative & Corporate Sites",
    navTitle: "Corporate Sites",
    tagline: "The site your sales team is glad to send.",
    description:
      "Sleek, multi-page corporate profiles and landing page layouts.",
    icon: "browser",
    deliverables: [
      "Information architecture and wireframes",
      "High-fidelity design system",
      "Responsive multi-page build",
      "CMS-backed editing for marketing",
      "Analytics and SEO foundations",
    ],
  },
  {
    slug: "ecommerce-platforms",
    category: "website-development",
    title: "E-Commerce Platforms",
    navTitle: "E-Commerce",
    tagline: "Storefronts built to survive a launch day.",
    description:
      "Robust storefronts with integrated payment gateways and inventory management.",
    icon: "cart",
    deliverables: [
      "Catalogue and merchandising architecture",
      "Payment gateway integration",
      "Inventory and fulfilment sync",
      "Checkout conversion optimization",
      "Load and resilience testing",
    ],
  },
  {
    slug: "listing-sites-marketplaces",
    category: "website-development",
    title: "Listing Sites & Marketplaces",
    navTitle: "Marketplaces",
    tagline: "Two-sided platforms, and the data model underneath.",
    description:
      "Complex database-driven directories and multi-vendor platforms.",
    icon: "grid",
    deliverables: [
      "Relational data modelling",
      "Faceted search and filtering",
      "Multi-vendor onboarding flows",
      "Moderation and trust tooling",
      "Payout and commission logic",
    ],
  },
  {
    slug: "headless-architecture",
    category: "website-development",
    title: "Headless Architecture",
    navTitle: "Headless (Next.js)",
    tagline: "Decoupled front ends on Next.js, React, and Vercel.",
    description:
      "High-performance, decoupled frontend builds using Next.js, React, and Vercel.",
    icon: "layers",
    deliverables: [
      "Next.js App Router architecture",
      "Headless CMS modelling and integration",
      "Edge rendering and caching strategy",
      "Design system in React",
      "CI/CD on Vercel with preview environments",
    ],
  },
  {
    slug: "ui-ux-mobile-optimization",
    category: "website-development",
    title: "UI/UX & Mobile Optimization",
    navTitle: "UI/UX & Mobile",
    tagline: "Rescue work for sites that break below 768px.",
    description:
      "Resolving layout rendering, mobile component optimization, and custom CSS styling.",
    icon: "device",
    deliverables: [
      "Cross-device rendering audit",
      "Layout and reflow remediation",
      "Component-level mobile optimization",
      "Custom CSS refactor",
      "Accessibility conformance pass",
    ],
  },
];

const softwareDevelopment: Service[] = [
  {
    slug: "custom-web-applications",
    category: "software-development",
    title: "Custom Web Applications",
    navTitle: "Web Applications",
    tagline: "Bespoke SaaS and the tools that run your operation.",
    description: "Bespoke SaaS platforms and internal operational tools.",
    icon: "app",
    deliverables: [
      "Product discovery and scoping",
      "Architecture and data modelling",
      "Full-stack application build",
      "Role-based access and auth",
      "Handover documentation and training",
    ],
  },
  {
    slug: "marketing-seo-tracking-systems",
    category: "software-development",
    title: "Marketing & SEO Tracking Systems",
    navTitle: "Tracking Systems",
    tagline: "Your reporting stack, built rather than bought.",
    description:
      "Custom-built dashboards to monitor multi-platform workflows and data integration.",
    icon: "gauge",
    deliverables: [
      "Multi-platform data ingestion",
      "Warehouse and transformation layer",
      "Custom dashboard interfaces",
      "Alerting and anomaly detection",
      "Scheduled reporting exports",
    ],
  },
  {
    slug: "data-migration-scripting",
    category: "software-development",
    title: "Data Migration & Scripting",
    navTitle: "Data & Scripting",
    tagline: "Move the data without losing the history.",
    description:
      "Python-based scripting for database migrations, site audits, and missing asset troubleshooting.",
    icon: "database",
    deliverables: [
      "Source auditing and field mapping",
      "Python migration tooling",
      "Dry-run and rollback procedures",
      "Missing asset recovery",
      "Post-migration integrity verification",
    ],
  },
  {
    slug: "api-integrations",
    category: "software-development",
    title: "API Integrations",
    navTitle: "API Integrations",
    tagline: "Make the systems you already pay for talk.",
    description:
      "Seamless connection of third-party CRMs, ERPs, and marketing automation tools.",
    icon: "plug",
    deliverables: [
      "Integration mapping and sequencing",
      "CRM and ERP connectors",
      "Webhook and queue infrastructure",
      "Retry, backoff, and failure handling",
      "Monitoring and observability",
    ],
  },
];

export const categories: Category[] = [
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    eyebrow: "Demand",
    headline: "Attention, earned and paid for on purpose.",
    description:
      "Strategy, media, and measurement run as one system — so growth is repeatable rather than lucky.",
    icon: "megaphone",
    services: digitalMarketing,
  },
  {
    slug: "website-development",
    title: "Website Development",
    eyebrow: "Platform",
    headline: "Websites that carry commercial weight.",
    description:
      "From corporate profiles to multi-vendor marketplaces, built on architecture that will not need replacing next year.",
    icon: "browser",
    services: websiteDevelopment,
  },
  {
    slug: "software-development",
    title: "Software Development",
    eyebrow: "Systems",
    headline: "Software shaped around how you actually work.",
    description:
      "Bespoke applications, data pipelines, and integrations for teams who have outgrown off-the-shelf tools.",
    icon: "terminal",
    services: softwareDevelopment,
  },
];
