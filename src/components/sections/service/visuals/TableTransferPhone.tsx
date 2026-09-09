"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  Cells,
  Cylinder,
  GRID,
  LEGACY_COLUMNS,
  LEGACY_ROWS,
  LEGACY_TITLE,
  LOOP,
  MIGRATED,
  REST,
  SCRIPT_COMMAND,
  SCRIPT_FILE,
  SCRIPT_RESULT,
  TARGET_COLUMNS,
  TARGET_ROWS,
  TARGET_TITLE,
  at,
  shownLabel,
} from "@/components/sections/service/visuals/tableTransferShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * Phone stage of the data-migration-scripting depiction.
 *
 * The 960x640 drawing runs left to right — legacy table, staging store, target
 * table — with a reconciliation panel and a scripting panel filling the bottom
 * corners. Two 320-wide tables side by side need 640 units of width before the
 * store between them; a 327px column has room for one.
 *
 * So the run turns vertical, and the descent becomes the migration: source at
 * the top, staging in the middle, target below it. That also gives the hops a
 * shape they never had on the desktop — three lines converge into the store and
 * three diverge out of it, which is what a staging step actually does to a
 * table and reads at a glance as a funnel rather than as six parallel wires.
 *
 * **What is kept, because it is the argument.** Nothing crosses directly. Every
 * row goes by way of a store that checksums it, the legacy rows drain rather
 * than vanish, the target rows rise into place, and the scripting panel stays —
 * the service is Data Migration *and* Scripting, and the desktop added that
 * panel precisely because the blueprint depicted no scripting at all.
 *
 * **What changed.** Three rows a table rather than six, so the footer reads "3
 * of 142,500 shown" — the count was always the thing carrying the scale, not
 * the row count. The reconciliation panel is gone as a panel and its figure is
 * the target's footer instead, which is where a migrated-record count belongs;
 * "Constraints enforced" goes with it, since the `verified · TRUE` column
 * already says so. Each table's eyebrow sits inline with its title rather than
 * above it, which buys back the height the extra table costs.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 640);

const PANEL_X = 20;
const PANEL_W = 320;
const TABLE_H = 188;

const LEGACY = { y: 20, h: TABLE_H };
const STORE = { x: 90, y: 232, w: 180, h: 64 };
const TARGET = { y: 320, h: TABLE_H };
const SCRIPT = { y: 532, h: 88 };

/** Table interior, panel-relative. */
const ROW_X = 16;
const ROW_W = PANEL_W - ROW_X * 2;
const HEAD_Y = 48;
const ROW_TOP = 70;
const ROW_H = 26;
const ROW_PITCH = 30;
const FOOTER_Y = 162;

/** Three rows in, three rows out — everything by way of the store. */
const LANES = [100, 180, 260];
const STORE_CX = STORE.x + STORE.w / 2;

const INTAKE = LANES.map((x, n) => ({
  id: `in-${n}`,
  x1: x,
  y1: LEGACY.y + LEGACY.h,
  x2: STORE_CX,
  y2: STORE.y,
  t: 0.3 + n * 0.6,
}));

const OUTFLOW = LANES.map((x, n) => ({
  id: `out-${n}`,
  x1: STORE_CX,
  y1: STORE.y + STORE.h,
  x2: x,
  y2: TARGET.y,
  t: 1.2 + n * 0.6,
}));

const HOPS = [...INTAKE, ...OUTFLOW];

const ROWS_SHOWN = 3;
const LEGACY_SHOWN = LEGACY_ROWS.slice(0, ROWS_SHOWN);
const TARGET_SHOWN = TARGET_ROWS.slice(0, ROWS_SHOWN);

