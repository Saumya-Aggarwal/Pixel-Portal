"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import {
  useScrubPlayhead,
  useStopIndex,
} from "@/components/sections/category/useScrubPlayhead";
import { ArcDialPhone } from "@/components/sections/category/ArcDialPhone";
import {
  SPEC_ROWS,
  STATIONS,
  hrefFor,
} from "@/components/sections/category/arcDialShared";
import { createCanvas } from "@/components/sections/service/visuals/canvas";

/**
 * One build capability, seen from five angles.
 *
 * Five services on an arc sweeping over a single browser window, and the window
 * becomes whatever the service under the playhead ships. The playhead is an
 * angle rather than a position, which is what keeps this from being a second
 * reading of the digital-marketing rail.
 *
 * A full ellipse was tried first and does not close on a 2:1 canvas: a ring
 * inscribed in a wide rectangle strands all four corners at roughly 72% negative
 * space, and the stations near the horizontal push so far out in x that widening
 * the radii to clear the window sends the outer cards off-canvas while narrowing
 * them crushes the window to about 300 units square. An arc spans the full width
 * and leaves an uninterrupted band beneath for a window wide enough to hold a
 * legible interface.
 *
 * **Fixes to the blueprint.**
 *
 * `station-1` was specified at `31, 85`, which puts its centre at y=160 — not on
 * the arc, and 316 units above where the blueprint's own state table parks the
 * marker at t=0. Its clearance table also only makes sense with the card beside
 * the window rather than above it. Every card position is derived from its angle
 * here, so the class of error cannot recur.
 *
 * The order was arbitrary and is now a scope ladder, with e-commerce at the apex
 * because the apex is the dominant position and the page is headed "commercial
 * weight". It lives in `arcDialShared` now, since the phone stage reads it in
 * the same order without an apex to justify it.
 *
 * The narrow stop drew a 320-wide column inside a 912-wide window and called the
 * remaining 592 units negative space. Three width columns fill it instead, which
 * is also a truer picture of what that service does.
 *
 * Below `md` none of this survives a 360-wide column, and `ArcDialPhone` takes
 * over with a stepper over the same window.
 */

const { W, H, px, py, ts, cq } = createCanvas(1440, 720);

const ARC = { cx: 720, cy: 640, rx: 620, ry: 480, from: 200, to: 340 };
const CARD = { w: 192, h: 200 };
const WINDOW = { x: 253, y: 367, w: 934, h: 323 };
const CHROME_H = 40;
const SPEC = { x: 490, y: 280, w: 460, h: 67 };

const point = (deg: number) => {
  const r = (deg * Math.PI) / 180;
  return { x: ARC.cx + ARC.rx * Math.cos(r), y: ARC.cy + ARC.ry * Math.sin(r) };
};

const STEP = (ARC.to - ARC.from) / (STATIONS.length - 1);
const angleAt = (i: number) => ARC.from + i * STEP;

