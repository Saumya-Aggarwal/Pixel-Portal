"use client";

import Link from "next/link";
import { motion, useTransform, type MotionValue } from "motion/react";

import {
  useScrubPlayhead,
  useStopIndex,
} from "@/components/sections/category/useScrubPlayhead";
import { usePhoneSwipe } from "@/components/sections/category/usePhoneSwipe";
import {
  BRANCHES,
  MAIN_COMMITS,
  RELEASE,
  TESTS,
  hrefFor,
} from "@/components/sections/category/workbenchShared";
import { createCanvas } from "@/components/sections/service/visuals/canvas";

/**
 * Phone stage of the software-development hero.
 *
 * The desktop piece is a 1220-wide IDE — explorer, editor, graph, status bar —
 * over a 1032-wide history. None of that survives a 360 column, so the shell is
 * gone and what it framed is promoted: a **branch list**, an **editor**, and the
 * **merge graph**. The graph stays because it is the category's whole argument;
 * four streams that converge is the answer to "how do these fit together", and
 * a phone stage that dropped it would be four unrelated code samples.
 *
 * This is the third of three, so it is also drawn against the other two: A is a
 * station card over a ledger, B a browser over a spec table, C an editor over a
 * graph. The stepper differs in kind for the same reason — dots on a rail there,
 * a two-by-two of branch pills here, which is the shape a branch list has.
 *
 * **Two structural departures from the desktop piece.**
 *
 * Desktop runs `t` as one continuous 5.5s sweep of history, because a pointer
 * can scrub it. Touch cannot, so this steps: four stops, mapped through
 * `HISTORY` onto the moment in the sweep where each branch is halfway through
 * its own life — and a fourth stop at 0.98 rather than 0.76, so the last frame
 * is every branch merged and `v2.4.0` tagged. A resting frame that stops before
 * the merges would be the one frame that fails to make the argument.
 *
 * Desktop reveals code line by line across a chapter, which reads as the file
 * being typed. Here the whole listing crossfades, the same transition A and B
 * use — at 0.6s a line-by-line reveal is a flicker, and holding one transition
 * language across the three is what keeps them one site.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 590);

const PILL = { w: 154, h: 50, x: [20, 186], y: [20, 82] };
const EDITOR = { x: 20, y: 152, w: 320, h: 250 };
const TAB_H = 30;
const STATUS_H = 28;
const GRAPH = { x: 20, y: 422, w: 320, h: 148 };

/** Graph interior, in the panel's own units — the SVG viewBox matches the box. */
const GX0 = 18;
const GW = 284;
const MAIN_Y = 54;
const LANE_0 = 74;
const LANE_STEP = 18;
/**
 * Horizontal run of a fork or a merge.
 *
 * 20, not the 9 this started at: the control points sit at the midpoint, so the
 * bend is a symmetric S with horizontal tangents at both ends, and at 9 that S
 * is compressed into a bracket. A branch leaving main is the only organic line
 * in the whole system and it has to look like one. The shortest span is branch
 * four's 79.5 units, which still leaves 39 of straight lane between the bends.
 */
const BEND = 20;

const gx = (f: number) => GX0 + f * GW;
const laneY = (i: number) => LANE_0 + i * LANE_STEP;

/**
 * Stop index -> moment in the history sweep.
 *
 * The first three are each branch's midpoint, which is the desktop's own lock
 * target. The last is 0.98, not branch four's 0.76: the merges and the release
 * live past every midpoint, so parking on the last stop has to show them.
 */
const STOP_T = BRANCHES.map((_, i) => i / (BRANCHES.length - 1));
const HISTORY = [
  ...BRANCHES.slice(0, -1).map((b) => (b.fork + b.merge) / 2),
  0.98,
];

/** Half-width of a crossfade ramp, narrower than the 1/3 between stops. */
const RAMP = 0.2;

