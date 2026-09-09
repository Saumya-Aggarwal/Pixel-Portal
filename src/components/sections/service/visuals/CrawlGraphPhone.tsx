"use client";

import { motion, type Transition } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  AUDIT_CLEAR,
  AUDIT_OPEN,
  AUDIT_TITLE,
  CRAWL_PAGES,
  CRAWL_PAGES_LABEL,
  CRAWL_TITLE,
  LOOP,
  NODES,
  OUR_POSITION,
  SERP_ROWS,
  SERP_TITLE,
  at,
} from "@/components/sections/service/visuals/crawlGraphShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * Phone stage of the search-engine-optimization depiction.
 *
 * The 960x640 drawing fans a root left-to-right into three diagnostics and
 * converges them on a search result. At 327px every one of those five panels
 * burst: "Core Web Vitals" set three lines deep outside a box 80 units tall,
 * "Indexation" printed across its own issue count, and the result panel came
 * out empty.
 *
 * **The parallelism is the argument, so it is the thing that had to survive.**
 * Three diagnostics that all have to clear before a ranking moves are
 * simultaneous conditions, not sequential steps — a single-file column would
 * argue the opposite of the page. So they sit side by side, three across, which
 * is the one arrangement nothing can misread as an order. Containment does the
 * rest: they are three columns of one audit panel rather than three panels in a
 * row, so the drawing is three objects and not five.
 *
 * **Nothing travels.** Every other phone stage in this set moves a token along
 * a dashed leader, and a leader here would have to fan and reconverge — which
 * is the vertical funnel the migration piece already is. The link is causal
 * rather than spatial and it is drawn in time instead: the crawl fills, the
 * three markers fill together, the audit's status flips to "All clear", and
 * only then does the tracked result move. "Fix the crawl, *then* earn the
 * ranking" is a sequence of conditions, and sequence is what animation is for.
 *
 * The markers clear 0.12s apart rather than on the same frame. Perfectly
 * simultaneous reads as one element with three parts; a stagger this short
 * still reads as at once, but as three things.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 466);

const INSET = 20;
const COL_W = 320;
const PAD = 14;

/**
 * Block heights, measured at the narrow end rather than the design one.
 *
 * `ts`'s 10px floor means these panels' contents grow, in canvas units, as the
 * canvas shrinks, and here a 320 viewport also wraps "Core Web Vitals" onto a
 * second line: the audit needs 162 units there against 150 at 375. Sized for
 * 375 it ate its own bottom padding on a smaller phone, so both are sized for
 * the smaller one and carry a little air on the larger.
 */
const CRAWL = { y: 20, h: 64 };
const AUDIT = { y: 104, h: 168 };
const SERP = { y: 294, h: 152 };

/** When each diagnostic clears. Close enough together to read as at once. */
const CLEARED = 1.5;
const STAGGER = 0.12;

/**
 * One easing per segment, never one for the sequence.
 *
 * A bare `ease` beside `times` is handed to WAAPI as the easing of the whole
 * effect, so the loop's own clock gets remapped and every offset in the
 * storyboard lands somewhere else. Holds take `linear` because a hold between
 * two identical values has no curve to have.
 */
const HOLD = "linear";

