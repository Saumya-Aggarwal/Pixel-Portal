"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { CalloutChip } from "@/components/sections/service/visuals/chrome/Callout";
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
import { EASE } from "@/lib/motion";

/**
 * A feed, and the operation behind it.
 *
 * The page's argument is that posting on a schedule is not a strategy — most
 * brands post, very few compound. So the phone is only half the picture: a
 * content calendar and a publishing queue sit beside it, feeding the feed, with
 * a response-time commitment pinned to the queue.
 *
 * An earlier version was the phone alone. It read as "we post things", which is
 * the claim the copy is arguing against.
 *
 * 8s loop. A post publishes, the feed scrolls one card, the new post's
 * engagement climbs, then 3.3s of stillness while the reader takes it in.
 */

const LOOP = 8;
const at = (seconds: number) => beat(seconds, LOOP);

/**
 * Scroll distance: one card plus its gap.
 *
 * A percentage `y` transform resolves against the moving element's own height,
 * not its parent's — the track is three 200px cards with two 20px gaps, so one
 * card of travel is 220 of 640, not 220 of the phone screen.
 */
const SCROLL = "-34.375%";

const CALENDAR = [
  ["Mon", "Carousel · Brand"],
  ["Wed", "Reel · Product"],
  ["Thu", "Case study"],
  ["Sat", "Community AMA"],
];

