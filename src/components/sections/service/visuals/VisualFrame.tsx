import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Shared surface for every service hero visual.
 *
 * Now only the `role="img"` wrapper and its label. The frame used to also draw a
 * bordered panel, a grid ground and a backlight, which was right when the
 * illustrations were abstract archetypes sharing one look. Every illustration is
 * built to the 960x640 blueprint canvas now and brings its own ground —
 * a `GridGround` and a `Backlight` placed for that specific composition — and a
 * second border around that read as a screenshot pasted onto the page.
 *
 * Kept rather than inlined because the accessible label is the part that must
 * not drift: one wrapper means one place where a picture can lose its
 * description.
 */
export function VisualFrame({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  /**
   * Description of the picture for assistive tech. These visuals restate the
   * page's copy in diagram form, so the honest label is short — the detail is
   * already in the heading and the sections below.
   */
  label: string;
}) {
  return (
    <div role="img" aria-label={label} className={cn("relative", className)}>
      {children}
    </div>
  );
}
