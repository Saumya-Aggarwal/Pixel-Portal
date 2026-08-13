"use client";

import { motion } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import {
  beat,
  cq,
  px,
  py,
  ts,
} from "@/components/sections/service/visuals/canvas";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * Software, not a website with a login.
 *
 * A single application shell fills the canvas and every event happens inside
 * it. This is the only illustration in the set with **no leader lines at all** —
 * that absence is what keeps it from reading as another browser window with
 * cards beside it.
 *
 * The pointer runs a short session rather than a single click: it opens the
 * access log, opens the profile, and only then changes the role, at which point
 * the two rows an Editor cannot see are withdrawn and the rest close the gap.
 * Three stops is what makes the shell feel operated rather than demonstrated,
 * and each stop opens a real overlay — a log flyout and a profile card — so the
 * rail is doing something rather than sitting there as a list of words.
 *
 * It is also the only cursor anywhere in the set, which is appropriate: this is
 * the one drawing whose subject is a person working a tool.
 *
 * **Two fixes to the blueprint.** It put the confirmation chip at 680,105,
 * inside the toolbar's own box and on top of the role selector it was meant to
 * confirm; the chip now sits in the band between the toolbar and the table
 * head. And it specified four rows ending at y=420 inside a shell running to
 * y=560, leaving 140 units of empty panel — there are seven rows and a record
 * footer now.
 *
 * Rows move with a percentage `y` transform rather than `top`, so the shift is
 * composited rather than a layout pass per frame. One row of travel is the
 * pitch over the row's own height; a row with two admin rows above it moves
 * twice that, which is why the shift is computed per row rather than shared.
 */

const LOOP = 13;
const at = (seconds: number) => beat(seconds, LOOP);

const SHELL = { x: 120, y: 80, w: 720, h: 480 };
const RAIL_W = 160;
const RAIL_PAD = 16;
const TOOLBAR_H = 56;
const TABLE_X = 200;
const TABLE_W = 480;
const ROW_H = 34;
const ROW_PITCH = 40;
const ROW_TOP = 134;

/** Rail item geometry, so the pointer and the hover tint agree with the list. */
const NAV_TOP = 56;
const NAV_H = 26;
const NAV_PITCH = 29;
const navTop = (i: number) => NAV_TOP + i * NAV_PITCH;

const NAV = [
  "Dashboard",
  "Users",
  "Roles",
  "Settings",
  "Reports",
  "Access Logs",
  "Integrations",
];
const LOGS_INDEX = 5;

/** Centre of the role selector, which is the pointer's last stop. */
const ROLE_W = 112;
const ROLE_CX = RAIL_W + (SHELL.w - RAIL_W) - 20 - ROLE_W / 2;

/** Pointer stops, as tip positions inside the shell. */
const STOP = {
  idle: { x: 430, y: 300 },
  logs: { x: 62, y: navTop(LOGS_INDEX) + NAV_H / 2 - 4 },
  profile: { x: 62, y: 442 },
  role: { x: ROLE_CX, y: 30 },
};

const COLUMNS = ["ID", "Name", "Role", "Last Active", "Status"];
const GRID = "16% 24% 20% 22% 18%";

const ROWS = [
  ["USR-01", "A. Smith", "Admin", "Today", "Active"],
  ["USR-02", "J. Doe", "Editor", "Yesterday", "Active"],
  ["USR-03", "S. Lee", "Editor", "Oct 12", "Active"],
  ["USR-04", "M. Ray", "Viewer", "Oct 10", "Locked"],
  ["USR-05", "K. Patel", "Viewer", "Oct 9", "Active"],
  ["USR-06", "D. Osei", "Admin", "Oct 8", "Active"],
  ["USR-07", "L. Chen", "Editor", "Oct 5", "Active"],
];

const LOG_ENTRIES = [
  ["A. Smith", "signed in", "2m ago"],
  ["J. Doe", "exported CSV", "1h ago"],
  ["M. Ray", "failed login", "3h ago"],
];

/** The rows an Editor cannot see. Everything below each one closes the gap. */
const ADMIN_ROWS = [0, 5];
const isAdmin = (i: number) => ADMIN_ROWS.includes(i);
const shiftFor = (i: number) =>
  `-${(ADMIN_ROWS.filter((a) => a < i).length * ROW_PITCH * 100) / ROW_H}%`;

