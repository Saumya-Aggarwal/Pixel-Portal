"use client";

import { motion } from "motion/react";
import { useRef } from "react";

import { BLUR, DUR, EASE, STAGGER, VIEWPORT } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { ComparisonRow } from "@/types/content";

/**
 * Us-versus-them table.
 *
 * A real `<table>`, not a grid of divs: the row labels and the two verdict
 * columns are tabular data, and a screen reader should be able to say "Full
 * funnel attribution — Pixel Portal, yes; typical agency, no" rather than
 * reading three unrelated cells.
 *
 * That constraint is why this is its own client component instead of using
 * `RevealGroup`, which renders a `div` and cannot sit between `table` and
 * `tr`. The variants below are the same vocabulary `Reveal` uses, applied to
 * `motion.tbody` and `motion.tr`.
 */
export function ComparisonTable({
  columns,
  rows,
}: {
  columns: [string, string];
  rows: ComparisonRow[];
}) {
  const prefersReduced = useReducedMotion();

  const body = rows.map((row) => (
    <Row key={row.label} row={row} animated={!prefersReduced} />
  ));

  return (
    <div className="-mx-6 overflow-x-auto px-6 lg:mx-0 lg:overflow-x-visible lg:px-0">
      <table className="w-full min-w-136 border-collapse text-left">
        <caption className="sr-only">
          How this engagement compares with a typical agency arrangement
        </caption>
        <thead>
          <tr className="border-hair border-b">
            <th scope="col" className="text-eyebrow text-muted pb-4 font-medium uppercase">
              Capability
            </th>
            <th
              scope="col"
              className="text-eyebrow text-brand-700 w-34 pb-4 text-center font-semibold uppercase"
            >
              {columns[0]}
            </th>
            <th
              scope="col"
              className="text-eyebrow text-muted w-34 pb-4 text-center font-medium uppercase"
            >
              {columns[1]}
            </th>
          </tr>
        </thead>

        {prefersReduced ? (
          <tbody>{body}</tbody>
        ) : (
          <motion.tbody
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: STAGGER.tight } } }}
          >
            {body}
          </motion.tbody>
        )}
      </table>
    </div>
  );
}

function Row({ row, animated }: { row: ComparisonRow; animated: boolean }) {
  const ref = useRef<HTMLTableRowElement>(null);

  const cells = (
    <>
      <th
        scope="row"
        className="text-ink py-4 pr-6 text-[0.9375rem] leading-snug font-medium"
      >
        {row.label}
      </th>
      <Verdict value={row.ours} accent />
      <Verdict value={row.theirs} />
    </>
  );

  const className = "border-hair ease-soft border-b transition-colors duration-300 hover:bg-brand-50/60";

  if (!animated) return <tr className={className}>{cells}</tr>;

  return (
    <motion.tr
      ref={ref}
      className={className}
      variants={{
        hidden: { opacity: 0, y: 12, filter: `blur(${BLUR.subtle}px)` },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: DUR.base, ease: EASE.out },
        },
      }}
      // Same reasoning as Reveal: a settled `blur(0px)` is still a filter, and
      // still costs a compositing layer on every row of the table.
      onAnimationComplete={() => {
        if (ref.current) ref.current.style.filter = "none";
      }}
    >
      {cells}
    </motion.tr>
  );
}

/**
 * A single verdict cell.
 *
 * The glyph is `aria-hidden` and paired with visually-hidden text, so the
 * column announces "included" / "not included" instead of a checkmark
 * character that screen readers pronounce inconsistently.
 */
function Verdict({ value, accent = false }: { value: boolean; accent?: boolean }) {
  return (
    <td className="py-4 text-center">
      <span className="sr-only">{value ? "Included" : "Not included"}</span>
      {value ? (
        <span
          aria-hidden
          className={
            accent
              ? "bg-brand-50 text-brand-700 inline-flex size-7 items-center justify-center rounded-full text-[0.875rem] font-semibold"
              : "text-ink-soft inline-flex size-7 items-center justify-center text-[0.875rem]"
          }
        >
          ✓
        </span>
      ) : (
        <span aria-hidden className="text-hair inline-block text-[1.125rem] leading-none">
          —
        </span>
      )}
    </td>
  );
}
