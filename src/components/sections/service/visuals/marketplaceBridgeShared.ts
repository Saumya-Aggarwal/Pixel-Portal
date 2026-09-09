import { beat } from "@/components/sections/service/visuals/canvas";

/**
 * Shared timing and content for MarketplaceBridge.
 *
 * A vendor view and a buyer view, and a core that overlaps both. The overlap is
 * the argument on either canvas: the thing in the middle is not a service
 * between two apps, it is the schema both sides are views onto.
 */

export const LOOP = 8.5;
export const at = (seconds: number) => beat(seconds, LOOP);

export const VENDOR_TITLE = "Vendor Portal";
export const BUYER_TITLE = "Buyer Experience";
export const CORE_TITLE = "Core Data Model";

/** TODO(content): illustrative figures. */
export const VENDOR_ROWS = [
  ["Listings", "1,204"],
  ["Pending review", "18"],
  ["Payout due", "$8,410"],
];

/** How many listing tiles the buyer view browses. */
export const BUYER_TILES = 6;

/**
 * The schema, and which view each relation surfaces in.
 *
 * `side` is only read by the phone stage, where the core's rows take it in
 * turns and light the view they belong to — which is the overlap's claim said
 * out loud, since a row that belongs to both is the whole reason the model sits
 * under both rather than between them. On the wide canvas the overlap is
 * visible all at once and the rows do not need to say it.
 */
export const RELATIONS = [
  { from: "vendor", rel: "1 : n", to: "listing", side: "vendor" },
  { from: "listing", rel: "1 : n", to: "variant", side: "both" },
  { from: "order", rel: "n : 1", to: "buyer", side: "buyer" },
  { from: "payout", rel: "n : 1", to: "vendor", side: "vendor" },
] as const;

export type Side = "vendor" | "buyer";

export const lights = (relation: (typeof RELATIONS)[number], side: Side) =>
  relation.side === side || relation.side === "both";

/** Each relation holds the floor for this long before the next takes over. */
export const STEP = LOOP / RELATIONS.length;
