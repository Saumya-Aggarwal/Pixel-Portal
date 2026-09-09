"use client";

import { motion } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { cq, px, py, ts } from "@/components/sections/service/visuals/canvas";
import { AppShellPhone } from "@/components/sections/service/visuals/AppShellPhone";
import {
  CLOSE,
  COLUMNS,
  DROP,
  LOGS_INDEX,
  LOG_ENTRIES,
  NAV,
  PARKED,
  REACT,
  ROWS,
  SESSION,
  SWAP,
  isAdmin,
  makeShift,
  type StopName,
} from "@/components/sections/service/visuals/appShellShared";
import { useSequence } from "@/components/sections/service/visuals/useSequence";
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
 * **The session is a state machine, not a timeline.** Every element used to
 * carry its own copy of a 13-second loop with its own keyframe offsets, and the
 * cursor visibly lagged the reactions it was supposed to be causing — clicks
 * landed a stop early and the role selector never got its ripple. The cause and
 * the fix are documented on `useSequence`; the short version is that the arrow
 * and the things answering it were on two different clocks, so the answer is to
 * have one clock and animate on the change. Reading the code below, `arrived`
 * is the hinge: nothing reacts until the pointer has actually stopped moving.
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

/** Centre of the role selector, which is the pointer's last stop. */
const ROLE_W = 112;
const ROLE_CX = RAIL_W + (SHELL.w - RAIL_W) - 20 - ROLE_W / 2;

/** Pointer stops, as tip positions inside the shell. */
const STOP: Record<StopName, { x: number; y: number }> = {
  idle: { x: 430, y: 300 },
  logs: { x: 62, y: navTop(LOGS_INDEX) + NAV_H / 2 - 4 },
  profile: { x: 62, y: 442 },
  role: { x: ROLE_CX, y: 30 },
};

const GRID = "16% 24% 20% 22% 18%";

const shiftFor = makeShift(ROW_PITCH, ROW_H);

export function AppShell() {
  return (
    <>
      <div className="md:hidden">
        <AppShellPhone />
      </div>
      <div className="hidden md:block">
        <AppShellDesktop />
      </div>
    </>
  );
}

