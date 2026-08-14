"use client";

import { useEffect, useState } from "react";

/**
 * One clock for a scripted session.
 *
 * The depictions that show a thing *being operated* — a cursor crossing a panel
 * and clicking it, a hand reaching a control — were built as a set of parallel
 * keyframe timelines, each element carrying its own copy of the loop duration
 * and its own `times` array. That model has a defect that no amount of retiming
 * fixes: Motion hands `opacity` to the compositor through the Web Animations
 * API but drives a percentage transform from JavaScript on the main thread, so
 * a travelling element and the things reacting to it are on two different
 * clocks. Measured on `AppShell`, the click ripple reached 0.63 opacity while
 * the arrow was still ~140 canvas units short of the control it was clicking.
 * `element.getAnimations()` on that arrow reported only `opacity` — never
 * `transform`.
 *
 * So the session is a state machine instead. One timer, owned here, walks a
 * list of steps and reports which one is current and whether its travel is
 * over. Everything else animates on the *change*, which means "the cursor has
 * arrived" precedes "the panel opens" by construction rather than by two
 * numbers agreeing. Drift cannot accumulate across a loop because nothing runs
 * a loop-length timeline any more; every animation is a short one-shot started
 * at a known commit.
 *
 * The secondary win is easing. Motion applies a single easing curve across a
 * whole keyframe array rather than per segment, which is why the timelines this
 * replaces had to drop easing entirely to keep their stops landing on time. A
 * step is one tween, so it can ease properly — travel accelerates away and
 * settles, the way a hand moves.
 */
export interface SequenceStep {
  /** Seconds spent travelling into this step. */
  travel: number;
  /** Seconds the step holds once it has arrived. */
  dwell: number;
}

export interface SequencePhase<T> {
  /** The current step. */
  step: T;
  /** Its position in the list, for callers that need to compare steps. */
  index: number;
  /** False while travelling, true for the dwell. Reactions key off this. */
  arrived: boolean;
}

export function useSequence<T extends SequenceStep>(
  steps: readonly T[],
  playing: boolean,
): SequencePhase<T> {
  const [phase, setPhase] = useState({ index: 0, arrived: false });

  useEffect(() => {
    if (!playing) return;

    let timer = 0;
    // Nothing is applied synchronously: even the opening transition is
    // scheduled, at zero delay. That keeps the effect pure, and it re-seats an
    // index left stale by the last time this scrolled out of view.
    const schedule = (next: { index: number; arrived: boolean }, delay: number) => {
      timer = window.setTimeout(() => {
        setPhase(next);
        const step = steps[next.index];
        if (next.arrived) {
          schedule(
            { index: (next.index + 1) % steps.length, arrived: false },
            step.dwell * 1000,
          );
        } else {
          schedule({ index: next.index, arrived: true }, step.travel * 1000);
        }
      }, delay);
    };

    schedule({ index: 0, arrived: false }, 0);
    return () => window.clearTimeout(timer);
  }, [playing, steps]);

  return { step: steps[phase.index], index: phase.index, arrived: phase.arrived };
}
