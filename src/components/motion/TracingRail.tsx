"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

export interface TracingRailStep {
  title: string;
  description?: string;
}

/**
 * Vertical process timeline whose spine draws itself as the reader scrolls.
 *
 * The rail is scrubbed rather than triggered: its fill is tied directly to
 * scroll position, so scrolling back up un-draws it. That coupling is the
 * whole point — a rail that plays once on entry is just a decorated list,
 * while one that tracks the scrollbar tells the reader where they are in the
 * process.
 *
 * Reduced motion is handled the way GSAP-owned tweens are handled everywhere
 * in this codebase — `gsap.matchMedia` rather than the `useReducedMotion`
 * hook. The markup renders in its *finished* state (rail at full height, every
 * node lit) and the tweens dim it on the way in, so a visitor whose tweens
 * never run gets a complete, readable timeline rather than an empty column.
 */
export function TracingRail({
  steps,
  className,
}: {
  steps: TracingRailStep[];
  className?: string;
}) {
  const container = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The markup ships lit. Stripping the class here — inside useGSAP's
        // layout effect, before first paint — is what makes the finished state
        // the *default* rather than something JS has to arrive to produce.
        const nodes = gsap.utils.toArray<HTMLElement>("[data-rail-node]", container.current);
        nodes.forEach((node) => node.classList.remove("is-lit"));

        const railTween = gsap.fromTo(
          fill.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              // Begins once the list is meaningfully on screen and completes a
              // little before its end, so the last node lights while it is
              // still comfortably in view rather than at the very bottom edge.
              start: "top 72%",
              end: "bottom 62%",
              scrub: 0.4,
            },
          },
        );

        const nodeTriggers = nodes.map((node) =>
          ScrollTrigger.create({
            trigger: node,
            start: "top 68%",
            // Class toggle rather than a tween: the transition lives in CSS
            // next to the colours it moves, and scrubbing back up un-lights
            // the node in step with the rail retreating past it.
            onEnter: () => node.classList.add("is-lit"),
            onLeaveBack: () => node.classList.remove("is-lit"),
          }),
        );

        return () => {
          railTween.scrollTrigger?.kill();
          railTween.kill();
          nodeTriggers.forEach((t) => t.kill());
        };
      });

      return () => mm.revert();
    },
    { scope: container, dependencies: [steps.length] },
  );

  return (
    <ol ref={container} className={cn("relative", className)}>
      {/* Rail track. Sits under the node centres: 28px in on mobile (half of
          the 56px node column), dead centre from lg up where the layout
          alternates around it. */}
      <span
        aria-hidden
        className="bg-hair absolute inset-y-0 left-6.75 w-px lg:left-1/2 lg:-translate-x-1/2"
      >
        <span
          ref={fill}
          className="rail-origin-top from-brand-300 to-brand-600 block h-full w-full bg-linear-to-b"
        />
      </span>

      {steps.map((step, index) => {
        const onLeft = index % 2 === 0;

        return (
          <li
            key={step.title}
            className="relative grid grid-cols-[56px_1fr] items-start pb-12 last:pb-0 lg:grid-cols-[1fr_72px_1fr] lg:items-center lg:pb-8"
          >
            {/* Node. Ships with `is-lit`; GSAP strips it on mount and puts it
                back as the rail arrives, so the finished state is the default
                and an unrun tween leaves a complete timeline. */}
            <span
              data-rail-node
              aria-hidden
              className="border-hair is-lit col-start-1 row-start-1 flex size-13.5 items-center justify-center rounded-full border bg-white transition-[border-color,box-shadow] duration-500 [&.is-lit]:border-brand-500 [&.is-lit]:shadow-[0_0_0_6px_var(--color-brand-50)] lg:col-start-2"
            >
              <span className="font-display text-hair text-[0.8125rem] font-semibold tabular-nums transition-colors duration-500 in-[.is-lit]:text-brand-700">
                {String(index + 1).padStart(2, "0")}
              </span>
            </span>

            <div
              className={cn(
                "col-start-2 row-start-1 pt-3.5 lg:row-start-1 lg:pt-0",
                onLeft ? "lg:col-start-1 lg:pr-10 lg:text-right" : "lg:col-start-3 lg:pl-10",
              )}
            >
              <h3 className="font-display text-ink text-[1.125rem] leading-tight font-semibold">
                {step.title}
              </h3>
              {step.description && (
                <p className="text-muted mt-2.5 max-w-[46ch] text-[0.9375rem] leading-relaxed lg:inline-block">
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
