# Research brief 2 — construction blueprint for one illustration

Copy everything below the line into Gemini, in the **same conversation** as
brief 1 so it keeps the system spec in context. Paste its answer back into
Claude Code.

---

Your specification was adopted in full. I am now following your advice to build
the primitive system first and prove it on a single illustration before
assembling the remaining thirteen.

The primitive layer is being built now from your spec and needs nothing further
from you: the two-layer shadow recipe, the diffuse backlight, the masked grid
ground, the 1.5px/1px stroke scale, the 10–14px Inter micro-type scale, and the
1.25rem/2rem radii are all unambiguous.

**What I still need is a construction blueprint** — geometry, layering and
timing for one specific illustration. You gave me the *content* (`$24,592`,
`+18.4%`, `Oct 12`) but not the *composition*: where each element sits, what
overlaps what, and what happens at each second of the loop.

## The subject

**Performance Tracking & Analytics.** The service is: measurement plans, GA4 and
server-side tagging, cross-platform attribution, conversion architecture, and
executive dashboards. The argument the page makes is *"a figure in a board deck
should survive someone asking how it was calculated."*

This illustration is first because it exercises every primitive at once —
floating panels, backlight, grid ground, callout chips on leader lines, data
motion, and counters. If the depth recipes hold up here, they hold up anywhere.

## Canvas

Design to a **960 × 640** bounding box. This is the desktop case: the
illustration occupies the 7-column side of your 5/7 split and bleeds off the
right viewport edge, so **assume the right ~120px may be cropped on narrower
desktops.** Nothing load-bearing may live there.

Give all positions as coordinates in that 960 × 640 space so I can translate
them directly.

## What I need, in five parts

### Part 1 — Element inventory and geometry

A table of every element in the illustration. For each, give me:

| Column | Meaning |
|---|---|
| `id` | short name I can use as a component/variable name |
| `role` | primary / secondary / ambient (per your 1 / 2–3 / 10+ rule) |
| `x, y, w, h` | position and size in the 960 × 640 canvas |
| `z` | stacking index |
| `fill` / `stroke` | exact token or hex from the brand scale |
| `radius` | corner radius |
| `shadow` | which of your two recipes, or none |
| `type` | font size and colour for any text it contains |

I want to be able to build this without inventing a single coordinate.

Confirm the composition lands inside your 40–50% negative-space target, and say
roughly what percentage it comes out at.

### Part 2 — Layer stack

The illustration back-to-front, as an ordered list. Where does the backlight
glow sit relative to the grid and the primary panel? Do any secondary panels
overlap the primary one, and if so by how much? Does anything cross the frame's
implied boundary?

### Part 3 — Motion storyboard

A **timeline table** for one full loop. Columns: `t (seconds)`, `element`,
`property`, `from → to`, `easing`, `notes`.

Cover the rest beat you specified — where it falls and how long it lasts. State
the total loop duration.

Apply your own rule that only *data* moves and *structure* stays anchored: be
explicit about which elements never animate at all beyond the ambient float.

Also specify the ambient float per panel: amplitude, period, and phase offset,
so no two panels bob in sync.

### Part 4 — Resolved state

Per your reduced-motion rule, the component mounts in its final resolved state.
Describe that frame precisely — chart fully drawn, tooltip visible or hidden,
counters at final value, panels at `y: 0`. This is a static image a real user
will see, so it has to be a good composition in its own right, not a random
frame of the animation.

### Part 5 — Responsive degradation

At tablet (768px) and mobile (375px) the illustration stacks below the copy and
scales down. Tell me which elements to **drop** rather than shrink — your
10+ ambient details and 12px labels will not survive proportional scaling to
375px. Give me the element `id`s to remove at each breakpoint, and any
repositioning needed for what remains.

## Constraints, restated

- White ground `#ffffff`, brand green scale only. No dark panels, no red, no
  amber. Per your own note: a failed or negative state uses `--color-ink`, not red.
- Green text: `brand-700` for anything small, `brand-600` minimum for large.
- SVG, CSS and DOM only. No raster, no Lottie, no video.
- Must hold 60fps alongside a Spline 3D scene elsewhere on the site.
- Real numbers in the illustration are illustrative placeholders and will be
  flagged as such — do not optimise for them being defensible, optimise for them
  being *believable* at a glance.

## Output format

Markdown, tables wherever possible, exact numbers throughout. No prose about
design philosophy — I have that from your first answer and it was adopted.

Do not write React, CSS or SVG code. Give me the blueprint; I will implement it.
