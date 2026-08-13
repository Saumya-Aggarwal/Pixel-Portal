"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { CalloutChip } from "@/components/sections/service/visuals/chrome/Callout";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import {
  H,
  W,
  beat,
  px,
  py,
  ts,
} from "@/components/sections/service/visuals/canvas";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * Revenue attribution, being assembled.
 *
 * Two collection sources on the left — a browser client and a server-side
 * container — feed data packets along dotted leaders into a dashboard, which
 * draws its curve, ticks its total, and pins a tooltip to the peak. The page's
 * argument is that a figure in a board deck should survive being questioned,
 * so the picture shows the figure being *derived* rather than just displayed.
 *
 * Built to an explicit 960x640 blueprint. Every position below is that
 * blueprint's coordinate converted to a percentage, which is what lets the
 * whole composition scale with its container instead of needing breakpoints
 * for geometry. Type scales the same way via `cqw`, with a 10px floor so the
 * smallest labels stay legible when the canvas shrinks.
 *
 * Structure never moves. Only data does — packets travel, the line draws, the
 * counter climbs, the tooltip lands. The panels themselves only drift on a long
 * ambient float, deliberately out of phase so they never breathe in unison.
 *
 * The loop is 12s and spends 6.7s of it perfectly still. That rest beat is the
 * difference between an illustration and a distraction.
 */

const LOOP = 12;
/** Blueprint timings in seconds, as fractions of the loop. */
const at = (seconds: number) => beat(seconds, LOOP);

/** Chart plot area, in its own 480x180 space. Peak at x=310 carries the tooltip. */
const PLOT = [
  [0, 152],
  [53, 140],
  [107, 146],
  [160, 118],
  [213, 96],
  [267, 54],
  [310, 20],
  [373, 48],
  [427, 38],
  [480, 26],
] as const;

const LINE = PLOT.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(
  " ",
);
const PEAK = { x: 310, y: 20 };

