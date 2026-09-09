"use client";

import { motion, type Transition } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  CARDS,
  CTA,
  HERO_TITLE,
  LABELS,
  LOOP,
  NAV_LINKS,
  TIMES,
  swing,
} from "@/components/sections/service/visuals/breakpointRulerShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * Phone stage of the ui-ux-mobile-optimization depiction.
 *
 * The hardest one to move, because the drawing's subject is width and this
 * canvas has none. The 960x640 version maps 1440 real pixels onto 840 canvas
 * units and slides a frame down that scale; the same mapping into 320 units
 * would put the 375px stop at 83 units wide, which is not a layout, it is a
 * stripe. At 327px the wide version clipped its own `1440px` label off the
 * right edge and split "Book a demo" out of its pill.
 *
 * **So the ruler stops being a scale and becomes a set of stops.** Three ticks,
 * three widths, and a handle that steps between them — no false precision about
 * how far apart 1440 and 375 really are, which a 320-unit axis cannot honestly
 * express anyway. The frame still shrinks, and still shrinks *within* the dashed
 * outline that marks its full range, so the squeeze is visible; what it no
 * longer claims is that the distance is to scale.
 *
 * **The width readout travels instead of the labels.** Four static tick labels
 * need 46 units apiece and the ruler has room for two of them, so the stops are
 * bare marks and one readout crossfades through 1440 / 768 / 375 beside the
 * ruler. That also removes the clipping: a label pinned under the rightmost
 * tick has half of itself outside the canvas.
 *
 * **The cards stand their content up.** Beside its icon, "Performance" needs
 * more width than a third of a 320-unit frame has; above it, the same title
 * fits at every stop. Nothing is dropped at any width, which is the argument,
 * and the three-up row survives because the card changed shape rather than
 * shedding a word.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 482);

const ORIGIN_X = 20;
const RULER_Y = 72;
const FRAME = { y: 96, h: 366 };

/**
 * Frame widths at the three stops, and the tick each one's edge lands on.
 *
 * Chosen for legibility rather than derived from a scale: at 320 the three-up
 * row gives each card 90 units — enough for "Performance" to sit under its icon
 * unabbreviated — at 246 the two-up gives 105, and at 178 a stacked card still
 * has 154. A proportional mapping would have made the last of those 83.
 *
 * The widest stop is 314 rather than 320 so the readout, which rides the
 * handle, still has half its own width inside the canvas at the right-hand end.
 */
const WIDTHS = [314, 246, 178];
const TICKS = WIDTHS.map((w) => ORIGIN_X + w);

const swingCq = (d: number, t: number, m: number) => swing(d, t, m).map(cq);
const swingPx = (d: number, t: number, m: number) => swing(d, t, m).map(px);

/**
 * Interior geometry, as offsets from the frame's own top-left corner.
 *
 * In `cq` units, not percentages: a percentage inside the frame resolves
 * against the frame's box, which is the one thing in this drawing that changes
 * size. `cq` stays canvas-absolute however deeply it is nested.
 */
const LAYOUT = {
  desktop: {
    nav: { left: 14, top: 16, width: 286, height: 34 },
    hero: { left: 14, top: 60, width: 286, height: 150 },
    cards: [
      { left: 14, top: 226, width: 90, height: 92 },
      { left: 112, top: 226, width: 90, height: 92 },
      { left: 210, top: 226, width: 90, height: 92 },
    ],
  },
  tablet: {
    nav: { left: 13, top: 15, width: 220, height: 32 },
    hero: { left: 13, top: 55, width: 220, height: 112 },
    cards: [
      { left: 13, top: 180, width: 105, height: 74 },
      { left: 128, top: 180, width: 105, height: 74 },
      { left: 13, top: 262, width: 220, height: 74 },
    ],
  },
  mobile: {
    nav: { left: 12, top: 14, width: 154, height: 30 },
    hero: { left: 12, top: 52, width: 154, height: 86 },
    cards: [
      { left: 12, top: 150, width: 154, height: 62 },
      { left: 12, top: 220, width: 154, height: 62 },
      { left: 12, top: 290, width: 154, height: 62 },
    ],
  },
};

