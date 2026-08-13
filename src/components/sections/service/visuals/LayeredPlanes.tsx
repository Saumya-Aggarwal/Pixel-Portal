"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { cq, px, py, ts } from "@/components/sections/service/visuals/canvas";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * A corporate site, in section.
 *
 * Three planes stepping down and to the left: the data layer at the back, the
 * component system in the middle, the rendered interface in front. The argument
 * is that the page marketing edits and the page a visitor sees are the same
 * system viewed from different depths.
 *
 * Depth comes from offset and shadow rather than CSS 3D. A `rotateX` here would
 * shear the 11px labels inside each plane, and the whole point of the drawing
 * is that you can read what is on every layer.
 *
 * Each plane's heading is positioned in the corner its neighbour does not
 * cover — back plane top-right, the other two top-left. That is load-bearing,
 * not styling: swap them and the stack hides its own labels.
 */

const PLANES = [
  {
    id: "data",
    title: "CMS & Data Layer",
    x: 440,
    y: 80,
    align: "right" as const,
    delay: 0,
  },
  {
    id: "system",
    title: "Component System",
    x: 260,
    y: 160,
    align: "left" as const,
    delay: 0.6,
  },
  {
    id: "live",
    title: "Live Interface",
    x: 80,
    y: 240,
    align: "left" as const,
    delay: 1.2,
  },
];

const PLANE_W = 400;
const PLANE_H = 280;

export function LayeredPlanes() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="lg" className="left-[41.667%] top-[31.25%]" />

      {PLANES.map((plane, i) => (
        <motion.div
          key={plane.id}
          className="absolute"
          style={{
            left: px(plane.x),
            top: py(plane.y),
            width: px(PLANE_W),
            height: py(PLANE_H),
            zIndex: 20 + i * 10,
          }}
          // Enters once on scroll-in and stays. The blueprint had the stack
          // dissolve and rebuild every 12s, which left the hero empty for
          // roughly two and a half seconds of every loop — the reader watches
          // the illustration delete itself. Structure is supposed to stay
          // anchored; only data moves. Here the data is the LCP figure.
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, delay: plane.delay, ease: EASE.out }}
        >
          <FloatPanel
            playing={playing}
            focal={i === PLANES.length - 1}
            float={{ amplitude: 4 + i * 2, period: 10, phase: i * 0.2 }}
            className="h-full w-full overflow-hidden"
            style={{
              padding: ts(22),
              borderRadius: "clamp(0.75rem, 3.333cqw, 2rem)",
              backgroundColor:
                i === PLANES.length - 1 ? "#fff" : "var(--color-paper)",
            }}
          >
            <p
              className="text-ink font-medium"
              style={{ fontSize: ts(14), textAlign: plane.align }}
            >
              {plane.title}
            </p>
            <div style={{ marginTop: ts(16) }}>
              {plane.id === "data" && <DataLayer />}
              {plane.id === "system" && <ComponentSystem />}
              {plane.id === "live" && <LiveInterface />}
            </div>
          </FloatPanel>
        </motion.div>
      ))}

      {/* Sits clear of all three planes in the bottom-right. */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 4, period: 12, phase: 0.5 }}
        className="absolute flex flex-col justify-center"
        style={{
          left: px(700),
          top: py(440),
          width: px(180),
          height: py(120),
          padding: `0 ${ts(22)}`,
          borderRadius: "clamp(0.625rem, 2.083cqw, 1.25rem)",
          zIndex: 60,
        }}
      >
        <span className="text-ink-soft" style={{ fontSize: ts(12) }}>
          LCP Score
        </span>
        {/* Counts down — the figure improving is the point. */}
        <span
          className="font-display text-brand-600 leading-none font-semibold tracking-tight tabular-nums"
          style={{ fontSize: ts(24), marginTop: ts(10) }}
        >
          <CountUp
            value={0.8}
            from={2.4}
            decimals={1}
            suffix="s"
            delay={2}
            duration={1.5}
          />
        </span>
      </FloatPanel>
    </div>
  );
}

/** Field rows — what an editor actually touches. */
function DataLayer() {
  return (
    <div style={{ display: "grid", gap: cq(9) }}>
      {[
        ["title", "string"],
        ["hero.image", "asset"],
        ["sections[]", "block"],
        ["seo.meta", "object"],
      ].map(([field, type]) => (
        <div
          key={field}
          className="border-hair flex items-center justify-between border-b"
          style={{ paddingBottom: cq(7) }}
        >
          <code className="text-ink-soft" style={{ fontSize: ts(11) }}>
            {field}
          </code>
          <span className="text-muted" style={{ fontSize: ts(10) }}>
            {type}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Component swatches — the vocabulary the pages are built from. */
function ComponentSystem() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: cq(9),
      }}
    >
      {["Hero", "Card", "Nav", "Form", "Table", "CTA", "Tabs", "Foot"].map(
        (name) => (
          <div
            key={name}
            className="border-hair bg-brand-50/60 flex items-center justify-center rounded-md border"
            style={{ height: cq(38), fontSize: ts(10) }}
          >
            <span className="text-brand-800">{name}</span>
          </div>
        ),
      )}
    </div>
  );
}

/** The rendered result. */
function LiveInterface() {
  return (
    <div style={{ display: "grid", gap: cq(10) }}>
      <div
        className="bg-brand-50 flex flex-col justify-center rounded-lg"
        style={{ height: cq(70), padding: cq(14) }}
      >
        <span
          className="bg-brand-300 block rounded-full"
          style={{ height: cq(8), width: "58%" }}
        />
        <span
          className="bg-brand-200 block rounded-full"
          style={{ height: cq(7), width: "38%", marginTop: cq(7) }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: cq(10),
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="border-hair rounded-md border"
            style={{ padding: cq(9) }}
          >
            <span
              className="bg-brand-100 block rounded"
              style={{ height: cq(18) }}
            />
            <span
              className="bg-hair block rounded-full"
              style={{ height: cq(5), width: "80%", marginTop: cq(7) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
