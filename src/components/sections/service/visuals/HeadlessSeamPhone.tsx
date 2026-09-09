"use client";

import { motion } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  ARRIVE,
  CTA,
  DEPART,
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
  WIDGET_LABEL_SHORT,
  at,
} from "@/components/sections/service/visuals/headlessSeamShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * Phone stage of the headless-architecture depiction.
 *
 * The 960x640 drawing puts a vertical seam down the middle: content on the
 * left, three surfaces rendering it on the right. A 360 column cannot hold that
 * split — 170 units a side is neither a content model nor a browser — so the
 * seam turns horizontal. Content above the boundary, surfaces below it. That is
 * the same call this service's category-hero stop already makes, and for the
 * same reason: the seam is the API, and an API boundary reads just as well
 * across as down.
 *
 * **What is kept, because it is the argument.** The seam is still the only
 * structural line in the drawing and everything dashed is still content in
 * transit across it. The three surfaces are still deliberately different shapes
 * — a wide browser, a tall phone, a small embedded unit — and the fan still
 * never reconverges, because divergence is the point. Every packet still leaves
 * at one instant and arrives at one instant, so no endpoint is privileged.
 *
 * The desktop's routing note survives too, rotated. The widget's leader crosses
 * the open band between the browser's bottom edge and the phone's top edge,
 * because everything else there is opaque — same trick, one quarter turn on.
 *
 * **What changed.** The trunk is no longer the seam itself. On the desktop the
 * seam runs the length of the drawing and the packets travel it; here it runs
 * across, so a short vertical trunk drops from its left end and the stubs come
 * off that. It is a second line, but not a duplicated one — it does a different
 * job in a different direction, which was the objection to the blueprint's
 * version, not the line count. Field type and name sit inline rather than
 * stacked, and the widget is labelled "Embed" rather than "Embedded Ad".
 *
 * The three CTAs are also no longer the same button. Each surface renders the
 * `CTA_Link` field the way that surface would: a filled pill on the browser, an
 * outlined full-width control on the phone, an inline link in the ad unit. On
 * the 1440 canvas the surfaces are spread across the drawing and three matching
 * pills read as consistency; stacked in one 360 column they read as one
 * component pasted three times, which is the opposite of what a headless API
 * is being credited with here.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 620);

/**
 * The model's height is measured from the floor, not from the nominal sizes.
 *
 * At 196 the fourth field was clipped: a `ts(12)` name is floored to 10 CSS
 * pixels, so a row is 14.4 canvas units before its padding and rule, and four
 * of them plus the header need 203.
 */
const CMS = { x: 20, y: 20, w: 320, h: 206 };
const SEAM_Y = 248;
const TRUNK_X = 30;

const BROWSER = { x: 44, y: 268, w: 296, h: 120 };
const PHONE = { x: 44, y: 410, w: 140, h: 190 };
const WIDGET = { x: 200, y: 410, w: 140, h: 124 };

/** The open band between the browser's bottom edge and the phone's top. */
const CROSSING_Y = 399;

const CMS_EXIT_X = CMS.x + CMS.w / 2;
const BROWSER_MID = BROWSER.y + BROWSER.h / 2;
const PHONE_MID_X = PHONE.x + PHONE.w / 2;
const WIDGET_MID_X = WIDGET.x + WIDGET.w / 2;

type Point = readonly [number, number];

/**
 * A packet's keyframes, with time distributed along the route by length.
 *
 * Every route leaves at `DEPART` and lands at `ARRIVE`, so the three surfaces
 * are served at the same instant however far apart they are — which is the
 * claim. Spacing the intermediate stamps by segment length is what stops the
 * short route idling and the long one sprinting to catch up; they move at one
 * speed and finish together because the times say so, not by accident.
 *
 * The packet is transparent on its first and last segment: it fades in as it
 * crosses the seam and out as it reaches the surface, so it never appears to
 * detach from the model or to punch into a panel.
 */
function route(points: readonly Point[]) {
  const lengths = points
    .slice(1)
    .map(([x, y], i) => Math.hypot(x - points[i][0], y - points[i][1]));
  const total = lengths.reduce((sum, l) => sum + l, 0);

  let walked = 0;
  const stamps = lengths.map((l) => {
    walked += l;
    return at(DEPART + (walked / total) * (ARRIVE - DEPART));
  });

  const first = points[0];
  const last = points[points.length - 1];

  return {
    cx: [first[0], ...points.map((p) => p[0]), last[0]],
    cy: [first[1], ...points.map((p) => p[1]), last[1]],
    times: [0, at(DEPART), ...stamps, 1],
    opacity: [
      0,
      0,
      ...points.slice(1).map((_, i) => (i === lengths.length - 1 ? 0 : 1)),
      0,
    ],
  };
}

