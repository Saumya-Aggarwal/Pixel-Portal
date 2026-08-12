"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { DUR, EASE, VIEWPORT } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Travel distance in px. Kept small by default — long travel reads cheap. */
  y?: number;
  duration?: number;
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
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE.out }}
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
      viewport={VIEWPORT}
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
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE.out } },
      }}
    >
      {children}
    </motion.div>
  );
}
