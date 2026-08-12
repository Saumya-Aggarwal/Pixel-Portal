import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Primary sits on brand-700, not the brand anchor.
 *
 * White on #27AE60 is 2.87:1 and white on #1F8C4D is 4.27:1 — both fail AA for
 * button-sized label text. #19703E gives 6.13:1 and passes everywhere without
 * depending on the large-text exemption, which is fragile the moment a label
 * wraps or a size prop changes.
 *
 * The vibrancy the brief asks for is carried by brand-500 at scale — hero
 * emphasis type, fills, glows, and hover washes — where nothing has to be
 * legible as small text.
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white hover:bg-brand-800 shadow-lift hover:shadow-lift-lg border border-transparent",
  outline:
    "border border-hair bg-white text-ink hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800",
  ghost: "border border-transparent text-brand-700 hover:bg-brand-50",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.875rem] gap-1.5",
  md: "h-12 px-6 text-[0.9375rem] gap-2",
  lg: "h-14 px-8 text-[1rem] gap-2.5",
};

const base = cn(
  "inline-flex items-center justify-center rounded-full font-medium",
  "transition-[background-color,border-color,color,box-shadow] duration-300 ease-soft",
  "whitespace-nowrap select-none",
  // 44px minimum touch target on every size, including `sm`.
  "min-h-11",
);

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsLink = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;

type ButtonAsButton = CommonProps & { href?: never } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

/**
 * Renders an anchor when given `href`, a button otherwise, so callers never
 * have to choose between correct semantics and consistent styling.
 */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (rest.href !== undefined) {
    return (
      <Link {...(rest as ComponentPropsWithoutRef<typeof Link>)} className={classes}>
        {children}
      </Link>
    );
  }

  // `href` is `never` on this branch and therefore undefined, and React omits
  // attributes with undefined values — so no `href` reaches the <button>.
  return (
    <button {...(rest as ComponentPropsWithoutRef<"button">)} className={classes}>
      {children}
    </button>
  );
}

/** Arrow that slides on hover of an enclosing `group`. */
export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn(
        "transition-transform duration-300 ease-out-expo group-hover:translate-x-1",
        className,
      )}
    >
      <path
        d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
