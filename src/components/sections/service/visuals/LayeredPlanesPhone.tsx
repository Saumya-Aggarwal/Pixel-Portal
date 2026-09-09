"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  COMPONENTS,
  FIELDS,
  LCP_FROM,
  LCP_LABEL,
  LCP_TO,
  PLANES,
} from "@/components/sections/service/visuals/layeredPlanesShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * Phone stage of the informative-corporate-sites depiction.
 *
 * The 960x640 drawing steps three 400x280 planes down and to the left, each
 * overlapping the last. That needs 760 units of width to work, and at 327px it
 * did not: the data layer showed its types with every field name covered, the
 * component grid lost half its swatches behind the plane in front of it, and
 * the LCP card wrapped its own two-word label.
 *
 * **The planes stop overlapping and start receding.** Stacked down the column
 * and separated, each one is fully readable — which is the whole claim, since a
 * stack that hides its own layers is not an argument about being able to see
 * every layer. Depth is carried instead by three cues that cost no space: each
 * plane is wider than the one behind it, so the three read as receding into the
 * page; the ground goes paper, paper, white as they come forward; and short
 * slanted rules join their corners, which is the convention a section drawing
 * uses to say these are parallel slabs rather than a pile of cards.
 *
 * That last one is why this does not become the dealt pile the social piece
 * already is. An overlap says "in front of"; a corner joint says "the same
 * object, further back", and only the second one is true here.
 *
 * **The LCP figure moves onto the front plane's own footer.** It is a property
 * of the rendered page rather than of the drawing, and on a canvas with no
 * spare corner to hang it in, the honest place for it is the layer it measures.
 *
 * Structure enters once and stays, as on the wide canvas. The blueprint had the
 * stack dissolve and rebuild on a loop, which leaves the hero empty for part of
 * every pass; only the figure moves.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 684);

/**
 * Each plane is wider than the one behind it, and the difference is the depth.
 *
 * Ten units a side per step: enough that the recession is unmistakable when the
 * corner joints connect them, small enough that the back plane still has 280
 * units to set four field rows in.
 */
const PLANE = PLANES.map((plane, i) => ({
  ...plane,
  x: 40 - i * 10,
  w: 280 + i * 20,
}));

/**
 * Heights measured at the narrow end, not the design one.
 *
 * `ts` floors at 10px, so a plane's rows stand taller in canvas units the
 * smaller the canvas gets — the data layer needs 203 units at a 320 viewport
 * against 184 at 430. Sized for 375 it ate the rule under its last field.
 */
const PLANE_Y = [20, 248, 424];
const PLANE_H = [206, 154, 240];
const PAD = 14;

/** The gaps the corner joints span. */
const JOINTS = [0, 1].map((i) => ({
  y1: PLANE_Y[i] + PLANE_H[i],
  y2: PLANE_Y[i + 1],
  left1: PLANE[i].x,
  left2: PLANE[i + 1].x,
  right1: PLANE[i].x + PLANE[i].w,
  right2: PLANE[i + 1].x + PLANE[i + 1].w,
}));

