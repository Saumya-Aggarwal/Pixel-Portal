import type { SequenceStep } from "@/components/sections/service/visuals/useSequence";

/**
 * Shared session, copy and figures for AppShell.
 *
 * The operator's session is the same on both canvases — open the access log,
 * open the profile, change the role — so the beats, the reaction delays and the
 * table live here once. Only the coordinates each stop resolves to differ, and
 * coordinates are the one thing that cannot be shared: `STOP` means something
 * different on a 720-wide desktop shell than on a 320-wide phone one.
 */

export type StopName = "idle" | "logs" | "profile" | "role";

export interface Beat extends SequenceStep {
  /** Where the pointer travels for this step. */
  stop: StopName;
  /** Whether the arrow is on screen during it. */
  shown?: boolean;
  /** It clicks the instant it arrives. */
  click?: boolean;
  /** The overlay this stop opens, held for the dwell. */
  panel?: "logs" | "profile";
  /** The click on this step is the one that changes the role. */
  commit?: boolean;
  /** Steps after the commit, which inherit the changed view. */
  editor?: boolean;
}

export const SESSION: readonly Beat[] = [
  // The shell sits as found. Nothing has happened yet, and nothing should:
  // a loop that opens mid-gesture reads as a clip starting late.
  { stop: "idle", travel: 0, dwell: 0.9 },
  // The arrow arrives at rest before it moves anywhere.
  { stop: "idle", travel: 0.4, dwell: 0.4, shown: true },
  {
    stop: "logs",
    travel: 0.85,
    dwell: 1.5,
    shown: true,
    click: true,
    panel: "logs",
  },
  {
    stop: "profile",
    travel: 0.75,
    dwell: 1.5,
    shown: true,
    click: true,
    panel: "profile",
  },
  {
    stop: "role",
    travel: 0.9,
    dwell: 2.4,
    shown: true,
    click: true,
    commit: true,
  },
  // It leaves. The view it changed stays changed while it goes — the operator
  // moving on is not an undo.
  { stop: "idle", travel: 0.8, dwell: 0.4, shown: true, editor: true },
  { stop: "idle", travel: 0.35, dwell: 0.9, editor: true },
  // Off screen, the table repopulates and the loop is ready to run again.
  { stop: "idle", travel: 0, dwell: 1.0 },
];

/** What the shell looks like with no one operating it: the session's outcome. */
export const PARKED: Beat = {
  stop: "idle",
  travel: 0,
  dwell: 0,
  editor: true,
};

/**
 * Reaction delays, in seconds, measured from the moment the pointer arrives.
 *
 * These are small on purpose. They are not synchronisation — the state change
 * already guarantees the order — they are the beat that makes a consequence
 * read as a consequence rather than as a coincidence.
 */
export const REACT = {
  /** Hover tint. Fast, because a hover is not an event. */
  hover: 0.12,
  /** The click ripple. */
  click: 0.05,
  /** An overlay answering the click. */
  open: 0.14,
  /** A pressed control's depress and release. */
  press: 0.4,
  /** The confirmation chip, which waits for the button to come back up. */
  confirm: 0.3,
};

export const NAV = [
  "Dashboard",
  "Users",
  "Roles",
  "Settings",
  "Reports",
  "Access Logs",
  "Integrations",
];
export const LOGS_INDEX = 5;

/**
 * The phone's tab bar.
 *
 * Seven rail items do not become seven tabs — a phone app has four or five and
 * a More. These are the four the session needs plus the one it starts on, which
 * is also an honest account of the same product at another width rather than a
 * truncated list.
 */
export const TABS = ["Dashboard", "Users", "Logs", "Settings"];
export const TABS_LOGS_INDEX = 2;
export const TABS_ACTIVE_INDEX = 1;

export const COLUMNS = ["ID", "Name", "Role", "Last Active", "Status"];
/** "Last Active" needs 59px in a 55px column at phone width; "Last seen" fits. */
export const PHONE_COLUMNS = ["ID", "Name", "Role", "Last seen", "Status"];

export const ROWS = [
  ["USR-01", "A. Smith", "Admin", "Today", "Active"],
  ["USR-02", "J. Doe", "Editor", "Yesterday", "Active"],
  ["USR-03", "S. Lee", "Editor", "Oct 12", "Active"],
  ["USR-04", "M. Ray", "Viewer", "Oct 10", "Locked"],
  ["USR-05", "K. Patel", "Viewer", "Oct 9", "Active"],
  ["USR-06", "D. Osei", "Admin", "Oct 8", "Active"],
  ["USR-07", "L. Chen", "Editor", "Oct 5", "Active"],
];

export const LOG_ENTRIES = [
  ["A. Smith", "signed in", "2m ago"],
  ["J. Doe", "exported CSV", "1h ago"],
  ["M. Ray", "failed login", "3h ago"],
];

/** The rows an Editor cannot see. Everything below each one closes the gap. */
export const ADMIN_ROWS = [0, 5];
export const isAdmin = (i: number) => ADMIN_ROWS.includes(i);

/**
 * One row of travel is the pitch over the row's own height, so the shift is a
 * percentage of the moving element and stays correct at any width. Both
 * canvases have their own pitch, hence the factory.
 */
export const makeShift = (pitch: number, height: number) => (i: number) =>
  `-${(ADMIN_ROWS.filter((a) => a < i).length * pitch * 100) / height}%`;

/**
 * The consequence of the role change, as a cascade behind the confirmation:
 * the two rows an Editor cannot see fade first, then the rest close the gap.
 * On the way back both return together — a reset is not a performance.
 */
export const DROP = (editor: boolean) => ({
  duration: 0.4,
  delay: editor ? 0.45 : 0,
  ease: "easeInOut" as const,
});
export const CLOSE = (editor: boolean) => ({
  duration: 0.5,
  delay: editor ? 0.75 : 0,
  ease: "easeInOut" as const,
});

/** Label crossfades, timed to land as the selector releases. */
export const SWAP = (editor: boolean) => ({
  duration: 0.25,
  delay: editor ? REACT.press * 0.75 : 0,
  ease: "easeOut" as const,
});
