"use client";

import { motion } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  ATTEMPTS,
  COUNTS,
  COUNT_TIMES,
  FAIL_IN,
  FAIL_OUT,
  LOOP,
  Swap,
  at,
} from "@/components/sections/service/visuals/queueRetryShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * Phone stage of the api-integrations depiction.
 *
 * The 960x640 drawing is two system panels either side of a horizontal rail,
 * over a band of three more. In a 327px column that canvas renders at 34% of
 * design size — one unit is a third of a pixel — while every label sits on
 * `ts`'s 10px floor and so stays put. Type ends up roughly three times
 * oversized against its own composition: of sixty text nodes, twenty-one
 * overflowed the frame and the rest sat on top of each other. It was the worst
 * of the fourteen.
 *
 * So the drawing is rebuilt rather than scaled. The horizontal run becomes a
 * vertical one, which is the direction a phone reads anyway, and the five
 * panels stack in the order the sequence actually happens: sent, rejected,
 * retried, caught, counted.
 *
 * **What is kept, because it is the argument.** The failure uses `ink` and
 * never red. The message comes to rest in a slot *inside* the dead-letter
 * queue — caught, not lost. Nothing in the retry ladder appears or disappears:
 * three rows are drawn from the first frame and only their outcome changes. And
 * the delivery counts stay, because 20,000 delivered is what stops this reading
 * as a broken system rather than as the exception being handled.
 *
 * **What changed.** The counts are four columns rather than four rows, and the
 * auth/events rows on both systems are gone — at this width they were texture,
 * and the rate limit is the only one that explains the 503. The payload moves
 * by transform between three rest positions in the gaps between panels, rather
 * than by animating `left`/`top` as the desktop does; the gaps are sized to
 * hold it so it is never parked over a panel it would obscure.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 640);

const PANEL_X = 20;
const PANEL_W = 320;

const SOURCE = { y: 20, h: 64 };
const TARGET = { y: 116, h: 88 };
const RETRY = { y: 238, h: 148 };
const DLQ = { y: 406, h: 124 };
const DELIVERY = { y: 548, h: 74 };

/** The rail runs down the middle, in the gaps only. */
const RAIL_X = 180;
const GAPS = [
  [SOURCE.y + SOURCE.h, TARGET.y],
  [TARGET.y + TARGET.h, RETRY.y],
  [RETRY.y + RETRY.h, DLQ.y],
] as const;

/**
 * The message. Rest positions are inside the gaps, not over the panels.
 *
 * The desktop moves it with `left`/`top`, which invalidates layout on every
 * frame. Here `left`/`top` are fixed at the first rest position and the whole
 * travel is a `y` transform, expressed as a percentage of the payload's own
 * height so it stays correct at any container width.
 */
const PAYLOAD = { w: 180, h: 30 };
const PAYLOAD_X = (360 - PAYLOAD.w) / 2;
/** Slot top inside the DLQ panel: 12 padding + 16 title row + 10. */
const SLOT_Y = DLQ.y + 38;
const STOPS = [SOURCE.y + SOURCE.h + 1, TARGET.y + TARGET.h + 2, SLOT_Y];
const shift = (y: number) => `${((y - STOPS[0]) / PAYLOAD.h) * 100}%`;