export function TableTransferPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="md" className="top-[30%] left-[18%]" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <path
          d={HOPS.map((h) => `M ${h.x1} ${h.y1} L ${h.x2} ${h.y2}`).join(" ")}
          fill="none"
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {HOPS.map((h) => (
          <motion.circle
            key={h.id}
            r={3.5}
            fill="var(--color-brand-500)"
            initial={false}
            animate={
              playing
                ? {
                    cx: [h.x1, h.x1, (h.x1 + h.x2) / 2, h.x2, h.x2],
                    cy: [h.y1, h.y1, (h.y1 + h.y2) / 2, h.y2, h.y2],
                    opacity: [0, 0, 1, 0, 0],
                  }
                : { cx: h.x2, cy: h.y2, opacity: 0 }
            }
            transition={
              playing
                ? {
                    duration: LOOP,
                    times: [0, at(h.t), at(h.t + 0.35), at(h.t + 0.7), 1],
                    repeat: Infinity,
                    ease: "linear",
                  }
                : undefined
            }
          />
        ))}
      </svg>

      {/* ---- Legacy ---- */}
      <TablePanel
        playing={playing}
        y={LEGACY.y}
        h={LEGACY.h}
        eyebrow="Source"
        title={LEGACY_TITLE}
        columns={LEGACY_COLUMNS}
        footer={
          <span className="text-muted" style={{ fontSize: ts(10) }}>
            {shownLabel(ROWS_SHOWN)}
          </span>
        }
        float={{ amplitude: 5, period: 12, phase: 0 }}
      >
        {LEGACY_SHOWN.map((row, i) => {
          const delay = 0.3 + i * 0.4;
          return (
            <motion.div
              key={row[0]}
              className="border-hair absolute grid items-center rounded-lg border bg-white"
              style={{
                left: cq(ROW_X),
                top: cq(ROW_TOP + i * ROW_PITCH),
                width: cq(ROW_W),
                height: cq(ROW_H),
                gridTemplateColumns: GRID,
                padding: `0 ${cq(10)}`,
              }}
              initial={false}
              animate={
                playing ? { opacity: [1, 1, 0.3, 0.3, 1] } : { opacity: 0.3 }
              }
              transition={
                playing
                  ? {
                      duration: LOOP,
                      times: [0, at(delay), at(delay + 0.5), at(REST), 1],
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : undefined
              }
            >
              <Cells row={row} fontSize={ts(11)} />
            </motion.div>
          );
        })}
      </TablePanel>

      {/* ---- The staging store ---- */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 4, period: 13, phase: 0.3 }}
        className="absolute flex items-center"
        style={{
          left: px(STORE.x),
          top: py(STORE.y),
          width: px(STORE.w),
          height: py(STORE.h),
          padding: `0 ${cq(16)}`,
          gap: cq(12),
          backgroundColor: "#fff",
          borderRadius: "clamp(0.625rem, 3.333cqw, 1rem)",
          zIndex: 30,
        }}
      >
        <Cylinder width={cq(28)} height={cq(34)} />
        <span className="min-w-0">
          <span
            className="text-ink block font-medium"
            style={{ fontSize: ts(12) }}
          >
            Staging
          </span>
          <span
            className="text-muted block"
            style={{ fontSize: ts(10), marginTop: cq(3) }}
          >
            checksummed
          </span>
        </span>
      </FloatPanel>

      {/* ---- Target ---- */}
      <TablePanel
        playing={playing}
        y={TARGET.y}
        h={TARGET.h}
        eyebrow="Target"
        title={TARGET_TITLE}
        columns={TARGET_COLUMNS}
        accent
        footer={
          <>
            <span className="text-ink-soft" style={{ fontSize: ts(11) }}>
              Records migrated
            </span>
            <span
              className="font-display text-brand-600 leading-none font-semibold tracking-tight tabular-nums"
              style={{ fontSize: ts(18) }}
            >
              <CountUp value={MIGRATED} delay={1} duration={3} />
            </span>
          </>
        }
        float={{ amplitude: 5, period: 12, phase: 0.5 }}
      >
        {TARGET_SHOWN.map((row, i) => {
          const delay = 1.1 + i * 0.4;
          return (
            <motion.div
              key={row[0]}
              className="border-hair absolute grid items-center rounded-lg border"
              style={{
                left: cq(ROW_X),
                top: cq(ROW_TOP + i * ROW_PITCH),
                width: cq(ROW_W),
                height: cq(ROW_H),
                gridTemplateColumns: GRID,
                padding: `0 ${cq(10)}`,
                backgroundColor: "var(--color-paper)",
              }}
              initial={false}
              animate={
                playing
                  ? {
                      opacity: [0, 0, 1, 1, 0],
                      y: ["22%", "22%", "0%", "0%", "22%"],
                    }
                  : { opacity: 1, y: "0%" }
              }
              transition={
                playing
                  ? {
                      duration: LOOP,
                      times: [0, at(delay), at(delay + 0.5), at(REST), 1],
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : undefined
              }
            >
              <Cells row={row} fontSize={ts(11)} verified />
            </motion.div>
          );
        })}
      </TablePanel>

      {/* ---- The scripting half of the service ---- */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 5, period: 14, phase: 0.25 }}
        className="absolute overflow-hidden"
        style={{
          left: px(PANEL_X),
          top: py(SCRIPT.y),
          width: px(PANEL_W),
          height: py(SCRIPT.h),
          backgroundColor: "var(--color-paper)",
          borderRadius: "clamp(0.5rem, 3.333cqw, 1rem)",
          padding: cq(14),
          zIndex: 30,
        }}
      >
        <div className="flex items-center" style={{ gap: cq(6) }}>
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="bg-hair block rounded-full"
              style={{ width: cq(6), height: cq(6) }}
            />
          ))}
          <span
            className="text-muted"
            style={{ fontSize: ts(10), marginLeft: cq(6) }}
          >
            {SCRIPT_FILE}
          </span>
        </div>
        <p
          className="text-ink-soft truncate font-mono"
          style={{ fontSize: ts(11), marginTop: cq(11) }}
        >
          {SCRIPT_COMMAND}
        </p>
        <p
          className="text-brand-700 truncate font-mono"
          style={{ fontSize: ts(11), marginTop: cq(7) }}
        >
          {SCRIPT_RESULT}
        </p>
      </FloatPanel>
    </div>
  );
}

