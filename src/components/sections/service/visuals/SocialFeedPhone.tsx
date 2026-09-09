"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { CalloutChip } from "@/components/sections/service/visuals/chrome/Callout";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  CALENDAR,
  CALENDAR_TITLE,
  FIRING_SLOT,
  LOOP,
  POSTS,
  QUEUE_BARS,
  QUEUE_PEAK,
  QUEUE_TITLE,
  SLA,
  at,
} from "@/components/sections/service/visuals/socialFeedShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * Phone stage of the social-media-handling depiction.
 *
 * The 960x640 drawing is an operation on the left feeding a phone on the right.
 * Neither half survives the trip: at 327px the calendar showed one of its four
 * rows, every caption was cut mid-word, and the feed's cards sat on top of the
 * handle they belonged to. It also contains a phone, which is a picture worth
 * drawing on a laptop and a slightly absurd one to draw *on* a phone.
 *
 * **So the feed becomes a deck.** The published posts are a pile of cards, the
 * newest in front and fully legible, the older ones receding upward behind it
 * with only their top row — timestamp and engagement — showing. The whole feed
 * costs one card's height plus three peeks instead of three full cards, which
 * is what buys the operation enough room to still be in the picture. And a pile
 * that grows, its engagement figures ascending down toward the front, is the
 * word the page's own heading uses: most brands post, very few *compound*.
 *
 * **The post is dealt, not piped.** Every other phone stage in this set moves
 * its payload as a dot along a dashed leader. Here the card itself flies out of
 * the calendar row that scheduled it and lands on the pile while the history
 * shifts back to make room — so this drawing has no SVG layer at all. That is
 * partly to keep it from reading as the fourth diagram with a dotted line in
 * it, and partly because "the thing that was planned is the thing that shipped"
 * is said more directly by moving the post than by moving a token standing in
 * for it.
 *
 * **What is kept.** The calendar, the queue and the response SLA are all still
 * here, because the page's argument is that the feed is the *output* of an
 * operation, and a drawing of the feed alone makes the claim the copy is
 * arguing against. They are one panel rather than two: at 320 units wide the
 * distinction between two adjacent boxes is chrome, not information.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 592);

/**
 * The operation's panel, measured at the narrowest viewport rather than the
 * design one.
 *
 * `ts`'s 10px floor means this panel's contents grow, in canvas units, as the
 * canvas shrinks: at a 375 viewport a `ts(11)` row is 11 units, at 320 it is
 * 13.2, and the four calendar rows plus the queue heading and its chip put on
 * fourteen units between the two. Sized for 375 the panel was correct on the
 * phone it was drawn for and cut the bars off on a smaller one.
 */
const OPS = { x: 20, y: 20, w: 320, h: 238 };
const PAD = 14;

const CARD = { x: 30, w: 300, h: 190 };

/**
 * How far back each card in the pile sits.
 *
 * It has to clear the top padding and header row of the card behind — 12 and 18
 * — or the peek shows a slice of a row rather than a row. Measured rather than
 * assumed: at this canvas a `ts(11)` label is floored to 10 CSS pixels, which is
 * 11 units back, so the header is 18 and not the 16 its nominal sizes suggest.
 */
const PITCH = 32;

/** Four resting places. The front one is where a published post ends up. */
const SLOTS = [0, 1, 2, 3].map((i) => 282 + i * PITCH);

/**
 * Card travel, as a percentage of a card's own height.
 *
 * A `y` percentage resolves against the moving element, not its parent, and
 * every card here is the same height — so one divisor covers the pile's shift
 * back, the new post's flight in and its recession at the loop's end.
 */
const pct = (units: number) => `${((units / CARD.h) * 100).toFixed(3)}%`;

const SHIFT = pct(-PITCH);
/** Far enough up to start inside the panel's lower edge, so it leaves the plan. */
const ENTER = pct(-116);
const EXIT = pct(-24);

const HISTORY = POSTS.slice(0, -1);
const FRESH = POSTS[POSTS.length - 1];

/**
 * One easing per segment, never one for the sequence.
 *
 * A bare `ease` alongside `times` does not curve each hop between keyframes —
 * Motion hands it to WAAPI as the easing of the whole effect, so the entire
 * loop's clock is remapped. With expo-out that put the eight-second storyboard
 * through in its first two and a half: the post landed before the calendar row
 * had finished lighting, then the drawing sat still for five seconds. The
 * offsets were right the whole time; the clock reading them was not.
 *
 * An array of one easing per transition leaves the effect linear and curves the
 * hops instead, which is what was meant. Holds take `linear` because a hold
 * between two identical values has no curve to have.
 */
