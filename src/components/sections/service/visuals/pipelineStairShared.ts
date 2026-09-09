import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared timing, copy and figures for PipelineStair.
 *
 * Four stages, each emitting what the next one consumes. Both canvases run the
 * same stack and the same beats; only the geometry of the staircase differs.
 */

export const LOOP = 10;
export const at = (seconds: number) => beat(seconds, LOOP);

export const STAGES = [
  { id: "src", title: "Data Sources", payload: "RAW_JSON" },
  { id: "col", title: "Collection", payload: "CLEAN_EVENTS" },
  { id: "whs", title: "Warehouse", payload: "AGGREGATES" },
  { id: "rep", title: "Reporting", payload: "BOARD_DECK" },
];

export const SOURCES = [
  ["Stripe Webhooks", "1.2k/day"],
  ["Postgres DB", "48 tables"],
  ["Segment Track", "22 events"],
];

export const COLLECTION = [
  ["Snowplow Pipeline", "streaming"],
  ["Schema Validation", "0 rejects"],
  ["PII Hashing", "SHA-256"],
];

export const SCHEMA = [
  ["user_id", "string"],
  ["event_ts", "timestamp"],
  ["source", "string"],
  ["revenue", "numeric"],
];

export const WAREHOUSE = ["BigQuery", "1M rows"];

/**
 * Bar heights, in units of the desktop's 96-unit plot.
 *
 * Kept as that rather than as absolute lengths so a shorter plot stays in
 * proportion: the phone scales them by its own plot height instead of carrying
 * a second, silently divergent list.
 */
export const BARS = [38, 52, 44, 68, 60, 82];
export const BAR_PLOT = 96;

/** TODO(content): illustrative figures. */
export const MRR = 40000;
export const MRR_LABEL = "Monthly recurring revenue";
export const MRR_DELTA = "+10% vs last month";
