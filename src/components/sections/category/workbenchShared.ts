/**
 * Shared branch history for Workbench.
 *
 * Desktop (IDE shell over a wide graph) and the phone stage (branch pills over
 * an editor over a compact graph) are different compositions of the same four
 * workstreams, so the history lives here once — slugs, fork/merge positions,
 * commits, files and test counts.
 *
 * Each branch carries **two** listings of the same file. `code` is the desktop
 * one; `phoneCode` breaks the identical statements across a ~34 character
 * column. That is not a duplicate to keep in sync so much as the same file at
 * two window widths: at 360 the desktop's longest line (`return
 * Response.json(order, { status: 201 });`, 46 characters) needs a 9px mono to
 * fit, and 9px mono is texture, not code. An editor narrowed to a phone rewraps
 * its lines; so does this one.
 *
 * Token arrays alternate colour — even index green, odd index ink — so a line
 * is written as its own syntax highlighting rather than parsed at runtime.
 */

export const BRANCHES = [
  {
    slug: "custom-web-applications",
    name: "feat/orders-api",
    short: "orders-api",
    service: "Custom Web Applications",
    fork: 0.06,
    merge: 0.34,
    commits: [0.12, 0.2, 0.28],
    file: "src/app/orders/route.ts",
    code: [
      ["export", " async ", "function", " POST(req: ", "Request", ") {"],
      ["  const", " body = ", "await", " req.json();"],
      ["  const", " parsed = OrderSchema.", "parse", "(body);"],
      [""],
      ["  const", " order = ", "await", " createOrder(parsed);"],
      ["  return", " Response.json(order, { status: ", "201", " });"],
      ["}"],
    ],
    phoneCode: [
      ["export", " async ", "function", " POST(req) {"],
      ["  const", " body = ", "await", " req.json();"],
      ["  const", " parsed = OrderSchema"],
      ["    .parse", "(body);"],
      [""],
      ["  const", " order = ", "await"],
      ["    createOrder", "(parsed);"],
      ["  return", " Response.json(order);"],
    ],
  },
  {
    slug: "api-integrations",
    name: "feat/crm-sync",
    short: "crm-sync",
    service: "API Integrations",
    fork: 0.22,
    merge: 0.56,
    commits: [0.3, 0.4, 0.5],
    file: "src/lib/sync.ts",
    code: [
      ["export", " async ", "function", " sync(order: ", "Order", ") {"],
      ["  const", " [crm, erp] = ", "await", " Promise.all(["],
      ["    salesforce.upsert(order),"],
      ["    netsuite.push(order),"],
      ["  ]);"],
      [""],
      ["  return", " { crm, erp, at: Date.now() };"],
    ],
    phoneCode: [
      ["export", " async ", "function", " sync(order) {"],
      ["  const", " [crm, erp] ="],
      ["    await", " Promise.all(["],
      ["      salesforce.upsert(order),"],
      ["      netsuite.push(order),"],
      ["    ]);"],
      [""],
      ["  return", " { crm, erp };"],
    ],
  },
  {
    slug: "data-migration-scripting",
    name: "chore/legacy-migrate",
    short: "legacy-migrate",
    service: "Data Migration & Scripting",
    fork: 0.4,
    merge: 0.7,
    commits: [0.48, 0.58, 0.66],
    file: "scripts/migrate.ts",
    code: [
      [
        "for",
        " await (",
        "const",
        " batch ",
        "of",
        " read(legacy, ",
        "500",
        ")) {",
      ],
      ["  const", " rows = batch.map(toTargetSchema);"],
      [""],
      ["  await", " target.insert(rows);"],
      ["  checksum.update(rows);"],
      ["  reporter.tick(rows.length);"],
      ["}"],
    ],
    phoneCode: [
      ["for", " await (", "const", " batch"],
      ["  of", " read(legacy, ", "500", ")) {"],
      ["  const", " rows = batch.map("],
      ["    toTargetSchema,"],
      ["  );"],
      ["  await", " target.insert(rows);"],
      ["  checksum.update(rows);"],
      ["}"],
    ],
  },
  {
    slug: "marketing-seo-tracking-systems",
    name: "feat/event-pipeline",
    short: "event-pipeline",
    service: "Marketing & SEO Tracking Systems",
    fork: 0.62,
    merge: 0.9,
    commits: [0.7, 0.78, 0.86],
    file: "src/lib/events.ts",
    code: [
      ["export", " function", " emit(event: ", "TrackedEvent", ") {"],
      ["  queue.push({ ...event, ts: Date.now() });"],
      [""],
      ["  if", " (queue.length >= ", "50", ") {"],
      ["    void", " flush(queue.splice(", "0", "));"],
      ["  }"],
      ["}"],
    ],
    phoneCode: [
      ["export", " function", " emit(event) {"],
      ["  const", " ts = Date.now();"],
      ["  queue.push({ ...event, ts });"],
      [""],
      ["  if", " (queue.length >= ", "50", ") {"],
      ["    void", " flush(queue.splice(", "0", "));"],
      ["  }"],
      ["}"],
    ],
  },
] as const;

/** Commits that land directly on main: the initial one, then every merge. */
export const MAIN_COMMITS = [0.02, ...BRANCHES.map((b) => b.merge)];

export const RELEASE = 0.96;

/** Which branch is open in the editor. Bounded by the fork points. */
export const CHAPTERS = BRANCHES.map((branch, i) => ({
  from: i === 0 ? 0 : BRANCHES[i].fork,
  to: i === BRANCHES.length - 1 ? 1 : BRANCHES[i + 1].fork,
}));

/** TODO(content): illustrative figures. */
export const TESTS = [32, 39, 44, 48];

export function hrefFor(slug: string) {
  return `/software-development/${slug}`;
}
