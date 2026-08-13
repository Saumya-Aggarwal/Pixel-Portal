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
 * A sync failing, and being caught.
 *
 * The page's argument is that integrations fail quietly — a webhook stops
 * firing on a Tuesday and nobody notices until month-end. So the subject of the
 * picture is not the connection, it is the failure path: the payload spends most
 * of the loop going wrong, and the retry ladder fills in beneath it.
 *
 * Two things keep this from reading as an error state rather than a feature.
 * The failed payload uses `ink`, never red — a red diagram on an agency page
 * looks like a broken screenshot. And it comes to rest in a slot *inside* the
 * dead-letter queue, which is the point: nothing was lost, it was caught.
 *
 * **Nothing in the bottom band appears or disappears.** An earlier cut faded the
 * retry rows in and then dropped them to nothing at the reset, which is the
 * failure mode this whole set is built to avoid — structure blinking out and
 * leaving a labelled box. The three attempts are always drawn; what changes is
 * the status in each one, from a pending dash to the code that came back. The
 * delivery counts move for the same reason: retried and dead-lettered tick up as
 * the failure happens, so the panel is reporting rather than decorating.
 *
 * Heights are the other correction. The band was 190 tall against ~205 of
 * content once `ts`'s 10px floor is applied at a typical container width, so the
 * last row of the counts and the routing line both hung past the panel edge.
 */

const LOOP = 10;
const at = (seconds: number) => beat(seconds, LOOP);

/** Rail height, and the midline of both system panels. */
const RAIL_Y = 205;
const JUNCTION_X = 480;

const SYSTEM = { y: 70, w: 275, h: 270 };
const SOURCE_X = 45;
const TARGET_X = 640;

const BAND = { y: 372, w: 270, h: 218 };
const BAND_X = [45, 345, 645];

/** Payload geometry. Positioned by its corner, so centring is explicit. */
const PAYLOAD = { w: 150, h: 36 };
const PAYLOAD_REST_X = JUNCTION_X - PAYLOAD.w / 2;
const PAYLOAD_REST_Y = 455;

const ATTEMPTS = [
  ["Attempt 1", "+2s"],
  ["Attempt 2", "+8s"],
  ["Attempt 3", "+32s"],
];

/** TODO(content): illustrative figures. */
const COUNTS = [
  { label: "Delivered · 24h", before: "18,402", after: "18,402", accent: true },
  { label: "Retried", before: "214", after: "217" },
  { label: "Dead-lettered", before: "3", after: "4" },
  { label: "Replayed", before: "3", after: "3" },
];

/** The window in which the target is rejecting writes. */
const FAIL_TIMES = [0, at(1.15), at(1.25), at(9.0), at(9.4), 1];
const FAIL_OUT = [1, 1, 0, 0, 1, 1];
const FAIL_IN = [0, 0, 1, 1, 0, 0];

/** Counts move once the message has been routed away. */
const COUNT_TIMES = [0, at(3.4), at(3.7), at(9.0), at(9.4), 1];

