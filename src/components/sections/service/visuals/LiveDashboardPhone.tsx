"use client";

import { motion, type Transition } from "motion/react";
import { useState } from "react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  ATTRIBUTED,
  CALLOUT,
  DATES,
  GRIDLINES,
  LINE,
  LIVE,
  LOOP,
  PEAK,
  PEAK_DELTA,
  PEAK_VALUE,
  PLOT_H,
  PLOT_W,
  SOURCES,
  TITLE,
  TOTAL,
  TOTAL_FROM,
  at,
} from "@/components/sections/service/visuals/liveDashboardShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * Phone stage of the performance-tracking-analytics depiction.
 *
 * The 960x640 drawing runs two collection sources into a dashboard and hangs a
 * summary card off its corner. At 327px both source labels wrapped out of their
 * own panels, the "Server-side" annotation came to rest on top of the panel it
 * annotates, and the summary card landed across the chart.
 *
 * **The chart is the one thing in this set that nothing else has, so it gets
 * the room.** Every other phone stage here is panels, rules and type; this one
 * is a plotted curve with an axis, and that is what makes it recognisable at a
 * glance as the analytics page rather than another diagram. It keeps the
 * desktop's exact curve — the same ten points — because that is the shape of
 * the data rather than a position on a canvas, and a phone that invented a
 * second curve would be showing different numbers for the same claim.
 *
 * **Collection still comes first.** The argument is that the figure should
 * survive being asked how it was calculated, so the order is provenance, then
 * curve, then total: the two sources sit above the dashboard and their packets
 * drop into it, which is the desktop's left-to-right rotated a quarter turn.
 * The "Server-side" annotation moves inside the row it belongs to, since in a
 * 360 column an annotation floating beside a panel is an annotation on top of
 * it.
 *
 * **The axis type is HTML, not SVG.** The curve's own space is 480 units wide
 * and it is drawn into 292, so text inside that space would render at a little
 * over 6px — the one thing `ts`'s floor cannot protect, because inside a
 * viewBox there is no floor. The rules and the curve scale; the labels are laid
 * over them and sized like every other label in the drawing.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 508);

const INSET = 20;
const COL_W = 320;
const PAD = 16;

const SOURCES_BOX = { y: 20, h: 112 };
const BOARD = { y: 156, h: 330 };

/** Where each source's packet leaves from, and drops to. */
const DROPS = [110, 250];

/** The plot's headroom, so the tooltip has somewhere to be. */
const TOOLTIP_H = 56;
const PLOT_BOX_H = 110;

/** Fractions of the plot box, from the curve's own coordinate space. */
const pct = (v: number, span: number) => `${((v / span) * 100).toFixed(3)}%`;
const PEAK_LEFT = pct(PEAK.x, PLOT_W);
const PEAK_TOP = pct(PEAK.y, PLOT_H);

/** Tooltip's lower edge down to the peak, in canvas units. */
const TETHER_H = 6 + (PEAK.y / PLOT_H) * PLOT_BOX_H;

/**
 * One easing per segment, never one for the sequence.
 *
 * A bare `ease` beside `times` is handed to WAAPI as the easing of the whole
 * effect, so the loop's own clock gets remapped and every offset in the
 * storyboard lands somewhere else. Holds take `linear` because a hold between
 * two identical values has no curve to have.
 */
const HOLD = "linear";

/** The tooltip, the peak marker and its tether all arrive as one gesture. */
const REVEAL: Transition = {
  duration: LOOP,
  times: [0, at(3.5), at(4.3), at(11.0), at(11.5), 1],
  repeat: Infinity,
  ease: [HOLD, EASE.out, HOLD, "easeInOut", HOLD],
};

