"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useCallback, useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { SPRING } from "@/lib/motion";

interface LiftCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees at the card's corners. */
  tilt?: number;
  /** Vertical lift in px on hover. */
  lift?: number;
  /** Green glow that tracks the cursor across the surface. */
  spotlight?: boolean;
}

/**
 * Card that lifts and tilts toward the cursor, with an optional spotlight
 * that follows it across the surface.
 *
 * Tilt is capped low on purpose. Past about 8deg the text on the face starts
 * to shear visibly and the card reads as a gimmick rather than a surface.
 *
 * Like Magnetic, this is gated on an actual cursor being present, and it
 * degrades to a plain container under reduced motion.
 */
export function LiftCard({
  children,
  className,
  tilt = 6,
  lift = 8,
  spotlight = true,
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
    return <div className={cn("relative", className)}>{children}</div>;
  }

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, y: translateY, transformStyle: "preserve-3d" }}
        className={cn("relative h-full", className)}
      >
        {children}
        {spotlight && (
          <motion.span
            aria-hidden
            style={{ backgroundImage: glow, opacity: glowOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
          />
        )}
      </motion.div>
    </div>
  );
}
