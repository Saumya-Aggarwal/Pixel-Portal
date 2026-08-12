"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";

import { ScrollTrigger, gsap } from "@/lib/gsap";

/**
 * Smooth scroll, mounted once in the root layout.
 *
 * The important part is the handoff: Lenis is driven by GSAP's ticker rather
 * than its own requestAnimationFrame loop, and ScrollTrigger updates from
 * Lenis's scroll event. Left unsynced, ScrollTrigger reads the native scroll
 * position while Lenis animates a virtual one, and every pinned or
 * scroll-driven animation lands a frame behind the content.
 *
 * With reduced motion requested, Lenis never initialises and the browser's own
 * scrolling is left alone — smooth scroll is itself motion the user declined.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices already have momentum scrolling; hijacking it costs
      // performance and feels wrong under a thumb.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Lag smoothing lets GSAP skip time after a long frame, which desyncs the
    // virtual scroll position from the rendered one.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [prefersReduced]);

  return <>{children}</>;
}