const start = point(ARC.from);
const end = point(ARC.to);
/** 140° of sweep, so never a large arc; left to right over the top is clockwise. */
const ARC_D = `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${ARC.rx} ${ARC.ry} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;

const MAGNET_RADIUS = 150;
const MAGNET_PULL = 8;

const BODY = { w: WINDOW.w, h: WINDOW.h - CHROME_H };
/** 20, not 24: the taller cards bought their height from the window body. */
const PAD = 20;

export function ArcDial() {
  return (
    <>
      <div className="md:hidden">
        <ArcDialPhone />
      </div>
      <div className="hidden md:block">
        <ArcDialDesktop />
      </div>
    </>
  );
}

function ArcDialDesktop() {
  const {
    ref,
    t,
    pointerX,
    pointerY,
    pointerActive,
    interactive,
    handlers,
    lockTo,
    release,
  } = useScrubPlayhead<HTMLDivElement>({ stops: STATIONS.length });

  const stop = useStopIndex(t, STATIONS.length);
  const field = useSpring(pointerActive ? 1 : 0, {
    stiffness: 60,
    damping: 20,
  });

  const gridX = useTransform(pointerX, (v) => `${(v - 0.5) * 2 * 0.972}%`);
  const dash = useTransform(t, (v) => 1 - v);

  const markerX = useTransform(
    t,
    (v) => point(ARC.from + v * (ARC.to - ARC.from)).x,
  );
  const markerY = useTransform(
    t,
    (v) => point(ARC.from + v * (ARC.to - ARC.from)).y,
  );

  /** The glow tracks the playhead along the arc, not the raw cursor. */
  const glowX = useTransform(t, (v) =>
    cq(point(ARC.from + v * (ARC.to - ARC.from)).x - 160),
  );
  const glowY = useTransform(t, (v) =>
    cq(point(ARC.from + v * (ARC.to - ARC.from)).y - 160),
  );

  return (
    <div
      ref={ref}
      {...handlers}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <motion.span
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_70%_70%_at_50%_40%,black,transparent)]"
        style={{ x: interactive ? gridX : undefined }}
      />
      <motion.span
        aria-hidden
        className="bg-brand-200/30 pointer-events-none absolute rounded-full blur-[80px]"
        style={{ width: cq(320), height: cq(320), left: glowX, top: glowY }}
      />

      {/* ---- The dial ---- */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <path
          d={ARC_D}
          fill="none"
          stroke="var(--color-hair)"
          strokeWidth={1.5}
        />
        {/* Progress fill. `pathLength={1}` normalises the track so the offset is
            the playhead value directly, whatever the arc's real length. */}
        <motion.path
          d={ARC_D}
          fill="none"
          stroke="var(--color-brand-300)"
          strokeWidth={2.5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          style={{ strokeDashoffset: dash }}
        />
        {/* Below the cards, so it tucks behind each station as it arrives rather
            than sliding across the card faces. */}
        <motion.circle
          r={7}
          fill="var(--color-brand-500)"
          cx={markerX}
          cy={markerY}
        />
      </svg>

      {/* ---- Stations ---- */}
      {STATIONS.map((station, i) => (
        <Station
          key={station.slug}
          index={i}
          station={station}
          active={stop === i}
          field={field}
          pointerX={pointerX}
          pointerY={pointerY}
          interactive={interactive}
          onEnter={() => lockTo(i)}
          onLeave={release}
        />
      ))}

      {/* ---- Specification strip ---- */}
      <div
        aria-hidden
        className="border-hair absolute grid items-center border bg-white"
        style={{
          left: px(SPEC.x),
          top: py(SPEC.y),
          width: px(SPEC.w),
          height: py(SPEC.h),
          gridTemplateColumns: "repeat(4, 1fr)",
          padding: `0 ${cq(18)}`,
          borderRadius: "clamp(0.5rem, 1.111cqw, 1rem)",
          boxShadow: "var(--shadow-float)",
          zIndex: 25,
        }}
      >
        {SPEC_ROWS.map((row) => (
          <span key={row.label} className="min-w-0">
            <span
              className="text-muted block truncate"
              style={{ fontSize: ts(10) }}
            >
              {row.label}
            </span>
            <span
              className="text-ink block truncate font-medium tabular-nums"
              style={{ fontSize: ts(12), marginTop: cq(4) }}
            >
              {row.values[stop]}
            </span>
          </span>
        ))}
      </div>

      {/* ---- The window ---- */}
      <div
        aria-hidden
        className="border-hair absolute overflow-hidden border bg-white"
        style={{
          left: px(WINDOW.x),
          top: py(WINDOW.y),
          width: px(WINDOW.w),
          height: py(WINDOW.h),
          borderRadius: "clamp(0.75rem, 1.667cqw, 1.5rem)",
          boxShadow: "var(--shadow-float-hover)",
          zIndex: 30,
        }}
      >
        <div
          className="border-hair bg-paper flex items-center border-b"
          style={{ height: cq(CHROME_H), padding: `0 ${cq(16)}`, gap: cq(7) }}
        >
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="bg-hair block rounded-full"
              style={{ width: cq(8), height: cq(8) }}
            />
          ))}
          <span
            className="border-hair text-muted truncate rounded-full border bg-white"
            style={{
              fontSize: ts(10),
              padding: `${cq(3)} ${cq(12)}`,
              marginLeft: cq(8),
            }}
          >
            pixelportal.in
          </span>
        </div>

        {/* Both layouts are absolutely positioned, so an exiting view overlaps
            the entering one instead of stacking beneath it and doubling the
            window's height mid-transition. */}
        <div className="relative" style={{ height: cq(BODY.h) }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={stop}
              className="absolute inset-0"
              style={{ padding: cq(PAD) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <View index={stop} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Station({
  index,
  station,
  active,
  field,
  pointerX,
  pointerY,
  interactive,
  onEnter,
  onLeave,
}: {
  index: number;
  station: (typeof STATIONS)[number];
  active: boolean;
  field: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  interactive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  // Derived from the angle, never restated. The blueprint's one geometric error
  // was a card position written out by hand that disagreed with its own arc.
  const centre = point(angleAt(index));

  const x = useTransform(
    [pointerX, pointerY, field],
    ([nx, ny, on]: number[]) => {
      const dx = nx * W - centre.x;
      const dy = ny * H - centre.y;
      const distance = Math.hypot(dx, dy);
      if (distance === 0 || distance > MAGNET_RADIUS) return "0%";
      const strength =
        ((1 - distance / MAGNET_RADIUS) * MAGNET_PULL * on) / distance;
      return `${((dx * strength) / CARD.w) * 100}%`;
    },
  );

  const y = useTransform(
    [pointerX, pointerY, field],
    ([nx, ny, on]: number[]) => {
      const dx = nx * W - centre.x;
      const dy = ny * H - centre.y;
      const distance = Math.hypot(dx, dy);
      if (distance === 0 || distance > MAGNET_RADIUS) return "0%";
      const strength =
        ((1 - distance / MAGNET_RADIUS) * MAGNET_PULL * on) / distance;
      return `${((dy * strength) / CARD.h) * 100}%`;
    },
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left: px(centre.x - CARD.w / 2),
        top: py(centre.y - CARD.h / 2),
        width: px(CARD.w),
        height: py(CARD.h),
        zIndex: 20,
        x: interactive ? x : undefined,
        y: interactive ? y : undefined,
      }}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <Link
        href={hrefFor(station.slug)}
        // Named explicitly rather than left to its own contents: without this
        // the accessible name is the whole card read out, index number and stat
        // included — "01 Corporate Sites Component system … Templates 12".
        aria-label={`${station.title} — ${station.lines[0]}`}
        className={
          active
            ? "border-brand-300 ease-out-expo focus-visible:outline-brand-400 flex h-full flex-col border bg-white transition-[border-color,box-shadow,background-color] duration-500 focus-visible:outline-2 focus-visible:outline-offset-4"
            : "border-hair bg-paper ease-out-expo hover:border-brand-300 focus-visible:outline-brand-400 flex h-full flex-col border transition-[border-color,box-shadow,background-color] duration-500 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4"
        }
        style={{
          padding: cq(16),
          borderRadius: "clamp(0.625rem, 1.389cqw, 1.25rem)",
          boxShadow: active
            ? "var(--shadow-float-hover)"
            : "var(--shadow-float)",
        }}
      >
        <span
          className="text-muted font-semibold tracking-[0.08em] tabular-nums"
          style={{ fontSize: ts(10) }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className="text-ink font-medium"
          style={{ fontSize: ts(14), marginTop: cq(6) }}
        >
          {station.title}
        </span>
        <span style={{ display: "grid", gap: cq(9), marginTop: cq(14) }}>
          {station.lines.map((line) => (
            <span
              key={line}
              className="flex items-center"
              style={{ gap: cq(8) }}
            >
              <span
                aria-hidden
                className="bg-brand-300 block shrink-0 rounded-full"
                style={{ width: cq(4), height: cq(4) }}
              />
              <span
                className="text-ink-soft truncate"
                style={{ fontSize: ts(11) }}
              >
                {line}
              </span>
            </span>
          ))}
        </span>
        <span
          className="border-hair mt-auto flex items-baseline justify-between border-t"
          style={{ paddingTop: cq(10) }}
        >
          <span className="text-muted" style={{ fontSize: ts(10) }}>
            {station.stat[0]}
          </span>
          <span
            className="font-display text-brand-600 leading-none font-semibold tabular-nums"
            style={{ fontSize: ts(14) }}
          >
            {station.stat[1]}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- views ---- */

const Bar = ({ w, h = 7 }: { w: string; h?: number }) => (
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

function Corporate() {
  return (
    <div className="flex h-full flex-col">
      <div
        className="border-hair flex items-center justify-between border-b"
        style={{ paddingBottom: cq(12) }}
      >
        <span
          className="bg-brand-600 block rounded-md"
          style={{ width: cq(22), height: cq(22) }}
        />
        <span className="flex" style={{ gap: cq(20) }}>
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
      </div>
      <p
        className="font-display text-ink font-semibold tracking-tight"
        style={{ fontSize: ts(30), marginTop: cq(20) }}
      >
        Infrastructure for regulated industries.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: cq(16),
          marginTop: cq(22),
        }}
      >
        {["Capabilities", "Case studies", "Leadership"].map((card) => (
          <span
            key={card}
            className="border-hair rounded-lg border bg-white"
            style={{ padding: cq(14) }}
          >
            <span
              className="bg-brand-50 block rounded-md"
              style={{ height: cq(52) }}
            />
            <span
              className="text-ink block font-medium"
              style={{ fontSize: ts(12), marginTop: cq(10) }}
            >
              {card}
            </span>
            <span style={{ display: "grid", gap: cq(5), marginTop: cq(8) }}>
              <Bar w="92%" h={5} />
              <Bar w="64%" h={5} />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Three widths of the same page, which is what the service actually delivers. */
function Responsive() {
  const widths = [
    { label: "1440px", cols: 3 },
    { label: "768px", cols: 2 },
    { label: "375px", cols: 1 },
  ];

  return (
    <div className="flex h-full" style={{ gap: cq(18) }}>
      {widths.map((view, i) => (
        <span
          key={view.label}
          className={
            i === 2
              ? "border-brand-300 flex flex-1 flex-col rounded-lg border bg-white"
              : "border-hair bg-paper flex flex-1 flex-col rounded-lg border"
          }
          style={{ padding: cq(12) }}
        >
          <span className="flex items-center justify-between">
            <span
              className={
                i === 2
                  ? "text-brand-700 font-medium tabular-nums"
                  : "text-muted tabular-nums"
              }
              style={{ fontSize: ts(10) }}
            >
              {view.label}
            </span>
            <span className="flex" style={{ gap: cq(3) }}>
              {[0, 1, 2].map((line) => (
                <span
                  key={line}
                  className="bg-hair block rounded-full"
                  style={{ width: cq(9), height: cq(2) }}
                />
              ))}
            </span>
          </span>
          <span
            className="bg-brand-50 block rounded-md"
            style={{ height: cq(56), marginTop: cq(10) }}
          />
          <span style={{ display: "grid", gap: cq(5), marginTop: cq(10) }}>
            <Bar w="88%" h={5} />
            <Bar w="60%" h={5} />
          </span>
          <span
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${view.cols}, 1fr)`,
              gap: cq(7),
              marginTop: cq(12),
            }}
          >
            {Array.from({ length: view.cols === 1 ? 2 : view.cols }).map(
              (_, card) => (
                <span
                  key={card}
                  className="border-hair block rounded-md border bg-white"
                  style={{ height: cq(34) }}
                />
              ),
            )}
          </span>
        </span>
      ))}
    </div>
  );
}

