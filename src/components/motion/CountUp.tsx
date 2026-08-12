"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { DUR, EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface CountUpProps {
  value: number;
  /**
   * Starting figure. Defaults to zero, which is right for a count of things.
   * A running total is more believable climbing from a plausible previous
   * value than from nothing.
   */
  from?: number;
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
  /** Decimal places to render. Needed for ratios like 4.23x. */
  decimals?: number;
  /**
   * Keep nudging the value after it settles, so the figure reads as a live
   * feed rather than a printed statistic. Only for numbers that genuinely
   * fluctuate — a headcount or a contract length must never drift.
   */
  live?: boolean;
  className?: string;
}

/** Bounded random walk around the settled value, as a fraction of it. */
const LIVE_VARIANCE = 0.02;
/** Base gap between nudges, in ms. Jittered so the pulse is not metronomic. */
const LIVE_INTERVAL = 2000;

/**
 * Number that counts up when it scrolls into view.
 *
 * The rendered element carries the final value in `aria-label` and marks the
 * ticking number `aria-hidden`, so assistive tech announces "68%" once instead
 * of narrating every intermediate frame. That holds for `live` too — the label
 * keeps the settled figure, so a drifting number never turns into a screen
 * reader announcing a new value every two seconds.
 *
 * Under reduced motion the final value renders immediately and never drifts —
 * the information is the number, not the animation.
 */
export function CountUp({
  value,
  from = 0,
  prefix = "",
  suffix = "",
  duration = DUR.slow,
  delay = 0,
  decimals = 0,
  live = false,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced = useReducedMotion();
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (prefersReduced || !inView) return;

    let liveTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleNudge = () => {
      liveTimer = setTimeout(
        () => {
          // Always relative to `value`, never to the previous nudge — walking
          // from the last displayed figure lets the number wander off over a
          // long session instead of hovering around the real one.
          const drift = (Math.random() * 2 - 1) * value * LIVE_VARIANCE;
          setCount(value + drift);
          scheduleNudge();
        },
        LIVE_INTERVAL + Math.random() * 1500,
      );
    };

    const controls = animate(from, value, {
      duration,
      delay,
      ease: EASE.out,
      onUpdate: setCount,
      onComplete: () => {
        if (live) scheduleNudge();
      },
    });

    return () => {
      controls.stop();
      clearTimeout(liveTimer);
    };
  }, [inView, value, from, duration, delay, decimals, live, prefersReduced]);

  // Derived rather than pushed into state by an effect: the reduced-motion
  // case is a pure function of the props, so there is nothing to synchronise.
  const display = prefersReduced ? value : count;

  const format = (n: number) =>
    `${prefix}${n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  return (
    <span ref={ref} className={className} aria-label={format(value)}>
      <span aria-hidden>{format(display)}</span>
    </span>
  );
}
