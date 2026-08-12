"use client";

import { motion } from "motion/react";

import { CountUp } from "@/components/motion/CountUp";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Metric } from "@/types/content";

/**
 * A reporting surface, mid-refresh.
 *
 * Built in HTML rather than SVG because the numbers are the subject and they
 * need `CountUp` — and because a KPI row is genuinely a list of figures, not a
 * drawing. The counters run in `live` mode, which is the one place on the site
 * where a number is allowed to keep drifting after it settles: a dashboard
 * that freezes is a screenshot, and this is meant to read as a feed.
 *
 * Panels bob on staggered offsets so they never line up into a single pulse.
 */
export function KpiDashboard({ panels, kpis }: { panels: string[]; kpis: Metric[] }) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex h-full flex-col justify-center gap-7 px-6 py-8 lg:px-10">
      <div className="flex flex-wrap justify-center gap-3">
        {panels.slice(0, 4).map((panel, i) => (
          <motion.span
            key={panel}
            className="glass rounded-card text-ink-soft px-4 py-2.5 text-[0.8125rem] leading-none"
            animate={prefersReduced ? undefined : { y: [0, -7, 0] }}
            transition={
              prefersReduced
                ? undefined
                : { duration: 4.5 + i * 0.6, delay: i * 0.35, repeat: Infinity, ease: "easeInOut" }
            }
          >
            {panel}
          </motion.span>
        ))}
      </div>

      <motion.dl
        className="border-hair rounded-panel grid grid-cols-2 gap-y-7 border bg-white/80 px-6 py-7 backdrop-blur-sm lg:grid-cols-4"
        initial={prefersReduced ? undefined : { opacity: 0, y: 14 }}
        animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE.out }}
      >
        {kpis.slice(0, 4).map((kpi) => (
          <div key={kpi.label} className="text-center">
            <dd className="font-display text-brand-600 text-[clamp(1.5rem,3vw,2.125rem)] leading-none font-semibold tracking-tight tabular-nums">
              <CountUp
                value={kpi.value}
                prefix={kpi.prefix}
                suffix={kpi.suffix}
                // Ratios need the decimal place; whole counts read wrong with one.
                decimals={Number.isInteger(kpi.value) ? 0 : 2}
                live
              />
            </dd>
            <dt className="text-muted mt-2.5 text-[0.75rem] leading-snug">{kpi.label}</dt>
          </div>
        ))}
      </motion.dl>
    </div>
  );
}
