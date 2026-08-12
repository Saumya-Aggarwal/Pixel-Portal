# Pixel Portal

Frontend for the Pixel Portal agency site, built to the SOW: strict white/green
aesthetic, GSAP scroll storytelling, Motion UI transitions, and a three-tier
service architecture.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # all 33 pages prerender; only /api/inquiry is dynamic
npm run lint
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion 13 ·
GSAP 3.15 (+ ScrollTrigger, SplitText) · Lenis · Zod 4

Two things that differ from the brief's wording:

- **`motion`, not `framer-motion`.** Same library, current name. Imports come
  from `motion/react`. 21st.dev snippets are published against the old package
  name; adapting one is a single import line.
- **21st.dev is a copy-paste registry, not a dependency.** The primitives in
  `src/components/motion/` are authored in its idiom rather than installed.

## Layout

```
src/
  app/                    routes; [category]/[service] covers all 14 sub-pages
  components/
    motion/               ScrollProvider, TextReveal, Magnetic, LiftCard,
                          ParallaxImage, Marquee, Reveal, CountUp
    sections/             page composition, grouped by route
    ui/                   Button, Layout primitives, Accordion
    icons/                hand-authored SVG set
    contact/              multi-step questionnaire
  content/                typed content modules (the future CMS documents)
  lib/                    content seam, gsap registration, motion vocabulary
  types/content.ts        schema source of truth
```

## Three conventions worth knowing

**1. Colour is contrast-constrained.** `#27AE60` is 2.87:1 on white — it fails
AA for body text *and* the 3:1 large-text threshold. It is a fill, border, glow,
and display-type colour only.

| Token | On white | Use for |
|---|---|---|
| `brand-500` `#27AE60` | 2.87:1 | Fills, borders, hover washes, display type ≥72px |
| `brand-600` `#1F8C4D` | 4.27:1 | Large text ≥24px, stat numbers, icons |
| `brand-700` `#19703E` | 6.13:1 | Green body copy, links, small labels, buttons |

Primary buttons sit on `brand-700` for this reason. Vibrancy comes from
`brand-500` used at scale, where nothing has to be legible as small text.

**2. Motion is centralised.** `src/lib/motion.ts` owns every easing curve,
duration, and stagger. Retuning the site's feel is an edit to that file, not a
sweep through components. Every primitive handles `prefers-reduced-motion`
itself, and pointer/parallax effects are registered inside
`gsap.matchMedia("(min-width: 768px)")` so they never instantiate on phones.

**3. Content flows through one seam.** Pages import from `src/lib/content.ts`,
never from `src/content/*`. Those functions are already `async`, so swapping in
Sanity means changing their bodies and nothing else.

## Adding things

- **A service** — add it to `src/content/services.ts`. Routing, the mega-menu,
  the footer, the sitemap, and `generateStaticParams` all follow automatically.
- **Raising a service page's fidelity** — author a `sections[]` array on it.
  `/digital-marketing/social-media-handling` is the worked example. No new
  component required.
- **A block type** — extend the `ServiceSection` union in
  `src/types/content.ts`; the switch in `ServiceSections.tsx` becomes a compile
  error until you handle it.

## Not done yet

- Sanity Studio and schemas — the seam exists, nothing is wired.
- Real copy, photography, client names, and case-study numbers are placeholders.
- `/api/inquiry` validates and logs; `dispatch()` needs a real destination
  (Resend, Zoho CRM, or a webhook).
- Analytics/tracking install and the Vercel project.

Set `NEXT_PUBLIC_SITE_URL` per environment (see `.env.example`) so previews do
not emit production canonicals.
