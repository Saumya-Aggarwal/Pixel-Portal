"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import {
  H,
  W,
  beat,
  cq,
  px,
  py,
  ts,
} from "@/components/sections/service/visuals/canvas";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * Four channels, one funnel.
 *
 * The argument the page makes is that Google, Meta, LinkedIn and YouTube are a
 * single funnel reported once, not four channels reported separately. So the
 * four channel chips feed the *same* top ring, and the only figure that matters
 * sits at the bottom: blended ROAS.
 *
 * Geometry notes, because the first cut of this drawing was visibly broken and
 * every fault had the same shape — a coordinate that assumed a size the browser
 * did not actually produce:
 *
 * - **Chips carry an explicit height.** `ts()` floors at 10px, so at a ~700px
 *   container `ts(7)` padding and `ts(11)` type both land on 10px and a chip is
 *   ~44 canvas units tall, not the ~27 its padding implies. The rail was drawn
 *   at y=58 on that assumption and ended up *inside* the chips, which is what
 *   made them read as four pills chained in a row with a drop line starting
 *   from nowhere. Anything a connector attaches to needs a stated box.
 * - **The trunk is one path.** It was four overlapping strokes sharing the same
 *   span, so the dash phase disagreed between them and the line was drawn four
 *   times over — mottled, and darker than every other connector.
 * - **Packets only cross the gaps.** They used to fall the full height of the
 *   column, which is mostly opaque panel, so a dot was hidden for ~290 of its
 *   330 units of travel and flickered through the two gaps. Occlusion, read as
 *   a glitch.
 * - **The walls are the funnel.** Three pills with air between them are three
 *   pills. The hairlines joining consecutive edges are what make the taper
 *   legible, and they are solid where flow is dashed.
 */

const LOOP = 7;
const at = (seconds: number) => beat(seconds, LOOP);

const CHANNELS = ["Google", "Meta", "LinkedIn", "YouTube"];

/** Chip centres, spread across the top ring's own span. */
const CHANNEL_X = (i: number) => 300 + i * 120;

/** Stated box, so the drops below can attach to a real edge. */
const CHIP_TOP = 30;
const CHIP_H = 34;
const CHIP_BOTTOM = CHIP_TOP + CHIP_H;

/** Where the four drops collect before the single stem into the funnel. */
const TRUNK_Y = 92;

/**
 * Funnel stages. The last ring is only 170 wide, so its figure sits under the
 * label rather than beside it — `justify-between` ran "Conversion" and "412"
 * straight into each other.
 */
const RINGS = [
  { label: "Cross-Channel Traffic", figure: "40,000", x: 280, w: 400, y: 140 },
  { label: "Intent & Engagement", figure: "5,000", x: 335, w: 290, y: 290 },
  { label: "Conversion", figure: "400", x: 395, w: 170, y: 440 },
];

const RING_H = 110;

/** Centre line of the column, and of every ring on it. */
const AXIS = 480;

const ringMid = (i: number) => RINGS[i].y + RING_H / 2;
const ringRight = (i: number) => RINGS[i].x + RINGS[i].w;

/**
 * Flow, one segment at a time. Each hop is a stretch of open canvas, so a
 * packet is never behind a panel.
 */
const FLOW = [
  { x1: AXIS, y1: TRUNK_Y, x2: AXIS, y2: RINGS[0].y, t: 0.3 },
  { x1: AXIS, y1: RINGS[0].y + RING_H, x2: AXIS, y2: RINGS[1].y, t: 1.3 },
  { x1: AXIS, y1: RINGS[1].y + RING_H, x2: AXIS, y2: RINGS[2].y, t: 2.3 },
  { x1: ringRight(2), y1: ringMid(2), x2: 700, y2: ringMid(2), t: 3.3 },
];

