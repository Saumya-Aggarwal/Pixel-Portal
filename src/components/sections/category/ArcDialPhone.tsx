"use client";

import Link from "next/link";
import { motion, useTransform, type MotionValue } from "motion/react";

import {
  useScrubPlayhead,
  useStopIndex,
} from "@/components/sections/category/useScrubPlayhead";
import { usePhoneSwipe } from "@/components/sections/category/usePhoneSwipe";
import {
  SPEC_ROWS,
  STATIONS,
  STOPS,
  hrefFor,
} from "@/components/sections/category/arcDialShared";
import { createCanvas } from "@/components/sections/service/visuals/canvas";

/**
 * Phone stage of the website-development hero.
 *
 * The desktop piece hangs five cards on a 1440-wide arc. A 360 column cannot
 * hold an arc, and shrinking one produces five illegible cards on a curve, so
 * the arc is gone. What survives is the argument it was carrying: **one window
 * that becomes what each service ships.** The window is now the whole primary,
 * the five services collapse into a touch stepper above it, and the spec strip
 * moves underneath as the persistent secondary.
 *
 * That makes the composition read differently from the marketing phone stage
 * on purpose — A is a station card over a ledger, B is a browser over a spec
 * table — even though both run the same playhead, the same stepper mechanics
 * and the same 640-unit height.
 *
 * **Departures from the mobile blueprint, all for one reason: a labelled empty
 * box is the failure mode.**
 *
 * - Every interior is recomposed from the shipped desktop mock rather than
 *   scaled down — real nav items, real prices, the real JSON body. The
 *   blueprint's fifth view was specified as a truncated line and had to be
 *   rebuilt from the desktop Marketplace.
 * - Its spec strip is four label/value rows and nothing else, which never names
 *   the service the window links to. The station title and its stat lead the
 *   strip, so a parked playhead says what it is and what tapping it opens.
 * - The three-width stop does not hard-code three frame heights. The same six
 *   cards run at three / two / one columns, so each frame is taller than the
 *   last because it is narrower — the service drawn rather than asserted.
 * - Filters at stop five are a chip row, not the desktop's 200-wide rail. A
 *   rail eats two thirds of a 288-unit body and leaves no results to filter.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 640);

const WINDOW = { x: 20, y: 100, w: 320, h: 340 };
const CHROME_H = 36;
const BODY_H = WINDOW.h - CHROME_H;
const SPEC = { x: 20, y: 460, w: 320, h: 160 };

/** Stepper hitboxes are 72 wide and tile the canvas; these are their centres. */
const NODE_CX = [36, 108, 180, 252, 324] as const;

/** Interior inset. Leaves a 288 x 272 body for the mocks. */
const PAD = 16;

/**
 * Half-width of a layer's opacity ramp, narrower than `SPAN` on purpose.
 *
 * Ramping across a full stop-to-stop span (0.25) puts both layers at 50% for most of the travel,
 * which is fine for the window's blocks and awful for the spec strip: two
 * 13px strings at half opacity read as one struck-through string. At 0.16 the
 * layers only overlap for the middle fifth of the travel and peak at ~22% each,
 * so a value looks like it is being refreshed rather than double-printed —
 * still without a frame where the strip is blank.
 */
const RAMP = 0.16;

/**
 * `ts` with a 12px floor rather than 10.
 *
 * The stepper label is the only navigation in the piece, and the canvas maps to
 * roughly 0.9 CSS pixels per unit on a 375 viewport — so `ts(12)` would land it
 * at 10.9px, under the floor the mobile brief sets for a readable label. Above
 * ~480 the cqw term wins and it scales with everything else.
 */
const nav = (v: number) => `max(0.75rem, ${((v / W) * 100).toFixed(3)}cqw)`;

