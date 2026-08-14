import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Square brand tile. One source of truth — swap the file, not the markup.
 *
 * `LOGO_SIZE` is the artwork's intrinsic pixel size, not a display size. It is
 * what `next/image` uses to pick which resized variants to generate, so it must
 * track the file: the 512px export was replaced with the 1563px master, and
 * leaving the old number here would have capped every rendered variant at 512
 * and left the boot sequence — which paints the mark at roughly 220 CSS px on a
 * 2× display — resampling an upscale.
 */
export const LOGO_SRC = "/logo.png";
export const LOGO_SIZE = 1563;

/**
 * Brand lockup, used by the header, the footer, and the hero's boot sequence.
 *
 * The artwork is the full lockup — green tile, wordmark and all — so nothing
 * here sets a "Pixel Portal" text node beside it; that would render the name
 * twice. Callers that need an accessible name put it on the link wrapping
 * this (both the header and footer already carry `aria-label`), which is why
 * the image itself is `alt=""` rather than competing for the same label.
 *
 * `priority` because this is above the fold on every route, and on the home
 * page it is the first thing the boot sequence shows — a lazy logo would
 * fade in to an empty square.
 */
export function Logo({ className, sizes = "44px" }: { className?: string; sizes?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt=""
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      priority
      // Without this, `next/image` takes `width` at face value and offers the
      // browser a 1920/3840 pair for a 44px tile — a 1563px master makes that
      // mistake far more expensive than the 512px one did, and it lands on a
      // `priority` request in the head of every route. Any caller that
      // overrides the size in `className` must override this to match.
      sizes={sizes}
      className={cn("h-11 w-11 rounded-[0.6rem] object-contain", className)}
    />
  );
}
