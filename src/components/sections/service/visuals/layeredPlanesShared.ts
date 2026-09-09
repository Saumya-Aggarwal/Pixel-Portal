import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared copy and contents for LayeredPlanes.
 *
 * Three depths of one system: the data an editor touches, the vocabulary the
 * pages are assembled from, and the interface a visitor sees. The argument is
 * that these are not three things — the page marketing edits and the page a
 * visitor loads are the same system viewed from different depths — so both
 * canvases carry all three at once rather than cycling between them.
 */

export const LOOP = 12;
export const at = (seconds: number) => beat(seconds, LOOP);

export const PLANES = [
  { id: "data", title: "CMS & Data Layer" },
  { id: "system", title: "Component System" },
  { id: "live", title: "Live Interface" },
];

/** What an editor actually touches. */
export const FIELDS = [
  ["title", "string"],
  ["hero.image", "asset"],
  ["sections[]", "block"],
  ["seo.meta", "object"],
];

/** The vocabulary the pages are built from. */
export const COMPONENTS = [
  "Hero",
  "Card",
  "Nav",
  "Form",
  "Table",
  "CTA",
  "Tabs",
  "Foot",
];

export const LCP_LABEL = "LCP Score";
/** TODO(content): illustrative figures. Counts down — improving is the point. */
export const LCP_FROM = 2.4;
export const LCP_TO = 0.8;