export function QueueRetry() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  const fail = playing
    ? { duration: LOOP, times: FAIL_TIMES, repeat: Infinity }
    : undefined;
  const count = playing
    ? { duration: LOOP, times: COUNT_TIMES, repeat: Infinity }
    : undefined;

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="lg" className="top-[25%] left-[33.333%]" />

      {/* Rails. A T: the main run left to right, and the drop into the DLQ. */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <path
          d={
            `M ${SOURCE_X + SYSTEM.w} ${RAIL_Y} L ${TARGET_X} ${RAIL_Y}` +
            ` M ${JUNCTION_X} ${RAIL_Y} L ${JUNCTION_X} ${BAND.y}`
          }
          fill="none"
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        {/* The junction. Turns to ink when the write is rejected. */}
        <motion.circle
          cx={JUNCTION_X}
          cy={RAIL_Y}
          r={5}
          fill="white"
          strokeWidth={1.5}
          initial={false}
          animate={
            playing
              ? {
                  stroke: [
                    "var(--color-brand-300)",
                    "var(--color-brand-300)",
                    "var(--color-ink)",
                    "var(--color-ink)",
                    "var(--color-brand-300)",
                  ],
                }
              : { stroke: "var(--color-ink)" }
          }
          transition={
            playing
              ? {
                  duration: LOOP,
                  times: [0, at(1.15), at(1.25), at(9.0), 1],
                  repeat: Infinity,
                  ease: "linear",
                }
              : undefined
          }
        />
      </svg>

      {/* ---- Source ---- */}
      <SystemPanel
        playing={playing}
        x={SOURCE_X}
        title="Salesforce CRM"
        direction="webhook · outbound"
        method="POST"
        path="/api/v1/sync"
        rows={[
          ["Auth", "OAuth 2.0"],
          ["Events", "6 subscribed"],
          ["Last fired", "2s ago"],
        ]}
        float={{ amplitude: 4, period: 10, phase: 0 }}
      >
        <span
          className="border-brand-300 text-brand-700 grid place-items-center rounded-full border bg-white font-semibold tracking-[0.06em] uppercase"
          style={{ height: cq(26), fontSize: ts(9) }}
        >
          200 · Sent
        </span>
      </SystemPanel>

      {/* ---- Target ---- */}
      <SystemPanel
        playing={playing}
        x={TARGET_X}
        title="NetSuite ERP"
        direction="REST · inbound"
        method="PUT"
        path="/records/customer"
        rows={[
          ["Auth", "Token"],
          ["Rate limit", "100 / min"],
          ["Last ack", "2s ago"],
        ]}
        float={{ amplitude: 4, period: 11, phase: 0.3 }}
      >
        <span className="relative grid" style={{ height: cq(26) }}>
          <motion.span
            className="border-brand-300 text-brand-700 absolute inset-0 grid place-items-center rounded-full border bg-white font-semibold tracking-[0.06em] uppercase"
            style={{ fontSize: ts(9) }}
            initial={false}
            animate={playing ? { opacity: FAIL_OUT } : { opacity: 0 }}
            transition={fail}
          >
            200 · Accepted
          </motion.span>
          {/* Ink, not red. A red block on an agency page reads as a broken
              screenshot rather than as the failure path being demonstrated. */}
          <motion.span
            className="border-ink/40 text-ink bg-paper absolute inset-0 grid place-items-center rounded-full border font-semibold tracking-[0.06em] uppercase"
            style={{ fontSize: ts(9) }}
            initial={false}
            animate={playing ? { opacity: FAIL_IN } : { opacity: 1 }}
            transition={fail}
          >
            503 · Unavailable
          </motion.span>
        </span>
      </SystemPanel>

      {/* ---- Backoff ladder ---- */}
      <BandPanel
        playing={playing}
        x={BAND_X[0]}
        title="Retry policy"
        subtitle="exponential backoff"
        float={{ amplitude: 5, period: 13, phase: 0.2 }}
      >
        <div style={{ display: "grid", gap: cq(8) }}>
          {ATTEMPTS.map(([attempt, delay], i) => (
            <div
              key={attempt}
              className="border-hair flex items-center justify-between rounded-md border bg-white"
              style={{ height: cq(26), padding: `0 ${cq(10)}` }}
            >
              <span className="text-ink-soft" style={{ fontSize: ts(10) }}>
                {attempt}
              </span>
              <span className="flex items-center" style={{ gap: cq(10) }}>
                <span
                  className="text-muted tabular-nums"
                  style={{ fontSize: ts(9) }}
                >
                  {delay}
                </span>
                {/* The row stays; only its outcome changes. */}
                <Swap
                  playing={playing}
                  at={1.4 + i * 0.6}
                  before={
                    <span className="text-muted" style={{ fontSize: ts(9) }}>
                      —
                    </span>
                  }
                  after={
                    <span
                      className="text-ink font-medium tabular-nums"
                      style={{ fontSize: ts(9) }}
                    >
                      503
                    </span>
                  }
                  width={cq(22)}
                />
              </span>
            </div>
          ))}
          <span
            className="relative block"
            style={{ height: cq(16), marginTop: cq(4) }}
          >
            <Swap
              playing={playing}
              at={3.2}
              before={
                <span
                  className="text-muted whitespace-nowrap"
                  style={{ fontSize: ts(10) }}
                >
                  awaiting outcome
                </span>
              }
              after={
                <span
                  className="text-ink font-medium whitespace-nowrap"
                  style={{ fontSize: ts(10) }}
                >
                  → routed to dead letter
                </span>
              }
              align="left"
            />
          </span>
        </div>
      </BandPanel>

      {/* ---- Where the failure lands ---- */}
      <BandPanel
        playing={playing}
        x={BAND_X[1]}
        title="Dead Letter Queue"
        subtitle="held for replay"
        focal
        float={{ amplitude: 5, period: 12, phase: 0.5 }}
      >
        {/* The slot the payload settles into. Drawn empty from the first frame,
            so the message arriving fills something rather than landing on top
            of nothing. */}
        <span
          className="border-hair/80 absolute rounded-[clamp(0.5rem,2.083cqw,1.25rem)] border border-dashed"
          style={{
            left: cq(PAYLOAD_REST_X - BAND_X[1]),
            top: cq(PAYLOAD_REST_Y - BAND.y),
            width: cq(PAYLOAD.w),
            height: cq(PAYLOAD.h),
          }}
        />
        <div className="mt-auto flex items-center justify-between">
          <span className="text-muted" style={{ fontSize: ts(10) }}>
            Depth
          </span>
          <span
            className="relative flex items-center"
            style={{ height: cq(20) }}
          >
            <Swap
              playing={playing}
              at={3.4}
              before={
                <span
                  className="font-display text-muted leading-none font-semibold tabular-nums"
                  style={{ fontSize: ts(18) }}
                >
                  0
                </span>
              }
              after={
                <span
                  className="font-display text-ink leading-none font-semibold tabular-nums"
                  style={{ fontSize: ts(18) }}
                >
                  1
                </span>
              }
              width={cq(14)}
            />
          </span>
        </div>
        <span
          className="border-brand-300 text-brand-700 grid place-items-center rounded-full border bg-white font-medium"
          style={{ height: cq(28), fontSize: ts(10), marginTop: cq(12) }}
        >
          Replay message
        </span>
      </BandPanel>

      {/* ---- Running counts ---- */}
      <BandPanel
        playing={playing}
        x={BAND_X[2]}
        title="Delivery"
        subtitle="rolling 24 hours"
        float={{ amplitude: 5, period: 14, phase: 0.8 }}
      >
        <div style={{ display: "grid", gap: cq(9) }}>
          {COUNTS.map((row) => (
            <div
              key={row.label}
              className="border-hair/70 flex items-baseline justify-between border-b"
              style={{ paddingBottom: cq(6) }}
            >
              <span
                className="text-ink-soft truncate"
                style={{ fontSize: ts(10) }}
              >
                {row.label}
              </span>
              {row.before === row.after ? (
                <span
                  className={
                    row.accent
                      ? "font-display text-brand-600 leading-none font-semibold tabular-nums"
                      : "font-display text-ink leading-none font-semibold tabular-nums"
                  }
                  style={{ fontSize: ts(13) }}
                >
                  {row.before}
                </span>
              ) : (
                <motion.span
                  className="font-display text-ink relative leading-none font-semibold tabular-nums"
                  style={{ fontSize: ts(13), height: cq(15) }}
                  initial={false}
                  animate={playing ? { opacity: 1 } : { opacity: 1 }}
                >
                  <motion.span
                    className="absolute right-0"
                    initial={false}
                    animate={playing ? { opacity: FAIL_OUT } : { opacity: 0 }}
                    transition={count}
                  >
                    {row.before}
                  </motion.span>
                  <motion.span
                    className="text-brand-600 absolute right-0"
                    initial={false}
                    animate={playing ? { opacity: FAIL_IN } : { opacity: 1 }}
                    transition={count}
                  >
                    {row.after}
                  </motion.span>
                  <span className="invisible">{row.after}</span>
                </motion.span>
              )}
            </div>
          ))}
        </div>
      </BandPanel>

      <Payload playing={playing} />
    </div>
  );
}

