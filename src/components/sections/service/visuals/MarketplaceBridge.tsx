"use client";

import { motion } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import {
  H,
  W,
  beat,
  cq,
  px,
  py,
  ts,
} from "@/components/sections/service/visuals/canvas";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * Two sides, one data model.
 *
 * A vendor plane and a buyer plane, bridged by a core that overlaps both. The
 * overlap is the argument: the thing in the middle is not a service between two
 * apps, it is the schema both sides are views onto.
 *
 * **Fixed from the blueprint.** It placed the connection nodes at `220,260` and
 * `740,260` — inside the side planes — with their leaders at `z:15`, beneath
 * every panel. Since the core overlaps both planes there is no gap for the
 * leaders to show through, so the entire connection would have rendered
 * invisible. The route now runs above the planes through the open band at the
 * top, where there is actually clear space.
 */

const LOOP = 8.5;
const at = (seconds: number) => beat(seconds, LOOP);

/** Waypoints for the sync, in canvas coordinates. Above the planes throughout. */
const ROUTE = {
  vendor: { x: 200, y: 200 },
  coreIn: { x: 300, y: 150 },
  coreOut: { x: 660, y: 150 },
  buyer: { x: 760, y: 200 },
};

export function MarketplaceBridge() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="lg" className="left-[33.333%] top-[25%]" />

      {/* Side planes. Headings sit in the corner the core does not reach. */}
      <SidePlane
        title="Vendor Portal"
        align="left"
        left={60}
        playing={playing}
        float={{ amplitude: 3, period: 16, phase: 0 }}
      >
        <div style={{ display: "grid", gap: cq(8) }}>
          {[
            ["Listings", "1,204"],
            ["Pending review", "18"],
            ["Payout due", "$8,410"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-hair flex justify-between border-b"
              style={{ paddingBottom: cq(7) }}
            >
              <span className="text-ink-soft" style={{ fontSize: ts(11) }}>
                {label}
              </span>
              <span
                className="text-ink tabular-nums"
                style={{ fontSize: ts(11) }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </SidePlane>

      <SidePlane
        title="Buyer Experience"
        align="right"
        left={580}
        playing={playing}
        float={{ amplitude: 3, period: 16, phase: 0.5 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: cq(9),
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="border-hair rounded-md border"
              style={{ padding: cq(7) }}
            >
              <span
                className="bg-brand-100 block rounded"
                style={{ height: cq(20) }}
              />
              <span
                className="bg-hair block rounded-full"
                style={{ height: cq(4), width: "78%", marginTop: cq(6) }}
              />
            </div>
          ))}
        </div>
      </SidePlane>

      {/* The core. Sits over both, and is the only brand-bordered surface. */}
      <FloatPanel
        playing={playing}
        focal
        interactive
        // Gentler than the blueprint's ±8. These three panels overlap heavily,
        // and a larger travel makes the overlap seams visibly slide.
        float={{ amplitude: 3, period: 14, phase: 0.3 }}
        className="absolute overflow-hidden"
        style={{
          left: px(280),
          top: py(100),
          width: px(400),
          height: py(320),
          padding: ts(24),
          borderRadius: "clamp(0.75rem, 3.333cqw, 2rem)",
          borderColor: "var(--color-brand-300)",
          zIndex: 30,
        }}
      >
        <p
          className="text-brand-700 text-center font-medium"
          style={{ fontSize: ts(14) }}
        >
          Core Data Model
        </p>
        <div style={{ display: "grid", gap: cq(9), marginTop: ts(18) }}>
          {[
            ["vendor", "1 : n", "listing"],
            ["listing", "1 : n", "variant"],
            ["order", "n : 1", "buyer"],
            ["payout", "n : 1", "vendor"],
          ].map(([from, rel, to]) => (
            <div
              key={`${from}-${to}`}
              className="border-hair bg-paper flex items-center justify-between rounded-md border"
              style={{ padding: `${cq(8)} ${cq(12)}` }}
            >
              <code className="text-ink-soft" style={{ fontSize: ts(11) }}>
                {from}
              </code>
              <span
                className="text-brand-600 font-medium tabular-nums"
                style={{ fontSize: ts(10) }}
              >
                {rel}
              </span>
              <code className="text-ink-soft" style={{ fontSize: ts(11) }}>
                {to}
              </code>
            </div>
          ))}
        </div>
      </FloatPanel>

      {/* Route and packet, above everything so they are actually visible. */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
        style={{ zIndex: 50 }}
      >
        <path
          d={`M ${ROUTE.vendor.x} ${ROUTE.vendor.y} L ${ROUTE.coreIn.x} ${ROUTE.coreIn.y}`}
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M ${ROUTE.coreOut.x} ${ROUTE.coreOut.y} L ${ROUTE.buyer.x} ${ROUTE.buyer.y}`}
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
          fill="none"
        />
        <circle
          cx={ROUTE.vendor.x}
          cy={ROUTE.vendor.y}
          r={5}
          fill="white"
          stroke="var(--color-brand-300)"
          strokeWidth={1}
        />
        <circle
          cx={ROUTE.buyer.x}
          cy={ROUTE.buyer.y}
          r={5}
          fill="white"
          stroke="var(--color-brand-300)"
          strokeWidth={1}
        />

        <motion.circle
          r={4}
          fill="var(--color-brand-500)"
          initial={false}
          animate={
            playing
              ? {
                  cx: [
                    ROUTE.vendor.x,
                    ROUTE.coreIn.x,
                    ROUTE.coreOut.x,
                    ROUTE.buyer.x,
                    ROUTE.buyer.x,
                  ],
                  cy: [
                    ROUTE.vendor.y,
                    ROUTE.coreIn.y,
                    ROUTE.coreOut.y,
                    ROUTE.buyer.y,
                    ROUTE.buyer.y,
                  ],
                  opacity: [0, 1, 1, 1, 0, 0],
                }
              : { cx: ROUTE.buyer.x, cy: ROUTE.buyer.y, opacity: 0 }
          }
          transition={
            playing
              ? {
                  duration: LOOP,
                  times: [0, at(1.0), at(1.7), at(2.7), 1],
                  repeat: Infinity,
                  ease: "easeInOut",
                  opacity: {
                    duration: LOOP,
                    times: [0, at(0.2), at(2.4), at(2.7), at(2.9), 1],
                    repeat: Infinity,
                  },
                }
              : undefined
          }
        />
      </svg>
    </div>
  );
}

function SidePlane({
  title,
  align,
  left,
  playing,
  float,
  children,
}: {
  title: string;
  align: "left" | "right";
  left: number;
  playing: boolean;
  float: { amplitude: number; period: number; phase: number };
  children: React.ReactNode;
}) {
  // The core spans 280..680 and sits above both side planes, so 100 of each
  // plane's 320 width is permanently covered. Padding the covered side keeps
  // the content in the part the reader can actually see — without it the
  // vendor rows lost their values and the buyer grid lost a column.
  const covered = ts(100);

  return (
    <FloatPanel
      playing={playing}
      float={float}
      className="absolute overflow-hidden"
      style={{
        left: px(left),
        top: py(200),
        width: px(320),
        height: py(240),
        paddingTop: ts(22),
        paddingBottom: ts(22),
        paddingLeft: align === "left" ? ts(22) : covered,
        paddingRight: align === "left" ? covered : ts(22),
        borderRadius: "clamp(0.75rem, 3.333cqw, 2rem)",
        backgroundColor: "var(--color-paper)",
        zIndex: 20,
      }}
    >
      <p
        className="text-ink font-medium"
        style={{
          fontSize: ts(14),
          textAlign: align === "left" ? "left" : "right",
        }}
      >
        {title}
      </p>
      <div style={{ marginTop: ts(16) }}>{children}</div>
    </FloatPanel>
  );
}
