"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useCallback, useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { SPRING } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface LiftCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees at the card's corners. */
  tilt?: number;
  /** Vertical lift in px on hover. */
  lift?: number;
  /** Green glow that tracks the cursor across the surface. */
  spotlight?: boolean;
  /** Band of light that crosses the face once per hover. */
  sweep?: boolean;
}

/**
 * Card that lifts and tilts toward the cursor, with an optional spotlight
 * that follows it across the surface.
 *
 * Tilt is capped low on purpose. Past about 8deg the text on the face starts
 * to shear visibly and the card reads as a gimmick rather than a surface.
 *
 * Like Magnetic, this is gated on an actual cursor being present, and the
 * pointer-driven parts degrade to a plain container under reduced motion.
 *
 * The wrapper is tagged `group/lift` in both branches, so consumers drive
 * their own hover response — border colour, icon rotation, a rising wash —
 * with `group-hover/lift:` utilities rather than this component growing a prop
 * per effect. Keeping the tag on the reduced-motion branch matters: a border
 * that answers the pointer is an affordance, not an animation, and should
 * survive the preference.
 */
export function LiftCard({
  children,
  className,
  tilt = 6,
  lift = 8,
  spotlight = true,
  sweep = false,
}: LiftCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const rotateX = useSpring(useMotionValue(0), SPRING.lift);
  const rotateY = useSpring(useMotionValue(0), SPRING.lift);
  const translateY = useSpring(useMotionValue(0), SPRING.lift);

  // Spotlight position as a percentage of the card, driven straight from the
  // pointer with no spring — a lagging highlight looks like a rendering bug.
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowOpacity = useSpring(useMotionValue(0), SPRING.lift);
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgb(39 174 96 / 0.14), transparent 60%)`;

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      // Centre-origin, -0.5..0.5. Y drives rotateX inverted so the card leans
      // toward the cursor rather than away from it.
      rotateY.set((px - 0.5) * tilt * 2);
      rotateX.set(-(py - 0.5) * tilt * 2);
      translateY.set(-lift);
      glowX.set(px * 100);
      glowY.set(py * 100);
      glowOpacity.set(1);
    },
    [tilt, lift, rotateX, rotateY, translateY, glowX, glowY, glowOpacity],
  );

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    translateY.set(0);
    glowOpacity.set(0);
  }, [rotateX, rotateY, translateY, glowOpacity]);

  if (prefersReduced) {
    return <div className={cn("group/lift relative", className)}>{children}</div>;
  }

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, y: translateY, transformStyle: "preserve-3d" }}
        className={cn("group/lift relative h-full", className)}
      >
        {children}
        {spotlight && (
          <motion.span
            aria-hidden
            style={{ backgroundImage: glow, opacity: glowOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
          />
        )}
        {sweep && (
          // Clipped to the card so the band appears to pass beneath the edge
          // rather than flying across the page. The inner span carries the
          // animation; the outer one only masks.
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
          >
            <span className="via-brand-200/70 absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent to-transparent opacity-0 group-hover/lift:animate-[card-sweep_1.15s_var(--ease-soft)]" />
          </span>
        )}
      </motion.div>
    </div>
  );
}
