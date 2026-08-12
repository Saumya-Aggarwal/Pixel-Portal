import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * A floating surface.
 *
 * The neutral member of the chrome set — used where the subject is not a
 * website and not a phone, but still a piece of software: a dashboard card, a
 * SERP result, a system node in an integration diagram.
 *
 * Uses the `glass` utility from globals.css rather than a flat white fill.
 * Over this site's white ground that reads as a very slight lift rather than
 * frost, which is what keeps several of these stacked in one picture from
 * flattening into a single block.
 */
export function PanelChrome({
  children,
  title,
  accent = false,
  className,
}: {
  children: ReactNode;
  /** Optional header row. Omit for a bare surface. */
  title?: ReactNode;
  /** Draws the panel in brand tint — marks the one node the eye should land on. */
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card flex min-h-0 flex-col overflow-hidden",
        accent ? "glass-tint" : "glass",
        className,
      )}
    >
      {title && (
        <div
          className={cn(
            "flex shrink-0 items-center gap-2 px-3.5 pt-3 pb-2 text-[0.6875rem] leading-none font-semibold tracking-[0.08em] uppercase",
            accent ? "text-brand-700" : "text-muted",
          )}
        >
          {title}
        </div>
      )}
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
