"use client";

import { motion } from "motion/react";

import { useReducedMotion } from "@/lib/useReducedMotion";
import type { VisualNode } from "@/types/content";

const W = 880;
const H = 340;
const HUB_X = 440;
const HUB_Y = H / 2;
const CHIP_W = 244;
const CHIP_H = 42;

/** Evenly distributes n chips down the frame, centring a lone one. */
function yFor(index: number, count: number) {
  const top = 44;
  const bottom = H - 44 - CHIP_H;
  if (count <= 1) return (top + bottom) / 2;
  return top + (index * (bottom - top)) / (count - 1);
}

/**
 * Two populations joined through a hub.
 *
 * Every left node connects to the centre and the centre to every right node,
 * rather than each left node to each right node. Nine beams instead of twenty
 * keeps the picture readable — and it is the more honest diagram, since the
 * whole proposition is that the middle is where the work happens.
 *
 * Drawn entirely in SVG, including the labels, so nothing has to be measured
 * at runtime to make a beam land on the edge of a chip.
 */
export function BeamNetwork({ left, right }: { left: VisualNode[]; right: VisualNode[] }) {
  const prefersReduced = useReducedMotion();

  const leftY = left.map((_, i) => yFor(i, left.length) + CHIP_H / 2);
  const rightY = right.map((_, i) => yFor(i, right.length) + CHIP_H / 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
      {/* Beams sit under the chips so they appear to enter behind the edge. */}
      {leftY.map((y, i) => (
        <Beam key={`l${i}`} d={`M 268 ${y} C 350 ${y}, 370 ${HUB_Y}, ${HUB_X - 34} ${HUB_Y}`} delay={i * 0.22} still={prefersReduced} />
      ))}
      {rightY.map((y, i) => (
        <Beam key={`r${i}`} d={`M ${HUB_X + 34} ${HUB_Y} C ${HUB_X + 110} ${HUB_Y}, 530 ${y}, 612 ${y}`} delay={0.5 + i * 0.22} still={prefersReduced} />
      ))}

      {left.map((node, i) => (
        <Chip key={node.label} node={node} x={16} y={yFor(i, left.length)} align="left" />
      ))}
      {right.map((node, i) => (
        <Chip key={node.label} node={node} x={W - 16 - CHIP_W} y={yFor(i, right.length)} align="right" />
      ))}

      <Hub still={prefersReduced} />
    </svg>
  );
}

/**
 * A single connection.
 *
 * The flow is a dash pattern sliding along a static stroke, not a dot tweened
 * down a path — one animated attribute per beam instead of a motion element
 * per particle, and it stays continuous rather than restarting each cycle.
 */
function Beam({ d, delay, still }: { d: string; delay: number; still: boolean }) {
  return (
    <g>
      <path d={d} fill="none" stroke="var(--color-hair)" strokeWidth={1.5} />
      {!still && (
        <motion.path
          d={d}
          fill="none"
          stroke="var(--color-brand-500)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="4 26"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -60 }}
          transition={{ duration: 2.4, delay, repeat: Infinity, ease: "linear" }}
        />
      )}
    </g>
  );
}

function Chip({
  node,
  x,
  y,
  align,
}: {
  node: VisualNode;
  x: number;
  y: number;
  align: "left" | "right";
}) {
  const padding = 16;
  const labelX = align === "left" ? x + padding : x + CHIP_W - padding;
  const anchor = align === "left" ? "start" : "end";
  const valueX = align === "left" ? x + CHIP_W - padding : x + padding;
  const valueAnchor = align === "left" ? "end" : "start";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={CHIP_W}
        height={CHIP_H}
        rx={21}
        fill="white"
        stroke="var(--color-hair)"
        strokeWidth={1}
      />
      <text
        x={labelX}
        y={y + CHIP_H / 2}
        textAnchor={anchor}
        dominantBaseline="central"
        fontSize={14}
        fill="var(--color-ink)"
        className="font-sans"
      >
        {node.label}
      </text>
      {node.value && (
        <text
          x={valueX}
          y={y + CHIP_H / 2}
          textAnchor={valueAnchor}
          dominantBaseline="central"
          fontSize={13}
          fontWeight={600}
          fill="var(--color-brand-700)"
          className="font-display tabular-nums"
        >
          {node.value}
        </text>
      )}
    </g>
  );
}

/** The centre. Breathes slowly so the diagram never looks frozen. */
function Hub({ still }: { still: boolean }) {
  return (
    <g>
      {!still && (
        <motion.circle
          cx={HUB_X}
          cy={HUB_Y}
          r={34}
          fill="none"
          stroke="var(--color-brand-400)"
          strokeWidth={1}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: `${HUB_X}px ${HUB_Y}px` }}
        />
      )}
      <circle cx={HUB_X} cy={HUB_Y} r={34} fill="var(--color-brand-50)" />
      <circle cx={HUB_X} cy={HUB_Y} r={34} fill="none" stroke="var(--color-brand-300)" strokeWidth={1} />
      <circle cx={HUB_X} cy={HUB_Y} r={11} fill="var(--color-brand-600)" />
    </g>
  );
}
