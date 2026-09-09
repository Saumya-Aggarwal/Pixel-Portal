import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared timing, copy and posts for SocialFeed.
 *
 * The page argues that posting on a schedule is not a strategy — most brands
 * post, very few compound — so on both canvases the feed is never alone: a
 * calendar decides what goes out and a queue produces it. Same operation, same
 * beats, same posts; only the arrangement differs.
 */

export const LOOP = 8;
export const at = (seconds: number) => beat(seconds, LOOP);

export const CALENDAR_TITLE = "Q3 Content Calendar";

export const CALENDAR = [
  ["Mon", "Carousel · Brand"],
  ["Wed", "Reel · Product"],
  ["Thu", "Case study"],
  ["Sat", "Community AMA"],
];

/**
 * The slot the post published during this loop came out of.
 *
 * Only the phone stage uses it — there the post visibly leaves the calendar, so
 * it has to leave a specific row rather than the panel in general. Thursday's
 * case study is the one that becomes "what forty assets a month actually looks
 * like".
 */
export const FIRING_SLOT = 2;

export const QUEUE_TITLE = "Publishing Queue";

/**
 * Weekly volume, as percentages of the desktop's plot.
 *
 * The tallest reaches 52 of a possible 100, which on a 52-unit plot is a row of
 * low nubs — legible enough on the desktop, where the panel is 320 units wide
 * and the bars are incidental. The phone's plot is a third of that height, so
 * it divides by the peak instead and lets the tallest bar fill it. Same shape,
 * same relative volumes; it just stops wasting half its box.
 */
export const QUEUE_BARS = [38, 22, 46, 30, 52, 26, 34];
export const QUEUE_PEAK = Math.max(...QUEUE_BARS);
export const SLA = "SLA: <15 min";

export const HANDLE = "@pixel_portal";

/**
 * The feed, oldest first.
 *
 * TODO(content): illustrative engagement figures.
 *
 * Ordered rather than arbitrary: the desktop used to show a two-hour-old post
 * above a five-hour-old one, which nobody notices when the captions carry the
 * eye but is glaring on the phone, where the pile shows four timestamps in a
 * column and nothing else. Ascending recency also puts the engagement figures
 * in ascending order down the stack, which is the page's word "compound" drawn
 * rather than asserted.
 *
 * The last entry is the one published during the loop. Everything before it is
 * history, and the desktop renders only the final three.
 */
export const POSTS = [
  {
    caption: "Why we stopped posting five times a week.",
    age: "1d ago",
    lift: 7.6,
  },
  {
    caption: "Replatforming Northwind in eleven weeks.",
    age: "5h ago",
    lift: 9.1,
  },
  {
    caption: "Behind the rebrand — three weeks of type tests.",
    age: "2h ago",
    lift: 14.2,
  },
  {
    caption: "What forty assets a month actually looks like.",
    age: "Just now",
    lift: 18.4,
  },
];
