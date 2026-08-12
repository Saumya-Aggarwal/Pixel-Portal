"use client";

import { motion } from "motion/react";

import { BrowserChrome } from "@/components/sections/service/visuals/chrome/BrowserChrome";
import { usePointerTilt } from "@/components/sections/service/visuals/usePointerTilt";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * A corporate site, assembling itself.
 *
 * Blocks arrive top to bottom — nav, hero, card row, footer — hold, and reset.
 * The subject of the page is composability: marketing adds a page by stacking
 * blocks that already exist, and watching the page build makes that argument
 * faster than a paragraph does.
 *
 * The cycle is driven by staggered per-block delays inside one long repeating
 * transition rather than by a timer in state. Nothing re-renders; the whole
 * loop lives on the compositor.
 */

const CYCLE = 7;

/** Block heights, in the order they land. */
const BLOCKS = [
  { key: "nav", node: <NavBlock /> },
  { key: "hero", node: <HeroBlock /> },
  { key: "cards", node: <CardRow /> },
  { key: "footer", node: <FooterBlock /> },
];

export function PageAssembly() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();
  const { ref: tiltRef, style, handlers } = usePointerTilt<HTMLDivElement>();

  return (
    <div
      ref={tiltRef}
      {...handlers}
      className="flex h-full items-center justify-center px-6 py-6 lg:px-12"
      style={{ perspective: 1200 }}
    >
      <motion.div ref={ref} style={style} className="w-full max-w-xl">
        <BrowserChrome url="pixelportal.in/company" className="h-56 lg:h-64">
          <div className="flex h-full flex-col gap-2 p-3">
            {BLOCKS.map((block, i) => (
              <motion.div
                key={block.key}
                className={i === 1 ? "flex-1" : undefined}
                initial={false}
                animate={
                  playing
                    ? { opacity: [0, 1, 1, 1, 0], y: [10, 0, 0, 0, 0] }
                    : { opacity: 1, y: 0 }
                }
                transition={
                  playing
                    ? {
                        duration: CYCLE,
                        // Each block enters a beat after the one above it, then
                        // they all clear together at the end of the cycle.
                        times: [0, 0.1 + i * 0.08, 0.5, 0.88, 1],
                        repeat: Infinity,
                        ease: EASE.out,
                      }
                    : undefined
                }
              >
                {block.node}
              </motion.div>
            ))}
          </div>
        </BrowserChrome>
      </motion.div>
    </div>
  );
}

function NavBlock() {
  return (
    <div className="border-hair flex items-center justify-between rounded-md border bg-white px-2.5 py-2">
      <span className="bg-brand-500 h-2 w-10 rounded-full" />
      <span className="flex gap-1.5">
        <Bar w="w-6" />
        <Bar w="w-8" />
        <Bar w="w-5" />
      </span>
    </div>
  );
}

function HeroBlock() {
  return (
    <div className="bg-brand-50/70 border-brand-100 flex h-full flex-col justify-center gap-2 rounded-md border px-3">
      <span className="bg-brand-300 h-2.5 w-3/5 rounded-full" />
      <span className="bg-brand-200 h-2.5 w-2/5 rounded-full" />
      <span className="bg-brand-600 mt-1.5 h-4 w-16 rounded-full" />
    </div>
  );
}

function CardRow() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="border-hair space-y-1.5 rounded-md border bg-white p-2">
          <span className="bg-brand-100 block size-4 rounded" />
          <Bar w="w-full" />
          <Bar w="w-2/3" />
        </div>
      ))}
    </div>
  );
}

function FooterBlock() {
  return (
    <div className="bg-paper border-hair flex items-center gap-2 rounded-md border px-2.5 py-2">
      <Bar w="w-8" />
      <Bar w="w-6" />
      <Bar w="w-10" />
    </div>
  );
}

function Bar({ w }: { w: string }) {
  return <span className={`bg-hair block h-1.5 rounded-full ${w}`} />;
}
