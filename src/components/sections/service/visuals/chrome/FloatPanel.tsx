"use client";

import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

import {
  useAmbientFloat,
  type AmbientFloat,
} from "@/components/sections/service/visuals/useAmbientFloat";
import { cn } from "@/lib/cn";

/**
 * The unit every illustration is assembled from.
 *
 * A white surface with a hairline border, the two-layer float shadow, and an
 * optional ambient bob. Supersedes `PanelChrome`, which used the `glass`
 * utility — backdrop-blur over a white page buys nothing visually and costs a
 * compositing layer per panel, which adds up fast at eight panels a picture.
 *
 * `focal` marks the one primary element per illustration. It gets a slightly
 * deeper shadow so the hierarchy survives even when the reader is not looking
 * directly at it, and it is the panel that responds to hover.
 *
 * Hover behaviour is deliberately *not* a parallax tilt. A tilt on a frame
 * containing 10px UI text shears it, and it moves structure that is supposed to
 * stay anchored. Elevating the focal panel instead answers the pointer without
 * disturbing the composition.
 */
export function FloatPanel({
  children,
  className,
  style,
  playing,
  float,
  focal = false,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  /** Blueprint geometry — position and size are per-illustration, not systemic. */
  style?: CSSProperties;
  /** From `useVisualPlayback`. False locks the panel at rest. */
  playing: boolean;
  /** Omit for a panel that should never bob. */
  float?: AmbientFloat;
  focal?: boolean;
  /** Adds the hover elevation. Reserve for the focal panel. */
  interactive?: boolean;
}) {
  const bob = useAmbientFloat({ ...float, playing: playing && float !== undefined });

  return (
    <motion.div
      className={cn(
        "border-hair rounded-card border bg-white",
        interactive && "ease-out-expo transition-shadow duration-500",
        className,
      )}
      style={{
        boxShadow: focal ? "var(--shadow-float-hover)" : "var(--shadow-float)",
        // Promote any floating panel to its own compositor layer.
        //
        // Without this the bob is smooth in isolation and visibly jittery once
        // several large panels overlap: each frame the browser repaints the
        // union of their 48px-blur shadows, and that area grows with every
        // panel added. On its own layer the movement is a composite step and
        // the shadow is rasterised once.
        willChange: float ? "transform" : undefined,
        ...style,
      }}
      animate={bob.animate}
      transition={bob.transition}
      whileHover={interactive ? { scale: 1.02 } : undefined}
    >
      {children}
    </motion.div>
  );
}
