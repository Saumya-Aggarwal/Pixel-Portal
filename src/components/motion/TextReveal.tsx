"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { SplitText, gsap, useGSAP } from "@/lib/gsap";
import { DUR, GSAP_EASE, STAGGER } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface TextRevealProps {
  children: ReactNode;
  /** Rendered element. Use the real heading level — this is not a styling prop. */
  as?: ElementType;
  className?: string;
  /** Seconds to wait after the trigger fires. */
  delay?: number;
  /** Animate on mount instead of on scroll. Use for above-the-fold copy. */
  immediate?: boolean;
  stagger?: number;
}

/**
 * Line-by-line masked reveal — the signature entrance for headings.
 *
 * Three details do the heavy lifting:
 *
 * - `mask: "lines"` (GSAP 3.13+) wraps each line in its own overflow-hidden
 *   element, so lines slide out from behind a clean edge instead of fading.
 * - `autoSplit` re-splits when the web font loads or the box reflows. With
 *   clamp()-based fluid type the line breaks genuinely move as the viewport
 *   changes, and a one-shot split would strand the masks mid-word.
 * - The tween is returned from `onSplit`, which lets GSAP revert and replay it
 *   cleanly across those re-splits rather than stacking duplicate tweens.
 *
 * `gsap.from` is deliberate: the resting state is the natural, visible one, so
 * a tween that never runs leaves readable text rather than an invisible block.
 * `useGSAP` runs in a layout effect, so the initial state is applied before
 * paint and there is no flash of unstyled text.
 */
export function TextReveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  immediate = false,
  stagger = STAGGER.base,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced || !ref.current) return;

      const split = SplitText.create(ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 115,
            opacity: 0,
            duration: DUR.reveal,
            ease: GSAP_EASE.out,
            stagger,
            delay,
            scrollTrigger: immediate
              ? undefined
              : { trigger: ref.current, start: "top 88%", once: true },
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [prefersReduced, immediate, delay, stagger] },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
