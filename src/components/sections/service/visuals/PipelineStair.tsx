"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import {
  H,
  W,
  cq,
  px,
  py,
  ts,
} from "@/components/sections/service/visuals/canvas";
import { PipelineStairPhone } from "@/components/sections/service/visuals/PipelineStairPhone";
import {
  BARS,
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
 * A reporting stack, assembled rather than rented.
 *
 * Four stages descending left to right, each seated lower than the last. The
 * staircase is the point of difference from the other flow drawings in the set:
 * the API integration piece is a T and the analytics piece converges two
 * sources into one, so a straight horizontal band here would have read as a
 * third variation on the same line.
 *
 * **Re-laid from the blueprint**, which reported 51.1% negative space against
 * its own 40-50% target and shipped it anyway. Panels went 190x380 to 190x420
 * and the gaps from 30 to 47, which lands it at 48%.
 *
 * The payload chips moved inside the panels. The blueprint floated them at
 * 90 wide over 30-wide gaps, so each one overlapped both neighbours by ~30
 * units and sat on top of the second card of the panel behind it. As a footer
 * on the stage that emits it, the payload is collision-free and reads better —
 * it is what the stage produces, not a label stuck to a line.
 */

const PANEL_W = 190;
const PANEL_H = 420;
const GAP = 47;

const stageX = (i: number) => 30 + i * (PANEL_W + GAP);
const stageY = (i: number) => 60 + i * 40;
const stageMid = (i: number) => stageY(i) + PANEL_H / 2;
const stageRight = (i: number) => stageX(i) + PANEL_W;

/** Elbow through the centre of each gap, midline to midline. */
const HOPS = [0, 1, 2].map((i) => ({
  x1: stageRight(i),
  y1: stageMid(i),
  xe: stageRight(i) + GAP / 2,
  x2: stageX(i + 1),
  y2: stageMid(i + 1),
  t: i * 1.5,
}));

export function PipelineStair() {
  return (
    <>
      <div className="md:hidden">
        <PipelineStairPhone />
      </div>
      <div className="hidden md:block">
        <PipelineStairDesktop />
      </div>
    </>
  );
}

function PipelineStairDesktop() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="lg" className="top-[25%] left-[27%]" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <path
          d={HOPS.map(
            (h) =>
              `M ${h.x1} ${h.y1} L ${h.xe} ${h.y1} L ${h.xe} ${h.y2} L ${h.x2} ${h.y2}`,
          ).join(" ")}
          fill="none"
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {HOPS.map((h) => (
          <motion.circle
            key={h.x1}
            r={4}
            fill="var(--color-brand-500)"
            initial={false}
            animate={
              playing
                ? {
                    cx: [h.x1, h.x1, h.xe, h.xe, h.x2, h.x2],
                    cy: [h.y1, h.y1, h.y1, h.y2, h.y2, h.y2],
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

      {STAGES.map((stage, i) => (
        <FloatPanel
          key={stage.id}
          playing={playing}
          focal={i === 3}
          interactive={i === 3}
          float={{ amplitude: 4, period: 11 + i, phase: i * 0.2 }}
          className="absolute overflow-hidden"
          style={{
            left: px(stageX(i)),
            top: py(stageY(i)),
            width: px(PANEL_W),
            height: py(PANEL_H),
            backgroundColor: i === 3 ? "#fff" : "var(--color-paper)",
            borderColor:
              i === 3 ? "var(--color-brand-300)" : "var(--color-hair)",
            borderRadius: "clamp(0.625rem, 2.5cqw, 1.5rem)",
            zIndex: 30,
          }}
        >
          <div
            className="border-hair border-b"
            style={{ padding: `${cq(16)} ${cq(16)} ${cq(14)}` }}
          >
            <p
              className="text-muted font-semibold tracking-[0.08em] uppercase"
              style={{ fontSize: ts(9) }}
            >
              Stage {i + 1}
            </p>
            <p
              className="text-ink font-medium"
              style={{ fontSize: ts(13), marginTop: cq(5) }}
            >
              {stage.title}
            </p>
          </div>

          <div style={{ padding: cq(16) }}>
            {i === 0 && <CardList items={SOURCES} />}
            {i === 1 && <CardList items={COLLECTION} />}
            {i === 2 && (
              <>
                <div
                  className="border-hair flex items-center justify-between rounded-lg border bg-white"
                  style={{ padding: `${cq(9)} ${cq(11)}` }}
                >
                  <span
                    className="text-ink font-medium"
                    style={{ fontSize: ts(11) }}
                  >
                    {WAREHOUSE[0]}
                  </span>
                  <span
                    className="text-muted tabular-nums"
                    style={{ fontSize: ts(10) }}
                  >
                    {WAREHOUSE[1]}
                  </span>
                </div>
                <div style={{ display: "grid", gap: cq(9), marginTop: cq(14) }}>
                  {SCHEMA.map(([field, type]) => (
                    <div
                      key={field}
                      className="border-hair/70 flex items-baseline justify-between border-b"
                      style={{ paddingBottom: cq(7) }}
                    >
                      <span
                        className="text-ink-soft truncate"
                        style={{ fontSize: ts(10) }}
                      >
                        {field}
                      </span>
                      <span
                        className="text-muted truncate"
                        style={{ fontSize: ts(9), marginLeft: cq(8) }}
                      >
                        {type}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {i === 3 && (
              <>
                <div
                  className="flex items-end justify-between"
                  style={{ height: cq(96) }}
                >
                  {BARS.map((bar, b) => (
                    <span
                      key={bar}
                      className={
                        b === BARS.length - 1
                          ? "bg-brand-500 block rounded-t-sm"
                          : "bg-brand-200 block rounded-t-sm"
                      }
                      style={{ width: cq(18), height: cq(bar) }}
                    />
                  ))}
                </div>
                <p
                  className="text-muted"
                  style={{ fontSize: ts(10), marginTop: cq(18) }}
                >
                  {MRR_LABEL}
                </p>
                {/* TODO(content): illustrative figures. */}
                <p
                  className="font-display text-brand-600 leading-none font-semibold tracking-tight tabular-nums"
                  style={{ fontSize: ts(24), marginTop: cq(8) }}
                >
                  <CountUp value={MRR} prefix="$" delay={4.2} duration={1.5} />
                </p>
                <p
                  className="text-ink-soft"
                  style={{ fontSize: ts(10), marginTop: cq(8) }}
                >
                  {MRR_DELTA}
                </p>
              </>
            )}
          </div>

          {/* What this stage emits. */}
          <span
            className="border-hair text-ink-soft absolute grid place-items-center rounded-full border bg-white font-semibold tracking-[0.06em]"
            style={{
              left: cq(16),
              bottom: cq(16),
              width: cq(PANEL_W - 32),
              height: cq(28),
              fontSize: ts(9),
            }}
          >
            {stage.payload}
          </span>
        </FloatPanel>
      ))}
    </div>
  );
}

function CardList({ items }: { items: string[][] }) {
  return (
    <div style={{ display: "grid", gap: cq(10) }}>
      {items.map(([name, value]) => (
        <div
          key={name}
          className="border-hair rounded-lg border bg-white"
          style={{ padding: `${cq(10)} ${cq(11)}` }}
        >
          <span
            className="text-ink block truncate"
            style={{ fontSize: ts(11) }}
          >
            {name}
          </span>
          <span
            className="text-muted block truncate"
            style={{ fontSize: ts(9), marginTop: cq(5) }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
