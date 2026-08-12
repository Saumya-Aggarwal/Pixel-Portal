"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { BrowserChrome } from "@/components/sections/service/visuals/chrome/BrowserChrome";
import { usePointerTilt } from "@/components/sections/service/visuals/usePointerTilt";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * The purchase, start to finish.
 *
 * Four beats — browse, add, checkout, confirmed — because the argument the
 * e-commerce page makes is that most revenue is lost *between* the cart and the
 * confirmation, and a picture that stops at "add to cart" would be arguing the
 * opposite.
 *
 * This is the one depiction driven by a state machine rather than a single
 * looping transition. The beats are discrete and each has different content on
 * screen, so a timer stepping an index is both simpler and more legible than
 * four overlapping keyframe tracks. The interval is torn down whenever playback
 * stops, so an off-screen picture costs nothing.
 */

const BEATS = ["browse", "add", "checkout", "done"] as const;
type Beat = (typeof BEATS)[number];

const BEAT_MS = 1900;

export function CartToCheckout() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();
  const { ref: tiltRef, style, handlers } = usePointerTilt<HTMLDivElement>();
  const [tick, setTick] = useState(0);

  // The interval only advances a counter; the beat is derived below. Setting
  // the beat directly from here would mean a setState in the effect body,
  // which cascades a render on every mount and pause.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTick((t) => t + 1), BEAT_MS);
    return () => clearInterval(id);
  }, [playing]);

  // Paused readers land on "checkout" — the beat showing the most of the story
  // at once, and the one the page's copy is actually about.
  const beat: Beat = playing ? BEATS[tick % BEATS.length] : "checkout";
  const cartCount = beat === "browse" || beat === "done" ? 0 : 1;

  return (
    <div
      ref={tiltRef}
      {...handlers}
      className="flex h-full items-center justify-center px-6 py-6 lg:px-12"
      style={{ perspective: 1200 }}
    >
      <motion.div ref={ref} style={style} className="w-full max-w-xl">
        <BrowserChrome url="shop.example.com" className="h-56 lg:h-64">
          <div className="relative flex h-full flex-col">
            <div className="border-hair flex shrink-0 items-center justify-between border-b px-3 py-2">
              <span className="bg-hair h-2 w-14 rounded-full" />
              <CartBadge count={cartCount} />
            </div>

            <div className="relative min-h-0 flex-1 p-3">
              <div className="grid h-full grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="border-hair overflow-hidden rounded-md border bg-white">
                    <div className="bg-brand-50 relative h-1/2 min-h-10">
                      {/* The tile that travels. `layoutId` hands the same box
                          to the cart badge, so Motion interpolates the flight
                          instead of us animating coordinates by hand. */}
                      {i === 1 && beat === "browse" && (
                        <motion.span
                          layoutId="product"
                          className="bg-brand-400 absolute inset-2 rounded"
                        />
                      )}
                      {i !== 1 && <span className="bg-brand-100 absolute inset-2 rounded" />}
                    </div>
                    <div className="space-y-1 p-1.5">
                      <span className="bg-hair block h-1.5 w-full rounded-full" />
                      <span className="bg-hair block h-1.5 w-2/3 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {(beat === "checkout" || beat === "done") && (
                  <motion.div
                    key="checkout"
                    className="border-hair absolute inset-y-0 right-0 w-1/2 border-l bg-white p-3 shadow-(--shadow-lift)"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.5, ease: EASE.out }}
                  >
                    {beat === "checkout" ? <CheckoutForm /> : <Confirmed />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </BrowserChrome>
      </motion.div>
    </div>
  );
}

function CartBadge({ count }: { count: number }) {
  return (
    <span className="relative inline-flex items-center gap-1.5">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="text-ink-soft">
        <path d="M3 4h2l2.4 10.4A2 2 0 0 0 9.35 16h7.9a2 2 0 0 0 1.95-1.55L21 7H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      <AnimatePresence mode="popLayout">
        {count > 0 && (
          <motion.span
            layoutId="product"
            className="bg-brand-600 flex size-4 items-center justify-center rounded-full text-[0.5625rem] leading-none font-semibold text-white"
            transition={{ duration: 0.55, ease: EASE.out }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function CheckoutForm() {
  return (
    <div className="space-y-2">
      <p className="text-ink text-[0.6875rem] leading-none font-semibold">Checkout</p>
      {["Email", "Card number", "Address"].map((field) => (
        <div key={field} className="border-hair rounded border px-1.5 py-1.5">
          <span className="text-muted block text-[0.5625rem] leading-none">{field}</span>
          <span className="bg-hair mt-1 block h-1.5 w-3/4 rounded-full" />
        </div>
      ))}
      <span className="bg-brand-600 mt-1 block h-5 rounded-full" />
    </div>
  );
}

function Confirmed() {
  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-2 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE.out }}
    >
      <span className="bg-brand-50 text-brand-700 flex size-8 items-center justify-center rounded-full text-[0.875rem] font-semibold">
        ✓
      </span>
      <p className="text-ink text-[0.6875rem] leading-none font-semibold">Order confirmed</p>
      <p className="text-muted text-[0.5625rem] leading-none">#PX-40917</p>
    </motion.div>
  );
}
