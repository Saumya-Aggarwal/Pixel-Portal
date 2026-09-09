"use client";

import { motion } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import {
  H,
  W,
  cq,
  px,
  py,
  ts,
} from "@/components/sections/service/visuals/canvas";
import { HeadlessSeamPhone } from "@/components/sections/service/visuals/HeadlessSeamPhone";
import {
  CTA,
  FIELDS,
  HEADLINE,
  HOSTNAME,
  LOOP,
  MODEL_EYEBROW,
  MODEL_NAME,
  STATUS_AFTER,
  STATUS_AFTER_OPACITY,
  STATUS_BEFORE,
  STATUS_BEFORE_OPACITY,
  STATUS_TIMES,
  SYNC_OPACITY,
  SYNC_TIMES,
  WIDGET_LABEL,
  at,
} from "@/components/sections/service/visuals/headlessSeamShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * One content model, three surfaces that do not own it.
 *
 * The seam down the middle is the API boundary, drawn literally. Everything to
 * its left is the content; everything to its right is a rendering of that
 * content, and the three renderings are deliberately different shapes — a wide
 * browser, a tall phone, a small embedded card. The fan never reconverges,
 * because divergence is the argument.
 *
 * **Changed from the blueprint.** It routed all three leaders *along* x=480,
 * which is where the seam already is — a solid line with dashes drawn over it
 * for 280 units of its length. The seam is now the trunk itself: the leaders
 * are only the stubs that reach it and leave it, and packets travel the seam.
 * Same topology, one line instead of two stacked on each other.
 *
 * The blueprint's own routing note was right and is kept: the widget leader
 * crosses at y=280, through the 40-unit band between the browser's bottom edge
 * and the phone's top edge, because everything else there is opaque.
 */

const SEAM_X = 480;

const CMS = { x: 60, y: 60, w: 360, h: 520 };
const BROWSER = { x: 540, y: 60, w: 380, h: 200 };
const PHONE = { x: 540, y: 300, w: 160, h: 280 };
const WIDGET = { x: 720, y: 300, w: 180, h: 160 };

/** Midlines, so the leaders and the panels cannot drift apart. */
const CMS_MID = CMS.y + CMS.h / 2;
const BROWSER_MID = BROWSER.y + BROWSER.h / 2;
const PHONE_MID = PHONE.y + PHONE.h / 2;
const WIDGET_MID_X = WIDGET.x + WIDGET.w / 2;
/** The open band between the browser's bottom and the phone's top. */
const CROSSING_Y = 280;

/**
 * Packet keyframes, with `times` in loop fractions.
 *
 * Every packet leaves the content model at the same instant and reaches its
 * surface at the same instant, 1.5s later — the point being that no endpoint is
 * privileged. The intermediate offsets are proportional to each route's length
 * so the three move at one speed rather than finishing together by accident.
 */
const PACKETS = [
  {
    id: "browser",
    cx: [CMS.x + CMS.w, CMS.x + CMS.w, SEAM_X, SEAM_X, BROWSER.x, BROWSER.x],
    cy: [CMS_MID, CMS_MID, CMS_MID, BROWSER_MID, BROWSER_MID, BROWSER_MID],
    times: [0, at(0.3), at(0.621), at(1.479), at(1.8), 1],
    opacity: [0, 0, 1, 1, 0, 0],
  },
  {
    id: "phone",
    cx: [CMS.x + CMS.w, CMS.x + CMS.w, SEAM_X, SEAM_X, PHONE.x, PHONE.x],
    cy: [CMS_MID, CMS_MID, CMS_MID, PHONE_MID, PHONE_MID, PHONE_MID],
    times: [0, at(0.3), at(0.675), at(1.425), at(1.8), 1],
    opacity: [0, 0, 1, 1, 0, 0],
  },
  {
    id: "widget",
    cx: [
      CMS.x + CMS.w,
      CMS.x + CMS.w,
      SEAM_X,
      SEAM_X,
      WIDGET_MID_X,
      WIDGET_MID_X,
      WIDGET_MID_X,
    ],
    cy: [CMS_MID, CMS_MID, CMS_MID, CROSSING_Y, CROSSING_Y, WIDGET.y, WIDGET.y],
    times: [0, at(0.3), at(0.5), at(0.633), at(1.734), at(1.8), 1],
    opacity: [0, 0, 1, 1, 1, 0, 0],
  },
];

export function HeadlessSeam() {
  return (
    <>
      <div className="md:hidden">
        <HeadlessSeamPhone />
      </div>
      <div className="hidden md:block">
        <HeadlessSeamDesktop />
      </div>
    </>
  );
}

