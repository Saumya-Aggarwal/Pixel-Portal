"use client";

import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";

import { Frame, initials } from "@/components/media/Frame";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { DESKTOP_QUERY, DUR, EASE, STAGGER } from "@/lib/motion";
import type { BentoSize, TeamMember } from "@/types/content";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Bento placement. Sizes collapse toward 1x1 as the track narrows. */
const spans: Record<BentoSize, string> = {
  feature: "col-span-2 row-span-2",
  wide: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2 sm:row-span-2",
  standard: "col-span-1 row-span-1",
};

/**
 * Tiles shown before the grid asks permission to continue.
 *
 * Ten is where the bento still reads as a composition rather than a directory:
 * it fills about three bands at `lg`, enough for the feature tile to have
 * something to sit against. The bottom edge stays ragged — mixed spans mean no
 * count is flush at every breakpoint — which is the grid's whole character,
 * and the reveal button below re-establishes the horizontal line anyway.
 */
const INITIAL_COUNT = 10;

/**
 * Non-standard team grid (SOW design note: "avoid standard symmetrical rows").
 *
 * Two decisions worth knowing about:
 *
 * 1. **One ScrollTrigger, not fifty.** A trigger per tile would mean 50 scroll
 *    listeners and 50 layout reads per frame. Instead a single scrubbed
 *    timeline spans the whole grid and drives every tile from it, with depth
 *    varied per tile so they separate visually. Same effect, one trigger.
 *
 * 2. **Parallax targets the inner element**, never the `<li>`. The tiles also
 *    carry a CSS transition for the department filter; if GSAP scrubbed
 *    `transform` on the same node, the two would fight over the property and
 *    the grid would judder on every filter change.
 */
export function TeamBento({
  members,
  departments,
}: {
  members: TeamMember[];
  departments: string[];
}) {
  const [active, setActive] = useState<string>("All");
  const [expanded, setExpanded] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const matching = useMemo(
    () => (active === "All" ? members : members.filter((m) => m.department === active)),
    [members, active],
  );

  const visible = expanded ? matching : matching.slice(0, INITIAL_COUNT);
  const remaining = matching.length - visible.length;

  /** Filtering produces a different result set, so the old choice to see all
   *  of the previous one does not carry over. */
  const filterBy = (department: string) => {
    setActive(department);
    setExpanded(false);
  };

  /**
   * Collapsing can strand the reader in the whitespace the grid just vacated,
   * so the grid pulls itself back into view — but only when its top has
   * already scrolled off, otherwise this yanks a perfectly good viewport.
   */
  const collapse = () => {
    setExpanded(false);
    const top = container.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      container.current?.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
    }
  };

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

          const tiles = gsap.utils.toArray<HTMLElement>("[data-depth]");

          gsap.to(tiles, {
            // Depth is authored per tile; larger tiles drift further, which
            // reads as them sitting closer to the viewer.
            yPercent: (_index, target: HTMLElement) =>
              -Number(target.dataset.depth ?? 0) * 6,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    // Rebuilt when the filter or the expansion changes: the tiles are different
    // nodes and the grid height has changed, so the old timeline and its
    // measurements are stale.
    { scope: container, dependencies: [active, expanded], revertOnUpdate: true },
  );

  const depthFor = (size: BentoSize) =>
    size === "feature" ? 3 : size === "tall" ? 2 : size === "wide" ? 1.5 : 1;

  return (
    <div>
      {/* Department filter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter team by department">
        {["All", ...departments].map((department) => {
          const isActive = active === department;
          return (
            <button
              key={department}
              type="button"
              onClick={() => filterBy(department)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border px-4 text-[0.875rem] transition-colors duration-300",
                isActive
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-hair text-ink-soft hover:border-brand-300 hover:text-brand-700 bg-white",
              )}
            >
              {department}
              <span className="ml-2 text-[0.75rem] opacity-60">
                {department === "All"
                  ? members.length
                  : members.filter((m) => m.department === department).length}
              </span>
            </button>
          );
        })}
      </div>

      <div
        ref={container}
        className="mt-10"
        // Live region so filtering announces the new count rather than
        // silently swapping the grid contents.
        aria-live="polite"
      >
        <p className="sr-only">
          Showing {visible.length} of {matching.length} team members.
        </p>

        <ul className="grid auto-rows-[7.5rem] grid-cols-2 gap-3 sm:auto-rows-[9rem] sm:grid-cols-4 lg:auto-rows-[10.5rem] lg:grid-cols-6">
          {visible.map((member, index) => (
            <motion.li
              key={member.id}
              className={cn(
                "rounded-card group relative overflow-hidden",
                spans[member.size],
              )}
              /* Only the tiles past the fold animate, and only on the way in.
                 The first ten are already on screen when the reader presses
                 the button — re-running their entrance would read as the grid
                 flinching rather than extending. */
              initial={index < INITIAL_COUNT ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: DUR.base,
                delay: (index - INITIAL_COUNT) * STAGGER.tight,
                ease: EASE.out,
              }}
            >
              <div
                data-depth={depthFor(member.size)}
                className="absolute inset-0 will-change-transform"
                // Overscan so the parallax drift never exposes a tile edge.
                style={{ top: "-8%", bottom: "-8%" }}
              >
                <Frame
                  aspect="h-full w-full"
                  alt={`${member.name}, ${member.role}`}
                  src={member.image}
                  seed={member.id}
                  label={initials(member.name)}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                />
              </div>

              {/* Name plate — always legible, deepens on hover */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-3 pt-10 transition-opacity duration-500 sm:p-4 sm:pt-12">
                <p className="font-display truncate text-[0.875rem] leading-tight font-semibold text-white sm:text-[0.9375rem]">
                  {member.name}
                </p>
                <p className="mt-0.5 truncate text-[0.75rem] leading-tight text-white/75">
                  {member.role}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* The control names what it will do and how much of it — "Show 14
            more" beats a bare "Load more", which asks the reader to guess
            whether it is worth the tap. It disappears entirely once a filter
            narrows the set below the cap, rather than sitting there disabled. */}
        {(remaining > 0 || expanded) && (
          <div className="mt-8 flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={expanded ? collapse : () => setExpanded(true)}
              aria-expanded={expanded}
            >
              {expanded ? "Show fewer" : `Show ${remaining} more`}
              <span
                aria-hidden
                className={cn(
                  "ml-0.5 transition-transform duration-300 ease-soft",
                  expanded && "rotate-180",
                )}
              >
                ↓
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