export function ArcDialPhone() {
  const { ref, t, nudge, lockTo } = useScrubPlayhead<HTMLDivElement>({
    stops: STATIONS.length,
    dwell: 3,
    travel: 0.6,
    settle: 4,
    autoplayTouch: true,
    rewindJump: true,
  });

  const stop = useStopIndex(t, STATIONS.length);
  const active = STATIONS[stop];
  const swipe = usePhoneSwipe(nudge);

  /**
   * The glow pools under the active stop. Translated as a percentage of its own
   * width rather than moved by `left`, so the only thing changing per frame is
   * a composited transform.
   */
  const glowX = useTransform(t, (v) => `${v * 120}%`);

  return (
    <div
      ref={ref}
      {...swipe}
      className="@container relative w-full touch-pan-y"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <span
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_70%_70%_at_50%_40%,black,transparent)]"
      />
      <motion.span
        aria-hidden
        className="bg-brand-200/30 pointer-events-none absolute rounded-full blur-3xl"
        style={{
          width: cq(240),
          height: cq(240),
          top: cq(30),
          left: cq(-84),
          x: glowX,
        }}
      />

      <Stepper t={t} stop={stop} onSelect={lockTo} />

      {/* ---- The window. One link, whatever it currently contains. ---- */}
      <Link
        href={hrefFor(active.slug)}
        aria-label={`${active.title} — ${active.lines[0]}`}
        // A mouse drag on an anchor starts the browser's native link drag,
        // which cancels the pointer stream the swipe is reading. Phones never
        // hit this; a narrow desktop window does.
        draggable={false}
        className="border-hair focus-visible:outline-brand-400 absolute block overflow-hidden border bg-white focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{
          left: px(WINDOW.x),
          top: py(WINDOW.y),
          width: px(WINDOW.w),
          height: py(WINDOW.h),
          borderRadius: "1.25rem",
          boxShadow: "var(--shadow-float-hover)",
          zIndex: 30,
        }}
      >
        <span
          aria-hidden
          className="border-hair bg-paper flex items-center border-b"
          style={{ height: cq(CHROME_H), padding: `0 ${cq(14)}`, gap: cq(6) }}
        >
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="bg-hair block rounded-full"
              style={{ width: cq(7), height: cq(7) }}
            />
          ))}
          <span
            className="border-hair text-muted truncate rounded-full border bg-white"
            style={{
              fontSize: ts(11),
              padding: `${cq(3)} ${cq(12)}`,
              marginLeft: cq(10),
            }}
          >
            pixelportal.in
          </span>
        </span>

        {/* Every view is mounted at inset 0 and crossfaded, so the chrome never
            moves and an exiting interior never stacks under the entering one. */}
        <span
          aria-hidden
          className="relative block"
          style={{ height: cq(BODY_H) }}
        >
          {STATIONS.map((station, i) => (
            <Fade
              key={station.slug}
              t={t}
              index={i}
              className="absolute inset-0 block"
            >
              <View index={i} />
            </Fade>
          ))}
        </span>
      </Link>

      <SpecStrip t={t} />
    </div>
  );
}

/* --------------------------------------------------------------- stepper ---- */

