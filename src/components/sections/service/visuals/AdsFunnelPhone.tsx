"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  CHANNELS,
  LOOP,
  RINGS,
  ROAS,
  ROAS_LABEL,
  ROAS_SUFFIX,
  SPEND,
  SPEND_LABEL,
  at,
} from "@/components/sections/service/visuals/adsFunnelShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * Phone stage of the performance-ads depiction.
 *
 * The 960x640 drawing runs four channel chips along the top into a three-ring
 * funnel, with spend entering at the first ring's midline and blended ROAS
 * leaving at the last one's. At 327px the chips collided into each other, every
 * ring label overran its own pill — "Cross-Channel Traffic40,0" — and both side
 * panels wrapped their two-word labels outside their boxes.
 *
 * **The four channels become a two-by-two grid inside one panel, and that costs
 * a piece of geometry worth naming.** The wide canvas draws four drops into a
 * trunk and a single stem, which is the page's argument said in pure geometry:
 * four sources, one entry point. Four chips cannot sit in a row here — their
 * type is floored at 10px, so the row is 234px wide whatever the canvas does,
 * against 221 of usable width at a 320 viewport — and a two-by-two grid cannot
 * carry that rail, because the top row's drops would fall through the bottom
 * row's chips. So containment carries it instead: the four are inside one
 * panel, and one stem leaves it. The claim survives; the rail does not.
 *
 * **Spend moves above and ROAS below**, rather than flanking. That is not just
 * where they fit — it is the causal order the wide canvas can only imply by
 * putting them level with the rings they attach to: money in, four channels,
 * one funnel, one blended figure out.
 *
 * **The taper survives, and it is what makes this drawing itself.** Three pills
 * of decreasing width joined by solid hairlines at their corners: the walls are
 * the funnel, and they are solid because everything dashed here is flow. Three
 * pills with air between them would be three pills.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 566);

const AXIS = 180;

const SPEND_BOX = { x: 20, y: 20, w: 320, h: 56 };
const CHANNEL_BOX = { x: 20, y: 96, w: 320, h: 98 };

/**
 * The funnel. Widths chosen so the narrowest ring still sets its label beside
 * its figure: at 180 units "Conversion" and "400" need 86 of the 127 available.
 */
const RING_H = 60;
const RING = [
  { x: 20, w: 320, y: 216 },
  { x: 52, w: 256, y: 300 },
  { x: 90, w: 180, y: 384 },
];

const ROAS_BOX = { x: 20, y: 470, w: 320, h: 76 };

const ringRight = (i: number) => RING[i].x + RING[i].w;
const ringBottom = (i: number) => RING[i].y + RING_H;

/** Every gap in the column, in order. Flow crosses these and nothing else. */
const GAPS = [
  { y1: SPEND_BOX.y + SPEND_BOX.h, y2: CHANNEL_BOX.y, t: 0.2 },
  { y1: CHANNEL_BOX.y + CHANNEL_BOX.h, y2: RING[0].y, t: 1.0 },
  { y1: ringBottom(0), y2: RING[1].y, t: 1.8 },
  { y1: ringBottom(1), y2: RING[2].y, t: 2.6 },
  { y1: ringBottom(2), y2: ROAS_BOX.y, t: 3.4 },
];