export function CrawlGraphPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="md" className="top-[52%] left-[12%]" />

      {/* ---- The crawl. The one part of this that is genuinely a process ---- */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 3, period: 13, phase: 0 }}
        className="absolute overflow-hidden"
        style={{
          left: px(INSET),
          top: py(CRAWL.y),
          width: px(COL_W),
          height: py(CRAWL.h),
          padding: cq(PAD),
          borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
        }}
      >
        <span
          className="flex items-baseline justify-between"
          style={{ gap: cq(8) }}
        >
          <span className="text-ink font-medium" style={{ fontSize: ts(12) }}>
            {CRAWL_TITLE}
          </span>
          <span
            className="text-muted tabular-nums"
            style={{ fontSize: ts(11) }}
          >
            {playing ? (
              <CountUp value={CRAWL_PAGES} delay={0.3} duration={1.1} />
            ) : (
              CRAWL_PAGES.toLocaleString()
            )}{" "}
            {CRAWL_PAGES_LABEL}
          </span>
        </span>

        {/* Scale rather than width: a transform is composited, a width is not. */}
        <span
          className="bg-hair block w-full overflow-hidden rounded-full"
          style={{ height: cq(3), marginTop: cq(10) }}
        >
          <motion.span
            className="bg-brand-400 block size-full origin-left rounded-full"
            initial={false}
            animate={playing ? { scaleX: [0, 0, 1, 1, 0] } : { scaleX: 1 }}
            transition={
              playing
                ? {
                    duration: LOOP,
                    times: [0, at(0.2), at(1.4), at(7.3), 1],
                    repeat: Infinity,
                    ease: [HOLD, EASE.out, HOLD, EASE.inOut],
                  }
                : undefined
            }
          />
        </span>
      </FloatPanel>

      {/* ---- The audit. Three conditions, side by side because they are ---- */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 4, period: 15, phase: 0.3 }}
        className="absolute flex flex-col overflow-hidden"
        style={{
          left: px(INSET),
          top: py(AUDIT.y),
          width: px(COL_W),
          height: py(AUDIT.h),
          padding: cq(PAD),
          borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
        }}
      >
        <span
          className="flex items-baseline justify-between"
          style={{ gap: cq(8) }}
        >
          <span className="text-ink font-medium" style={{ fontSize: ts(12) }}>
            {AUDIT_TITLE}
          </span>
          {/* The gate, stated. Both readings are laid on one another so the
              flip cannot shift the header's width as it happens. */}
          <span
            className="relative shrink-0 whitespace-nowrap"
            style={{ fontSize: ts(11) }}
          >
            <Status playing={playing} open>
              {AUDIT_OPEN}
            </Status>
            <Status playing={playing}>{AUDIT_CLEAR}</Status>
            {/* Holds the row open at the wider of the two readings. */}
            <span className="invisible" aria-hidden>
              {AUDIT_OPEN.length > AUDIT_CLEAR.length
                ? AUDIT_OPEN
                : AUDIT_CLEAR}
            </span>
          </span>
        </span>

        <span
          className="border-hair block border-t"
          style={{ marginTop: cq(10) }}
        />

        {/*
          One grid rather than three stacked columns, so the label row, the
          figure row and the unit row each take the height of their own tallest
          cell. Reserving a fixed height for the labels instead was wrong twice
          over: it left 19 units of dead space where nothing wrapped, and it cut
          "Core Web Vitals" in half where something did — `leading-snug` is
          1.375, so a wrapped label at a 320 viewport is 36 units, not the 26
          two lines of nominal type suggest.
        */}
        <span
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: cq(12),
            rowGap: cq(6),
            marginTop: cq(10),
            // The panel is sized for the viewport where "Core Web Vitals"
            // wraps, so on a wider one there are thirty spare units. Centred,
            // they read as the panel breathing; left at the foot they read as
            // the columns having fallen to the top of it.
            flex: 1,
            alignContent: "center",
          }}
        >
          {NODES.map((node, i) => (
            <Cell
              key={`${node.label}-label`}
              index={i}
              playing={playing}
              className="text-ink-soft leading-snug"
              fontSize={ts(11)}
            >
              {node.label}
            </Cell>
          ))}
          {NODES.map((node, i) => (
            <Cell
              key={`${node.label}-count`}
              index={i}
              playing={playing}
              className="font-display text-brand-600 leading-none font-semibold tabular-nums"
              fontSize={ts(20)}
            >
              {node.count}
            </Cell>
          ))}
          {NODES.map((node, i) => (
            <Unit
              key={`${node.label}-unit`}
              unit={node.unit}
              index={i}
              playing={playing}
            />
          ))}
        </span>
      </FloatPanel>

      {/* ---- The ranking, which moves only once the audit is clear ---- */}
      <FloatPanel
        playing={playing}
        focal
        interactive
        float={{ amplitude: 5, period: 12, phase: 0.6 }}
        className="absolute overflow-hidden"
        style={{
          left: px(INSET),
          top: py(SERP.y),
          width: px(COL_W),
          height: py(SERP.h),
          padding: cq(PAD),
          borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
          borderColor: "var(--color-brand-300)",
        }}
      >
        <span className="text-ink-soft block" style={{ fontSize: ts(12) }}>
          {SERP_TITLE}
        </span>

        <span
          style={{ display: "grid", gap: cq(10), marginTop: cq(12) }}
          aria-hidden
        >
          {SERP_ROWS.map((pos) => (
            <Result key={pos} pos={pos} playing={playing} />
          ))}
        </span>
      </FloatPanel>
    </div>
  );
}

/**
 * One reading of the audit's status, crossfading with the other.
 *
 * `open` is the one showing before the diagnostics clear; the other takes over
 * a beat after the last marker fills, so the flip reads as a consequence of
 * them rather than a fourth thing happening at the same time.
 */
