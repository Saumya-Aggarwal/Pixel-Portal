"use client";

import { useRef } from "react";

/**
 * Horizontal swipe → next/previous stop. Vertical motion is left to the page
 * (`touch-pan-y` on the canvas). A swipe suppresses the click that would
 * otherwise fire on pointer-up, so the primary surface does not navigate
 * mid-gesture.
 */
export function usePhoneSwipe(onSwipe: (delta: 1 | -1) => void) {
  const origin = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  return {
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
      origin.current = { x: event.clientX, y: event.clientY };
      swiped.current = false;
    },
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
      if (!origin.current) return;
      const dx = event.clientX - origin.current.x;
      const dy = event.clientY - origin.current.y;
      if (
        !swiped.current &&
        Math.abs(dx) > 40 &&
        Math.abs(dx) > Math.abs(dy) * 1.25
      ) {
        swiped.current = true;
        origin.current = null;
        onSwipe(dx < 0 ? 1 : -1);
      }
    },
    onPointerUp: () => {
      origin.current = null;
    },
    onPointerCancel: () => {
      origin.current = null;
    },
    onClickCapture: (event: React.MouseEvent<HTMLDivElement>) => {
      if (!swiped.current) return;
      event.preventDefault();
      event.stopPropagation();
      swiped.current = false;
    },
  };
}
