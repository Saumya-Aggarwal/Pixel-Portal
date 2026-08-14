"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { GlowPulse } from "@/components/motion/GlowPulse";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The Spline runtime is ~1MB of WebGL and touches `window` on import, so it is
 * loaded client-side only and kept out of the initial bundle. `next/dynamic`
 * with `ssr: false` is legal here (and only here) because this module is a
 * Client Component — the same call from a Server Component is a build error.
 */
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <GlowPulse />,
});

interface SplineSceneProps {
  /** Published `.splinecode` URL. */
  scene: string;
  /**
   * What the scene depicts. The canvas is decorative but not empty to a
   * screen reader, so the wrapper claims it as a single labelled image
   * instead of leaving an unnamed <canvas> in the tree.
   */
  label: string;
  className?: string;
  /**
   * Applied to the div that directly wraps `<Spline />`, and nothing else.
   *
   * This is where colour filters belong. Put a `hue-rotate` on the outer
   * element instead and it also rotates the loading glow, which is already
   * brand green and would come out lime.
   */
  canvasClassName?: string;
  /**
   * Fires once the scene has finished streaming and the first frame is on the
   * canvas — or immediately, under reduced motion, where the runtime is never
   * fetched at all and there is nothing to wait for.
   *
   * Exists so the boot sequence can hold its counter against the genuinely
   * slowest thing on the page instead of a made-up timer. A caller that does
   * not pass it pays nothing.
   */
  onReady?: () => void;
}

/**
 * A Spline scene with the two things the bare component does not give you:
 * a fallback for the seconds before the scene streams in, and an exit hatch
 * for people who asked for less motion.
 *
 * Under `prefers-reduced-motion` the runtime is never fetched at all. A
 * perpetually orbiting 3D object is exactly the kind of thing that setting is
 * for, and skipping it also saves the payload — the fallback glow is the same
 * one the panel shows while loading, so the layout is identical either way.
 *
 * That still holds now that `useReducedMotion` reports `false` through
 * hydration, though it is no longer obvious that it does. The hook is backed by
 * `useSyncExternalStore`, so React reconciles the real value synchronously
 * after hydrating and before the browser paints — the `<Spline>` element from
 * that first pass never commits, and `next/dynamic` never triggers its import.
 * Verified: zero requests to prod.spline.design with the setting on.
 */
export function SplineScene({
  scene,
  label,
  className,
  canvasClassName,
  onReady,
}: SplineSceneProps) {
  const prefersReduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  // Announced from an effect rather than from the early return below, because
  // that return is render and this is a side effect on a caller's state.
  // Callers pass a stable callback, so this settles after one run.
  useEffect(() => {
    if (prefersReduced) onReady?.();
  }, [prefersReduced, onReady]);

  if (prefersReduced) {
    return (
      <div role="img" aria-label={label} className={cn("h-full w-full", className)}>
        <GlowPulse />
      </div>
    );
  }

  return (
    <div role="img" aria-label={label} className={cn("relative h-full w-full", className)}>
      {/* Cross-fade rather than a swap: the glow holds the panel's visual
          weight until the scene can take it over, so the card never flashes
          empty white mid-load. */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 0.7, ease: EASE.out }}
      >
        <GlowPulse />
      </motion.div>

      <motion.div
        className={cn("h-full w-full", canvasClassName)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.9, ease: EASE.out }}
      >
        <Spline
          scene={scene}
          onLoad={() => {
            setLoaded(true);
            onReady?.();
          }}
        />
      </motion.div>
    </div>
  );
}
