"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

import { LiftCard } from "@/components/motion/LiftCard";
import { EASE } from "@/lib/motion";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Idle bob amplitude in px once settled. */
  float?: number;
  /** Seconds per idle bob cycle. */
  floatDuration?: number;
  tilt?: number;
  lift?: number;
}

/**
 * Entrance (a gentle 3D drop) plus a continuous idle bob, wrapping `LiftCard`
 * for the pointer-tilt-on-hover layer.
 *
 * The drop and the bob both animate the same `y`/`rotate*` values but are two
 * separate concerns, so they're two separate elements: this outer
 * `motion.div` owns the settle-then-loop timeline, `LiftCard` owns the
 * cursor-reactive tilt on its own inner node. Nested transforms compose for
 * free — neither has to know the other exists.
 */
export function FloatingCard({
  children,
  className,
  delay = 0,
  float = 6,
  floatDuration = 4,
  tilt = 5,
  lift = 6,
}: FloatingCardProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Not `once` — the bob needs to stop again on the way back out.
  const inView = useInView(ref, { amount: 0 });

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateX: -10, rotateY: 8 }}
      animate={{
        opacity: 1,
        // The idle bob is an infinite tween on the hero, which a visitor
        // leaves behind within one scroll. Gating it on visibility hands the
        // frame budget to whichever section is actually on screen.
        y: inView ? [0, -float, 0, float, 0] : 0,
        rotateX: 0,
        rotateY: 0,
      }}
      transition={{
        opacity: { duration: 0.8, delay, ease: EASE.out },
        rotateX: { duration: 0.9, delay, ease: EASE.out },
        rotateY: { duration: 0.9, delay, ease: EASE.out },
        y: {
          delay: delay + 0.9,
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      style={{ transformPerspective: 1200 }}
    >
      <LiftCard tilt={tilt} lift={lift} className={className}>
        {children}
      </LiftCard>
    </motion.div>
  );
}
