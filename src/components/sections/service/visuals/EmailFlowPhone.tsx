"use client";

import { motion } from "motion/react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  BRANCHES,
  CTA,
  EnvelopeGlyph,
  FROM,
  LOOP,
  PREHEADER,
  STATS,
  SUBJECT,
  at,
} from "@/components/sections/service/visuals/emailFlowShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * Phone stage of the email-marketing depiction.
 *
 * The 960x640 drawing sets a mailer beside two follow-ups and a figures panel.
 * At 327px the mailer kept its header and lost everything that made it a
 * mailer — hero, body and call to action all fell outside the panel — the
 * condition chips came to rest on top of the follow-ups they label, and the
 * figures ran together as "DeliveredOpenedClicked".
 *
 * **The mailer takes the full column, and that is an upgrade rather than a
 * concession.** On the wide canvas it is 340 units of 960, a thumbnail of an
 * email; here it is 320 of 360, which at this viewport is an email at very
 * nearly the width one is actually read at. A phone is where mail gets opened,
 * so this is the one drawing in the set whose subject gets *more* honest as the
 * canvas narrows.
 *
 * **The branch survives as a branch.** Nothing else in this set forks, and the
 * fork is the argument: an automation is not a decision tree, it is a sequence
 * of messages, and which message goes next depends on what the last one did. So
 * a stem drops out of the mailer, runs down a spine in the left gutter, and
 * takes off twice — once into the follow-up that goes when someone opens, once
 * into the resend that goes when nobody does. The send travels it and turns
 * into the first branch, which lights; the other stays dim, because on any one
 * pass through an automation only one of them happens.
 *
 * The condition chips move inside their cards. On the wide canvas they sit on
 * the leaders, which is where an annotation belongs when there is room for one;
 * in a 360 column the gutter is 24 units wide and a chip in it lands on the
 * card it is meant to be labelling — which is exactly what it did.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 714);

/**
 * Sized at the narrow end, not the design one.
 *
 * `ts` floors at 10px, so this panel's type stands taller in canvas units the
 * smaller the canvas gets: the mailer needs 319 units at a 320 viewport against
 * 309 at 430, and a follow-up needs 107 against 90. Sized for 375 both ate
 * their own last line on a smaller phone.
 */
const MAILER = { x: 20, y: 20, w: 320, h: 324 };

/** The spine runs here, in the gutter the branch cards leave to its left. */
const SPINE_X = 30;
const BRANCH = { x: 44, w: 296, h: 110 };
const BRANCH_Y = [368, 498];
const STATS_BOX = { x: 20, y: 628, w: 320, h: 66 };

const mid = (i: number) => BRANCH_Y[i] + BRANCH.h / 2;

/**
 * The stem, the spine and the two takeoffs.
 *
 * Drawn as one path because it is one connector: a fork that comes apart into
 * separate lines stops reading as a fork and starts reading as three unrelated
 * rules that happen to touch.
 */
const FORK = [
  `M ${MAILER.x + MAILER.w / 2} ${MAILER.y + MAILER.h}`,
  `L ${MAILER.x + MAILER.w / 2} ${MAILER.y + MAILER.h + 12}`,
  `L ${SPINE_X} ${MAILER.y + MAILER.h + 12}`,
  `L ${SPINE_X} ${mid(1)}`,
  `M ${SPINE_X} ${mid(0)} L ${BRANCH.x} ${mid(0)}`,
  `M ${SPINE_X} ${mid(1)} L ${BRANCH.x} ${mid(1)}`,
].join(" ");

/** The send's route, ending on the branch that actually fires. */
const SEND = {
  cx: [
    MAILER.x + MAILER.w / 2,
    MAILER.x + MAILER.w / 2,
    SPINE_X,
    SPINE_X,
    BRANCH.x,
    BRANCH.x,
  ],
  cy: [
    MAILER.y + MAILER.h,
    MAILER.y + MAILER.h + 12,
    MAILER.y + MAILER.h + 12,
    mid(0),
    mid(0),
    mid(0),
  ],
  times: [0, at(0.3), at(0.6), at(1.0), at(1.5), 1],
};