/**
 * Two states in one slot, cross-faded on a beat.
 *
 * The reserved width keeps the row from reflowing when the value changes
 * length, which is what makes this read as a field updating rather than as
 * layout settling.
 */
function Swap({
  playing,
  at: beatAt,
  before,
  after,
  width,
  align = "right",
}: {
  playing: boolean;
  at: number;
  before: React.ReactNode;
  after: React.ReactNode;
  width?: string;
  align?: "left" | "right";
}) {
  const times = [0, at(beatAt), at(beatAt + 0.3), at(9.0), at(9.4), 1];
  const transition = playing
    ? { duration: LOOP, times, repeat: Infinity }
    : undefined;

  return (
    <span className="relative block" style={{ width, minWidth: width }}>
      <motion.span
        className={align === "left" ? "absolute left-0" : "absolute right-0"}
        initial={false}
        animate={playing ? { opacity: [1, 1, 0, 0, 1, 1] } : { opacity: 0 }}
        transition={transition}
      >
        {before}
      </motion.span>
      <motion.span
        className={align === "left" ? "absolute left-0" : "absolute right-0"}
        initial={false}
        animate={playing ? { opacity: [0, 0, 1, 1, 0, 0] } : { opacity: 1 }}
        transition={transition}
      >
        {after}
      </motion.span>
    </span>
  );
}

/**
 * The message in flight. Rendered last so it comes to rest *on top of* the
 * dead-letter panel rather than behind it — quarantined and still readable is
 * the frame the whole picture exists to reach.
 */
