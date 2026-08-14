"use client";

import {
  AnimatePresence,
  motion,
  useIsPresent,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useState } from "react";

import type { BootSignal } from "@/components/boot/BootProvider";
import { LOGO_SIZE, LOGO_SRC } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Layout";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

/**
 * The mark's size on the curtain, and therefore the portal's aperture. Fluid,
 * because this is the only element on the screen and a fixed size would read as
 * a stamp on a phone and a postage stamp on a 27" display.
 */
const MARK = "clamp(7rem, 15vw, 12rem)";

/**
 * How far the plates grow to clear the viewport.
 *
 * The worst case is the widest viewport against the *clamped* mark: 12rem
 * (192px) against a 2560×1440 screen puts the far corner 1469px from centre
 * and the mark's half-width at 96px, so 16× would just cover it edge to edge.
 * The rounded corner eats into that, and every narrower viewport needs less, so
 * 24 clears everything with room rather than being tuned to one screen.
 */
const PORTAL_SCALE = 24;

/**
 * Split to characters below so each rises from its own mask. The gap is an
 * explicit non-breaking space: a plain one, alone in the block box that masking
 * requires, collapses to zero width and sets the lockup as "PIXELPORTAL".
 */
const WORDMARK = "PIXEL\u00A0PORTAL";

/**
 * What the counter is actually waiting for, in the order a page resolves it.
 *
 * The label names the *outstanding* signal, not a decorative sequence — when it
 * says "Compiling environment" the Spline runtime genuinely has not finished
 * streaming. This is the difference between a status line and set dressing, and
 * it is why the last one is reached rather than scheduled.
 */
const STATUS: { signal: BootSignal; label: string }[] = [
  { signal: "fonts", label: "Loading typefaces" },
  { signal: "art", label: "Resolving brand assets" },
  { signal: "scene", label: "Compiling environment" },
];

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface BootCurtainProps {
  phase: "curtain" | "opening";
  progress: MotionValue<number>;
  ready: Partial<Record<BootSignal, boolean>>;
  onSkip: () => void;
  /** Fires when the mark itself has decoded — one of the three real signals. */
  onArtReady: () => void;
}

/**
 * The title card.
 *
 * Dark, which is the whole reason the reveal lands: this site is white and
 * green, so opening on ink means the page does not fade in, it *arrives*. The
 * grid, the hairlines and the green are all the site's own vocabulary, so the
 * curtain reads as the same design system with the lights off rather than as a
 * splash screen bolted to the front.
 *
 * Every layer here is `aria-hidden` except the skip control. The page beneath
 * is fully rendered and in the accessibility tree the entire time — this is a
 * visual cover, not a modal, and announcing it would interrupt a reader who is
 * already being read the real content.
 */
