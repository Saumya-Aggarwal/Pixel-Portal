"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The playhead behind the category heroes.
 *
 * The fourteen service illustrations are time-driven: a fixed loop that plays
 * the same way for everyone. These three are **position-driven** — everything
 * is a function of `t`, a number from 0 to 1, and `t` has three possible
 * owners:
 *
 * - **Autoplay**, when nobody is pointing at it. Runs stop to stop with a dwell
 *   at each, holds on the last, and rewinds.
 * - **The pointer**, when it is over the illustration. `t` tracks horizontal
 *   position, so the reader scrubs the whole sequence by moving across it.
 * - **A station**, when the pointer is over one. `t` locks to that station's
 *   stop and stays there.
 *
 * That last one exists because hover-to-scrub and stations-as-links otherwise
 * fight each other: moving toward a station in order to click it would keep
 * changing what you were about to click. Locking makes the sequence settle on
 * exactly the thing under the cursor, which turns the magnetism from decoration
 * into the affordance that makes the link usable.
 *
 * Leaving hands `t` back to autoplay *from where it was left* rather than
 * restarting — `seek` inverts the keyframe track to find the time that matches
 * the current value. Restarting from zero after every hover reads as the
 * illustration flinching away from the reader.
 *
 * Reduced motion and coarse pointers both resolve to `t = 1`, the completed
 * frame. Reduced motion because that is the rule for this whole set; coarse
 * pointers because there is no hover on touch, and an autoplaying hero that
 * cannot be scrubbed is worse than a settled one that can be read.
 */
