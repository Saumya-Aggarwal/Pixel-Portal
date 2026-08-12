"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useCallback, useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { SPRING } from "@/lib/motion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Fraction of the cursor offset the element travels. Above ~0.5 feels loose. */
  strength?: number;
  /** Extra hit area around the element, in px, where the pull begins. */
  padding?: number;
}

/**
 * Magnetic pull toward the cursor (SOW §1, "magnetic buttons").
 *
 * Wraps arbitrary children so magnetism stays independent of styling — pair it
 * with any button or link rather than baking motion into a Button component.
 *
 * Guarded on `(hover: hover) and (pointer: fine)` rather than a width
 * breakpoint: the real requirement is a cursor to be magnetic toward. That
 * correctly excludes touch laptops and large tablets, which a min-width query
 * would wrongly opt in.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
  padding = 16,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.magnetic);
  const springY = useSpring(y, SPRING.magnetic);

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const rect = el.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      x.set(relX * strength);
      y.set(relY * strength);
    },
    [strength, x, y],
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (prefersReduced) {
    return <div className={cn("inline-flex", className)}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn("inline-flex", className)}
      style={{ padding }}
    >
      <motion.div style={{ x: springX, y: springY }} className="inline-flex">
        {children}
      </motion.div>
    </div>
  );
}
