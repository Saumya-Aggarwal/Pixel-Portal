"use client";

import { motion } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  CLOSE,
  DROP,
  LOG_ENTRIES,
  PARKED,
  PHONE_COLUMNS,
  REACT,
  ROWS,
  SESSION,
  SWAP,
  TABS,
  TABS_ACTIVE_INDEX,
  TABS_LOGS_INDEX,
  isAdmin,
  makeShift,
  type StopName,
} from "@/components/sections/service/visuals/appShellShared";
import { useSequence } from "@/components/sections/service/visuals/useSequence";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * Phone stage of the custom-web-applications depiction.
 *
 * The 960x640 drawing is a 720-wide desktop admin tool: a 160-unit side rail of
 * seven sections, a toolbar, and a five-column table. In a 327px column it
 * renders at 34% of design size while all seventy-seven of its labels sit on
 * `ts`'s 10px floor, so the type is roughly three times oversized against the
 * chrome holding it. Nothing overflowed the frame, which is why the overflow
 * count missed it — it was simply unreadable.
 *
 * The recomposition is the honest one: **the same product at another width.**
 * A desktop admin tool on a phone is not a shrunken desktop admin tool, it is a
 * phone app — a top bar instead of a rail, a bottom tab bar instead of seven
 * nav items, sheets instead of flyouts. That is also exactly what this service
 * sells, so the drawing argues its own case rather than apologising for the
 * canvas.
 *
 * **What is kept, because it is the argument.** The operator runs the same
 * three-stop session — access log, profile, role — on the same state machine,
 * and `arrived` is still the hinge: nothing reacts until the pointer has
 * stopped moving. The table still holds all seven rows, and the two an Editor
 * cannot see are still withdrawn so the rest close the gap. It is still the
 * only drawing in the set with a cursor, and still the only one with no leader
 * lines.
 *
 * **What changed.** Seven rail sections become four tabs — a phone app has four
 * and a More, not seven, and pretending otherwise would be the truncated list
 * this recomposition exists to avoid. "Export CSV" goes, because the role
 * selector is the control the session actually operates. The column head reads
 * "Last seen" rather than "Last Active", which needs 59px in a 55px column
 * here. And the confirmation chip drops its uppercase tracking, which at the
 * 10px floor was costing it a fifth of its own width.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 580);

const SHELL = { x: 20, y: 20, w: 320, h: 540 };
const PAD = 16;

const TOPBAR_H = 44;
const TOOLBAR_H = 40;
const TABBAR_H = 48;

const TABLE_X = PAD;
const TABLE_W = SHELL.w - PAD * 2;
const HEAD_Y = 116;
const ROW_TOP = 150;
const ROW_H = 34;
const ROW_PITCH = 38;

const FOOTER_Y = 426;
const TABBAR_Y = SHELL.h - TABBAR_H;

/** Five columns still fit once "Last Active" is "Last seen". */
const GRID = "17% 24% 18% 23% 18%";

const shiftFor = makeShift(ROW_PITCH, ROW_H);

const TAB_W = SHELL.w / TABS.length;
const tabCx = (i: number) => TAB_W * (i + 0.5);

/** Role selector, which is the pointer's last stop. */
const ROLE_W = 104;
const ROLE_CX = SHELL.w - PAD - ROLE_W / 2;

/** Pointer stops, as tip positions inside the shell. */
const STOP: Record<StopName, { x: number; y: number }> = {
  idle: { x: 168, y: 300 },
  logs: { x: tabCx(TABS_LOGS_INDEX), y: TABBAR_Y + TABBAR_H / 2 },
  profile: { x: SHELL.w - PAD - 14, y: TOPBAR_H / 2 },
  role: { x: ROLE_CX, y: TOPBAR_H + TOOLBAR_H / 2 },
};

