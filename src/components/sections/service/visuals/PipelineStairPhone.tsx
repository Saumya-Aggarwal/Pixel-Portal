"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  BARS,
  BAR_PLOT,
  COLLECTION,
  LOOP,
  MRR,
  MRR_DELTA,
  MRR_LABEL,
  SCHEMA,
  SOURCES,
  STAGES,
  WAREHOUSE,
  at,
} from "@/components/sections/service/visuals/pipelineStairShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * Phone stage of the marketing-seo-tracking-systems depiction.
 *
 * The 960x640 drawing is four 190x420 panels descending left to right. Four
 * panels of that height cannot stack in a 327px column — they would run to
 * roughly 1,600 units — and a plain vertical stack would also be the third one
 * in this category after the integration rail and the migration funnel, which
 * is the failure the desktop staircase was invented to avoid in the first
 * place.
 *
 * **So the staircase stays literal.** Each stage is 250 wide and steps 23 units
 * right of the one above it, and the elbow connectors between them draw the
 * treads: down out of one panel, across, down into the next. The stair is no
 * longer a way of arranging four columns — on this canvas it *is* the drawing,
 * and it is the reason this reads as neither of its two neighbours.
 *
 * **What is kept.** Every stage still emits what the next consumes, and every
 * payload chip is still on the stage that produces it rather than stuck to a
 * line. All three sources, all three collection steps, all four schema fields,
 * the warehouse row, the six bars and the MRR figure survive intact.
 *
 * **What changed.** Stages one to three are compact rows rather than tall
 * cards, because at this width their content is three label/value pairs and a
 * 420-unit panel around three pairs is the labelled empty box. Reporting keeps
 * its full panel — it is the focal stage and the one carrying the payoff. The
 * "Stage n" eyebrow becomes a numbered badge inline with the title, which buys
 * the header a single line instead of two, and the schema is a two-by-two grid
 * rather than four rows.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 640);

const PANEL_W = 250;
/** Each tread steps right by this much; four of them clear the right inset. */
const STEP = 23;
const STAIR_X = [0, 1, 2, 3].map((i) => 20 + i * STEP);

/**
 * Row height, measured rather than guessed.
 *
 * At 102 the third pair of every stage was clipped by the panel's own
 * `overflow-hidden`: a `ts(11)` label is floored to 10 CSS pixels, which is
 * 12.1 canvas units before its 4 of padding and its rule, so three of them plus
 * a header need 112. This is that, plus two.
 */
const ROW_H = 114;
const STAIR_Y = [20, 155, 290, 425];
const REPORT_H = 196;

const PAD = 10;
const INNER = PANEL_W - PAD * 2;

const panelH = (i: number) => (i === 3 ? REPORT_H : ROW_H);
const centreX = (i: number) => STAIR_X[i] + PANEL_W / 2;

/**
 * The treads. Down out of a panel, across the step, down into the next — so the
 * connector is not a line between the stages, it is the stair they sit on.
 */
const HOPS = [0, 1, 2].map((i) => {
  const y1 = STAIR_Y[i] + panelH(i);
  const y2 = STAIR_Y[i + 1];
  return {
    id: STAGES[i].id,
    x1: centreX(i),
    y1,
    x2: centreX(i + 1),
    y2,
    ym: (y1 + y2) / 2,
    t: i * 1.5,
  };
});

const BAR_H = 66;
const barHeight = (bar: number) => cq((bar / BAR_PLOT) * BAR_H);

export function PipelineStairPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="md" className="top-[38%] left-[8%]" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <path
          d={HOPS.map(
            (h) =>
              `M ${h.x1} ${h.y1} L ${h.x1} ${h.ym} L ${h.x2} ${h.ym} L ${h.x2} ${h.y2}`,
          ).join(" ")}
          fill="none"
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {HOPS.map((h) => (
          <motion.circle
            key={h.id}
            r={3.5}
            fill="var(--color-brand-500)"
            initial={false}
            animate={
              playing
                ? {
                    cx: [h.x1, h.x1, h.x1, h.x2, h.x2, h.x2],
                    cy: [h.y1, h.y1, h.ym, h.ym, h.y2, h.y2],
                    opacity: [0, 0, 1, 1, 0, 0],
                  }
                : { cx: h.x2, cy: h.y2, opacity: 0 }
            }
            transition={
              playing
                ? {
                    duration: LOOP,
                    times: [
                      0,
                      at(h.t),
                      at(h.t + 0.26),
                      at(h.t + 0.72),
                      at(h.t + 1),
                      1,
                    ],
                    repeat: Infinity,
                    ease: "linear",
                  }
                : undefined
            }
          />
        ))}
      </svg>

      {STAGES.map((stage, i) => {
        const focal = i === 3;
        return (
          <FloatPanel
            key={stage.id}
            playing={playing}
            focal={focal}
            float={{ amplitude: 4, period: 11 + i, phase: i * 0.2 }}
            className="absolute overflow-hidden"
            style={{
              left: px(STAIR_X[i]),
              top: py(STAIR_Y[i]),
              width: px(PANEL_W),
              height: py(panelH(i)),
              padding: cq(PAD),
              backgroundColor: focal ? "#fff" : "var(--color-paper)",
              borderColor: focal
                ? "var(--color-brand-300)"
                : "var(--color-hair)",
              borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
              zIndex: 30,
            }}
          >
            <Head index={i} title={stage.title} payload={stage.payload} />

            {i === 0 && <Pairs items={SOURCES} />}
            {i === 1 && <Pairs items={COLLECTION} />}
            {i === 2 && <Warehouse />}
            {focal && <Reporting />}
          </FloatPanel>
        );
      })}
    </div>
  );
}

