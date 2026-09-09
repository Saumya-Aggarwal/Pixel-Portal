"use client";

import { useState } from "react";

/**
 * A client's logo on a card.
 *
 * Decorative, and marked as such. Every card that renders one also prints the
 * client's name as text a few lines below it, so an alt string would have a
 * screen reader announce the same company twice.
 *
 * These are hot-linked from each client's own domain, which means one can stop
 * resolving without any warning — Webaffino's already has. A broken `img`
 * renders as the browser's placeholder glyph next to its alt text, which reads
 * as a fault in this page rather than a missing file on someone else's server,
 * so a failed load takes the element out instead.
 */
export function ClientMark({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
