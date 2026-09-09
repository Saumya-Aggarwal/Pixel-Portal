"use client";

import Link from "next/link";
import { motion, useTransform, type MotionValue } from "motion/react";

import {
  useScrubPlayhead,
  useStopIndex,
} from "@/components/sections/category/useScrubPlayhead";
import { usePhoneSwipe } from "@/components/sections/category/usePhoneSwipe";
import {
  CHANNELS,
  STATIONS,
  STOPS,
  StationMock,
  attributedAt,
  hrefFor,
} from "@/components/sections/category/journeyLedgerShared";
import { createCanvas } from "@/components/sections/service/visuals/canvas";

/**
 * Phone stage of the marketing journey.
 *
 * The desktop drawing is a 1440-wide rail and does not survive a 360-wide
 * column. This is the same five stops and the same ledger argument, staged
 * one station at a time: a stepper, a primary card that is the service link,
 * and a ledger whose bars fill as each touch happens.
 *
 * Departures from the Gemini mobile blueprint, on purpose:
 *
 * - Interiors are the shipped station mocks, not empty "UI boxes".
 * - The attributed total grows with the bars rather than jumping from $0 to
 *   $10,000 at the last stop — the same "every parked frame is a state"
 *   rule as desktop.
 * - Station five is labelled Measure, not Data; it still takes no credit.
 * - The 60px gap between card and ledger is 20px so the card can actually
 *   hold the mock.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 640);

const CARD = { x: 20, y: 108, w: 320, h: 248 };
const LEDGER = { x: 20, y: 376, w: 320, h: 244 };
const BAR = { x: 76, w: 196, h: 12 };
const ROW_Y = [94, 124, 154, 184] as const;
const NODE_CX = [36, 108, 180, 252, 324] as const;

export function JourneyLedgerPhone() {
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
      <span
        aria-hidden
        className="bg-brand-200/30 pointer-events-none absolute rounded-full blur-3xl"
        style={{
          width: cq(220),
          height: cq(220),
          top: cq(90),
          left: cq(70),
        }}
      />

      <Stepper t={t} stop={stop} onSelect={lockTo} />

      <Link
        href={hrefFor(active.slug)}
        aria-label={`${active.title} — ${active.eyebrow}`}
        // A mouse drag on an anchor starts the browser's native link drag,
        // which cancels the pointer stream the swipe is reading. Phones never
        // hit this; a narrow desktop window does.
        draggable={false}
        className="border-hair bg-paper focus-visible:outline-brand-400 absolute block border focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{
          left: px(CARD.x),
          top: py(CARD.y),
          width: px(CARD.w),
          height: py(CARD.h),
          borderRadius: "1.25rem",
          boxShadow: "var(--shadow-float-hover)",
          zIndex: 30,
        }}
      >
        {STATIONS.map((station, i) => (
          <View key={station.slug} index={i} t={t} cq={cq} ts={ts} />
        ))}
      </Link>

      <Ledger t={t} stop={stop} />
    </div>
  );
}

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
      aria-label="Journey stops"
      className="absolute"
      style={{ left: px(0), top: py(16), width: px(360), height: py(88) }}
    >
      {/* Offsets inside this box are `cq`, never `py`. A percentage here
          resolves against the 88-unit stepper rather than the canvas, which put
          the track at y=21 instead of y=35 and left it a quarter-pixel tall —
          and gave every button an 80-unit hitbox that measured 11. */}
      <span
        aria-hidden
        className="bg-hair absolute overflow-hidden"
        style={{
          left: cq(36),
          top: cq(19),
          width: cq(288),
          height: cq(2),
        }}
      >
        {/* scaleX, not width: a track that reflows on every frame of a scrub is
            the one thing guaranteed to drop frames on a phone. */}
        <motion.span
          className="bg-brand-400 absolute inset-0 origin-left"
          style={{ scaleX: t }}
        />
      </span>

      {STATIONS.map((station, i) => {
        const active = stop === i;
        return (
          <button
            key={station.slug}
            type="button"
            aria-current={active ? "true" : undefined}
            aria-label={`${station.title}, ${station.eyebrow}`}
            onClick={() => onSelect(i)}
            className="focus-visible:outline-brand-400 absolute focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              left: cq(NODE_CX[i] - 36),
              top: 0,
              width: cq(72),
              height: cq(88),
            }}
          >
            {/* Placed rather than stacked: the node is sized in canvas units so
                the track still runs through its centre at every phone width,
                which a fixed 12px dot inside a flex column does not. */}
            <span
              aria-hidden
              className={
                active
                  ? "bg-brand-500 absolute block -translate-x-1/2 rounded-full"
                  : "border-hair bg-paper absolute block -translate-x-1/2 rounded-full border"
              }
              style={{
                left: "50%",
                top: cq(14),
                width: cq(12),
                height: cq(12),
              }}
            />
            <span
              className={
                active
                  ? "text-brand-700 absolute inset-x-0 text-center text-[12px] leading-none font-semibold tabular-nums"
                  : "text-brand-700 absolute inset-x-0 text-center text-[12px] leading-none tabular-nums"
              }
              style={{ top: cq(32) }}
            >
              {station.day}
            </span>
            <span
              className={
                active
                  ? "text-ink absolute inset-x-0 text-center text-[12px] leading-none font-semibold"
                  : "text-ink absolute inset-x-0 text-center text-[12px] leading-none"
              }
              style={{ top: cq(52) }}
            >
              {station.stepper}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function View({
  index,
  t,
  cq,
  ts,
}: {
  index: number;
  t: MotionValue<number>;
  cq: (v: number) => string;
  ts: (v: number) => string;
}) {
  const station = STATIONS[index];
  const prev = STOPS[index - 1] ?? 0;
  const at = STOPS[index];
  const next = STOPS[index + 1] ?? 1;
  const opacity = useTransform(
    t,
    index === 0
      ? [0, at, next]
      : index === STOPS.length - 1
        ? [prev, at, 1]
        : [prev, at, next],
    index === 0
      ? [1, 1, 0]
      : index === STOPS.length - 1
        ? [0, 1, 1]
        : [0, 1, 0],
  );

  return (
    <motion.span
      aria-hidden
      className="absolute inset-0 flex flex-col"
      style={{
        padding: cq(16),
        opacity,
        pointerEvents: "none",
      }}
    >
      <span
        className="text-brand-700 font-semibold tracking-[0.08em] uppercase"
        style={{ fontSize: ts(11) }}
      >
        {station.eyebrow}
      </span>
      <span
        className="text-ink font-medium"
        style={{ fontSize: ts(16), marginTop: cq(6) }}
      >
        {station.title}
      </span>
      <span className="mt-3 min-h-0 flex-1">
        <StationMock index={index} cq={cq} ts={ts} />
      </span>
      <span
        className="border-hair mt-auto flex items-baseline justify-between border-t"
        style={{ paddingTop: cq(12) }}
      >
        <span className="text-muted" style={{ fontSize: ts(12) }}>
          {station.stat[0]}
        </span>
        <span
          className="font-display text-brand-600 leading-none font-semibold tabular-nums"
          style={{ fontSize: ts(18) }}
        >
          {station.stat[1]}
        </span>
      </span>
    </motion.span>
  );
}

function Ledger({ t, stop }: { t: MotionValue<number>; stop: number }) {
  const value = useTransform(t, (v) => {
    const amount = attributedAt(v);
    return `$${amount.toLocaleString("en-US")}`;
  });

  return (
    <div
      aria-hidden
      className="border-hair absolute border bg-white"
      style={{
        left: px(LEDGER.x),
        top: py(LEDGER.y),
        width: px(LEDGER.w),
        height: py(LEDGER.h),
        borderRadius: "1.25rem",
        boxShadow: "var(--shadow-float)",
        zIndex: 30,
      }}
    >
      <div
        className="absolute flex items-start justify-between"
        style={{ left: cq(20), top: cq(18), width: cq(280) }}
      >
        <span>
          <span
            className="text-ink block font-medium"
            style={{ fontSize: ts(14) }}
          >
            Multi-touch attribution
          </span>
          <span
            className="text-muted block"
            style={{ fontSize: ts(11), marginTop: cq(4) }}
          >
            Credited across every touch that earned it
          </span>
        </span>
        <span className="text-right">
          <span className="text-muted block" style={{ fontSize: ts(10) }}>
            Attributed
          </span>
          <motion.span
            className="font-display text-brand-600 block leading-none font-semibold tracking-tight tabular-nums"
            style={{ fontSize: ts(22), marginTop: cq(6) }}
          >
            {value}
          </motion.span>
        </span>
      </div>

      {CHANNELS.map((channel, i) => (
        <PhoneSegment
          key={channel.label}
          index={i}
          t={t}
          active={stop === i}
          y={ROW_Y[i]}
        />
      ))}
    </div>
  );
}

function PhoneSegment({
  index,
  t,
  active,
  y,
}: {
  index: number;
  t: MotionValue<number>;
  active: boolean;
  y: number;
}) {
  const share = CHANNELS[index].share;
  const stopAt = STOPS[index];
  const scale = useTransform(t, [stopAt - 0.09, stopAt], [0, 1]);
  const fillWidth = (share / 100) * BAR.w;

  return (
    <>
      <span
        className="text-ink absolute"
        style={{
          left: cq(16),
          top: cq(y),
          width: cq(56),
          fontSize: ts(12),
          lineHeight: cq(12),
        }}
      >
        {CHANNELS[index].label}
      </span>
      <span
        className="bg-hair absolute overflow-hidden rounded-full"
        style={{
          left: cq(BAR.x),
          top: cq(y),
          width: cq(BAR.w),
          height: cq(BAR.h),
        }}
      >
        <motion.span
          className={
            active
              ? "bg-brand-600 absolute inset-y-0 left-0"
              : "bg-brand-500 absolute inset-y-0 left-0"
          }
          style={{
            width: cq(fillWidth),
            scaleX: scale,
            transformOrigin: "left center",
          }}
        />
      </span>
      <span
        className="text-muted absolute text-right tabular-nums"
        style={{
          left: cq(276),
          top: cq(y),
          width: cq(28),
          fontSize: ts(11),
          lineHeight: cq(12),
        }}
      >
        {share}%
      </span>
    </>
  );
}