const PACKETS = [
  {
    id: "browser",
    ...route([
      [CMS_EXIT_X, CMS.y + CMS.h],
      [CMS_EXIT_X, SEAM_Y],
      [TRUNK_X, SEAM_Y],
      [TRUNK_X, BROWSER_MID],
      [BROWSER.x, BROWSER_MID],
    ]),
  },
  {
    id: "phone",
    ...route([
      [CMS_EXIT_X, CMS.y + CMS.h],
      [CMS_EXIT_X, SEAM_Y],
      [TRUNK_X, SEAM_Y],
      [TRUNK_X, CROSSING_Y],
      [PHONE_MID_X, CROSSING_Y],
      [PHONE_MID_X, PHONE.y],
    ]),
  },
  {
    id: "widget",
    ...route([
      [CMS_EXIT_X, CMS.y + CMS.h],
      [CMS_EXIT_X, SEAM_Y],
      [TRUNK_X, SEAM_Y],
      [TRUNK_X, CROSSING_Y],
      [WIDGET_MID_X, CROSSING_Y],
      [WIDGET_MID_X, WIDGET.y],
    ]),
  },
];

export function HeadlessSeamPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="md" className="top-[8%] left-[20%]" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        {/* The seam. Solid, full width, and the only structural line in the
            drawing — everything dashed is content in transit across it. */}
        <line
          x1={CMS.x}
          y1={SEAM_Y}
          x2={CMS.x + CMS.w}
          y2={SEAM_Y}
          stroke="var(--color-hair)"
          strokeWidth={1.5}
        />

        <path
          d={
            `M ${CMS_EXIT_X} ${CMS.y + CMS.h} L ${CMS_EXIT_X} ${SEAM_Y}` +
            ` M ${TRUNK_X} ${SEAM_Y} L ${TRUNK_X} ${CROSSING_Y}` +
            ` M ${TRUNK_X} ${BROWSER_MID} L ${BROWSER.x} ${BROWSER_MID}` +
            ` M ${TRUNK_X} ${CROSSING_Y} L ${PHONE_MID_X} ${CROSSING_Y} L ${PHONE_MID_X} ${PHONE.y}` +
            ` M ${TRUNK_X} ${CROSSING_Y} L ${WIDGET_MID_X} ${CROSSING_Y} L ${WIDGET_MID_X} ${WIDGET.y}`
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
            r={3.5}
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
        float={{ amplitude: 4, period: 12, phase: 0 }}
        className="absolute overflow-hidden"
        style={{
          left: px(CMS.x),
          top: py(CMS.y),
          width: px(CMS.w),
          height: py(CMS.h),
          backgroundColor: "var(--color-paper)",
          borderRadius: "clamp(0.75rem, 4.444cqw, 1.25rem)",
          zIndex: 30,
        }}
      >
        <div className="border-hair border-b" style={{ padding: cq(14) }}>
          <div
            className="flex items-center justify-between"
            style={{ height: cq(20), gap: cq(10) }}
          >
            <span className="text-muted" style={{ fontSize: ts(10) }}>
              {MODEL_EYEBROW}
            </span>
            {/* The publish flip is what sends the packets, so it belongs on the
                model's own header rather than floating over its fields. */}
            <span
              className="border-hair relative grid shrink-0 place-items-center rounded-full border bg-white"
              style={{ height: cq(20), width: cq(84) }}
            >
              <motion.span
                className="text-ink-soft absolute font-semibold"
                style={{ fontSize: ts(10) }}
                initial={false}
                animate={
                  playing ? { opacity: STATUS_BEFORE_OPACITY } : { opacity: 0 }
                }
                transition={
                  playing
                    ? {
                        duration: LOOP,
                        times: STATUS_TIMES,
                        repeat: Infinity,
                      }
                    : undefined
                }
              >
                {STATUS_BEFORE}
              </motion.span>
              <motion.span
                className="text-brand-700 absolute font-semibold"
                style={{ fontSize: ts(10) }}
                initial={false}
                animate={
                  playing ? { opacity: STATUS_AFTER_OPACITY } : { opacity: 1 }
                }
                transition={
                  playing
                    ? {
                        duration: LOOP,
                        times: STATUS_TIMES,
                        repeat: Infinity,
                      }
                    : undefined
                }
              >
                {STATUS_AFTER}
              </motion.span>
            </span>
          </div>
          <p
            className="text-ink font-medium"
            style={{ fontSize: ts(14), marginTop: cq(5) }}
          >
            {MODEL_NAME}
          </p>
        </div>

        <div style={{ padding: cq(14), display: "grid", gap: cq(6) }}>
          {FIELDS.map(([name, type, value]) => (
            <div
              key={name}
              className="border-hair/70 flex items-baseline justify-between border-b"
              style={{ paddingBottom: cq(6), gap: cq(10) }}
            >
              {/* Name and type inline. Stacked costs a line each, and four
                  stacked pairs is more than this panel's whole height. */}
              <span
                className="flex min-w-0 items-baseline"
                style={{ gap: cq(6) }}
              >
                <span
                  className="text-ink truncate"
                  style={{ fontSize: ts(12) }}
                >
                  {name}
                </span>
                <span
                  className="text-muted shrink-0"
                  style={{ fontSize: ts(10) }}
                >
                  {type}
                </span>
              </span>
              <span
                className="text-ink-soft shrink-0 truncate text-right"
                style={{ fontSize: ts(11) }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </FloatPanel>

      {/* ---- Surface 1: browser ---- */}
      <Endpoint
        playing={playing}
        box={BROWSER}
        float={{ amplitude: 4, period: 10, phase: 0.2 }}
        radius="clamp(0.625rem, 3.333cqw, 1rem)"
      >
        <div
          className="border-hair bg-paper flex items-center border-b"
          style={{ gap: cq(6), padding: `${cq(7)} ${cq(11)}` }}
        >
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="bg-hair block rounded-full"
              style={{ width: cq(6), height: cq(6) }}
            />
          ))}
          <span
            className="border-hair text-muted truncate rounded-full border bg-white"
            style={{
              fontSize: ts(10),
              padding: `${cq(2)} ${cq(9)}`,
              marginLeft: cq(6),
            }}
          >
            {HOSTNAME}
          </span>
        </div>
        <div className="flex" style={{ padding: cq(12), gap: cq(12) }}>
          <span
            className="bg-brand-50 block shrink-0 rounded-lg"
            style={{ width: cq(84), height: cq(66) }}
          />
          <span className="flex min-w-0 flex-1 flex-col">
            <span
              className="text-ink block truncate font-medium"
              style={{ fontSize: ts(13) }}
            >
              {HEADLINE}
            </span>
            <span style={{ display: "grid", gap: cq(5), marginTop: cq(8) }}>
              <span
                className="bg-hair block rounded-full"
                style={{ height: cq(5), width: "94%" }}
              />
              <span
                className="bg-hair block rounded-full"
                style={{ height: cq(5), width: "72%" }}
              />
            </span>
            {/* Filled primary: the browser is the fullest rendering, so it
                gets the canonical web CTA. The other two surfaces render the
                same `CTA_Link` field in their own idiom rather than repeating
                this button — three identical pills stacked in one column is
                both the heaviest thing in the drawing and an argument against
                it, since rendering one record three identical ways is what a
                template does, not what a headless API does. */}
            <span
              className="bg-brand-600 mt-auto grid place-items-center rounded-full font-medium text-white"
              style={{ height: cq(22), width: cq(76), fontSize: ts(10) }}
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
        radius="clamp(0.75rem, 4.444cqw, 1.25rem)"
      >
        <div
          className="flex items-center justify-center"
          style={{ paddingTop: cq(8), paddingBottom: cq(5) }}
        >
          <span
            className="bg-hair block rounded-full"
            style={{ width: cq(32), height: cq(4) }}
          />
        </div>
        <div style={{ padding: `0 ${cq(11)} ${cq(11)}` }}>
          <span
            className="bg-brand-50 block rounded-lg"
            style={{ height: cq(64) }}
          />
          <span
            className="text-ink block truncate font-medium"
            style={{ fontSize: ts(12), marginTop: cq(10) }}
          >
            {HEADLINE}
          </span>
          <span style={{ display: "grid", gap: cq(5), marginTop: cq(9) }}>
            {["96%", "84%", "58%"].map((w) => (
              <span
                key={w}
                className="bg-hair block rounded-full"
                style={{ height: cq(5), width: w }}
              />
            ))}
          </span>
          <span
            className="border-brand-300 text-brand-700 grid place-items-center rounded-full border bg-white font-medium"
            style={{ height: cq(22), fontSize: ts(10), marginTop: cq(12) }}
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
        radius="clamp(0.5rem, 3.333cqw, 0.875rem)"
      >
        <div style={{ padding: cq(11) }}>
          <p
            className="text-muted font-semibold tracking-[0.06em] uppercase"
            style={{ fontSize: ts(10) }}
          >
            {WIDGET_LABEL_SHORT}
          </p>
          <div
            className="flex items-center"
            style={{ gap: cq(9), marginTop: cq(10) }}
          >
            <span
              className="bg-brand-50 block shrink-0 rounded-md"
              style={{ width: cq(36), height: cq(36) }}
            />
            <span className="min-w-0">
              <span
                className="text-ink block truncate font-medium"
                style={{ fontSize: ts(11) }}
              >
                {HEADLINE}
              </span>
              <span
                className="bg-hair block rounded-full"
                style={{ height: cq(5), width: cq(46), marginTop: cq(6) }}
              />
            </span>
          </div>
          <span
            className="text-brand-700 block font-medium"
            style={{ fontSize: ts(11), marginTop: cq(12) }}
          >
            {CTA} →
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

/**
 * Green tick, top-right, on content arrival.
 *
 * Sentence case, untracked and tightly padded, unlike the desktop's. Uppercase
 * with 0.08em of tracking measures 55px at the 10px floor; the widget has 107
 * of usable width and its own label wants 32 of them.
 */
function SyncPill({ playing }: { playing: boolean }) {
  return (
    <motion.span
      className="border-brand-300 text-brand-700 absolute grid place-items-center rounded-full border bg-white font-semibold"
      style={{
        right: cq(9),
        top: cq(9),
        padding: `${cq(3)} ${cq(6)}`,
        fontSize: ts(10),
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
