"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

/**
 * Fades a decorative backdrop layer up on mount instead of having it arrive
 * fully painted with the markup.
 *
 * The home hero does this by hand for its grid field, and the effect is most
 * of why that page feels composed rather than merely loaded — the ground
 * settles before anything is asked to stand on it. This is that behaviour
 * extracted so the interior page heroes get it too, without each of them
 * becoming a Client Component for the sake of one animated div.
 *
 * `opacity` is the only thing that animates. These layers sit behind content
 * that may contain `position: fixed` descendants, and a transform here would
 * quietly become their containing block.
 */
export function BackdropIn({
  className,
  /** Resting opacity — the layer's designed value, not necessarily 1. */
  to = 1,
  delay = 0,
  duration = 0.9,
}: {
  className?: string;
  to?: number;
  delay?: number;
  duration?: number;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div aria-hidden className={cn(className)} style={{ opacity: to }} />;
  }

  return (
    <motion.div
      aria-hidden
      className={cn(className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: to }}
      transition={{ duration, delay, ease: EASE.out }}
    />
  );
}