export function LayeredPlanesPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="lg" className="top-[34%] left-[50%] -translate-x-1/2" />

      {/* The corner joints. Drawn under the planes so they read as edges the
          planes sit on rather than rules laid across them. */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
        style={{ zIndex: 10 }}
      >
        {JOINTS.map((joint) => (
          <g
            key={joint.y1}
            stroke="var(--color-brand-200)"
            strokeWidth={1.5}
            strokeLinecap="round"
          >
            <line
              x1={joint.left1}
              y1={joint.y1}
              x2={joint.left2}
              y2={joint.y2}
            />
            <line
              x1={joint.right1}
              y1={joint.y1}
              x2={joint.right2}
              y2={joint.y2}
            />
          </g>
        ))}
      </svg>

      {PLANE.map((plane, i) => {
        const front = i === PLANE.length - 1;
        return (
          <motion.div
            key={plane.id}
            className="absolute"
            style={{
              left: px(plane.x),
              top: py(PLANE_Y[i]),
              width: px(plane.w),
              height: py(PLANE_H[i]),
              zIndex: 20 + i * 10,
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: i * 0.5, ease: EASE.out }}
          >
            <FloatPanel
              playing={playing}
              focal={front}
              float={{ amplitude: 3 + i, period: 11 + i, phase: i * 0.25 }}
              className="size-full overflow-hidden"
              style={{
                padding: cq(PAD),
                borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
                backgroundColor: front ? "#fff" : "var(--color-paper)",
              }}
            >
              <span
                className="text-ink block font-medium"
                style={{ fontSize: ts(12) }}
              >
                {plane.title}
              </span>
              <span className="block" style={{ marginTop: cq(12) }}>
                {plane.id === "data" && <DataLayer />}
                {plane.id === "system" && <ComponentSystem />}
                {plane.id === "live" && <LiveInterface playing={playing} />}
              </span>
            </FloatPanel>
          </motion.div>
        );
      })}
    </div>
  );
}

/** Field rows — what an editor actually touches. */
function DataLayer() {
  return (
    <span style={{ display: "grid", gap: cq(8) }}>
      {FIELDS.map(([field, type]) => (
        <span
          key={field}
          className="border-hair flex items-center justify-between border-b"
          style={{ paddingBottom: cq(6), gap: cq(8) }}
        >
          <code className="text-ink-soft truncate" style={{ fontSize: ts(11) }}>
            {field}
          </code>
          <span className="text-muted shrink-0" style={{ fontSize: ts(10) }}>
            {type}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Component swatches — the vocabulary the pages are built from. */
function ComponentSystem() {
  return (
    <span
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: cq(8),
      }}
    >
      {COMPONENTS.map((name) => (
        <span
          key={name}
          className="border-hair bg-brand-50/60 text-brand-800 grid place-items-center rounded-md border"
          style={{ height: cq(34), fontSize: ts(10) }}
        >
          {name}
        </span>
      ))}
    </span>
  );
}

/**
 * The rendered result, with the figure it is judged on.
 *
 * The LCP reading lives here rather than in a card of its own: it is a property
 * of the interface a visitor loads, and this canvas has no spare corner to hang
 * an annotation in.
 */
function LiveInterface({ playing }: { playing: boolean }) {
  return (
    <span className="block">
      <span
        className="bg-brand-50 flex flex-col justify-center rounded-lg"
        style={{ height: cq(64), padding: cq(12) }}
      >
        <span
          className="bg-brand-300 block rounded-full"
          style={{ height: cq(8), width: "58%" }}
        />
        <span
          className="bg-brand-200 block rounded-full"
          style={{ height: cq(6), width: "38%", marginTop: cq(6) }}
        />
      </span>

      <span
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: cq(9),
          marginTop: cq(9),
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="border-hair block rounded-md border"
            style={{ padding: cq(8) }}
          >
            <span
              className="bg-brand-100 block rounded"
              style={{ height: cq(16) }}
            />
            <span
              className="bg-hair block rounded-full"
              style={{ height: cq(5), width: "80%", marginTop: cq(6) }}
            />
          </span>
        ))}
      </span>

      <span
        className="border-hair flex items-baseline justify-between border-t"
        style={{ marginTop: cq(12), paddingTop: cq(10), gap: cq(8) }}
      >
        <span className="text-ink-soft" style={{ fontSize: ts(11) }}>
          {LCP_LABEL}
        </span>
        <span
          className="font-display text-brand-600 leading-none font-semibold tracking-tight tabular-nums"
          style={{ fontSize: ts(20) }}
        >
          {playing ? (
            <CountUp
              value={LCP_TO}
              from={LCP_FROM}
              decimals={1}
              suffix="s"
              delay={2}
              duration={1.5}
            />
          ) : (
            `${LCP_TO.toFixed(1)}s`
          )}
        </span>
      </span>
    </span>
  );
}
