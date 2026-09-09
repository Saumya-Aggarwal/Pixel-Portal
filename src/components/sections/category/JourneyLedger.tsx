"use client";

import Link from "next/link";
import {
  motion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import {
  useScrubPlayhead,
  useStopIndex,
} from "@/components/sections/category/useScrubPlayhead";
import { JourneyLedgerPhone } from "@/components/sections/category/JourneyLedgerPhone";
import {
  CHANNELS,
  STATIONS,
  STOPS,
  StationMock,
  hrefFor,
} from "@/components/sections/category/journeyLedgerShared";
import { createCanvas } from "@/components/sections/service/visuals/canvas";

/**
 * One customer, five touches.
 *
 * The category page claims that strategy, media and measurement run as one
 * system. So the picture is a single person's path over thirty days, touched by
 * each channel in turn, with the ledger underneath accumulating who deserves
 * credit. The five stations are the five services, and each one is a link — the
 * hero is the page's primary route into them rather than decoration above the
 * card grid.
 *
 * **Two changes to the blueprint, both about the ledger.**
 *
 * It split attribution across all five stations, giving Analytics 30% of the
 * conversion. Analytics is the measurement layer, not a channel; crediting it
 * is a category error an ad buyer would catch on sight. Credit splits across the
 * four channels, and station five *produces* the ledger instead — which is why
 * its drop is drawn solid where the other four are dashed.
 *
 * It also held four identical full-width bars from t=0 to t=0.75 and collapsed
 * them into proportions only at the very end. Three quarters of the scrub
 * carried no information, and since the reader can park the playhead anywhere,
 * "the interesting frame is the last one" is not a thing this can rely on. Each
 * channel's share fills in place as its touch happens, so every position on the
 * track is a readable state of the argument.
 *
 * The bars fill by `scaleX` against a track drawn at full width from the first
 * frame, rather than by animating width. Two reasons: the empty track states the
 * shape of the argument before anything has happened, and a scrub that
 * invalidates layout every frame is the one thing guaranteed to feel cheap.
 */

const { W, H, px, py, ts, cq } = createCanvas(1440, 720);

const STATION = { y: 80, w: 220, h: 280 };
const stationX = (i: number) => 90 + i * 260;
const midline = (i: number) => stationX(i) + STATION.w / 2;

const RAIL_Y = 416;
const CARD = { w: 180, h: 64, y: 384 };
const LEDGER = { x: 90, y: 480, w: 1260, h: 160 };

/** Ledger interior. */
const PAD = 26;
const BAR = { x: LEDGER.x + PAD, y: 556, w: LEDGER.w - PAD * 2, h: 32 };

const OFFSETS = CHANNELS.reduce<number[]>((acc, channel, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + (CHANNELS[i - 1].share / 100) * BAR.w);
  return acc;
}, []);

/** Card travel, as a percentage of the card's own width — a pure transform. */
const CARD_X = STATIONS.map(
  (_, i) =>
    `${((midline(i) - CARD.w / 2 - (midline(0) - CARD.w / 2)) / CARD.w) * 100}%`,
);

const MAGNET_RADIUS = 150;
const MAGNET_PULL = 12;

export function JourneyLedger() {
  return (
    <>
      <div className="md:hidden">
        <JourneyLedgerPhone />
      </div>
      <div className="hidden md:block">
        <JourneyLedgerDesktop />
      </div>
    </>
  );
}

