import type { Category, Service } from "@/types/content";

/**
 * The service tree. Descriptions are taken verbatim from the SOW's service
 * tables (§3 A/B/C); taglines and deliverables are placeholder copy for
 * layout purposes and should be replaced with real positioning.
 *
 * This array is the single source for routing, generateStaticParams, the
 * header mega-menu, and every service card on the site.
 *
 * ## On the state of the copy
 *
 * Structural content — pillar and capability titles, tag chips, process step
 * names, comparison rows, metric figures — is authored for all fourteen
 * services. Prose is not: `narrative.body`, `checklist.body`, `faq.items` and
 * the per-card `body` fields are optional and mostly absent, and each block
 * renders complete without them rather than emitting a placeholder.
 *
 * `social-media-handling` is the one fully-written page. Treat it as the
 * reference for voice, not as a template to paraphrase.
 *
 * docs/CONTENT-TODO.md enumerates exactly what is outstanding, per service.
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
    visual: { kind: "social-feed" },
    // Exemplar page — the one service with its prose written. Every other
    // service carries the same block structure with the paragraphs pending.
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "target",
            title: "Positioning before posting",
            body: "The content thesis is decided before a calendar exists, so production has something to be consistent with.",
          },
          {
            icon: "layers",
            title: "Production that repeats",
            body: "Recurring formats and pillars, so shipping forty assets a month is a process rather than a scramble.",
          },
          {
            icon: "chart",
            title: "Measured against pipeline",
            body: "Reach is a diagnostic, not a result. The monthly read is against the metrics that map to revenue.",
          },
        ],
      },
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
        type: "capabilities",
        heading: "What the function covers",
        intro:
          "One team owns the whole loop, from the argument the brand is making down to who answers a comment on a Saturday.",
        items: [
          { icon: "share", title: "Channel strategy and voice" },
          { icon: "grid", title: "Content calendar operations" },
          { icon: "layers", title: "Creative production and copywriting" },
          { icon: "megaphone", title: "Community management" },
          { icon: "target", title: "Paid amplification of organic winners" },
          { icon: "chart", title: "Growth and pipeline reporting" },
        ],
      },
      {
        type: "tags",
        heading: "Platforms and formats we operate",
        intro:
          "Mix is decided during the audit rather than assumed. A brand with nothing to show does not need a video-first strategy because video is performing for someone else.",
        items: [
          "Instagram",
          "LinkedIn",
          "YouTube",
          "TikTok",
          "X",
          "Threads",
          "Reels and Shorts",
          "Carousels",
          "Long-form video",
          "Employee advocacy",
          "Creator collaborations",
          "Community AMAs",
        ],
      },
      // A `metrics` block sat here, headed "What operating this way tends to
      // produce": a 3x median engagement lift, a 62% reduction in cost per
      // qualified follow, 18 months of average retained partnership, 40+ assets
      // a month. It was deleted rather than adjusted.
      //
      // Everything else fabricated on this site is furniture inside a drawing —
      // a row count on a mocked dashboard, a version tag in a mocked IDE — and
      // rounding those to obviously illustrative values is enough, because
      // nobody reads a diagram's axis as a claim. This was the opposite: prose
      // headed "what this produces", set at the size the page uses for facts,
      // on a service page a prospect reads before signing. There is no rounded
      // version of that which is not still a made-up result.
      //
      // Restore it the day the four figures exist and can be defended. The
      // `metrics` block type is untouched and other services can use it.
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
            title: "Community operations",
            description:
              "Response SLAs, escalation paths, and a documented line on what we answer ourselves and what comes to you first.",
          },
          {
            title: "Read & adjust",
            description:
              "Monthly review against the metrics that map to pipeline — not vanity reach. Formats that underperform get cut, not defended.",
          },
        ],
      },
      {
        type: "checklist",
        eyebrow: "How we work",
        heading: "What you are actually buying",
        body: [
          "Agency retainers go wrong in predictable ways: the team you met at the pitch is not the team doing the work, the reporting measures whatever looks best that month, and the files live somewhere you cannot reach. These are the commitments that close off each of those.",
        ],
        items: [
          "A named team you meet, and keep",
          "Documented voice guidelines and escalation rules",
          "Response SLAs written into the agreement",
          "Monthly review against pipeline, not reach",
          "Source files and account access stay yours throughout",
          "Full handover pack if the engagement ends",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard retainer",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          {
            label: "Positioning work before the first post",
            ours: true,
            theirs: false,
          },
          {
            label: "Named team rather than a rotating pool",
            ours: true,
            theirs: false,
          },
          { label: "Response SLAs in the contract", ours: true, theirs: false },
          { label: "Monthly performance reporting", ours: true, theirs: true },
          {
            label: "Source files handed over on request",
            ours: true,
            theirs: false,
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
    visual: { kind: "ads-funnel" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "target",
            title: "Intent before budget",
            body: "Spend follows demand that already exists. Anything else is paying to manufacture want from scratch.",
          },
          {
            icon: "bolt",
            title: "Creative is the variable",
            body: "Account structure gets you to parity. After that, the creative is the only thing still moving the number.",
          },
          {
            icon: "gauge",
            title: "Spend you can audit",
            body: "Every pound traceable to a campaign, an audience, and a result you can check.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "Channels we buy and manage",
        items: [
          { icon: "target", title: "Google Ads management" },
          { icon: "megaphone", title: "Meta Ads management" },
          { icon: "search", title: "Paid search strategy" },
          { icon: "share", title: "Paid social campaigns" },
          { icon: "browser", title: "Landing page alignment" },
          { icon: "chart", title: "Budget pacing and optimisation" },
        ],
      },
      {
        type: "tags",
        heading: "Platforms and campaign formats",
        items: [
          "Google Search",
          "Google Display",
          "Google Shopping",
          "Performance Max",
          "YouTube",
          "Meta",
          "Instagram",
          "LinkedIn",
          "Microsoft Ads",
          "Retargeting",
          "Lead generation",
          "App installs",
        ],
      },
      {
        type: "process",
        heading: "How we build paid media campaigns",
        steps: [
          { title: "Account and spend audit" },
          { title: "Measurement and tracking setup" },
          { title: "Audience and structure build" },
          { title: "Creative testing matrix" },
          { title: "Controlled scale-up" },
          { title: "Weekly optimisation" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Spend transparency",
        heading: "Where the money actually goes",
        items: [
          "Media spend billed at cost, with no markup",
          "Ad accounts stay in your name throughout",
          "Weekly pacing against the agreed budget",
          "Creative test results shared in full, including the losers",
          "Attribution model agreed before launch, not after",
          "Thirty days' notice, with no exit penalty",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard media retainer",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          {
            label: "Media spend billed at cost, no markup",
            ours: true,
            theirs: false,
          },
          { label: "Ad accounts owned by you", ours: true, theirs: false },
          {
            label: "Losing creative tests reported",
            ours: true,
            theirs: false,
          },
          { label: "Weekly performance reporting", ours: true, theirs: true },
          {
            label: "Attribution model agreed up front",
            ours: true,
            theirs: false,
          },
        ],
      },
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
    visual: { kind: "crawl-graph" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "search",
            title: "Fix the crawl first",
            body: "Content strategy is wasted on pages the crawler cannot reach, or reaches and chooses to ignore.",
          },
          {
            icon: "gauge",
            title: "Vitals are a ranking input",
            body: "Layout shift and slow paints cost positions. They are engineering problems and we fix them as such.",
          },
          {
            icon: "chart",
            title: "Mapped to demand",
            body: "Keywords chosen against commercial intent rather than whatever has the largest search volume.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What the audit and the work cover",
        items: [
          { icon: "search", title: "Technical crawl and audit" },
          { icon: "layers", title: "Indexation and sitemap remediation" },
          { icon: "gauge", title: "Core Web Vitals engineering" },
          { icon: "browser", title: "On-page and schema markup" },
          { icon: "grid", title: "Information architecture" },
          { icon: "chart", title: "Content gap and keyword mapping" },
        ],
      },
      {
        type: "tags",
        heading: "Areas we work across",
        items: [
          "Technical SEO",
          "Site audits",
          "Log file analysis",
          "XML sitemaps",
          "Robots directives",
          "Canonicalisation",
          "Structured data",
          "Core Web Vitals",
          "Internal linking",
          "Keyword mapping",
          "Content gaps",
          "Migration SEO",
        ],
      },
      {
        type: "process",
        heading: "How the engagement runs",
        steps: [
          { title: "Crawl and log analysis" },
          { title: "Indexation triage" },
          { title: "Vitals and rendering fixes" },
          { title: "On-page and schema pass" },
          { title: "Content and internal link plan" },
          { title: "Monthly position tracking" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "What gets fixed",
        heading: "Findings ranked by what moves rankings",
        items: [
          "Every finding tied to a count of affected URLs",
          "Fixes prioritised by impact, not by how easy they are",
          "Engineering tickets written, not merely recommended",
          "Before-and-after crawl comparison",
          "No link buying, under any circumstances",
          "Rankings tracked against the specific pages we changed",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard SEO retainer",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          {
            label: "Findings tied to affected URL counts",
            ours: true,
            theirs: false,
          },
          {
            label: "Engineering tickets written for each fix",
            ours: true,
            theirs: false,
          },
          {
            label: "Core Web Vitals treated as in scope",
            ours: true,
            theirs: false,
          },
          { label: "Monthly ranking report", ours: true, theirs: true },
          { label: "Declines paid link schemes", ours: true, theirs: false },
        ],
      },
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
    visual: { kind: "email-flow" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "envelope",
            title: "A list you own outright",
            body: "No algorithm sits between you and the inbox. The asset appreciates rather than renting attention monthly.",
          },
          {
            icon: "layers",
            title: "Templates that survive Outlook",
            body: "One responsive system, tested against the clients your list actually opens mail in.",
          },
          {
            icon: "gauge",
            title: "Deliverability as engineering",
            body: "Authentication, warm-up and list hygiene handled before the first campaign sends.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What the programme covers",
        items: [
          { icon: "envelope", title: "Responsive template system" },
          { icon: "bolt", title: "Lifecycle and automation flows" },
          { icon: "grid", title: "Segmentation strategy" },
          { icon: "gauge", title: "Deliverability and domain warm-up" },
          { icon: "target", title: "A/B testing programme" },
          { icon: "chart", title: "Revenue attribution per flow" },
        ],
      },
      {
        type: "tags",
        heading: "Flows and infrastructure we handle",
        items: [
          "Welcome series",
          "Post-purchase",
          "Win-back",
          "Browse abandonment",
          "Cart recovery",
          "Re-engagement",
          "Newsletters",
          "Product launches",
          "Transactional",
          "SPF, DKIM and DMARC",
          "List hygiene",
          "Send-time optimisation",
        ],
      },
      {
        type: "process",
        heading: "How the programme is built",
        steps: [
          { title: "List and deliverability audit" },
          { title: "Authentication and warm-up" },
          { title: "Template system build" },
          { title: "Flow mapping and build" },
          { title: "Segmentation rollout" },
          { title: "Test-and-iterate programme" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Deliverability",
        heading: "Reaching the inbox, not the promotions tab",
        items: [
          "SPF, DKIM and DMARC configured and verified",
          "Dedicated IP warm-up where volume justifies it",
          "Suppression and hygiene rules documented",
          "Rendering tested across the major clients, not just Gmail",
          "Unsubscribe honoured in a single click",
          "Consent basis recorded against every contact",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard email retainer",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          {
            label: "Authentication set up before first send",
            ours: true,
            theirs: false,
          },
          {
            label: "Rendering tested beyond Gmail web",
            ours: true,
            theirs: false,
          },
          { label: "Suppression rules documented", ours: true, theirs: false },
          { label: "Campaign performance reporting", ours: true, theirs: true },
          {
            label: "Declines to send to purchased lists",
            ours: true,
            theirs: false,
          },
        ],
      },
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
    // The figures inside this depiction are part of the drawing, not content —
    // see the TODO in LiveDashboard.tsx. They are illustrative, not measured.
    visual: { kind: "live-dashboard" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "chart",
            title: "Numbers you can defend",
            body: "A figure in a board deck should survive someone asking exactly how it was calculated.",
          },
          {
            icon: "plug",
            title: "One taxonomy, every platform",
            body: "Events named once and used everywhere, so the platforms stop quietly disagreeing with each other.",
          },
          {
            icon: "gauge",
            title: "Tracking that survives consent",
            body: "Server-side collection and consent mode, so the data does not evaporate the moment a banner appears.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What gets implemented",
        items: [
          { icon: "grid", title: "Measurement plan and taxonomy" },
          { icon: "plug", title: "GA4 and GTM implementation" },
          { icon: "database", title: "Server-side tagging" },
          { icon: "chart", title: "Cross-platform attribution" },
          { icon: "target", title: "Conversion architecture" },
          { icon: "gauge", title: "Executive dashboards" },
        ],
      },
      {
        type: "tags",
        heading: "Stack and standards",
        items: [
          "GA4",
          "Google Tag Manager",
          "Server-side GTM",
          "Consent Mode v2",
          "Meta CAPI",
          "Enhanced conversions",
          "BigQuery export",
          "Looker Studio",
          "UTM governance",
          "Event taxonomy",
          "Cross-domain tracking",
          "Data layer design",
        ],
      },
      {
        type: "process",
        heading: "How measurement gets built",
        steps: [
          { title: "Measurement plan" },
          { title: "Taxonomy definition" },
          { title: "Tag and data layer build" },
          { title: "Server-side deployment" },
          { title: "Attribution modelling" },
          { title: "Dashboard delivery" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Data integrity",
        heading: "What makes a number defensible",
        items: [
          "Every event defined in a written taxonomy first",
          "Data layer specified before any tag is built",
          "Consent state respected at the point of collection",
          "QA against raw platform reports, not against itself",
          "Documentation handed over alongside access",
          "Estimated figures never presented as measured ones",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard analytics setup",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          {
            label: "Written event taxonomy before build",
            ours: true,
            theirs: false,
          },
          {
            label: "Consent state respected at collection",
            ours: true,
            theirs: false,
          },
          {
            label: "Server-side collection available",
            ours: true,
            theirs: false,
          },
          { label: "Reporting dashboard delivered", ours: true, theirs: true },
          {
            label: "Estimates labelled as estimates",
            ours: true,
            theirs: false,
          },
        ],
      },
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
    visual: { kind: "layered-planes" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "browser",
            title: "Built for the sales call",
            body: "The site a rep sends after a meeting has exactly one job: not to lose the deal.",
          },
          {
            icon: "grid",
            title: "Architecture before pages",
            body: "Sitemap and content model settled first, so the build does not turn into a negotiation.",
          },
          {
            icon: "gauge",
            title: "Editable without a developer",
            body: "Marketing changes copy on a Tuesday afternoon without raising a ticket or waiting for a sprint.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What the build includes",
        items: [
          { icon: "grid", title: "Information architecture" },
          { icon: "layers", title: "Design system" },
          { icon: "browser", title: "Responsive multi-page build" },
          { icon: "database", title: "CMS modelling and integration" },
          { icon: "search", title: "SEO foundations" },
          { icon: "chart", title: "Analytics instrumentation" },
        ],
      },
      {
        type: "tags",
        heading: "Page types and capabilities",
        items: [
          "Corporate profiles",
          "Landing pages",
          "Investor pages",
          "Careers sites",
          "Product pages",
          "Multi-language",
          "CMS integration",
          "Design systems",
          "Accessibility",
          "Core Web Vitals",
          "Schema markup",
          "Analytics setup",
        ],
      },
      {
        type: "process",
        heading: "How the build runs",
        steps: [
          { title: "Discovery and sitemap" },
          { title: "Wireframes and content model" },
          { title: "Design system" },
          { title: "Template build" },
          { title: "CMS integration" },
          { title: "Launch and handover" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "After launch",
        heading: "What you can change without us",
        items: [
          "Every page editable through the CMS",
          "Component library documented for editors, not just developers",
          "New pages composable from existing blocks",
          "Redirects mapped before go-live",
          "Analytics and Search Console configured and verified",
          "Repository and hosting in your own accounts",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard website project",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          {
            label: "Content model agreed before design starts",
            ours: true,
            theirs: false,
          },
          {
            label: "Marketing can add pages unaided",
            ours: true,
            theirs: false,
          },
          {
            label: "Redirect map delivered at launch",
            ours: true,
            theirs: false,
          },
          { label: "Responsive build", ours: true, theirs: true },
          { label: "Repository transferred to you", ours: true, theirs: false },
        ],
      },
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
    visual: { kind: "cart-checkout" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "cart",
            title: "Built to survive launch day",
            body: "Peak traffic is a load-testing problem, and it is far cheaper to solve before it happens.",
          },
          {
            icon: "plug",
            title: "Inventory that tells the truth",
            body: "Stock sync failures cost more in refunds and lost trust than they ever save in engineering time.",
          },
          {
            icon: "target",
            title: "Checkout gets the attention",
            body: "Most storefront revenue is lost in the stretch between the cart and the confirmation screen.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What the storefront build covers",
        items: [
          { icon: "grid", title: "Catalogue and merchandising architecture" },
          { icon: "plug", title: "Payment gateway integration" },
          { icon: "database", title: "Inventory and fulfilment sync" },
          { icon: "target", title: "Checkout conversion optimisation" },
          { icon: "gauge", title: "Load and resilience testing" },
          { icon: "chart", title: "Commerce analytics" },
        ],
      },
      {
        type: "tags",
        heading: "Platforms and integrations",
        items: [
          "Shopify",
          "Headless commerce",
          "Payment gateways",
          "Subscriptions",
          "Multi-currency",
          "Tax and duties",
          "Inventory sync",
          "ERP integration",
          "Fulfilment",
          "Returns flows",
          "Product feeds",
          "Load testing",
        ],
      },
      {
        type: "process",
        heading: "How the storefront gets built",
        steps: [
          { title: "Catalogue and data audit" },
          { title: "Platform selection" },
          { title: "Storefront build" },
          { title: "Payments and fulfilment integration" },
          { title: "Load and failure testing" },
          { title: "Launch support" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Launch readiness",
        heading: "What we test before you go live",
        items: [
          "Load tested at projected peak, plus headroom",
          "Payment failure paths exercised end to end",
          "Stock sync verified against the source system",
          "Tax and shipping rules confirmed per region",
          "Rollback plan documented and rehearsed",
          "On-call cover through launch week",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard storefront build",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          { label: "Load tested before launch", ours: true, theirs: false },
          { label: "Payment failure paths tested", ours: true, theirs: false },
          { label: "Rollback plan rehearsed", ours: true, theirs: false },
          { label: "Responsive storefront", ours: true, theirs: true },
          {
            label: "On-call cover through launch week",
            ours: true,
            theirs: false,
          },
        ],
      },
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
    visual: { kind: "marketplace-bridge" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "database",
            title: "The data model is the product",
            body: "Two-sided platforms fail at the schema long before they fail at the interface.",
          },
          {
            icon: "search",
            title: "Search that narrows fast",
            body: "Faceted filtering over a large catalogue is a performance problem before it is a design one.",
          },
          {
            icon: "plug",
            title: "Trust and payouts up front",
            body: "Moderation tooling and commission logic are core scope, not a phase two that never arrives.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What the platform build covers",
        items: [
          { icon: "database", title: "Relational data modelling" },
          { icon: "search", title: "Faceted search and filtering" },
          { icon: "grid", title: "Multi-vendor onboarding" },
          { icon: "target", title: "Moderation and trust tooling" },
          { icon: "plug", title: "Payout and commission logic" },
          { icon: "gauge", title: "Scale and query performance" },
        ],
      },
      {
        type: "tags",
        heading: "Platform capabilities",
        items: [
          "Multi-vendor",
          "Faceted search",
          "Geospatial queries",
          "Vendor onboarding",
          "Listing moderation",
          "Review systems",
          "Escrow payments",
          "Commission logic",
          "Payout scheduling",
          "Dispute handling",
          "Feed ingestion",
          "Search indexing",
        ],
      },
      {
        type: "process",
        heading: "How the platform gets built",
        steps: [
          { title: "Domain and data modelling" },
          { title: "Search architecture" },
          { title: "Vendor and listing flows" },
          { title: "Trust and moderation tooling" },
          { title: "Payments and payouts" },
          { title: "Scale testing" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Platform integrity",
        heading: "The parts nobody sees until they break",
        items: [
          "Schema reviewed against three years of projected growth",
          "Search performance tested at target catalogue size",
          "Moderation queue and audit trail from day one",
          "Payout reconciliation against the ledger",
          "Vendor offboarding path defined before launch",
          "Rate limiting and abuse controls in place",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard platform build",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          {
            label: "Data model reviewed for future scale",
            ours: true,
            theirs: false,
          },
          {
            label: "Search tested at target catalogue size",
            ours: true,
            theirs: false,
          },
          {
            label: "Moderation tooling in initial scope",
            ours: true,
            theirs: false,
          },
          { label: "Vendor onboarding flow", ours: true, theirs: true },
          {
            label: "Payout reconciliation built in",
            ours: true,
            theirs: false,
          },
        ],
      },
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
    visual: { kind: "headless-seam" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "layers",
            title: "Decoupled on purpose",
            body: "The front end ships on its own cadence, and the CMS stops dictating what is possible.",
          },
          {
            icon: "bolt",
            title: "Rendered at the edge",
            body: "Static where it can be, streamed where it must be, and cached deliberately in either case.",
          },
          {
            icon: "terminal",
            title: "A preview per branch",
            body: "Every pull request gets its own URL, so review happens on the thing itself rather than a screenshot.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What the architecture covers",
        items: [
          { icon: "layers", title: "Next.js App Router architecture" },
          { icon: "database", title: "Headless CMS modelling" },
          { icon: "bolt", title: "Edge rendering and caching" },
          { icon: "grid", title: "React design system" },
          { icon: "terminal", title: "CI/CD and preview environments" },
          { icon: "gauge", title: "Performance budgets" },
        ],
      },
      {
        type: "tags",
        heading: "Stack we build on",
        items: [
          "Next.js",
          "React",
          "App Router",
          "Server Components",
          "ISR",
          "Edge runtime",
          "Sanity",
          "Contentful",
          "Payload",
          "Vercel",
          "Preview deployments",
          "Performance budgets",
        ],
      },
      {
        type: "process",
        heading: "How the build runs",
        steps: [
          { title: "Architecture and rendering strategy" },
          { title: "Content modelling" },
          { title: "Design system in React" },
          { title: "Application build" },
          { title: "Caching and revalidation" },
          { title: "Deploy pipeline and handover" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Engineering standards",
        heading: "What ships alongside the code",
        items: [
          "Rendering strategy documented per route",
          "Content model reviewed with the editors who will use it",
          "Performance budget enforced in CI, not just measured",
          "Preview environment on every pull request",
          "Typed content schema, end to end",
          "Runbook and architecture notes at handover",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard headless build",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          {
            label: "Rendering strategy documented per route",
            ours: true,
            theirs: false,
          },
          {
            label: "Performance budget enforced in CI",
            ours: true,
            theirs: false,
          },
          {
            label: "Typed content schema end to end",
            ours: true,
            theirs: false,
          },
          { label: "Responsive build", ours: true, theirs: true },
          {
            label: "Architecture runbook at handover",
            ours: true,
            theirs: false,
          },
        ],
      },
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
    visual: { kind: "breakpoint-ruler" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "device",
            title: "Rescue work, mostly",
            body: "Sites that were designed at 1440 pixels wide and never seriously re-tested below it.",
          },
          {
            icon: "gauge",
            title: "Measured on real devices",
            body: "Emulators miss most of what actually breaks once a page is in somebody's hand.",
          },
          {
            icon: "grid",
            title: "Fixed at the component",
            body: "Patching page by page guarantees the same bug reappears on the next template.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What the remediation covers",
        items: [
          { icon: "device", title: "Cross-device rendering audit" },
          { icon: "grid", title: "Layout and reflow remediation" },
          { icon: "layers", title: "Component-level optimisation" },
          { icon: "terminal", title: "Custom CSS refactor" },
          { icon: "target", title: "Accessibility conformance" },
          { icon: "gauge", title: "Core Web Vitals on mobile" },
        ],
      },
      {
        type: "tags",
        heading: "Problems we are usually called in for",
        items: [
          "Responsive layout",
          "Viewport bugs",
          "Touch targets",
          "Reflow and overflow",
          "Foldables",
          "Safe-area insets",
          "Font scaling",
          "Reduced motion",
          "Screen readers",
          "Colour contrast",
          "Layout shift",
          "Mobile Vitals",
        ],
      },
      {
        type: "process",
        heading: "How the remediation runs",
        steps: [
          { title: "Device matrix audit" },
          { title: "Issue triage and reproduction" },
          { title: "Component-level fixes" },
          { title: "CSS refactor" },
          { title: "Accessibility pass" },
          { title: "Regression testing" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Coverage",
        heading: "What gets tested, and on what",
        items: [
          "Real devices, not only emulators",
          "Down to a 320 pixel viewport width",
          "Touch targets at 44 pixels minimum",
          "A keyboard path through every interaction",
          "Screen reader pass over the primary flows",
          "Reduced-motion preference honoured throughout",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard responsive fix",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          { label: "Tested on real devices", ours: true, theirs: false },
          {
            label: "Accessibility included as standard",
            ours: true,
            theirs: false,
          },
          { label: "Fixes made at component level", ours: true, theirs: false },
          { label: "Responsive audit report", ours: true, theirs: true },
          {
            label: "Reduced-motion preference honoured",
            ours: true,
            theirs: false,
          },
        ],
      },
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
    visual: { kind: "app-shell" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "app",
            title: "Shaped to the operation",
            body: "Off-the-shelf tools force the process to bend. Bespoke software does the bending instead.",
          },
          {
            icon: "database",
            title: "Auth and roles from the start",
            body: "Retrofitting permissions onto a working application is a rebuild wearing a smaller name.",
          },
          {
            icon: "terminal",
            title: "Handover is part of scope",
            body: "Documentation, training, and a repository your own team can pick up and continue.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What the engagement covers",
        items: [
          { icon: "search", title: "Product discovery and scoping" },
          { icon: "layers", title: "Architecture and data modelling" },
          { icon: "app", title: "Full-stack application build" },
          { icon: "database", title: "Role-based access and auth" },
          { icon: "plug", title: "Third-party integrations" },
          { icon: "terminal", title: "Handover and training" },
        ],
      },
      {
        type: "tags",
        heading: "What we typically build",
        items: [
          "SaaS platforms",
          "Internal tooling",
          "Admin dashboards",
          "Workflow automation",
          "Role-based access",
          "Single sign-on",
          "Audit logging",
          "Reporting",
          "Multi-tenancy",
          "Background jobs",
          "Webhooks",
          "API design",
        ],
      },
      {
        type: "process",
        heading: "How the engagement runs",
        steps: [
          { title: "Discovery and scoping" },
          { title: "Architecture and data model" },
          { title: "Interface design" },
          { title: "Iterative build" },
          { title: "User acceptance testing" },
          { title: "Handover and training" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Ownership",
        heading: "What you hold at the end of it",
        items: [
          "Repository and infrastructure in your own accounts",
          "Architecture decisions recorded and explained",
          "Test suite covering the critical paths",
          "Runbook for deployment and rollback",
          "Training sessions with your team, recorded",
          "No proprietary lock-in to our tooling",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard software project",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          { label: "Repository in your accounts", ours: true, theirs: false },
          {
            label: "Architecture decisions documented",
            ours: true,
            theirs: false,
          },
          {
            label: "Test suite covering critical paths",
            ours: true,
            theirs: false,
          },
          { label: "Iterative delivery", ours: true, theirs: true },
          { label: "No lock-in to agency tooling", ours: true, theirs: false },
        ],
      },
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
    visual: { kind: "pipeline-stair" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "gauge",
            title: "Built, not bought",
            body: "Reporting tools stop where their connectors stop. A stack you own does not have that edge.",
          },
          {
            icon: "database",
            title: "One warehouse, one truth",
            body: "Platform figures disagree by design. Reconciliation happens once, centrally, rather than in every meeting.",
          },
          {
            icon: "bolt",
            title: "Alerted, not discovered",
            body: "A campaign breaking on Friday evening should page someone, not surface on Monday morning.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What the stack covers",
        items: [
          { icon: "plug", title: "Multi-platform data ingestion" },
          { icon: "database", title: "Warehouse and transformation layer" },
          { icon: "gauge", title: "Custom dashboard interfaces" },
          { icon: "bolt", title: "Alerting and anomaly detection" },
          { icon: "chart", title: "Scheduled reporting exports" },
          { icon: "grid", title: "Metric definition governance" },
        ],
      },
      {
        type: "tags",
        heading: "Tooling we work with",
        items: [
          "BigQuery",
          "Snowflake",
          "dbt",
          "Airflow",
          "GA4 export",
          "Ads APIs",
          "CRM sync",
          "Looker Studio",
          "Metabase",
          "Anomaly detection",
          "Slack alerting",
          "Scheduled exports",
        ],
      },
      {
        type: "process",
        heading: "How the stack gets built",
        steps: [
          { title: "Source and metric audit" },
          { title: "Warehouse design" },
          { title: "Ingestion pipelines" },
          { title: "Transformation layer" },
          { title: "Dashboard build" },
          { title: "Alerting and handover" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Reliability",
        heading: "What keeps the numbers trustworthy",
        items: [
          "Pipeline failures alert before anyone opens a dashboard",
          "Metric definitions kept under version control",
          "Backfill procedure documented and actually tested",
          "Row counts reconciled against the source platforms",
          "Warehouse and code in your own accounts",
          "Cost monitoring on query spend",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from an off-the-shelf reporting tool",
        columns: ["Pixel Portal", "Off-the-shelf tool"],
        rows: [
          {
            label: "Metric definitions version-controlled",
            ours: true,
            theirs: false,
          },
          { label: "Pipeline failure alerting", ours: true, theirs: false },
          { label: "Backfill procedure tested", ours: true, theirs: false },
          { label: "Scheduled reporting", ours: true, theirs: true },
          {
            label: "Warehouse hosted in your account",
            ours: true,
            theirs: false,
          },
        ],
      },
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
    visual: { kind: "table-transfer" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "database",
            title: "History is the hard part",
            body: "Moving current records is straightforward. Keeping the past intact and addressable is the actual work.",
          },
          {
            icon: "terminal",
            title: "Dry run before commit",
            body: "Every migration runs against a copy until the diff between source and target is boring.",
          },
          {
            icon: "gauge",
            title: "Verified, never assumed",
            body: "Row counts, checksums, and spot checks back against the source before anyone calls it done.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What the migration covers",
        items: [
          { icon: "search", title: "Source auditing and field mapping" },
          { icon: "terminal", title: "Python migration tooling" },
          { icon: "layers", title: "Dry-run and rollback procedures" },
          { icon: "database", title: "Missing asset recovery" },
          { icon: "gauge", title: "Post-migration integrity verification" },
          { icon: "plug", title: "Redirect and URL mapping" },
        ],
      },
      {
        type: "tags",
        heading: "Work this usually involves",
        items: [
          "Python",
          "Database migrations",
          "CMS exports",
          "Media recovery",
          "Field mapping",
          "Deduplication",
          "Encoding fixes",
          "Redirect maps",
          "Checksums",
          "Dry runs",
          "Rollback plans",
          "Audit logs",
        ],
      },
      {
        type: "process",
        heading: "How a migration runs",
        steps: [
          { title: "Source audit" },
          { title: "Field mapping" },
          { title: "Tooling build" },
          { title: "Dry run and diff" },
          { title: "Cutover" },
          { title: "Integrity verification" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Safety",
        heading: "Nothing moves until all of this is true",
        items: [
          "Full backup verified restorable, not merely taken",
          "Dry run diffed against source, twice",
          "Rollback rehearsed on a copy of production",
          "Row counts and checksums reconciled",
          "Redirects mapped for every changed URL",
          "Cutover window agreed with a named owner",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard migration",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          { label: "Backup verified restorable", ours: true, theirs: false },
          { label: "Dry run diffed before cutover", ours: true, theirs: false },
          { label: "Rollback rehearsed", ours: true, theirs: false },
          { label: "Migration report delivered", ours: true, theirs: true },
          {
            label: "Checksums reconciled post-migration",
            ours: true,
            theirs: false,
          },
        ],
      },
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
    visual: { kind: "queue-retry" },
    sections: [
      {
        type: "pillars",
        items: [
          {
            icon: "plug",
            title: "Make what you own talk",
            body: "Most teams already pay for the systems. The value that is missing sits in the wiring between them.",
          },
          {
            icon: "bolt",
            title: "Failure is the design case",
            body: "Integrations break at three in the morning. What matters is what the system does next.",
          },
          {
            icon: "gauge",
            title: "Observable by default",
            body: "A sync you cannot inspect after the fact is a sync you cannot reasonably trust.",
          },
        ],
      },
      {
        type: "capabilities",
        heading: "What the integration work covers",
        items: [
          { icon: "grid", title: "Integration mapping and sequencing" },
          { icon: "plug", title: "CRM and ERP connectors" },
          { icon: "bolt", title: "Webhook and queue infrastructure" },
          { icon: "layers", title: "Retry, backoff and failure handling" },
          { icon: "gauge", title: "Monitoring and observability" },
          { icon: "database", title: "Field mapping and transformation" },
        ],
      },
      {
        type: "tags",
        heading: "Systems and patterns we connect",
        items: [
          "Salesforce",
          "HubSpot",
          "Zoho",
          "NetSuite",
          "Stripe",
          "Xero",
          "Shopify",
          "Webhooks",
          "Message queues",
          "Idempotency",
          "Rate limiting",
          "OAuth",
        ],
      },
      {
        type: "process",
        heading: "How an integration gets built",
        steps: [
          { title: "System and field mapping" },
          { title: "Contract and auth setup" },
          { title: "Connector build" },
          { title: "Failure handling" },
          { title: "Observability" },
          { title: "Cutover and monitoring" },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Resilience",
        heading: "What happens when the other end fails",
        items: [
          "Idempotent writes, so a retry cannot duplicate a record",
          "Exponential backoff with a dead-letter queue",
          "Rate limits respected per provider",
          "Every sync inspectable in an audit log",
          "Alerting on sustained failure rather than single errors",
          "Credentials held in your secret store, not ours",
        ],
      },
      {
        type: "comparison",
        heading: "How this differs from a standard integration job",
        columns: ["Pixel Portal", "Typical agency"],
        rows: [
          { label: "Idempotent writes", ours: true, theirs: false },
          {
            label: "Dead-letter queue for failed messages",
            ours: true,
            theirs: false,
          },
          { label: "Per-sync audit log", ours: true, theirs: false },
          { label: "Connector documentation", ours: true, theirs: true },
          {
            label: "Credentials held in your secret store",
            ours: true,
            theirs: false,
          },
        ],
      },
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
