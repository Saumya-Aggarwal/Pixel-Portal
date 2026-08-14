import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PrincipleRail } from "@/components/sections/PrincipleRail";
import { CalloutChip } from "@/components/sections/service/visuals/chrome/Callout";

/**
 * A short set of stated principles, as panels on a rail.
 *
 * This replaced two separate blocks of bare text columns — the values on
 * `/about` and the credibility strip on every category page — which were the
 * last surfaces on the site still setting headings and body copy directly onto
 * the page ground with nothing under them.
 *
 * The recipe is the illustrations' `FloatPanel`, not the component: that one is
 * a client component whose required `playing` prop comes from
 * `useVisualPlayback`, an illustration-canvas concept with no meaning on a page
 * section, and its radius is `rounded-card` rather than the panel scale this
 * wants. The tokens are the same ones it sets — `--shadow-float` at rest,
 * `--shadow-float-hover` under the pointer — and keeping the lift in CSS means
 * the panels themselves stay server-rendered. `PrincipleRail` is the only part
 * of this block that hydrates.
 *
 * Shared rather than copied because two call sites drifting apart is exactly
 * how the site ended up with four copies of the stat rail.
 */
export function PrincipleCards({
  items,
  rail = true,
}: {
  items: { title: string; body: string }[];
  /**
   * The dashed connector behind the cards. Off for a set that reads as a band
   * rather than a system — it needs the cards to be the only thing in its
   * horizontal strip, or it collides with whatever else is there.
   */
  rail?: boolean;
}) {
  return (
    <div className="relative">
      {/* Full-bleed rather than container width, and that is the point:
          confined to the grid it would only ever show in the gaps between
          cards, which is not a rail, it is two dashes. Running it to the
          viewport edges makes the cards read as nodes on something continuous.

          Its own component because it is the only part of this block that
          animates, and keeping it separate is what lets the three panels stay
          server-rendered. */}
      {rail && <PrincipleRail />}

      <RevealGroup className="relative grid gap-8 lg:grid-cols-3">
        {items.map((item, index) => (
          <RevealItem key={item.title}>
            <article className="border-hair rounded-panel ease-out-expo flex h-full flex-col border bg-white p-8 shadow-(--shadow-float) transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-(--shadow-float-hover) lg:p-10">
              {/* `CalloutChip` verbatim — already a server component, and its
                  paper ground, hairline and tracked caps are exactly the
                  technical-badge treatment.

                  Indexed `01 / 03` rather than labelled `PHASE 01`. These are
                  principles held at once, not stages of anything, and a phase
                  label would assert a sequence that does not exist. The slash
                  form is the one the illustrations' own chips already use. */}
              <CalloutChip className="self-start">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(items.length).padStart(2, "0")}
              </CalloutChip>

              <h3 className="font-display text-ink mt-7 text-[1.25rem] leading-tight font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="text-muted mt-3 text-[0.9375rem] leading-relaxed">{item.body}</p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
