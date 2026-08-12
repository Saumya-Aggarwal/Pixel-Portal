"use client";

import { motion } from "motion/react";

import { usePointerTilt } from "@/components/sections/service/visuals/usePointerTilt";

/**
 * An architecture, seen at an angle.
 *
 * Planes stacked in 3D and rotated toward the cursor. Each layer sits further
 * back on the Z axis than the one below it, so the parallax is real depth
 * rather than layers sliding at different speeds — move the pointer and the
 * stack rotates as one solid object.
 *
 * Tilts further than the depictions do (16 degrees against their 3) because
 * each plane carries a couple of words rather than a screenful of UI, and
 * there is nothing here fine enough to shear.
 */
export function LayerStack({ layers }: { layers: string[] }) {
  const { ref, style, handlers, prefersReduced } = usePointerTilt<HTMLDivElement>({ max: 16 });

  const count = layers.length;

  const plates = layers.map((layer, i) => {
    // Bottom layer is the base of the system, so the array is drawn in
    // reverse: index 0 sits highest and nearest the viewer.
    const depth = count - 1 - i;
    return (
      <div
        key={layer}
        className="border-hair rounded-card absolute inset-x-0 border bg-white/90 px-5 py-3.5 shadow-(--shadow-lift) backdrop-blur-sm"
        style={{
          top: `${i * 46}px`,
          transform: `translateZ(${depth * 26}px)`,
          zIndex: depth,
        }}
      >
        <span className="flex items-center justify-between gap-4">
          <span className="text-ink text-[0.9375rem] leading-none font-medium">{layer}</span>
          <span
            aria-hidden
            className="font-display text-hair text-[0.75rem] leading-none font-semibold tabular-nums"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        </span>
      </div>
    );
  });

  if (prefersReduced) {
    return (
      <div className="flex h-full items-center justify-center px-6 py-10">
        <div className="relative w-full max-w-md" style={{ height: `${count * 46 + 30}px` }}>
          {plates}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      {...handlers}
      className="flex h-full items-center justify-center px-6 py-10"
      style={{ perspective: 1100 }}
    >
      <motion.div
        className="relative w-full max-w-md"
        style={{ height: `${count * 46 + 30}px`, ...style }}
      >
        {plates}
      </motion.div>
    </div>
  );
}
