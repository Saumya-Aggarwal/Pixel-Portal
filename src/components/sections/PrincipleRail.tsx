"use client";

import { motion } from "motion/react";

import { LeaderLine } from "@/components/sections/service/visuals/chrome/Callout";
import { DUR, EASE, VIEWPORT } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The dashed connector behind a `PrincipleCards` row, drawn rather than shown.
 *
 * Split out as the one client component in that block. `PrincipleCards` and its
 * three panels stay server-rendered — only this hairline hydrates.
 *
 * It grows outward from the centre, which is deliberately the gesture the old
 * `DiamondRule` used before it was removed site-wide. That rule's one good idea
 * was that a seam reads better being drawn than being present, and there was no
 * reason to lose it along with the ornament.
 *
 * `scaleX` on the wrapper rather than a `strokeDashoffset` reveal on the line
 * itself, because the dash pattern is already spoken for: `LeaderLine` sets
 * `strokeDasharray` to make the dashes, so it cannot also use it to animate
 * them in. Scaling the box is free on the compositor and leaves the primitive
 * untouched.
 *
 * The dashes do stretch during the transition — a 4px dash is 0px at `scaleX: 0`
 * and 4px at rest. That reads as the rail extending, which is the intent, and
 * it lands on the correct pattern the moment it settles.
 */
export function PrincipleRail() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 left-1/2 hidden w-screen -translate-x-1/2 -translate-y-1/2 [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)] lg:block"
    >
      {/* An SVG with no `viewBox`, so one user unit is one CSS pixel and the
          dash pattern stays 4px however wide the screen is; under a viewBox it
          would stretch with the element. `x2` simply overruns any viewport, and
          SVG clips to its own box. */}
      {/* Two branches rather than `initial={false}`: `whileInView` has no such
          escape hatch — it is a target, not an optional starting pose — so a
          reader who asked for less motion gets the finished rail outright. */}
      {prefersReduced ? (
        <svg className="h-0.5 w-full" role="presentation">
          <LeaderLine x1={0} y1={1} x2={3000} y2={1} />
        </svg>
      ) : (
        <motion.svg
          className="h-0.5 w-full"
          role="presentation"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: DUR.reveal, ease: EASE.out }}
        >
          <LeaderLine x1={0} y1={1} x2={3000} y2={1} />
        </motion.svg>
      )}
    </div>
  );
}