export function BootCurtain({ phase, progress, ready, onSkip, onArtReady }: BootCurtainProps) {
  const opening = phase === "opening";

  /**
   * The exit is a 450ms fade, during which this is still a full-viewport
   * element over an interactive page. Dropping pointer events for that window
   * stops an invisible sheet from swallowing the first click on the site.
   */
  const isPresent = useIsPresent();

  /** The mark holds shut until its own artwork has decoded, so the aperture
   *  never opens onto an empty square on a cold cache. */
  const artReady = Boolean(ready.art);

  const barScale = useTransform(progress, [0, 100], [0, 1]);

  /** The first signal still outstanding — or the last label, once none are. */
  const pending = STATUS.find((entry) => !ready[entry.signal]);
  const status = pending ?? { signal: "scene" as const, label: "Entering" };

  return (
    <motion.div
      // Hooked by the no-JS backstop in the root layout: this is server-rendered,
      // so without hydration to retire it the curtain would cover the page for good.
      data-boot="curtain"
      className={cn(
        "fixed inset-0 z-60 overflow-hidden bg-ink",
        !isPresent && "pointer-events-none",
      )}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE.inOut } }}
    >
      {/* ---- Ground ------------------------------------------------------ */}

      {/* The same 72px grid the hero draws, at the opacity a light rule reaches
          on ink. Continuity, not texture: when the portal opens, the grid on
          the page beneath is already in register with this one. */}
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0 opacity-[0.055]" />

      {/* One light source, behind where the mark lands. It blooms as the mark
          opens and again as the portal goes. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/25 blur-[130px]"
        initial={{ opacity: 0.25, scale: 0.8 }}
        animate={{
          opacity: opening ? 0.75 : artReady ? 0.6 : 0.25,
          scale: opening ? 1.25 : artReady ? 1 : 0.8,
        }}
        transition={{ duration: opening ? 0.95 : 1.6, ease: EASE.out }}
      />

      {/* A single pass of a scan line. It runs once and never repeats — a loop
          here would turn a title card into a screensaver. */}
      {!opening && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"
          initial={{ y: "-2vh", opacity: 0 }}
          animate={{ y: "102vh", opacity: [0, 1, 1, 0] }}
          // `times` belongs to the opacity keyframes and nothing else — at the
          // top level it would be handed to a `y` that is a single value, not an
          // array, and has no keyframes to distribute across.
          transition={{
            duration: 2.8,
            delay: 0.95,
            ease: [0.5, 0, 0.5, 1],
            opacity: {
              duration: 2.8,
              delay: 0.95,
              times: [0, 0.12, 0.82, 1],
              ease: "linear",
            },
          }}
        />
      )}

      {/* ---- Chrome ------------------------------------------------------
          Everything that is not the mark leaves before the portal reaches it,
          so the expansion wipes an empty field rather than swallowing live
          type mid-sentence. */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-between"
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.42, ease: EASE.inOut }}
      >
        {/* Top rail */}
        <Container wide>
          <div className="flex items-start justify-between gap-6 border-b border-white/10 py-6 lg:py-7">
            <p aria-hidden className="font-display flex text-[0.8125rem] font-semibold tracking-[0.34em] text-white/85">
              {WORDMARK.split("").map((character, index) => (
                <span key={index} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      delay: 0.18 + index * 0.048,
                      type: "spring",
                      stiffness: 210,
                      damping: 28,
                      mass: 0.9,
                    }}
                  >
                    {character}
                  </motion.span>
                </span>
              ))}
            </p>

            <motion.p
              aria-hidden
              className="font-display text-right text-[0.6875rem] leading-relaxed font-medium tracking-[0.18em] text-white/40 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.95, ease: EASE.out }}
            >
              Est. {site.founded}
              <br />
              {site.offices[0].city}, {site.offices[0].country}
            </motion.p>
          </div>
        </Container>

        {/* Bottom rail */}
        <div>
          <Container wide>
            <motion.div
              className="flex items-end justify-between gap-8 pb-7 lg:pb-9"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: EASE.out }}
            >
              <div className="min-w-0">
                {/* Masked swap, so the status *changes* rather than cross-fading
                    through a blank. Both children are absolute over a reserved
                    line box — stacked in flow they would push each other around
                    for the length of the transition. */}
                <div aria-hidden className="relative h-5 overflow-hidden">
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={status.label}
                      className="font-display absolute inset-x-0 top-0 block truncate text-[0.75rem] font-medium tracking-[0.2em] text-white/55 uppercase"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-110%" }}
                      transition={{ duration: 0.6, ease: EASE.out }}
                    >
                      {status.label}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={onSkip}
                  className="font-display mt-3 inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.2em] text-white/35 uppercase transition-colors hover:text-white/80 focus-visible:text-white/80"
                >
                  Skip intro
                  <span aria-hidden className="text-white/25">
                    Esc
                  </span>
                </button>
              </div>

              <Counter progress={progress} />
            </motion.div>
          </Container>

          {/* The one element carrying real load state at full width. */}
          <div aria-hidden className="h-px w-full bg-white/10">
            <motion.div className="h-full origin-left bg-brand-400" style={{ scaleX: barScale }} />
          </div>
        </div>
      </motion.div>

      {/* ---- Centre: the mark, and the portal it becomes ------------------ */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* Two plates, not one. The green leads by a beat so the white ground
            arrives behind a brand-coloured edge instead of simply flashing —
            that leading rim is what makes an expanding rectangle read as an
            aperture opening rather than a light being switched on.

            Centred by translate rather than left to the flex container's
            static position, which is where an absolutely-positioned flex child
            would otherwise land. Tailwind v4 emits `translate:` as its own
            property, so it composes with the `transform` Motion writes for
            `scale` instead of being overwritten by it — and because the shift
            resolves before the scale, these grow about their own centre. */}
        {opening && (
          <>
            <motion.div
              aria-hidden
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[26%] bg-brand-500"
              style={{ width: MARK, height: MARK }}
              initial={{ scale: 1 }}
              animate={{ scale: PORTAL_SCALE }}
              transition={{ duration: 0.95, ease: EASE.inOut }}
            />
            <motion.div
              aria-hidden
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[26%] bg-white"
              style={{ width: MARK, height: MARK }}
              initial={{ scale: 1 }}
              animate={{ scale: PORTAL_SCALE }}
              transition={{ duration: 0.95, delay: 0.15, ease: EASE.inOut }}
            />
          </>
        )}

        {/* Aperture ring. Sits just outside the mark, arrives with it, and
            releases outward as the portal goes. */}
        <motion.div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[26%] border border-brand-400/35"
          style={{ width: MARK, height: MARK }}
          initial={{ scale: 1.32, opacity: 0 }}
          animate={{
            scale: opening ? 1.9 : artReady ? 1.14 : 1.32,
            opacity: opening ? 0 : artReady ? 1 : 0,
          }}
          transition={{ duration: opening ? 0.8 : 1.3, delay: opening ? 0 : 0.34, ease: EASE.out }}
        />

        {/* The mark. Two transforms doing two different jobs: the wrapper
            widens a thin bar into a square, and the clip opens that bar from
            the mark's own centre line outward. Between them the artwork
            assembles rather than fades — and the horizontal squash is never
            visible on the type, because at 18% width the only thing showing is
            the flat green band between the two words. */}
        <motion.div
          aria-hidden
          className="relative"
          style={{ width: MARK, height: MARK }}
          initial={{ scaleX: 0.18, opacity: 0 }}
          animate={{
            scaleX: artReady ? 1 : 0.18,
            opacity: artReady ? 1 : 0,
            scale: opening ? 1.06 : 1,
          }}
          transition={{ duration: 1.05, delay: opening ? 0 : 0.34, ease: EASE.out }}
        >
          <motion.div
            className="h-full w-full overflow-hidden rounded-[26%]"
            initial={{ clipPath: "inset(46% 0% 46% 0% round 26%)" }}
            animate={{
              clipPath: artReady
                ? "inset(0% 0% 0% 0% round 26%)"
                : "inset(46% 0% 46% 0% round 26%)",
            }}
            transition={{ duration: 1.3, delay: 0.46, ease: EASE.out }}
          >
            <Image
              src={LOGO_SRC}
              alt=""
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              priority
              // The upper end of MARK. Without it `next/image` believes the
              // mark renders at its intrinsic 1563px and offers a 3840px
              // re-encode — for a 192px box, on the blocking request of the
              // first paint, gating a signal this sequence is waiting on. The
              // browser scales by DPR from here, so a 2× display still lands on
              // a 384px file.
              sizes="192px"
              onLoad={onArtReady}
              // A decode failure must not strand the sequence: the signal is
              // reported either way, and the ceiling in BootProvider is the
              // second backstop behind that.
              onError={onArtReady}
              className="h-full w-full object-contain"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   The counter
   ========================================================================== */