export function AdsFunnel() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="lg" className="top-[18.75%] left-[33.333%]" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        {/* Channel rail: four drops, one trunk, one stem. Four sources and a
            single entry point — the whole argument of the page in one piece of
            geometry. */}
        <path
          d={
            CHANNELS.map(
              (_, i) =>
                `M ${CHANNEL_X(i)} ${CHIP_BOTTOM} L ${CHANNEL_X(i)} ${TRUNK_Y}`,
            ).join(" ") +
            ` M ${CHANNEL_X(0)} ${TRUNK_Y} L ${CHANNEL_X(CHANNELS.length - 1)} ${TRUNK_Y}` +
            ` M ${AXIS} ${TRUNK_Y} L ${AXIS} ${RINGS[0].y}`
          }
          fill="none"
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {/* Funnel walls. Solid, because these are structure; everything dashed
            in this drawing is flow. */}
        {[0, 1].map((i) => (
          <path
            key={i}
            d={
              `M ${RINGS[i].x} ${RINGS[i].y + RING_H} L ${RINGS[i + 1].x} ${RINGS[i + 1].y}` +
              ` M ${ringRight(i)} ${RINGS[i].y + RING_H} L ${ringRight(i + 1)} ${RINGS[i + 1].y}`
            }
            fill="none"
            stroke="var(--color-hair)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}

        {/* Spend in at the top ring's midline, ROAS out at the last ring's. Both
            land on a centre rather than near a corner. */}
        <line
          x1={240}
          y1={ringMid(0)}
          x2={RINGS[0].x}
          y2={ringMid(0)}
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <line
          x1={ringRight(2)}
          y1={ringMid(2)}
          x2={700}
          y2={ringMid(2)}
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />

        {FLOW.map((seg) => (
          <motion.circle
            key={`${seg.x1}-${seg.y1}`}
            r={4}
            fill="var(--color-brand-500)"
            initial={false}
            animate={
              playing
                ? {
                    cx: [seg.x1, seg.x1, (seg.x1 + seg.x2) / 2, seg.x2, seg.x2],
                    cy: [seg.y1, seg.y1, (seg.y1 + seg.y2) / 2, seg.y2, seg.y2],
                    opacity: [0, 0, 1, 0, 0],
                  }
                : { cx: seg.x2, cy: seg.y2, opacity: 0 }
            }
            transition={
              playing
                ? {
                    duration: LOOP,
                    times: [0, at(seg.t), at(seg.t + 0.45), at(seg.t + 0.9), 1],
                    repeat: Infinity,
                    ease: "linear",
                  }
                : undefined
            }
          />
        ))}
      </svg>

      {/* Channel chips. Ambient detail, and the reason the funnel is one funnel. */}
      {CHANNELS.map((channel, i) => (
        <motion.span
          key={channel}
          className="border-hair text-ink-soft absolute flex -translate-x-1/2 items-center rounded-full border bg-white whitespace-nowrap shadow-(--shadow-float)"
          style={{
            left: px(CHANNEL_X(i)),
            top: py(CHIP_TOP),
            height: py(CHIP_H),
            padding: `0 ${cq(16)}`,
            fontSize: ts(11),
          }}
          initial={false}
          animate={playing ? { opacity: [0.75, 1, 0.75] } : { opacity: 1 }}
          transition={
            playing
              ? {
                  duration: 4,
                  delay: i * 0.35,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : undefined
          }
        >
          {channel}
        </motion.span>
      ))}

      {/* The funnel. Pill radii so the stages read as rings, not more cards. */}
      {RINGS.map((ring, i) => {
        const last = i === RINGS.length - 1;
        return (
          <FloatPanel
            key={ring.label}
            playing={playing}
            focal={last}
            float={{ amplitude: 4, period: 12 - i, phase: i * 0.22 }}
            className={
              last
                ? "absolute flex flex-col items-center justify-center overflow-hidden"
                : "absolute flex items-center justify-between overflow-hidden"
            }
            style={{
              left: px(ring.x),
              top: py(ring.y),
              width: px(ring.w),
              height: py(RING_H),
              padding: `0 ${ts(last ? 18 : 26)}`,
              borderRadius: 999,
              backgroundColor: last ? "#fff" : "var(--color-paper)",
              borderColor: last
                ? "var(--color-brand-300)"
                : "var(--color-hair)",
            }}
          >
            <span
              className={
                last
                  ? "text-brand-700 font-medium whitespace-nowrap"
                  : "text-ink font-medium whitespace-nowrap"
              }
              style={{ fontSize: ts(last ? 12 : 14) }}
            >
              {ring.label}
            </span>
            {/* TODO(content): illustrative figures. */}
            <span
              className={
                last
                  ? "font-display text-brand-600 leading-none font-semibold tabular-nums"
                  : "font-display text-muted leading-none font-semibold tabular-nums"
              }
              style={{
                fontSize: ts(last ? 18 : 16),
                marginTop: last ? ts(6) : 0,
              }}
            >
              {ring.figure}
            </span>
          </FloatPanel>
        );
      })}

      <SidePanel
        label="Weekly Spend"
        left={40}
        mid={ringMid(0)}
        width={200}
        playing={playing}
        float={{ amplitude: 6, period: 14, phase: 0.214 }}
      >
        <span
          className="font-display text-ink leading-none font-semibold tracking-tight tabular-nums"
          style={{ fontSize: ts(24) }}
        >
          $10,000
        </span>
      </SidePanel>

      <SidePanel
        label="Blended ROAS"
        left={700}
        mid={ringMid(2)}
        width={200}
        playing={playing}
        float={{ amplitude: 6, period: 13, phase: 0.385 }}
      >
        <span
          className="font-display text-brand-600 leading-none font-semibold tracking-tight tabular-nums"
          style={{ fontSize: ts(24) }}
        >
          <CountUp
            value={4}
            suffix="x"
            delay={1.5}
            duration={1.5}
          />
        </span>
      </SidePanel>
    </div>
  );
}

const SIDE_H = 120;

/**
 * Positioned by its midline rather than its top edge, so the connector that
 * meets it can be specified against the same number the ring uses. Passing a
 * top and then computing the line's y separately is how the ROAS connector
 * ended up meeting the panel 70 units above its centre, near a rounded corner.
 */
function SidePanel({
  label,
  left,
  mid,
  width = 180,
  playing,
  float,
  children,
}: {
  label: string;
  left: number;
  mid: number;
  width?: number;
  playing: boolean;
  float: { amplitude: number; period: number; phase: number };
  children: React.ReactNode;
}) {
  return (
    <FloatPanel
      playing={playing}
      float={float}
      className="absolute flex flex-col justify-center"
      style={{
        left: px(left),
        top: py(mid - SIDE_H / 2),
        width: px(width),
        height: py(SIDE_H),
        padding: `0 ${ts(22)}`,
        borderRadius: "clamp(0.625rem, 2.083cqw, 1.25rem)",
      }}
    >
      <span className="text-ink-soft" style={{ fontSize: ts(12) }}>
        {label}
      </span>
      <span style={{ marginTop: ts(10) }}>{children}</span>
    </FloatPanel>
  );
}