export function LiveDashboardPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();
  // Touching parks the data loop so the reader can study a frame, the same
  // bargain the wide canvas offers a pointer.
  const [held, setHeld] = useState(false);
  const running = playing && !held;

  return (
    <div
      ref={ref}
      onPointerDown={() => setHeld(true)}
      onPointerUp={() => setHeld(false)}
      onPointerCancel={() => setHeld(false)}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="lg" className="top-[30%] left-[50%] -translate-x-1/2" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        {DROPS.map((x, i) => (
          <g key={x}>
            <line
              x1={x}
              y1={SOURCES_BOX.y + SOURCES_BOX.h}
              x2={x}
              y2={BOARD.y}
              stroke="var(--color-brand-200)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
            <motion.circle
              r={3}
              cx={x}
              fill="var(--color-brand-500)"
              initial={false}
              animate={
                running
                  ? {
                      cy: [SOURCES_BOX.y + SOURCES_BOX.h, BOARD.y, BOARD.y],
                      opacity: [0, 1, 1, 0, 0],
                    }
                  : { cy: BOARD.y, opacity: 0 }
              }
              transition={
                running
                  ? {
                      cy: {
                        duration: LOOP,
                        times: [0, at(1.5), 1],
                        repeat: Infinity,
                        ease: "linear",
                      },
                      opacity: {
                        duration: LOOP,
                        times: [0, at(0.2), at(1.3), at(1.5), 1],
                        repeat: Infinity,
                        ease: ["easeOut", HOLD, "easeIn", HOLD],
                        delay: i * 0.25,
                      },
                    }
                  : undefined
              }
            />
          </g>
        ))}
      </svg>

      {/* ---- Where the numbers came from ---- */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 4, period: 10, phase: 0.2 }}
        className="absolute flex flex-col justify-center"
        style={{
          left: px(INSET),
          top: py(SOURCES_BOX.y),
          width: px(COL_W),
          height: py(SOURCES_BOX.h),
          padding: `0 ${cq(PAD)}`,
          gap: cq(10),
          borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
        }}
      >
        {SOURCES.map((source, i) => (
          <span
            key={source.label}
            className="flex items-center justify-between"
            style={{ gap: cq(10) }}
          >
            <span className="min-w-0">
              <span
                className="text-ink block truncate font-medium"
                style={{ fontSize: ts(12) }}
              >
                {source.label}
              </span>
              <span
                className="text-ink-soft flex items-center"
                style={{ fontSize: ts(10), marginTop: cq(4), gap: cq(6) }}
              >
                <span
                  className="bg-brand-400 shrink-0 rounded-full"
                  style={{ width: cq(5), height: cq(5) }}
                />
                {source.detail}
              </span>
            </span>

            {/* The annotation, on the row it annotates. Beside the panel it
                would be over the panel: the gutter here is 20 units wide. */}
            {i === 1 && (
              <span
                className="border-hair bg-paper text-brand-700 shrink-0 rounded-full border font-semibold tracking-[0.08em] uppercase"
                style={{ fontSize: ts(9), padding: `${cq(4)} ${cq(9)}` }}
              >
                {CALLOUT}
              </span>
            )}
          </span>
        ))}
      </FloatPanel>

      {/* ---- The figure, and the curve it was read off ---- */}
      <FloatPanel
        playing={playing}
        focal
        interactive
        float={{ amplitude: 6, period: 12, phase: 0 }}
        className="absolute overflow-hidden"
        style={{
          left: px(INSET),
          top: py(BOARD.y),
          width: px(COL_W),
          height: py(BOARD.h),
          padding: cq(PAD),
          borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
        }}
      >
        <span className="flex items-center justify-between">
          <span className="text-ink font-medium" style={{ fontSize: ts(12) }}>
            {TITLE}
          </span>
          <span
            className="text-muted flex items-center"
            style={{ gap: cq(6), fontSize: ts(10) }}
          >
            <span
              className="bg-brand-500 rounded-full"
              style={{ width: cq(6), height: cq(6) }}
            />
            {LIVE}
          </span>
        </span>

        <span
          className="font-display text-brand-600 block leading-none font-semibold tracking-tight tabular-nums"
          style={{ fontSize: ts(28), marginTop: cq(14) }}
        >
          {running ? (
            <CountUp
              value={TOTAL}
              from={TOTAL_FROM}
              prefix="$"
              delay={2}
              duration={2}
            />
          ) : (
            `$${TOTAL.toLocaleString()}`
          )}
        </span>
        <span
          className="text-ink-soft block"
          style={{ fontSize: ts(11), marginTop: cq(5) }}
        >
          {ATTRIBUTED}
        </span>

        <Chart running={running} />
      </FloatPanel>
    </div>
  );
}

/**
 * The plot.
 *
 * The rules and the curve live in the curve's own 480x180 space so the shape is
 * the desktop's exactly. Everything that is type is laid over that box in HTML
 * instead, because a `fontSize` inside a viewBox scales with the viewBox and
 * would land at six pixels here — `ts`'s floor cannot reach inside an SVG.
 */
