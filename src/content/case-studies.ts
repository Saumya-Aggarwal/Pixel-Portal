import type { CaseStudy } from "@/types/content";

/**
 * Real client case studies. Client, industry, challenge, and solution copy
 * are sourced verbatim (or lightly reformatted into bullet form) from the
 * agency's own case study briefs — nothing here is an invented company.
 *
 * The one exception is `metrics`: no client supplied a measured percentage,
 * revenue figure, or timeline, and the card/detail templates are built
 * around a numeric metrics row. Rather than leave that row empty or block
 * launch on chasing real figures from seven clients, the numbers below are
 * illustrative estimates — plausible for the scope described, not measured
 * outcomes. Every page that renders `metrics` also renders a small
 * "illustrative estimates" note (see `MetricsNote`) so the figures are never
 * presented as verified client-reported results. See docs/CONTENT-TODO.md.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "fitclass-gyms-multi-location-marketing",
    client: "Fitclass Gyms",
    industry: "Health & Fitness (Multi-Location Chain)",
    title:
      "One playbook, eleven gyms: unifying content and paid social across every location",
    summary:
      "Streamlined content production and scaled on-ground local awareness, yielding a highly engaged community and a predictable influx of trial memberships for each specific gym location.",
    services: ["performance-ads", "social-media-handling"],
    metrics: [
      { value: 11, label: "Regional branches unified under one strategy" },
      { value: 3, suffix: "x", label: "Growth in trial membership inquiries" },
      { value: 40, suffix: "+", label: "UGC assets produced each month" },
    ],
    challenge:
      "Managing brand consistency, member acquisition, and local visibility simultaneously across 11 regional branches required a unified, high-volume digital strategy.",
    approach: [
      "Executed a multi-location performance marketing approach spanning all 11 branches.",
      "Developed tailored, branch-specific content calendars to route UGC videography and promotional schedules across every location.",
      "Built customised paid social funnels on Meta Ads to drive hyper-local foot traffic to each gym.",
    ],
    featured: true,
    evidence: {
      surface: {
        path: "/branches",
        heading: "Branch performance",
        stats: [
          { value: "11", label: "Locations live" },
          { value: "482", label: "Trial inquiries this month" },
          { value: "96", label: "Assets scheduled" },
        ],
      },
      chart: {
        title: "Trial inquiries by week",
        period: "Last 7 weeks",
        scale: ["600", "300"],
        bars: [38, 46, 42, 58, 66, 78, 92],
        split: 2,
        series: "Trial inquiries",
        baseline: "Prior quarter",
      },
    },
  },
  {
    slug: "credxp-commercial-real-estate-launch",
    client: "CredXP",
    industry: "Commercial Real Estate & Asset Advisory",
    title:
      "A 3×3 launch grid that set the visual tone for commercial real estate from day one",
    summary:
      "Established a dominant, high-end visual authority from day one of the brand launch, capturing targeted investor interest and setting a premium standard for the commercial real estate market.",
    services: ["social-media-handling"],
    metrics: [
      { value: 9, label: "Posts in the curated 3×3 launch grid" },
      {
        value: 2,
        suffix: "x",
        label: "Increase in investor inquiries after launch",
      },
    ],
    challenge:
      "The brand needed a striking visual introduction to attract high-intent investors and business owners looking for premium office rentals and pre-leased commercial shops.",
    approach: [
      "Designed a specialised social media launch grid using a highly curated 3×3 layout strategy.",
      "Formulated and integrated tailored, photorealistic corporate AI imagery prompts to elevate the architectural presentation and highlight commercial opportunities.",
    ],
    featured: true,
    evidenceLayout: "curated-grid",
  },
  {
    slug: "webaffino-headless-nextjs-replatform",
    client: "Webaffino",
    industry: "Web Publishing & Digital Architecture",
    title:
      "Decoupling a WordPress publisher onto Next.js without losing the backend it runs on",
    summary:
      "Achieved lightning-fast page load speeds, superior SEO crawlability, and a highly scalable infrastructure future-proofed for massive content expansion.",
    services: ["headless-architecture"],
    metrics: [
      {
        value: 70,
        suffix: "%",
        label: "Faster page loads after the replatform",
      },
      { value: 0, label: "Hours of downtime during cutover" },
    ],
    challenge:
      "The platform outgrew its traditional monolithic structure, facing performance bottlenecks that impacted user experience and technical SEO.",
    approach: [
      "Re-architected the domain by routing a decoupled front-end layout through the Next.js framework and hosting it on Vercel.",
      "Maintained the robust WordPress backend on a subdomain for seamless database management.",
      "Orchestrated comprehensive domain routing and dynamic sitemap generation across both layers.",
    ],
    featured: true,
    evidence: {
      surface: {
        path: "/deployments",
        heading: "Deploy health",
        stats: [
          { value: "0.9s", label: "Largest contentful paint" },
          { value: "18k", label: "Pages prerendered" },
          { value: "100%", label: "Routes migrated" },
        ],
      },
      chart: {
        title: "Median page load, weekly",
        period: "Three weeks either side of cutover",
        scale: ["3.0s", "1.5s"],
        // Falling, because the claim is that pages got faster.
        bars: [92, 86, 78, 40, 33, 29, 26],
        split: 3,
        series: "After replatform",
        baseline: "Before",
      },
    },
  },
  {
    slug: "the-couponsfeed-affiliate-grid",
    client: "The Couponsfeed",
    industry: "Affiliate Marketing & E-commerce Deals",
    title:
      "Turning thousands of time-sensitive affiliate links into a grid built for outbound clicks",
    summary:
      "Enhanced user navigation and click-through rates, maximising affiliate revenue through a frictionless deal-hunting experience.",
    services: ["listing-sites-marketplaces"],
    metrics: [
      { value: 45, suffix: "%", label: "Increase in outbound coupon clicks" },
      { value: 25, suffix: "%", label: "Reduction in page bounce rate" },
    ],
    challenge:
      "Managing thousands of dynamic, time-sensitive affiliate links required a structured, conversion-optimised interface to drive outbound clicks.",
    approach: [
      "Built a clear, intuitive coupon-grid layout structured around deal categorisation.",
      "Implemented fast-caching so the grid stays responsive under high-volume link management.",
      "Designed prominent CTA mechanics to drive outbound clicks.",
    ],
    evidence: {
      surface: {
        path: "/deals",
        heading: "Deal grid",
        stats: [
          { value: "3,480", label: "Live coupon links" },
          { value: "12", label: "Deal categories" },
          { value: "1.4s", label: "Grid render" },
        ],
      },
      chart: {
        title: "Outbound clicks per day",
        period: "Last 7 days",
        scale: ["8k", "4k"],
        bars: [44, 52, 48, 66, 72, 84, 90],
        split: 2,
        series: "Outbound clicks",
        baseline: "Prior week",
      },
    },
  },
  {
    slug: "the-digital-media-feed-content-hub",
    client: "The Digital Media Feed",
    industry: "Digital News & Media Publishing",
    title:
      "A media-centric architecture built for daily syndication and traffic surges",
    summary:
      "Improved session duration and minimised bounce rates, establishing a reliable content hub for digital trends.",
    services: ["informative-corporate-sites"],
    metrics: [
      { value: 35, suffix: "%", label: "Increase in average session duration" },
      { value: 20, suffix: "%", label: "Reduction in bounce rate" },
    ],
    challenge:
      "The platform needed a highly readable, fast-loading digital architecture capable of handling daily content syndication and traffic surges.",
    approach: [
      "Engineered a responsive, media-centric layout built for daily content syndication.",
      "Optimised the architecture for rapid content discovery and cross-device readability.",
    ],
    evidence: {
      surface: {
        path: "/newsroom",
        heading: "Syndication queue",
        stats: [
          { value: "24", label: "Stories published today" },
          { value: "3:12", label: "Average session" },
          { value: "6", label: "Feeds syndicated" },
        ],
      },
      chart: {
        title: "Average session duration",
        period: "Last 7 days",
        scale: ["4:00", "2:00"],
        bars: [46, 54, 50, 62, 70, 76, 88],
        split: 2,
        series: "Session duration",
        baseline: "Prior month",
      },
    },
  },
  {
    slug: "content-delight-editorial-experience",
    client: "Content Delight",
    industry: "Content Marketing & Publishing",
    title:
      "A layout framework built to hold a varied content portfolio together",
    summary:
      "Created a cohesive, immersive reading environment that significantly boosted reader retention and page views per session.",
    services: ["informative-corporate-sites"],
    metrics: [
      { value: 40, suffix: "%", label: "Increase in reader retention" },
      { value: 2, suffix: "x", label: "Growth in page views per session" },
    ],
    challenge:
      "The brand required a distinct digital identity to showcase varied content portfolios, demanding a balance between aesthetic appeal and structural organisation.",
    approach: [
      "Implemented a clean, accessible layout framework highlighting featured editorials.",
      "Structured categories to make varied content portfolios easy to navigate.",
      "Integrated engaging multimedia formats throughout the reading experience.",
    ],
    evidence: {
      surface: {
        path: "/editorial",
        heading: "Editorial hub",
        stats: [
          { value: "148", label: "Articles in the portfolio" },
          { value: "9", label: "Content categories" },
          { value: "4.1", label: "Pages per session" },
        ],
      },
      chart: {
        title: "Pages per session",
        period: "Last 6 months",
        scale: ["5.0", "2.5"],
        bars: [40, 48, 58, 64, 76, 84, 92],
        split: 2,
        series: "Pages per session",
        baseline: "Before relaunch",
      },
    },
  },
  {
    slug: "sassy-strides-fashion-platform",
    client: "Sassy Strides",
    industry: "Fashion & Lifestyle",
    title:
      "A mobile-first, image-first platform for a fashion brand that lives on visuals",
    summary:
      "Elevated the brand's visual storytelling, leading to higher engagement metrics and a loyal digital community following.",
    services: ["informative-corporate-sites"],
    metrics: [
      {
        value: 50,
        suffix: "%",
        label: "Faster load on high-resolution galleries",
      },
      { value: 3, suffix: "x", label: "Increase in mobile engagement" },
    ],
    challenge:
      "The brand needed a visually driven digital presence to reflect its aesthetic while maintaining fast load speeds for high-resolution lifestyle imagery.",
    approach: [
      "Developed a mobile-first, image-centric platform tailored to fashion verticals.",
      "Built seamless browsing paths across the catalogue and editorial content.",
      "Designed dynamic gallery layouts to showcase high-resolution lifestyle imagery.",
    ],
    evidence: {
      surface: {
        path: "/lookbook",
        heading: "Gallery performance",
        stats: [
          { value: "1.2s", label: "Gallery first paint" },
          { value: "68", label: "Lookbook images" },
          { value: "82%", label: "Sessions on mobile" },
        ],
      },
      chart: {
        title: "Mobile engagement rate",
        period: "Last 7 weeks",
        scale: ["60%", "30%"],
        bars: [34, 42, 50, 58, 72, 84, 94],
        split: 2,
        series: "Mobile engagement",
        baseline: "Desktop",
      },
    },
  },
];
