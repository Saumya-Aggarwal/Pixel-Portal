import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared timing and copy for BreakpointRuler.
 *
 * One layout, measured across its whole range. Nothing is dropped on either
 * canvas: the argument is that the layout *survives* the squeeze, and a card
 * that vanishes at 375px is the failure the page sells against.
 */

export const LOOP = 14;
export const at = (seconds: number) => beat(seconds, LOOP);

/** Desktop, hold, tablet, hold, mobile, hold, straight back. */
export const TIMES = [0, at(2.5), at(4), at(6), at(7.5), at(10), at(12), 1];

/** The three the sweep rests on. 768 is the stop the headline names. */
export const STOPS = [1440, 768, 375];
export const LABELS = STOPS.map((real) => `${real}px`);

/** Every keyframe list here is desktop, hold, tablet, hold, mobile, hold, back. */
export const swing = <T>(d: T, t: T, m: T): T[] => [d, d, t, t, m, m, d, d];

export const NAV_LINKS = ["About", "Services", "Contact"];
export const HERO_TITLE = "Enterprise Software";
export const CTA = "Book a demo";
export const CARDS = ["Performance", "Scalability", "Security"];
