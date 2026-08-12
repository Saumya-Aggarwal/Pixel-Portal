import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * A track that things travel along.
 *
 * The chrome for every depiction whose subject is movement rather than a
 * surface — a message queue, an ETL pipeline, records crossing between two
 * schemas.
 *
 * It draws the rail and the stops and nothing else. Packets are the caller's
 * job, positioned over the lane with `laneOffset` so the maths for "where is
 * stop 3 of 5" lives in one place instead of being re-derived, slightly
 * differently, in every picture that needs it.
 */
export function FlowLane({
  stops,
  children,
  className,
}: {
  /** Rendered at evenly spaced positions along the rail. */
  stops: ReactNode[];
  /** Packets and anything else overlaid on the lane. Positioned absolutely. */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex items-center", className)}>
      {/* Rail. Inset by half a stop so it starts and ends under the first and
          last markers rather than running past them into empty space. */}
      <span
        aria-hidden
        className="via-brand-300 absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-transparent to-transparent"
      />

      <div className="relative flex w-full items-center justify-between">
        {stops.map((stop, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            {stop}
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}

/**
 * Left offset of stop `index` of `count`, as a percentage string.
 *
 * Matches the `justify-between` distribution the lane uses, so a packet
 * animated between two offsets lands exactly on the markers rather than
 * near them.
 */
export function laneOffset(index: number, count: number) {
  if (count <= 1) return "50%";
  return `${(index / (count - 1)) * 100}%`;
}
