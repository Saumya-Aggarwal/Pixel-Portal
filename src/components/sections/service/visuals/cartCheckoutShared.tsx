"use client";

/**
 * Shared beats, copy and glyph for CartToCheckout.
 *
 * A state machine rather than a loop: beats are discrete, hold for different
 * lengths, and change what is on screen. Both canvases run the same five and
 * show the same purchase; only where the checkout comes in from differs.
 */

export const BEATS = [
  { id: "browse", hold: 2.2 },
  { id: "added", hold: 1.6 },
  { id: "checkout", hold: 2.4 },
  { id: "paid", hold: 3.6 },
  { id: "reset", hold: 1.0 },
] as const;

export type Beat = (typeof BEATS)[number]["id"];

export const SHEET_UP = new Set<Beat>(["checkout", "paid"]);
export const IN_CART = new Set<Beat>(["added", "checkout", "paid"]);

export const URL = "shop.example.com";
export const STOREFRONT = "Storefront";
export const EMPTY_CART = "$0.00";

/**
 * The catalogue.
 *
 * The long name is stored whole and truncated by CSS rather than shipped with
 * an ellipsis baked into it: both canvases cut it, but at different widths, and
 * a hardcoded "Noise-Cancelling…" is a guess about a measurement neither of
 * them has to guess at. The third product used to repeat the first one's name
 * at a different price, which reads as a mistake rather than a catalogue.
 */
export const PRODUCTS = [
  { name: "Headphone Stand", price: "$49.00" },
  { name: "Noise-Cancelling Headphones", price: "$299.00", chosen: true },
  { name: "Desk Mat", price: "$79.00" },
];

export const CHOSEN = PRODUCTS.findIndex((p) => p.chosen);
export const CART_TOTAL = PRODUCTS[CHOSEN].price;

export const CHECKOUT_TITLE = "Checkout";
export const PAID_TITLE = "Order confirmed";

/** TODO(content): illustrative order details. */
export const CHECKOUT_FIELDS = [
  ["Email", "ana@example.com"],
  ["Card", "•••• 4242"],
  ["Ship to", "Gurgaon, IN"],
];

export const TOTAL_LABEL = "Total";
export const ORDER_ID = "#PX-40917";
export const GATEWAY = "Stripe / v1";

export const SESSIONS_LABEL = "Active Sessions";
export const INVENTORY_LABEL = "Live Inventory";
/** TODO(content): illustrative figures. */
export const SESSIONS = "12,450";
export const STOCK_HELD = "400";
export const STOCK_SOLD = "399";

export function CartGlyph({ size = "14px" }: { size?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: size, height: size }}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="text-ink-soft"
    >
      <path d="M3 4h2l2.4 10.4A2 2 0 0 0 9.35 16h7.9a2 2 0 0 0 1.95-1.55L21 7H6" />
      <circle cx="10" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}
