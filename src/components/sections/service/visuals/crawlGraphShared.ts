import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared timing and copy for CrawlGraph.
 *
 * The page's claim is "fix the crawl, then earn the ranking", and the shape
 * that argues it is deliberately non-linear: one crawl, three diagnostics that
 * are simultaneous conditions rather than sequential steps, and a ranking that
 * only moves once all three are clear. Both canvases carry that; only the way
 * the parallelism is drawn differs.
 */

export const LOOP = 8;
export const at = (seconds: number) => beat(seconds, LOOP);

export const CRAWL_TITLE = "Site Crawl";
/** TODO(content): illustrative crawl size. */
export const CRAWL_PAGES = 4120;
export const CRAWL_PAGES_LABEL = "pages";
export const CRAWL_PAGES_TEXT = "4,120 pages";

/**
 * The diagnostics.
 *
 * Split into a figure and its unit rather than kept as one string, because the
 * phone sets the figure at four times the unit's size — a tile 89 units wide
 * has room for a number or a sentence, not both. The desktop reassembles them
 * with `issuesOf` and reads exactly as it did.
 */
export const NODES = [
  { label: "Core Web Vitals", count: "12", unit: "issues" },
  { label: "Indexation", count: "348", unit: "URLs" },
  { label: "Content Gaps", count: "26", unit: "terms" },
];

/** TODO(content): illustrative counts. */
export const issuesOf = (node: (typeof NODES)[number]) =>
  `${node.count} ${node.unit}`;

export const AUDIT_TITLE = "Technical Audit";
/** The gate, stated. Everything below it waits on this reading "All clear". */
export const AUDIT_OPEN = `${NODES.length} open`;
export const AUDIT_CLEAR = "All clear";

export const SERP_TITLE = "Target Keyword";
export const SERP_ROWS = [1, 2, 3];

/**
 * Where the tracked result lands.
 *
 * Not first. On an SEO agency's page a guaranteed top position reads as a
 * promise rather than an illustration.
 */
export const OUR_POSITION = 3;
