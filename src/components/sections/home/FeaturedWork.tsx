import Link from "next/link";

import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";
import { getFeaturedCaseStudies } from "@/lib/content";

/**
 * Featured work.
 *
 * Each entry is one tile: the image is the card, and the copy sits on it
 * behind a scrim rather than underneath it in the page flow. The parallax
 * strengths alternate in sign so adjacent images drift in opposite directions
 * as the section passes — that counter-motion is what sells the depth, where
 * three images drifting in unison just looks like the page is lagging.
 *
 * The old version staggered each tile by a different vertical offset. With the
 * copy outside the frame that read as deliberate asymmetry; with the copy
 * inside it, tiles are hard-edged rectangles and the stagger just read as
 * misalignment. So the grid is square now: a 7/5 pair on one row, a full-width
 * tile on the next, tops and bottoms aligned.
 */
export async function FeaturedWork() {
  const studies = await getFeaturedCaseStudies();

  /**
   * No height here, and no aspect ratio either.
   *
   * An aspect ratio cannot work: the first-row pair spans 7 and 5 columns, so
   * the same ratio makes the wider tile taller by the ratio of the spans. A
   * fixed height fixed that but set the artwork band by subtraction — whatever
   * was left after the copy — which is how the tops ended up so empty.
   *
   * So the copy sizes the tile and the band above it is a padding value
   * (`pt-16`/`lg:pt-20`). Grid items stretch by default, so the pair still
   * matches: the taller copy sets the row and the other tile fills it.
   */
  const layouts = [
    { span: "lg:col-span-7", strength: 14 },
    { span: "lg:col-span-5", strength: -10 },
    { span: "lg:col-span-12", strength: 12 },
  ];

  return (
    <Section spacing="loose" className="bg-paper">
      <Container wide>
        <div className="grid grid-cols-12 items-end gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <Reveal y={0}>
              <Eyebrow>Selected work</Eyebrow>
            </Reveal>
            <TextReveal
              as="h2"
              className="font-display text-h1 text-ink mt-6 max-w-[16ch] font-semibold"
            >
              Results we can show you the numbers for.
            </TextReveal>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:flex lg:justify-end lg:pb-3">
            <Button href="/case-studies" variant="outline" className="group">
              All case studies
              <ArrowGlyph />
            </Button>
          </div>
        </div>

        <RevealGroup
          className="mt-16 grid grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-12"
          stagger={0.12}
        >
          {studies.map((study, index) => {
            const layout = layouts[index % layouts.length];

            return (
              <RevealItem key={study.slug} className={`${layout.span} col-span-1`}>
                {/* `RevealItem` renders a plain div, so the article element
                    stays here rather than being dropped for the wrapper. */}
                <article className="h-full">
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="group rounded-panel relative flex h-full flex-col justify-end overflow-hidden"
                  >
                    {/* Fills the tile rather than setting its height — the copy
                      below does that. `aspect=""` clears the component's own
                      default ratio.

                      The hover scale sits on this container, which GSAP never
                      touches; the parallax tween drives the element inside it,
                      so the two transforms compose instead of fighting. */}
                    <ParallaxImage
                      alt={`${study.client} — ${study.title}`}
                      seed={study.slug}
                      aspect=""
                      className="ease-out-expo absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
                      strength={layout.strength}
                      sizes="(max-width: 1024px) 100vw, 55vw"
                    />

                    {/* Scrim. The placeholder gradients run from near-black to
                      mid green depending on the seed, so legibility cannot
                      rest on the artwork — this guarantees the contrast under
                      the copy no matter which image lands here. */}
                    <div
                      aria-hidden
                      className="from-brand-900/95 via-brand-900/55 absolute inset-0 bg-linear-to-t to-transparent"
                    />

                    {/* Inset matches the content block's padding on the other
                      three sides, so the chip's top gap and the metrics' bottom
                      gap are the same measure. It was on `top-5 left-5` against
                      a `p-6`/`lg:p-8` content block, which left it sitting
                      slightly outside the text's left edge. */}
                    <span className="glass text-brand-800 absolute top-6 left-6 rounded-full px-3.5 py-1.5 text-[0.75rem] font-medium lg:top-8 lg:left-8">
                      {study.industry}
                    </span>

                    <div className="relative p-6 pt-16 lg:p-8 lg:pt-20">
                      <div className="flex items-end justify-between gap-6">
                        <div className="min-w-0">
                          <p className="text-eyebrow text-brand-200 uppercase">{study.client}</p>
                          <h3 className="font-display mt-2.5 text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight font-semibold tracking-tight text-white">
                            {study.title}
                          </h3>
                          <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-white/70">
                            {study.summary}
                          </p>
                        </div>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-colors duration-300 group-hover:bg-white group-hover:text-brand-800">
                          <ArrowGlyph />
                        </span>
                      </div>

                      {/* Lead metrics, pulled forward as the headline numbers */}
                      <dl className="mt-6 flex gap-8 border-t border-white/20 pt-5">
                        {study.metrics.slice(0, 2).map((metric) => (
                          <div key={metric.label}>
                            <dt className="sr-only">{metric.label}</dt>
                            <dd className="font-display text-[1.5rem] leading-none font-semibold text-white">
                              {metric.prefix}
                              {metric.value.toLocaleString("en-US")}
                              {metric.suffix}
                            </dd>
                            <p className="mt-1.5 text-[0.8125rem] leading-snug text-white/60">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </Link>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </Section>
  );
}