/**
 * A table, with its eyebrow inline against its title.
 *
 * The desktop stacks the two, which costs a line. Stacking twice on a canvas
 * carrying two tables is a line and a half of the store's height, and "SOURCE"
 * beside "Legacy DB (MySQL)" is 153 of the 288 units available — it reads as a
 * label on a title rather than as a heading needing its own row.
 */
function TablePanel({
  playing,
  y,
  h,
  eyebrow,
  title,
  columns,
  footer,
  accent = false,
  float,
  children,
}: {
  playing: boolean;
  y: number;
  h: number;
  eyebrow: string;
  title: string;
  columns: string[];
  footer: React.ReactNode;
  accent?: boolean;
  float: { amplitude: number; period: number; phase: number };
  children: React.ReactNode;
}) {
  return (
    <FloatPanel
      playing={playing}
      focal={accent}
      float={float}
      className="absolute overflow-hidden"
      style={{
        left: px(PANEL_X),
        top: py(y),
        width: px(PANEL_W),
        height: py(h),
        backgroundColor: accent ? "#fff" : "var(--color-paper)",
        borderColor: accent ? "var(--color-brand-300)" : "var(--color-hair)",
        borderRadius: "clamp(0.75rem, 4.444cqw, 1.25rem)",
        zIndex: 20,
      }}
    >
      <div
        className="border-hair flex items-baseline border-b"
        style={{ padding: `${cq(12)} ${cq(ROW_X)}`, gap: cq(8) }}
      >
        <span
          className="text-muted shrink-0 font-semibold tracking-[0.08em] uppercase"
          style={{ fontSize: ts(10) }}
        >
          {eyebrow}
        </span>
        <span
          className="text-ink truncate font-medium"
          style={{ fontSize: ts(12) }}
        >
          {title}
        </span>
      </div>

      <div
        className="absolute grid items-center"
        style={{
          left: cq(ROW_X),
          top: cq(HEAD_Y),
          width: cq(ROW_W),
          height: cq(16),
          gridTemplateColumns: GRID,
          padding: `0 ${cq(10)}`,
        }}
      >
        {columns.map((column) => (
          <span
            key={column}
            className="text-muted truncate font-medium"
            style={{ fontSize: ts(10) }}
          >
            {column}
          </span>
        ))}
      </div>

      {children}

      <div
        className="absolute flex items-center justify-between"
        style={{
          left: cq(ROW_X),
          top: cq(FOOTER_Y),
          width: cq(ROW_W),
          height: cq(22),
        }}
      >
        {footer}
      </div>
    </FloatPanel>
  );
}