/**
 * Three rolling digit columns.
 *
 * A number that simply re-renders is a readout; digits that travel are the
 * thing people recognise from a title sequence, and it costs one transform per
 * column. Leading zeros stay in place but dimmed, so the field keeps a fixed
 * width — a counter that grows from one glyph to three shifts everything beside
 * it twice on the way up.
 *
 * Subscribes to the motion value directly rather than taking a number, so the
 * hundred-odd updates during the ramp re-render this and nothing else.
 */
function Counter({ progress }: { progress: MotionValue<number> }) {
  const [value, setValue] = useState(0);

  useMotionValueEvent(progress, "change", (latest) => {
    const next = Math.max(0, Math.min(100, Math.round(latest)));
    setValue((current) => (current === next ? current : next));
  });

  const digits = String(value).padStart(3, "0").split("");
  /** Index of the first significant digit; everything before it renders dim. */
  const firstReal = digits.findIndex((digit) => digit !== "0");

  return (
    <p
      aria-hidden
      className="font-display flex shrink-0 text-6xl leading-none font-semibold tracking-tight tabular-nums sm:text-7xl lg:text-8xl"
    >
      {digits.map((digit, index) => (
        <Digit
          key={index}
          value={Number(digit)}
          dim={firstReal === -1 ? index < 2 : index < firstReal}
        />
      ))}
    </p>
  );
}

function Digit({ value, dim }: { value: number; dim: boolean }) {
  return (
    <span
      className="relative block overflow-hidden transition-colors duration-500"
      // A fixed advance is required: the sliding column is absolutely
      // positioned, so the clipping box has no intrinsic width to inherit from
      // it. Sized off the em rather than a pixel value so it tracks the fluid
      // type above it.
      style={{ height: "1em", width: "0.66em", color: dim ? "rgba(255,255,255,0.16)" : "#fff" }}
    >
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        // The column is ten `1em` rows tall, so a percentage of its own height
        // is exactly one digit per 10%.
        animate={{ y: `${value * -10}%` }}
        transition={{ type: "spring", stiffness: 170, damping: 28, mass: 0.8 }}
      >
        {DIGITS.map((digit) => (
          <span key={digit} className="block h-[1em] leading-[1em]">
            {digit}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
