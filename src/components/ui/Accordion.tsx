"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

import { DUR, EASE } from "@/lib/motion";

interface AccordionProps {
  items: { q: string; a: string }[];
}

/**
 * FAQ accordion.
 *
 * Height is animated from `auto`, which Motion resolves by measuring — cheap
 * here because the panels hold a paragraph each. The button carries
 * aria-expanded and aria-controls so the disclosure is announced properly, and
 * under reduced motion the panel simply appears.
 */
export function Accordion({ items }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  const prefersReduced = useReducedMotion();

  return (
    <div className="divide-hair border-hair divide-y border-y">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-ink group-hover:text-brand-800 text-[1.0625rem] font-semibold transition-colors sm:text-[1.125rem]">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="border-hair group-hover:border-brand-300 group-hover:bg-brand-50 mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1v10M1 6h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className={`text-brand-700 origin-center transition-transform duration-300 ease-out-expo ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </svg>
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: DUR.fast, ease: EASE.soft }}
                  className="overflow-hidden"
                >
                  <p className="text-muted max-w-2xl pb-6 text-[0.9375rem] leading-relaxed">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