function Payload({ playing }: { playing: boolean }) {
  return (
    <motion.div
      className="absolute grid place-items-center bg-white shadow-(--shadow-float)"
      style={{
        width: px(PAYLOAD.w),
        height: py(PAYLOAD.h),
        borderRadius: "clamp(0.5rem, 2.083cqw, 1.25rem)",
        borderWidth: 1,
        borderStyle: "solid",
      }}
      initial={false}
      animate={
        playing
          ? {
              left: [
                px(330),
                px(PAYLOAD_REST_X),
                px(PAYLOAD_REST_X),
                px(PAYLOAD_REST_X),
                px(PAYLOAD_REST_X),
              ],
              top: [
                py(RAIL_Y - PAYLOAD.h / 2),
                py(RAIL_Y - PAYLOAD.h / 2),
                py(RAIL_Y - PAYLOAD.h / 2),
                py(PAYLOAD_REST_Y),
                py(PAYLOAD_REST_Y),
              ],
              opacity: [0, 1, 1, 1, 1],
              borderColor: [
                "var(--color-hair)",
                "var(--color-hair)",
                "var(--color-ink)",
                "var(--color-ink)",
                "var(--color-ink)",
              ],
            }
          : // Resolved: quarantined in the DLQ slot, still in its failed state.
            {
              left: px(PAYLOAD_REST_X),
              top: py(PAYLOAD_REST_Y),
              opacity: 1,
              borderColor: "var(--color-ink)",
            }
      }
      transition={
        playing
          ? {
              duration: LOOP,
              times: [0, at(1.2), at(1.4), at(3.4), 1],
              repeat: Infinity,
              ease: EASE.out,
            }
          : undefined
      }
    >
      <code className="text-ink" style={{ fontSize: ts(11) }}>
        {`{ "event": "sync" }`}
      </code>
    </motion.div>
  );
}

function SystemPanel({
  playing,
  x,
  title,
  direction,
  method,
  path,
  rows,
  float,
  children,
}: {
  playing: boolean;
  x: number;
  title: string;
  direction: string;
  method: string;
  path: string;
  rows: string[][];
  float: { amplitude: number; period: number; phase: number };
  children: React.ReactNode;
}) {
  return (
    <FloatPanel
      playing={playing}
      float={float}
      className="absolute flex flex-col"
      style={{
        left: px(x),
        top: py(SYSTEM.y),
        width: px(SYSTEM.w),
        height: py(SYSTEM.h),
        padding: cq(18),
        borderRadius: "clamp(0.75rem, 2.5cqw, 1.5rem)",
      }}
    >
      <span className="text-ink font-medium" style={{ fontSize: ts(14) }}>
        {title}
      </span>
      <span
        className="text-ink-soft flex items-center"
        style={{ fontSize: ts(11), marginTop: cq(7), gap: cq(6) }}
      >
        <span
          className="bg-brand-400 rounded-full"
          style={{ width: cq(6), height: cq(6) }}
        />
        {direction}
      </span>

      <span
        className="border-hair flex items-center rounded-md border bg-white"
        style={{
          height: cq(28),
          padding: `0 ${cq(9)}`,
          gap: cq(8),
          marginTop: cq(13),
        }}
      >
        <span
          className="text-brand-700 font-semibold tracking-[0.04em]"
          style={{ fontSize: ts(9) }}
        >
          {method}
        </span>
        <span className="text-ink-soft truncate" style={{ fontSize: ts(10) }}>
          {path}
        </span>
      </span>

      <span style={{ display: "grid", gap: cq(7), marginTop: cq(13) }}>
        {rows.map(([label, value]) => (
          <span
            key={label}
            className="border-hair/70 flex items-baseline justify-between border-b"
            style={{ paddingBottom: cq(6) }}
          >
            <span className="text-muted" style={{ fontSize: ts(10) }}>
              {label}
            </span>
            <span
              className="text-ink-soft truncate"
              style={{ fontSize: ts(10) }}
            >
              {value}
            </span>
          </span>
        ))}
      </span>

      <span className="mt-auto grid">{children}</span>
    </FloatPanel>
  );
}

function BandPanel({
  playing,
  x,
  title,
  subtitle,
  focal = false,
  float,
  children,
}: {
  playing: boolean;
  x: number;
  title: string;
  subtitle: string;
  focal?: boolean;
  float: { amplitude: number; period: number; phase: number };
  children: React.ReactNode;
}) {
  return (
    <FloatPanel
      playing={playing}
      focal={focal}
      float={float}
      className="absolute flex flex-col"
      style={{
        left: px(x),
        top: py(BAND.y),
        width: px(BAND.w),
        height: py(BAND.h),
        padding: cq(18),
        backgroundColor: focal ? "#fff" : "var(--color-paper)",
        borderColor: focal ? "var(--color-brand-300)" : "var(--color-hair)",
        borderRadius: "clamp(0.75rem, 2.5cqw, 1.5rem)",
      }}
    >
      <span className="text-ink font-medium" style={{ fontSize: ts(13) }}>
        {title}
      </span>
      <span
        className="text-muted"
        style={{ fontSize: ts(10), marginTop: cq(4), marginBottom: cq(12) }}
      >
        {subtitle}
      </span>
      {children}
    </FloatPanel>
  );
}