function Commerce() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span className="flex items-center" style={{ gap: cq(12) }}>
          {["All", "New in", "Sale"].map((tab, i) => (
            <span
              key={tab}
              className={i === 0 ? "text-ink font-medium" : "text-muted"}
              style={{ fontSize: ts(11) }}
            >
              {tab}
            </span>
          ))}
        </span>
        <span
          className="bg-brand-600 grid place-items-center rounded-full font-medium text-white"
          style={{ height: cq(26), padding: `0 ${cq(14)}`, fontSize: ts(11) }}
        >
          Cart · 3
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: cq(14),
          marginTop: cq(16),
        }}
      >
        {["$299", "$189", "$420", "$95"].map((price) => (
          <span
            key={price}
            className="border-hair rounded-lg border bg-white"
            style={{ padding: cq(10) }}
          >
            <span
              className="bg-brand-50 block rounded-md"
              style={{ height: cq(78) }}
            />
            <span
              className="flex items-baseline justify-between"
              style={{ marginTop: cq(10) }}
            >
              <Bar w="52%" h={5} />
              <span
                className="text-ink font-medium tabular-nums"
                style={{ fontSize: ts(12) }}
              >
                {price}
              </span>
            </span>
          </span>
        ))}
      </div>
      <div
        className="border-hair mt-auto flex items-center justify-between border-t"
        style={{ paddingTop: cq(12) }}
      >
        <span className="text-muted" style={{ fontSize: ts(11) }}>
          Free delivery over $150 · 1,200 SKUs in stock
        </span>
        <span
          className="border-brand-300 text-brand-700 grid place-items-center rounded-full border bg-white font-medium"
          style={{ height: cq(26), padding: `0 ${cq(14)}`, fontSize: ts(11) }}
        >
          Checkout
        </span>
      </div>
    </div>
  );
}

