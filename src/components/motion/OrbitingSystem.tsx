"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

const RINGS = [
  { radius: 54, duration: 14, direction: 1, dashed: false, color: "var(--color-brand-400)" },
  { radius: 88, duration: 21, direction: -1, dashed: true, color: "var(--color-ink-soft)" },
  { radius: 124, duration: 28, direction: 1, dashed: false, color: "var(--color-brand-300)" },
] as const;

/**
 * Abstract orbital network standing in for "the systems we build" — three
 * rings, each carrying one node, rotating at different speeds and directions
 * around a shared nucleus. Hovering speeds the whole system up and expands
 * it slightly, so it reads as reactive rather than decorative.
 *
 * Rotation is applied to a `<motion.g>` with an explicit pixel
 * `transformOrigin`. SVG child elements use `transform-box: view-box` by
 * default, so a `"150px 150px"` origin resolves against the `viewBox`
 * coordinate system — the ring's true center — rather than each ring's own
 * (off-center) bounding box, which is what `originX/Y` fractions would give.
 */
export function OrbitingSystem({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const speed = hovered ? 0.45 : 1;

  return (
    <div
      className={cn("select-none", className)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <motion.svg
        viewBox="0 0 300 300"
        className="h-full w-full overflow-visible"
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: EASE.out }}
      >
        <circle cx="150" cy="150" r="30" fill="var(--color-brand-400)" opacity="0.16" />

        {RINGS.map((ring, index) => (
          <g key={index}>
            <circle
              cx="150"
              cy="150"
              r={ring.radius}
              fill="none"
              stroke={ring.color}
              strokeWidth="1"
              strokeOpacity="0.35"
              strokeDasharray={ring.dashed ? "3 7" : undefined}
            />
            <motion.g
              style={{ transformOrigin: "150px 150px" }}
              animate={prefersReduced ? undefined : { rotate: 360 * ring.direction }}
              transition={
                prefersReduced
                  ? undefined
                  : {
                      duration: ring.duration * speed,
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
            >
              <circle cx={150 + ring.radius} cy="150" r="5" fill={ring.color} />
              <circle
                cx={150 + ring.radius}
                cy="150"
                r="10"
                fill={ring.color}
                opacity="0.18"
              />
            </motion.g>
          </g>
        ))}

        <circle cx="150" cy="150" r="10" fill="var(--color-brand-700)" />
        <circle cx="150" cy="150" r="4" fill="white" />
      </motion.svg>
    </div>
  );
}
