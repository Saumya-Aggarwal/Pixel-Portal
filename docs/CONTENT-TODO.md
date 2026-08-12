# Service page copy — what is still outstanding

Structural content for all fourteen services is authored in
`src/content/services.ts`: pillar titles, capability titles, tag chips,
process step names, checklist items, comparison rows, and hero visuals.

Prose is not. Every prose field in the `ServiceSection` union is optional, and
each block renders complete without it — no placeholder text reaches the page.
A service simply has fewer paragraphs than it eventually will.

This file lists what is missing, so nothing gets forgotten between now and
launch.

---

## Read this first

**`social-media-handling` is the only fully-written page.** It is the reference
for voice: direct, specific, unhyped, willing to say what the work does *not*
include. Read it before writing anything else. Do not paraphrase it — the point
is the register, not the sentences.

**Two blocks contain invented numbers.** They are marked `TODO(content)` in
`services.ts` and must be replaced with defensible figures or deleted outright
before the site is public:

| Location | What is fabricated |
|---|---|
| `social-media-handling` → `metrics` | 3x engagement lift, 62% CPQF reduction, 18-month retention, 40+ assets/month |
| `LiveDashboard.tsx` (analytics illustration) | $142,840 attributed, $24,592 peak, +18.4% trend |
| `marketing-seo-tracking-systems` → `visual.kpis` | 12 platforms, 40+ reports, 15-min refresh, 3 years history |

Note the analytics figures moved **out of `services.ts` and into the component**
when that illustration was rebuilt to a blueprint. Numbers drawn inside an
illustration are part of the artwork — a chart axis reading `$20k` is not
content anyone would edit in a CMS. They are no less invented for that, so they
stay on this list.

These read as claims about real client outcomes. Nobody outside the company can
tell they are placeholders.

### One figure deliberately left out

`TrustPanel` (home and about) supports a progress bar via an optional
`assurance?: { label, value }` prop, modelled on the reference design's "Client
Satisfaction — 98%". **Nothing is passed, so no bar renders.**

There is no measured equivalent, and a fabricated percentage on a *trust*
surface is worse than the three above. If a real figure exists — a satisfaction
score, an on-time delivery rate, a retention percentage — pass it:

```tsx
<TrustPanel assurance={{ label: "On-time delivery", value: 94 }} />
```

Everything else on that panel already comes from real values in
`content/site.ts`: project count, headcount, years, countries, founding year,
office city.

---

## Missing on all thirteen unwritten services

Each of these currently has **six blocks**: `pillars`, `capabilities`, `tags`,
`process`, `checklist`, `comparison`. Two more blocks are absent entirely
because they are pure prose, and adding them empty would look worse than
leaving them out.

### 1. `narrative` block — not present, needs adding

The argument for the service. Insert after `pillars`.

```ts
{
  type: "narrative",
  eyebrow: "…",          // 2–3 words, e.g. "The problem"
  heading: "…",          // one line, ≤14 characters per word for the 14ch clamp
  body: ["…", "…"],      // 2 paragraphs, 45–70 words each
}
```

### 2. `faq` block — not present, needs adding

Insert last, after `comparison`.

```ts
{
  type: "faq",
  heading: "Common questions",
  items: [{ q: "…", a: "…" }],   // 5–6 pairs, answers 25–50 words
}
```

Answer the questions prospects actually ask — minimum engagement length, what
happens if it does not work, who owns what, how you differ from the cheaper
option. Not the questions that set up a sales pitch.

### 3. Optional intros — currently absent

| Field | Where | Length |
|---|---|---|
| `capabilities.intro` | above the six-card grid | 1 sentence, ~25 words |
| `tags.intro` | beside the chip cloud | 1–2 sentences, ~35 words |
| `checklist.body` | above the check items | 1 paragraph, ~55 words |
| `comparison.intro` | above the table | 1 sentence, ~25 words |

Only `social-media-handling` and `performance-ads` have any of these written.

### 4. `capabilities[].body` — absent on all fourteen

Six cards per service, ~20 words each. **84 short paragraphs total** — the
single largest remaining writing job. The grid reads fine without them, so this
is the lowest-risk item to defer.

### 5. `process[].steps[].description` — absent on thirteen

Six steps per service, ~27 words each. Only `social-media-handling` has these
written (its five steps all carry descriptions). Without them the timeline
shows numbered step titles on the scroll-drawn rail, which is legible but thin.

---

## Per-service status

| Service | narrative | faq | intros | capability bodies | step descriptions |
|---|:--:|:--:|:--:|:--:|:--:|
| social-media-handling | ✅ | ✅ | partial | ❌ | ✅ |
| performance-ads | ❌ | ❌ | ❌ | ❌ | ❌ |
| search-engine-optimization | ❌ | ❌ | ❌ | ❌ | ❌ |
| email-marketing | ❌ | ❌ | ❌ | ❌ | ❌ |
| performance-tracking-analytics | ❌ | ❌ | ❌ | ❌ | ❌ |
| informative-corporate-sites | ❌ | ❌ | ❌ | ❌ | ❌ |
| ecommerce-platforms | ❌ | ❌ | ❌ | ❌ | ❌ |
| listing-sites-marketplaces | ❌ | ❌ | ❌ | ❌ | ❌ |
| headless-architecture | ❌ | ❌ | ❌ | ❌ | ❌ |
| ui-ux-mobile-optimization | ❌ | ❌ | ❌ | ❌ | ❌ |
| custom-web-applications | ❌ | ❌ | ❌ | ❌ | ❌ |
| marketing-seo-tracking-systems | ❌ | ❌ | ❌ | ❌ | ❌ |
| data-migration-scripting | ❌ | ❌ | ❌ | ❌ | ❌ |
| api-integrations | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Also worth reviewing

The structural content authored here was derived from each service's existing
`deliverables` and `description`. It is plausible and internally consistent,
but it was not written by anyone who has actually delivered these engagements.

**The comparison tables in particular are commitments.** Rows like "Media spend
billed at cost, no markup", "Repository transferred to you", "Thirty days'
notice, with no exit penalty" and "Credentials held in your secret store"
describe how the business operates. If any of them is not true, it needs
changing before launch, not after a client quotes it back.

Same applies to the `checklist` blocks, which are phrased as guarantees.