/** When the branch that fired lights up. */
const FIRES = 1.5;
/** How long the drawing then holds before the loop resets. */
const RESETS = 8.2;

/**
 * One easing per segment, never one for the sequence.
 *
 * A bare `ease` beside `times` is handed to WAAPI as the easing of the whole
 * effect, so the loop's own clock gets remapped and every offset in the
 * storyboard lands somewhere else. Holds take `linear` because a hold between
 * two identical values has no curve to have.
 */
const HOLD = "linear";

export function EmailFlowPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="lg" className="top-[6%] left-[14%]" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <path
          d={FORK}
          fill="none"
          stroke="var(--color-brand-200)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        <motion.circle
          r={3.5}
          fill="var(--color-brand-500)"
          initial={false}
          animate={
            playing
              ? {
                  cx: SEND.cx,
                  cy: SEND.cy,
                  opacity: [0, 1, 1, 1, 0, 0],
                }
              : { cx: BRANCH.x, cy: mid(0), opacity: 0 }
          }
          transition={
            playing
              ? {
                  duration: LOOP,
                  times: SEND.times,
                  repeat: Infinity,
                  ease: ["easeInOut", "linear", "linear", "easeInOut", HOLD],
                  opacity: {
                    duration: LOOP,
                    times: [0, at(0.15), at(1.2), at(1.5), at(1.7), 1],
                    repeat: Infinity,
                    ease: ["easeOut", HOLD, HOLD, "easeIn", HOLD],
                  },
                }
              : undefined
          }
        />
      </svg>

      {/* ---- The mailer, at very nearly the width mail is read at ---- */}
      <FloatPanel
        playing={playing}
        focal
        interactive
        float={{ amplitude: 3, period: 15, phase: 0 }}
        className="absolute overflow-hidden"
        style={{
          left: px(MAILER.x),
          top: py(MAILER.y),
          width: px(MAILER.w),
          height: py(MAILER.h),
          borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
          zIndex: 30,
        }}
      >
        <span
          className="border-hair block border-b"
          style={{ padding: cq(16) }}
        >
          <span className="text-muted block" style={{ fontSize: ts(10) }}>
            {FROM}
          </span>
          <span
            className="text-ink block font-medium"
            style={{ fontSize: ts(14), marginTop: cq(7) }}
          >
            {SUBJECT}
          </span>
          <span
            className="text-muted block truncate"
            style={{ fontSize: ts(11), marginTop: cq(5) }}
          >
            {PREHEADER}
          </span>
        </span>

        <span className="block" style={{ padding: cq(16) }}>
          <span
            className="bg-brand-50 flex flex-col justify-center rounded-lg"
            style={{ height: cq(84), padding: cq(14) }}
          >
            <span
              className="bg-brand-300 block rounded-full"
              style={{ height: cq(8), width: "62%" }}
            />
            <span
              className="bg-brand-200 block rounded-full"
              style={{ height: cq(6), width: "42%", marginTop: cq(7) }}
            />
          </span>

          <span
            style={{ display: "grid", gap: cq(7), marginTop: cq(14) }}
            aria-hidden
          >
            {["100%", "88%", "64%"].map((width) => (
              <span
                key={width}
                className="bg-hair block rounded-full"
                style={{ height: cq(5), width }}
              />
            ))}
          </span>

          <span
            className="bg-brand-600 flex items-center justify-center rounded-full"
            style={{ height: cq(32), marginTop: cq(16) }}
          >
            <span
              className="font-medium text-white"
              style={{ fontSize: ts(11) }}
            >
              {CTA}
            </span>
          </span>
        </span>
      </FloatPanel>

      {/* ---- The follow-ups. Each branch is another message, not a label ---- */}
      {BRANCHES.map((branch, i) => (
        <Followup key={branch.id} branch={branch} index={i} playing={playing} />
      ))}

      {/* ---- What the channel is judged on ---- */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 3, period: 17, phase: 0.6 }}
        className="absolute flex items-center"
        style={{
          left: px(STATS_BOX.x),
          top: py(STATS_BOX.y),
          width: px(STATS_BOX.w),
          height: py(STATS_BOX.h),
          padding: `0 ${cq(16)}`,
          borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
        }}
      >
        {STATS.map(([label, value], i) => (
          <span
            key={label}
            className={i === 0 ? "flex-1" : "border-hair flex-1 border-l"}
            style={{
              display: "grid",
              paddingLeft: i === 0 ? undefined : cq(12),
            }}
          >
            <span
              className={
                i === 0
                  ? "font-display text-ink block leading-none font-semibold tabular-nums"
                  : "font-display text-brand-600 block leading-none font-semibold tabular-nums"
              }
              style={{ fontSize: ts(18) }}
            >
              {value}
            </span>
            <span
              className="text-muted block"
              style={{ fontSize: ts(10), marginTop: cq(6) }}
            >
              {label}
            </span>
          </span>
        ))}
      </FloatPanel>
    </div>
  );
}

