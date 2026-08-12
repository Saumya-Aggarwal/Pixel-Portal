"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/cn";
import { DUR, EASE, VIEWPORT } from "@/lib/motion";

/**
 * One explicit `linear-gradient` rather than Tailwind's
 * `bg-linear-to-r from-* via-* to-*` chain. The chain resolves through five
 * custom properties, which is a lot of machinery to inspect when a 1px line
 * does not show up; this is one declaration that either paints or does not.
 *
 * `brand-400`, not `brand-300` — at 1px tall, mostly faded, on white, the
 * lighter tint reads as nothing at normal zoom.
 */
const RULE_LINE =
  "h-px max-w-100 flex-1 " +
  "bg-[linear-gradient(to_right,transparent,var(--color-brand-400),transparent)]";

/**
 * Lines scale out from the diamond rather than fading in place, so the rule
 * reads as being drawn. `originX` puts each line's anchor at its inner end —
 * the two then grow away from the centre in opposite directions instead of
 * both sliding one way.
 */
const line = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: DUR.reveal, ease: EASE.out },
  },
} as const;

/**
 * A spring, and a quarter turn. The diamond is a rotated square, so spinning
 * it in costs nothing visually — it lands on the same silhouette — but it
 * gives the mark a moment of its own rather than appearing fully formed.
 */
const mark = {
  hidden: { scale: 0, rotate: -90 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 300, damping: 18, delay: 0.12 },
  },
} as const;

/**
 * Section break: a green rule that fades out toward both page edges, broken in
 * the middle by a diamond.
 *
 * The fade is the point. A hairline running edge to edge reads as a table
 * border; one that resolves into nothing at the margins reads as ornament, and
 * lets the diamond be the thing the eye lands on.
 *
 * Decorative only — `aria-hidden`, and never the sole signal that one section
 * has ended and another begun. Which is also why the reduced-motion path can
 * simply render it finished: nothing is communicated by the drawing itself.
 */
export function DiamondRule({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const container = cn("flex items-center justify-center gap-5", className);

  if (prefersReduced) {
    return (
      <div aria-hidden className={container}>
        <span className={RULE_LINE} />
        <Mark />
        <span className={RULE_LINE} />
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden
      className={container}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <motion.span variants={line} style={{ originX: 1 }} className={RULE_LINE} />
      <motion.span variants={mark}>
        <Mark />
      </motion.span>
      <motion.span variants={line} style={{ originX: 0 }} className={RULE_LINE} />
    </motion.div>
  );
}

/** Outlined diamond with a solid core — a single filled square at this size
 *  reads as a stray dot on the line. */
function Mark() {
  return (
    <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
      <span className="border-brand-500/80 absolute inset-0 rotate-45 border" />
      <span className="bg-brand-500 h-1 w-1 rotate-45" />
    </span>
  );
}
