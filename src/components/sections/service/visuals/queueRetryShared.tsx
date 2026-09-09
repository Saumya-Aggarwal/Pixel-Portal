"use client";

import { motion } from "motion/react";

import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared timing, copy and figures for QueueRetry.
 *
 * The 960x640 drawing and the phone stage are different compositions of one
 * sequence — a sync is rejected, retried three times with backoff, and caught
 * in a dead-letter queue — so the beats and the strings live here once. Only
 * geometry differs between the two, and geometry is the part that cannot be
 * shared: a coordinate means something different on each canvas.
 */

export const LOOP = 10;
export const at = (seconds: number) => beat(seconds, LOOP);

export const ATTEMPTS = [
  ["Attempt 1", "+2s"],
  ["Attempt 2", "+8s"],
  ["Attempt 3", "+32s"],
] as const;

/**
 * TODO(content): illustrative figures.
 *
 * `short` is the phone label. Four counts across a 288-unit column give each
 * one 72 units, and "Dead-lettered" needs 78 at the 10px floor — so the phone
 * says "Dead letter" and the desktop, which has room, says it in full.
 */
export const COUNTS = [
  {
    label: "Delivered · 24h",
    short: "Delivered",
    before: "20,000",
    after: "20,000",
    accent: true,
  },
  {
    label: "Retried",
    short: "Retried",
    before: "200",
    after: "203",
    accent: false,
  },
  {
    label: "Dead-lettered",
    short: "Dead letter",
    before: "3",
    after: "4",
    accent: false,
  },
  {
    label: "Replayed",
    short: "Replayed",
    before: "3",
    after: "3",
    accent: false,
  },
] as const;

/** The window in which the target is rejecting writes. */
export const FAIL_TIMES = [0, at(1.15), at(1.25), at(9.0), at(9.4), 1];
export const FAIL_OUT = [1, 1, 0, 0, 1, 1];
export const FAIL_IN = [0, 0, 1, 1, 0, 0];

/** Counts move once the message has been routed away. */
export const COUNT_TIMES = [0, at(3.4), at(3.7), at(9.0), at(9.4), 1];

/**
 * Two states in one slot, cross-faded on a beat.
 *
 * The reserved width keeps the row from reflowing when the value changes
 * length, which is what makes this read as a field updating rather than as
 * layout settling.
 */
export function Swap({
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

  // `inset-y-0` + `items-center` rather than a bare `absolute`: the layers are
  // the only content, so this box has no height, and a plain `absolute` child
  // hangs off its top edge — which put every `503` under its own row instead of
  // in it. Centring on a zero-height line puts the value where the box sits,
  // whatever the row around it is doing.
  const layer =
    "absolute inset-y-0 flex items-center whitespace-nowrap " +
    (align === "left" ? "left-0" : "right-0");

  return (
    <span className="relative block" style={{ width, minWidth: width }}>
      <motion.span
        className={layer}
        initial={false}
        animate={playing ? { opacity: [1, 1, 0, 0, 1, 1] } : { opacity: 0 }}
        transition={transition}
      >
        {before}
      </motion.span>
      <motion.span
        className={layer}
        initial={false}
        animate={playing ? { opacity: [0, 0, 1, 1, 0, 0] } : { opacity: 1 }}
        transition={transition}
      >
        {after}
      </motion.span>
    </span>
  );
}
