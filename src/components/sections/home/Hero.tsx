"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { LOGO_SIZE, LOGO_SRC } from "@/components/layout/Logo";
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
import { useReducedMotion } from "@/lib/useReducedMotion";

const SPLINE_SCENE = "https://prod.spline.design/NbU6scJvWHLpfXhs/scene.splinecode";

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
   The boot sequence
   ========================================================================== */

/**
 * Three beats, not two: the brand tile lands first, hands off to the 3D core,
 * and only then does the layout resolve. Both values are measured from mount,
 * so the core holds centre for `complete - cube` = 1500ms.
 */
type BootPhase = "logo" | "cube-center" | "complete";

const PHASE_MS = { cube: 1200, complete: 2700 } as const;

/** Seconds from mount to the resolve — the origin for the reveal ladder. */
const BOOT = PHASE_MS.complete / 1000;

/**
 * The one spring the resolve is choreographed to. The cube's glide and its
 * scale settle share it, so the two land on the same frame instead of drifting
 * apart at the tail.
 */
const RESOLVE = { type: "spring", bounce: 0.15, duration: 1.2 } as const;

/**
 * The core's arrival: a touch more bounce than the resolve, held back a beat
 * so the grid behind it has started drawing before the object lands on it.
 */
const CORE_IN = { type: "spring", bounce: 0.3, duration: 1.1, delay: 0.18 } as const;

/** The brand tile's own fade — a plain tween; springing a logo reads cheap. */
const LOGO_IN = { duration: 0.7, ease: EASE.out } as const;
const LOGO_OUT = { duration: 0.4, ease: EASE.inOut } as const;

/**
 * Entrance ladder, now measured from the moment the boot ends rather than from
 * mount. Everything in the hero animates on load rather than on scroll — it is
 * already in view — so the order stays a hand-tuned delay sequence: headline
 * cascades first as the cube begins its glide, then the supporting copy, then
 * the stat cards last, arriving as the cube settles.
 */
const DELAY = {
  headline: 0.06,
  lead: 0.3,
  statOne: 0.46,
  statTwo: 0.58,
} as const;

/** Every block on the left holds this pose until `isBooting` clears. */
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
 * It opens on a three-phase boot rather than dropping straight into that
 * layout: the brand tile lands on bare white, the 3D core scales up dead-centre
 * of the viewport, and at `PHASE_MS.complete` the core glides to its resting
 * place in the right column while the left side cascades in behind it.
 *
 * There is deliberately no `<Preloader />`. The core is one `<Spline>` that
 * never unmounts — a WebGL context torn down and rebuilt costs a white flash
 * and a second scene download, so the transition is a Motion `layout`
 * animation on its wrapper instead: `fixed`-and-centred becomes `relative`-in-
 * column, and Motion interpolates between the two measured boxes.
 *
 * Negative top margin pulls the section under the fixed header, then matching
 * padding restores the safe area; the header floats over white here instead
 * of sitting on a seam.
 */
