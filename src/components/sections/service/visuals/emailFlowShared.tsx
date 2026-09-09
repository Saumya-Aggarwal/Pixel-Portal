"use client";

import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared timing, copy and glyph for EmailFlow.
 *
 * Both canvases draw the same thing: a real mailer, and the two messages that
 * may follow it depending on what the first one does. The topology is a branch
 * on either, because an automation is not a decision tree — it is a sequence of
 * messages, and the branches are themselves emails.
 */

export const LOOP = 9;
export const at = (seconds: number) => beat(seconds, LOOP);

/** The mailer. Everything here is rendered rather than labelled. */
export const FROM = "From · Pixel Portal";
export const SUBJECT = "You left something behind";
export const PREHEADER = "Your cart is saved for 48 hours";
export const CTA = "Complete your order";

export const BRANCHES = [
  {
    id: "opened",
    chip: "Opened",
    subject: "Your order is confirmed",
    preheader: "Plus something you might like",
    live: true,
  },
  {
    id: "quiet",
    chip: "No open · 24h",
    subject: "Still thinking it over?",
    preheader: "Resent with a new subject line",
    live: false,
  },
];

/** TODO(content): illustrative figures. */
export const STATS = [
  ["Delivered", "10,000"],
  ["Opened", "40%"],
  ["Clicked", "10%"],
];

/**
 * The envelope on a follow-up.
 *
 * Sized by the caller: the desktop's tile is 30 units of a 960 canvas and the
 * phone's is 28 of a 360 one, which are not the same number of pixels and were
 * never going to be served by one hardcoded 15.
 */
export function EnvelopeGlyph({
  live,
  size = "15px",
}: {
  live: boolean;
  size?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: size, height: size }}
      fill="none"
      stroke={live ? "var(--color-brand-700)" : "var(--color-muted)"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
