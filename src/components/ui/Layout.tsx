import type { ElementType, ReactNode } from "react";

import { DiamondRule } from "@/components/ui/DiamondRule";
import { cn } from "@/lib/cn";

// Re-exported so the whole page-furniture vocabulary stays one import. The
// component itself lives apart because it is a Client Component, and folding
// it in here would drag Container, Section, and Eyebrow across the boundary
// with it.
export { DiamondRule };

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

/** Vertical rhythm. One scale for the whole site, fluid across breakpoints. */
export function Section({
  children,
  className,
  as: Tag = "section",
  id,
  spacing = "base",
  divider = false,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
  spacing?: "tight" | "base" | "loose";
  /**
   * Draws a `DiamondRule` across the section's top edge — the seam treatment
   * for two sections that share a background. Use this instead of
   * `border-hair border-t`; it occupies the same line and no layout space.
   *
   * Not for the edges of a tinted (`bg-paper`) band. There the border is doing
   * structural work — framing where the tint starts and stops — and a diamond
   * sitting on a colour change reads as debris rather than ornament.
   */
  divider?: boolean;
}) {
  const spacings = {
    tight: "py-[clamp(3rem,6vw,5rem)]",
    base: "py-[clamp(4.5rem,9vw,8rem)]",
    loose: "py-[clamp(6rem,12vw,11rem)]",
  };

  return (
    <Tag id={id} className={cn("relative", spacings[spacing], className)}>
      {/* Half its own height above the edge, so the rule lands exactly on the
          boundary the border used to occupy and nothing below it shifts. */}
      {divider && (
        <Container wide className="absolute inset-x-0 top-0 -translate-y-1/2">
          <DiamondRule />
        </Container>
      )}
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