/**
 * One follow-up message.
 *
 * The live one is what went out on this pass and it arrives with the send; the
 * other is the message that would have gone if the first had been ignored, and
 * it stays dim because on any one pass through an automation only one of the
 * two happens. Drawing both at full strength would make this a menu rather than
 * a branch.
 */
function Followup({
  branch,
  index,
  playing,
}: {
  branch: (typeof BRANCHES)[number];
  index: number;
  playing: boolean;
}) {
  const live = branch.live;

  return (
    <motion.div
      className="border-hair absolute overflow-hidden border bg-white shadow-(--shadow-float)"
      style={{
        left: px(BRANCH.x),
        top: py(BRANCH_Y[index]),
        width: px(BRANCH.w),
        height: py(BRANCH.h),
        padding: cq(10),
        borderRadius: "clamp(0.5rem, 3.333cqw, 1rem)",
        borderColor: live ? "var(--color-brand-300)" : "var(--color-hair)",
        zIndex: 20,
      }}
      initial={false}
      animate={
        playing && live
          ? { opacity: [0.45, 0.45, 1, 1, 0.45], y: [5, 5, 0, 0, 5] }
          : { opacity: live ? 1 : 0.6, y: 0 }
      }
      transition={
        playing && live
          ? {
              duration: LOOP,
              times: [0, at(FIRES - 0.3), at(FIRES + 0.4), at(RESETS), 1],
              repeat: Infinity,
              ease: [HOLD, EASE.out, HOLD, EASE.inOut],
            }
          : undefined
      }
    >
      <span className="flex items-center" style={{ gap: cq(10) }}>
        <span
          className={
            live
              ? "bg-brand-50 grid shrink-0 place-items-center rounded-lg"
              : "bg-paper grid shrink-0 place-items-center rounded-lg"
          }
          style={{ width: cq(28), height: cq(28) }}
        >
          <EnvelopeGlyph live={live} size={cq(15)} />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={
              live
                ? "border-brand-200 text-brand-700 inline-block rounded-full border font-semibold tracking-[0.08em] uppercase"
                : "border-hair text-muted inline-block rounded-full border font-semibold tracking-[0.08em] uppercase"
            }
            style={{ fontSize: ts(9), padding: `${cq(2)} ${cq(7)}` }}
          >
            {branch.chip}
          </span>
          <span
            className="text-ink block truncate font-medium"
            style={{ fontSize: ts(12), marginTop: cq(5) }}
          >
            {branch.subject}
          </span>
          <span
            className="text-muted block truncate"
            style={{ fontSize: ts(10), marginTop: cq(3) }}
          >
            {branch.preheader}
          </span>
        </span>
      </span>
    </motion.div>
  );
}
