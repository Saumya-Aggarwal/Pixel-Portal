import { CountUp } from "@/components/motion/CountUp";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import type { Metric } from "@/types/content";

/**
 * The four-across headline number row.
 *
 * Extracted from three near-identical copies — home, about, and the case-study
 * detail page — which had drifted apart on exactly two axes: how large the
 * figures are and whether the cells are centred. Both are props now, so the
 * three sites keep the appearance they had while sharing one implementation.
 *
 * Figures are set in `brand-600`, not the brand anchor. At these sizes the text
 * qualifies as "large" under WCAG and needs 3:1 — `brand-600` clears it at
 * 4.27:1 where `brand-500` lands at 2.87:1 and fails even the relaxed
 * threshold. That is the reason this component does not take a colour prop.
 *
 * Note this renders the rail only, not a `Section`. Two of the three callers
 * wrap it in a tinted `bg-paper` band and one does not, and a component that
 * owns its own section chrome cannot be dropped inside an existing one.
 */

const SIZES = {
  /** Home. The page's loudest numbers. */
  lg: "text-[clamp(2.75rem,6vw,4.5rem)]",
  /** About. */
  md: "text-[clamp(2.5rem,5vw,4rem)]",
  /** Case study, where the metrics sit under a hero image and should not shout. */
  sm: "text-[clamp(2.25rem,5vw,3.5rem)]",
} as const;

export function StatRail({
  items,
  size = "md",
  align = "start",
  labelWidth = "max-w-[18ch]",
  className,
}: {
  items: Metric[];
  size?: keyof typeof SIZES;
  align?: "start" | "center";
  /** Label measure. Wider where labels run long, e.g. case-study metrics. */
  labelWidth?: string;
  className?: string;
}) {
  const centred = align === "center";

  return (
    <RevealGroup
      className={cn(
        "divide-hair grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x",
        className,
      )}
    >
      {items.map((item) => (
        <RevealItem
          key={item.label}
          // Centring, where used, is not a stylistic preference: the columns are
          // far wider than the numbers, so left-aligned content leaves a growing
          // gap before each divider and the four items read as drifting apart
          // rather than as one row.
          className={cn(
            centred ? "px-4 text-center lg:px-8" : "lg:px-8 lg:first:pl-0 lg:last:pr-0",
          )}
        >
          <p
            className={cn(
              "font-display text-brand-600 leading-none font-semibold tracking-tight tabular-nums",
              SIZES[size],
            )}
          >
            <CountUp value={item.value} prefix={item.prefix} suffix={item.suffix} />
          </p>
          <p
            className={cn(
              "text-ink-soft text-[0.9375rem] leading-snug",
              centred ? "mx-auto mt-4" : "mt-3.5",
              labelWidth,
            )}
          >
            {item.label}
          </p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
