"use client";

import { useRef } from "react";

import { Frame } from "@/components/media/Frame";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { DESKTOP_QUERY } from "@/lib/motion";

interface ParallaxImageProps {
  alt: string;
  src?: string;
  seed?: string;
  label?: string;
  aspect?: string;
  className?: string;
  /** Travel as a percentage of image height. Negative moves against the scroll. */
  strength?: number;
  sizes?: string;
  priority?: boolean;
}

/**
 * Image that drifts against the scroll inside a fixed frame.
 *
 * The inner element is scaled beyond the frame so vertical travel never
 * exposes an edge — the overscan has to exceed the total travel or the
 * effect shows its seams at the extremes of the scroll range.
 *
 * `gsap.matchMedia` is doing real work here: below 768px the tween is never
 * created at all, rather than created and left idle. Parallax is the most
 * expensive effect on the page and phones are where the SOW's "without
 * performance loss" requirement actually bites. matchMedia also reverts
 * everything automatically when the query stops matching, so a desktop
 * browser resized down to mobile genuinely tears the effect down.
 */
export function ParallaxImage({
  alt,
  src,
  seed,
  label,
  aspect = "aspect-[4/5]",
  className,
  strength = 12,
  sizes,
  priority,
}: ParallaxImageProps) {
  const container = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const overscan = 1 + (Math.abs(strength) * 2) / 100;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: DESKTOP_QUERY, reduced: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const { isDesktop, reduced } = context.conditions as {
            isDesktop: boolean;
            reduced: boolean;
          };
          if (!isDesktop || reduced) return;

          gsap.fromTo(
            inner.current,
            { yPercent: -strength },
            {
              yPercent: strength,
              ease: "none",
              scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: container },
  );

  return (
    <div ref={container} className={cn("relative overflow-hidden", aspect, className)}>
      <div
        ref={inner}
        className="absolute inset-0"
        style={{ scale: overscan, transformOrigin: "center" }}
      >
        <Frame
          aspect="h-full w-full"
          alt={alt}
          src={src}
          seed={seed}
          label={label}
          sizes={sizes}
          priority={priority}
        />
      </div>
    </div>
  );
}
