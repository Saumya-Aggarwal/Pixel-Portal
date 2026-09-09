"use client";

import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared timing, copy and rows for TableTransfer.
 *
 * Both canvases show the same migration — a legacy table drains, everything
 * passes through a staging store that checksums it, the target fills — so the
 * beats and the data live here once. The phone shows the first three rows of
 * each table rather than all six; the row data is the same list, sliced.
 */

export const LOOP = 9;
export const at = (seconds: number) => beat(seconds, LOOP);

/** When the tables reset, after everything has landed. */
export const REST = 8.4;

export const GRID = "26% 42% 32%";

export const LEGACY_ROWS = [
  ["8492", "A. Smith", "2018-04-12"],
  ["8493", "J. Doe", "2018-06-03"],
  ["8494", "S. Lee", "2019-01-27"],
  ["8495", "M. Ray", "2019-08-14"],
  ["8496", "K. Patel", "2020-02-09"],
  ["8497", "R. Iqbal", "2020-11-30"],
];

export const TARGET_ROWS = [
  ["0x7a1c", "A. Smith", "TRUE"],
  ["0x7a1d", "J. Doe", "TRUE"],
  ["0x7a1e", "S. Lee", "TRUE"],
  ["0x7a1f", "M. Ray", "TRUE"],
  ["0x7a20", "K. Patel", "TRUE"],
  ["0x7a21", "R. Iqbal", "TRUE"],
];

export const LEGACY_COLUMNS = ["id", "name", "created_at"];
export const TARGET_COLUMNS = ["uuid", "full_name", "verified"];

export const LEGACY_TITLE = "Legacy DB (MySQL)";
export const TARGET_TITLE = "Target Schema (Postgres)";

/** TODO(content): illustrative figures. */
export const TOTAL_ROWS = "142,500";
export const MIGRATED = 120000;

/** How many of the table's rows are on screen, which differs per canvas. */
export const shownLabel = (n: number) => `${n} of ${TOTAL_ROWS} shown`;

export const SCRIPT_FILE = "migrate.ts";
export const SCRIPT_COMMAND = "$ migrate --verify --batch 500";
export const SCRIPT_RESULT = "✓ checksum matched · 0 orphaned rows";

/**
 * The store, drawn as one. A labelled box would not read as a database.
 *
 * Sized by the caller because the two canvases scale differently; everything
 * inside is viewBox units, so it stays proportional at whatever size it is
 * given.
 */
export function Cylinder({ width, height }: { width: string; height: string }) {
  return (
    <svg
      viewBox="0 0 40 48"
      aria-hidden
      style={{ width, height }}
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

export function Cells({
  row,
  fontSize,
  verified = false,
}: {
  row: string[];
  /** The caller's canvas decides how big a 10-unit label actually is. */
  fontSize: string;
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
          style={{ fontSize }}
        >
          {cell}
        </span>
      ))}
    </>
  );
}