function AppShellDesktop() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();
  const phase = useSequence(SESSION, playing);

  // Parked, the shell shows the session's outcome with no one at the controls.
  // `arrived` is true so the outcome is a settled frame rather than a step
  // caught mid-travel.
  const step = playing ? phase.step : PARKED;
  const arrived = playing ? phase.arrived : true;

  const stop = STOP[step.stop];
  const shown = playing && step.shown === true;
  const clicking = arrived && step.click === true;
  const panel = arrived ? step.panel : undefined;
  const pressing = clicking && step.commit === true;
  // The role change lands on the click, not at the top of the step that
  // contains it — otherwise the table would rearrange while the cursor was
  // still on its way to the button that rearranges it.
  const editor = step.commit ? arrived : step.editor === true;

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
              itself stays a plain span and the two cannot fall out of step.
              It turns on when the pointer stops here and off when it leaves —
              it can no longer answer a visit that has not happened. */}
          <motion.span
            className="bg-brand-50/70 absolute rounded-md"
            style={{
              left: cq(RAIL_PAD),
              top: cq(navTop(LOGS_INDEX)),
              width: cq(RAIL_W - RAIL_PAD * 2),
              height: cq(NAV_H),
            }}
            initial={false}
            animate={{ opacity: arrived && step.stop === "logs" ? 1 : 0 }}
            transition={{ duration: REACT.hover }}
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
            {/* The depress runs on the click and only on the click. It cannot
                start early any more, because the state it reads is the same
                one the ripple reads. */}
            <motion.span
              className="border-brand-300 bg-brand-50 relative flex items-center rounded-full border"
              style={{ fontSize: ts(10), height: cq(26), width: cq(ROLE_W) }}
              initial={false}
              animate={{ scale: pressing ? [1, 0.96, 1] : 1 }}
              transition={
                pressing
                  ? { duration: REACT.press, times: [0, 0.35, 1] }
                  : { duration: 0 }
              }
            >
              <motion.span
                className="text-brand-700 absolute font-medium"
                style={{ left: cq(12) }}
                initial={false}
                animate={{ opacity: editor ? 0 : 1 }}
                transition={SWAP(editor)}
              >
                View: Admin
              </motion.span>
              <motion.span
                className="text-brand-700 absolute font-medium"
                style={{ left: cq(12) }}
                initial={false}
                animate={{ opacity: editor ? 1 : 0 }}
                transition={SWAP(editor)}
              >
                View: Editor
              </motion.span>
            </motion.span>
          </span>
        </div>

        {/* ---- Confirmation ---- */}
        {/* Waits for the button to come back up, and goes when the cursor does
            — the chip confirms that click, so it must not outlive the hand
            that caused it. */}
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
          animate={pressing ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{
            duration: 0.3,
            delay: pressing ? REACT.confirm : 0,
            ease: "easeOut",
          }}
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
                admin
                  ? { opacity: editor ? 0 : 1, x: editor ? "-6%" : "0%" }
                  : { y: editor ? shift : "0%" }
              }
              transition={admin ? DROP(editor) : CLOSE(editor)}
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
              animate={{ opacity: editor ? 0 : 1 }}
              transition={SWAP(editor)}
            >
              Showing 7 of 128 users
            </motion.span>
            <motion.span
              className="absolute whitespace-nowrap"
              initial={false}
              animate={{ opacity: editor ? 1 : 0 }}
              transition={SWAP(editor)}
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
        {/* Height is left to the content on both flyouts. The blueprint gave
            them fixed boxes — 165 and 112 — and `ts()`'s 10px type floor makes
            the contents proportionally taller as the canvas shrinks, so the
            profile card spilled its last row onto the panel behind it at every
            width tested and the log card overflowed by a hair at some. The
            profile card is anchored by its bottom edge instead of its top,
            since it hangs off the rail's user chip and must grow upward. */}
        <Overlay
          open={panel === "logs"}
          style={{
            left: cq(178),
            top: cq(140),
            width: cq(285),
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
          open={panel === "profile"}
          style={{
            left: cq(22),
            bottom: cq(72),
            width: cq(196),
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

        <Pointer
          stop={stop}
          shown={shown}
          travel={step.travel}
          clicking={clicking}
        />
      </FloatPanel>
    </div>
  );
}

/** A floating surface the pointer opens. Enters and leaves; never structural. */
function Overlay({
  open,
  style,
  children,
}: {
  open: boolean;
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
      animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      // Opening is the slower half, and it waits a beat behind the click so it
      // reads as an answer. Closing is quick: the operator has already left.
      transition={{
        duration: open ? 0.28 : 0.18,
        delay: open ? REACT.open : 0,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A stop's shell-relative coordinate as a percentage of the shell's own box.
 *
 * The pointer's wrapper is `inset-0` inside the shell, so a transform
 * percentage resolves against the shell — which is exactly the space `STOP` is
 * already written in. Dividing by the canvas (960x640) instead would scale
 * every stop by 720/960 and land the arrow short of everything.
 */
const tx = (v: number) => `${((v / SHELL.w) * 100).toFixed(3)}%`;
const ty = (v: number) => `${((v / SHELL.h) * 100).toFixed(3)}%`;

/**
 * The operator's cursor. Rendered last, inside the shell, so it sits above the
 * interface it is acting on and bobs with it — a pointer that drifts against the
 * panel it is clicking looks detached from it.
 *
 * Small, and carried by a drop shadow rather than an outline. A thick stroke at
 * this size turns the arrow into a blob and competes with the 10px UI text it is
 * supposed to be pointing at.
 *
 * One move per step, so the travel can be eased properly — `easeInOut` here
 * accelerates away from a stop and settles into the next one, which is how a
 * hand moves and what the previous keyframe-array version could not express
 * without warping every offset in the array along with it.
 */
function Pointer({
  stop,
  shown,
  travel,
  clicking,
}: {
  stop: { x: number; y: number };
  shown: boolean;
  travel: number;
  clicking: boolean;
}) {
  return (
    <motion.span
      // Stretched over the shell so a percentage transform reads as a shell
      // coordinate. Zero-size children ride along at its top-left corner.
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 60 }}
      initial={false}
      animate={{ x: tx(stop.x), y: ty(stop.y), opacity: shown ? 1 : 0 }}
      // Position and fade are one transition on one element, started at one
      // commit. They cannot drift apart the way two loop-length timelines did.
      transition={{ duration: travel, ease: "easeInOut" }}
    >
      {/* One ripple element, one pulse per click. Scale resets between clicks
          while the opacity is still zero, so the snap back is never visible. */}
      <motion.span
        className="border-brand-500 absolute rounded-full border"
        style={{ width: cq(26), height: cq(26), left: cq(-13), top: cq(-13) }}
        initial={false}
        animate={
          clicking
            ? { opacity: [0, 0.85, 0], scale: [0.3, 1.4, 1.4] }
            : { opacity: 0, scale: 0.3 }
        }
        transition={
          clicking
            ? {
                duration: 0.5,
                delay: REACT.click,
                times: [0, 0.12, 1],
                ease: "easeOut",
              }
            : { duration: 0 }
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
