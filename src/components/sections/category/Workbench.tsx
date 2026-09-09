"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useState } from "react";

import { useScrubPlayhead } from "@/components/sections/category/useScrubPlayhead";
import { WorkbenchPhone } from "@/components/sections/category/WorkbenchPhone";
import {
  BRANCHES,
  CHAPTERS,
  MAIN_COMMITS,
  RELEASE,
  TESTS,
  hrefFor,
} from "@/components/sections/category/workbenchShared";
import { createCanvas } from "@/components/sections/service/visuals/canvas";

/**
 * Four workstreams, one shipped product.
 *
 * An editor over a source-control graph — the view every IDE actually ships, so
 * it reads as a tool rather than as an invention. Four branches, one per service,
 * live concurrently and merge into main; the playhead sweeps the history, the
 * branches draw themselves, commits land, and the editor shows the file being
 * worked on in whichever branch is open at that moment.
 *
 * This replaced a latency trace. The trace was accurate and legible and still
 * fundamentally rectangles on a grid, which is what every other picture on this
 * site already is. The curve of a branch merging is the only organic line
 * anywhere in the system, and code is the only place real text is the subject
 * rather than the decoration — that is where the difference in kind comes from,
 * not from adding detail to a chart.
 *
 * It also argues the category's actual point. A service page answers "what is
 * this"; a category page has to answer "how do these fit together". They merge.
 *
 * **Where the pointer scrubs.** Only the branch labels lock the playhead; the
 * graph itself scrubs. The trace learned this the hard way — its rows spanned
 * the full canvas and locked everywhere the cursor could be, so the scrub
 * appeared broken. A lock target must be small relative to the surface.
 */

const { W, H, px, py, ts, cq } = createCanvas(1440, 720);

const SHELL = { x: 110, y: 56, w: 1220, h: 580 };

/** Relative to the shell. The IDE's four regions. */
const TITLEBAR_H = 38;
const MIDDLE = { top: 38, h: 312 };
const TREE_W = 240;
const GRAPH = { top: 350, h: 192 };
const STATUS = { top: 542, h: 38 };

/** Graph interior, also relative to the shell. */
const LABEL_X = 18;
const GX0 = 168;
const GW = 1032;
const MAIN_Y = 400;
const LANE_0 = 428;
const LANE_STEP = 28;
const gx = (f: number) => GX0 + f * GW;
const laneY = (i: number) => LANE_0 + i * LANE_STEP;

const TREE = [
  { label: "src", depth: 0, dir: true },
  { label: "app/orders", depth: 1, dir: true },
  { label: "route.ts", depth: 2, file: 0 },
  { label: "lib", depth: 1, dir: true },
  { label: "sync.ts", depth: 2, file: 1 },
  { label: "events.ts", depth: 2, file: 3 },
  { label: "scripts", depth: 0, dir: true },
  { label: "migrate.ts", depth: 1, file: 2 },
];

const MAGNET_RADIUS = 160;
const MAGNET_PULL = 6;

export function Workbench() {
  return (
    <>
      <div className="md:hidden">
        <WorkbenchPhone />
      </div>
      <div className="hidden md:block">
        <WorkbenchDesktop />
      </div>
    </>
  );
}