export function useScrubPlayhead<T extends HTMLElement>({
  stops,
  dwell = 1.2,
  travel = 0.9,
  settle = 2.4,
  rewind = 0.6,
}: {
  /** Number of stations. Stop `i` sits at `i / (stops - 1)`. */
  stops: number;
  /** Seconds held at each stop. */
  dwell?: number;
  /** Seconds spent travelling between two stops. */
  travel?: number;
  /** Seconds held on the final stop, before the rewind. */
  settle?: number;
  /** Seconds to return to the start. Short: this is a reset, not a step. */
  rewind?: number;
}) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const prefersReduced = useReducedMotion();

  /**
   * Fine-pointer detection, resolved after mount.
   *
   * Deliberately not read during render: the server has no media queries, so
   * branching on it before hydration desynchronises the first client render —
   * the same failure `useReducedMotion` exists to prevent. Starting false means
   * the first paint is the settled frame, which is a correct frame either way.
   */
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const interactive = finePointer && !prefersReduced;

  const t = useMotionValue(1);

  /** Pointer position over the box, 0..1 on each axis. Springed for lag. */
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const pointerX = useSpring(rawX, { stiffness: 55, damping: 18, mass: 0.7 });
  const pointerY = useSpring(rawY, { stiffness: 55, damping: 18, mass: 0.7 });
  const [pointerActive, setPointerActive] = useState(false);

  const auto = useRef<AnimationPlaybackControls | null>(null);
  const locked = useRef(false);

  /**
   * The autoplay track: arrive, dwell, travel, … settle, rewind.
   *
   * Derived entirely from the timing props, so it is memoised rather than held
   * in a ref — a ref would have to be lazily rebuilt during render, which both
   * reads and writes `current` mid-render and is exactly what
   * `react-hooks/refs` is there to catch.
   */
  const track = useMemo(() => {
    const values: number[] = [];
    const offsets: number[] = [];
    let clock = 0;
    for (let i = 0; i < stops; i += 1) {
      const value = i / (stops - 1);
      values.push(value);
      offsets.push(clock);
      clock += i === stops - 1 ? settle : dwell;
      values.push(value);
      offsets.push(clock);
      if (i < stops - 1) clock += travel;
    }
    clock += rewind;
    values.push(0);
    offsets.push(clock);
    return {
      values,
      times: offsets.map((offset) => offset / clock),
      duration: clock,
    };
  }, [stops, dwell, travel, settle, rewind]);

  /**
   * Time at which the autoplay track holds `value`, scanning the forward pass
   * only — the final pair is the rewind, and resuming into it would send the
   * playhead backwards from wherever the reader let go.
   */
  const seek = useCallback(
    (value: number) => {
      const { values, times, duration } = track;
      for (let k = 0; k < values.length - 2; k += 1) {
        const a = values[k];
        const b = values[k + 1];
        if (value >= Math.min(a, b) && value <= Math.max(a, b)) {
          const span = b - a;
          const fraction = span === 0 ? 0 : (value - a) / span;
          return (times[k] + fraction * (times[k + 1] - times[k])) * duration;
        }
      }
      return 0;
    },
    [track],
  );

  const stopAuto = useCallback(() => {
    auto.current?.stop();
    auto.current = null;
  }, []);

  const startAuto = useCallback(
    (from?: number) => {
      stopAuto();
      const { values, times, duration } = track;
      const controls = animate(t, values, {
        duration,
        times,
        repeat: Infinity,
        ease: "easeInOut",
      });
      if (from !== undefined) controls.time = seek(from);
      auto.current = controls;
    },
    [seek, stopAuto, t, track],
  );

  useEffect(() => {
    if (!interactive || !inView) {
      stopAuto();
      // Settled rather than parked mid-sequence: an illustration that is not
      // playing must still show its completed argument.
      if (!interactive) t.set(1);
      return;
    }
    startAuto(t.get());
    return stopAuto;
  }, [interactive, inView, startAuto, stopAuto, t]);

  const scrubTo = useCallback(
    (value: number) => {
      animate(t, Math.min(1, Math.max(0, value)), {
        type: "spring",
        stiffness: 320,
        damping: 38,
        mass: 0.5,
      });
    },
    [t],
  );

  const handlers = interactive
    ? {
        onPointerMove: (event: React.PointerEvent<T>) => {
          if (event.pointerType !== "mouse") return;
          const box = event.currentTarget.getBoundingClientRect();
          if (box.width === 0 || box.height === 0) return;
          const nx = (event.clientX - box.left) / box.width;
          const ny = (event.clientY - box.top) / box.height;
          rawX.set(Math.min(1, Math.max(0, nx)));
          rawY.set(Math.min(1, Math.max(0, ny)));
          if (!pointerActive) setPointerActive(true);
          if (locked.current) return;
          stopAuto();
          scrubTo(nx);
        },
        onPointerLeave: () => {
          locked.current = false;
          setPointerActive(false);
          rawX.set(0.5);
          rawY.set(0.5);
          startAuto(t.get());
        },
      }
    : {};

  /**
   * Hold the playhead at an arbitrary point while the pointer is over a target.
   *
   * Separate from `lockTo` because not every illustration's stations are evenly
   * spaced. The trace maps `t` to elapsed milliseconds, so its spans sit wherever
   * their durations put them and a station's lock target is its own midpoint —
   * `index / (stops - 1)` would land the playhead in the wrong span entirely.
   */
  const lockToValue = useCallback(
    (value: number) => {
      if (!interactive) return;
      locked.current = true;
      stopAuto();
      scrubTo(value);
    },
    [interactive, scrubTo, stopAuto],
  );

  /** Hold the playhead on a station while the pointer is over it. */
  const lockTo = useCallback(
    (index: number) => {
      lockToValue(index / (stops - 1));
    },
    [lockToValue, stops],
  );

  const release = useCallback(() => {
    locked.current = false;
  }, []);

  return {
    ref,
    t,
    pointerX,
    pointerY,
    pointerActive,
    interactive,
    handlers,
    lockTo,
    lockToValue,
    release,
  };
}

/**
 * The station the playhead is nearest, for state that switches rather than
 * interpolates — a label, a highlight, a status string.
 *
 * Re-renders only when the index actually changes, not on every frame of a
 * scrub. Everything that can interpolate should use `useTransform` against `t`
 * instead and never re-render at all.
 */
export function useStopIndex(t: MotionValue<number>, stops: number) {
  const clamp = useCallback(
    (value: number) =>
      Math.min(stops - 1, Math.max(0, Math.round(value * (stops - 1)))),
    [stops],
  );

  const [index, setIndex] = useState(() => clamp(t.get()));

  useMotionValueEvent(t, "change", (value) => {
    const next = clamp(value);
    setIndex((previous) => (previous === next ? previous : next));
  });

  return index;
}
