"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { DUR, EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The whole-page entrance, mounted once per navigation by `app/template.tsx`.
 *
 * Next gives a template a fresh key per route, so this remounts on every
 * navigation and its `initial` runs again — that is the entire mechanism.
 * No `AnimatePresence`: the App Router swaps the tree before an exit could
 * play, so an outgoing animation here would either never be seen or, worse,
 * hold the old page on screen while the new one is already interactive.
 *
 * **Opacity only, and that is not a style choice.** A `transform` on a wrapper
 * this high in the tree makes it the containing block for every
 * `position: fixed` descendant beneath it. The home hero's boot sequence pins
 * its logo and its 3D core with `fixed inset-0 m-auto` to centre them in the
 * *viewport*; under a transformed ancestor they would centre in this
 * wrapper's box instead — the full scroll height of the page — and drop the
 * opening frame far below the fold until the transform cleared. `opacity`
 * creates a stacking context but never a containing block, so it is the one
 * property that can animate here safely.
 *
 * The rise that would normally accompany a fade lives one level down, in
 * `PageHero`, which is an ancestor of nothing fixed and can move freely.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DUR.base, ease: EASE.out }}
    >
      {children}
    </motion.div>
  );
}
