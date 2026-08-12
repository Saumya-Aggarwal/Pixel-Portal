"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { SPRING } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const GLOW_SIZE = 480;

/**
 * Grid field that brightens near the cursor instead of sitting static.
 *
 * The layer is `pointer-events-none` (it must never steal clicks from the
 * real content stacked on top), which means it can't receive its own hover
 * events — so position tracking listens on `window` and derives "inside the
 * hero" by comparing cursor coordinates against the container's own rect,
 * rather than relying on enter/leave events the element can't get.
 *
 * Position updates bypass React state entirely: the spring's `on("change")`
 * subscription writes straight to a CSS custom property, so a full-speed
 * mousemove never triggers a re-render — only the rare inside/outside
 * transition does.
 */
export function SpotlightGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.lift);
  const springY = useSpring(y, SPRING.lift);
  const glowX = useTransform(springX, (v) => v - GLOW_SIZE / 2);
  const glowY = useTransform(springY, (v) => v - GLOW_SIZE / 2);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let wasInside = false;

    const handleMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const inside = localX >= 0 && localX <= rect.width && localY >= 0 && localY <= rect.height;

      x.set(localX);
      y.set(localY);

      if (inside !== wasInside) {
        wasInside = inside;
        setActive(inside);
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [prefersReduced, x, y]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const unsubX = springX.on("change", (v) => el.style.setProperty("--spot-x", `${v}px`));
    const unsubY = springY.on("change", (v) => el.style.setProperty("--spot-y", `${v}px`));
    return () => {
      unsubX();
      unsubY();
    };
  }, [springX, springY]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid-field absolute inset-0 opacity-40" />

      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: active ? 1 : 0,
          backgroundImage:
            "linear-gradient(to right, var(--color-brand-300) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-300) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          WebkitMaskImage:
            "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), black, transparent 70%)",
          maskImage:
            "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), black, transparent 70%)",
        }}
      />

      {!prefersReduced && (
        <motion.div
          className="bg-brand-400/25 absolute rounded-full blur-3xl transition-opacity duration-500 ease-out"
          style={{
            width: GLOW_SIZE,
            height: GLOW_SIZE,
            x: glowX,
            y: glowY,
            opacity: active ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}