function HeadlessSeamDesktop() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="lg" className="top-[25%] left-[33.333%]" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        {/* The seam. Solid, full height, and the only structural line in the
            drawing — everything dashed is content in transit across it. */}
        <line
          x1={SEAM_X}
          y1={40}
          x2={SEAM_X}
          y2={600}
          stroke="var(--color-hair)"
          strokeWidth={1.5}
        />

        {/* Stubs to and from the seam. */}
        <path
          d={
            `M ${CMS.x + CMS.w} ${CMS_MID} L ${SEAM_X} ${CMS_MID}` +
            ` M ${SEAM_X} ${BROWSER_MID} L ${BROWSER.x} ${BROWSER_MID}` +
            ` M ${SEAM_X} ${PHONE_MID} L ${PHONE.x} ${PHONE_MID}` +
            ` M ${SEAM_X} ${CROSSING_Y} L ${WIDGET_MID_X} ${CROSSING_Y} L ${WIDGET_MID_X} ${WIDGET.y}`
          }
          fill="none"
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {PACKETS.map((p) => (
          <motion.circle
            key={p.id}
            r={4}
            fill="var(--color-brand-500)"
            initial={false}
            animate={
              playing
                ? { cx: p.cx, cy: p.cy, opacity: p.opacity }
                : { cx: p.cx.at(-1), cy: p.cy.at(-1), opacity: 0 }
            }
            transition={
              playing
                ? {
                    duration: LOOP,
                    times: p.times,
                    repeat: Infinity,
                    ease: "linear",
                  }
                : undefined
            }
          />
        ))}
      </svg>

      {/* ---- The content model ---- */}
      <FloatPanel
        playing={playing}
        focal
        interactive
        float={{ amplitude: 4, period: 12, phase: 0 }}
        className="absolute overflow-hidden"
        style={{
          left: px(CMS.x),
          top: py(CMS.y),
          width: px(CMS.w),
          height: py(CMS.h),
          backgroundColor: "var(--color-paper)",
          borderRadius: "clamp(0.75rem, 3.333cqw, 2rem)",
          zIndex: 30,
        }}
      >
        <div className="border-hair border-b" style={{ padding: cq(22) }}>
          <p className="text-muted" style={{ fontSize: ts(10) }}>
            {MODEL_EYEBROW}
          </p>
          <p
            className="text-ink font-medium"
            style={{ fontSize: ts(15), marginTop: cq(6) }}
          >
            {MODEL_NAME}
          </p>
        </div>

        <div style={{ padding: cq(22), display: "grid", gap: cq(18) }}>
          {FIELDS.map(([name, type, value]) => (
            <div
              key={name}
              className="border-hair/70 flex items-baseline justify-between border-b"
              style={{ paddingBottom: cq(12) }}
            >
              <span className="min-w-0">
                <span
                  className="text-ink block truncate"
                  style={{ fontSize: ts(12) }}
                >
                  {name}
                </span>
                <span
                  className="text-muted block"
                  style={{ fontSize: ts(10), marginTop: cq(4) }}
                >
                  {type}
                </span>
              </span>
              <span
                className="text-ink-soft truncate text-right"
                style={{ fontSize: ts(12), marginLeft: cq(12) }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Status. Positioned in canvas units inside the panel, so it bobs with
            it — a badge pinned to a panel edge that floats independently reads
            as a misalignment, not as depth. */}
        <span
          className="border-hair absolute grid place-items-center rounded-full border bg-white"
          style={{
            left: cq(220),
            top: cq(420),
            width: cq(110),
            height: cq(32),
          }}
        >
          <motion.span
            className="text-ink-soft absolute font-semibold tracking-[0.08em] uppercase"
            style={{ fontSize: ts(10) }}
            initial={false}
            animate={
              playing ? { opacity: STATUS_BEFORE_OPACITY } : { opacity: 0 }
            }
            transition={
              playing
                ? { duration: LOOP, times: STATUS_TIMES, repeat: Infinity }
                : undefined
            }
          >
            {STATUS_BEFORE}
          </motion.span>
          <motion.span
            className="text-brand-700 absolute font-semibold tracking-[0.08em] uppercase"
            style={{ fontSize: ts(10) }}
            initial={false}
            animate={
              playing ? { opacity: STATUS_AFTER_OPACITY } : { opacity: 1 }
            }
            transition={
              playing
                ? { duration: LOOP, times: STATUS_TIMES, repeat: Infinity }
                : undefined
            }
          >
            {STATUS_AFTER}
          </motion.span>
        </span>
      </FloatPanel>

      {/* ---- Surface 1: browser ---- */}
      <Endpoint
        playing={playing}
        box={BROWSER}
        float={{ amplitude: 4, period: 10, phase: 0.2 }}
        radius="clamp(0.625rem, 2.083cqw, 1.25rem)"
      >
        <div
          className="border-hair bg-paper flex items-center border-b"
          style={{ gap: cq(7), padding: `${cq(9)} ${cq(12)}` }}
        >
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="bg-hair block rounded-full"
              style={{ width: cq(7), height: cq(7) }}
            />
          ))}
          <span
            className="border-hair text-muted truncate rounded-full border bg-white"
            style={{
              fontSize: ts(9),
              padding: `${cq(3)} ${cq(10)}`,
              marginLeft: cq(6),
            }}
          >
            {HOSTNAME}
          </span>
        </div>
        <div className="flex" style={{ padding: cq(16), gap: cq(16) }}>
          <span
            className="bg-brand-50 block shrink-0 rounded-lg"
            style={{ width: cq(118), height: cq(102) }}
          />
          <span className="min-w-0 flex-1">
            <span
              className="text-ink block truncate font-medium"
              style={{ fontSize: ts(14) }}
            >
              {HEADLINE}
            </span>
            <span style={{ display: "grid", gap: cq(7), marginTop: cq(12) }}>
              <span
                className="bg-hair block rounded-full"
                style={{ height: cq(6), width: "94%" }}
              />
              <span
                className="bg-hair block rounded-full"
                style={{ height: cq(6), width: "72%" }}
              />
            </span>
            <span
              className="bg-brand-600 mt-auto grid place-items-center rounded-full font-medium text-white"
              style={{
                height: cq(28),
                width: cq(92),
                fontSize: ts(10),
                marginTop: cq(16),
              }}
            >
              {CTA}
            </span>
          </span>
        </div>
        <SyncPill playing={playing} />
      </Endpoint>

      {/* ---- Surface 2: phone ---- */}
      <Endpoint
        playing={playing}
        box={PHONE}
        float={{ amplitude: 4, period: 14, phase: 0.5 }}
        radius="clamp(0.75rem, 2.5cqw, 1.5rem)"
      >
        <div
          className="flex items-center justify-center"
          style={{ paddingTop: cq(10), paddingBottom: cq(6) }}
        >
          <span
            className="bg-hair block rounded-full"
            style={{ width: cq(38), height: cq(4) }}
          />
        </div>
        <div style={{ padding: `0 ${cq(14)} ${cq(14)}` }}>
          <span
            className="bg-brand-50 block rounded-lg"
            style={{ height: cq(96) }}
          />
          <span
            className="text-ink block truncate font-medium"
            style={{ fontSize: ts(12), marginTop: cq(12) }}
          >
            {HEADLINE}
          </span>
          <span style={{ display: "grid", gap: cq(6), marginTop: cq(10) }}>
            {["96%", "84%", "58%"].map((w) => (
              <span
                key={w}
                className="bg-hair block rounded-full"
                style={{ height: cq(5), width: w }}
              />
            ))}
          </span>
          <span
            className="bg-brand-600 grid place-items-center rounded-full font-medium text-white"
            style={{ height: cq(26), fontSize: ts(10), marginTop: cq(14) }}
          >
            {CTA}
          </span>
        </div>
        <SyncPill playing={playing} />
      </Endpoint>

      {/* ---- Surface 3: embedded widget ---- */}
      <Endpoint
        playing={playing}
        box={WIDGET}
        float={{ amplitude: 4, period: 11, phase: 0.8 }}
        radius="clamp(0.5rem, 1.667cqw, 1rem)"
      >
        <div style={{ padding: cq(14) }}>
          <p
            className="text-muted font-semibold tracking-[0.08em] uppercase"
            style={{ fontSize: ts(9) }}
          >
            {WIDGET_LABEL}
          </p>
          <div
            className="flex items-center"
            style={{ gap: cq(10), marginTop: cq(12) }}
          >
            <span
              className="bg-brand-50 block shrink-0 rounded-md"
              style={{ width: cq(44), height: cq(44) }}
            />
            <span className="min-w-0">
              <span
                className="text-ink block truncate font-medium"
                style={{ fontSize: ts(11) }}
              >
                {HEADLINE}
              </span>
              <span
                className="bg-hair mt-1 block rounded-full"
                style={{ height: cq(5), width: cq(60) }}
              />
            </span>
          </div>
          <span
            className="bg-brand-600 grid place-items-center rounded-full font-medium text-white"
            style={{ height: cq(26), fontSize: ts(10), marginTop: cq(14) }}
          >
            {CTA}
          </span>
        </div>
        <SyncPill playing={playing} />
      </Endpoint>
    </div>
  );
}