export function Hero({ specialists }: HeroProps) {
  const prefersReduced = useReducedMotion();
  const [rawPhase, setRawPhase] = useState<BootPhase>("logo");

  useEffect(() => {
    const toCube = window.setTimeout(() => setRawPhase("cube-center"), PHASE_MS.cube);
    const toDone = window.setTimeout(() => setRawPhase("complete"), PHASE_MS.complete);
    return () => {
      window.clearTimeout(toCube);
      window.clearTimeout(toDone);
    };
  }, []);

  /**
   * Derived rather than a second piece of state kept in sync by an effect.
   *
   * A 2.7s hold on an inert screen is exactly the kind of thing the reduced
   * motion setting is for, so a reader who asked for less skips straight to the
   * resolved layout. `useReducedMotion` reports `false` through hydration and
   * the real value on the tick after — deliberately, so the server and client
   * trees match — which means such a reader may see the boot's first frame
   * before it resolves. One frame is the price of the page hydrating at all.
   */
  const phase: BootPhase = prefersReduced ? "complete" : rawPhase;
  const isResolved = phase === "complete";
  /** The core keeps one centred box across both pre-resolve phases, so the
   *  `layout` animation fires once — on the hand-off to the column, not on
   *  the hand-off from the logo. */
  const isCentred = !isResolved;

  /**
   * `CascadeText`, `FloatingCard`, and `CountUp` all start their own clocks at
   * mount and take a delay, not a trigger — so their delays are offset by the
   * boot duration to land on the same beat as the state-driven reveals below.
   */
  const reveal = prefersReduced ? 0 : BOOT;

  return (
    <section className="relative -mt-18 overflow-hidden bg-white pt-18 lg:-mt-20 lg:pt-20">
      {/* ---- Phase 1: the brand tile, alone on white ----

          It sits above the grid and the core (both still at zero) and below
          the header, and it leaves via `AnimatePresence` so its fade-out
          overlaps the grid drawing itself in — the hand-off is a cross-fade,
          not a cut. */}
      <AnimatePresence>
        {phase === "logo" && (
          <motion.div
            key="boot-logo"
            aria-hidden
            // Hooked by the no-JS backstop in the root layout: this phase is
            // server-rendered, so without hydration to retire it the tile
            // would sit over the page permanently.
            data-boot="overlay"
            className="pointer-events-none fixed inset-0 z-40 m-auto flex h-52 w-52 items-center justify-center"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            // The exit tween rides on the exit target, not on `transition` —
            // Motion has no nested `exit` key there.
            exit={{ opacity: 0, scale: 0.98, transition: LOGO_OUT }}
            transition={LOGO_IN}
          >
            <Image
              src={LOGO_SRC}
              alt=""
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              priority
              className="h-full w-full rounded-[1.6rem] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Ground: faint grid, then two green blooms sitting under it ----

          Phase 2 opens here. The grid stays at zero for the whole logo beat —
          the tile is meant to land on bare white — then draws in over 500ms
          and eases back to its resting 0.7 once the layout resolves and it
          stops being the only thing to look at. */}
      <motion.div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "logo" ? 0 : isResolved ? 0.7 : 1 }}
        transition={{ duration: 0.5, ease: EASE.out }}
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
        <div className="grid grid-cols-1 gap-y-16 pt-14 pb-24 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-x-12 lg:pt-20 lg:pb-28">
          {/* ================= Left: the statement ================= */}
          <div>
            <motion.div
              initial={HIDDEN}
              animate={isResolved ? SHOWN : HIDDEN}
              transition={{ duration: DUR.slow, delay: DELAY.headline, ease: EASE.out }}
            >
              <CascadeText
                as="h1"
                words={headlineWords}
                delay={reveal + DELAY.headline}
                className="font-display text-ink max-w-[13ch] text-6xl leading-[1.1] font-extrabold tracking-[-0.035em] sm:text-7xl lg:text-8xl"
              />
            </motion.div>

            <motion.p
              initial={HIDDEN}
              animate={isResolved ? SHOWN : HIDDEN}
              transition={{ duration: DUR.base, delay: DELAY.lead, ease: EASE.out }}
              className="font-display text-lead text-muted mt-8 max-w-lg"
            >
              Demand generation, platforms, and bespoke software — designed and run by one team, so
              the strategy and the thing that ships are never two different conversations.
            </motion.p>
          </div>

          {/* ================= Right: the 3D scene, then the stats ========= */}
          <div>
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
                inner clip carries its own fixed `lg:h-152` rather than
                inheriting the outer box's height, because the canvas must keep
                its dimensions or Spline re-frames the scene — its camera fits
                to the canvas box. That leaves two independent knobs:

                  `lg:-translate-y-30` on the inner clip moves the object
                  itself up or down.

                  `lg:h-110` on the outer box sets where the column ends, and
                  therefore the gap before the cards. The canvas runs longer
                  than that and the surplus is transparent, so trimming this
                  pulls the cards up without touching the object. Trim too far
                  and it starts cutting into the object's bottom edge. */}
            <motion.div
              layout
              transition={RESOLVE}
              data-boot="core"
              className={cn(
                "bg-transparent",
                isCentred
                  ? // Phases 1–2. `fixed` rather than `absolute`: the brief is
                    // dead-centre of the *screen*, and this section is taller
                    // than the viewport, so centring inside it would put the
                    // core well below the fold. Nothing here is interactive
                    // and the header sits at z-50, so it stays clear of both.
                    // `h-125` with no `lg:` override on purpose: the resting
                    // box is 500px tall at every width, because its `min-h-125`
                    // outranks its own `lg:h-110`. Matching that exactly keeps
                    // the glide a translation rather than a 14% vertical
                    // stretch of the canvas.
                    "pointer-events-none fixed inset-0 z-30 m-auto h-125 w-[min(90vw,38rem)]"
                  : "relative min-h-125 w-full lg:h-110",
              )}
            >
              {/* Hidden outright for the logo beat rather than unmounted: the
                  scene keeps streaming in behind the tile, so by the time it
                  is uncovered there is an object there instead of a glow. */}
              <motion.div
                className="relative h-full w-full"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: phase === "logo" ? 0 : 1,
                  scale: phase === "logo" ? 0.7 : isResolved ? 1 : 1.2,
                }}
                transition={phase === "cube-center" ? CORE_IN : RESOLVE}
              >
                <div className="absolute inset-x-0 top-0 h-full overflow-hidden lg:h-152 lg:-translate-y-30">
                  <SplineScene
                    scene={SPLINE_SCENE}
                    label="Rotating abstract 3D form"
                    className="absolute inset-x-0 top-0 h-[calc(100%+5rem)]"
                    canvasClassName={SPLINE_FILTER}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Stat cards. The overlapping side-by-side cluster only switches
                on at `xl`: side by side the pair is ~550px wide, and this
                column is narrower than that until roughly 1280px — below
                which the second card would overflow it. Every width beneath
                that stacks them instead.

                While the core is centred (phases 1–2) this cluster sits alone at the top of
                the column, because a `fixed` core is out of flow. It is still
                fully transparent at that point, and it is back in place before
                its own entrance begins. */}
            <div className="mt-8 flex max-w-sm flex-col gap-5 xl:mt-10 xl:max-w-none xl:flex-row xl:items-start xl:gap-0">
              <div className="xl:w-72 xl:shrink-0 2xl:w-76">
                <FloatingCard
                  delay={reveal + DELAY.statOne}
                  tilt={4}
                  lift={5}
                  className={`${GLASS} p-6`}
                >
                  <p className="font-display text-ink text-4xl leading-none font-extrabold tracking-tight">
                    <CountUp value={240} suffix="+" delay={reveal + DELAY.statOne + 0.2} />
                  </p>
                  <p className="font-display text-ink-soft mt-3 text-[0.9375rem] leading-snug">
                    Projects delivered across 18 countries since {site.founded}.
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
                        duration: DUR.reveal,
                        delay: reveal + DELAY.statOne + 0.4,
                        ease: EASE.out,
                      }}
                    />
                  </div>
                </FloatingCard>
              </div>

              <div className="xl:relative xl:z-10 xl:-ml-6 xl:mt-20 xl:w-72 xl:shrink-0 2xl:w-76">
                <FloatingCard
                  delay={reveal + DELAY.statTwo}
                  floatDuration={4.6}
                  tilt={4}
                  lift={5}
                  className={`${GLASS} p-6`}
                >
                  <p className="font-display text-ink text-4xl leading-none font-extrabold tracking-tight">
                    <CountUp
                      value={site.teamSize}
                      suffix="+"
                      delay={reveal + DELAY.statTwo + 0.2}
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