const HOLD = "linear";

export function SocialFeedPhone() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="md" className="top-[8%] left-[10%]" />

      <FloatPanel
        playing={playing}
        float={{ amplitude: 4, period: 11, phase: 0.2 }}
        className="absolute overflow-hidden"
        style={{
          left: px(OPS.x),
          top: py(OPS.y),
          width: px(OPS.w),
          height: py(OPS.h),
          padding: cq(PAD),
          borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
        }}
      >
        <p className="text-ink font-medium" style={{ fontSize: ts(12) }}>
          {CALENDAR_TITLE}
        </p>

        <span style={{ display: "grid", gap: cq(5), marginTop: cq(12) }}>
          {CALENDAR.map(([day, slot], i) => (
            <Slot key={day} day={day} slot={slot} index={i} playing={playing} />
          ))}
        </span>

        <span
          className="border-hair block border-t"
          style={{ marginTop: cq(11) }}
        />

        <span
          className="flex items-center justify-between"
          style={{ marginTop: cq(11), gap: cq(8) }}
        >
          <span className="text-ink font-medium" style={{ fontSize: ts(11) }}>
            {QUEUE_TITLE}
          </span>
          <CalloutChip style={{ fontSize: ts(10) }}>{SLA}</CalloutChip>
        </span>

        <span
          className="flex items-end"
          style={{ gap: cq(6), marginTop: cq(6), height: cq(34) }}
        >
          {QUEUE_BARS.map((bar, i) => (
            <motion.span
              key={i}
              className="bg-brand-200 flex-1 rounded-t-sm"
              style={{ height: `${((bar / QUEUE_PEAK) * 100).toFixed(1)}%` }}
              initial={false}
              animate={playing ? { opacity: [0.55, 1, 0.55] } : { opacity: 1 }}
              transition={
                playing
                  ? {
                      duration: 4,
                      delay: i * 0.22,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : undefined
              }
            />
          ))}
        </span>
      </FloatPanel>

      {/*
        The pile. Hand-rolled rather than FloatPanel because these must not bob:
        four independently drifting cards stacked 32 units apart stop looking
        like one pile inside a second. The plan floats, the record does not.
      */}
      {HISTORY.map((post, i) => (
        <motion.div
          key={post.caption}
          className="border-hair absolute overflow-hidden border shadow-(--shadow-float)"
          style={{
            left: px(CARD.x),
            top: py(SLOTS[i + 1]),
            width: px(CARD.w),
            height: py(CARD.h),
            padding: cq(12),
            borderRadius: "clamp(0.5rem, 3.333cqw, 1rem)",
            backgroundColor: "var(--color-paper)",
            zIndex: 10 + i,
          }}
          initial={false}
          animate={
            playing ? { y: ["0%", "0%", SHIFT, SHIFT, "0%"] } : { y: SHIFT }
          }
          transition={
            playing
              ? {
                  duration: LOOP,
                  times: [0, at(1.6), at(2.4), at(7.5), 1],
                  repeat: Infinity,
                  ease: [HOLD, EASE.out, HOLD, EASE.inOut],
                }
              : undefined
          }
        >
          <Card post={post} />
        </motion.div>
      ))}

      <motion.div
        className="border-brand-200 absolute overflow-hidden border bg-white"
        style={{
          left: px(CARD.x),
          top: py(SLOTS[SLOTS.length - 1]),
          width: px(CARD.w),
          height: py(CARD.h),
          padding: cq(12),
          borderRadius: "clamp(0.5rem, 3.333cqw, 1rem)",
          boxShadow: "var(--shadow-float-hover)",
          zIndex: 20,
        }}
        initial={false}
        animate={
          playing
            ? {
                y: [ENTER, ENTER, "0%", "0%", EXIT, EXIT],
                opacity: [0, 0, 1, 1, 0, 0],
                scale: [0.92, 0.92, 1, 1, 0.98, 0.98],
              }
            : { y: "0%", opacity: 1, scale: 1 }
        }
        transition={
          playing
            ? {
                duration: LOOP,
                times: [0, at(1.4), at(2.4), at(7.4), at(7.9), 1],
                repeat: Infinity,
                ease: [HOLD, EASE.out, HOLD, EASE.in, HOLD],
              }
            : undefined
        }
      >
        <Card post={FRESH} fresh playing={playing} />
      </motion.div>
    </div>
  );
}