/** The one stop where the window divides and still has to read as one window. */
function Headless() {
  return (
    <div className="relative flex h-full" style={{ gap: cq(24) }}>
      <span
        className="bg-paper flex flex-1 flex-col rounded-lg"
        style={{ padding: cq(14) }}
      >
        <span
          className="text-brand-700 font-medium"
          style={{ fontSize: ts(11) }}
        >
          GET /api/v1/content
        </span>
        <span
          className="font-mono"
          style={{ display: "grid", gap: cq(6), marginTop: cq(12) }}
        >
          {[
            `{`,
            `  "title": "Q4 Launch",`,
            `  "hero": "v2-final.jpg",`,
            `  "body": [ … ],`,
            `  "cta": "/signup"`,
            `}`,
          ].map((line) => (
            <span
              key={line}
              // `whitespace-pre`, so the two-space indent survives: HTML
              // collapses it otherwise and the body renders flush left, which
              // is a picture of a JSON document rather than one.
              className="text-ink-soft overflow-hidden whitespace-pre"
              style={{ fontSize: ts(11) }}
            >
              {line}
            </span>
          ))}
        </span>
      </span>

      {/* The seam. The window did not become two windows; it grew a boundary. */}
      <span
        className="bg-hair absolute inset-y-0 left-1/2 block"
        style={{ width: 1 }}
      />

      <span
        className="flex flex-1 flex-col rounded-lg bg-white"
        style={{ padding: cq(14) }}
      >
        <span className="text-muted" style={{ fontSize: ts(10) }}>
          Rendered surface
        </span>
        <span
          className="bg-brand-50 block rounded-md"
          style={{ height: cq(64), marginTop: cq(12) }}
        />
        <span
          className="text-ink block font-medium"
          style={{ fontSize: ts(15), marginTop: cq(12) }}
        >
          Q4 Launch
        </span>
        <span style={{ display: "grid", gap: cq(6), marginTop: cq(10) }}>
          <Bar w="94%" h={5} />
          <Bar w="70%" h={5} />
        </span>
        <span
          className="bg-brand-600 mt-auto grid place-items-center rounded-full font-medium text-white"
          style={{ height: cq(28), width: cq(120), fontSize: ts(11) }}
        >
          Sign up
        </span>
      </span>
    </div>
  );
}