const SHIFT_TIMES = [0, at(7.8), at(8.4), at(11.5), 1];
const DROP_TIMES = [0, at(7.5), at(8.0), at(11.5), 1];
const DROP_OPACITY = [1, 1, 0, 0, 1];
const DROP_X = ["0%", "0%", "-6%", "-6%", "0%"];

/** Label swaps. Admin reads until the click, Editor from there to the reset. */
const SWAP_TIMES = [0, at(7.0), at(7.2), at(11.5), at(11.8), 1];
const SWAP_OUT = [1, 1, 0, 0, 1, 1];
const SWAP_IN = [0, 0, 1, 1, 0, 0];

/** Overlay in/out, as [enter, settled, leaving, gone]. */
const overlay = (enter: number, exit: number) => ({
  times: [0, at(enter), at(enter + 0.25), at(exit), at(exit + 0.25), 1],
  opacity: [0, 0, 1, 1, 0, 0],
  y: [8, 8, 0, 0, 8, 8],
});

const LOGS = overlay(2.35, 3.5);
const PROFILE = overlay(4.55, 5.7);

export function AppShell() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  const swap = playing
    ? { duration: LOOP, times: SWAP_TIMES, repeat: Infinity }
    : undefined;

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="lg" className="top-[25%] left-[33.333%]" />

      <FloatPanel
        playing={playing}
        focal
        interactive
        float={{ amplitude: 6, period: 12, phase: 0 }}
        className="absolute overflow-hidden"
        style={{
          left: px(SHELL.x),
          top: py(SHELL.y),
          width: px(SHELL.w),
          height: py(SHELL.h),
          backgroundColor: "var(--color-paper)",
          borderRadius: "clamp(0.75rem, 2.5cqw, 1.5rem)",
        }}
      >
        {/* ---- Rail ---- */}
        <div
          className="border-hair absolute inset-y-0 left-0 flex flex-col border-r bg-white"
          style={{ width: cq(RAIL_W), padding: cq(RAIL_PAD) }}
        >
          <div className="flex items-center" style={{ gap: cq(9) }}>
            <span
              className="bg-brand-600 block rounded-md"
              style={{ width: cq(20), height: cq(20) }}
            />
            <span className="text-ink font-medium" style={{ fontSize: ts(12) }}>
              Operations
            </span>
          </div>

          {/* Hover tint, behind the list rather than on the item, so the item
              itself stays a plain span and the two cannot fall out of step. */}
          <motion.span
            className="bg-brand-50/70 absolute rounded-md"
            style={{
              left: cq(RAIL_PAD),
              top: cq(navTop(LOGS_INDEX)),
              width: cq(RAIL_W - RAIL_PAD * 2),
              height: cq(NAV_H),
            }}
            initial={false}
            animate={playing ? { opacity: [0, 0, 1, 1, 0, 0] } : { opacity: 0 }}
            transition={
              playing
                ? {
                    duration: LOOP,
                    times: [0, at(1.9), at(2.1), at(3.6), at(3.9), 1],
                    repeat: Infinity,
                  }
                : undefined
            }
          />

          <div style={{ display: "grid", gap: cq(3), marginTop: cq(20) }}>
            {NAV.map((item) => (
              <span
                key={item}
                className={
                  item === "Users"
                    ? "bg-brand-50 text-brand-800 relative flex items-center rounded-md font-medium"
                    : "text-ink-soft relative flex items-center rounded-md"
                }
                style={{
                  fontSize: ts(11),
                  height: cq(NAV_H),
                  paddingLeft: cq(10),
                }}
              >
                {item}
              </span>
            ))}
          </div>

          <div
            className="border-hair mt-auto flex items-center border-t"
            style={{ gap: cq(8), paddingTop: cq(12) }}
          >
            <span
              className="bg-brand-100 block shrink-0 rounded-full"
              style={{ width: cq(22), height: cq(22) }}
            />
            <span className="min-w-0">
              <span
                className="text-ink block truncate"
                style={{ fontSize: ts(10) }}
              >
                R. Mehta
              </span>
              <span
                className="text-muted block truncate"
                style={{ fontSize: ts(9) }}
              >
                Owner
              </span>
            </span>
          </div>
        </div>

        {/* ---- Toolbar ---- */}
        <div
          className="border-hair absolute top-0 flex items-center justify-between border-b"
          style={{
            left: cq(RAIL_W),
            width: cq(SHELL.w - RAIL_W),
            height: cq(TOOLBAR_H),
            padding: `0 ${cq(20)}`,
          }}
        >
          <span
            className="border-hair text-muted flex items-center rounded-full border bg-white"
            style={{
              fontSize: ts(10),
              height: cq(26),
              width: cq(150),
              paddingLeft: cq(12),
            }}
          >
            Search users…
          </span>
          <span className="flex items-center" style={{ gap: cq(10) }}>
            <span
              className="border-hair text-ink-soft flex items-center rounded-full border bg-white"
              style={{
                fontSize: ts(10),
                height: cq(26),
                padding: `0 ${cq(12)}`,
              }}
            >
              Export CSV
            </span>
            <motion.span
              className="border-brand-300 bg-brand-50 relative flex items-center rounded-full border"
              style={{ fontSize: ts(10), height: cq(26), width: cq(ROLE_W) }}
              initial={false}
              animate={playing ? { scale: [1, 1, 0.96, 1, 1] } : { scale: 1 }}
              transition={
                playing
                  ? {
                      duration: LOOP,
                      times: [0, at(6.85), at(7.0), at(7.2), 1],
                      repeat: Infinity,
                    }
                  : undefined
              }
            >
              <motion.span
                className="text-brand-700 absolute font-medium"
                style={{ left: cq(12) }}
                initial={false}
                animate={playing ? { opacity: SWAP_OUT } : { opacity: 0 }}
                transition={swap}
              >
                View: Admin
              </motion.span>
              <motion.span
                className="text-brand-700 absolute font-medium"
                style={{ left: cq(12) }}
                initial={false}
                animate={playing ? { opacity: SWAP_IN } : { opacity: 1 }}
                transition={swap}
              >
                View: Editor
              </motion.span>
            </motion.span>
          </span>
        </div>

        {/* ---- Confirmation ---- */}
        <motion.span
          className="bg-brand-600 absolute z-40 grid place-items-center rounded-full font-semibold tracking-[0.08em] text-white uppercase"
          style={{
            left: cq(TABLE_X + TABLE_W - 160),
            top: cq(63),
            width: cq(160),
            height: cq(26),
            fontSize: ts(9),
          }}
          initial={false}
          animate={
            playing
              ? { opacity: [0, 0, 1, 1, 0, 0], y: [8, 8, 0, 0, 8, 8] }
              : { opacity: 0, y: 8 }
          }
          transition={
            playing
              ? {
                  duration: LOOP,
                  times: [0, at(7.2), at(7.6), at(8.6), at(9.0), 1],
                  repeat: Infinity,
                }
              : undefined
          }
        >
          Access updated
        </motion.span>

        {/* ---- Table ---- */}
        <div
          className="border-hair absolute grid items-center rounded-lg border bg-white"
          style={{
            left: cq(TABLE_X),
            top: cq(96),
            width: cq(TABLE_W),
            height: cq(30),
            gridTemplateColumns: GRID,
            padding: `0 ${cq(16)}`,
          }}
        >
          {COLUMNS.map((column) => (
            <span
              key={column}
              className="text-muted truncate font-medium"
              style={{ fontSize: ts(10) }}
            >
              {column}
            </span>
          ))}
        </div>

        {ROWS.map((row, i) => {
          const admin = isAdmin(i);
          const shift = shiftFor(i);
          return (
            <motion.div
              key={row[0]}
              className="border-hair absolute grid items-center rounded-lg border bg-white"
              style={{
                left: cq(TABLE_X),
                top: cq(ROW_TOP + i * ROW_PITCH),
                width: cq(TABLE_W),
                height: cq(ROW_H),
                gridTemplateColumns: GRID,
                padding: `0 ${cq(16)}`,
              }}
              initial={false}
              animate={
                playing
                  ? admin
                    ? { opacity: DROP_OPACITY, x: DROP_X }
                    : { y: ["0%", "0%", shift, shift, "0%"] }
                  : admin
                    ? { opacity: 0, x: "-6%" }
                    : { y: shift }
              }
              transition={
                playing
                  ? {
                      duration: LOOP,
                      times: admin ? DROP_TIMES : SHIFT_TIMES,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : undefined
              }
            >
              {row.map((cell, c) => (
                <span
                  key={COLUMNS[c]}
                  className={
                    c === 4 && cell === "Locked"
                      ? "text-muted truncate"
                      : c === 1
                        ? "text-ink truncate font-medium"
                        : "text-ink-soft truncate"
                  }
                  style={{ fontSize: ts(10) }}
                >
                  {cell}
                </span>
              ))}
            </motion.div>
          );
        })}

        {/* ---- Record footer ---- */}
        <div
          className="absolute flex items-center justify-between"
          style={{
            left: cq(TABLE_X),
            top: cq(424),
            width: cq(TABLE_W),
            height: cq(32),
          }}
        >
          <span
            className="text-muted relative flex items-center"
            style={{ fontSize: ts(10) }}
          >
            <motion.span
              className="absolute whitespace-nowrap"
              initial={false}
              animate={playing ? { opacity: SWAP_OUT } : { opacity: 0 }}
              transition={swap}
            >
              Showing 7 of 128 users
            </motion.span>
            <motion.span
              className="absolute whitespace-nowrap"
              initial={false}
              animate={playing ? { opacity: SWAP_IN } : { opacity: 1 }}
              transition={swap}
            >
              Showing 5 of 128 users
            </motion.span>
          </span>
          <span className="flex items-center" style={{ gap: cq(6) }}>
            {["1", "2", "3"].map((page) => (
              <span
                key={page}
                className={
                  page === "1"
                    ? "border-brand-300 text-brand-700 grid place-items-center rounded-md border bg-white"
                    : "border-hair text-muted grid place-items-center rounded-md border bg-white"
                }
                style={{ width: cq(22), height: cq(22), fontSize: ts(10) }}
              >
                {page}
              </span>
            ))}
          </span>
        </div>

        {/* ---- Access log flyout ---- */}
        <Overlay
          playing={playing}
          spec={LOGS}
          style={{
            left: cq(178),
            top: cq(140),
            width: cq(285),
            height: cq(165),
          }}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-ink font-medium" style={{ fontSize: ts(11) }}>
              Access Logs
            </span>
            <span className="text-muted" style={{ fontSize: ts(9) }}>
              last 24 hours
            </span>
          </div>
          <div style={{ display: "grid", gap: cq(7), marginTop: cq(12) }}>
            {LOG_ENTRIES.map(([who, what, when]) => (
              <div
                key={who}
                className="border-hair flex items-center rounded-md border bg-white"
                style={{ height: cq(28), padding: `0 ${cq(10)}`, gap: cq(8) }}
              >
                <span
                  className="bg-brand-300 block shrink-0 rounded-full"
                  style={{ width: cq(5), height: cq(5) }}
                />
                <span
                  className="text-ink truncate font-medium"
                  style={{ fontSize: ts(9) }}
                >
                  {who}
                </span>
                <span
                  className="text-ink-soft truncate"
                  style={{ fontSize: ts(9) }}
                >
                  {what}
                </span>
                <span
                  className="text-muted ml-auto shrink-0"
                  style={{ fontSize: ts(9) }}
                >
                  {when}
                </span>
              </div>
            ))}
          </div>
        </Overlay>

        {/* ---- Profile popover ---- */}
        <Overlay
          playing={playing}
          spec={PROFILE}
          style={{
            left: cq(22),
            top: cq(296),
            width: cq(196),
            height: cq(112),
          }}
        >
          <div className="flex items-center" style={{ gap: cq(9) }}>
            <span
              className="bg-brand-100 block shrink-0 rounded-full"
              style={{ width: cq(26), height: cq(26) }}
            />
            <span className="min-w-0">
              <span
                className="text-ink block truncate font-medium"
                style={{ fontSize: ts(10) }}
              >
                R. Mehta
              </span>
              <span
                className="text-muted block truncate"
                style={{ fontSize: ts(9) }}
              >
                r.mehta@pixel.in
              </span>
            </span>
          </div>
          <div
            className="border-hair"
            style={{
              borderTopWidth: 1,
              marginTop: cq(10),
              paddingTop: cq(10),
              display: "grid",
              gap: cq(6),
            }}
          >
            <span className="flex items-baseline justify-between">
              <span className="text-muted" style={{ fontSize: ts(9) }}>
                Role
              </span>
              <span
                className="text-brand-700 font-medium"
                style={{ fontSize: ts(9) }}
              >
                Owner
              </span>
            </span>
            <span className="flex items-baseline justify-between">
              <span className="text-muted" style={{ fontSize: ts(9) }}>
                Signed in
              </span>
              <span className="text-ink-soft" style={{ fontSize: ts(9) }}>
                2h ago
              </span>
            </span>
          </div>
        </Overlay>

        <Pointer playing={playing} />
      </FloatPanel>
    </div>
  );
}

