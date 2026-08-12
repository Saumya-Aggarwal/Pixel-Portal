"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/**
 * What the server — and, crucially, the client's *first* render — both see.
 *
 * There is no media query on the server, so any honest answer here is a guess.
 * `false` is the right guess because it is the majority case and because it
 * degrades safely: a reader who wants less motion sees the animated tree for
 * a single tick before it is replaced, which is a far smaller failure than
 * every other reader getting a broken hydrate.
 */
const getServerSnapshot = () => false;

/**
 * Reduced-motion preference that survives hydration.
 *
 * Motion's own `useReducedMotion` reads `matchMedia` during render and returns
 * `null` on the server. Every component here branches on it to decide *which
 * tree to render* — a `motion.div` or a plain `div`, a Spline canvas or a
 * static glow. So for a reader with the OS setting on, the server produced one
 * tree and the client's first render produced a different one, and React threw
 * the whole page out with "Hydration failed… this tree will be regenerated on
 * the client." Content that had already been measured by GSAP or handed to a
 * WebGL context came back in an inconsistent state.
 *
 * `useSyncExternalStore` is the mechanism React provides for exactly this: the
 * server snapshot is used through hydration, so both sides agree, and the real
 * value arrives on the tick after. Subscribing rather than sampling once also
 * means the page now responds when the setting is changed while it is open.
 *
 * Import this everywhere instead of `motion/react`'s version. The names match
 * so call sites read identically.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
