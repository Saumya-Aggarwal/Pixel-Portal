"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { DUR, EASE } from "@/lib/motion";

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  /**
   * Seconds to hold at zero after coming into view. For a number that is in
   * view before it is *visible* — one waiting out an entrance animation, or
   * the hero's boot sequence — without this the count runs to completion
   * behind an opacity of 0 and the reader only ever sees the final value.
   */
  delay?: number;
  className?: string;
}

/**
 * Number that counts up when it scrolls into view.
 *
 * The rendered element carries the final value in `aria-label` and marks the
 * ticking number `aria-hidden`, so assistive tech announces "68%" once instead
 * of narrating every intermediate frame.
 *
 * Under reduced motion the final value renders immediately — the information
 * is the number, not the animation.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = DUR.slow,
  delay = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (prefersReduced || !inView) return;

    const controls = animate(0, value, {
      duration,
      delay,
      ease: EASE.out,
      onUpdate: (latest) => setCount(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, value, duration, delay, prefersReduced]);

  // Derived rather than pushed into state by an effect: the reduced-motion
  // case is a pure function of the props, so there is nothing to synchronise.
  const display = prefersReduced ? value : count;

  const formatted = `${prefix}${display.toLocaleString("en-US")}${suffix}`;
  const final = `${prefix}${value.toLocaleString("en-US")}${suffix}`;

  return (
    <span ref={ref} className={className} aria-label={final}>
      <span aria-hidden>{formatted}</span>
    </span>
  );
}
