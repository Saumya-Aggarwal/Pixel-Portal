import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * A browser window, drawn.
 *
 * Shared by every depiction whose subject is a website — the corporate-site
 * assembly, the storefront, the marketplace grid, the headless split view. The
 * chrome is identical across all of them on purpose: it is the frame the reader
 * stops noticing after the first page, which is what lets the *contents* of
 * each picture carry the difference.
 *
 * Deliberately not a real browser. Three dots and a pill are enough signal;
 * anything more (tabs, back buttons, a favicon) starts competing with the thing
 * inside the window for attention.
 */
export function BrowserChrome({
  children,
  url,
  className,
}: {
  children: ReactNode;
  /** Shown in the address pill. Keep it short — it truncates, it does not wrap. */
  url?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-hair rounded-card flex min-h-0 flex-col overflow-hidden border bg-white shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <div className="border-hair bg-paper flex shrink-0 items-center gap-2.5 border-b px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <Dot />
          <Dot />
          <Dot />
        </span>
        {url && (
          <span className="border-hair text-muted ml-1 min-w-0 flex-1 truncate rounded-full border bg-white px-3 py-1 text-[0.6875rem] leading-none">
            {url}
          </span>
        )}
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

function Dot() {
  return <span className="bg-hair size-2 rounded-full" />;
}
