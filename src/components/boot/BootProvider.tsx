"use client";

import { AnimatePresence, animate, useMotionValue } from "motion/react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSyncExternalStore } from "react";

import { BootCurtain } from "@/components/boot/BootCurtain";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Four beats, and each one is a different *kind* of motion — counting, then
 * arrival, then expansion, then a glide. The sequence this replaced was three
 * opacity tweens in a row, which is why it read as a placeholder however long
 * it was held.
 *
 * - `curtain`  Dark field. The counter runs against real load signals.
 * - `opening`  The mark's own silhouette expands until it is the page. The
 *              site's white ground arrives *through* the portal rather than
 *              being cross-faded to, which is the one beat that makes this
 *              specific brand's intro mean something.
 * - `core`     Curtain gone. The 3D core rises at centre, alone.
 * - `complete` The core glides to the right column and the hero resolves.
 */
export type BootPhase = "curtain" | "opening" | "core" | "complete";

/**
 * The things the counter genuinely waits on. Not decoration: each is an event
 * the browser actually fires, and the sequence cannot finish before all three
 * land (or the ceiling below is hit).
 */
export type BootSignal = "fonts" | "art" | "scene";
const SIGNALS: readonly BootSignal[] = ["fonts", "art", "scene"];

export const BOOT_TIMING = {
  /**
   * The counter never finishes before this, however fast the page loads. A
   * loader that flashes past reads as a bug; this is the floor that makes the
   * beat deliberate on a warm cache.
   */
  floorMs: 2400,
  /**
   * …and never waits past it, however slow. The Spline scene is roughly a
   * megabyte of runtime plus geometry, so on a bad connection it is the long
   * pole by a wide margin. Past this the sequence proceeds regardless and the
   * core arrives late into an already-resolved page — which is a far smaller
   * failure than an intro that appears to hang.
   */
  ceilingMs: 4600,
  /** The portal expansion. The plates finish well inside this; see BootCurtain. */
  openMs: 1250,
  /**
   * The core alone at centre, between the portal and the resolve.
   *
   * The longest single beat on purpose. Everything before it is chrome arriving;
   * this is the one moment the object is the only thing on the screen, and it is
   * what the portal spent a second and a half opening onto. Cutting away from it
   * quickly wastes the build-up.
   */
  coreMs: 1500,
} as const;

/**
 * Once per tab, not once per visit.
 *
 * A cinematic intro is a first-impression device. Replaying it every time a
 * reader comes back to the home page — from the header logo, from a case study,
 * from the browser's back button — converts the best thing on the site into the
 * most irritating. `sessionStorage` rather than `localStorage` so a genuine
 * return visit tomorrow still gets it.
 */
const SESSION_KEY = "pp:booted";

/** Session state cannot change under a live document, so there is nothing to subscribe to. */
const subscribeToNothing = () => () => {};

function bootedInThisSession() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // Private modes throw on access. Playing the intro every load is the
    // better failure than never playing it at all.
    return false;
  }
}

const notBootedOnServer = () => false;

interface BootContextValue {
  phase: BootPhase;
  /**
   * Whether the intro is running on this page load — false for a repeat visit
   * within the session, for reduced motion, and on every route but home.
   *
   * Distinct from `phase === "complete"`, and consumers need the difference.
   * The hero's 3D core carries Motion's `layout`, which animates between two
   * measured boxes; on a skipped boot the resolved phase arrives in the
   * pre-paint reconciliation that follows hydration, so the core would be
   * measured once at screen centre and once in its column and glide across the
   * page on an ordinary page load. Gating `layout` on this means it only
   * animates when there is genuinely something to glide from.
   */
  intro: boolean;
  /** Report a real load signal. Safe to call more than once. */
  markReady: (signal: BootSignal) => void;
}

/**
 * Defaults to a finished boot, so any consumer rendered outside the provider —
 * a route that never mounts it, a component lifted into isolation — renders its
 * resolved state rather than sitting in a phase that will never advance.
 */
const BootContext = createContext<BootContextValue>({
  phase: "complete",
  intro: false,
  markReady: () => {},
});

export function useBoot() {
  return useContext(BootContext);
}

/**
 * Owns the intro and hands its phase to the page beneath.
 *
 * Mounted in the root layout rather than inside the home page, for one specific
 * reason: `template.tsx` wraps every route in `RouteTransition`, which fades the
 * whole page up from `opacity: 0` on load. A curtain rendered inside that would
 * fade in *with* the page — the reader would get a flash of white before the
 * dark field arrived, which is precisely the frame the curtain exists to
 * prevent. As a sibling of `<main>` it is outside that opacity, and it is in the
 * server-rendered HTML, so the first painted frame is already the intro.
 *
 * The curtain is the provider's own child rather than a context consumer.
 * Nothing else needs the progress value, and passing it down as a prop keeps it
 * a `MotionValue` — the counter animates every frame, and putting that in
 * context would re-render the entire page tree a hundred times during the
 * sequence.
 */
