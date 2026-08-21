import { Reveal } from "@/components/motion/Reveal";

/**
 * The section's argument, drawn instead of asserted.
 *
 * This replaced a pair of `ParallaxImage` placeholders captioned "The Gurgaon
 * studio" and "Inside the studio". There is no studio photography yet, so both
 * rendered as full-bleed seeded gradients — two large dark-green rectangles on
 * a page whose whole premise is a white ground with green as an accent.
 *
 * A stock-photo stand-in would have been the wrong fix even once real images
 * land: an office interior says nothing about the claim the copy beside it is
 * making. The claim is structural — three disciplines under one contract
 * rather than three agencies handing work across seams — so the illustration
 * is the org chart, contrasted against the arrangement it replaces.
 *
 * Left panel is deliberately the weaker of the two: dashed borders, muted
 * type, gaps between the boxes. Right panel is one container, one continuous
 * spine, ink-weight labels. The visual difference carries the point before
 * either caption is read.
 */

/** The three parties the opening paragraph names, in its order. */
const FRAGMENTED = ["Media agency", "Web agency", "Internal tooling"];

const UNIFIED = ["Digital Marketing", "Website Development", "Software Development"];

export function SeamContrast() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* ---- The arrangement we are arguing against ---- */}
      <Reveal y={0}>
        <div className="border-hair rounded-panel bg-paper flex h-full flex-col border p-8">
          <p className="text-eyebrow text-muted uppercase">The usual arrangement</p>

          <div className="mt-8 flex-1">
            {FRAGMENTED.map((party, index) => (
              <div key={party}>
                {/* The seam itself — the thing the copy says budgets fall
                    through. Drawn between the boxes rather than inside one. */}
                {index > 0 && (
                  <div className="flex items-center gap-3 py-2.5 pl-6">
                    <span aria-hidden className="border-hair h-7 border-l border-dashed" />
                    <span className="text-muted text-[0.75rem]">handover</span>
                  </div>
                )}
                <div className="border-hair rounded-card border border-dashed bg-white px-5 py-4">
                  <p className="text-ink-soft text-[0.9375rem]">{party}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-muted border-hair mt-8 border-t pt-6 text-[0.875rem] leading-relaxed">
            Three contracts, three roadmaps, and nobody who owns the result.
          </p>
        </div>
      </Reveal>

      {/* ---- Ours ---- */}
      <Reveal y={0} delay={0.1}>
        <div className="border-hair rounded-panel flex h-full flex-col border bg-white p-8">
          <p className="text-brand-700 text-[0.75rem] font-semibold tracking-widest uppercase">
            How we are set up
          </p>

          <div className="mt-8 flex flex-1 flex-col">
            <div className="border-brand-200 rounded-card flex flex-1 flex-col justify-center border bg-white p-6">
              <ul className="relative">
                {/* One unbroken spine behind the row markers, running from the
                    first discipline through to the node they converge on. This
                    is the entire contrast with the panel on the left, so it
                    stays continuous rather than stopping at each row — which
                    is also why the terminal node is a row of this same list
                    rather than a block sitting under it. */}
                <span
                  aria-hidden
                  // Inset to the first and last dot centres (row padding plus
                  // half the marker), so the line begins and ends inside a dot
                  // rather than poking out as a stub at either end.
                  className="bg-brand-200 absolute top-4 bottom-6 left-0.75 w-px"
                />
                {UNIFIED.map((discipline) => (
                  <li key={discipline} className="relative flex items-center gap-4 py-3">
                    {/* The white ring punches the spine out behind each dot
                        so the line reads as passing under, not colliding. */}
                    <span className="bg-brand-500 h-1.75 w-1.75 shrink-0 rounded-full ring-4 ring-white" />
                    <span className="text-ink text-[0.9375rem] font-medium">{discipline}</span>
                  </li>
                ))}

                {/* Where the spine lands. Without this the three disciplines
                    are just a list; the convergence is what makes it an
                    argument. Marker is filled and larger — it terminates the
                    line rather than being another stop along it. */}
                <li className="relative flex items-center gap-4 pt-3">
                  <span className="bg-brand-700 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white" />
                  <span className="bg-brand-50 text-brand-800 rounded-card flex-1 px-4 py-3 text-[0.9375rem] font-semibold">
                    One accountable team
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-ink-soft border-hair mt-8 border-t pt-6 text-[0.875rem] leading-relaxed">
            One contract, one roadmap, and one team answerable for the outcome.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
