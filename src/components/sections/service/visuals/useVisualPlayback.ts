"use client";

import { useInView } from "motion/react";
import { useRef } from "react";

import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Playback gate for the hero depictions.
 *
 * Every depiction is an infinite loop, and an infinite loop keeps requesting
 * frames whether or not anyone can see it. On a page this long that is a
 * permanent tax on the frame budget of every other animation — the same
 * reasoning that parks the ticker in `Marquee`, applied to Motion-owned loops.
 *
 * Motion's `useInView` rather than GSAP's ScrollTrigger: these are `animate`
 * props on motion elements, not tweens on a timeline, so keeping them inside
 * Motion's own lifecycle avoids running two scroll systems against one element.
 *
 * `playing` folds the reduced-motion check in as well, so a depiction has one
 * boolean to branch on instead of two. When it is false the caller must still
 * render a *populated* frame — a settled feed, a drawn chart, a filled cart.
 * An empty box is not a graceful degradation, it is a missing illustration.
 *
 * Reduced motion comes from the local hook, never `motion/react`'s: that one
 * returns `null` on the server and desynchronises the first client render,
 * which is precisely the hydration failure `@/lib/useReducedMotion` exists to
 * prevent.
 */
export function useVisualPlayback<T extends Element = HTMLDivElement>() {
  const ref = useRef<T>(null);
  // `once: false` — unlike a reveal, this needs to know when the element
  // *leaves* so the loop can be parked again.
  const inView = useInView(ref, { amount: 0.2 });
  const prefersReduced = useReducedMotion();

  return { ref, playing: inView && !prefersReduced, prefersReduced };
}
