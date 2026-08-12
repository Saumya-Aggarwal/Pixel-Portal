import Image from "next/image";

import { cn } from "@/lib/cn";

/** Square brand tile. One source of truth — swap the file, not the markup. */
export const LOGO_SRC = "/logo.png";
export const LOGO_SIZE = 512;

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
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt=""
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      priority
      className={cn("h-11 w-11 rounded-[0.6rem] object-contain", className)}
    />
  );
}
