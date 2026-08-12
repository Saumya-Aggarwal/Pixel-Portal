import { cn } from "@/lib/cn";

/**
 * Coordinate grid behind an illustration.
 *
 * Its job is to define the space the illustration occupies without drawing a
 * box around it. A hard border makes the picture look like a screenshot pasted
 * onto the page; a grid that fades to nothing lets it float while still giving
 * the eye a plane to read depth against.
 *
 * The fade is the whole trick, and it has to be a radial mask rather than a
 * gradient overlay — an overlay would need to match the page background, which
 * breaks the moment the illustration sits on `paper` instead of white.
 *
 * 32px spacing, `hair` hairlines. Deliberately tighter than the 72px
 * `grid-field` utility used behind page-level heroes: at illustration scale
 * that one reads as two stray lines rather than a grid.
 */
export function GridGround({
  className,
  spacing = 32,
}: {
  className?: string;
  spacing?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0",
        "mask-[radial-gradient(circle_at_center,black_40%,transparent_80%)]",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(to right, var(--color-hair) 1px, transparent 1px), linear-gradient(to bottom, var(--color-hair) 1px, transparent 1px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
      }}
    />
  );
}