export function LiveDashboard() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();
  // Hovering parks the data loop so the reader can study a frame. Cheaper and
  // far less disruptive than tilting a frame full of 10px UI text.
  const [hovered, setHovered] = useState(false);
  const running = playing && !hovered;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="@container relative aspect-3/2 w-full"
    >
      <GridGround />
      {/* Sits in the void the composition leaves around the primary panel. */}
      <Backlight
        size="lg"
        className="left-[50%] top-[31.25%] -translate-x-1/2 -translate-y-1/4"
      />

      {/* ---- Leaders and packets. One SVG in canvas space so the dashes stay
              even and the packets land exactly on the panel edges. ---- */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        {[208, 388].map((y, i) => (
          <g key={y}>
            <line
              x1={260}
              y1={y}
              x2={360}
              y2={y}
              stroke="var(--color-brand-200)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
            <motion.circle
              r={3}
              cy={y}
              fill="var(--color-brand-500)"
              initial={false}
              animate={
                running
                  ? { cx: [260, 360, 360], opacity: [0, 1, 1, 0, 0] }
                  : // Resolved state: packets have arrived and gone, leaving
                    // the leaders to carry the relationship.
                    { cx: 360, opacity: 0 }
              }
              transition={
                running
                  ? {
                      cx: {
                        duration: LOOP,
                        times: [0, at(1.5), 1],
                        repeat: Infinity,
                        ease: "linear",
                      },
                      opacity: {
                        duration: LOOP,
                        times: [0, at(0.2), at(1.3), at(1.5), 1],
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.25,
                      },
                    }
                  : undefined
              }
            />
          </g>
        ))}
      </svg>

      {/* ---- Collection sources ---- */}
      <SourcePanel
        label="Web Client"
        detail="GA4 Stream"
        top={160}
        playing={playing}
        float={{ amplitude: 4, period: 10, phase: 0.2 }}
      />
      <SourcePanel
        label="Server Container"
        detail="sGTM Verified"
        top={340}
        playing={playing}
        float={{ amplitude: 4, period: 14, phase: 0.357 }}
      />

      <div
        className="absolute"
        style={{ left: px(200), top: py(280), width: px(130) }}
      >
        <CalloutChip style={{ fontSize: ts(11) }}>Server-side</CalloutChip>
      </div>

      {/* ---- Primary: the dashboard ---- */}
      <FloatPanel
        playing={playing}
        focal
        interactive
        float={{ amplitude: 6, period: 12, phase: 0 }}
        className="absolute overflow-hidden"
        style={{
          left: px(360),
          top: py(80),
          width: px(560),
          height: py(420),
          borderRadius: "clamp(0.75rem, 3.333cqw, 2rem)",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: `${ts(20)} ${ts(24)} 0` }}
        >
          <span className="text-ink font-medium" style={{ fontSize: ts(14) }}>
            Revenue Attribution
          </span>
          <span
            className="text-muted flex items-center"
            style={{ gap: ts(6), fontSize: ts(11) }}
          >
            <span
              className="bg-brand-500 rounded-full"
              style={{ width: ts(6), height: ts(6) }}
            />
            Live
          </span>
        </div>

        <Chart running={running} />

        {/* Tooltip. Positioned in the primary panel's local space (blueprint
            640,120 minus the panel origin 360,80) so it travels with the
            panel's float instead of drifting against it. */}
        <motion.div
          aria-hidden
          className="border-hair absolute rounded-lg border bg-white"
          style={{
            left: "50%",
            top: "9.524%",
            width: "25%",
            padding: ts(12),
            boxShadow: "0 4px 12px -2px rgb(44 56 49 / 0.04)",
          }}
          initial={false}
          animate={
            running
              ? { opacity: [0, 0, 1, 1, 0, 0], y: [10, 10, 0, 0, 0, 0] }
              : { opacity: 1, y: 0 }
          }
          transition={
            running
              ? {
                  duration: LOOP,
                  times: [0, at(3.5), at(4.3), at(11.0), at(11.5), 1],
                  repeat: Infinity,
                  ease: EASE.out,
                }
              : undefined
          }
        >
          <p
            className="font-display text-ink leading-none font-semibold tracking-tight tabular-nums"
            style={{ fontSize: ts(18) }}
          >
            $24,592
          </p>
          <p
            className="text-brand-600 flex items-center leading-none font-medium tabular-nums"
            style={{ fontSize: ts(12), marginTop: ts(6), gap: ts(4) }}
          >
            <span aria-hidden>&uarr;</span>
            18.4%
          </p>
        </motion.div>
      </FloatPanel>

      {/* ---- Executive summary. Breaks the primary panel's corner on purpose:
              the overlap is what stops the composition reading as a row of
              rectangles. ---- */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 8, period: 11, phase: 0.364 }}
        className="absolute flex flex-col justify-center"
        style={{
          left: px(260),
          top: py(440),
          width: px(260),
          height: py(120),
          padding: `0 ${ts(24)}`,
          borderRadius: "clamp(0.625rem, 2.083cqw, 1.25rem)",
        }}
      >
        <span
          className="font-display text-brand-600 leading-none font-semibold tracking-tight tabular-nums"
          style={{ fontSize: ts(24) }}
        >
          {/* TODO(content): illustrative figures. Believable, not measured. */}
          <CountUp
            value={142840}
            from={82100}
            prefix="$"
            delay={2}
            duration={2}
          />
        </span>
        <span
          className="text-ink-soft"
          style={{ fontSize: ts(12), marginTop: ts(8) }}
        >
          Attributed
        </span>
      </FloatPanel>
    </div>
  );
}

