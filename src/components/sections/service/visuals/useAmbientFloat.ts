"use client";

/**
 * The weightless bob applied to floating illustration panels.
 *
 * This is secondary motion — it carries no information. Its only job is to stop
 * the panels reading as pasted-down stickers, which is most of what separates a
 * premium product illustration from a wireframe.
 *
 * Two rules make it work rather than annoy:
 *
 * Periods are long (8–12s) and amplitude is tiny (±6px). Anything faster or
 * larger stops being ambient and starts competing with the data motion, which
 * is the part the reader is supposed to follow.
 *
 * And every panel gets a different phase. Panels bobbing in sync read as the
 * whole picture breathing — one object, not several floating independently.
 * `phase` is expressed as a fraction of the period and applied as a negative
 * delay, so the panel starts mid-cycle instead of waiting its turn.
 */

export interface AmbientFloat {
  /** Peak vertical travel in px, each direction. */
  amplitude?: number;
  /** Seconds for one full up-and-down. */
  period?: number;
  /** 0..1 fraction of the period to start at. Vary this per panel. */
  phase?: number;
}

/**
 * Returns Motion `animate` and `transition` props for the bob.
 *
 * Pass `playing: false` — off-screen, or reduced motion — and the panel locks
 * at `y: 0`, which is its resolved resting position rather than an arbitrary
 * point in the cycle.
 */
export function useAmbientFloat({
  amplitude = 6,
  period = 9,
  phase = 0,
  playing,
}: AmbientFloat & { playing: boolean }) {
  if (!playing) {
    return { animate: { y: 0 }, transition: { duration: 0 } };
  }

  return {
    animate: { y: [0, -amplitude, 0, amplitude, 0] },
    transition: {
      duration: period,
      repeat: Infinity,
      // Sine-like: the panel should never appear to stop at the extremes.
      ease: "easeInOut" as const,
      // Negative delay starts the tween mid-cycle rather than delaying it.
      delay: -phase * period,
    },
  };
}