export function BootProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();
  const alreadyBooted = useSyncExternalStore(
    subscribeToNothing,
    bootedInThisSession,
    notBootedOnServer,
  );

  /**
   * The route this document *loaded* on, frozen at first render.
   *
   * Reading `usePathname()` live would replay the intro when a reader navigated
   * from `/about` back to `/`, since that is a client transition into a
   * provider that has been mounted the whole time and never ran. Freezing it
   * means the intro belongs to a page load, which is what it is.
   */
  const pathname = usePathname();
  const [entryPath] = useState(pathname);

  /**
   * `performance.now()` at the client's first render, used as the origin for
   * both the floor and the ceiling. A `useState` initialiser rather than a ref
   * written during render, and close enough to mount for a budget measured in
   * hundreds of milliseconds.
   */
  const [startedAt] = useState(() =>
    typeof performance === "undefined" ? 0 : performance.now(),
  );

  const skipped = alreadyBooted || prefersReduced || entryPath !== "/";

  const [rawPhase, setRawPhase] = useState<BootPhase>("curtain");
  const [ready, setReady] = useState<Partial<Record<BootSignal, boolean>>>({});
  const progress = useMotionValue(0);

  /** Derived, exactly as the hero's old phase was — never a second state kept in sync. */
  const phase: BootPhase = skipped ? "complete" : rawPhase;

  const markReady = useCallback((signal: BootSignal) => {
    setReady((current) => (current[signal] ? current : { ...current, [signal]: true }));
  }, []);

  const skip = useCallback(() => setRawPhase("complete"), []);

  const allReady = SIGNALS.every((signal) => ready[signal]);

  /* ---- Signal: webfonts ------------------------------------------------ */
  useEffect(() => {
    if (skipped) return;
    let live = true;
    // One path, always asynchronous. The fallback is not just defensive
    // tidiness: resolving the signal synchronously here would set state inside
    // an effect body and cascade a render, which is the thing
    // `react-hooks/set-state-in-effect` exists to catch.
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      if (live) markReady("fonts");
    });
    return () => {
      live = false;
    };
  }, [skipped, markReady]);

  /* ---- The counter ------------------------------------------------------
     Two animations, deliberately separate. The ramp always runs, so the number
     is never motionless; the finish only fires once the page is genuinely
     ready. The gap between 92 and 100 is where the real wait lives, and it is
     the only honest way to show one — a bar that reaches 100 and then sits
     there is the tell of a fake loader. */
  useEffect(() => {
    if (skipped || rawPhase !== "curtain") return;
    // A plain ease-out, not the house expo. Expo puts roughly 85 of the 92 into
    // the first half-second and then crawls, which is the count reading as a
    // blur followed by a stall rather than as a number climbing.
    const ramp = animate(progress, 92, { duration: 2.1, ease: "easeOut" });
    return () => ramp.stop();
  }, [skipped, rawPhase, progress]);

  useEffect(() => {
    if (skipped || rawPhase !== "curtain") return;

    let live = true;
    const elapsed = (typeof performance === "undefined" ? 0 : performance.now()) - startedAt;
    // Ready: hold for the remainder of the floor. Not ready: wait out the
    // ceiling. Either way this effect re-runs the moment `allReady` flips, so
    // a page that finishes loading at 300ms reschedules from the ceiling to
    // the floor rather than serving out a timer nobody needs.
    const wait = Math.max(
      0,
      (allReady ? BOOT_TIMING.floorMs : BOOT_TIMING.ceilingMs) - elapsed,
    );

    const timer = window.setTimeout(() => {
      animate(progress, 100, {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
        onComplete: () => {
          if (live) setRawPhase("opening");
        },
      });
    }, wait);

    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [skipped, rawPhase, allReady, startedAt, progress]);

  /* ---- The remaining beats, which are pure timing ---------------------- */
  useEffect(() => {
    if (skipped) return;
    if (rawPhase === "opening") {
      const timer = window.setTimeout(() => setRawPhase("core"), BOOT_TIMING.openMs);
      return () => window.clearTimeout(timer);
    }
    if (rawPhase === "core") {
      const timer = window.setTimeout(() => setRawPhase("complete"), BOOT_TIMING.coreMs);
      return () => window.clearTimeout(timer);
    }
  }, [skipped, rawPhase]);

  /* ---- Escape, and any deliberate scroll, both mean "get out of my way" -- */
  useEffect(() => {
    if (skipped || rawPhase === "complete") return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };
    // Not a scroll lock. Trapping the viewport for four seconds to protect a
    // title card is the wrong trade; a reader who reaches for the wheel has
    // told us what they want, so the intro yields instead of fighting them.
    const onWheel = () => skip();

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onWheel);
    };
  }, [skipped, rawPhase, skip]);

  useEffect(() => {
    if (phase !== "complete") return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Nothing to do — the intro simply plays again next load.
    }
  }, [phase]);

  const value = useMemo(
    () => ({ phase, intro: !skipped, markReady }),
    [phase, skipped, markReady],
  );

  const curtainUp = !skipped && (rawPhase === "curtain" || rawPhase === "opening");

  return (
    <BootContext.Provider value={value}>
      {children}
      {/* Exits on a fade rather than unmounting outright. By that point the
          expanded plate and the page beneath it are both white, so the only
          thing the fade is carrying is the mark itself — which dissolves
          exactly as the 3D core rises into the space it occupied. */}
      <AnimatePresence>
        {curtainUp && (
          <BootCurtain
            key="boot-curtain"
            phase={rawPhase}
            progress={progress}
            ready={ready}
            onSkip={skip}
            onArtReady={() => markReady("art")}
          />
        )}
      </AnimatePresence>
    </BootContext.Provider>
  );
}