function Marketplace() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span
          className="border-hair bg-paper flex rounded-full border"
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
                height: cq(24),
                padding: `0 ${cq(16)}`,
                fontSize: ts(11),
              }}
            >
              {side}
            </span>
          ))}
        </span>
        <span className="text-muted" style={{ fontSize: ts(11) }}>
          Region · Gurugram · synced 2m ago
        </span>
      </div>

      <div className="flex flex-1" style={{ gap: cq(18), marginTop: cq(16) }}>
        <span
          className="border-hair bg-paper flex flex-col rounded-lg border"
          style={{ width: cq(200), padding: cq(12) }}
        >
          <span className="text-ink font-medium" style={{ fontSize: ts(11) }}>
            Filters
          </span>
          <span style={{ display: "grid", gap: cq(8), marginTop: cq(10) }}>
            {["Verified only", "Ships same day", "Rating 4.5+"].map(
              (filter, i) => (
                <span
                  key={filter}
                  className="flex items-center"
                  style={{ gap: cq(8) }}
                >
                  <span
                    className={
                      i === 0
                        ? "bg-brand-500 block shrink-0 rounded-sm"
                        : "border-hair block shrink-0 rounded-sm border bg-white"
                    }
                    style={{ width: cq(11), height: cq(11) }}
                  />
                  <span
                    className="text-ink-soft truncate"
                    style={{ fontSize: ts(10) }}
                  >
                    {filter}
                  </span>
                </span>
              ),
            )}
          </span>
        </span>

        <span className="flex-1" style={{ display: "grid", gap: cq(8) }}>
          {[
            ["Meridian Supply", "4.9", "128 listings"],
            ["Atlas Trading Co.", "4.7", "94 listings"],
            ["Northwind Depot", "4.6", "61 listings"],
          ].map(([name, rating, listings]) => (
            <span
              key={name}
              className="border-hair flex items-center rounded-lg border bg-white"
              style={{ height: cq(46), padding: `0 ${cq(14)}`, gap: cq(12) }}
            >
              <span
                className="bg-brand-100 block shrink-0 rounded-full"
                style={{ width: cq(22), height: cq(22) }}
              />
              <span
                className="text-ink truncate font-medium"
                style={{ fontSize: ts(11) }}
              >
                {name}
              </span>
              <span
                className="text-muted ml-auto shrink-0 tabular-nums"
                style={{ fontSize: ts(10) }}
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
      </div>
    </div>
  );
}