function SourcePanel({
  label,
  detail,
  top,
  playing,
  float,
}: {
  label: string;
  detail: string;
  top: number;
  playing: boolean;
  float: { amplitude: number; period: number; phase: number };
}) {
  return (
    <FloatPanel
      playing={playing}
      float={float}
      className="absolute flex flex-col justify-center"
      style={{
        left: px(40),
        top: py(top),
        width: px(220),
        height: py(96),
        padding: `0 ${ts(20)}`,
        borderRadius: "clamp(0.625rem, 2.083cqw, 1.25rem)",
      }}
    >
      <span className="text-ink font-medium" style={{ fontSize: ts(14) }}>
        {label}
      </span>
      <span
        className="text-ink-soft flex items-center"
        style={{ fontSize: ts(12), marginTop: ts(6), gap: ts(6) }}
      >
        <span
          className="bg-brand-400 rounded-full"
          style={{ width: ts(5), height: ts(5) }}
        />
        {detail}
      </span>
    </FloatPanel>
  );
}

/**
 * The plot, drawn in its own 480x180 space and positioned inside the primary
 * panel. Nested rather than shared with the outer canvas SVG so the stroke
 * width and dash patterns are not distorted by the panel's own aspect.
 */
function Chart({ running }: { running: boolean }) {
  const draw = {
    duration: LOOP,
    times: [0, at(1.5), at(3.5), at(11.5), 1],
    repeat: Infinity,
    ease: EASE.out,
  };

  return (
    <svg
      viewBox="0 0 480 240"
      aria-hidden
      className="absolute"
      // Blueprint puts the plot at 38.095% down the panel, which lands the
      // x-axis labels at canvas y444 — directly under the summary card, whose
      // intended overlap starts at y440. Raising the plot 30px clears the
      // label row while keeping the card's overlap of the panel corner.
      style={{ left: "7.143%", top: "30.952%", width: "85.714%" }}
    >
      {/* Value gridlines. Ambient — they give the curve something to be read
          against without competing with it. */}
      {[
        { y: 40, label: "$20k" },
        { y: 100, label: "$10k" },
      ].map((g) => (
        <g key={g.label}>
          <line
            x1={0}
            y1={g.y}
            x2={480}
            y2={g.y}
            stroke="var(--color-hair)"
            strokeWidth={1}
          />
          <text
            x={0}
            y={g.y - 8}
            fontSize={11}
            fill="var(--color-muted)"
            className="font-sans"
          >
            {g.label}
          </text>
        </g>
      ))}

      <line
        x1={0}
        y1={180}
        x2={480}
        y2={180}
        stroke="var(--color-hair)"
        strokeWidth={1}
      />
      {["Oct 12", "Oct 13", "Oct 14"].map((label, i) => (
        <text
          key={label}
          x={i * 214}
          y={204}
          fontSize={11}
          fill="var(--color-muted)"
          className="font-sans"
        >
          {label}
        </text>
      ))}

      <motion.path
        d={LINE}
        fill="none"
        stroke="var(--color-brand-400)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={
          running
            ? { pathLength: [0, 0, 1, 1, 1], opacity: [1, 1, 1, 1, 0] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={running ? draw : undefined}
      />

      {/* Peak marker plus its leader up to the tooltip. Both arrive with the
          tooltip so the three read as one gesture. */}
      <motion.g
        initial={false}
        animate={running ? { opacity: [0, 0, 1, 1, 0, 0] } : { opacity: 1 }}
        transition={
          running
            ? {
                duration: LOOP,
                times: [0, at(3.5), at(4.3), at(11.0), at(11.5), 1],
                repeat: Infinity,
                ease: EASE.out,
              }
            : undefined
        }
      >
        <line
          x1={PEAK.x}
          y1={PEAK.y}
          // Stops at the tooltip's lower edge. Tracks the plot offset above:
          // raising the plot shortened this gap by the same 30px.
          x2={PEAK.x}
          y2={-26}
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <circle
          cx={PEAK.x}
          cy={PEAK.y}
          r={5}
          fill="white"
          stroke="var(--color-brand-600)"
          strokeWidth={2.5}
        />
      </motion.g>
    </svg>
  );
}