export function BreakpointRulerPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  // `easeInOut` with no `times` of its own would be fine, but this transition
  // carries `times`, and a single easing beside `times` is handed to WAAPI as
  // the easing of the whole effect rather than of each hop. One per segment.
  const loop: Transition | undefined = playing
    ? {
        duration: LOOP,
        times: TIMES,
        repeat: Infinity,
        ease: [
          "linear",
          "easeInOut",
          "linear",
          "easeInOut",
          "linear",
          "easeInOut",
          "linear",
        ],
      }
    : undefined;

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="lg" className="top-[30%] left-[36%]" />

      {/* The readout rides the handle, the way a ruler's does. One label that
          changes rather than a label per tick: four static ones need 46 units
          apiece and this ruler has room for two. */}
      <motion.span
        className="absolute -translate-x-1/2"
        style={{ top: py(26), fontSize: ts(12) }}
        initial={false}
        animate={
          playing
            ? { left: swing(px(TICKS[0]), px(TICKS[1]), px(TICKS[2])) }
            : { left: px(TICKS[2]) }
        }
        transition={loop}
      >
        {LABELS.map((label, i) => (
          <motion.span
            key={label}
            className="text-brand-700 absolute top-0 left-0 font-medium whitespace-nowrap tabular-nums"
            initial={false}
            animate={
              playing
                ? {
                    opacity: swing(
                      i === 0 ? 1 : 0,
                      i === 1 ? 1 : 0,
                      i === 2 ? 1 : 0,
                    ),
                  }
                : { opacity: i === 2 ? 1 : 0 }
            }
            transition={loop}
          >
            {label}
          </motion.span>
        ))}
        {/* Holds the box open at the widest reading, so the centring is stable. */}
        <span className="invisible whitespace-nowrap" aria-hidden>
          {LABELS[0]}
        </span>
      </motion.span>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <line
          x1={ORIGIN_X}
          y1={RULER_Y}
          x2={TICKS[0]}
          y2={RULER_Y}
          stroke="var(--color-hair)"
          strokeWidth={1.5}
        />
        {TICKS.map((x) => (
          <line
            key={x}
            x1={x}
            y1={RULER_Y - 10}
            x2={x}
            y2={RULER_Y}
            stroke="var(--color-hair)"
            strokeWidth={1.5}
          />
        ))}

        {/* Guide from the handle down to the edge it is measuring. */}
        <motion.line
          y1={RULER_Y + 16}
          y2={FRAME.y}
          stroke="var(--color-brand-300)"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          initial={false}
          animate={
            playing
              ? {
                  x1: swing(TICKS[0], TICKS[1], TICKS[2]),
                  x2: swing(TICKS[0], TICKS[1], TICKS[2]),
                }
              : { x1: TICKS[2], x2: TICKS[2] }
          }
          transition={loop}
        />

        <motion.rect
          y={RULER_Y - 16}
          width={5}
          height={32}
          rx={2.5}
          fill="var(--color-brand-500)"
          initial={false}
          animate={
            playing
              ? { x: swing(TICKS[0] - 2.5, TICKS[1] - 2.5, TICKS[2] - 2.5) }
              : { x: TICKS[2] - 2.5 }
          }
          transition={loop}
        />
      </svg>

      {/* The range the layout has to cover. Structure — it never leaves. */}
      <span
        className="border-hair/80 absolute rounded-[clamp(0.625rem,3.5cqw,1.25rem)] border border-dashed"
        style={{
          left: px(ORIGIN_X),
          top: py(FRAME.y),
          width: px(WIDTHS[0]),
          height: py(FRAME.h),
        }}
      />

      {/* The frame. No ambient bob — the resize has to read against a
          stationary ruler, and a bobbing frame makes the width ambiguous. */}
      <motion.div
        className="border-hair absolute overflow-hidden border bg-white"
        style={{
          left: px(ORIGIN_X),
          top: py(FRAME.y),
          height: py(FRAME.h),
          borderRadius: "clamp(0.625rem, 3.5cqw, 1.25rem)",
          boxShadow: "var(--shadow-float)",
        }}
        initial={false}
        animate={
          playing
            ? { width: swingPx(WIDTHS[0], WIDTHS[1], WIDTHS[2]) }
            : { width: px(WIDTHS[2]) }
        }
        transition={loop}
      >
        <Box
          playing={playing}
          loop={loop}
          rects={[LAYOUT.desktop.nav, LAYOUT.tablet.nav, LAYOUT.mobile.nav]}
          className="border-hair bg-paper flex items-center justify-between border"
          radius={cq(10)}
          padding={`0 ${cq(12)}`}
        >
          <span
            className="bg-brand-200 block shrink-0 rounded-md"
            style={{ width: cq(18), height: cq(18) }}
          />
          {/* Links survive the tablet stop and collapse only at 375. */}
          <motion.span
            className="flex items-center"
            style={{ gap: cq(14) }}
            initial={false}
            animate={playing ? { opacity: swing(1, 1, 0) } : { opacity: 0 }}
            transition={loop}
          >
            {NAV_LINKS.map((link) => (
              <span
                key={link}
                className="text-ink-soft"
                style={{ fontSize: ts(10) }}
              >
                {link}
              </span>
            ))}
          </motion.span>
          <motion.span
            className="absolute"
            style={{ right: cq(12), display: "grid", gap: cq(3) }}
            initial={false}
            animate={playing ? { opacity: swing(0, 0, 1) } : { opacity: 1 }}
            transition={loop}
          >
            {[0, 1, 2].map((bar) => (
              <span
                key={bar}
                className="bg-ink-soft block rounded-full"
                style={{ width: cq(14), height: cq(2) }}
              />
            ))}
          </motion.span>
        </Box>

        <Box
          playing={playing}
          loop={loop}
          rects={[LAYOUT.desktop.hero, LAYOUT.tablet.hero, LAYOUT.mobile.hero]}
          className="border-hair bg-paper flex flex-col items-center justify-center border"
          radius={cq(12)}
          padding={cq(12)}
        >
          <span
            className="font-display text-ink text-center leading-tight font-semibold tracking-tight"
            style={{ fontSize: ts(15) }}
          >
            {HERO_TITLE}
          </span>
          {/* Sized from the label rather than the other way round: the wide
              canvas gave this pill 104 units and "Book a demo" needed 118. */}
          <span
            className="bg-brand-600 grid place-items-center rounded-full font-medium whitespace-nowrap text-white"
            style={{
              height: cq(24),
              padding: `0 ${cq(14)}`,
              fontSize: ts(9),
              marginTop: cq(12),
            }}
          >
            {CTA}
          </span>
        </Box>

        {CARDS.map((title, i) => (
          <Box
            key={title}
            playing={playing}
            loop={loop}
            rects={[
              LAYOUT.desktop.cards[i],
              LAYOUT.tablet.cards[i],
              LAYOUT.mobile.cards[i],
            ]}
            className="border-hair bg-paper flex flex-col justify-center border"
            radius={cq(10)}
            padding={cq(8)}
          >
            <span
              className="bg-brand-50 block shrink-0 rounded-md"
              style={{ width: cq(20), height: cq(20) }}
            />
            <span
              className="text-ink block truncate font-medium"
              style={{ fontSize: ts(10), marginTop: cq(7) }}
            >
              {title}
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
  loop,
  rects,
  className,
  radius,
  padding,
  children,
}: {
  playing: boolean;
  loop: Transition | undefined;
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
      transition={loop}
    >
      {children}
    </motion.div>
  );
}
