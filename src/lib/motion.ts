/**
 * Shared motion vocabulary.
 *
 * Every animation on the site pulls its easing and timing from here. A single
 * source for these is what makes a heavily animated site feel composed rather
 * than busy — retuning the site's feel is an edit to this file, not a sweep
 * through fifty components.
 *
 * Values mirror the --ease-* tokens in globals.css so CSS transitions and JS
 * animations stay in step.
 */

/** Cubic-bezier control points, in Motion's array form. */
export const EASE = {
  /** expo-out — entrances, reveals, anything arriving. The house ease. */
  out: [0.16, 1, 0.3, 1],
  /** Standard material-ish curve for UI state changes. */
  soft: [0.4, 0, 0.2, 1],
  /** expo-in — exits, things leaving the screen. */
  in: [0.7, 0, 0.84, 0],
  /** Symmetric — for loops and cross-fades. */
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** GSAP names the same curves as strings. */
export const GSAP_EASE = {
  out: "expo.out",
  soft: "power2.out",
  in: "expo.in",
  inOut: "power3.inOut",
} as const;

/** Durations in seconds. Both GSAP and Motion take seconds. */
export const DUR = {
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
  reveal: 1.2,
} as const;

export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;

/**
 * Entrance blur, in px.
 *
 * A reveal that only fades and rises reads as a slideshow; the same reveal
 * resolving out of a blur reads as depth. It is the cheapest thing on this
 * list and it does more for perceived quality than any other single value.
 *
 * Two constraints keep it honest:
 *
 * `filter` establishes a containing block for `position: fixed` descendants,
 * exactly like `transform` does — the hazard RouteTransition and BackdropIn
 * already document. Anything wrapping fixed-position children must pass
 * `blur={0}`.
 *
 * And the filter is cleared to `none` once the tween lands rather than left
 * at `blur(0px)`, so a settled section stops paying for a compositing layer
 * it no longer uses.
 */
export const BLUR = {
  /** Cards, list rows, chips — anything arriving as a group. */
  base: 8,
  /** Large surfaces, where a wide blur radius costs real frames. */
  subtle: 4,
  /** Off. Use inside any subtree containing `position: fixed`. */
  none: 0,
} as const;

/** Springs for pointer-driven motion (magnetic buttons, card tilt). */
export const SPRING = {
  /** Snappy, low overshoot — cursor following. */
  magnetic: { type: "spring", stiffness: 260, damping: 22, mass: 0.6 },
  /** Softer, with a little settle — card lift. */
  lift: { type: "spring", stiffness: 200, damping: 26, mass: 0.8 },
} as const;

/** Breakpoint at which pointer-driven and parallax effects switch on. */
export const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * The one viewport config used by every scroll-triggered reveal, so sections
 * across the site all fire at the same point in the scroll.
 */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

/** Standard rise-and-fade. Distance is deliberately small; big travel reads cheap. */
export const riseVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const;

/** Parent variant that staggers `riseVariants` children. */
export const staggerParent = (stagger: number = STAGGER.base) =>
  ({
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  }) as const;
