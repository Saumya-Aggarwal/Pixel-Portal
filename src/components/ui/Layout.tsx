import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Shared page furniture. Every section on the site uses these, which is what
 * keeps rhythm consistent across pages built at different times.
 */

/** Standard gutter and max width. `wide` for full-bleed grids. */
export function Container({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-12",
        wide ? "max-w-[1600px]" : "max-w-[1280px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Vertical rhythm. One scale for the whole site, fluid across breakpoints.
 *
 * There used to be a `divider` prop that drew a gradient rule broken by a green
 * diamond across the top edge, as the seam between two sections sharing a
 * background. It is gone, and the spacing here is why it can be: at `base` two
 * adjacent sections put 144–256px of white between their contents, which
 * separates them on its own. A drawn ornament on top of that gap was the one
 * piece of decoration on the site that had no job.
 */
export function Section({
  children,
  className,
  as: Tag = "section",
  id,
  spacing = "base",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
  spacing?: "tight" | "base" | "loose";
}) {
  const spacings = {
    tight: "py-[clamp(3rem,6vw,5rem)]",
    base: "py-[clamp(4.5rem,9vw,8rem)]",
    loose: "py-[clamp(6rem,12vw,11rem)]",
  };

  return (
    <Tag id={id} className={cn("relative", spacings[spacing], className)}>
      {children}
    </Tag>
  );
}

/** Small tracked label above a heading. brand-700 for contrast at 13px. */
export function Eyebrow({
  children,
  className,
  withRule = true,
}: {
  children: ReactNode;
  className?: string;
  withRule?: boolean;
}) {
  return (
    <p className={cn("text-eyebrow text-brand-700 flex items-center gap-3 uppercase", className)}>
      {withRule && <span aria-hidden className="bg-brand-400 h-px w-8 shrink-0" />}
      {children}
    </p>
  );
}

/** Hairline divider with a green tint. */
export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-hair border-t", className)} />;
}