export function AppShellPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();
  const phase = useSequence(SESSION, playing);

  const step = playing ? phase.step : PARKED;
  const arrived = playing ? phase.arrived : true;

  const stop = STOP[step.stop];
  const shown = playing && step.shown === true;
  const clicking = arrived && step.click === true;
  const panel = arrived ? step.panel : undefined;
  const pressing = clicking && step.commit === true;
  const editor = step.commit ? arrived : step.editor === true;

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="md" className="top-[20%] left-[12%]" />

      <FloatPanel
        playing={playing}
        focal
        interactive
        className="absolute overflow-hidden"
        style={{
          left: px(SHELL.x),
          top: py(SHELL.y),
          width: px(SHELL.w),
          height: py(SHELL.h),
          backgroundColor: "var(--color-paper)",
          borderRadius: "clamp(0.75rem, 4.444cqw, 1.5rem)",
        }}
      >
        {/* ---- Top bar ---- */}
        <div
          className="border-hair absolute inset-x-0 top-0 flex items-center justify-between border-b bg-white"
          style={{ height: cq(TOPBAR_H), padding: `0 ${cq(PAD)}` }}
        >
          <span className="flex items-center" style={{ gap: cq(8) }}>
            <span
              className="bg-brand-600 block shrink-0 rounded-md"
              style={{ width: cq(18), height: cq(18) }}
            />
            <span className="text-ink font-medium" style={{ fontSize: ts(13) }}>
              Operations
            </span>
          </span>
          <span className="flex items-center" style={{ gap: cq(7) }}>
            <span className="text-muted" style={{ fontSize: ts(11) }}>
              R. Mehta
            </span>
            <span
              className="bg-brand-100 block shrink-0 rounded-full"
              style={{ width: cq(20), height: cq(20) }}
            />
          </span>
        </div>

        {/* ---- Toolbar ---- */}
        <div
          className="border-hair absolute inset-x-0 flex items-center justify-between border-b"
          style={{
            top: cq(TOPBAR_H),
            height: cq(TOOLBAR_H),
            padding: `0 ${cq(PAD)}`,
          }}
        >
          <span
            className="border-hair text-muted flex items-center rounded-full border bg-white"
            style={{
              fontSize: ts(11),
              height: cq(24),
              width: cq(150),
              paddingLeft: cq(12),
            }}
          >
            Search users…
          </span>
          <motion.span
            className="border-brand-300 bg-brand-50 relative flex items-center rounded-full border"
            style={{ height: cq(24), width: cq(ROLE_W) }}
            initial={false}
            animate={{ scale: pressing ? [1, 0.96, 1] : 1 }}
            transition={
              pressing
                ? { duration: REACT.press, times: [0, 0.35, 1] }
                : { duration: 0 }
            }
          >
            <motion.span
              className="text-brand-700 absolute font-medium whitespace-nowrap"
              style={{ left: cq(12), fontSize: ts(11) }}
              initial={false}
              animate={{ opacity: editor ? 0 : 1 }}
              transition={SWAP(editor)}
            >
              View: Admin
            </motion.span>
            <motion.span
              className="text-brand-700 absolute font-medium whitespace-nowrap"
              style={{ left: cq(12), fontSize: ts(11) }}
              initial={false}
              animate={{ opacity: editor ? 1 : 0 }}
              transition={SWAP(editor)}
            >
              View: Editor
            </motion.span>
          </motion.span>
        </div>

        {/* ---- Confirmation ---- */}
        {/* In the band between the toolbar and the table head, never inside the
            toolbar's own box — it must not sit on the control it confirms. */}
        <motion.span
          className="bg-brand-600 absolute z-40 grid place-items-center rounded-full font-semibold whitespace-nowrap text-white"
          style={{
            left: cq(SHELL.w - PAD - 130),
            top: cq(88),
            width: cq(130),
            height: cq(24),
            fontSize: ts(11),
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
            top: cq(HEAD_Y),
            width: cq(TABLE_W),
            height: cq(26),
            gridTemplateColumns: GRID,
            padding: `0 ${cq(12)}`,
          }}
        >
          {PHONE_COLUMNS.map((column) => (
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
                padding: `0 ${cq(12)}`,
              }}
              initial={false}
              animate={
                admin
                  ? { opacity: editor ? 0 : 1, x: editor ? "-6%" : "0%" }
                  : { y: editor ? shiftFor(i) : "0%" }
              }
              transition={admin ? DROP(editor) : CLOSE(editor)}
            >
              {row.map((cell, c) => (
                <span
                  key={PHONE_COLUMNS[c]}
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
            top: cq(FOOTER_Y),
            width: cq(TABLE_W),
            height: cq(24),
          }}
        >
          <span
            className="text-muted relative flex h-full items-center"
            style={{ fontSize: ts(11) }}
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

        {/* ---- Tab bar ---- */}
        <div
          className="border-hair absolute inset-x-0 bottom-0 flex items-stretch border-t bg-white"
          style={{ height: cq(TABBAR_H) }}
        >
          {/* Behind the labels rather than on them, so an item stays a plain
              span and the two cannot fall out of step. */}
          <motion.span
            className="bg-brand-50/70 absolute rounded-md"
            style={{
              left: cq(tabCx(TABS_LOGS_INDEX) - TAB_W / 2 + 6),
              top: cq(6),
              width: cq(TAB_W - 12),
              height: cq(TABBAR_H - 12),
            }}
            initial={false}
            animate={{ opacity: arrived && step.stop === "logs" ? 1 : 0 }}
            transition={{ duration: REACT.hover }}
          />
          {TABS.map((tab, i) => {
            const active = i === TABS_ACTIVE_INDEX;
            return (
              <span
                key={tab}
                className="relative flex flex-1 flex-col items-center justify-center"
                style={{ gap: cq(5) }}
              >
                <span
                  className={
                    active
                      ? "bg-brand-600 block rounded-sm"
                      : "bg-hair block rounded-sm"
                  }
                  style={{ width: cq(14), height: cq(14) }}
                />
                <span
                  className={
                    active ? "text-brand-800 font-medium" : "text-muted"
                  }
                  style={{ fontSize: ts(10) }}
                >
                  {tab}
                </span>
              </span>
            );
          })}
        </div>

        {/* ---- Access log sheet ---- */}
        {/* Anchored to the tab it opens from and grown upward, which is where a
            sheet comes from on a phone. Height is left to the content on both
            overlays: `ts`'s floor makes the contents proportionally taller as
            the canvas shrinks, and a fixed box spills at some widths. */}
        <Overlay
          open={panel === "logs"}
          style={{
            left: cq(PAD),
            bottom: cq(TABBAR_H + 12),
            width: cq(SHELL.w - PAD * 2),
          }}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-ink font-medium" style={{ fontSize: ts(12) }}>
              Access Logs
            </span>
            <span className="text-muted" style={{ fontSize: ts(10) }}>
              last 24 hours
            </span>
          </div>
          <div style={{ display: "grid", gap: cq(6), marginTop: cq(10) }}>
            {LOG_ENTRIES.map(([who, what, when]) => (
              <div
                key={who}
                className="border-hair flex items-center rounded-md border bg-white"
                style={{ height: cq(26), padding: `0 ${cq(10)}`, gap: cq(8) }}
              >
                <span
                  className="bg-brand-300 block shrink-0 rounded-full"
                  style={{ width: cq(5), height: cq(5) }}
                />
                <span
                  className="text-ink truncate font-medium"
                  style={{ fontSize: ts(10) }}
                >
                  {who}
                </span>
                <span
                  className="text-ink-soft truncate"
                  style={{ fontSize: ts(10) }}
                >
                  {what}
                </span>
                <span
                  className="text-muted ml-auto shrink-0"
                  style={{ fontSize: ts(10) }}
                >
                  {when}
                </span>
              </div>
            ))}
          </div>
        </Overlay>

        {/* ---- Profile popover ---- */}
        {/* Hangs off the top bar's user chip, so it is anchored right and grows
            down — the mirror of the desktop card, which hangs off a rail. */}
        <Overlay
          open={panel === "profile"}
          style={{
            right: cq(PAD),
            top: cq(TOPBAR_H + 8),
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
                style={{ fontSize: ts(11) }}
              >
                R. Mehta
              </span>
              <span
                className="text-muted block truncate"
                style={{ fontSize: ts(10) }}
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
              <span className="text-muted" style={{ fontSize: ts(10) }}>
                Role
              </span>
              <span
                className="text-brand-700 font-medium"
                style={{ fontSize: ts(10) }}
              >
                Owner
              </span>
            </span>
            <span className="flex items-baseline justify-between">
              <span className="text-muted" style={{ fontSize: ts(10) }}>
                Signed in
              </span>
              <span className="text-ink-soft" style={{ fontSize: ts(10) }}>
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
        borderRadius: "clamp(0.5rem, 3.333cqw, 1rem)",
        boxShadow: "var(--shadow-float-hover)",
      }}
      initial={false}
      animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
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
 * written in. Dividing by the canvas instead would scale every stop and land
 * the arrow short of everything.
 */
const tx = (v: number) => `${((v / SHELL.w) * 100).toFixed(3)}%`;
const ty = (v: number) => `${((v / SHELL.h) * 100).toFixed(3)}%`;

/** The operator's cursor. See the desktop piece for why it is drawn this way. */
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
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 60 }}
      initial={false}
      animate={{ x: tx(stop.x), y: ty(stop.y), opacity: shown ? 1 : 0 }}
      transition={{ duration: travel, ease: "easeInOut" }}
    >
      {/* One ripple element, one pulse per click. Scale resets between clicks
          while the opacity is still zero, so the snap back is never visible. */}
      <motion.span
        className="border-brand-500 absolute rounded-full border"
        style={{ width: cq(24), height: cq(24), left: cq(-12), top: cq(-12) }}
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
          width: cq(13),
          height: cq(19.5),
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