export function SocialFeed() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="lg" className="left-[58.333%] top-[25%]" />

      {/* Leaders from the operational panels into the phone. */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <line
          x1={420}
          y1={200}
          x2={560}
          y2={200}
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        <line
          x1={380}
          y1={420}
          x2={560}
          y2={420}
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        {/* The post being published. Travels the queue's leader into the phone. */}
        <motion.circle
          r={3}
          cy={420}
          fill="var(--color-brand-500)"
          initial={false}
          animate={
            playing
              ? { cx: [380, 560, 560], opacity: [0, 1, 1, 0, 0] }
              : { cx: 560, opacity: 0 }
          }
          transition={
            playing
              ? {
                  cx: {
                    duration: LOOP,
                    times: [0, at(1), 1],
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: {
                    duration: LOOP,
                    times: [0, at(0.15), at(0.85), at(1), 1],
                    repeat: Infinity,
                    ease: "linear",
                  },
                }
              : undefined
          }
        />
      </svg>

      {/* ---- Operation: what gets posted, and when ---- */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 4, period: 10, phase: 0.2 }}
        className="absolute overflow-hidden"
        style={{
          left: px(60),
          top: py(100),
          width: px(360),
          height: py(200),
          padding: ts(20),
          borderRadius: "clamp(0.75rem, 3.333cqw, 2rem)",
        }}
      >
        <p className="text-ink font-medium" style={{ fontSize: ts(14) }}>
          Q3 Content Calendar
        </p>
        <div style={{ marginTop: ts(14) }}>
          {CALENDAR.map(([day, slot], i) => (
            <motion.div
              key={day}
              className="flex items-center"
              style={{ gap: ts(10), marginTop: i === 0 ? 0 : ts(10) }}
              initial={false}
              animate={playing ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
              transition={
                playing
                  ? {
                      duration: LOOP,
                      delay: i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : undefined
              }
            >
              <span
                className="text-muted shrink-0 font-medium tabular-nums"
                style={{ fontSize: ts(11), width: ts(34) }}
              >
                {day}
              </span>
              <span
                className="bg-brand-400 shrink-0 rounded-full"
                style={{ width: ts(5), height: ts(5) }}
              />
              <span
                className="text-ink-soft truncate"
                style={{ fontSize: ts(12) }}
              >
                {slot}
              </span>
            </motion.div>
          ))}
        </div>
      </FloatPanel>

      <FloatPanel
        playing={playing}
        float={{ amplitude: 4, period: 14, phase: 0.357 }}
        className="absolute overflow-hidden"
        style={{
          left: px(60),
          top: py(340),
          width: px(320),
          height: py(160),
          padding: ts(20),
          borderRadius: "clamp(0.75rem, 3.333cqw, 2rem)",
        }}
      >
        <p className="text-ink font-medium" style={{ fontSize: ts(14) }}>
          Publishing Queue
        </p>
        <div
          className="flex items-end"
          style={{ gap: ts(6), marginTop: ts(18), height: ts(52) }}
        >
          {[38, 22, 46, 30, 52, 26, 34].map((h, i) => (
            <motion.span
              key={i}
              className="bg-brand-200 flex-1 rounded-t-sm"
              style={{ height: `${h}%` }}
              initial={false}
              animate={playing ? { opacity: [0.55, 1, 0.55] } : { opacity: 1 }}
              transition={
                playing
                  ? {
                      duration: 4,
                      delay: i * 0.22,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </FloatPanel>

      <div className="absolute" style={{ left: px(280), top: py(316) }}>
        <CalloutChip style={{ fontSize: ts(11) }}>SLA: &lt;15 min</CalloutChip>
      </div>

      {/* ---- Output: the feed ---- */}
      <FloatPanel
        playing={playing}
        focal
        interactive
        float={{ amplitude: 6, period: 12, phase: 0 }}
        className="absolute overflow-hidden"
        style={{
          left: px(560),
          top: py(60),
          width: px(320),
          height: py(520),
          borderRadius: "clamp(0.75rem, 3.333cqw, 2rem)",
        }}
      >
        <div
          className="border-hair flex items-center border-b"
          style={{ gap: ts(10), padding: ts(18) }}
        >
          <span
            className="bg-brand-100 shrink-0 rounded-full"
            style={{ width: ts(28), height: ts(28) }}
          />
          <span className="text-ink font-medium" style={{ fontSize: ts(14) }}>
            @pixel_portal
          </span>
        </div>

        {/* Cards live in one track so a single y animation scrolls the feed.
            `top` is a percentage of the phone panel, not the canvas — the
            header occupies the first 80 of its 520. */}
        <motion.div
          className="absolute inset-x-0 flex flex-col items-center"
          style={{ top: "15.385%", gap: cq(20) }}
          initial={false}
          animate={
            playing ? { y: ["0%", "0%", SCROLL, SCROLL, "0%"] } : { y: SCROLL }
          }
          transition={
            playing
              ? {
                  duration: LOOP,
                  times: [0, at(1.2), at(2.7), at(7.5), 1],
                  repeat: Infinity,
                  ease: EASE.out,
                }
              : undefined
          }
        >
          <Post
            caption="Behind the rebrand — three weeks of type tests."
            age="2h ago"
            lift={14.2}
          />
          <Post
            caption="Replatforming Northwind in eleven weeks."
            age="5h ago"
            lift={9.1}
          />
          <Post
            caption="What forty assets a month actually looks like."
            age="Just now"
            lift={18.4}
            fresh
            playing={playing}
          />
        </motion.div>
      </FloatPanel>
    </div>
  );
}

function Post({
  caption,
  age,
  lift,
  fresh = false,
  playing = false,
}: {
  caption: string;
  age: string;
  lift: number;
  /** The post published during this loop. Its metric climbs; the others hold. */
  fresh?: boolean;
  playing?: boolean;
}) {
  return (
    <div
      className="border-hair relative shrink-0 border bg-white shadow-(--shadow-float)"
      style={{
        width: "90%",
        height: cq(200),
        borderRadius: "clamp(0.5rem, 2.083cqw, 1.25rem)",
        padding: ts(14),
      }}
    >
      <div
        className="bg-brand-50 w-full rounded-md"
        style={{ height: ts(88) }}
      />
      <p
        className="text-ink-soft leading-snug"
        style={{ fontSize: ts(12), marginTop: ts(10) }}
      >
        {caption}
      </p>
      <div
        className="flex items-center justify-between"
        style={{ marginTop: ts(10) }}
      >
        <span className="text-muted" style={{ fontSize: ts(12) }}>
          {age}
        </span>
        <span
          className="text-brand-600 font-medium tabular-nums"
          style={{ fontSize: ts(12) }}
        >
          {/* TODO(content): illustrative engagement figures. */}
          {fresh && playing ? (
            <>
              Eng +
              <CountUp
                value={lift}
                from={0}
                decimals={1}
                delay={2.7}
                duration={1.5}
                suffix="%"
              />
            </>
          ) : (
            `Eng +${lift.toFixed(1)}%`
          )}
        </span>
      </div>
    </div>
  );
}
