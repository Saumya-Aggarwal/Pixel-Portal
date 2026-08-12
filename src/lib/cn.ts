import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The type scale from globals.css, registered with tailwind-merge.
 *
 * Without this, `cn("text-h1 text-ink")` returns just `"text-ink"`. Merging
 * only knows Tailwind's built-in scale, so a custom `text-*` utility is
 * indistinguishable from a text *colour* — it lands in the same conflict group
 * and the later class wins. Every heading written as `text-h1 text-ink` was
 * therefore rendering at the inherited 17px with its size silently discarded,
 * and the failure is invisible in the source: the class is right there.
 *
 * Keep this list in step with the `--text-*` tokens in globals.css.
 */
const TYPE_SCALE = ["display", "h1", "h2", "h3", "lead", "body", "eyebrow"];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: TYPE_SCALE }],
    },
  },
});

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
