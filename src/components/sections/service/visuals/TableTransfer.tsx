"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
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
 * A move you can prove.
 *
 * The legacy table drains, everything passes through a staging store that
 * checksums it, the target fills, and the reconciliation panel counts what has
 * been verified. Nothing crosses directly: that is the argument, since a
 * migration you can prove is one where every row was written down somewhere in
 * between.
 *
 * The store sits between the two tables without touching either, and the tables
 * sit at different vertical offsets. That keeps it clear of the marketplace
 * two-sided model, whose core is a large plane deliberately *overlapping* both
 * sides with its route arcing over the top — here the middle is a small waypoint
 * on a descending line, not a shared surface.
 *
 * **The blueprint's connectors drifted off the rows they claim to join.** They
 * were specified at y=160/260/360 on the left and 220/320/420 on the right,
 * while the rows they connect have midlines at 158/248/338 and 218/308/398 —
 * off by 2, then 12, then 22, growing with each bridge. Every endpoint is
 * derived from the row geometry here.
 *
 * **The scripting panel is added.** The service is Data Migration *and
 * Scripting*, and the blueprint depicted no scripting at all while leaving the
 * bottom-left quadrant empty. One panel closes both gaps.
 */

const LOOP = 9;
const at = (seconds: number) => beat(seconds, LOOP);

const LEGACY = { x: 40, y: 60, w: 320, h: 400 };
const STORE = { x: 405, y: 210, w: 150, h: 170 };
const TARGET = { x: 600, y: 120, w: 320, h: 400 };

const STORE_MID_Y = STORE.y + STORE.h / 2;

const ROW_X = 28;
const ROW_W = 264;
const ROW_H = 36;
const ROW_PITCH = 45;
const ROW_TOP = 80;

const GRID = "26% 42% 32%";

const LEGACY_ROWS = [
  ["8492", "A. Smith", "2018-04-12"],
  ["8493", "J. Doe", "2018-06-03"],
  ["8494", "S. Lee", "2019-01-27"],
  ["8495", "M. Ray", "2019-08-14"],
  ["8496", "K. Patel", "2020-02-09"],
  ["8497", "R. Iqbal", "2020-11-30"],
];

const TARGET_ROWS = [
  ["0x7a1c", "A. Smith", "TRUE"],
  ["0x7a1d", "J. Doe", "TRUE"],
  ["0x7a1e", "S. Lee", "TRUE"],
  ["0x7a1f", "M. Ray", "TRUE"],
  ["0x7a20", "K. Patel", "TRUE"],
  ["0x7a21", "R. Iqbal", "TRUE"],
];

/** Canvas midline of row `i`, derived rather than restated. */
const legacyMid = (i: number) => LEGACY.y + ROW_TOP + i * ROW_PITCH + ROW_H / 2;
const targetMid = (i: number) => TARGET.y + ROW_TOP + i * ROW_PITCH + ROW_H / 2;

/** Three rows in, three rows out — everything by way of the store. */
const INTAKE = [0, 2, 4].map((i, n) => ({
  id: `in-${i}`,
  x1: LEGACY.x + LEGACY.w,
  y1: legacyMid(i),
  x2: STORE.x,
  y2: STORE_MID_Y,
  t: 0.3 + n * 0.6,
}));

const OUTFLOW = [0, 2, 4].map((i, n) => ({
  id: `out-${i}`,
  x1: STORE.x + STORE.w,
  y1: STORE_MID_Y,
  x2: TARGET.x,
  y2: targetMid(i),
  t: 1.2 + n * 0.6,
}));

const HOPS = [...INTAKE, ...OUTFLOW];

const REST = 8.4;