/**
 * Stage number, title and the payload it emits, on one line.
 *
 * The desktop stacks an uppercase "Stage n" over the title. Two lines of header
 * on a 102-unit row is a fifth of the panel spent saying which panel it is, so
 * the number becomes a badge and the payload chip comes up beside the title
 * instead of sitting as a footer — which also keeps it on the stage that emits
 * it, the thing the desktop moved it inside the panel to achieve.
 */
function Head({
  index,
  title,
  payload,
}: {
  index: number;
  title: string;
  payload: string;
}) {
  return (
    <span
      className="flex items-center justify-between"
      style={{ gap: cq(8), height: cq(18) }}
    >
      <span className="flex min-w-0 items-center" style={{ gap: cq(6) }}>
        <span
          className="border-hair text-muted grid shrink-0 place-items-center rounded-md border bg-white font-semibold tabular-nums"
          style={{ width: cq(16), height: cq(16), fontSize: ts(10) }}
        >
          {index + 1}
        </span>
        <span
          className="text-ink truncate font-medium"
          style={{ fontSize: ts(12) }}
        >
          {title}
        </span>
      </span>
      <span
        className="border-hair text-ink-soft grid shrink-0 place-items-center rounded-full border bg-white font-semibold tracking-[0.06em]"
        style={{ height: cq(18), padding: `0 ${cq(8)}`, fontSize: ts(10) }}
      >
        {payload}
      </span>
    </span>
  );
}

/** A stage whose content is three label/value pairs. */
function Pairs({ items }: { items: string[][] }) {
  return (
    <span
      className="block"
      style={{ display: "grid", gap: cq(5), marginTop: cq(9) }}
    >
      {items.map(([name, value]) => (
        <span
          key={name}
          className="border-hair/70 flex items-baseline justify-between border-b"
          style={{ paddingBottom: cq(4), gap: cq(8) }}
        >
          <span className="text-ink-soft truncate" style={{ fontSize: ts(11) }}>
            {name}
          </span>
          <span
            className="text-muted shrink-0 tabular-nums"
            style={{ fontSize: ts(10) }}
          >
            {value}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Four schema fields as two by two — four rows would not fit the tread. */
function Warehouse() {
  return (
    <>
      <span
        className="border-hair flex items-center justify-between rounded-md border bg-white"
        style={{
          height: cq(20),
          padding: `0 ${cq(9)}`,
          marginTop: cq(8),
        }}
      >
        <span className="text-ink font-medium" style={{ fontSize: ts(11) }}>
          {WAREHOUSE[0]}
        </span>
        <span className="text-muted tabular-nums" style={{ fontSize: ts(10) }}>
          {WAREHOUSE[1]}
        </span>
      </span>
      <span
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: `${cq(5)} ${cq(10)}`,
          marginTop: cq(8),
        }}
      >
        {SCHEMA.map(([field, type]) => (
          <span
            key={field}
            className="flex items-baseline justify-between"
            style={{ gap: cq(6) }}
          >
            <span
              className="text-ink-soft truncate"
              style={{ fontSize: ts(10) }}
            >
              {field}
            </span>
            <span className="text-muted shrink-0" style={{ fontSize: ts(10) }}>
              {type}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}

/** The focal stage: what the whole stack was assembled to produce. */
function Reporting() {
  return (
    <>
      <span
        className="flex items-end justify-between"
        style={{ height: cq(BAR_H), marginTop: cq(11) }}
      >
        {BARS.map((bar, b) => (
          <span
            key={bar}
            className={
              b === BARS.length - 1
                ? "bg-brand-500 block rounded-t-sm"
                : "bg-brand-200 block rounded-t-sm"
            }
            style={{ width: cq(INNER / 10), height: barHeight(bar) }}
          />
        ))}
      </span>
      <span
        className="text-muted block"
        style={{ fontSize: ts(11), marginTop: cq(12) }}
      >
        {MRR_LABEL}
      </span>
      <span
        className="font-display text-brand-600 block leading-none font-semibold tracking-tight tabular-nums"
        style={{ fontSize: ts(22), marginTop: cq(7) }}
      >
        <CountUp value={MRR} prefix="$" delay={4.2} duration={1.5} />
      </span>
      <span
        className="text-ink-soft block"
        style={{ fontSize: ts(11), marginTop: cq(7) }}
      >
        {MRR_DELTA}
      </span>
    </>
  );
}