function Status({
  children,
  open = false,
  playing,
}: {
  children: string;
  open?: boolean;
  playing: boolean;
}) {
  const times = [0, at(CLEARED + 0.4), at(CLEARED + 0.7), at(7.3), at(7.6), 1];

  return (
    <motion.span
      className={
        open
          ? "text-muted absolute inset-0 text-right"
          : "text-brand-700 absolute inset-0 text-right font-medium"
      }
      initial={false}
      animate={
        !playing
          ? { opacity: open ? 0 : 1 }
          : open
            ? { opacity: [1, 1, 0, 0, 1, 1] }
            : { opacity: [0, 0, 1, 1, 0, 0] }
      }
      transition={
        playing
          ? {
              duration: LOOP,
              times,
              repeat: Infinity,
              ease: [HOLD, "easeInOut", HOLD, "easeInOut", HOLD],
            }
          : undefined
      }
    >
      {children}
    </motion.span>
  );
}

/**
 * When a diagnostic clears.
 *
 * Shared by every cell of a column so its label, its figure and its marker
 * cannot drift apart, and staggered by index so the three read as at once but
 * as three things rather than one element with three parts.
 */
function columnTransition(index: number): Transition {
  const fills = CLEARED + index * STAGGER;
  return {
    duration: LOOP,
    times: [0, at(fills), at(fills + 0.35), at(7.3), at(7.6), 1],
    repeat: Infinity,
    ease: [HOLD, EASE.out, HOLD, "easeInOut", HOLD],
  };
}

/** Resolving lifts a column out of the muted state it audits in. */
const RESOLVES = [0.55, 0.55, 1, 1, 0.55, 0.55];

/**
 * One cell of a diagnostic column.
 *
 * The figure is set nearly twice the size of its label because at 89 units wide
 * a column has room for a number or a sentence and not both, and the number is
 * what makes this read as an audit rather than a flowchart.
 */
function Cell({
  children,
  className,
  fontSize,
  index,
  playing,
}: {
  children: string;
  className: string;
  fontSize: string;
  index: number;
  playing: boolean;
}) {
  return (
    <motion.span
      className={`block ${className}`}
      style={{ fontSize }}
      initial={false}
      animate={playing ? { opacity: RESOLVES } : { opacity: 1 }}
      transition={playing ? columnTransition(index) : undefined}
    >
      {children}
    </motion.span>
  );
}

/**
 * A column's unit, and the marker that says it cleared.
 *
 * Two dots laid on each other rather than one dot changing colour: a crossfade
 * is a compositor step, and interpolating between two `var()` colours is not
 * something to rely on.
 */
function Unit({
  unit,
  index,
  playing,
}: {
  unit: string;
  index: number;
  playing: boolean;
}) {
  const transition = columnTransition(index);

  return (
    <motion.span
      className="flex items-center"
      style={{ gap: cq(5) }}
      initial={false}
      animate={playing ? { opacity: RESOLVES } : { opacity: 1 }}
      transition={playing ? transition : undefined}
    >
      <span
        className="relative shrink-0"
        style={{ width: cq(5), height: cq(5) }}
      >
        <span className="bg-hair absolute inset-0 rounded-full" />
        <motion.span
          className="bg-brand-500 absolute inset-0 rounded-full"
          initial={false}
          animate={playing ? { opacity: [0, 0, 1, 1, 0, 0] } : { opacity: 1 }}
          transition={playing ? transition : undefined}
        />
      </span>
      <span className="text-muted truncate" style={{ fontSize: ts(10) }}>
        {unit}
      </span>
    </motion.span>
  );
}

/** One search result. Ours arrives; the others were always there. */
function Result({ pos, playing }: { pos: number; playing: boolean }) {
  const ours = pos === OUR_POSITION;

  return (
    <motion.span
      className="flex items-center"
      style={{ gap: cq(10) }}
      initial={false}
      animate={
        playing && ours
          ? { opacity: [0.25, 0.25, 1, 1, 0.25], x: [10, 10, 0, 0, 10] }
          : { opacity: ours ? 1 : 0.35, x: 0 }
      }
      transition={
        playing && ours
          ? {
              duration: LOOP,
              // The ranking waits on the audit rather than running beside it.
              times: [0, at(CLEARED + 0.6), at(CLEARED + 1.5), at(7.3), 1],
              repeat: Infinity,
              ease: [HOLD, EASE.out, HOLD, EASE.inOut],
            }
          : undefined
      }
    >
      <span
        className={
          ours
            ? "font-display text-brand-600 shrink-0 font-semibold tabular-nums"
            : "font-display text-muted shrink-0 font-semibold tabular-nums"
        }
        style={{ fontSize: ts(12) }}
      >
        #{pos}
      </span>
      <span className="flex-1" style={{ display: "grid", gap: cq(4) }}>
        <span
          className={
            ours
              ? "bg-brand-300 block rounded-full"
              : "bg-hair block rounded-full"
          }
          style={{ height: cq(5), width: ours ? "100%" : "72%" }}
        />
        <span
          className="bg-hair block rounded-full"
          style={{ height: cq(4), width: "48%" }}
        />
      </span>
    </motion.span>
  );
}