export function TableTransfer() {
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
            r={4}
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
        box={LEGACY}
        eyebrow="Source"
        title="Legacy DB (MySQL)"
        columns={["id", "name", "created_at"]}
        footer="6 of 142,500 shown"
        float={{ amplitude: 6, period: 12, phase: 0 }}
      >
        {LEGACY_ROWS.map((row, i) => {
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
                padding: `0 ${cq(12)}`,
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
              <Cells row={row} />
            </motion.div>
          );
        })}
      </TablePanel>

      {/* ---- The staging store ---- */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 5, period: 13, phase: 0.3 }}
        className="absolute flex flex-col items-center justify-center"
        style={{
          left: px(STORE.x),
          top: py(STORE.y),
          width: px(STORE.w),
          height: py(STORE.h),
          padding: cq(14),
          backgroundColor: "#fff",
          borderRadius: "clamp(0.625rem, 2.083cqw, 1.25rem)",
          zIndex: 30,
        }}
      >
        <Cylinder />
        <span
          className="text-ink font-medium"
          style={{ fontSize: ts(11), marginTop: cq(12) }}
        >
          Staging
        </span>
        <span
          className="text-muted tabular-nums"
          style={{ fontSize: ts(9), marginTop: cq(5) }}
        >
          checksummed
        </span>
      </FloatPanel>

      {/* ---- Target ---- */}
      <TablePanel
        playing={playing}
        box={TARGET}
        eyebrow="Target"
        title="Target Schema (Postgres)"
        columns={["uuid", "full_name", "verified"]}
        footer="Constraints enforced"
        accent
        float={{ amplitude: 6, period: 12, phase: 0.5 }}
      >
        {TARGET_ROWS.map((row, i) => {
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
                padding: `0 ${cq(12)}`,
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
              <Cells row={row} verified />
            </motion.div>
          );
        })}
      </TablePanel>

      {/* ---- Reconciliation ---- */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 6, period: 12, phase: 0.5 }}
        className="absolute flex items-center justify-between"
        style={{
          left: px(TARGET.x),
          top: py(540),
          width: px(TARGET.w),
          height: py(60),
          padding: `0 ${cq(22)}`,
          borderRadius: "clamp(0.5rem, 1.667cqw, 1rem)",
          zIndex: 30,
        }}
      >
        <span className="text-ink-soft" style={{ fontSize: ts(11) }}>
          Records migrated
        </span>
        {/* TODO(content): illustrative figures. */}
        <span
          className="font-display text-brand-600 leading-none font-semibold tracking-tight tabular-nums"
          style={{ fontSize: ts(20) }}
        >
          <CountUp value={142500} delay={1} duration={3} />
        </span>
      </FloatPanel>

      {/* ---- The scripting half of the service ---- */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 6, period: 14, phase: 0.25 }}
        className="absolute overflow-hidden"
        style={{
          left: px(LEGACY.x),
          top: py(500),
          width: px(LEGACY.w),
          height: py(100),
          backgroundColor: "var(--color-paper)",
          borderRadius: "clamp(0.5rem, 1.667cqw, 1rem)",
          padding: cq(16),
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
            style={{ fontSize: ts(9), marginLeft: cq(6) }}
          >
            migrate.ts
          </span>
        </div>
        <p
          className="text-ink-soft truncate font-mono"
          style={{ fontSize: ts(10), marginTop: cq(12) }}
        >
          $ migrate --verify --batch 500
        </p>
        <p
          className="text-brand-700 truncate font-mono"
          style={{ fontSize: ts(10), marginTop: cq(7) }}
        >
          ✓ checksum matched · 0 orphaned rows
        </p>
      </FloatPanel>
    </div>
  );
}

/** The store, drawn as one. A labelled box would not read as a database. */
function Cylinder() {
  return (
    <svg
      viewBox="0 0 40 48"
      style={{ width: cq(40), height: cq(48) }}
      fill="none"
      stroke="var(--color-brand-500)"
      strokeWidth={1.6}
      strokeLinecap="round"
    >
      <ellipse cx="20" cy="9" rx="16" ry="7" fill="var(--color-brand-50)" />
      <path
        d="M4 9 L4 39 A16 7 0 0 0 36 39 L36 9"
        fill="var(--color-brand-50)"
      />
      <ellipse cx="20" cy="9" rx="16" ry="7" />
      <path d="M4 19 A16 7 0 0 0 36 19" opacity={0.5} />
      <path d="M4 29 A16 7 0 0 0 36 29" opacity={0.5} />
    </svg>
  );
}

function Cells({
  row,
  verified = false,
}: {
  row: string[];
  verified?: boolean;
}) {
  return (
    <>
      {row.map((cell, c) => (
        <span
          key={c}
          className={
            c === 0
              ? "text-muted truncate tabular-nums"
              : verified && c === 2
                ? "text-brand-700 truncate font-medium"
                : "text-ink-soft truncate"
          }
          style={{ fontSize: ts(10) }}
        >
          {cell}
        </span>
      ))}
    </>
  );
}

function TablePanel({
  playing,
  box,
  eyebrow,
  title,
  columns,
  footer,
  accent = false,
  float,
  children,
}: {
  playing: boolean;
  box: { x: number; y: number; w: number; h: number };
  eyebrow: string;
  title: string;
  columns: string[];
  footer: string;
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
        left: px(box.x),
        top: py(box.y),
        width: px(box.w),
        height: py(box.h),
        backgroundColor: accent ? "#fff" : "var(--color-paper)",
        borderColor: accent ? "var(--color-brand-300)" : "var(--color-hair)",
        borderRadius: "clamp(0.75rem, 2.5cqw, 1.5rem)",
        zIndex: 20,
      }}
    >
      <div
        className="border-hair border-b"
        style={{ padding: `${cq(16)} ${cq(20)} ${cq(12)}` }}
      >
        <p
          className="text-muted font-semibold tracking-[0.08em] uppercase"
          style={{ fontSize: ts(9) }}
        >
          {eyebrow}
        </p>
        <p
          className="text-ink truncate font-medium"
          style={{ fontSize: ts(13), marginTop: cq(4) }}
        >
          {title}
        </p>
      </div>

      <div
        className="absolute grid items-center"
        style={{
          left: cq(ROW_X),
          top: cq(56),
          width: cq(ROW_W),
          height: cq(20),
          gridTemplateColumns: GRID,
          padding: `0 ${cq(12)}`,
        }}
      >
        {columns.map((column) => (
          <span
            key={column}
            className="text-muted truncate font-medium"
            style={{ fontSize: ts(9) }}
          >
            {column}
          </span>
        ))}
      </div>

      {children}

      <span
        className="text-muted absolute"
        style={{ left: cq(ROW_X), bottom: cq(18), fontSize: ts(9) }}
      >
        {footer}
      </span>
    </FloatPanel>
  );
}
