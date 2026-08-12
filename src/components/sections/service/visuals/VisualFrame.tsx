import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Shared surface for every service hero visual.
 *
 * Keeping the frame here rather than in each archetype is what lets five very
 * different pictures still read as one family: same panel radius, same
 * hairline, same grid ground fading out at the edges. An archetype only has to
 * draw its own subject.
 */
export function VisualFrame({
  children,
  className,
  label,
  bare = false,
}: {
  children: ReactNode;
  className?: string;
  /**
   * Description of the picture for assistive tech. These visuals restate the
   * page's copy in diagram form, so the honest label is short — the detail is
   * already in the heading and the sections below.
   */
  label: string;
  /**
   * Drop the border, fill and shared backdrop, letting the illustration float
   * free on the page.
   *
   * A hard bordered box makes the picture look like a screenshot pasted onto
   * the page. Blueprint-built illustrations bring their own ground — a masked
   * `GridGround` and a `Backlight` positioned for that specific composition —
   * and look worse inside a second frame. The archetypes still need this
   * frame, so it stays until the last one is rebuilt.
   */
  bare?: boolean;
}) {
  if (bare) {
    return (
      <div role="img" aria-label={label} className={cn("relative", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "border-hair rounded-panel bg-paper relative overflow-hidden border",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid-field absolute inset-0 opacity-70 mask-[radial-gradient(ellipse_75%_75%_at_50%_45%,black,transparent)]"
      />
      <span
        aria-hidden
        className="bg-brand-100/40 pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full blur-3xl"
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
