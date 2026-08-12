"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { PhoneChrome } from "@/components/sections/service/visuals/chrome/PhoneChrome";
import { usePointerTilt } from "@/components/sections/service/visuals/usePointerTilt";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";

/**
 * A feed, running.
 *
 * The subject of the social page is the feed itself, so the picture is a phone
 * with posts moving through it rather than a diagram about posts. Engagement
 * counters tick in `live` mode — this is the one context where a drifting
 * number is honest, because a real feed's counters genuinely do drift.
 *
 * The scroll uses the same seamless trick as `Marquee`: two identical copies of
 * the card set on one track, animated by exactly -50%. At the loop point the
 * second copy sits precisely where the first began, so the seam is invisible
 * without measuring anything.
 */

const POSTS = [
  { handle: "@pixelportal", body: "Behind the rebrand — three weeks of type tests.", likes: 842, comments: 37 },
  { handle: "@pixelportal", body: "New case study: replatforming Northwind in 11 weeks.", likes: 1290, comments: 64 },
  { handle: "@pixelportal", body: "What we learned shipping 40 assets a month.", likes: 604, comments: 22 },
  { handle: "@pixelportal", body: "Hiring: senior motion designer, Gurgaon.", likes: 971, comments: 48 },
];

export function SocialFeed() {
  const { ref: playRef, playing } = useVisualPlayback<HTMLDivElement>();
  // Destructured rather than kept as one object: `react-hooks/refs` treats any
  // property read off a ref-carrying object as a ref access during render.
  const { ref: tiltRef, style, handlers } = usePointerTilt<HTMLDivElement>();

  return (
    <div
      ref={tiltRef}
      {...handlers}
      className="grid h-full grid-cols-12 items-center gap-6 px-6 py-6 lg:px-12"
      style={{ perspective: 1200 }}
    >
      <div ref={playRef} className="col-span-12 flex justify-center lg:col-span-5">
        <motion.div style={style}>
          <PhoneChrome className="h-64 w-62 lg:h-72 lg:w-64">
            {/* Track holds the set twice; -50% lands copy two on copy one. */}
            <motion.div
              className="flex flex-col gap-2.5 px-3 pt-1"
              animate={playing ? { y: ["0%", "-50%"] } : { y: "0%" }}
              transition={
                playing ? { duration: 16, repeat: Infinity, ease: "linear" } : undefined
              }
            >
              {[...POSTS, ...POSTS].map((post, i) => (
                <PostCard key={i} post={post} live={playing && i < POSTS.length} />
              ))}
            </motion.div>

            {/* Fade at the lower edge so posts leave the screen rather than
                being clipped mid-word. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white to-transparent"
            />
          </PhoneChrome>
        </motion.div>
      </div>

      <div className="col-span-12 lg:col-span-7">
        <ScheduleChip playing={playing} />
      </div>
    </div>
  );
}

function PostCard({
  post,
  live,
}: {
  post: (typeof POSTS)[number];
  live: boolean;
}) {
  return (
    <div className="border-hair rounded-card shrink-0 border bg-white p-3">
      <div className="flex items-center gap-2">
        <span className="bg-brand-100 size-6 shrink-0 rounded-full" />
        <span className="text-ink text-[0.6875rem] leading-none font-medium">{post.handle}</span>
      </div>
      <p className="text-ink-soft mt-2 text-[0.6875rem] leading-snug">{post.body}</p>
      <div className="text-muted mt-2.5 flex items-center gap-4 text-[0.625rem] leading-none tabular-nums">
        <span className="flex items-center gap-1">
          <Heart />
          {/* Only the first copy counts up. The duplicate is decoration, and
              two CountUps racing on the same figure looks like a glitch. */}
          {live ? <CountUp value={post.likes} live duration={1.4} /> : post.likes.toLocaleString("en-US")}
        </span>
        <span className="flex items-center gap-1">
          <Bubble />
          {post.comments}
        </span>
      </div>
    </div>
  );
}

/** The operational half of the service: posts do not appear by themselves. */
function ScheduleChip({ playing }: { playing: boolean }) {
  return (
    <div className="border-hair rounded-card border bg-white/80 p-4 backdrop-blur-sm">
      <p className="text-eyebrow text-muted uppercase">This week</p>
      <div className="mt-3.5 space-y-2">
        {["Mon · Carousel", "Wed · Reel", "Thu · Case study", "Sat · Community AMA"].map(
          (slot, i) => (
            <motion.div
              key={slot}
              className="flex items-center gap-2.5"
              animate={playing ? { opacity: [0.35, 1, 1, 0.35] } : { opacity: 1 }}
              transition={
                playing
                  ? { duration: 6, delay: i * 1.5, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
            >
              <span className="bg-brand-400 size-1.5 shrink-0 rounded-full" />
              <span className="text-ink-soft text-[0.8125rem] leading-none">{slot}</span>
            </motion.div>
          ),
        )}
      </div>
    </div>
  );
}

function Heart() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.5 12 20 12 20Z" />
    </svg>
  );
}

function Bubble() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M20 15a2 2 0 0 1-2 2H8l-4 3V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
    </svg>
  );
}
