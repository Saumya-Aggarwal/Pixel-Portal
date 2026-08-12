import type { ReactNode } from "react";

import { RouteTransition } from "@/components/motion/RouteTransition";

/**
 * Wraps every route so navigation fades the incoming page in rather than hard
 * cutting to it.
 *
 * A template rather than the layout because Next keys templates per route and
 * remounts them on navigation — a layout persists, so its children's entrance
 * animations would run once on first load and never again. The header and
 * footer stay in `layout.tsx` and are deliberately outside this: they are
 * continuous furniture, and re-fading them on every click would read as the
 * whole site reloading.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}
