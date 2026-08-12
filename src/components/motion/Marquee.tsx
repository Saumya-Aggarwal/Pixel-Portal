"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full cycle. Higher is slower. */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
}

/**
 * Seamless infinite ticker.
 *
 * The track holds two identical copies of the content and animates by exactly
 * -50%, so the second copy sits where the first began at the moment the tween
 * loops. That makes the seam mathematically invisible regardless of content
 * width — no measuring, no resize handling.
 *
 * The duplicate is aria-hidden: it is the same text twice, and a screen reader
 * should not read the client list through a second time.
 */
export function Marquee({
  children,
  className,
  speed = 32,
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const hovered = useRef(false);
  const onScreen = useRef(true);

  /** The tween runs only when the ticker is both visible and un-hovered. */
  const sync = () => {
    if (onScreen.current && !hovered.current) tween.current?.play();
    else tween.current?.pause();
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const t = gsap.to(track.current, {
          xPercent: reverse ? 50 : -50,
          duration: speed,
          ease: "none",
          repeat: -1,
        });
        tween.current = t;

        // An infinite tween keeps requesting frames forever, including while
        // the ticker sits far above the viewport. On a long page that is a
        // permanent tax on every other animation's frame budget, so the tween
        // is parked whenever it cannot be seen.
        const trigger = ScrollTrigger.create({
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) => {
            onScreen.current = isActive;
            sync();
          },
        });

        onScreen.current = trigger.isActive;
        sync();

        return () => {
          trigger.kill();
          t.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: container, dependencies: [speed, reverse] },
  );

  return (
    <div
      ref={container}
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={
        pauseOnHover
          ? () => {
              hovered.current = true;
              sync();
            }
          : undefined
      }
      onMouseLeave={
        pauseOnHover
          ? () => {
              hovered.current = false;
              sync();
            }
          : undefined
      }
    >
      <div
        ref={track}
        className="flex w-max will-change-transform"
        style={{ transform: reverse ? "translateX(-50%)" : undefined }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
