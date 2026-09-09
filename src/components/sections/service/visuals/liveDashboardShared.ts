import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared timing, copy and plot for LiveDashboard.
 *
 * The page's argument is that a figure in a board deck should survive being
 * questioned, so both canvases show the figure being *derived* rather than
 * displayed: collection first, then the curve, then the total. Same sources,
 * same curve, same beats; only the arrangement differs.
 */

export const LOOP = 12;
/** Blueprint timings in seconds, as fractions of the loop. */
export const at = (seconds: number) => beat(seconds, LOOP);

export const SOURCES = [
  { label: "Web Client", detail: "GA4 Stream" },
  { label: "Server Container", detail: "sGTM Verified" },
];

/** Annotation on the second source, which is the one that earns the claim. */
export const CALLOUT = "Server-side";

export const TITLE = "Revenue Attribution";
export const LIVE = "Live";
export const ATTRIBUTED = "Attributed";

/** TODO(content): illustrative figures. Believable, not measured. */
export const TOTAL = 120000;
export const TOTAL_FROM = 80000;
export const PEAK_VALUE = "$20,000";
export const PEAK_DELTA = "20%";

/**
 * The curve, in its own 480x180 space. Peak at x=310 carries the tooltip.
 *
 * Shared because it is the shape of the data rather than a position on a
 * canvas: both drawings plot the same three days, and a phone that invented a
 * second curve would be showing different numbers for the same claim.
 */
export const PLOT = [
  [0, 152],
  [53, 140],
  [107, 146],
  [160, 118],
  [213, 96],
  [267, 54],
  [310, 20],
  [373, 48],
  [427, 38],
  [480, 26],
] as const;

export const LINE = PLOT.map(
  ([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`,
).join(" ");

export const PEAK = { x: 310, y: 20 };

/** Plot height in the curve's own space; the axis rule sits on it. */
export const PLOT_H = 180;
export const PLOT_W = 480;

export const GRIDLINES = [
  { y: 40, label: "$20k" },
  { y: 100, label: "$10k" },
];

export const DATES = ["Oct 12", "Oct 13", "Oct 14"];