/**
 * One scheduled slot.
 *
 * The three not publishing this loop breathe on the desktop's stagger. The one
 * that is holds at full strength across the flight and its marker swells as the
 * post leaves, which is the only thing tying the card in the air to the row it
 * came out of — there is no leader here to do that job.
 */
function Slot({
  day,
  slot,
  index,
  playing,
}: {
  day: string;
  slot: string;
  index: number;
  playing: boolean;
}) {
  const firing = index === FIRING_SLOT;

  return (
    <motion.span
      className="flex items-center"
      style={{ gap: cq(8), height: cq(14) }}
      initial={false}
      animate={
        !playing
          ? { opacity: 1 }
          : firing
            ? { opacity: [0.45, 0.45, 1, 1, 0.45, 0.45] }
            : { opacity: [0.45, 1, 0.45] }
      }
      transition={
        !playing
          ? undefined
          : firing
            ? {
                duration: LOOP,
                times: [0, at(0.9), at(1.4), at(3.4), at(4.2), 1],
                repeat: Infinity,
                ease: [HOLD, "easeOut", HOLD, "easeInOut", HOLD],
              }
            : {
                duration: LOOP,
                delay: index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }
      }
    >
      <span
        className="text-muted shrink-0 font-medium"
        style={{ fontSize: ts(11), width: cq(30) }}
      >
        {day}
      </span>
      <motion.span
        className="bg-brand-400 shrink-0 rounded-full"
        style={{ width: cq(5), height: cq(5) }}
        initial={false}
        animate={
          playing && firing ? { scale: [1, 1, 1.8, 1, 1] } : { scale: 1 }
        }
        transition={
          playing && firing
            ? {
                duration: LOOP,
                times: [0, at(1.1), at(1.5), at(2.1), 1],
                repeat: Infinity,
                ease: [HOLD, "easeOut", "easeInOut", HOLD],
              }
            : undefined
        }
      />
      <span className="text-ink-soft truncate" style={{ fontSize: ts(11) }}>
        {slot}
      </span>
    </motion.span>
  );
}

/**
 * A post.
 *
 * The header carries the timestamp and the engagement figure, and it is first
 * rather than last for one reason: on a buried card it is the only part anyone
 * sees. The desktop puts the image first and the metrics at the foot, which is
 * what a real post looks like and what a card that is fully visible can afford.
 */
function Card({
  post,
  fresh = false,
  playing = false,
}: {
  post: (typeof POSTS)[number];
  /** The post published during this loop. Its metric climbs; the others hold. */
  fresh?: boolean;
  playing?: boolean;
}) {
  return (
    <>
      <span
        className="flex items-baseline justify-between"
        style={{ gap: cq(8), height: cq(18) }}
      >
        <span
          className={fresh ? "text-ink font-medium" : "text-muted"}
          style={{ fontSize: ts(11) }}
        >
          {post.age}
        </span>
        <span
          className={
            fresh
              ? "text-brand-600 font-medium tabular-nums"
              : "text-muted tabular-nums"
          }
          style={{ fontSize: ts(11) }}
        >
          {/* TODO(content): illustrative engagement figures. */}
          {fresh && playing ? (
            <>
              Eng +
              <CountUp
                value={post.lift}
                from={0}
                decimals={1}
                /* Expo-out lands the card at about 1.5s rather than at the
                   2.4s its keyframe nominally sits at, and a post that is on
                   the pile reading "Eng +0.0%" looks broken rather than
                   pending. The climb starts as it arrives. */
                delay={1.7}
                duration={1.4}
                suffix="%"
              />
            </>
          ) : (
            `Eng +${post.lift.toFixed(1)}%`
          )}
        </span>
      </span>

      <span
        className={
          fresh
            ? "bg-brand-50 block w-full rounded-md"
            : "bg-brand-50/60 block w-full rounded-md"
        }
        style={{ height: cq(86), marginTop: cq(10) }}
      />

      <span
        className="text-ink-soft line-clamp-2 block leading-snug"
        style={{ fontSize: ts(12), marginTop: cq(10) }}
      >
        {post.caption}
      </span>
    </>
  );
}