export function QueueRetryPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  const fail = playing
    ? { duration: LOOP, times: [0, at(1.15), at(1.25), at(9.0), at(9.4), 1] }
    : undefined;
  const count = playing
    ? { duration: LOOP, times: COUNT_TIMES, repeat: Infinity }
    : undefined;

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="md" className="top-[58%] left-[10%]" />

      <Rail playing={playing} />

      {/* ---- Sent ---- */}
      <Panel y={SOURCE.y} h={SOURCE.h} playing={playing}>
        <Head
          title="Salesforce CRM"
          trailing={
            <span
              className="border-brand-300 text-brand-700 grid shrink-0 place-items-center rounded-full border bg-white font-semibold whitespace-nowrap"
              style={{
                height: cq(20),
                padding: `0 ${cq(10)}`,
                fontSize: ts(11),
              }}
            >
              200 · Sent
            </span>
          }
        />
        <Meta
          direction="webhook · outbound"
          method="POST"
          path="/api/v1/sync"
        />
      </Panel>

      {/* ---- Rejected ---- */}
      <Panel y={TARGET.y} h={TARGET.h} playing={playing}>
        <Head
          title="NetSuite ERP"
          trailing={
            <span
              className="relative grid shrink-0"
              style={{ height: cq(20), width: cq(130) }}
            >
              <motion.span
                className="border-brand-300 text-brand-700 absolute inset-0 grid place-items-center rounded-full border bg-white font-semibold whitespace-nowrap"
                style={{ fontSize: ts(11) }}
                initial={false}
                animate={playing ? { opacity: FAIL_OUT } : { opacity: 0 }}
                transition={fail ? { ...fail, repeat: Infinity } : undefined}
              >
                200 · Accepted
              </motion.span>
              {/* Ink, not red. A red block on an agency page reads as a broken
                  screenshot rather than as the failure path being shown. */}
              <motion.span
                className="border-ink/40 text-ink bg-paper absolute inset-0 grid place-items-center rounded-full border font-semibold whitespace-nowrap"
                style={{ fontSize: ts(11) }}
                initial={false}
                animate={playing ? { opacity: FAIL_IN } : { opacity: 1 }}
                transition={fail ? { ...fail, repeat: Infinity } : undefined}
              >
                503 · Unavailable
              </motion.span>
            </span>
          }
        />
        <Meta
          direction="REST · inbound"
          method="PUT"
          path="/records/customer"
        />
        {/* The one context row worth its height: it is why the write failed. */}
        <span
          className="border-hair/70 mt-auto flex items-baseline justify-between border-t"
          style={{ paddingTop: cq(8) }}
        >
          <span className="text-muted" style={{ fontSize: ts(11) }}>
            Rate limit
          </span>
          <span
            className="text-ink-soft tabular-nums"
            style={{ fontSize: ts(11) }}
          >
            100 / min
          </span>
        </span>
      </Panel>

      {/* ---- Retried ---- */}
      <Panel y={RETRY.y} h={RETRY.h} playing={playing}>
        <Head title="Retry policy" trailing={<Sub>exponential backoff</Sub>} />
        <span style={{ display: "grid", gap: cq(5), marginTop: cq(10) }}>
          {ATTEMPTS.map(([attempt, delay], i) => (
            <span
              key={attempt}
              className="border-hair flex items-center justify-between rounded-md border bg-white"
              style={{ height: cq(22), padding: `0 ${cq(10)}` }}
            >
              <span className="text-ink-soft" style={{ fontSize: ts(11) }}>
                {attempt}
              </span>
              <span className="flex items-center" style={{ gap: cq(10) }}>
                <span
                  className="text-muted tabular-nums"
                  style={{ fontSize: ts(10) }}
                >
                  {delay}
                </span>
                <Swap
                  playing={playing}
                  at={1.4 + i * 0.6}
                  width={cq(24)}
                  before={
                    <span className="text-muted" style={{ fontSize: ts(10) }}>
                      —
                    </span>
                  }
                  after={
                    <span
                      className="text-ink font-medium tabular-nums"
                      style={{ fontSize: ts(10) }}
                    >
                      503
                    </span>
                  }
                />
              </span>
            </span>
          ))}
        </span>
        <span
          className="relative mt-auto flex items-center"
          style={{ height: cq(14) }}
        >
          <Swap
            playing={playing}
            at={3.2}
            align="left"
            before={
              <span
                className="text-muted whitespace-nowrap"
                style={{ fontSize: ts(11) }}
              >
                awaiting outcome
              </span>
            }
            after={
              <span
                className="text-ink font-medium whitespace-nowrap"
                style={{ fontSize: ts(11) }}
              >
                → routed to dead letter
              </span>
            }
          />
        </span>
      </Panel>

      {/* ---- Caught ---- */}
      <Panel y={DLQ.y} h={DLQ.h} playing={playing} focal>
        <Head title="Dead Letter Queue" trailing={<Sub>held for replay</Sub>} />
        {/* The slot, drawn empty from the first frame so the message arriving
            fills something rather than landing on top of nothing. */}
        <span
          className="border-hair/80 absolute rounded-xl border border-dashed"
          style={{
            left: cq(PAYLOAD_X - PANEL_X),
            top: cq(SLOT_Y - DLQ.y),
            width: cq(PAYLOAD.w),
            height: cq(PAYLOAD.h),
          }}
        />
        <span className="mt-auto flex items-center justify-between">
          <span className="flex items-center" style={{ gap: cq(8) }}>
            <span className="text-muted" style={{ fontSize: ts(11) }}>
              Depth
            </span>
            <span
              className="relative flex items-center"
              style={{ height: cq(18), width: cq(14) }}
            >
              <Swap
                playing={playing}
                at={3.4}
                width={cq(14)}
                align="left"
                before={
                  <span
                    className="font-display text-muted leading-none font-semibold tabular-nums"
                    style={{ fontSize: ts(18) }}
                  >
                    0
                  </span>
                }
                after={
                  <span
                    className="font-display text-ink leading-none font-semibold tabular-nums"
                    style={{ fontSize: ts(18) }}
                  >
                    1
                  </span>
                }
              />
            </span>
          </span>
          <span
            className="border-brand-300 text-brand-700 grid shrink-0 place-items-center rounded-full border bg-white font-medium"
            style={{ height: cq(24), padding: `0 ${cq(14)}`, fontSize: ts(11) }}
          >
            Replay message
          </span>
        </span>
      </Panel>

      {/* ---- Counted ---- */}
      <Panel y={DELIVERY.y} h={DELIVERY.h} playing={playing}>
        <span className="text-muted" style={{ fontSize: ts(11) }}>
          Delivery · rolling 24 hours
        </span>
        <span
          className="mt-auto"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: cq(6),
          }}
        >
          {COUNTS.map((row) => (
            <span key={row.label} className="block">
              <span className="relative block" style={{ height: cq(16) }}>
                {row.before === row.after ? (
                  <span
                    className={
                      row.accent
                        ? "font-display text-brand-600 absolute left-0 leading-none font-semibold tabular-nums"
                        : "font-display text-ink absolute left-0 leading-none font-semibold tabular-nums"
                    }
                    style={{ fontSize: ts(14) }}
                  >
                    {row.before}
                  </span>
                ) : (
                  <>
                    <motion.span
                      className="font-display text-ink absolute left-0 leading-none font-semibold tabular-nums"
                      style={{ fontSize: ts(14) }}
                      initial={false}
                      animate={playing ? { opacity: FAIL_OUT } : { opacity: 0 }}
                      transition={count}
                    >
                      {row.before}
                    </motion.span>
                    <motion.span
                      className="font-display text-brand-600 absolute left-0 leading-none font-semibold tabular-nums"
                      style={{ fontSize: ts(14) }}
                      initial={false}
                      animate={playing ? { opacity: FAIL_IN } : { opacity: 1 }}
                      transition={count}
                    >
                      {row.after}
                    </motion.span>
                  </>
                )}
              </span>
              <span
                className="text-muted block truncate"
                style={{ fontSize: ts(10), marginTop: cq(4) }}
              >
                {row.short}
              </span>
            </span>
          ))}
        </span>
      </Panel>

      <Payload playing={playing} />
    </div>
  );
}

