"use client";

import { motion } from "motion/react";

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
import { EASE } from "@/lib/motion";

/**
 * A mailer, and what happens after it lands.
 *
 * The previous version drew the automation as abstract flow boxes — correct
 * about the logic, and unrecognisable as email. This one puts a rendered mailer
 * on the canvas: subject line, preheader, hero block, body, a green call to
 * action. You can tell what the page sells without reading a word of it.
 *
 * The branch topology survives, but the branches are now themselves emails —
 * the follow-up that goes out when someone opens, and the resend that goes out
 * when nobody does. That is what an automation actually is: not a decision
 * tree, a sequence of messages.
 */

const LOOP = 9;
const at = (seconds: number) => beat(seconds, LOOP);

const BRANCHES = [
  {
    id: "opened",
    chip: "Opened",
    subject: "Your order is confirmed",
    preheader: "Plus something you might like",
    y: 90,
    live: true,
  },
  {
    id: "quiet",
    chip: "No open · 24h",
    subject: "Still thinking it over?",
    preheader: "Resent with a new subject line",
    y: 290,
    live: false,
  },
];

export function EmailFlow() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="lg" className="left-[16.667%] top-[25%]" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        {BRANCHES.map((branch) => (
          <path
            key={branch.id}
            d={`M 380 320 L 440 320 L 440 ${branch.y + 75} L 500 ${branch.y + 75}`}
            fill="none"
            stroke="var(--color-brand-200)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
        ))}
        {/* The send, routing to the opened branch. */}
        <motion.circle
          r={4}
          fill="var(--color-brand-500)"
          initial={false}
          animate={
            playing
              ? {
                  cx: [380, 440, 440, 500, 500],
                  cy: [320, 320, 165, 165, 165],
                  opacity: [0, 1, 1, 1, 0, 0],
                }
              : { cx: 500, cy: 165, opacity: 0 }
          }
          transition={
            playing
              ? {
                  duration: LOOP,
                  times: [0, at(0.6), at(1.3), at(1.8), 1],
                  repeat: Infinity,
                  ease: "easeInOut",
                  opacity: {
                    duration: LOOP,
                    times: [0, at(0.15), at(1.5), at(1.8), at(2.0), 1],
                    repeat: Infinity,
                  },
                }
              : undefined
          }
        />
      </svg>

      {/* The mailer itself. This is the whole point of the drawing. */}
      <FloatPanel
        playing={playing}
        focal
        interactive
        float={{ amplitude: 3, period: 15, phase: 0 }}
        className="absolute overflow-hidden"
        style={{
          left: px(40),
          top: py(120),
          width: px(340),
          height: py(400),
          borderRadius: "clamp(0.75rem, 3.333cqw, 2rem)",
          zIndex: 30,
        }}
      >
        <div className="border-hair border-b" style={{ padding: ts(18) }}>
          <p className="text-muted" style={{ fontSize: ts(10) }}>
            From · Pixel Portal
          </p>
          <p
            className="text-ink font-medium"
            style={{ fontSize: ts(14), marginTop: ts(7) }}
          >
            You left something behind
          </p>
          <p
            className="text-muted truncate"
            style={{ fontSize: ts(11), marginTop: ts(5) }}
          >
            Your cart is saved for 48 hours
          </p>
        </div>

        <div style={{ padding: ts(18) }}>
          {/* Hero block. */}
          <div
            className="bg-brand-50 flex flex-col justify-center rounded-lg"
            style={{ height: cq(96), padding: cq(16) }}
          >
            <span
              className="bg-brand-300 block rounded-full"
              style={{ height: cq(9), width: "62%" }}
            />
            <span
              className="bg-brand-200 block rounded-full"
              style={{ height: cq(7), width: "42%", marginTop: cq(8) }}
            />
          </div>

          <div style={{ display: "grid", gap: cq(8), marginTop: cq(16) }}>
            <span
              className="bg-hair block rounded-full"
              style={{ height: cq(6), width: "100%" }}
            />
            <span
              className="bg-hair block rounded-full"
              style={{ height: cq(6), width: "88%" }}
            />
            <span
              className="bg-hair block rounded-full"
              style={{ height: cq(6), width: "64%" }}
            />
          </div>

          <div
            className="bg-brand-600 flex items-center justify-center rounded-full"
            style={{ height: cq(34), marginTop: cq(18) }}
          >
            <span
              className="font-medium text-white"
              style={{ fontSize: ts(11) }}
            >
              Complete your order
            </span>
          </div>
        </div>
      </FloatPanel>

      {/* The follow-ups. Each branch is another message, not a label. */}
      {BRANCHES.map((branch, i) => (
        <div key={branch.id}>
          <motion.span
            className={
              branch.live
                ? "border-hair text-brand-700 absolute rounded-full border bg-white font-semibold tracking-[0.08em] uppercase shadow-(--shadow-float)"
                : "border-hair text-ink absolute rounded-full border bg-white font-semibold tracking-[0.08em] uppercase shadow-(--shadow-float)"
            }
            style={{
              left: px(408),
              top: py(branch.y + 46),
              padding: `${ts(6)} ${ts(11)}`,
              fontSize: ts(10),
              zIndex: 40,
            }}
            initial={false}
            animate={
              playing && branch.live
                ? { opacity: [0.4, 0.4, 1, 1, 0.4], y: [6, 6, 0, 0, 6] }
                : { opacity: branch.live ? 1 : 0.5, y: 0 }
            }
            transition={
              playing && branch.live
                ? {
                    duration: LOOP,
                    times: [0, at(1.3), at(1.9), at(8.2), 1],
                    repeat: Infinity,
                    ease: EASE.out,
                  }
                : undefined
            }
          >
            {branch.chip}
          </motion.span>

          <FloatPanel
            playing={playing}
            float={{ amplitude: 3, period: 13 + i * 2, phase: 0.2 + i * 0.3 }}
            className="absolute overflow-hidden"
            style={{
              left: px(500),
              top: py(branch.y),
              width: px(400),
              height: py(150),
              padding: ts(18),
              borderRadius: "clamp(0.625rem, 2.083cqw, 1.25rem)",
              borderColor: branch.live
                ? "var(--color-brand-300)"
                : "var(--color-hair)",
              opacity: branch.live ? 1 : 0.78,
              zIndex: 20,
            }}
          >
            <div className="flex items-center" style={{ gap: ts(10) }}>
              <span
                className={
                  branch.live
                    ? "bg-brand-50 grid place-items-center rounded-lg"
                    : "bg-paper grid place-items-center rounded-lg"
                }
                style={{ width: ts(30), height: ts(30) }}
              >
                <EnvelopeGlyph live={branch.live} />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="text-ink block truncate font-medium"
                  style={{ fontSize: ts(13) }}
                >
                  {branch.subject}
                </span>
                <span
                  className="text-muted block truncate"
                  style={{ fontSize: ts(11), marginTop: ts(4) }}
                >
                  {branch.preheader}
                </span>
              </span>
            </div>
            <div style={{ display: "grid", gap: cq(7), marginTop: cq(16) }}>
              <span
                className="bg-hair block rounded-full"
                style={{ height: cq(5), width: "92%" }}
              />
              <span
                className="bg-hair block rounded-full"
                style={{ height: cq(5), width: "70%" }}
              />
            </div>
          </FloatPanel>
        </div>
      ))}

      {/* Deliverability and engagement — the numbers this channel is judged on. */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 3, period: 17, phase: 0.6 }}
        className="absolute flex items-center justify-between"
        style={{
          left: px(500),
          top: py(470),
          width: px(400),
          height: py(110),
          padding: `0 ${ts(26)}`,
          borderRadius: "clamp(0.625rem, 2.083cqw, 1.25rem)",
          zIndex: 20,
        }}
      >
        {/* TODO(content): illustrative figures. */}
        {[
          ["Delivered", "10,000"],
          ["Opened", "40%"],
          ["Clicked", "10%"],
        ].map(([label, value], i) => (
          <span key={label} style={{ display: "grid", gap: ts(8) }}>
            <span className="text-muted" style={{ fontSize: ts(11) }}>
              {label}
            </span>
            <span
              className={
                i === 0
                  ? "font-display text-ink leading-none font-semibold tabular-nums"
                  : "font-display text-brand-600 leading-none font-semibold tabular-nums"
              }
              style={{ fontSize: ts(20) }}
            >
              {value}
            </span>
          </span>
        ))}
      </FloatPanel>
    </div>
  );
}

function EnvelopeGlyph({ live }: { live: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke={live ? "var(--color-brand-700)" : "var(--color-muted)"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