function Chart({ running }: { running: boolean }) {
  return (
    <span className="block" style={{ marginTop: cq(18) }}>
      {/* Headroom for the tooltip, which hangs above the curve's peak. */}
      <span
        className="relative block"
        style={{ height: cq(TOOLTIP_H + PLOT_BOX_H) }}
      >
        <motion.span
          aria-hidden
          className="border-hair absolute block rounded-lg border bg-white"
          style={{
            left: PEAK_LEFT,
            top: 0,
            width: cq(112),
            marginLeft: cq(-56),
            padding: cq(10),
            boxShadow: "0 4px 12px -2px rgb(44 56 49 / 0.04)",
            zIndex: 2,
          }}
          initial={false}
          animate={
            running
              ? { opacity: [0, 0, 1, 1, 0, 0], y: [8, 8, 0, 0, 0, 0] }
              : { opacity: 1, y: 0 }
          }
          transition={running ? REVEAL : undefined}
        >
          <span
            className="font-display text-ink block leading-none font-semibold tracking-tight tabular-nums"
            style={{ fontSize: ts(15) }}
          >
            {PEAK_VALUE}
          </span>
          <span
            className="text-brand-600 flex items-center leading-none font-medium tabular-nums"
            style={{ fontSize: ts(11), marginTop: cq(5), gap: cq(4) }}
          >
            <span aria-hidden>&uarr;</span>
            {PEAK_DELTA}
          </span>
        </motion.span>

        {/* The tether. Vertical, so a dashed border gives an even pattern and
            saves stretching the plot's viewBox up into the headroom. */}
        <motion.span
          aria-hidden
          className="border-brand-200 absolute block border-l border-dashed"
          style={{
            left: PEAK_LEFT,
            top: cq(TOOLTIP_H - 6),
            height: cq(TETHER_H),
          }}
          initial={false}
          animate={running ? { opacity: [0, 0, 1, 1, 0, 0] } : { opacity: 1 }}
          transition={running ? REVEAL : undefined}
        />

        <span
          className="absolute inset-x-0 block"
          style={{ top: cq(TOOLTIP_H), height: cq(PLOT_BOX_H) }}
        >
          <svg
            viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
            preserveAspectRatio="none"
            aria-hidden
            className="absolute inset-0 size-full"
          >
            {GRIDLINES.map((line) => (
              <line
                key={line.label}
                x1={0}
                y1={line.y}
                x2={PLOT_W}
                y2={line.y}
                stroke="var(--color-hair)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <line
              x1={0}
              y1={PLOT_H}
              x2={PLOT_W}
              y2={PLOT_H}
              stroke="var(--color-hair)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            {/* `non-scaling-stroke` throughout: the box is 292 units wide and
                110 tall against a 480x180 space, so the two axes scale by
                different factors and a plain stroke would come out thicker
                across than down. */}
            <motion.path
              d={LINE}
              fill="none"
              stroke="var(--color-brand-400)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={
                running
                  ? { pathLength: [0, 0, 1, 1, 1], opacity: [1, 1, 1, 1, 0] }
                  : { pathLength: 1, opacity: 1 }
              }
              transition={
                running
                  ? {
                      duration: LOOP,
                      times: [0, at(1.5), at(3.5), at(11.5), 1],
                      repeat: Infinity,
                      ease: [HOLD, EASE.out, HOLD, HOLD],
                    }
                  : undefined
              }
            />
          </svg>

          {/* The peak marker sits outside the SVG so it stays a circle: inside
              a box scaled 0.61 across and 0.61 down it would be, but the plot's
              two axes do not scale alike. */}
          <motion.span
            aria-hidden
            className="border-brand-600 absolute block rounded-full border-2 bg-white"
            style={{
              left: PEAK_LEFT,
              top: PEAK_TOP,
              width: cq(9),
              height: cq(9),
              marginLeft: cq(-4.5),
              marginTop: cq(-4.5),
            }}
            initial={false}
            animate={running ? { opacity: [0, 0, 1, 1, 0, 0] } : { opacity: 1 }}
            transition={running ? REVEAL : undefined}
          />

          {GRIDLINES.map((line) => (
            <span
              key={line.label}
              className="text-muted absolute left-0 block"
              style={{
                top: pct(line.y, PLOT_H),
                fontSize: ts(10),
                transform: "translateY(-115%)",
              }}
            >
              {line.label}
            </span>
          ))}
        </span>
      </span>

      <span
        className="flex justify-between"
        style={{ marginTop: cq(8) }}
        aria-hidden
      >
        {DATES.map((label) => (
          <span key={label} className="text-muted" style={{ fontSize: ts(10) }}>
            {label}
          </span>
        ))}
      </span>
    </span>
  );
}