export function WorkbenchPhone() {
  const { ref, t, nudge, lockTo } = useScrubPlayhead<HTMLDivElement>({
    stops: BRANCHES.length,
    dwell: 3,
    travel: 0.6,
    settle: 4,
    autoplayTouch: true,
    rewindJump: true,
  });

  const stop = useStopIndex(t, BRANCHES.length);
  const branch = BRANCHES[stop];
  const swipe = usePhoneSwipe(nudge);

  /** Everything in the graph is a function of history, not of the stop index. */
  const history = useTransform(t, STOP_T, HISTORY);

  return (
    <div
      ref={ref}
      {...swipe}
      className="@container relative w-full touch-pan-y"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <span
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_70%_70%_at_50%_45%,black,transparent)]"
      />
      <span
        aria-hidden
        className="bg-brand-200/30 pointer-events-none absolute rounded-full blur-3xl"
        style={{
          width: cq(240),
          height: cq(240),
          top: cq(150),
          left: cq(30),
        }}
      />

      <Pills stop={stop} onSelect={lockTo} />

      {/* ---- The editor. One link, whichever file is open. ---- */}
      <Link
        href={hrefFor(branch.slug)}
        aria-label={`${branch.service} — branch ${branch.name}`}
        // A mouse drag on an anchor starts the browser's native link drag,
        // which cancels the pointer stream the swipe is reading.
        draggable={false}
        className="border-hair focus-visible:outline-brand-400 absolute block overflow-hidden border bg-white focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{
          left: px(EDITOR.x),
          top: py(EDITOR.y),
          width: px(EDITOR.w),
          height: py(EDITOR.h),
          borderRadius: "1.25rem",
          boxShadow: "var(--shadow-float-hover)",
          zIndex: 30,
        }}
      >
        {/* Tab bar. The path is the only chrome kept from the desktop shell —
            three window dots would read as the browser in stage B. */}
        <span
          aria-hidden
          className="border-hair bg-paper relative flex items-center border-b"
          style={{ height: cq(TAB_H), padding: `0 ${cq(14)}`, gap: cq(7) }}
        >
          <span
            className="bg-brand-500 block shrink-0 rounded-full"
            style={{ width: cq(5), height: cq(5) }}
          />
          <span className="relative block flex-1" style={{ height: cq(14) }}>
            {BRANCHES.map((b, i) => (
              <Fade
                key={b.slug}
                t={t}
                index={i}
                className="text-ink absolute inset-0 truncate font-mono"
                style={{ fontSize: ts(11), lineHeight: cq(14) }}
              >
                {b.file}
              </Fade>
            ))}
          </span>
          <span
            className="border-hair text-ink-soft flex shrink-0 items-center rounded-full border bg-white font-mono"
            style={{
              height: cq(18),
              padding: `0 ${cq(8)}`,
              fontSize: ts(10),
              gap: cq(5),
            }}
          >
            <span
              className="bg-brand-500 block rounded-full"
              style={{ width: cq(4), height: cq(4) }}
            />
            main
          </span>
        </span>

        {/* Listings are stacked and crossfaded, so the gutter never reflows
            between files of different lengths. */}
        <span
          aria-hidden
          className="relative block"
          style={{ height: cq(EDITOR.h - TAB_H - STATUS_H) }}
        >
          {BRANCHES.map((b, i) => (
            <Fade
              key={b.slug}
              t={t}
              index={i}
              className="absolute inset-0 block"
              style={{ padding: `${cq(14)} ${cq(14)}` }}
            >
              {b.phoneCode.map((tokens, line) => (
                <span
                  key={line}
                  className="flex items-baseline"
                  style={{ height: cq(20), gap: cq(10) }}
                >
                  <span
                    className="text-muted shrink-0 text-right font-mono tabular-nums"
                    style={{ width: cq(18), fontSize: ts(10) }}
                  >
                    {11 + line}
                  </span>
                  <span
                    className="font-mono whitespace-pre"
                    style={{ fontSize: ts(12) }}
                  >
                    {tokens.map((token, k) => (
                      <span
                        key={k}
                        className={k % 2 === 0 ? "text-brand-700" : "text-ink"}
                      >
                        {token}
                      </span>
                    ))}
                    {line === b.phoneCode.length - 1 && stop === i && (
                      <motion.span
                        className="bg-ink inline-block align-middle"
                        style={{
                          width: cq(7),
                          height: cq(13),
                          marginLeft: cq(3),
                        }}
                        animate={{ opacity: [1, 1, 0, 0, 1] }}
                        transition={{
                          duration: 1.1,
                          times: [0, 0.45, 0.5, 0.95, 1],
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </span>
                </span>
              ))}
            </Fade>
          ))}
        </span>

        <span
          aria-hidden
          className="border-hair bg-paper absolute inset-x-0 bottom-0 flex items-center border-t"
          style={{ height: cq(STATUS_H), padding: `0 ${cq(14)}`, gap: cq(10) }}
        >
          <span
            className="bg-brand-500 block shrink-0 rounded-full"
            style={{ width: cq(5), height: cq(5) }}
          />
          <span className="relative block flex-1" style={{ height: cq(13) }}>
            {BRANCHES.map((b, i) => (
              <Fade
                key={b.slug}
                t={t}
                index={i}
                className="text-ink-soft absolute inset-0 truncate font-mono"
                style={{ fontSize: ts(11), lineHeight: cq(13) }}
              >
                {b.name}
              </Fade>
            ))}
          </span>
          <span
            className="relative block shrink-0"
            style={{ width: cq(84), height: cq(13) }}
          >
            {TESTS.map((count, i) => (
              <Fade
                key={count}
                t={t}
                index={i}
                className="text-muted absolute inset-0 text-right tabular-nums"
                style={{ fontSize: ts(11), lineHeight: cq(13) }}
              >
                {count} tests passed
              </Fade>
            ))}
          </span>
        </span>
      </Link>

      <Graph history={history} stop={stop} />
    </div>
  );
}

/* ----------------------------------------------------------------- pills ---- */

/**
 * The four locks, as a branch list rather than a rail of dots.
 *
 * Two by two because the names do not fit four across: `event-pipeline` at the
 * 12px floor is 84 units and a quarter of the canvas is 90. Each pill carries
 * its file as well, which is what makes a 50-unit box worth its height — and
 * 50 is the smallest that clears a 44px tap target once 360 maps onto 375.
 */
function Pills({
  stop,
  onSelect,
}: {
  stop: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Branches in flight"
      className="absolute"
      style={{ left: px(0), top: py(0), width: px(360), height: py(132) }}
    >
      {BRANCHES.map((branch, i) => {
        const current = stop === i;
        return (
          <button
            key={branch.slug}
            type="button"
            aria-current={current ? "true" : undefined}
            aria-label={`${branch.service}, branch ${branch.name}`}
            onClick={() => onSelect(i)}
            className={
              current
                ? "border-brand-300 focus-visible:outline-brand-400 absolute flex flex-col justify-center bg-white text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2"
                : "border-hair bg-paper focus-visible:outline-brand-400 absolute flex flex-col justify-center text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2"
            }
            style={{
              left: cq(PILL.x[i % 2]),
              top: cq(PILL.y[Math.floor(i / 2)]),
              width: cq(PILL.w),
              height: cq(PILL.h),
              padding: `0 ${cq(12)}`,
              borderRadius: "0.75rem",
              borderWidth: 1,
              boxShadow: current ? "var(--shadow-float)" : undefined,
            }}
          >
            <span className="flex items-center" style={{ gap: cq(7) }}>
              <span
                aria-hidden
                className={
                  current
                    ? "bg-brand-500 block shrink-0 rounded-full"
                    : "bg-brand-300 block shrink-0 rounded-full"
                }
                style={{ width: cq(5), height: cq(5) }}
              />
              <span
                className={
                  current
                    ? "text-brand-800 truncate font-mono font-medium"
                    : "text-ink truncate font-mono"
                }
                style={{ fontSize: ts(12) }}
              >
                {branch.short}
              </span>
            </span>
            <span
              className="text-muted truncate font-mono"
              style={{
                fontSize: ts(10),
                marginTop: cq(5),
                paddingLeft: cq(12),
              }}
            >
              {branch.file.split("/").pop()}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------- crossfade ---- */

/** One layer of a stack that crossfades with the playhead. See `ArcDialPhone`. */
function Fade({
  t,
  index,
  className,
  style,
  children,
}: {
  t: MotionValue<number>;
  index: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const at = STOP_T[index];
  const opacity = useTransform(t, [at - RAMP, at, at + RAMP], [0, 1, 0]);

  return (
    <motion.span
      aria-hidden
      className={className}
      style={{ ...style, opacity, pointerEvents: "none" }}
    >
      {children}
    </motion.span>
  );
}

/* ----------------------------------------------------------------- graph ---- */

/**
 * The persistent secondary: four branches converging on main.
 *
 * Every mark is a function of `history`, so parking anywhere is a real state of
 * the repository — main drawn as far as it has been written, each branch filled
 * across its own lifetime, commits landed up to now, the tag present only once
 * the release is reached. The viewBox matches the panel exactly, so a unit is a
 * unit on both axes and the merge curves are not smeared.
 */
function Graph({
  history,
  stop,
}: {
  history: MotionValue<number>;
  stop: number;
}) {
  const mainOffset = useTransform(history, (v) => 1 - v);
  const tagOpacity = useTransform(history, [RELEASE - 0.04, RELEASE], [0, 1]);

  return (
    <div
      aria-hidden
      className="border-hair absolute overflow-hidden border bg-white"
      style={{
        left: px(GRAPH.x),
        top: py(GRAPH.y),
        width: px(GRAPH.w),
        height: py(GRAPH.h),
        borderRadius: "1.25rem",
        boxShadow: "var(--shadow-float)",
        zIndex: 30,
      }}
    >
      <span
        className="absolute flex items-center justify-between"
        style={{ left: cq(GX0), top: cq(14), width: cq(GW) }}
      >
        <span className="text-muted" style={{ fontSize: ts(11) }}>
          Source control · 4 branches
        </span>
        <motion.span
          className="bg-brand-600 rounded-full font-medium whitespace-nowrap text-white"
          style={{
            padding: `${cq(3)} ${cq(9)}`,
            fontSize: ts(10),
            opacity: tagOpacity,
          }}
        >
          v2.4.0
        </motion.span>
      </span>

      <svg
        viewBox={`0 0 ${GRAPH.w} ${GRAPH.h}`}
        className="absolute inset-0 size-full"
      >
        <line
          x1={gx(0)}
          y1={MAIN_Y}
          x2={gx(1)}
          y2={MAIN_Y}
          stroke="var(--color-hair)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <motion.line
          x1={gx(0)}
          y1={MAIN_Y}
          x2={gx(1)}
          y2={MAIN_Y}
          stroke="var(--color-brand-400)"
          strokeWidth={2}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          style={{ strokeDashoffset: mainOffset }}
        />
        {BRANCHES.map((branch, i) => (
          <BranchPath
            key={branch.slug}
            branch={branch}
            lane={laneY(i)}
            active={stop === i}
            history={history}
          />
        ))}
        {MAIN_COMMITS.map((at) => (
          <Commit key={at} at={at} y={MAIN_Y} history={history} main />
        ))}
        {BRANCHES.map((branch, i) =>
          branch.commits.map((at) => (
            <Commit
              key={`${branch.slug}-${at}`}
              at={at}
              y={laneY(i)}
              history={history}
            />
          )),
        )}
        {/* The release, on the line rather than only in the header — the tag
            has to point at the commit it tags.

            There is deliberately no playhead bar here. Desktop draws one
            because a pointer scrubs the history continuously; four stops do
            not, and the leading edge of the drawn history already marks where
            "now" is. A full-height bar over a graph this short read as a
            divider cutting the panel in two. */}
        <motion.line
          x1={gx(RELEASE)}
          y1={MAIN_Y - 7}
          x2={gx(RELEASE)}
          y2={MAIN_Y + 7}
          stroke="var(--color-brand-600)"
          strokeWidth={2}
          strokeLinecap="round"
          style={{ opacity: tagOpacity }}
        />
      </svg>
    </div>
  );
}

/** Fork, run, merge — one path, filling across its own lifetime. */
function BranchPath({
  branch,
  lane,
  active,
  history,
}: {
  branch: (typeof BRANCHES)[number];
  lane: number;
  active: boolean;
  history: MotionValue<number>;
}) {
  const a = gx(branch.fork);
  const b = gx(branch.merge);
  const d =
    `M ${a} ${MAIN_Y} C ${a + BEND / 2} ${MAIN_Y}, ${a + BEND / 2} ${lane}, ${a + BEND} ${lane}` +
    ` L ${b - BEND} ${lane}` +
    ` C ${b - BEND / 2} ${lane}, ${b - BEND / 2} ${MAIN_Y}, ${b} ${MAIN_Y}`;

  const offset = useTransform(history, [branch.fork, branch.merge], [1, 0]);

  return (
    <>
      {/* The track, drawn whole from the first frame.
          Without it the graph is four fifths empty at stop one — truthful about
          the history and useless as a picture. Same reason the marketing
          ledger draws its bars' tracks before anything fills them: four
          branches converging is the argument, so it has to be legible before
          the history has got there. */}
      <path
        d={d}
        fill="none"
        stroke="var(--color-hair)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <motion.path
        d={d}
        fill="none"
        stroke={active ? "var(--color-brand-500)" : "var(--color-brand-300)"}
        strokeWidth={1.5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        style={{ strokeDashoffset: offset }}
      />
    </>
  );
}

function Commit({
  at,
  y,
  history,
  main = false,
}: {
  at: number;
  y: number;
  history: MotionValue<number>;
  main?: boolean;
}) {
  const scale = useTransform(history, [at - 0.02, at], [0, 1]);
  /** Scaling a stroked circle to zero still leaves a mark; fade it as well. */
  const opacity = useTransform(history, [at - 0.02, at - 0.015], [0, 1]);

  return (
    <motion.circle
      cx={gx(at)}
      cy={y}
      r={main ? 3.6 : 2.8}
      fill={main ? "var(--color-brand-600)" : "#fff"}
      stroke={main ? "var(--color-brand-600)" : "var(--color-brand-400)"}
      strokeWidth={1.5}
      style={{ scale, opacity, transformOrigin: `${gx(at)}px ${y}px` }}
    />
  );
}