/** A floating surface the pointer opens. Enters and leaves; never structural. */
function Overlay({
  playing,
  spec,
  style,
  children,
}: {
  playing: boolean;
  spec: { times: number[]; opacity: number[]; y: number[] };
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="border-hair absolute z-50 flex flex-col border bg-white"
      style={{
        ...style,
        padding: cq(14),
        borderRadius: "clamp(0.5rem, 1.667cqw, 1rem)",
        boxShadow: "var(--shadow-float-hover)",
      }}
      initial={false}
      animate={playing ? { opacity: spec.opacity, y: spec.y } : { opacity: 0 }}
      transition={
        playing
          ? {
              duration: LOOP,
              times: spec.times,
              repeat: Infinity,
              ease: "easeOut",
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * The operator's cursor. Rendered last, inside the shell, so it sits above the
 * interface it is acting on and bobs with it — a pointer that drifts against the
 * panel it is clicking looks detached from it.
 *
 * Small, and carried by a drop shadow rather than an outline. A thick stroke at
 * this size turns the arrow into a blob and competes with the 10px UI text it is
 * supposed to be pointing at.
 */
function Pointer({ playing }: { playing: boolean }) {
  const path = [
    STOP.idle,
    STOP.idle,
    STOP.idle,
    STOP.logs,
    STOP.logs,
    STOP.profile,
    STOP.profile,
    STOP.role,
    STOP.role,
    STOP.role,
    STOP.role,
  ];

  return (
    <motion.span
      className="pointer-events-none absolute"
      style={{ zIndex: 60 }}
      initial={false}
      animate={
        playing
          ? {
              left: path.map((p) => cq(p.x)),
              top: path.map((p) => cq(p.y)),
              opacity: [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            }
          : { left: cq(STOP.role.x), top: cq(STOP.role.y), opacity: 0 }
      }
      transition={
        playing
          ? {
              duration: LOOP,
              times: [
                0,
                at(1.0),
                at(1.2),
                at(2.2),
                at(3.6),
                at(4.4),
                at(5.9),
                at(6.8),
                at(9.0),
                at(9.4),
                1,
              ],
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
    >
      {/* One ripple element, three pulses. Scale resets between them while the
          opacity is still zero, so the snap back is never visible. */}
      <motion.span
        className="border-brand-500 absolute rounded-full border"
        style={{ width: cq(26), height: cq(26), left: cq(-13), top: cq(-13) }}
        initial={false}
        animate={
          playing
            ? {
                opacity: [0, 0, 0.85, 0, 0, 0.85, 0, 0, 0.85, 0, 0],
                scale: [0.3, 0.3, 0.3, 1.4, 0.3, 0.3, 1.4, 0.3, 0.3, 1.4, 1.4],
              }
            : { opacity: 0, scale: 1 }
        }
        transition={
          playing
            ? {
                duration: LOOP,
                times: [
                  0,
                  at(2.28),
                  at(2.3),
                  at(2.75),
                  at(4.48),
                  at(4.5),
                  at(4.95),
                  at(6.88),
                  at(6.9),
                  at(7.35),
                  1,
                ],
                repeat: Infinity,
                ease: "easeOut",
              }
            : undefined
        }
      />
      <svg
        viewBox="0 0 12 18"
        style={{
          width: cq(12),
          height: cq(18),
          display: "block",
          filter: "drop-shadow(0 1px 2px rgb(44 56 49 / 0.3))",
        }}
        fill="white"
        stroke="var(--color-ink)"
        strokeWidth={0.9}
        strokeLinejoin="round"
      >
        <path d="M1 1 L1 14.5 L4.4 11.2 L6.6 16.4 L9 15.4 L6.8 10.4 L11 10.4 Z" />
      </svg>
    </motion.span>
  );
}
