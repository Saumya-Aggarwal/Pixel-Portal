"use client";

import { motion, type Transition } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  BUYER_TILES,
  BUYER_TITLE,
  CORE_TITLE,
  LOOP,
  RELATIONS,
  STEP,
  VENDOR_ROWS,
  VENDOR_TITLE,
  at,
  lights,
  type Side,
} from "@/components/sections/service/visuals/marketplaceBridgeShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * Phone stage of the listing-sites-marketplaces depiction.
 *
 * The 960x640 drawing sets a vendor plane and a buyer plane side by side with
 * the core laid across both. At 327px both side titles wrapped out of their
 * panels, the vendor kept one of its three rows, the buyer grid lost most of
 * itself under the core, and the core clipped its fourth relation.
 *
 * **The overlap is the argument, so the overlap survives.** The two views sit
 * side by side — two-sided reads as two things beside each other, never as two
 * things stacked — and the core runs the full width beneath them, over their
 * lower edges. It is the widest surface in the drawing and the only one with a
 * brand border, so it reads as the thing the other two are resting on rather
 * than a third panel in a row. The views carry a deep bottom padding for
 * exactly the amount the core covers, which is the same trick the wide canvas
 * uses on its horizontal axis.
 *
 * **The travelling packet is gone, and what replaces it says more.** A leader
 * needs clear space and this composition has none — the desktop's own route had
 * to be rerouted through the one open band it had left. So instead the core's
 * relations take it in turns, and each one lights the view it surfaces in:
 * `vendor 1:n listing` lights the vendor, `order n:1 buyer` lights the buyer,
 * and `listing 1:n variant` lights both, which is the whole reason the model
 * sits under both rather than between them. A dot travelling a dotted line
 * would have said "these two exchange data", which is the reading the page is
 * arguing against.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 452);

/**
 * Sized at the narrow end, not the design one.
 *
 * `ts` floors at 10px, so every panel here stands taller in canvas units the
 * smaller the canvas gets — the core needs 246 units at a 320 viewport against
 * 226 at 430, and the vendor view 197 against 176. Sized for 375 the core ate
 * its fourth relation and the vendor its payout row.
 */
const VIEW = { y: 20, w: 152, h: 204 };
const VENDOR_X = 20;
const BUYER_X = 188;

const CORE = { x: 20, y: 180, w: 320, h: 252 };

/** How much of each view the core covers, and so how much room to leave under it. */
const COVERED = VIEW.y + VIEW.h - CORE.y;

/**
 * One easing per segment, never one for the sequence.
 *
 * A bare `ease` beside `times` is handed to WAAPI as the easing of the whole
 * effect, so the loop's own clock gets remapped and every offset lands
 * somewhere else. Holds take `linear` because a hold between two identical
 * values has no curve to have.
 */
const HOLD = "linear";

/** When relation `i` holds the floor. */
function turn(index: number): Transition {
  const on = index * STEP + 0.3;
  const off = on + STEP - 0.6;
  return {
    duration: LOOP,
    times: [0, at(on), at(on + 0.35), at(off), at(off + 0.35), 1],
    repeat: Infinity,
    ease: [HOLD, EASE.out, HOLD, "easeInOut", HOLD],
  };
}

const LIT = [0, 0, 1, 1, 0, 0];

