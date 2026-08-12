"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";

import { cn } from "@/lib/cn";

interface Word {
  text: string;
  /** Renders the word in brand green with a soft glow. */
  glow?: boolean;
  /** Plain-colour suffix glued to the word (e.g. a period that should not glow). */
  trailing?: string;
}

interface CascadeTextProps {
  words: Word[];
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Headline entrance that cascades word by word rather than fading as one
 * block or masking whole lines (that's `TextReveal`, used elsewhere).
 *
 * Each word sits in its own `overflow-hidden` box so it can slide up from
 * behind a clean edge; a spring (not an eased tween) gives the cascade its
 * bounce. `glow` words stay a plain, non-animated colour underneath the
 * motion span's own — attaching the glow to the same element that moves
 * means the text-shadow never has to re-anchor mid-animation.
 */
export function CascadeText({
  words,
  as: Tag = "h1",
  className,
  delay = 0,
  stagger = 0.07,
}: CascadeTextProps) {
  const prefersReduced = useReducedMotion();

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <span key={index}>
          <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span
              className={cn("inline-block", word.glow && "text-[#27AE60]")}
              initial={prefersReduced ? false : { y: "112%", opacity: 0 }}
              animate={prefersReduced ? false : { y: "0%", opacity: 1 }}
              transition={{
                delay: delay + index * stagger,
                type: "spring",
                stiffness: 260,
                damping: 24,
                mass: 0.9,
              }}
            >
              {word.text}
              {word.trailing && <span className="text-ink">{word.trailing}</span>}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
