"use client";

import { motion } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
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
 * A crawl, fanning out and converging.
 *
 * "Fix the crawl, then earn the ranking." The shape is deliberately non-linear:
 * one root splits into three parallel diagnostics that all have to clear before
 * the ranking moves. A single-file pipeline would argue the opposite — that
 * these are sequential steps rather than simultaneous conditions.
 *
 * Two changes from the blueprint. It sent one packet that visited a single
 * diagnostic node, which undercuts the fan-out; three travel in parallel here.
 * And the target read "Pos #1" — on an SEO agency page a guaranteed first
 * position reads as a promise rather than an illustration, so it lands at #3.
 */

const LOOP = 8;
const at = (seconds: number) => beat(seconds, LOOP);

/** Diagnostics. `issues` is what makes these read as an audit, not a flowchart. */
const NODES = [
  { label: "Core Web Vitals", issues: "12 issues", y: 120 },
  { label: "Indexation", issues: "348 URLs", y: 280 },
  { label: "Content Gaps", issues: "26 terms", y: 440 },
];

const ROOT = { x: 240, y: 320 };
const TARGET = { x: 680, y: 320 };

export function CrawlGraph() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="md" className="left-[70.833%] top-[31.25%]" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        {NODES.map((node, i) => {
          const ny = node.y + 40;
          return (
            <g key={node.label}>
              {/* Root fans out. Elbowed rather than straight so the three
                  branches stay distinguishable where they leave the root. */}
              <path
                d={`M ${ROOT.x} ${ROOT.y} L ${(ROOT.x + 360) / 2} ${ROOT.y} L ${(ROOT.x + 360) / 2} ${ny} L 360 ${ny}`}
                fill="none"
                stroke="var(--color-brand-200)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              {/* And converges on the target. */}
              <path
                d={`M 520 ${ny} L ${(520 + TARGET.x) / 2} ${ny} L ${(520 + TARGET.x) / 2} ${TARGET.y} L ${TARGET.x} ${TARGET.y}`}
                fill="none"
                stroke="var(--color-brand-200)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              {/* One crawler per branch, all in flight together. */}
              <motion.circle
                r={4}
                fill="var(--color-brand-500)"
                initial={false}
                animate={
                  playing
                    ? {
                        cx: [ROOT.x, 360, 520, TARGET.x, TARGET.x],
                        cy: [ROOT.y, ny, ny, TARGET.y, TARGET.y],
                        opacity: [0, 1, 1, 1, 0, 0],
                      }
                    : { cx: TARGET.x, cy: TARGET.y, opacity: 0 }
                }
                transition={
                  playing
                    ? {
                        duration: LOOP,
                        times: [0, at(1.0), at(1.8), at(2.8), 1],
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.18,
                        opacity: {
                          duration: LOOP,
                          times: [0, at(0.2), at(2.4), at(2.8), at(3.0), 1],
                          repeat: Infinity,
                          delay: i * 0.18,
                        },
                      }
                    : undefined
                }
              />
            </g>
          );
        })}
      </svg>

      <FloatPanel
        playing={playing}
        float={{ amplitude: 4, period: 15, phase: 0 }}
        className="absolute flex flex-col justify-center"
        style={{
          left: px(80),
          top: py(280),
          width: px(160),
          height: py(80),
          padding: `0 ${ts(18)}`,
          borderRadius: "clamp(0.625rem, 2.083cqw, 1.25rem)",
        }}
      >
        <span className="text-ink font-medium" style={{ fontSize: ts(14) }}>
          Site Crawl
        </span>
        <span
          className="text-muted"
          style={{ fontSize: ts(11), marginTop: ts(6) }}
        >
          4,120 pages
        </span>
      </FloatPanel>

      {NODES.map((node, i) => (
        <FloatPanel
          key={node.label}
          playing={playing}
          float={{ amplitude: 4, period: 11 + i, phase: 0.1 + i * 0.25 }}
          className="absolute flex flex-col justify-center"
          style={{
            left: px(360),
            top: py(node.y),
            width: px(160),
            height: py(80),
            padding: `0 ${ts(18)}`,
            borderRadius: "clamp(0.625rem, 2.083cqw, 1.25rem)",
          }}
        >
          <span className="text-ink font-medium" style={{ fontSize: ts(12) }}>
            {node.label}
          </span>
          {/* TODO(content): illustrative counts. */}
          <span
            className="text-brand-700 flex items-center font-medium tabular-nums"
            style={{ fontSize: ts(11), marginTop: ts(6), gap: ts(6) }}
          >
            <span
              className="bg-brand-400 rounded-full"
              style={{ width: ts(5), height: ts(5) }}
            />
            {node.issues}
          </span>
        </FloatPanel>
      ))}

      {/* The outcome. A SERP with the tracked result climbing into place. */}
      <FloatPanel
        playing={playing}
        focal
        interactive
        float={{ amplitude: 6, period: 13, phase: 0.5 }}
        className="absolute overflow-hidden"
        style={{
          left: px(680),
          top: py(220),
          width: px(220),
          height: py(200),
          padding: ts(20),
          borderRadius: "clamp(0.75rem, 3.333cqw, 2rem)",
          borderColor: "var(--color-brand-300)",
        }}
      >
        <span className="text-ink-soft" style={{ fontSize: ts(12) }}>
          Target Keyword
        </span>
        <div style={{ marginTop: ts(14) }}>
          {[1, 2, 3].map((pos) => {
            const ours = pos === 3;
            return (
              <motion.div
                key={pos}
                className="flex items-center"
                style={{ gap: ts(10), marginTop: pos === 1 ? 0 : ts(9) }}
                initial={false}
                animate={
                  playing && ours
                    ? {
                        opacity: [0.25, 0.25, 1, 1, 0.25],
                        x: [10, 10, 0, 0, 10],
                      }
                    : { opacity: ours ? 1 : 0.35, x: 0 }
                }
                transition={
                  playing && ours
                    ? {
                        duration: LOOP,
                        times: [0, at(2.8), at(4.0), at(7.5), 1],
                        repeat: Infinity,
                        ease: EASE.out,
                      }
                    : undefined
                }
              >
                <span
                  className={
                    ours
                      ? "font-display text-brand-600 shrink-0 font-semibold tabular-nums"
                      : "font-display text-muted shrink-0 font-semibold tabular-nums"
                  }
                  style={{ fontSize: ts(12) }}
                >
                  #{pos}
                </span>
                <span
                  className="flex-1"
                  style={{ display: "grid", gap: ts(4) }}
                >
                  <span
                    className={
                      ours
                        ? "bg-brand-300 block rounded-full"
                        : "bg-hair block rounded-full"
                    }
                    style={{ height: ts(5), width: ours ? "100%" : "72%" }}
                  />
                  <span
                    className="bg-hair block rounded-full"
                    style={{ height: ts(4), width: "48%" }}
                  />
                </span>
              </motion.div>
            );
          })}
        </div>
      </FloatPanel>
    </div>
  );
}
