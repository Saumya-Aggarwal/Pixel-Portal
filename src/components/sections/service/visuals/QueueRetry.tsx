"use client";

import { motion } from "motion/react";

import { FlowLane, laneOffset } from "@/components/sections/service/visuals/chrome/FlowLane";
import { usePointerTilt } from "@/components/sections/service/visuals/usePointerTilt";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * A sync, including the part that goes wrong.
 *
 * Most integration diagrams draw the happy path — two logos and an arrow. The
 * argument this page makes is the opposite one: integrations break at three in
 * the morning and what matters is what happens next. So the picture spends most
 * of its cycle on a failure, a backoff, a retry, and a dead letter.
 *
 * Three packets run the lane on staggered delays. Two succeed; the third
 * stalls at the queue, reddens, retries, and drops out. Drawing the failure as
 * the *middle* packet rather than the last means the lane never looks empty
 * while the interesting thing is happening.
 */

const STOPS = ["CRM", "Queue", "Retry", "ERP"];
const CYCLE = 6;

export function QueueRetry() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();
  const { ref: tiltRef, style, handlers } = usePointerTilt<HTMLDivElement>();

  return (
    <div
      ref={tiltRef}
      {...handlers}
      className="flex h-full flex-col justify-center gap-8 px-8 py-8 lg:px-16"
      style={{ perspective: 1200 }}
    >
      <motion.div ref={ref} style={style}>
        <FlowLane
          className="h-16"
          stops={STOPS.map((stop, i) => (
            <StopNode key={stop} label={stop} warn={i === 2} />
          ))}
        >
          <Packet playing={playing} delay={0} />
          <Packet playing={playing} delay={2} fails />
          <Packet playing={playing} delay={4} />
        </FlowLane>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2">
        {[
          { label: "Idempotent writes", tone: "ok" as const },
          { label: "Exponential backoff", tone: "ok" as const },
          { label: "Dead-letter queue", tone: "warn" as const },
          { label: "Audit log", tone: "ok" as const },
        ].map((chip, i) => (
          <motion.span
            key={chip.label}
            className={
              chip.tone === "warn"
                ? "border-brand-300 bg-brand-50 text-brand-800 rounded-full border px-3 py-1.5 text-[0.6875rem] leading-none"
                : "border-hair text-ink-soft rounded-full border bg-white px-3 py-1.5 text-[0.6875rem] leading-none"
            }
            initial={false}
            animate={playing ? { opacity: [0.45, 1, 0.45] } : { opacity: 1 }}
            transition={
              playing
                ? { duration: 4, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }
                : undefined
            }
          >
            {chip.label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function StopNode({ label, warn }: { label: string; warn?: boolean }) {
  return (
    <span className="flex flex-col items-center gap-2">
      <span
        className={
          warn
            ? "border-brand-400 bg-brand-50 block size-3 rounded-full border-2"
            : "border-brand-300 block size-3 rounded-full border-2 bg-white"
        }
      />
      <span className="text-muted text-[0.625rem] leading-none font-medium tracking-[0.06em] uppercase">
        {label}
      </span>
    </span>
  );
}

/**
 * One message on the lane.
 *
 * A successful packet runs stop 0 → 3 and fades. A failing one stops at the
 * queue, holds while it backs off, hops to the retry node, and drops — so the
 * two paths diverge visibly at the same point on the track.
 */
function Packet({
  playing,
  delay,
  fails = false,
}: {
  playing: boolean;
  delay: number;
  fails?: boolean;
}) {
  const path = fails
    ? [laneOffset(0, 4), laneOffset(1, 4), laneOffset(1, 4), laneOffset(2, 4), laneOffset(2, 4)]
    : [laneOffset(0, 4), laneOffset(1, 4), laneOffset(2, 4), laneOffset(3, 4), laneOffset(3, 4)];

  return (
    <motion.span
      aria-hidden
      className={
        fails
          ? "bg-brand-200 border-brand-500 absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-[3px] border"
          : "bg-brand-600 absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-[3px]"
      }
      initial={false}
      animate={
        playing
          ? { left: path, opacity: [0, 1, 1, 1, 0] }
          : // Static: parked mid-lane so the picture still reads as in-flight.
            { left: laneOffset(fails ? 1 : 2, 4), opacity: 1 }
      }
      transition={
        playing
          ? {
              duration: CYCLE,
              times: [0, 0.28, 0.52, 0.76, 1],
              delay,
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: EASE.soft,
            }
          : undefined
      }
    />
  );
}
