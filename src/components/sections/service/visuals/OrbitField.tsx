"use client";

import { OrbitingSystem } from "@/components/motion/OrbitingSystem";
import { Reveal } from "@/components/motion/Reveal";
import { BLUR } from "@/lib/motion";

/**
 * The existing orbital system, captioned.
 *
 * `OrbitingSystem` already carries the hover-to-accelerate behaviour and the
 * transform-origin fix that makes SVG rotation land on the true centre. This
 * adds the labels around it and nothing else — the rings themselves stay one
 * implementation shared with the home page.
 */
export function OrbitField({ nodes }: { nodes: string[] }) {
  return (
    <div className="grid h-full grid-cols-12 items-center gap-6 px-6 py-8 lg:px-12">
      <div className="col-span-12 flex justify-center lg:col-span-5 lg:justify-start">
        <OrbitingSystem className="size-64 lg:size-72" />
      </div>

      <div className="col-span-12 lg:col-span-7">
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {nodes.map((node, i) => (
            <li key={node}>
              <Reveal delay={0.1 + i * 0.06} y={12} blur={BLUR.subtle}>
                <span className="text-ink-soft flex items-center gap-3 text-[0.9375rem] leading-snug">
                  <span aria-hidden className="bg-brand-400 size-1.5 shrink-0 rounded-full" />
                  {node}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
