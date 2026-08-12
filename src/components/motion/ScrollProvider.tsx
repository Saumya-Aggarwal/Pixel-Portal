"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, type ReactNode } from "react";

import { ScrollTrigger, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Smooth scroll, mounted once in the root layout.
 *
 * The important part is the handoff: Lenis is driven by GSAP's ticker rather
 * than its own requestAnimationFrame loop, and ScrollTrigger updates from
 * Lenis's scroll event. Left unsynced, ScrollTrigger reads the native scroll
 * position while Lenis animates a virtual one, and every pinned or
 * scroll-driven animation lands a frame behind the content.
 *
 * It also publishes scroll velocity as `--scroll-velocity` on the root
 * element, so effects can react to how fast the page is moving without any of
 * them owning a scroll listener. See VELOCITY_CEILING below.
 *
 * With reduced motion requested, Lenis never initialises and the browser's own
 * scrolling is left alone — smooth scroll is itself motion the user declined.
 * The velocity variable is never written in that case, and its `:root` default
 * of 0 means every consumer reads "still" rather than undefined.
 */

/**
 * Velocity, in px/frame, that maps to `--scroll-velocity: 1`.
 *
 * Lenis reports raw px/frame, which is unbounded and useless as a direct
 * animation input. Normalising against a ceiling gives consumers a predictable
 * 0..1 they can multiply into an opacity, a blur radius, or a skew — and the
 * clamp means a trackpad fling cannot push an effect past its design limit.
 */
const VELOCITY_CEILING = 40;

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

    // One listener for both jobs. Writing the variable straight to the style
    // attribute keeps this out of React entirely — a value that changes every
    // frame must never become state.
    const root = document.documentElement;
    const onScroll = ({ velocity }: { velocity: number }) => {
      ScrollTrigger.update();
      const normalised = Math.min(Math.abs(velocity) / VELOCITY_CEILING, 1);
      root.style.setProperty("--scroll-velocity", normalised.toFixed(3));
    };
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Lag smoothing lets GSAP skip time after a long frame, which desyncs the
    // virtual scroll position from the rendered one.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      root.style.removeProperty("--scroll-velocity");
      lenis.destroy();
    };
  }, [prefersReduced]);

  return <>{children}</>;
}
