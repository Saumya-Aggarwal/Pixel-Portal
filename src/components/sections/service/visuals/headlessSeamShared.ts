import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared timing and copy for HeadlessSeam.
 *
 * One content model rendered by three surfaces that do not own it. Both
 * canvases run the same model, the same fields and the same beats; the seam's
 * orientation and the fan's geometry are all that differ.
 */

export const LOOP = 8;
export const at = (seconds: number) => beat(seconds, LOOP);

export const FIELDS = [
  ["Title", "String", "Q4 Launch"],
  ["Hero_Asset", "Media", "v2-final.jpg"],
  ["Body", "RichText", "[HTML Block]"],
  ["CTA_Link", "URL", "/signup"],
];

export const MODEL_EYEBROW = "CONTENT MODEL";
export const MODEL_NAME = "Campaign";
export const STATUS_BEFORE = "Draft";
export const STATUS_AFTER = "Published";

/** What every surface renders, since they all render the same record. */
export const HEADLINE = "Q4 Launch";
export const CTA = "Sign Up";
export const HOSTNAME = "example.com";

/**
 * The widget's own label.
 *
 * The desktop says "Embedded Ad". The widget is the smallest surface on either
 * canvas and it shares its top row with the sync pill, so the phone keeps only
 * the word that names the surface: measured, "EMBEDDED" is 85px against 107 of
 * usable width, and the pill needs 43 of those.
 */
export const WIDGET_LABEL = "Embedded Ad";
export const WIDGET_LABEL_SHORT = "Embed";

/** The publish flip, which is what sends the packets. */
export const STATUS_TIMES = [0, at(0.2), at(0.4), at(7.6), at(7.8), 1];
export const STATUS_BEFORE_OPACITY = [1, 1, 0, 0, 1, 1];
export const STATUS_AFTER_OPACITY = [0, 0, 1, 1, 0, 0];

/** Arrival acknowledgement. Data, so it may come and go; the panels may not. */
export const SYNC_TIMES = [0, at(1.8), at(2.0), at(3.0), at(3.2), 1];
export const SYNC_OPACITY = [0, 0, 1, 1, 0, 0];

/** Every packet leaves here and arrives here, whatever route it takes. */
export const DEPART = 0.3;
export const ARRIVE = 1.8;
