"use client";

import { motion, type Transition } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import {
  H,
  W,
  cq,
  px,
  py,
  ts,
} from "@/components/sections/service/visuals/canvas";
import { BreakpointRulerPhone } from "@/components/sections/service/visuals/BreakpointRulerPhone";
import {
  CARDS,
  CTA,
  HERO_TITLE,
  LOOP,
  NAV_LINKS,
  TIMES,
  swing,
} from "@/components/sections/service/visuals/breakpointRulerShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * One layout, measured across its whole range.
 *
 * A ruler with a handle drives a single frame's width, and the frame's contents
 * reflow as it narrows — three columns become two at the tablet stop, then one.
 * Nothing is dropped: the argument is that the layout *survives* the squeeze,
 * and a card that vanishes at 375px is the failure the page sells against.
 *
 * The 768 stop is the one the headline names, so the sweep rests there rather
 * than passing through it. Two columns with the third running full width is
 * what a three-item grid actually does at that size, and showing the middle
 * state is what proves the layout has one rather than two hand-built extremes.
 *
 * **Three changes from the blueprint.**
 *
 * The handle and the frame disagreed. Ticks were placed at 900/644/490/255 and
 * the frame was told to shrink to 235, so at the mobile end the handle sat 40
 * units clear of the edge it is supposed to be measuring. The scale is now
 * derived once — 1440 real px maps to 840 canvas units from a shared origin at
 * x=60 — and the tick positions, the handle and every frame width read from it.
 *
 * The blueprint dropped cards 2 and 3 out of frame at mobile, which argues the
 * opposite of the page, and left 66% negative space by its own measurement. The
 * cards now stack.
 *
 * The dashed ghost outline is added. It marks the full desktop width at all
 * times, so the frame is visibly shrinking *within a range* rather than just
 * getting small, and the canvas still has structure in it during the beats the
 * frame spends narrow.
 *
 * The phone stage turns the scale into a set of stops; see
 * `BreakpointRulerPhone` for why.
 */

export function BreakpointRuler() {
  return (
    <>
      <div className="md:hidden">
        <BreakpointRulerPhone />
      </div>
      <div className="hidden md:block">
        <BreakpointRulerDesktop />
      </div>
    </>
  );
}

/** Shared origin and scale. Every horizontal number below derives from these. */
const ORIGIN_X = 60;
const DESKTOP_REAL = 1440;
const DESKTOP_W = 840;
const SCALE = DESKTOP_W / DESKTOP_REAL;
const tickX = (real: number) => Math.round(ORIGIN_X + real * SCALE);
const frameW = (real: number) => Math.round(real * SCALE);

const TICKS = [1440, 1024, 768, 375];

const TABLET_W = frameW(768);
const MOBILE_W = frameW(375);

const FRAME = { y: 140, h: 460 };
const RULER_Y = 96;

/**
 * Interior geometry, as offsets from the frame's own top-left corner.
 *
 * In `cq` units, not percentages: a percentage inside the frame resolves
 * against the frame's box, which is the one thing in this drawing that changes
 * size. `cq` stays canvas-absolute however deeply it is nested.
 */
const LAYOUT = {
  desktop: {
    nav: { left: 40, top: 40, width: 760, height: 44 },
    hero: { left: 40, top: 108, width: 760, height: 170 },
    cards: [
      { left: 40, top: 306, width: 240, height: 114 },
      { left: 300, top: 306, width: 240, height: 114 },
      { left: 560, top: 306, width: 240, height: 114 },
    ],
  },
  tablet: {
    nav: { left: 30, top: 36, width: 388, height: 42 },
    hero: { left: 30, top: 98, width: 388, height: 140 },
    cards: [
      { left: 30, top: 260, width: 186, height: 88 },
      { left: 232, top: 260, width: 186, height: 88 },
      { left: 30, top: 362, width: 388, height: 88 },
    ],
  },
  mobile: {
    nav: { left: 20, top: 30, width: 179, height: 38 },
    hero: { left: 20, top: 84, width: 179, height: 110 },
    cards: [
      { left: 20, top: 210, width: 179, height: 74 },
      { left: 20, top: 294, width: 179, height: 74 },
      { left: 20, top: 378, width: 179, height: 74 },
    ],
  },
};