function JourneyLedgerDesktop() {
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

  /** 0 when the pointer is away, so nothing leans toward a cursor that left. */
  const field = useSpring(pointerActive ? 1 : 0, {
    stiffness: 60,
    damping: 20,
  });

  const gridX = useTransform(pointerX, (v) => `${(v - 0.5) * 2 * 0.972}%`);
  const glowX = useTransform(pointerX, (v) => cq(200 + v * 1040 - 160));

  return (
    <div
      ref={ref}
      {...handlers}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      {/* ---- Ground ---- */}
      <motion.span
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_70%_70%_at_50%_45%,black,transparent)]"
        style={{ x: interactive ? gridX : undefined }}
      />
      <motion.span
        aria-hidden
        className="bg-brand-200/30 pointer-events-none absolute rounded-full blur-[80px]"
        style={{
          width: cq(320),
          height: cq(320),
          top: cq(40),
          left: interactive ? glowX : cq(560),
        }}
      />

      {/* ---- Rail and drops ---- */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <line
          x1={midline(0)}
          y1={RAIL_Y}
          x2={midline(STATIONS.length - 1)}
          y2={RAIL_Y}
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        {STATIONS.map((station, i) => {
          const measured = i === STATIONS.length - 1;
          return (
            <line
              key={station.slug}
              x1={midline(i)}
              y1={STATION.y + STATION.h}
              x2={midline(i)}
              y2={LEDGER.y}
              stroke={
                measured
                  ? "var(--color-brand-300)"
                  : i <= stop
                    ? "var(--color-brand-300)"
                    : "var(--color-brand-200)"
              }
              strokeWidth={1.5}
              // The measurement station produces the ledger rather than feeding
              // it, so its line is unbroken where the four channels' are not.
              strokeDasharray={measured ? undefined : "4 4"}
            />
          );
        })}
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

      {/* ---- The person ---- */}
      <Card t={t} stop={stop} />

      {/* ---- Ledger ---- */}
      <div
        aria-hidden
        className="border-hair absolute border bg-white"
        style={{
          left: px(LEDGER.x),
          top: py(LEDGER.y),
          width: px(LEDGER.w),
          height: py(LEDGER.h),
          borderRadius: "clamp(0.75rem, 1.667cqw, 1.5rem)",
          boxShadow: "var(--shadow-float)",
        }}
      >
        <div
          className="absolute flex items-start justify-between"
          style={{ left: cq(PAD), top: cq(PAD), width: cq(BAR.w) }}
        >
          <span>
            <span
              className="text-ink block font-medium"
              style={{ fontSize: ts(15) }}
            >
              Multi-touch attribution
            </span>
            <span
              className="text-muted block"
              style={{ fontSize: ts(11), marginTop: cq(5) }}
            >
              One conversion, credited across every touch that earned it
            </span>
          </span>
          <span className="text-right">
            <span className="text-muted block" style={{ fontSize: ts(10) }}>
              Attributed value
            </span>
            <ScrubValue t={t} />
          </span>
        </div>

        {/* Track, drawn full width from the first frame. */}
        <span
          className="border-hair bg-paper absolute block overflow-hidden rounded-full border"
          style={{
            left: cq(PAD),
            top: cq(BAR.y - LEDGER.y),
            width: cq(BAR.w),
            height: cq(BAR.h),
          }}
        >
          {CHANNELS.map((channel, i) => (
            <Segment key={channel.label} t={t} index={i} active={stop === i} />
          ))}
        </span>

        <span
          className="text-muted absolute"
          style={{ left: cq(PAD), top: cq(598 - LEDGER.y), fontSize: ts(11) }}
        >
          Last-click reporting would credit Email alone, and cut the other
          three.
        </span>
      </div>
    </div>
  );
}

/** One channel's share, filling its own slot rather than pushing its neighbours. */
function Segment({
  t,
  index,
  active,
}: {
  t: MotionValue<number>;
  index: number;
  active: boolean;
}) {
  const width = (CHANNELS[index].share / 100) * BAR.w;
  const stop = STOPS[index];
  const scale = useTransform(t, [stop - 0.09, stop], [0, 1]);
  const opacity = useTransform(t, [stop - 0.09, stop - 0.02], [0, 1]);

  return (
    <>
      <motion.span
        className={
          active
            ? "bg-brand-600 absolute inset-y-0"
            : "bg-brand-200 absolute inset-y-0"
        }
        style={{
          left: cq(OFFSETS[index]),
          width: cq(width),
          scaleX: scale,
          transformOrigin: "left center",
        }}
      />
      <motion.span
        className={
          active
            ? "absolute inset-y-0 flex items-center font-medium text-white"
            : "text-ink-soft absolute inset-y-0 flex items-center font-medium"
        }
        style={{
          left: cq(OFFSETS[index]),
          width: cq(width),
          paddingLeft: cq(14),
          fontSize: ts(11),
          opacity,
        }}
      >
        {CHANNELS[index].label} · {CHANNELS[index].share}%
      </motion.span>
    </>
  );
}

/**
 * The attributed total, counting as the reader scrubs.
 *
 * Its own component so the subscription re-renders one text node rather than
 * the whole illustration — everything else here interpolates through
 * `useTransform` and never re-renders at all.
 */
function ScrubValue({ t }: { t: MotionValue<number> }) {
  const value = useTransform(t, (v) =>
    v < 0.8
      ? "—"
      : `$${Math.round(((v - 0.8) / 0.2) * 10000).toLocaleString("en-US")}`,
  );

  return (
    <motion.span
      className="font-display text-brand-600 block leading-none font-semibold tracking-tight tabular-nums"
      style={{ fontSize: ts(26), marginTop: cq(7) }}
    >
      {value}
    </motion.span>
  );
}