export function AdsFunnelPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="lg" className="top-[16%] left-[50%] -translate-x-1/2" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        {/* Flow. One dashed run down the axis, drawn only where there is open
            canvas — a packet behind a panel reads as a glitch, not as depth. */}
        <path
          d={GAPS.map((g) => `M ${AXIS} ${g.y1} L ${AXIS} ${g.y2}`).join(" ")}
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
              `M ${RING[i].x} ${ringBottom(i)} L ${RING[i + 1].x} ${RING[i + 1].y}` +
              ` M ${ringRight(i)} ${ringBottom(i)} L ${ringRight(i + 1)} ${RING[i + 1].y}`
            }
            fill="none"
            stroke="var(--color-hair)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}

        {GAPS.map((gap) => (
          <motion.circle
            key={gap.y1}
            r={3.5}
            cx={AXIS}
            fill="var(--color-brand-500)"
            initial={false}
            animate={
              playing
                ? {
                    cy: [gap.y1, gap.y1, (gap.y1 + gap.y2) / 2, gap.y2, gap.y2],
                    opacity: [0, 0, 1, 0, 0],
                  }
                : { cy: gap.y2, opacity: 0 }
            }
            transition={
              playing
                ? {
                    duration: LOOP,
                    times: [0, at(gap.t), at(gap.t + 0.35), at(gap.t + 0.7), 1],
                    repeat: Infinity,
                    ease: "linear",
                  }
                : undefined
            }
          />
        ))}
      </svg>

      {/* What goes in. */}
      <Figure
        box={SPEND_BOX}
        label={SPEND_LABEL}
        playing={playing}
        float={{ amplitude: 4, period: 14, phase: 0.214 }}
      >
        <span
          className="font-display text-ink leading-none font-semibold tracking-tight tabular-nums"
          style={{ fontSize: ts(18) }}
        >
          {SPEND}
        </span>
      </Figure>

      {/* The four channels, in one box. Containment is what says "one funnel"
          now that the four-drop rail has nowhere to run. */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 3, period: 16, phase: 0 }}
        className="absolute"
        style={{
          left: px(CHANNEL_BOX.x),
          top: py(CHANNEL_BOX.y),
          width: px(CHANNEL_BOX.w),
          height: py(CHANNEL_BOX.h),
          padding: cq(14),
          borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
        }}
      >
        <span
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: cq(10),
          }}
        >
          {CHANNELS.map((channel, i) => (
            <motion.span
              key={channel}
              className="border-hair text-ink-soft grid place-items-center rounded-full border bg-white whitespace-nowrap"
              style={{ height: cq(30), fontSize: ts(11) }}
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
        </span>
      </FloatPanel>

      {/* The funnel. Pill radii so the stages read as rings, not more cards. */}
      {RINGS.map((ring, i) => {
        const last = i === RINGS.length - 1;
        return (
          <FloatPanel
            key={ring.label}
            playing={playing}
            focal={last}
            float={{ amplitude: 4, period: 12 - i, phase: i * 0.22 }}
            className="absolute flex items-center justify-between overflow-hidden"
            style={{
              left: px(RING[i].x),
              top: py(RING[i].y),
              width: px(RING[i].w),
              height: py(RING_H),
              padding: `0 ${cq(last ? 16 : 20)}`,
              gap: cq(10),
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
                  ? "text-brand-700 truncate font-medium"
                  : "text-ink truncate font-medium"
              }
              style={{ fontSize: ts(11) }}
            >
              {ring.label}
            </span>
            <span
              className={
                last
                  ? "font-display text-brand-600 shrink-0 leading-none font-semibold tabular-nums"
                  : "font-display text-muted shrink-0 leading-none font-semibold tabular-nums"
              }
              style={{ fontSize: ts(14) }}
            >
              {ring.figure}
            </span>
          </FloatPanel>
        );
      })}

      {/* What comes out. The one figure the page says is worth reporting. */}
      <Figure
        box={ROAS_BOX}
        label={ROAS_LABEL}
        playing={playing}
        float={{ amplitude: 4, period: 13, phase: 0.385 }}
      >
        <span
          className="font-display text-brand-600 leading-none font-semibold tracking-tight tabular-nums"
          style={{ fontSize: ts(26) }}
        >
          {playing ? (
            <CountUp
              value={ROAS}
              suffix={ROAS_SUFFIX}
              delay={1.5}
              duration={1.5}
            />
          ) : (
            `${ROAS}${ROAS_SUFFIX}`
          )}
        </span>
      </Figure>
    </div>
  );
}

/**
 * A figure at one end of the funnel.
 *
 * Label and value on one line rather than stacked. The wide canvas stacks them
 * because its panels are 200 units of 960 and the label has to wrap anyway;
 * here the box is the full column and "Weekly Spend" beside "$10,000" costs one
 * row instead of two.
 */
function Figure({
  box,
  label,
  playing,
  float,
  children,
}: {
  box: { x: number; y: number; w: number; h: number };
  label: string;
  playing: boolean;
  float: { amplitude: number; period: number; phase: number };
  children: React.ReactNode;
}) {
  return (
    <FloatPanel
      playing={playing}
      float={float}
      className="absolute flex items-center justify-between"
      style={{
        left: px(box.x),
        top: py(box.y),
        width: px(box.w),
        height: py(box.h),
        padding: `0 ${cq(18)}`,
        gap: cq(10),
        borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
      }}
    >
      <span className="text-ink-soft truncate" style={{ fontSize: ts(11) }}>
        {label}
      </span>
      <span className="shrink-0">{children}</span>
    </FloatPanel>
  );
}
