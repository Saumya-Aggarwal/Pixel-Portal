import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Deterministic green-tinted placeholder derived from a seed string.
 *
 * Real photography has not landed yet, but layout must be final now — so every
 * frame reserves its true aspect ratio and paints a stable, seeded gradient
 * rather than a grey box. Dropping in real images later shifts nothing.
 *
 * Hue stays inside the brand range by construction; only the angle and the
 * stop positions vary, so a wall of placeholders still reads as one palette.
 */
function seededVisual(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);
  const angle = 100 + (abs % 80);
  const stops = [
    ["#0d3a20", "#19703e", "#4fc583"],
    ["#125430", "#27ae60", "#a9e7c3"],
    ["#19703e", "#1f8c4d", "#7fdca6"],
    ["#0a0f0c", "#125430", "#27ae60"],
  ][abs % 4];
  return `linear-gradient(${angle}deg, ${stops[0]} 0%, ${stops[1]} 52%, ${stops[2]} 100%)`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface FrameProps {
  /** Aspect ratio as a Tailwind class, e.g. "aspect-[4/5]". */
  aspect?: string;
  className?: string;
  src?: string;
  alt: string;
  /** Seed for the placeholder gradient. Defaults to `alt`. */
  seed?: string;
  /** Short label drawn over the placeholder — initials, a number, a word. */
  label?: string;
  /**
   * Overrides the label's type. The default is sized for full-bleed frames;
   * anything avatar-sized needs its own scale, or the clamp renders initials
   * larger than the circle holding them.
   */
  labelClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function Frame({
  aspect = "aspect-[4/3]",
  className,
  src,
  alt,
  seed,
  label,
  labelClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
}: FrameProps) {
  return (
    <div className={cn("relative overflow-hidden bg-brand-900", aspect, className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 grid place-items-center"
          style={{ backgroundImage: seededVisual(seed ?? alt) }}
        >
          {label && (
            <span
              className={cn(
                "font-display text-white/30 text-[clamp(2rem,6vw,4rem)] font-semibold tracking-tight select-none",
                labelClassName,
              )}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
