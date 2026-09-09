"use client";

import { motion } from "motion/react";

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
import { CrawlGraphPhone } from "@/components/sections/service/visuals/CrawlGraphPhone";
import {
  CRAWL_PAGES_TEXT,
  CRAWL_TITLE,
  LOOP,
  NODES,
  OUR_POSITION,
  SERP_ROWS,
  SERP_TITLE,
  at,
  issuesOf,
} from "@/components/sections/service/visuals/crawlGraphShared";
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
 *
 * The phone stage keeps the parallelism and drops the fan; see
 * `CrawlGraphPhone` for why.
 */

export function CrawlGraph() {
  return (
    <>
      <div className="md:hidden">
        <CrawlGraphPhone />
      </div>
      <div className="hidden md:block">
        <CrawlGraphDesktop />
      </div>
    </>
  );
}

/** Where each diagnostic sits on this canvas, which is this canvas's business. */
const NODE_Y = [120, 280, 440];

const ROOT = { x: 240, y: 320 };
const TARGET = { x: 680, y: 320 };

function CrawlGraphDesktop() {
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
          const ny = NODE_Y[i] + 40;
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
                        // One easing per hop, not one for the sequence: a bare
                        // `ease` beside `times` is handed to WAAPI as the
                        // easing of the whole effect, which remaps the loop's
                        // clock and lands every offset somewhere else.
                        ease: ["easeInOut", "linear", "easeInOut", "linear"],
                        delay: i * 0.18,
                        opacity: {
                          duration: LOOP,
                          times: [0, at(0.2), at(2.4), at(2.8), at(3.0), 1],
                          repeat: Infinity,
                          ease: [
                            "easeInOut",
                            "linear",
                            "linear",
                            "easeInOut",
                            "linear",
                          ],
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
          {CRAWL_TITLE}
        </span>
        <span
          className="text-muted"
          style={{ fontSize: ts(11), marginTop: ts(6) }}
        >
          {CRAWL_PAGES_TEXT}
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
            top: py(NODE_Y[i]),
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
            {issuesOf(node)}
          </span>
        </FloatPanel>
      ))}

      {/*
        The outcome. A SERP with the tracked result climbing into place.

        The only panel here whose height is not stated. Everything inside it is
        type, and `ts` floors at 10px, so its content stands at 214 units of
        this canvas where the illustration renders 515 wide and 162 where it
        renders 851 — no single figure fits the range, and the one it had
        clipped the third result at the narrow end. So it takes the height of
        what it holds, and the wrapper hangs it from the point the three
        leaders converge on rather than from a top edge that would have to move
        with it. The wrapper does the centring because the bob owns the panel's
        own transform.
      */}
      <div
        className="absolute"
        style={{
          left: px(680),
          top: py(TARGET.y),
          width: px(220),
          transform: "translateY(-50%)",
        }}
      >
        <FloatPanel
          playing={playing}
          focal
          interactive
          float={{ amplitude: 6, period: 13, phase: 0.5 }}
          className="overflow-hidden"
          style={{
            padding: ts(20),
            borderRadius: "clamp(0.75rem, 3.333cqw, 2rem)",
            borderColor: "var(--color-brand-300)",
          }}
        >
          <span className="text-ink-soft" style={{ fontSize: ts(12) }}>
            {SERP_TITLE}
          </span>
          {/*
          `cq` rather than `ts` for every box in here.
          `ts` floors at 10px, which is right for a label and wrong for a 4-unit
          bar: at 1440 each of these rules was rendering at 10px instead of
          3.9, so a row stood 30px tall instead of 13 and the third result's
          second rule fell outside the panel and was clipped away. The rows
          have been the wrong size and the last one incomplete for as long as
          this drawing has existed.
        */}
          <div style={{ marginTop: cq(14) }}>
            {SERP_ROWS.map((pos) => {
              const ours = pos === OUR_POSITION;
              return (
                <motion.div
                  key={pos}
                  className="flex items-center"
                  style={{ gap: cq(10), marginTop: pos === 1 ? 0 : cq(9) }}
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
                          ease: ["linear", EASE.out, "linear", EASE.inOut],
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
                    style={{ display: "grid", gap: cq(4) }}
                  >
                    <span
                      className={
                        ours
                          ? "bg-brand-300 block rounded-full"
                          : "bg-hair block rounded-full"
                      }
                      style={{ height: cq(5), width: ours ? "100%" : "72%" }}
                    />
                    <span
                      className="bg-hair block rounded-full"
                      style={{ height: cq(4), width: "48%" }}
                    />
                  </span>
                </motion.div>
              );
            })}
          </div>
        </FloatPanel>
      </div>
    </div>
  );
}
