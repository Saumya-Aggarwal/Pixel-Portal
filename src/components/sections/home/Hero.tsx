"use client";

import { motion } from "motion/react";
import { useCallback, useSyncExternalStore } from "react";

import { useBoot } from "@/components/boot/BootProvider";
import { Frame, initials } from "@/components/media/Frame";
import { SplineScene } from "@/components/media/SplineScene";
import { CascadeText } from "@/components/motion/CascadeText";
import { CountUp } from "@/components/motion/CountUp";
import { FloatingCard } from "@/components/motion/FloatingCard";
import { Container } from "@/components/ui/Layout";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { DUR, EASE } from "@/lib/motion";
import type { TeamMember } from "@/types/content";

const SPLINE_SCENE = "https://prod.spline.design/NbU6scJvWHLpfXhs/scene.splinecode";

/** Tailwind `lg` — the split hero, and the only width where a fixed-to-column glide is safe. */
const LG_QUERY = "(min-width: 1024px)";

function subscribeLg(onChange: () => void) {
  const query = window.matchMedia(LG_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getLgSnapshot = () => window.matchMedia(LG_QUERY).matches;
/**
 * Assume the stacked layout through hydration. A first-visit desktop reader
 * still has the curtain up while this reconciles, so the centred box can land
 * a tick late without being seen; a phone reader must never start in `fixed`
 * or the resolve has nothing coherent to settle into.
 */
const getLgServerSnapshot = () => false;

function useIsLaptop() {
  return useSyncExternalStore(subscribeLg, getLgSnapshot, getLgServerSnapshot);
}

/**
 * The published scene is blue. Rather than re-author it, the composited canvas
 * is rotated into brand green in CSS — a filter on the canvas element costs
 * nothing per frame on the GPU and keeps one source of truth for the asset.
 *
 * `[&_a]:hidden!` is here for completeness only. The "Built with Spline" badge
 * is a texture the runtime composites into the WebGL frame, not a DOM node, so
 * nothing selects it; the crop on the wrapper is what actually removes it.
 */
const SPLINE_FILTER =
  "relative flex h-full min-h-125 w-full items-center justify-center bg-transparent " +
  "filter hue-rotate-[-70deg] saturate-75 brightness-150 contrast-85 " +
  "[&_a]:hidden! pointer-events-none";

/**
 * One glass recipe, applied verbatim to every floating surface in the hero.
 *
 * The tint is white-on-white with a white hairline — over a white page there
 * is nothing behind the panel to frost, so what sells the material is the
 * green-tinted drop shadow, not the blur.
 */
const GLASS =
  "bg-white/60 backdrop-blur-xl border border-white/60 " +
  "shadow-[0_16px_40px_-8px_rgba(39,174,96,0.15)] rounded-3xl";

const headlineWords = [
  { text: "We" },
  { text: "build" },
  { text: "the" },
  { text: "systems" },
  { text: "behind" },
  { text: "modern", glow: true },
  { text: "growth.", glow: true },
];

/* ==========================================================================
   The hand-off from the boot sequence
   ========================================================================== */

/**
 * The one spring the resolve is choreographed to.
 *
 * Three things ride it: the core's glide to the column, its scale settle, and
 * the headline's travel in the opposite direction. Sharing a single spring is
 * what makes the resolve read as one gesture pulling apart rather than as
 * several elements that happen to move at the same time — they accelerate and
 * settle together, frame for frame.
 *
 * Low bounce on purpose. The overshoot that flatters a small card reads as a
 * wobble at the scale of a headline and a 500px canvas.
 */
const RESOLVE = { type: "spring", bounce: 0.1, duration: 1.7 } as const;

/**
 * The core's arrival: a touch more bounce than the resolve, held back a beat
 * so the grid behind it has started drawing before the object lands on it.
 */
const CORE_IN = { type: "spring", bounce: 0.26, duration: 1.5, delay: 0.25 } as const;

/**
 * Entrance ladder, measured from the moment the boot resolves. Everything in
 * the hero animates on load rather than on scroll — it is already in view — so
 * the order stays a hand-tuned delay sequence: headline cascades first as the
 * core begins its glide, then the supporting copy, then the stat cards last,
 * arriving as the core settles.
 *
 * These used to carry the boot's duration baked into them, because
 * `CascadeText`, `FloatingCard` and `CountUp` all start their clocks at mount
 * and take a delay rather than a trigger. That arithmetic cannot survive a boot
 * whose length depends on how fast the page actually loads, so the two
 * subtrees below are keyed on the resolve instead: they remount when it lands,
 * which restarts those clocks at the only moment that matters. The delays are
 * relative to the resolve again, and there is no duration to keep in sync.
 */
const DELAY = {
  headline: 0,
  lead: 0.5,
  statOne: 0.82,
  statTwo: 1.02,
} as const;

/**
 * The headline's pose while the core holds centre, and where it ends up.
 *
 * Not a rise like everything else below it. The headline is parked to the
 * right — roughly under the centred core, since 40% of the left column's width
 * is about the distance from that column's midline to the middle of the
 * viewport — and travels *left* into place on the same spring that carries the
 * core *right*. The two separate out of one cluster, and because the core's
 * column paints above this one, the headline emerges from behind the object as
 * it leaves.
 *
 * A percentage of the element's own width rather than a viewport unit, so the
 * offset tracks the column it has to cross at every breakpoint instead of
 * being tuned to one screen. And a transform rather than a layout change:
 * nothing reflows, so the type never re-wraps mid-travel.
 */
// Both ends carry the same unit. Handing Motion "40%" and a bare `0` asks it to
// interpolate across two different length systems for the one property that has
// to stay in lockstep with the core.
const GATHERED = { opacity: 0, x: "40%" } as const;
const SETTLED = { opacity: 1, x: "0%" } as const;

/** Every other block on the left holds this pose until the boot resolves. */
const HIDDEN = { opacity: 0, y: 40 } as const;
const SHOWN = { opacity: 1, y: 0 } as const;

interface HeroProps {
  /** Four faces for the specialists card. Fetched by the page, not here. */
  specialists: TeamMember[];
}

/**
 * Home hero — a glass bento: a dominant headline on an asymmetrical split
 * against a bare Spline 3D scene, with two overlapping stat cards stacked
 * under the scene in the right-hand column.
 *
 * It does not drop straight into that layout on a first visit. `BootProvider`
 * runs a title card over the whole viewport first and hands this component its
 * phase; the hero's job is only the last two beats of it — the core rising at
 * centre once the portal has opened, then gliding to its resting place in the
 * right column while the left side cascades in behind it.
 *
 * There is deliberately no `<Preloader />` swapping one scene for another. The
 * core is one `<Spline>` that never unmounts — a WebGL context torn down and
 * rebuilt costs a white flash and a second scene download, so the transition is
 * a Motion `layout` animation on its wrapper instead: `fixed`-and-centred
 * becomes `relative`-in-column, and Motion interpolates between the two
 * measured boxes. It also means the scene streams in behind the curtain, so by
 * the time the portal opens there is an object there rather than a glow.
 *
 * Negative top margin pulls the section under the fixed header, then matching
 * padding restores the safe area; the header floats over white here instead
 * of sitting on a seam.
 */
export function Hero({ specialists }: HeroProps) {
  // Reduced motion is not consulted here any more. `BootProvider` resolves the
  // phase to "complete" for such a reader before this renders, and every
  // primitive below already handles the setting itself — a second check here
  // would be a third place for the three of them to disagree.
  const { phase, intro, markReady } = useBoot();
  const isLaptop = useIsLaptop();

  const isResolved = phase === "complete";
  /** Park the core at screen centre only on the split layout. Below `lg` the
   *  column is already stacked, and a fixed-to-relative layout animation
   *  across that much vertical distance fails to settle — the object would
   *  stick mid-viewport after the resolve. Small screens keep the core in
   *  flow and rely on the scale/opacity entrance instead. */
  const isCentred = !isResolved && isLaptop;
  /** Held at zero behind the curtain: its entrance should be the first thing
   *  through the portal, not something that already happened out of sight. */
  const coreVisible = phase === "core" || isResolved;

  /**
   * Stable, because `SplineScene` reports the reduced-motion case from an
   * effect that lists this in its dependencies — an inline arrow would re-run
   * it on every render of the hero.
   */
  const onSceneReady = useCallback(() => markReady("scene"), [markReady]);

  return (
    <section className="relative -mt-18 overflow-x-clip bg-white pt-18 lg:-mt-20 lg:pt-20">
      {/* ---- Ground: faint grid, then two green blooms sitting under it ----

          Zero for as long as the curtain is up, then drawn in over 500ms as
          that curtain fades — so the grid appears to be what the portal opened
          onto — and eased back to its resting 0.7 once the layout resolves and
          it stops being the only thing to look at.

          It is the same 72px field the curtain carries, at the same origin, so
          the two are in register across the hand-off. */}
      <motion.div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: coreVisible ? (isResolved ? 0.7 : 1) : 0 }}
        transition={{ duration: 0.9, ease: EASE.out }}
      />

      {/* During the boot this bloom sits behind the centred core; afterwards it
          is the glow behind the scene in the right column. It reads as one
          light source moving with the object either way. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-[52%] h-144 w-144 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-[100px]"
      />
      {/* Second bloom anchors the stat cards, which would otherwise float over
          bare white with nothing to separate them from the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-24 h-112 w-112 rounded-full bg-brand-500/15 blur-[100px]"
      />

      <Container wide className="relative">
        {/* On small screens the stack is headline → cube → lead → cards, so the
            object sits against the title instead of under a full lead paragraph.
            At `lg` the copy reforms as one left column and the scene as the right. */}
        <div className="grid grid-cols-1 gap-y-0 pt-10 pb-20 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-x-12 lg:gap-y-0 lg:pt-20 lg:pb-28">
          {/* ================= Headline =================

              Keyed on the resolve, which remounts at the instant the boot lands.
              `CascadeText` reads its `delay` at mount, so this is what lets the
              word cascade be timed against the resolve rather than against a
              boot duration the hero can no longer know. */}
          <div
            key={isResolved ? "headline-revealed" : "headline-pending"}
            className="relative z-10 order-1 lg:col-start-1 lg:row-start-1"
          >
            <motion.div
              initial={GATHERED}
              animate={isResolved ? SETTLED : GATHERED}
              // `x` rides RESOLVE so the headline and the core are one gesture.
              // Opacity is broken out as a plain tween: a spring on opacity
              // overshoots past 1 and clamps, which shows up as a flicker right
              // at the moment the type is crossing the object it emerged from.
              transition={{
                ...RESOLVE,
                opacity: { duration: 0.85, delay: 0.1, ease: EASE.out },
              }}
            >
              <CascadeText
                as="h1"
                words={headlineWords}
                delay={DELAY.headline}
                // Slower than the house default. The cascade now has the core's
                // full travel to play out across, so the last word lands as the
                // object reaches its column instead of a beat before it moves.
                stagger={0.11}
                className="font-display text-ink max-w-[13ch] text-6xl leading-[1.1] font-extrabold tracking-[-0.035em] sm:text-7xl lg:text-8xl"
              />
            </motion.div>
          </div>

          {/* ================= Lead — under the headline on lg, under the cube on small screens == */}
          <div
            key={isResolved ? "lead-revealed" : "lead-pending"}
            className="relative z-10 order-3 lg:col-start-1 lg:row-start-2"
          >
            <motion.p
              initial={HIDDEN}
              animate={isResolved ? SHOWN : HIDDEN}
              transition={{ duration: DUR.slow, delay: DELAY.lead, ease: EASE.out }}
              className="font-display text-lead text-muted mt-2 max-w-lg lg:mt-8"
            >
              Demand generation, platforms, and bespoke software — designed and run by one team, so
              the strategy and the thing that ships are never two different conversations.
            </motion.p>
          </div>

          {/* ================= Scene + cards =================
              `contents` below `lg` lets the cube and the cards take their own
              order in the stack (cube, then lead, then cards). At `lg` this
              becomes a normal right column again so the cards stay under the
              scene. */}
          <div className="contents lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:block">
            <div className="order-2 lg:order-none">
            {/* No card, no frame — the canvas sits directly on the page.

                Three nested boxes, which is two more than looks necessary:

                The outermost is the one that moves. `layout` measures its box
                before and after the class swap and animates between them, so
                the same `<Spline>` instance travels from screen centre to this
                column without a remount — through all three phases it is one
                WebGL context that is never torn down. Its height is identical
                in both states (500px either way, see below) and its centred
                width is within a few percent of the column's, so what Motion
                animates is very nearly pure translation — the canvas barely
                resizes and the scene never visibly re-frames.

                The middle box owns `scale` alone. Scale belongs off the
                layout-animated element: Motion measures bounding boxes, and a
                scale on the same node feeds a transformed box back into its
                own measurement. It is `relative` so it stays the containing
                block for the clip below whether or not a transform is applied.

                The innermost is the badge crop. The canvas overhangs it by
                5rem and the runtime paints "Built with Spline" into that
                strip — the badge is a texture composited into the WebGL frame,
                not a DOM node, so nothing can select it and cropping is the
                only option.

                Position tuning still lives on the outer and inner boxes. The
                inner clip carries its own fixed height rather than inheriting
                the outer box's, because the canvas must keep its dimensions or
                Spline re-frames the scene — its camera fits to the canvas box.
                `h-full` cannot do that job: the outer box is sized with
                `min-height` / a shorter `lg:h-110`, and a percentage height on
                an absolutely positioned child resolves against a specified
                `height`, not `min-height`. Below `lg` that made the clip 0px
                tall and hid the object. Explicit `h-125` (and `lg:h-152`)
                is the height the camera is framed against. That leaves two
                independent knobs:

                  `-translate-y-*` on the inner clip moves the object itself
                  up or down.

                  `h-*` on the outer box sets where the column ends, and
                  therefore the gap before the cards. Below `lg` that box is
                  shorter than the canvas so the object sits against the
                  heading instead of in a 500px well — the canvas runs longer
                  than the box and the surplus is transparent, so trimming
                  pulls the cards up without touching the object. Trim too
                  far and it starts cutting into the object's bottom edge. */}
            <motion.div
              // Only when the intro is actually playing. Without the gate, a
              // repeat visit resolves the phase in the reconciliation right
              // after hydration — one commit measured at screen centre, the
              // next in this column — and Motion would fly the core across the
              // page on what should be an ordinary load.
              // Position only, and only on the laptop split. Size is allowed to
              // differ by breakpoint; interpolating width/height would stretch
              // the WebGL canvas mid-flight. Below `lg` there is no fixed box
              // to glide from, so layout stays off and the inner scale spring
              // carries the entrance.
              layout={intro && isLaptop ? "position" : false}
              transition={RESOLVE}
              data-boot="core"
              className={cn(
                "bg-transparent",
                isCentred
                  ? // Every beat before the resolve. `fixed` rather than
                    // `absolute`: the brief is dead-centre of the *screen*, and
                    // this section is taller than the viewport, so centring
                    // inside it would put the core well below the fold. Nothing
                    // here is interactive and the header sits at z-50, so it
                    // stays clear of both.
                    // `h-125` with no `lg:` override on purpose: the resting
                    // box is 500px tall at every width, because its `min-h-125`
                    // outranks its own `lg:h-110`. Matching that exactly keeps
                    // the glide a translation rather than a 14% vertical
                    // stretch of the canvas.
                    "pointer-events-none fixed inset-0 z-30 m-auto h-125 w-[min(90vw,38rem)]"
                  : "relative -mt-6 h-60 w-full sm:-mt-4 sm:h-64 lg:mt-0 lg:min-h-125 lg:h-110",
              )}
            >
              {/* Hidden outright while the curtain is up rather than
                  unmounted: the scene streams in behind it, so the object is
                  already loaded and turning when the portal opens — and its
                  `onLoad` is one of the three signals the counter is waiting
                  on, which it could not be if this were mounted late. */}
              <motion.div
                className="relative h-full w-full"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: coreVisible ? 1 : 0,
                  scale: !coreVisible ? 0.7 : isResolved ? 1 : 1.2,
                }}
                transition={phase === "core" ? CORE_IN : RESOLVE}
              >
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 overflow-hidden",
                    // Same canvas box in both poses so Spline does not re-frame
                    // mid-glide. The upward nudge is resting-only: during the
                    // centred core beat the object has to sit on the screen
                    // midline, and the mobile crop that hugs the heading would
                    // pull it off-centre if it stayed on.
                    isCentred
                      ? "h-125 lg:h-152"
                      : "h-125 -translate-y-44 sm:-translate-y-36 lg:h-152 lg:-translate-y-30",
                  )}
                >
                  <SplineScene
                    scene={SPLINE_SCENE}
                    label="Rotating abstract 3D form"
                    className="absolute inset-x-0 top-0 h-[calc(100%+5rem)]"
                    canvasClassName={SPLINE_FILTER}
                    onReady={onSceneReady}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

            {/* Stat cards. The overlapping side-by-side cluster only switches
                on at `xl`: side by side the pair is ~550px wide, and this
                column is narrower than that until roughly 1280px — below
                which the second card would overflow it. Every width beneath
                that stacks them instead.

                On small screens these sit under the lead (order-4); at `lg`
                they return under the scene in the right column.

                While the core is centred this cluster sits alone at the top of
                the column, because a `fixed` core is out of flow. It is still
                fully transparent at that point, and it is back in place before
                its own entrance begins.

                Keyed on the resolve for the same reason the headline is:
                `FloatingCard` and `CountUp` both start at mount. Unlike that
                column these cards carry no gate of their own — their entrance
                *is* `FloatingCard`'s — so the pre-resolve mount is held at zero
                here. Nested opacity multiplies, so once this clears the cards
                are still at their own zero and their delays run untouched. */}
            <div
              key={isResolved ? "cards-revealed" : "cards-pending"}
              className={cn(
                "order-4 mt-4 flex max-w-sm flex-col gap-5 lg:order-none xl:mt-10 xl:max-w-none xl:flex-row xl:items-start xl:gap-0",
                !isResolved && "opacity-0",
              )}
            >
              <div className="xl:w-72 xl:shrink-0 2xl:w-76">
                <FloatingCard
                  delay={DELAY.statOne}
                  tilt={4}
                  lift={5}
                  className={`${GLASS} p-6`}
                >
                  <p className="font-display text-ink text-4xl leading-none font-extrabold tracking-tight">
                    <CountUp value={100} suffix="+" delay={DELAY.statOne + 0.2} />
                  </p>
                  <p className="font-display text-ink-soft mt-3 text-[0.9375rem] leading-snug">
                    Projects delivered across 3 countries since {site.founded}.
                  </p>

                  <div
                    aria-hidden
                    className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-brand-500/15"
                  >
                    <motion.div
                      className="h-full rounded-full bg-brand-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "68%" }}
                      transition={{
                        duration: 1.6,
                        delay: DELAY.statOne + 0.5,
                        ease: EASE.out,
                      }}
                    />
                  </div>
                </FloatingCard>
              </div>

              <div className="xl:relative xl:z-10 xl:-ml-6 xl:mt-20 xl:w-72 xl:shrink-0 2xl:w-76">
                <FloatingCard
                  delay={DELAY.statTwo}
                  floatDuration={4.6}
                  tilt={4}
                  lift={5}
                  className={`${GLASS} p-6`}
                >
                  <p className="font-display text-ink text-4xl leading-none font-extrabold tracking-tight">
                    <CountUp
                      value={site.teamSize}
                      suffix="+"
                      delay={DELAY.statTwo + 0.2}
                    />
                  </p>
                  <p className="font-display text-ink-soft mt-3 text-[0.9375rem] leading-snug">
                    Specialists across strategy, design, engineering, and delivery.
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {specialists.map((member) => (
                        <div
                          key={member.id}
                          className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white"
                        >
                          <Frame
                            aspect="h-full w-full"
                            alt={member.name}
                            src={member.image}
                            seed={member.id}
                            label={initials(member.name)}
                            labelClassName="text-[0.6875rem] font-semibold tracking-normal text-white/80"
                            sizes="40px"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="font-display text-muted text-[0.8125rem]">
                      +{site.teamSize - specialists.length} more
                    </span>
                  </div>
                </FloatingCard>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
