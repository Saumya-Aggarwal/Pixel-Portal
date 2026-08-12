# Research brief for Gemini

Copy everything below the line into Gemini. Paste its answer back into Claude Code.

---

I need a **design specification** for a set of animated illustrations on an
agency website. I am not asking for code — an engineer will implement from your
spec. I am asking for the design decisions, at a level of detail precise enough
to build from without guessing.

## The site

**Pixel Portal** — a 50-person digital agency in Gurgaon, India. Three service
categories (Digital Marketing, Website Development, Software Development) with
14 service detail pages beneath them.

**Visual identity is white and green. This is fixed and must not change.**

```
Brand green   50 #edfaf2 · 100 #d2f2e0 · 200 #a9e7c3 · 300 #7fdca6 · 400 #4fc583
              500 #27ae60 (anchor) · 600 #1f8c4d · 700 #19703e · 800 #125430 · 900 #0d3a20
Neutrals      ink #0a0f0c · ink-soft #2c3831 · muted #5b6660 · hair #e8edea · paper #fbfdfc
Ground        pure white #ffffff. No dark mode. No gradients beyond subtle green tints.
Type          Inter only, one family, fluid clamp() scale
Radius        cards 1.25rem · panels 2rem
Easing        expo-out cubic-bezier(0.16, 1, 0.3, 1) is the house curve
Contrast rule green text must be brand-700 for body, brand-600 minimum for large text
```

**Stack:** Next.js 16 (App Router, RSC), React 19, Tailwind CSS 4 (CSS-first
`@theme`, no config file), Motion 13 (`motion/react`), GSAP 3.15 with
ScrollTrigger and SplitText, Lenis smooth scroll. Everything must respect
`prefers-reduced-motion`.

## What exists and why it is not good enough

Each service page has one animated illustration in its hero. Five have been
built as literal depictions of the subject:

| Page | Current illustration |
|---|---|
| Social Media | Phone frame with a scrolling feed of post cards, ticking like counters |
| Corporate Sites | Browser window where page blocks assemble top-down, then reset |
| Analytics | Line chart drawing itself, event pills streaming in, KPI tiles |
| E-Commerce | Browse → item flies to cart → checkout panel slides in → confirmed |
| API Integrations | Packets travelling a lane; one fails, retries, dead-letters |

They are built from four shared "chrome" primitives — a browser window, a phone
device, a floating glass panel, and a flow lane with node stops — so that all 14
illustrations read as one family rather than 14 one-offs.

**The critique from the client is that they look basic and the placement is
unprofessional.** My own diagnosis, which I want you to confirm, correct, or
extend:

1. **Placement.** The illustration currently sits full-width *below* the hero
   headline and lead paragraph. The reference sites put it *beside* the copy in
   a split layout.
2. **Density.** Too much empty space inside the illustration frame; too few
   elements.
3. **Detail realism.** Generic grey placeholder bars where specific, believable
   UI detail should be.
4. **No depth.** Flat shapes on flat white — no layering, shadow, glow, or rim
   light.

## Reference material

Study these closely. **Take structure, density, and craft from them — not
colour.** They are dark-neon; this site is white-green. Any recommendation that
depends on a dark ground or a blue→magenta gradient is not usable.

- `https://ascendiaprime.com/` — homepage
- `https://ascendiaprime.com/ppc/` — floating dashboard panels over a funnel chain
- `https://ascendiaprime.com/conversion-led-growth/` — 3D neon funnel with callouts
- `https://ascendiaprime.com/affiliate-publisher-marketing-page/` — two-column beam network
- The hero on their video/native ads page: a video player mockup with a scrubber
  at `0:15 / 1:00`, a native ad card with a "Sponsored" badge, joined by beams
  through an "Attention" node with a "Context" label below.
- `https://21st.dev/` — component registry. Especially the Heroes, Bento,
  Timelines, and Stats & KPIs categories.

Also look at how **Stripe, Linear, Vercel, Retool, Segment and Amplitude** draw
product illustrations on light backgrounds. Those are much closer to the target
palette than Ascendia is, and they solve exactly the "premium on white" problem.

## What I need back

Please structure your answer in these six sections. Be specific and numeric.
Prose about design principles is not useful to me; measurements, ratios,
hex values, timings and named references are.

### 1. Hero layout

The recommended geometry for a service-page hero containing copy plus an
illustration. Give me:
- Column split and why (e.g. 6/6, 7/5, 5/7) at desktop
- What happens at tablet and mobile — does the illustration move, shrink, or drop
- Vertical rhythm: hero top padding, gap between copy and illustration, bottom padding
- Where breadcrumbs, an eyebrow label, the H1, the lead paragraph, and CTA
  buttons sit relative to each other and to the illustration
- Whether the illustration should be vertically centred against the copy or
  optically offset, and by how much
- Whether it should bleed past the container edge, and if so how far

### 2. Illustration frame

The container the illustration lives in:
- Aspect ratio or fixed height, at each breakpoint
- Whether there should be a visible frame at all, or the illustration should
  float free on the page background
- If framed: border, radius, background fill, and how it separates from white
- Background treatment inside the frame — grid, dot field, gradient wash, nothing
- Exact shadow and glow recipes as CSS values, tuned for a **white** ground.
  This is the part I most need help with: how to get depth on white without the
  drop-shadow looking dirty or the glow looking like a rendering artefact.

### 3. Density and composition

- How many distinct visual elements a single hero illustration should contain
- The hierarchy: which element is primary, which are secondary, which are
  ambient detail
- How much negative space is correct as a percentage of the frame
- Where labels and annotations belong, what size, and how many is too many
- Whether callout chips on dotted leader lines (as Ascendia uses) work on a
  light ground, or read as clutter

### 4. Detail realism

For **each** of the five illustrations listed above, tell me the specific UI
details that would make it believable instead of generic. Concretely: what text
strings, what icons, what states, what numbers. For example, for the video
player Ascendia chose a scrubber at `0:15 / 1:00` — that specificity is exactly
what I am missing. Give me the equivalent for a social feed, a page builder, an
analytics dashboard, a checkout flow, and a message queue.

### 5. Motion

- Which elements should move and which must stay still — I suspect I am
  animating too much at once
- Loop duration and whether loops should be continuous or have a rest beat
- Stagger timings between related elements
- Easing curves per motion type (entrance, travel, pulse, exit)
- How the illustration should behave on cursor hover: whole-frame parallax tilt,
  per-element response, or nothing
- What the correct **static** frame is under `prefers-reduced-motion` — which
  moment in the loop best represents the whole animation

### 6. Consistency system

Given that 14 illustrations must eventually exist and read as one family:
- What must be identical across all 14
- What is allowed to vary
- A stroke-weight, corner-radius, icon-size and label-size scale to hold them together
- How to stop the fourteenth from drifting away from the first

## Constraints to respect

- **White and green only.** No dark backgrounds, no purple, no magenta.
- Must degrade to a meaningful static image under reduced motion — an empty
  frame is a bug.
- Must not rely on raster images, Lottie, or video files. SVG, CSS and DOM only.
- Must be legible at 375px wide.
- Animation must be cheap enough to run at 60fps alongside a Spline 3D scene
  elsewhere on the site.

## Output format

Markdown. Tables and numeric values wherever possible. Where you reference
another site's technique, name the site and the specific page. If you recommend
a component from 21st.dev or elsewhere, give the direct URL.

Do not write React, CSS, or SVG code. I want the specification; I will implement it.
