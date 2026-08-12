import { cn } from "@/lib/cn";

/**
 * Annotation chips and the dotted leaders that tether them.
 *
 * Ascendia hangs these off its funnel stages and they carry a lot of the
 * "considered diagram" feel. They transfer to a light ground, but only with the
 * contrast inverted: on dark they are glowing text on nothing, here they have
 * to be a solid `paper` chip with a hairline, or the label floats untethered
 * and reads as a stray caption.
 *
 * Keep them scarce. Two or three per illustration annotate; six label
 * everything and the picture becomes a form.
 */

export function CalloutChip({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  /** Illustrations scale their type with the canvas; the chip follows suit. */
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(
        "border-hair bg-paper text-brand-700 inline-flex items-center rounded-full border px-2.5 py-1.5",
        "text-[0.6875rem] leading-none font-semibold tracking-[0.08em] uppercase",
        "shadow-(--shadow-float)",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

/**
 * The dotted tether. An SVG line rather than a bordered div: only SVG gives a
 * dash pattern that stays even at arbitrary angles.
 *
 * Coordinates are in the parent SVG's user space, so this must be rendered
 * inside one.
 */
export function LeaderLine({
  x1,
  y1,
  x2,
  y2,
  className,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  className?: string;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--color-brand-200)"
      strokeWidth={1.5}
      strokeDasharray="4 4"
      strokeLinecap="round"
      className={className}
    />
  );
}

/** A static anchor point on a path or lane. Node rings are 1px by system rule. */
export function NodeRing({
  cx,
  cy,
  r = 5,
  filled = false,
}: {
  cx: number;
  cy: number;
  r?: number;
  filled?: boolean;
}) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={filled ? "var(--color-brand-500)" : "white"}
      stroke="var(--color-brand-300)"
      strokeWidth={1}
    />
  );
}
