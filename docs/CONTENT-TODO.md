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

**Invented numbers: one block deleted, the rest rounded.** A pass was made over
all of them, sorting by a single question — *does this read as a measured client
outcome, or as the furniture of a drawn interface?*

### Deleted, because rounding could not fix it

`social-media-handling` → `metrics`, headed "What operating this way tends to
produce": a 3x median engagement lift, 62% reduction in cost per qualified
follow, 18 months average retention, 40+ assets a month.

That was prose, set at the size the page uses for facts, on a page a prospect
reads before signing. There is no rounded version of it that is not still a
made-up result. The `metrics` block type is untouched and the deletion site
carries a comment; restore it the day the four figures exist.

### Rounded, so precision stops implying measurement

Precision is the tell. `$142,840` reads as extracted from a real account;
`$120,000` reads as a mock-up's demo data. Both are invented — only one claims
to have been counted.

| Location | Now reads |
|---|---|
| `LiveDashboard.tsx` (analytics) | $120,000 attributed, $20,000 peak, 20% trend |
| `AdsFunnel.tsx` (performance ads) | $10,000 spend, 40,000 / 5,000 / 400 funnel, 4x blended ROAS |
| `EmailFlow.tsx` (email marketing) | 10,000 delivered, 40% opened, 10% clicked |
| `PipelineStair.tsx` (tracking systems) | $40,000 MRR, +10% month on month, 1M warehouse rows |
| `QueueRetry.tsx` (API integrations) | 20,000 delivered, 200→203 retried |
| `TableTransfer.tsx` (data migration) | 120,000 records migrated |
| `JourneyLedger.tsx` (marketing hero) | 25/30/25/20 channel split, $10,000 attributed, 20k reach, 60% open rate |

Still replace them with real figures where real figures exist. But none of these
now asserts a number anyone could quote back.

### Deliberately left alone

`ArcDial.tsx`'s spec strip (template / breakpoint / SKU counts) and
`Workbench.tsx`'s test counts, `v2.4.0` tag and branch names. These are the
furniture of a depicted interface — the equivalent of a video scrubber reading
`0:15 / 1:00`. Nobody reads a mocked IDE's branch name as a claim about a
client, and stripping them would leave the illustrations looking broken rather
than honest.

They are recorded here so the decision is visible, not so it gets reversed.

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

---

## Case studies and client logos

`content/case-studies.ts` now holds seven real engagements (Fitclass Gyms,
CredXP, Webaffino, The Couponsfeed, The Digital Media Feed, Content Delight,
Sassy Strides) and `content/clients.ts` holds sixteen real client logos,
rendered on the home page (`ClientStrip`) and the about page (`TrustPanel`).
None of this is placeholder.

**`metrics` is the one field that is not measured.** No client supplied a
percentage, revenue figure, or timeline, and the card/detail templates are
built around a numeric metrics row that every case study renders. The
figures currently in `case-studies.ts` are illustrative estimates — plausible
for the scope described, not client-reported results — and every page that
renders them (`/case-studies`, a case study detail page, and the home page's
`FeaturedWork`) also renders `MetricsNote` (`components/ui/Layout.tsx`), a
small-print line stating the figures are illustrative. Two exceptions are
real, not invented: Fitclass's "11 regional branches" and CredXP's "9 posts
in the 3×3 grid" are both facts from the brief, not estimates.

Replace the estimated figures with real ones the moment a client supplies
them — swap the `value` in `case-studies.ts` and the `MetricsNote` call
sites can stay as-is (a genuine mix of measured and illustrative figures
still needs the caveat until every figure on a page is real).
