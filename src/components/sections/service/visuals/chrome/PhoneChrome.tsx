import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * A handset, drawn.
 *
 * Used where the subject is genuinely mobile-first — the social feed, the
 * responsive-reflow depiction's end state. Not a generic container: reaching
 * for a phone frame when the subject is not phone-shaped is what makes agency
 * illustration look interchangeable.
 *
 * The screen well clips its children, so a feed can run past the bottom edge
 * and read as continuing rather than stopping.
 */
export function PhoneChrome({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-hair relative rounded-[2rem] border-[6px] bg-white p-0 shadow-[var(--shadow-lift-lg)]",
        className,
      )}
    >
      {/* Notch. Sits over the screen rather than displacing it, so the content
          well keeps a simple rectangular geometry to lay out against. */}
      <span className="bg-hair/70 absolute top-2 left-1/2 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full" />

      <div className="relative h-full overflow-hidden rounded-[1.6rem] bg-white">
        <div className="text-muted flex items-center justify-between px-4 pt-4 pb-2 text-[0.625rem] leading-none font-medium">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="bg-hair block h-1.5 w-1.5 rounded-full" />
            <span className="bg-hair block h-1.5 w-1.5 rounded-full" />
            <span className="bg-hair block h-2 w-3.5 rounded-[2px]" />
          </span>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