/* ---------------------------------------------------------------- pieces ---- */

function Panel({
  y,
  h,
  playing,
  focal = false,
  children,
}: {
  y: number;
  h: number;
  playing: boolean;
  focal?: boolean;
  children: React.ReactNode;
}) {
  return (
    // No ambient bob on the phone. The payload's rest positions sit two units
    // clear of the panels above and below them; a 4-unit float would put a
    // panel edge through the message.
    <FloatPanel
      playing={playing}
      focal={focal}
      className="absolute flex flex-col"
      style={{
        left: px(PANEL_X),
        top: py(y),
        width: px(PANEL_W),
        height: py(h),
        padding: cq(12),
        backgroundColor: focal ? "#fff" : "var(--color-paper)",
        borderColor: focal ? "var(--color-brand-300)" : "var(--color-hair)",
        borderRadius: "clamp(0.75rem, 4.444cqw, 1.25rem)",
      }}
    >
      {children}
    </FloatPanel>
  );
}

function Head({
  title,
  trailing,
}: {
  title: string;
  trailing: React.ReactNode;
}) {
  return (
    <span
      className="flex items-center justify-between"
      style={{ gap: cq(10), height: cq(20) }}
    >
      <span
        className="text-ink truncate font-medium"
        style={{ fontSize: ts(13) }}
      >
        {title}
      </span>
      {trailing}
    </span>
  );
}

const Sub = ({ children }: { children: React.ReactNode }) => (
  <span className="text-muted shrink-0" style={{ fontSize: ts(10) }}>
    {children}
  </span>
);