function Stepper({
  t,
  stop,
  onSelect,
}: {
  t: MotionValue<number>;
  stop: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Website services"
      className="absolute"
      style={{ left: px(0), top: py(20), width: px(360), height: py(80) }}
    >
      {/* Offsets inside this box are `cq`, never `py`: a percentage here would
          resolve against the 80-unit stepper rather than the canvas, which is
          how a track meant for y=40 lands at y=21 and half a pixel tall. On the
          node centre line, so it runs through the nodes rather than below. */}
      <span
        aria-hidden
        className="bg-hair absolute overflow-hidden"
        style={{
          left: cq(36),
          top: cq(20),
          width: cq(288),
          height: cq(2),
          zIndex: 10,
        }}
      >
        <motion.span
          className="bg-brand-400 absolute inset-0 origin-left"
          style={{ scaleX: t }}
        />
      </span>

      {STATIONS.map((station, i) => {
        const current = stop === i;
        return (
          <button
            key={station.slug}
            type="button"
            aria-current={current ? "true" : undefined}
            aria-label={station.title}
            onClick={() => onSelect(i)}
            className="focus-visible:outline-brand-400 absolute focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              left: cq(NODE_CX[i] - 36),
              top: 0,
              width: cq(72),
              height: cq(80),
              zIndex: 20,
            }}
          >
            <span
              aria-hidden
              className={
                current
                  ? "bg-brand-500 absolute block -translate-x-1/2 rounded-full"
                  : "border-hair bg-paper absolute block -translate-x-1/2 rounded-full border"
              }
              style={{
                left: "50%",
                top: cq(15),
                width: cq(12),
                height: cq(12),
              }}
            />
            <span
              className={
                current
                  ? "text-brand-700 absolute inset-x-0 text-center font-semibold"
                  : "text-ink absolute inset-x-0 text-center"
              }
              style={{ top: cq(40), fontSize: nav(12), lineHeight: cq(16) }}
            >
              {station.stepper}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------- crossfade ---- */

/**
 * One layer of a stack that crossfades with the playhead.
 *
 * Opacity is a `useTransform` off `t` rather than a swap on the stop index, so
 * every intermediate frame of the 0.6s travel is a real blend of two legible
 * states and React never re-renders during it. Layers are stacked in a fixed
 * box, which is what keeps a changing string from reflowing the strip.
 *
 * The ramp runs a full `SPAN` either side of the stop, so stop one is already
 * opaque at `t = 0` and stop five still is at `t = 1` without either end
 * needing its own keyframe track.
 */
function Fade({
  t,
  index,
  className,
  style,
  children,
}: {
  t: MotionValue<number>;
  index: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const at = STOPS[index];
  const opacity = useTransform(t, [at - RAMP, at, at + RAMP], [0, 1, 0]);

  return (
    <motion.span
      aria-hidden
      className={className}
      style={{ ...style, opacity, pointerEvents: "none" }}
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------ spec strip ---- */

function SpecStrip({ t }: { t: MotionValue<number> }) {
  return (
    <div
      aria-hidden
      className="border-hair absolute flex flex-col border bg-white"
      style={{
        left: px(SPEC.x),
        top: py(SPEC.y),
        width: px(SPEC.w),
        height: py(SPEC.h),
        padding: cq(18),
        borderRadius: "1.25rem",
        boxShadow: "var(--shadow-float)",
        zIndex: 30,
      }}
    >
      {/* Names the service the window is a link to, and carries its one figure.
          Four anonymous rows never say what you are looking at. */}
      <span className="relative block" style={{ height: cq(22) }}>
        {STATIONS.map((station, i) => (
          <Fade
            key={station.slug}
            t={t}
            index={i}
            className="absolute inset-0 flex items-baseline justify-between"
          >
            <span
              className="text-ink truncate font-medium"
              style={{ fontSize: ts(14), lineHeight: cq(20) }}
            >
              {station.title}
            </span>
            <span
              className="flex shrink-0 items-baseline"
              style={{ gap: cq(6) }}
            >
              <span className="text-muted" style={{ fontSize: ts(11) }}>
                {station.stat[0]}
              </span>
              <span
                className="font-display text-brand-600 leading-none font-semibold tabular-nums"
                style={{ fontSize: ts(17) }}
              >
                {station.stat[1]}
              </span>
            </span>
          </Fade>
        ))}
      </span>

      <span style={{ display: "grid", gap: cq(8), marginTop: cq(16) }}>
        {SPEC_ROWS.map((row) => (
          <span
            key={row.label}
            className="flex items-center"
            style={{ height: cq(15) }}
          >
            <span
              className="text-muted shrink-0"
              style={{ width: cq(102), fontSize: ts(12) }}
            >
              {row.label}
            </span>
            <span className="relative block flex-1" style={{ height: cq(15) }}>
              {row.values.map((value, i) => (
                <Fade
                  key={value}
                  t={t}
                  index={i}
                  className="text-ink absolute inset-0 truncate font-medium tabular-nums"
                  style={{ fontSize: ts(13), lineHeight: cq(15) }}
                >
                  {value}
                </Fade>
              ))}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------- views ---- */

const Bar = ({ w, h = 5 }: { w: string; h?: number }) => (
  <span
    className="bg-hair block rounded-full"
    style={{ width: w, height: cq(h) }}
  />
);

function View({ index }: { index: number }) {
  if (index === 0) return <Corporate />;
  if (index === 1) return <Responsive />;
  if (index === 2) return <Commerce />;
  if (index === 3) return <Headless />;
  return <Marketplace />;
}

/** Stop 1. Three columns crush at 288, so it is one featured card over two. */
function Corporate() {
  return (
    <span className="flex h-full flex-col" style={{ padding: cq(PAD) }}>
      <span
        className="border-hair flex items-center justify-between border-b"
        style={{ paddingBottom: cq(10) }}
      >
        <span
          className="bg-brand-600 block shrink-0 rounded-sm"
          style={{ width: cq(16), height: cq(16) }}
        />
        <span className="flex" style={{ gap: cq(11) }}>
          {["Company", "Work", "Insights", "Contact"].map((item) => (
            <span
              key={item}
              className="text-ink-soft"
              style={{ fontSize: ts(11) }}
            >
              {item}
            </span>
          ))}
        </span>
      </span>

      <span
        className="font-display text-ink block font-semibold tracking-tight"
        style={{ fontSize: ts(19), lineHeight: 1.2, marginTop: cq(14) }}
      >
        Infrastructure for regulated industries.
      </span>

      <span
        className="border-hair block rounded-lg border bg-white"
        style={{ padding: cq(11), marginTop: cq(16) }}
      >
        <span
          className="bg-brand-50 block rounded-md"
          style={{ height: cq(30) }}
        />
        <span
          className="text-ink block font-medium"
          style={{ fontSize: ts(12), marginTop: cq(8) }}
        >
          Capabilities
        </span>
        <span style={{ display: "grid", gap: cq(5), marginTop: cq(6) }}>
          <Bar w="92%" h={4} />
          <Bar w="64%" h={4} />
        </span>
      </span>

      <span
        className="mt-auto"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: cq(12),
        }}
      >
        {["Case studies", "Leadership"].map((card) => (
          <span
            key={card}
            className="border-hair block rounded-lg border bg-white"
            style={{ padding: cq(10) }}
          >
            <span
              className="bg-brand-50 block rounded-md"
              style={{ height: cq(14) }}
            />
            <span
              className="text-ink block font-medium"
              style={{ fontSize: ts(11), marginTop: cq(8) }}
            >
              {card}
            </span>
            <span style={{ marginTop: cq(6) }}>
              <Bar w="70%" h={4} />
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Stop 2. Six cards at three, two and one columns.
 *
 * The frames are not given heights: each one is as tall as its own column count
 * makes it, which is the whole claim the service makes. Hard-coding 180 / 240 /
 * 260 would draw the same picture and mean nothing.
 */
const WIDTHS = [
  { label: "1440px", cols: 3 },
  { label: "768px", cols: 2 },
  { label: "375px", cols: 1 },
] as const;

function Responsive() {
  return (
    <span
      className="block h-full"
      style={{
        padding: cq(PAD),
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1.15fr",
        gap: cq(11),
        alignItems: "start",
      }}
    >
      {WIDTHS.map((view, i) => {
        const narrow = i === WIDTHS.length - 1;
        return (
          <span key={view.label} className="block">
            <span
              className={
                narrow
                  ? "text-brand-700 block font-medium tabular-nums"
                  : "text-muted block tabular-nums"
              }
              style={{ fontSize: ts(11) }}
            >
              {view.label}
            </span>
            <span
              className={
                narrow
                  ? "border-brand-300 block rounded-lg border bg-white"
                  : "border-hair bg-paper block rounded-lg border"
              }
              style={{ padding: cq(8), marginTop: cq(7) }}
            >
              <span className="flex items-center justify-between">
                <span
                  className="bg-hair block shrink-0 rounded-full"
                  style={{ width: cq(5), height: cq(5) }}
                />
                <span className="flex" style={{ gap: cq(2) }}>
                  {[0, 1, 2].map((line) => (
                    <span
                      key={line}
                      className="bg-hair block rounded-full"
                      style={{ width: cq(6), height: cq(2) }}
                    />
                  ))}
                </span>
              </span>
              <span
                className="bg-brand-50 block rounded-sm"
                style={{ height: cq(29), marginTop: cq(9) }}
              />
              <span style={{ display: "grid", gap: cq(4), marginTop: cq(9) }}>
                <Bar w="88%" h={3} />
                <Bar w="58%" h={3} />
              </span>
              <span
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${view.cols}, 1fr)`,
                  gap: cq(5),
                  marginTop: cq(9),
                }}
              >
                {Array.from({ length: 6 }).map((_, card) => (
                  <span
                    key={card}
                    className="border-hair block rounded-sm border bg-white"
                    style={{ height: cq(22) }}
                  />
                ))}
              </span>
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Stop 3. Four across does not fit; two by two does. */
function Commerce() {
  return (
    <span className="flex h-full flex-col" style={{ padding: cq(PAD) }}>
      <span className="flex items-center justify-between">
        <span className="flex items-center" style={{ gap: cq(12) }}>
          {["All", "New in", "Sale"].map((tab, i) => (
            <span
              key={tab}
              className={i === 0 ? "text-ink font-medium" : "text-muted"}
              style={{ fontSize: ts(12) }}
            >
              {tab}
            </span>
          ))}
        </span>
        <span
          className="bg-brand-600 grid shrink-0 place-items-center rounded-full font-medium text-white"
          style={{ height: cq(24), padding: `0 ${cq(13)}`, fontSize: ts(11) }}
        >
          Cart · 3
        </span>
      </span>

      <span
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: cq(12),
          marginTop: cq(12),
        }}
      >
        {["$299", "$189", "$420", "$95"].map((price) => (
          <span
            key={price}
            className="border-hair block rounded-lg border bg-white"
            style={{ padding: cq(9) }}
          >
            <span
              className="bg-brand-50 block rounded-md"
              style={{ height: cq(38) }}
            />
            <span
              className="flex items-baseline justify-between"
              style={{ marginTop: cq(8) }}
            >
              <Bar w="48%" h={4} />
              <span
                className="text-ink font-medium tabular-nums"
                style={{ fontSize: ts(12) }}
              >
                {price}
              </span>
            </span>
          </span>
        ))}
      </span>

      {/* The footer copy is two lines rather than one: the whole string at 11px
          plus a Checkout chip is 30 units wider than the body. */}
      <span
        className="border-hair mt-auto flex items-end justify-between border-t"
        style={{ paddingTop: cq(11), gap: cq(10) }}
      >
        <span className="min-w-0">
          <span className="text-muted block" style={{ fontSize: ts(11) }}>
            Free delivery over $150
          </span>
          <span
            className="text-muted block tabular-nums"
            style={{ fontSize: ts(11), marginTop: cq(3) }}
          >
            1,200 SKUs in stock
          </span>
        </span>
        <span
          className="border-brand-300 text-brand-700 grid shrink-0 place-items-center rounded-full border bg-white font-medium"
          style={{ height: cq(24), padding: `0 ${cq(13)}`, fontSize: ts(11) }}
        >
          Checkout
        </span>
      </span>
    </span>
  );
}

/**
 * Stop 4, the one that has to divide and still read as one window.
 *
 * Desktop seams it vertically. At 288 that leaves 132 a side, which is not a
 * JSON body and not a rendered page — so the seam turns horizontal. The chrome
 * above is untouched and the crossfade happens inside it, so what the reader
 * sees is this window growing a boundary, not a different component arriving.
 * The rule is full-bleed for the same reason: a seam with padding either end is
 * a divider inside a panel, not a division of it.
 */
const API_BODY = [
  `{`,
  `  "title": "Q4 Launch",`,
  `  "hero": "v2-final.jpg",`,
  `  "body": [ … ],`,
  `  "cta": "/signup"`,
  `}`,
];

function Headless() {
  return (
    <span className="flex h-full flex-col">
      <span
        className="bg-paper flex flex-col"
        style={{ padding: `${cq(12)} ${cq(PAD)} ${cq(9)}` }}
      >
        <span
          className="text-brand-700 font-medium"
          style={{ fontSize: ts(12) }}
        >
          GET /api/v1/content
        </span>
        <span
          className="font-mono"
          style={{ display: "grid", gap: cq(2), marginTop: cq(8) }}
        >
          {API_BODY.map((line) => (
            <span
              key={line}
              className="text-ink-soft overflow-hidden whitespace-pre"
              style={{ fontSize: ts(11), lineHeight: cq(12) }}
            >
              {line}
            </span>
          ))}
        </span>
      </span>

      <span className="bg-hair block shrink-0" style={{ height: 1 }} />

      <span
        className="flex flex-1 flex-col bg-white"
        style={{ padding: `${cq(12)} ${cq(PAD)} ${cq(14)}` }}
      >
        <span className="text-muted" style={{ fontSize: ts(11) }}>
          Rendered surface
        </span>
        <span
          className="bg-brand-50 block rounded-md"
          style={{ height: cq(36), marginTop: cq(9) }}
        />
        <span
          className="text-ink block font-medium"
          style={{ fontSize: ts(14), marginTop: cq(10) }}
        >
          Q4 Launch
        </span>
        <span style={{ display: "grid", gap: cq(5), marginTop: cq(8) }}>
          <Bar w="94%" h={4} />
          <Bar w="70%" h={4} />
        </span>
        <span
          className="bg-brand-600 mt-auto grid place-items-center rounded-full font-medium text-white"
          style={{ height: cq(24), width: cq(96), fontSize: ts(11) }}
        >
          Sign up
        </span>
      </span>
    </span>
  );
}

/** Stop 5. The rail becomes a chip row so there is a column left to fill. */
const VENDORS = [
  ["Meridian Supply", "4.9", "128 listings"],
  ["Atlas Trading Co.", "4.7", "94 listings"],
  ["Northwind Depot", "4.6", "61 listings"],
  ["Harbour & Co.", "4.8", "77 listings"],
] as const;

function Marketplace() {
  return (
    <span className="flex h-full flex-col" style={{ padding: cq(PAD) }}>
      <span
        className="flex items-center justify-between"
        style={{ gap: cq(10) }}
      >
        <span
          className="border-hair bg-paper flex shrink-0 rounded-full border"
          style={{ padding: cq(3) }}
        >
          {["Vendor", "Buyer"].map((side, i) => (
            <span
              key={side}
              className={
                i === 0
                  ? "text-brand-800 grid place-items-center rounded-full bg-white font-medium"
                  : "text-muted grid place-items-center rounded-full"
              }
              style={{
                height: cq(22),
                padding: `0 ${cq(14)}`,
                fontSize: ts(11),
              }}
            >
              {side}
            </span>
          ))}
        </span>
        <span className="text-muted truncate" style={{ fontSize: ts(11) }}>
          Gurugram · 2m ago
        </span>
      </span>

      <span className="flex" style={{ gap: cq(7), marginTop: cq(14) }}>
        {[
          ["Verified", true],
          ["Same day", false],
          ["4.5+ rating", false],
        ].map(([filter, on]) => (
          <span
            key={String(filter)}
            className="border-hair bg-paper flex items-center rounded-full border"
            style={{ height: cq(22), padding: `0 ${cq(9)}`, gap: cq(6) }}
          >
            <span
              className={
                on
                  ? "bg-brand-500 block shrink-0 rounded-sm"
                  : "border-hair block shrink-0 rounded-sm border bg-white"
              }
              style={{ width: cq(8), height: cq(8) }}
            />
            <span className="text-ink-soft" style={{ fontSize: ts(11) }}>
              {String(filter)}
            </span>
          </span>
        ))}
      </span>

      <span style={{ display: "grid", gap: cq(8), marginTop: cq(14) }}>
        {VENDORS.map(([name, rating, listings]) => (
          <span
            key={name}
            className="border-hair flex items-center rounded-lg border bg-white"
            style={{ height: cq(42), padding: `0 ${cq(11)}`, gap: cq(9) }}
          >
            <span
              className="bg-brand-100 block shrink-0 rounded-full"
              style={{ width: cq(20), height: cq(20) }}
            />
            <span
              className="text-ink truncate font-medium"
              style={{ fontSize: ts(12) }}
            >
              {name}
            </span>
            <span
              className="text-muted ml-auto shrink-0 tabular-nums"
              style={{ fontSize: ts(11) }}
            >
              {listings}
            </span>
            <span
              className="text-brand-700 shrink-0 font-medium tabular-nums"
              style={{ fontSize: ts(11) }}
            >
              ★ {rating}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
