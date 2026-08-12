"use client";

import { useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useRef } from "react";

import { SPRING } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Rotates a surface a few degrees toward the cursor.
 *
 * Extracted from `LayerStack`, which had the only copy. The depictions all want
 * this and none of them should each grow their own pointer maths.
 *
 * The default is deliberately shallow. `LayerStack` can afford 16 degrees
 * because its layers carry a word each; a depiction containing a browser
 * window full of readable UI shears visibly past about four, and the picture
 * starts looking like a mistake rather than a perspective.
 *
 * Gated on a fine pointer for the same reason `Magnetic` and `LiftCard` are:
 * on a touch screen there is no hover state to leave, so the surface would
 * stick at whatever angle the last tap set and read as broken.
 */
export function usePointerTilt<T extends HTMLElement = HTMLDivElement>({
  max = 3,
  spring = SPRING.lift,
}: { max?: number; spring?: typeof SPRING.lift } = {}) {
  const ref = useRef<T>(null);
  const prefersReduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  // Inverted: the surface leans *toward* the pointer, not away from it.
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const rect = el.getBoundingClientRect();
      px.set((event.clientX - rect.left) / rect.width);
      py.set((event.clientY - rect.top) / rect.height);
    },
    [px, py],
  );

  const onPointerLeave = useCallback(() => {
    px.set(0.5);
    py.set(0.5);
  }, [px, py]);

  return {
    ref,
    rotateX,
    rotateY,
    /** Spread onto the element that owns the pointer area. */
    handlers: prefersReduced ? {} : { onPointerMove, onPointerLeave },
    /** Spread onto the element that should rotate. */
    style: prefersReduced ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" as const },
    prefersReduced,
  };
}