function WorkbenchDesktop() {
  const {
    ref,
    t,
    pointerX,
    pointerY,
    pointerActive,
    interactive,
    handlers,
    lockToValue,
    release,
  } = useScrubPlayhead<HTMLDivElement>({
    // One continuous sweep. A history replays; it does not step.
    stops: 2,
    dwell: 0.9,
    travel: 5.5,
    settle: 2.4,
    rewind: 0.6,
  });

  const chapter = useChapter(t);
  const branch = BRANCHES[chapter];
  const field = useSpring(pointerActive ? 1 : 0, {
    stiffness: 60,
    damping: 20,
  });

  const gridX = useTransform(pointerX, (v) => `${(v - 0.5) * 2 * 0.972}%`);
  const glowX = useTransform(t, (v) => cq(SHELL.x + gx(v) - 160));
  const headX = useTransform(t, (v) => cq(gx(v)));
  const mainOffset = useTransform(t, (v) => 1 - v);

  return (
    <div
      ref={ref}
      {...handlers}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <motion.span
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_70%_70%_at_50%_45%,black,transparent)]"
        style={{ x: interactive ? gridX : undefined }}
      />
      <motion.span
        aria-hidden
        className="bg-brand-200/30 pointer-events-none absolute rounded-full blur-[80px]"
        style={{ width: cq(320), height: cq(320), top: cq(300), left: glowX }}
      />

      {/* ---- The workbench ---- */}
      <div
        className="border-hair absolute overflow-hidden border bg-white"
        style={{
          left: px(SHELL.x),
          top: py(SHELL.y),
          width: px(SHELL.w),
          height: py(SHELL.h),
          borderRadius: "clamp(0.75rem, 1.667cqw, 1.5rem)",
          boxShadow: "var(--shadow-float-hover)",
        }}
      >
        {/* ---- Title bar ---- */}
        <div
          aria-hidden
          className="border-hair bg-paper flex items-center border-b"
          style={{ height: cq(TITLEBAR_H), padding: `0 ${cq(16)}`, gap: cq(8) }}
        >
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="bg-hair block rounded-full"
              style={{ width: cq(8), height: cq(8) }}
            />
          ))}
          <span
            className="text-muted"
            style={{ fontSize: ts(11), marginLeft: cq(10) }}
          >
            pixel-portal
          </span>
          <span
            className="border-hair text-ink-soft ml-auto flex items-center rounded-full border bg-white font-mono"
            style={{
              height: cq(22),
              padding: `0 ${cq(10)}`,
              fontSize: ts(10),
              gap: cq(6),
            }}
          >
            <span
              className="bg-brand-500 block rounded-full"
              style={{ width: cq(5), height: cq(5) }}
            />
            main
          </span>
        </div>

        {/* ---- File tree ---- */}
        <div
          aria-hidden
          className="border-hair bg-paper absolute border-r"
          style={{
            left: 0,
            top: cq(MIDDLE.top),
            width: cq(TREE_W),
            height: cq(MIDDLE.h),
            padding: cq(16),
          }}
        >
          <span
            className="text-muted font-semibold tracking-[0.08em] uppercase"
            style={{ fontSize: ts(9) }}
          >
            Explorer
          </span>
          <span style={{ display: "grid", gap: cq(3), marginTop: cq(12) }}>
            {TREE.map((node) => {
              const open = node.file === chapter;
              return (
                <span
                  key={node.label + node.depth}
                  className={
                    open
                      ? "bg-brand-50 text-brand-800 flex items-center rounded font-medium"
                      : node.dir
                        ? "text-ink-soft flex items-center rounded"
                        : "text-muted flex items-center rounded"
                  }
                  style={{
                    height: cq(22),
                    paddingLeft: cq(6 + node.depth * 12),
                    paddingRight: cq(8),
                    fontSize: ts(10),
                    gap: cq(7),
                  }}
                >
                  <span
                    className={
                      node.dir
                        ? "bg-hair block shrink-0 rounded-[1px]"
                        : open
                          ? "bg-brand-500 block shrink-0 rounded-full"
                          : "bg-hair block shrink-0 rounded-full"
                    }
                    style={{ width: cq(5), height: cq(5) }}
                  />
                  <span className="truncate font-mono">{node.label}</span>
                  {open && (
                    <span
                      className="text-brand-600 ml-auto shrink-0"
                      style={{ fontSize: ts(9) }}
                    >
                      M
                    </span>
                  )}
                </span>
              );
            })}
          </span>
        </div>

        {/* ---- Editor ---- */}
        <div
          aria-hidden
          className="absolute"
          style={{
            left: cq(TREE_W),
            top: cq(MIDDLE.top),
            width: cq(SHELL.w - TREE_W),
            height: cq(MIDDLE.h),
          }}
        >
          <div
            className="border-hair flex items-center border-b"
            style={{ height: cq(36), paddingLeft: cq(18), gap: cq(10) }}
          >
            <span
              className="border-hair border-r border-l bg-white font-mono"
              style={{
                padding: `${cq(8)} ${cq(14)}`,
                fontSize: ts(10),
                marginLeft: cq(-18),
              }}
            >
              <span className="text-brand-600" style={{ marginRight: cq(7) }}>
                ●
              </span>
              <span className="text-ink">{branch.file.split("/").pop()}</span>
            </span>
            <span className="text-muted font-mono" style={{ fontSize: ts(10) }}>
              {branch.file}
            </span>
          </div>

          <div className="relative" style={{ padding: `${cq(16)} ${cq(18)}` }}>
            <AnimatePresence initial={false}>
              <motion.div
                key={chapter}
                className="absolute inset-0"
                style={{ padding: `${cq(16)} ${cq(18)}` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {branch.code.map((tokens, i) => (
                  <CodeLine
                    key={i}
                    tokens={tokens}
                    number={11 + i}
                    t={t}
                    chapter={CHAPTERS[chapter]}
                    index={i}
                    total={branch.code.length}
                    last={i === branch.code.length - 1}
                    playing={interactive}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ---- Source control ---- */}
        <div
          aria-hidden
          className="border-hair bg-paper absolute w-full border-t"
          style={{ top: cq(GRAPH.top), height: cq(GRAPH.h) }}
        >
          <span
            className="text-muted absolute font-semibold tracking-[0.08em] uppercase"
            style={{ left: cq(LABEL_X), top: cq(16), fontSize: ts(9) }}
          >
            Source control · 4 branches
          </span>
        </div>

        {/*
          The graph is drawn over the whole shell, not inside the panel above.
          An SVG sized to that panel would be 1220 x 192 carrying a 1440 x 720
          viewBox — 85% horizontal scale against 27% vertical — and every curve
          would render as a flattened smear. Spanning the shell lets the viewBox
          match the box exactly, so a unit is a unit on both axes, and it is the
          same shell-relative space `MAIN_Y` and `laneY` are already written in.
        */}
        <svg
          viewBox={`0 0 ${SHELL.w} ${SHELL.h}`}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
        >
          <motion.line
            x1={gx(0)}
            y1={MAIN_Y}
            x2={gx(1)}
            y2={MAIN_Y}
            stroke="var(--color-brand-400)"
            strokeWidth={2.5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            style={{ strokeDashoffset: mainOffset }}
          />
          {BRANCHES.map((b, i) => (
            <BranchPath key={b.slug} branch={b} lane={laneY(i)} t={t} />
          ))}
          {MAIN_COMMITS.map((c) => (
            <Commit key={c} at={c} y={MAIN_Y} t={t} main />
          ))}
          {BRANCHES.map((b, i) =>
            b.commits.map((c) => (
              <Commit key={`${b.slug}-${c}`} at={c} y={laneY(i)} t={t} />
            )),
          )}
        </svg>

        {/* Branch names. The only lock targets — the graph beside them has to
            stay scrubbable, which is the lesson the trace taught. */}
        {BRANCHES.map((b, i) => (
          <BranchLabel
            key={b.slug}
            branch={b}
            lane={i}
            active={chapter === i}
            field={field}
            pointerX={pointerX}
            pointerY={pointerY}
            interactive={interactive}
            onEnter={() => lockToValue((b.fork + b.merge) / 2)}
            onLeave={release}
          />
        ))}

        <ReleaseTag t={t} />

        <motion.span
          aria-hidden
          className="bg-brand-500 pointer-events-none absolute"
          style={{
            width: cq(2),
            top: cq(MAIN_Y - 18),
            height: cq(LANE_STEP * 4 + 30),
            left: headX,
            zIndex: 5,
          }}
        />

        {/* ---- Status bar ---- */}
        <div
          aria-hidden
          className="border-hair bg-paper absolute flex w-full items-center border-t"
          style={{
            top: cq(STATUS.top),
            height: cq(STATUS.h),
            padding: `0 ${cq(18)}`,
            gap: cq(18),
          }}
        >
          <span
            className="text-ink-soft flex items-center font-mono"
            style={{ fontSize: ts(10), gap: cq(7) }}
          >
            <span
              className="bg-brand-500 block rounded-full"
              style={{ width: cq(5), height: cq(5) }}
            />
            {branch.name}
          </span>
          <span className="text-muted" style={{ fontSize: ts(10) }}>
            {TESTS[chapter]} tests passed
          </span>
          <span className="text-muted" style={{ fontSize: ts(10) }}>
            typecheck clean
          </span>
          <span className="ml-auto flex items-center" style={{ gap: cq(10) }}>
            <span className="text-muted" style={{ fontSize: ts(10) }}>
              {BRANCHES.length - chapter - 1} branches ahead
            </span>
            <span
              className="border-brand-200 bg-brand-50 text-brand-700 flex items-center rounded-full font-medium"
              style={{ padding: `${cq(4)} ${cq(11)}`, fontSize: ts(10) }}
            >
              Deploy on merge
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- pieces ---- */

function useChapter(t: MotionValue<number>) {
  const resolve = (value: number) => {
    const found = CHAPTERS.findIndex((c) => value >= c.from && value < c.to);
    return found === -1 ? CHAPTERS.length - 1 : found;
  };

  const [index, setIndex] = useState(() => resolve(t.get()));

  useMotionValueEvent(t, "change", (value) => {
    const next = resolve(value);
    setIndex((previous) => (previous === next ? previous : next));
  });

  return index;
}

/**
 * Fork, run, merge — one path, so the branch draws as a single continuous
 * gesture. `pathLength={1}` normalises it, and the offset is the branch's own
 * progress rather than the global playhead, so each one fills across its own
 * lifetime instead of all four filling together.
 */
function BranchPath({
  branch,
  lane,
  t,
}: {
  branch: (typeof BRANCHES)[number];
  lane: number;
  t: MotionValue<number>;
}) {
  const a = gx(branch.fork);
  const b = gx(branch.merge);
  const d =
    `M ${a} ${MAIN_Y} C ${a + 18} ${MAIN_Y}, ${a + 18} ${lane}, ${a + 36} ${lane}` +
    ` L ${b - 36} ${lane}` +
    ` C ${b - 18} ${lane}, ${b - 18} ${MAIN_Y}, ${b} ${MAIN_Y}`;

  const offset = useTransform(t, [branch.fork, branch.merge], [1, 0]);

  return (
    <motion.path
      d={d}
      fill="none"
      stroke="var(--color-brand-300)"
      strokeWidth={2}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="1 1"
      style={{ strokeDashoffset: offset }}
    />
  );
}

function Commit({
  at,
  y,
  t,
  main = false,
}: {
  at: number;
  y: number;
  t: MotionValue<number>;
  main?: boolean;
}) {
  const scale = useTransform(t, [at - 0.02, at], [0, 1]);

  return (
    <motion.circle
      cx={gx(at)}
      cy={y}
      r={main ? 6 : 4.5}
      fill={main ? "var(--color-brand-600)" : "#fff"}
      stroke={main ? "var(--color-brand-600)" : "var(--color-brand-400)"}
      strokeWidth={2}
      style={{ scale, transformOrigin: `${gx(at)}px ${y}px` }}
    />
  );
}

function ReleaseTag({ t }: { t: MotionValue<number> }) {
  const opacity = useTransform(t, [RELEASE - 0.04, RELEASE], [0, 1]);

  return (
    <motion.span
      aria-hidden
      className="bg-brand-600 absolute -translate-x-1/2 rounded-full font-medium whitespace-nowrap text-white"
      style={{
        left: cq(gx(RELEASE)),
        top: cq(MAIN_Y - 32),
        padding: `${cq(4)} ${cq(10)}`,
        fontSize: ts(10),
        opacity,
      }}
    >
      v2.4.0
    </motion.span>
  );
}

function BranchLabel({
  branch,
  lane,
  active,
  field,
  pointerX,
  pointerY,
  interactive,
  onEnter,
  onLeave,
}: {
  branch: (typeof BRANCHES)[number];
  lane: number;
  active: boolean;
  field: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  interactive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const cx = SHELL.x + LABEL_X + 67;
  const cy = SHELL.y + laneY(lane);

  const x = useTransform(
    [pointerX, pointerY, field],
    ([nx, ny, on]: number[]) => {
      const dx = nx * W - cx;
      const dy = ny * H - cy;
      const distance = Math.hypot(dx, dy);
      if (distance === 0 || distance > MAGNET_RADIUS) return "0%";
      const strength =
        ((1 - distance / MAGNET_RADIUS) * MAGNET_PULL * on) / distance;
      return `${((dx * strength) / 134) * 100}%`;
    },
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left: cq(LABEL_X),
        top: cq(laneY(lane) - 11),
        width: cq(134),
        height: cq(22),
        x: interactive ? x : undefined,
      }}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <Link
        href={hrefFor(branch.slug)}
        aria-label={`${branch.service} — branch ${branch.name}`}
        className={
          active
            ? "border-brand-300 focus-visible:outline-brand-400 flex h-full items-center rounded border bg-white transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2"
            : "border-hair hover:border-brand-300 focus-visible:outline-brand-400 flex h-full items-center rounded border bg-white transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2"
        }
        style={{ padding: `0 ${cq(8)}`, gap: cq(6) }}
      >
        <span
          className={
            active
              ? "bg-brand-500 block shrink-0 rounded-full"
              : "bg-brand-300 block shrink-0 rounded-full"
          }
          style={{ width: cq(5), height: cq(5) }}
        />
        <span
          className={
            active
              ? "text-brand-800 truncate font-mono"
              : "text-ink-soft truncate font-mono"
          }
          style={{ fontSize: ts(10) }}
        >
          {branch.name}
        </span>
      </Link>
    </motion.div>
  );
}

/**
 * One line of source, revealed across its chapter so the file appears to be
 * written rather than pasted. Its own component because chapters have different
 * line counts, and a hook loop whose length changes between renders is the one
 * thing React will not forgive.
 */
function CodeLine({
  tokens,
  number,
  t,
  chapter,
  index,
  total,
  last,
  playing,
}: {
  tokens: readonly string[];
  number: number;
  t: MotionValue<number>;
  chapter: { from: number; to: number };
  index: number;
  total: number;
  last: boolean;
  playing: boolean;
}) {
  const span = chapter.to - chapter.from;
  const start = chapter.from + (index / total) * span * 0.7;
  const opacity = useTransform(t, [start, start + span * 0.08], [0, 1]);

  return (
    <motion.div
      className="flex items-baseline"
      style={{ height: cq(30), gap: cq(16), opacity }}
    >
      <span
        className="text-muted shrink-0 text-right font-mono tabular-nums"
        style={{ width: cq(24), fontSize: ts(11) }}
      >
        {number}
      </span>
      <span className="font-mono whitespace-pre" style={{ fontSize: ts(14) }}>
        {tokens.map((token, i) => (
          <span key={i} className={i % 2 === 0 ? "text-brand-700" : "text-ink"}>
            {token}
          </span>
        ))}
        {last && playing && (
          <motion.span
            className="bg-ink inline-block align-middle"
            style={{ width: cq(8), height: cq(16), marginLeft: cq(4) }}
            animate={{ opacity: [1, 1, 0, 0, 1] }}
            transition={{
              duration: 1.1,
              times: [0, 0.45, 0.5, 0.95, 1],
              repeat: Infinity,
            }}
          />
        )}
      </span>
    </motion.div>
  );
}