const swingCq = (d: number, t: number, m: number) => swing(d, t, m).map(cq);

/**
 * One easing per hop, not one for the sequence.
 *
 * A bare `ease` beside `times` is handed to WAAPI as the easing of the whole
 * effect, which remaps the loop's clock and lands every offset somewhere else.
 * The holds take `linear`, since a hold between two identical values has no
 * curve to have.
 */
const EASE_PER_HOP = [
  "linear",
  "easeInOut",
  "linear",
  "easeInOut",
  "linear",
  "easeInOut",
  "linear",
] as const;

function BreakpointRulerDesktop() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  const loop: Transition | undefined = playing
    ? {
        duration: LOOP,
        times: TIMES,
        repeat: Infinity,
        ease: [...EASE_PER_HOP],
      }
    : undefined;

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="lg" className="top-[31.25%] left-[33.333%]" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <line
          x1={ORIGIN_X}
          y1={RULER_Y}
          x2={tickX(DESKTOP_REAL)}
          y2={RULER_Y}
          stroke="var(--color-hair)"
          strokeWidth={1.5}
        />
        {TICKS.map((real) => (
          <line
            key={real}
            x1={tickX(real)}
            y1={RULER_Y - 10}
            x2={tickX(real)}
            y2={RULER_Y}
            stroke="var(--color-hair)"
            strokeWidth={1.5}
          />
        ))}

        {/* Guide from the handle down to the edge it is measuring. */}
        <motion.line
          y1={RULER_Y + 22}
          y2={FRAME.y}
          stroke="var(--color-brand-300)"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          initial={false}
          animate={
            playing
              ? {
                  x1: swing(tickX(1440), tickX(768), tickX(375)),
                  x2: swing(tickX(1440), tickX(768), tickX(375)),
                }
              : { x1: tickX(375), x2: tickX(375) }
          }
          transition={loop}
        />

        <motion.rect
          y={RULER_Y - 22}
          width={6}
          height={44}
          rx={3}
          fill="var(--color-brand-500)"
          initial={false}
          animate={
            playing
              ? { x: swing(tickX(1440) - 3, tickX(768) - 3, tickX(375) - 3) }
              : { x: tickX(375) - 3 }
          }
          transition={loop}
        />
      </svg>

      {TICKS.map((real) => (
        <span
          key={real}
          className="text-muted absolute -translate-x-1/2 tabular-nums"
          style={{ left: px(tickX(real)), top: py(58), fontSize: ts(11) }}
        >
          {real}px
        </span>
      ))}

      {/* The range the layout has to cover. Structure — it never leaves. */}
      <span
        className="border-hair/80 absolute rounded-[clamp(0.75rem,2.5cqw,1.5rem)] border border-dashed"
        style={{
          left: px(ORIGIN_X),
          top: py(FRAME.y),
          width: px(DESKTOP_W),
          height: py(FRAME.h),
        }}
      />

      {/* The frame itself. No ambient bob — the resize has to read against a
          stationary ruler, and a bobbing frame makes the width ambiguous. */}
      <motion.div
        className="border-hair absolute overflow-hidden border bg-white"
        style={{
          left: px(ORIGIN_X),
          top: py(FRAME.y),
          height: py(FRAME.h),
          borderRadius: "clamp(0.75rem, 2.5cqw, 1.5rem)",
          boxShadow: "var(--shadow-float)",
        }}
        initial={false}
        animate={
          playing
            ? { width: swing(DESKTOP_W, TABLET_W, MOBILE_W).map(px) }
            : { width: px(MOBILE_W) }
        }
        transition={loop}
      >
        <Box
          playing={playing}
          rects={[LAYOUT.desktop.nav, LAYOUT.tablet.nav, LAYOUT.mobile.nav]}
          className="border-hair bg-paper flex items-center justify-between border"
          radius={cq(12)}
          padding={`0 ${cq(14)}`}
        >
          <span
            className="bg-brand-200 block shrink-0 rounded-md"
            style={{ width: cq(22), height: cq(22) }}
          />
          {/* Links survive the tablet stop and collapse only at 375. */}
          <motion.span
            className="flex items-center"
            style={{ gap: cq(18) }}
            initial={false}
            animate={playing ? { opacity: swing(1, 1, 0) } : { opacity: 0 }}
            transition={loop}
          >
            {NAV_LINKS.map((link) => (
              <span
                key={link}
                className="text-ink-soft"
                style={{ fontSize: ts(11) }}
              >
                {link}
              </span>
            ))}
          </motion.span>
          <motion.span
            className="absolute"
            style={{ right: cq(14), display: "grid", gap: cq(4) }}
            initial={false}
            animate={playing ? { opacity: swing(0, 0, 1) } : { opacity: 1 }}
            transition={loop}
          >
            {[0, 1, 2].map((bar) => (
              <span
                key={bar}
                className="bg-ink-soft block rounded-full"
                style={{ width: cq(16), height: cq(2) }}
              />
            ))}
          </motion.span>
        </Box>

        <Box
          playing={playing}
          rects={[LAYOUT.desktop.hero, LAYOUT.tablet.hero, LAYOUT.mobile.hero]}
          className="border-hair bg-paper flex flex-col items-center justify-center border"
          radius={cq(16)}
          padding={cq(14)}
        >
          <span
            className="font-display text-ink text-center font-semibold tracking-tight"
            style={{ fontSize: ts(20) }}
          >
            {HERO_TITLE}
          </span>
          {/* Sized from the label, not to a fixed width. `ts` floors at 10px,
              so "Book a demo" is 58px whatever the canvas does, while 104 units
              is 82px at 1440 and 38 at the breakpoint this component starts
              rendering at — where the label was breaking out of its own pill. */}
          <span
            className="bg-brand-600 grid place-items-center rounded-full font-medium whitespace-nowrap text-white"
            style={{
              height: cq(28),
              padding: `0 ${cq(18)}`,
              fontSize: ts(10),
              marginTop: cq(14),
            }}
          >
            {CTA}
          </span>
        </Box>

        {CARDS.map((title, i) => (
          <Box
            key={title}
            playing={playing}
            rects={[
              LAYOUT.desktop.cards[i],
              LAYOUT.tablet.cards[i],
              LAYOUT.mobile.cards[i],
            ]}
            className="border-hair bg-paper flex items-center border"
            radius={cq(14)}
            padding={cq(14)}
          >
            <span
              className="bg-brand-50 block shrink-0 rounded-lg"
              style={{ width: cq(30), height: cq(30) }}
            />
            <span className="min-w-0" style={{ marginLeft: cq(12) }}>
              <span
                className="text-ink block truncate font-medium"
                style={{ fontSize: ts(12) }}
              >
                {title}
              </span>
              <span
                className="bg-hair block rounded-full"
                style={{ height: cq(5), width: cq(70), marginTop: cq(7) }}
              />
            </span>
          </Box>
        ))}
      </motion.div>
    </div>
  );
}

type BoxRect = { left: number; top: number; width: number; height: number };

/**
 * One interior element, animated across its three geometries.
 *
 * Absolutely positioned so the five of them never reflow against each other —
 * the frame resizing triggers one isolated layout per box rather than a cascade
 * through a flow container.
 */
function Box({
  playing,
  rects,
  className,
  radius,
  padding,
  children,
}: {
  playing: boolean;
  /** Desktop, tablet, mobile. */
  rects: [BoxRect, BoxRect, BoxRect];
  className: string;
  radius: string;
  padding: string;
  children: React.ReactNode;
}) {
  const [d, t, m] = rects;
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ borderRadius: radius, padding }}
      initial={false}
      animate={
        playing
          ? {
              left: swingCq(d.left, t.left, m.left),
              top: swingCq(d.top, t.top, m.top),
              width: swingCq(d.width, t.width, m.width),
              height: swingCq(d.height, t.height, m.height),
            }
          : {
              left: cq(m.left),
              top: cq(m.top),
              width: cq(m.width),
              height: cq(m.height),
            }
      }
      transition={
        playing
          ? {
              duration: LOOP,
              times: TIMES,
              repeat: Infinity,
              ease: [...EASE_PER_HOP],
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