function Endpoint({
  playing,
  box,
  float,
  radius,
  children,
}: {
  playing: boolean;
  box: { x: number; y: number; w: number; h: number };
  float: { amplitude: number; period: number; phase: number };
  radius: string;
  children: React.ReactNode;
}) {
  return (
    <FloatPanel
      playing={playing}
      float={float}
      className="absolute overflow-hidden"
      style={{
        left: px(box.x),
        top: py(box.y),
        width: px(box.w),
        height: py(box.h),
        backgroundColor: "var(--color-paper)",
        borderRadius: radius,
        zIndex: 30,
      }}
    >
      {children}
    </FloatPanel>
  );
}

/** Green tick, top-right, on content arrival. */
function SyncPill({ playing }: { playing: boolean }) {
  return (
    <motion.span
      className="border-brand-300 text-brand-700 absolute grid place-items-center rounded-full border bg-white font-semibold tracking-[0.08em] uppercase"
      style={{
        right: cq(12),
        top: cq(12),
        padding: `${cq(4)} ${cq(9)}`,
        fontSize: ts(9),
      }}
      initial={false}
      animate={playing ? { opacity: SYNC_OPACITY } : { opacity: 0 }}
      transition={
        playing
          ? { duration: LOOP, times: SYNC_TIMES, repeat: Infinity }
          : undefined
      }
    >
      Synced
    </motion.span>
  );
}