function Card({ t, stop }: { t: MotionValue<number>; stop: number }) {
  const x = useTransform(t, STOPS, CARD_X);
  const station = STATIONS[stop];

  return (
    <motion.div
      aria-hidden
      className="border-hair absolute flex items-center border bg-white"
      style={{
        left: px(midline(0) - CARD.w / 2),
        top: py(CARD.y),
        width: px(CARD.w),
        height: py(CARD.h),
        padding: `0 ${cq(16)}`,
        gap: cq(11),
        borderRadius: "clamp(0.5rem, 1.111cqw, 1rem)",
        boxShadow: "var(--shadow-float-hover)",
        zIndex: 30,
        x,
      }}
    >
      <span
        className="bg-brand-100 block shrink-0 rounded-full"
        style={{ width: cq(26), height: cq(26) }}
      />
      <span className="min-w-0">
        <span
          className="text-muted block tabular-nums"
          style={{ fontSize: ts(10) }}
        >
          {station.day}
        </span>
        <span
          className="text-ink block truncate font-medium"
          style={{ fontSize: ts(13), marginTop: cq(3) }}
        >
          {station.moment}
        </span>
      </span>
    </motion.div>
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
  const cx = midline(index);
  const cy = STATION.y + STATION.h / 2;

  /**
   * Lean toward the cursor, inversely with distance and only inside the radius.
   *
   * Written out twice rather than shared through a helper, because a helper
   * that calls `useTransform` is a hook call the linter cannot see the order
   * of. Offsets are percentages of the station's own box, so the lean is a
   * composited transform that stays proportional as the canvas scales.
   */
  const x = useTransform(
    [pointerX, pointerY, field],
    ([nx, ny, on]: number[]) => {
      const dx = nx * W - cx;
      const dy = ny * H - cy;
      const distance = Math.hypot(dx, dy);
      if (distance === 0 || distance > MAGNET_RADIUS) return "0%";
      const strength =
        ((1 - distance / MAGNET_RADIUS) * MAGNET_PULL * on) / distance;
      return `${((dx * strength) / STATION.w) * 100}%`;
    },
  );

  const y = useTransform(
    [pointerX, pointerY, field],
    ([nx, ny, on]: number[]) => {
      const dx = nx * W - cx;
      const dy = ny * H - cy;
      const distance = Math.hypot(dx, dy);
      if (distance === 0 || distance > MAGNET_RADIUS) return "0%";
      const strength =
        ((1 - distance / MAGNET_RADIUS) * MAGNET_PULL * on) / distance;
      return `${((dy * strength) / STATION.h) * 100}%`;
    },
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left: px(stationX(index)),
        top: py(STATION.y),
        width: px(STATION.w),
        height: py(STATION.h),
        zIndex: 20,
        x: interactive ? x : undefined,
        y: interactive ? y : undefined,
      }}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <Link
        href={hrefFor(station.slug)}
        aria-label={`${station.title} — ${station.eyebrow}`}
        className={
          active
            ? "border-brand-300 ease-out-expo focus-visible:outline-brand-400 flex h-full flex-col border bg-white transition-[border-color,box-shadow,background-color] duration-500 focus-visible:outline-2 focus-visible:outline-offset-4"
            : "border-hair bg-paper ease-out-expo hover:border-brand-300 focus-visible:outline-brand-400 flex h-full flex-col border transition-[border-color,box-shadow,background-color] duration-500 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4"
        }
        style={{
          padding: cq(18),
          borderRadius: "clamp(0.75rem, 1.667cqw, 1.5rem)",
          boxShadow: active
            ? "var(--shadow-float-hover)"
            : "var(--shadow-float)",
        }}
      >
        <span
          className="text-muted font-semibold tracking-[0.08em] uppercase"
          style={{ fontSize: ts(10) }}
        >
          {station.eyebrow}
        </span>
        <span
          className="text-ink font-medium"
          style={{ fontSize: ts(15), marginTop: cq(6) }}
        >
          {station.title}
        </span>

        <span aria-hidden className="block" style={{ marginTop: cq(14) }}>
          <StationMock index={index} cq={cq} ts={ts} />
        </span>

        <span
          className="border-hair mt-auto flex items-baseline justify-between border-t"
          style={{ paddingTop: cq(13) }}
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
      </Link>
    </motion.div>
  );
}
