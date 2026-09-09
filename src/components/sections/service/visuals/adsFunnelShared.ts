import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared timing and content for AdsFunnel.
 *
 * The page's argument is that Google, Meta, LinkedIn and YouTube are a single
 * funnel reported once, not four channels reported separately. So on both
 * canvases the four channels feed one entry point, and the only figure that
 * matters is the blended one at the end.
 */

export const LOOP = 7;
export const at = (seconds: number) => beat(seconds, LOOP);

export const CHANNELS = ["Google", "Meta", "LinkedIn", "YouTube"];

/** TODO(content): illustrative figures. */
export const RINGS = [
  { label: "Cross-Channel Traffic", figure: "40,000" },
  { label: "Intent & Engagement", figure: "5,000" },
  { label: "Conversion", figure: "400" },
];

export const SPEND_LABEL = "Weekly Spend";
export const SPEND = "$10,000";

export const ROAS_LABEL = "Blended ROAS";
export const ROAS = 4;
export const ROAS_SUFFIX = "x";
