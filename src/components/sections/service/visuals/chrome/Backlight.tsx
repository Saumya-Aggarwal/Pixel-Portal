import { cn } from "@/lib/cn";

/**
 * Diffuse ambient backlight, sat behind the focal panel.
 *
 * The problem this solves: flat vectors on flat white have no spatial volume,
 * and the usual dark-site fix — a saturated neon glow — is unavailable and
 * would look like a rendering artefact over white anyway.
 *
 * Instead this is a wide, heavily blurred wash of `brand-200` at low opacity.
 * At 80px of blur it never reads as a shape; it reads as light coming from
 * behind the panel, which is what gives the panel somewhere to sit.
 *
 * Always `pointer-events-none` and `aria-hidden`: it is lighting, not content.
 */
export function Backlight({
  className,
  size = "md",
  intensity = 30,
}: {
  className?: string;
  size?: keyof typeof SIZES;
  /** Opacity percentage. Above ~40 the wash starts reading as a green blob. */
  intensity?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-brand-200 pointer-events-none absolute rounded-full blur-[80px]",
        SIZES[size],
        className,
      )}
      style={{ opacity: intensity / 100 }}
    />
  );
}

const SIZES = {
  sm: "size-48",
  md: "size-72",
  lg: "size-96",
} as const;