function Meta({
  direction,
  method,
  path,
}: {
  direction: string;
  method: string;
  path: string;
}) {
  return (
    <span
      className="flex items-center justify-between"
      style={{ gap: cq(10), marginTop: cq(8) }}
    >
      <span
        className="text-ink-soft flex items-center"
        style={{ fontSize: ts(11), gap: cq(6) }}
      >
        <span
          className="bg-brand-400 block shrink-0 rounded-full"
          style={{ width: cq(5), height: cq(5) }}
        />
        {direction}
      </span>
      <span
        className="flex shrink-0 items-center font-mono"
        style={{ gap: cq(5) }}
      >
        <span
          className="text-brand-700 font-semibold tracking-[0.04em]"
          style={{ fontSize: ts(10) }}
        >
          {method}
        </span>
        <span className="text-muted" style={{ fontSize: ts(10) }}>
          {path}
        </span>
      </span>
    </span>
  );
}

/**
 * The rail, drawn only in the gaps.
 *
 * A single line down the whole canvas would run behind four opaque panels and
 * show as three disconnected stubs anyway. Drawing the stubs directly means
 * nothing animated is ever hidden by a panel, and it lets each segment carry
 * the state of the hop it represents: the first stays green because the send
 * succeeded, the two below it turn ink once the write is rejected.
 */
function Rail({ playing }: { playing: boolean }) {
  const times = [0, at(1.15), at(1.25), at(9.0), at(9.4), 1];
  const ink = [
    "var(--color-brand-200)",
    "var(--color-brand-200)",
    "var(--color-ink)",
    "var(--color-ink)",
    "var(--color-brand-200)",
    "var(--color-brand-200)",
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
    >
      {GAPS.map(([from, to], i) => {
        const props = {
          x1: RAIL_X,
          y1: from,
          x2: RAIL_X,
          y2: to,
          strokeWidth: 1.5,
          strokeDasharray: "4 4",
          strokeLinecap: "round" as const,
        };
        return i === 0 ? (
          <line key={from} {...props} stroke="var(--color-brand-200)" />
        ) : (
          <motion.line
            key={from}
            {...props}
            initial={false}
            animate={playing ? { stroke: ink } : { stroke: "var(--color-ink)" }}
            transition={
              playing
                ? { duration: LOOP, times, repeat: Infinity, ease: "linear" }
                : undefined
            }
          />
        );
      })}
    </svg>
  );
}

/**
 * The message in flight. Rendered last so it comes to rest *on top of* the
 * dead-letter panel rather than behind it — quarantined and still readable is
 * the frame the whole picture exists to reach.
 */
function Payload({ playing }: { playing: boolean }) {
  return (
    <motion.div
      className="absolute grid place-items-center bg-white shadow-(--shadow-float)"
      style={{
        left: px(PAYLOAD_X),
        top: py(STOPS[0]),
        width: px(PAYLOAD.w),
        height: py(PAYLOAD.h),
        borderRadius: "clamp(0.5rem, 3.333cqw, 0.875rem)",
        borderWidth: 1,
        borderStyle: "solid",
        zIndex: 10,
      }}
      initial={false}
      animate={
        playing
          ? {
              y: [
                shift(STOPS[0]),
                shift(STOPS[0]),
                shift(STOPS[1]),
                shift(STOPS[1]),
                shift(STOPS[2]),
                shift(STOPS[2]),
              ],
              opacity: [0, 1, 1, 1, 1, 1],
              borderColor: [
                "var(--color-hair)",
                "var(--color-hair)",
                "var(--color-ink)",
                "var(--color-ink)",
                "var(--color-ink)",
                "var(--color-ink)",
              ],
            }
          : // Resolved: quarantined in the DLQ slot, still in its failed state.
            {
              y: shift(STOPS[2]),
              opacity: 1,
              borderColor: "var(--color-ink)",
            }
      }
      transition={
        playing
          ? {
              duration: LOOP,
              times: [0, at(1.0), at(1.5), at(2.9), at(3.5), 1],
              repeat: Infinity,
              ease: EASE.out,
            }
          : undefined
      }
    >
      <code className="text-ink" style={{ fontSize: ts(12) }}>
        {`{ "event": "sync" }`}
      </code>
    </motion.div>
  );
}
