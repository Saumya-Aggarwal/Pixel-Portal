"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Soft pulsing radial glow — placeholder for the future 3D asset. */
export function GlowPulse() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <motion.div
        aria-hidden
        className="h-2/3 w-2/3 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(39,174,96,0.55) 0%, rgba(39,174,96,0.2) 45%, transparent 72%)",
          filter: "blur(48px)",
        }}
        animate={prefersReduced ? undefined : { opacity: [0.5, 0.9, 0.5], scale: [0.92, 1.06, 0.92] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