export function MarketplaceBridgePhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="lg" className="top-[26%] left-[50%] -translate-x-1/2" />

      <View
        title={VENDOR_TITLE}
        side="vendor"
        x={VENDOR_X}
        playing={playing}
        float={{ amplitude: 3, period: 16, phase: 0 }}
      >
        <span style={{ display: "grid", gap: cq(7) }}>
          {VENDOR_ROWS.map(([label, value]) => (
            <span
              key={label}
              className="border-hair flex justify-between border-b"
              style={{ paddingBottom: cq(6), gap: cq(6) }}
            >
              <span
                className="text-ink-soft truncate"
                style={{ fontSize: ts(10) }}
              >
                {label}
              </span>
              <span
                className="text-ink shrink-0 tabular-nums"
                style={{ fontSize: ts(10) }}
              >
                {value}
              </span>
            </span>
          ))}
        </span>
      </View>

      <View
        title={BUYER_TITLE}
        side="buyer"
        x={BUYER_X}
        playing={playing}
        float={{ amplitude: 3, period: 16, phase: 0.5 }}
      >
        <span
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: cq(7),
          }}
        >
          {Array.from({ length: BUYER_TILES }, (_, i) => (
            <span
              key={i}
              className="border-hair block rounded-md border"
              style={{ padding: cq(5) }}
            >
              <span
                className="bg-brand-100 block rounded"
                style={{ height: cq(16) }}
              />
              <span
                className="bg-hair block rounded-full"
                style={{ height: cq(4), width: "78%", marginTop: cq(5) }}
              />
            </span>
          ))}
        </span>
      </View>

      {/* The core. Under both, wider than either, and the only brand surface. */}
      <FloatPanel
        playing={playing}
        focal
        interactive
        float={{ amplitude: 3, period: 14, phase: 0.3 }}
        className="absolute overflow-hidden"
        style={{
          left: px(CORE.x),
          top: py(CORE.y),
          width: px(CORE.w),
          height: py(CORE.h),
          padding: cq(16),
          borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
          borderColor: "var(--color-brand-300)",
          zIndex: 30,
        }}
      >
        <span
          className="text-brand-700 block text-center font-medium"
          style={{ fontSize: ts(12) }}
        >
          {CORE_TITLE}
        </span>

        <span style={{ display: "grid", gap: cq(8), marginTop: cq(14) }}>
          {RELATIONS.map((relation, i) => (
            <span
              key={`${relation.from}-${relation.to}`}
              className="border-hair bg-paper relative flex items-center justify-between rounded-md border"
              style={{ padding: `${cq(7)} ${cq(11)}` }}
            >
              {/* The lit state, laid over the resting one. Two layers rather
                  than an animated colour: `var()` values do not interpolate. */}
              <motion.span
                aria-hidden
                className="border-brand-300 bg-brand-50 absolute inset-0 rounded-md border"
                initial={false}
                animate={
                  playing ? { opacity: LIT } : { opacity: i === 0 ? 1 : 0 }
                }
                transition={playing ? turn(i) : undefined}
              />
              <code
                className="text-ink-soft relative"
                style={{ fontSize: ts(11) }}
              >
                {relation.from}
              </code>
              <span
                className="text-brand-600 relative font-medium tabular-nums"
                style={{ fontSize: ts(10) }}
              >
                {relation.rel}
              </span>
              <code
                className="text-ink-soft relative"
                style={{ fontSize: ts(11) }}
              >
                {relation.to}
              </code>
            </span>
          ))}
        </span>
      </FloatPanel>
    </div>
  );
}

/**
 * One side's view onto the model.
 *
 * The bottom padding is the amount the core covers. Without it the vendor's
 * last row and the buyer's last tile row sit behind the core — which is the
 * failure the wide canvas already solved on its own axis, and the reason its
 * `SidePlane` pads the covered side rather than centring its content.
 *
 * The ring is a second border laid inside the panel's own, so a view can light
 * without its outline shifting by a pixel as it does.
 */
function View({
  title,
  side,
  x,
  playing,
  float,
  children,
}: {
  title: string;
  side: Side;
  x: number;
  playing: boolean;
  float: { amplitude: number; period: number; phase: number };
  children: React.ReactNode;
}) {
  return (
    <FloatPanel
      playing={playing}
      float={float}
      className="absolute overflow-hidden"
      style={{
        left: px(x),
        top: py(VIEW.y),
        width: px(VIEW.w),
        height: py(VIEW.h),
        paddingTop: cq(13),
        paddingLeft: cq(13),
        paddingRight: cq(13),
        paddingBottom: cq(COVERED + 6),
        borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
        backgroundColor: "var(--color-paper)",
        zIndex: 20,
      }}
    >
      {RELATIONS.map((relation, i) =>
        lights(relation, side) ? (
          <motion.span
            key={`${relation.from}-${relation.to}`}
            aria-hidden
            className="border-brand-300 pointer-events-none absolute inset-0 border"
            style={{ borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)" }}
            initial={false}
            animate={playing ? { opacity: LIT } : { opacity: i === 0 ? 1 : 0 }}
            transition={playing ? turn(i) : undefined}
          />
        ) : null,
      )}

      <span
        className="text-ink block truncate font-medium"
        style={{ fontSize: ts(11) }}
      >
        {title}
      </span>
      <span className="block" style={{ marginTop: cq(11) }}>
        {children}
      </span>
    </FloatPanel>
  );
}
