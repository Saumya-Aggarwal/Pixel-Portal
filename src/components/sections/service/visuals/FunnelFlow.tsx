"use client";

import { motion } from "motion/react";

import { useReducedMotion } from "@/lib/useReducedMotion";

const W = 880;
const H = 340;
const TOP = 34;
const STAGE_H = 44;
const GAP = 14;

/**
 * A narrowing funnel, one band per stage, with volume falling through it.
 *
 * Width is a linear taper from 78% of the frame down to 34%, so the shape
 * carries the same information as the labels: each stage keeps less than the
 * one above it. The tint deepens on the same ramp — the bottom band is the
 * most saturated because it is the one that matters.
 */
export function FunnelFlow({ stages, callouts = [] }: { stages: string[]; callouts?: string[] }) {
  const prefersReduced = useReducedMotion();
  const count = Math.max(stages.length, 2);

  const widthAt = (i: number) => {
    const from = W * 0.78;
    const to = W * 0.34;
    return from + ((to - from) * i) / (count - 1);
  };
  const yAt = (i: number) => TOP + i * (STAGE_H + GAP);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
      {stages.map((stage, i) => {
        const w = widthAt(i);
        const x = (W - w) / 2;
        const y = yAt(i);
        // 6% at the mouth to 20% at the tip, so the ramp is visible without
        // the top band disappearing into the page.
        const tint = 0.06 + (0.14 * i) / (count - 1);

        return (
          <g key={stage}>
            <rect
              x={x}
              y={y}
              width={w}
              height={STAGE_H}
              rx={10}
              fill="var(--color-brand-500)"
              fillOpacity={tint}
              stroke="var(--color-brand-300)"
              strokeWidth={1}
              strokeOpacity={0.6}
            />
            <text
              x={W / 2}
              y={y + STAGE_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={13}
              fontWeight={600}
              letterSpacing="0.08em"
              fill="var(--color-brand-900)"
              className="font-display uppercase"
            >
              {stage}
            </text>

            {/* Volume dropping into the next band. */}
            {!prefersReduced && i < count - 1 && (
              <motion.circle
                cx={W / 2}
                r={3}
                fill="var(--color-brand-600)"
                initial={{ cy: y + STAGE_H, opacity: 0 }}
                animate={{ cy: [y + STAGE_H, y + STAGE_H + GAP], opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.1,
                  delay: i * 0.28,
                  repeat: Infinity,
                  repeatDelay: 0.7,
                  ease: "easeIn",
                }}
              />
            )}
          </g>
        );
      })}

      {/* Callouts hang off alternating sides on short dotted leaders. */}
      {callouts.slice(0, 4).map((callout, i) => {
        const stageIndex = Math.min(i + 1, count - 1);
        const y = yAt(stageIndex) + STAGE_H / 2;
        const w = widthAt(stageIndex);
        const onLeft = i % 2 === 0;
        const edge = onLeft ? (W - w) / 2 : (W + w) / 2;
        const tip = onLeft ? edge - 34 : edge + 34;

        return (
          <g key={callout}>
            <line
              x1={edge}
              y1={y}
              x2={tip}
              y2={y}
              stroke="var(--color-brand-300)"
              strokeWidth={1}
              strokeDasharray="2 4"
            />
            <text
              x={onLeft ? tip - 8 : tip + 8}
              y={y}
              textAnchor={onLeft ? "end" : "start"}
              dominantBaseline="central"
              fontSize={12}
              letterSpacing="0.1em"
              fill="var(--color-muted)"
              className="font-display uppercase"
            >
              {callout}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
