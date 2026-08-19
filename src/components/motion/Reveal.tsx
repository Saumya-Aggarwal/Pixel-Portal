"use client";

import { motion } from "motion/react";
import { useCallback, useRef, type ReactNode } from "react";

import { BLUR, DUR, EASE, VIEWPORT, VIEWPORT_GROUP } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Clears the entrance filter once the tween lands.
 *
 * Motion animates `filter` to `blur(0px)` and leaves it there. A zero-radius
 * blur is still a filter: the element keeps its compositing layer, and — the
 * part that actually bites — it keeps acting as a containing block for any
 * `position: fixed` descendant. Setting `none` on completion gives both back.
 */
function useFilterCleanup() {
  const ref = useRef<HTMLDivElement>(null);
  const clear = useCallback(() => {
    if (ref.current) ref.current.style.filter = "none";
  }, []);
  return { ref, clear };
}

/** Entrance filter pair, or nothing at all when blur is off. */
function blurFrames(blur: number) {
  if (blur <= 0) return { from: {}, to: {} };
  return { from: { filter: `blur(${blur}px)` }, to: { filter: "blur(0px)" } };
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Travel distance in px. Kept small by default — long travel reads cheap. */
  y?: number;
  duration?: number;
  /**
   * Entrance blur radius in px. Pass `0` inside any subtree that contains a
   * `position: fixed` element — `filter` would become its containing block.
   */
  blur?: number;
}

/**
 * Generic scroll-in fade and rise, for everything that is not a heading.
 * Fires once; content that has entered stays put on scroll-back.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  duration = DUR.base,
  blur = BLUR.base,
}: RevealProps) {
  const prefersReduced = useReducedMotion();
  const { ref, clear } = useFilterCleanup();
  const frames = blurFrames(blur);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, ...frames.from }}
      whileInView={{ opacity: 1, y: 0, ...frames.to }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE.out }}
      onAnimationComplete={clear}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggering wrapper. Pair with `RevealItem` children — the parent owns the
 * viewport trigger so a whole group animates from one scroll position instead
 * of each child racing its own.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_GROUP}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 28,
  blur = BLUR.base,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  blur?: number;
}) {
  const prefersReduced = useReducedMotion();
  const { ref, clear } = useFilterCleanup();
  const frames = blurFrames(blur);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: { opacity: 0, y, ...frames.from },
        visible: {
          opacity: 1,
          y: 0,
          ...frames.to,
          transition: { duration: DUR.base, ease: EASE.out },
        },
      }}
      onAnimationComplete={clear}
    >
      {children}
    </motion.div>
  );
}
