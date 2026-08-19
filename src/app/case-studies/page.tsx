import type { Metadata } from "next";
import Link from "next/link";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ArrowGlyph } from "@/components/ui/Button";
import { Container, MetricsNote, Section } from "@/components/ui/Layout";
import { getClientLogo } from "@/content/clients";
import { getCaseStudies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Deep dives into specific industry results — replatforming, demand generation, marketplaces, and internal tooling.",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesPage() {
  const studies = await getCaseStudies();

  /**
   * Cycle of 3: a 7/5 pair then a full-width tile, repeating — the same
   * rhythm as the homepage's Featured Work grid. No per-item margin
   * offsets; grid stretch plus the taller tile's own copy sets the row
   * height, so the pair's tops and bottoms line up instead of one card
   * drifting against the other.
   */
  const layouts = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-12"];

  return (
    <>
      <PageHero
        eyebrow="Case studies"
        heading="The work, and what it actually moved."
        body="Every engagement below is described with the problem first and the numbers second — in that order, because the order matters."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/case-studies" },
        ]}
      />

      <Section spacing="base">
        <Container wide>
          <RevealGroup className="grid grid-cols-1 gap-8 lg:grid-cols-12" stagger={0.1}>
            {studies.map((study, index) => {
              const span = layouts[index % layouts.length];
              const logo = getClientLogo(study.client);

              return (
                <RevealItem key={study.slug} className={`${span} col-span-1`}>
                  {/* `RevealItem` renders a plain div, so the article element
                      stays here rather than being dropped for the wrapper. */}
                  <article className="h-full">
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="group border-hair rounded-panel ease-soft shadow-lift bg-paper relative flex h-full flex-col overflow-hidden border p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-lift-lg lg:p-8"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <span className="border-hair text-muted rounded-full border bg-white px-3.5 py-1.5 text-[0.75rem] font-medium">
                          {study.industry}
                        </span>
                        {logo && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={logo}
                            alt={study.client}
                            loading="lazy"
                            decoding="async"
                            className="h-12 w-auto max-w-32 shrink-0 object-contain opacity-60 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                          />
                        )}
                      </div>

                      <div className="mt-8 flex-1">
                        <p className="text-brand-700 text-[0.75rem] font-semibold tracking-widest uppercase">
                          {study.client}
                        </p>
                        <h2 className="font-display text-ink mt-2.5 line-clamp-2 text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.1] font-bold tracking-tight">
                          {study.title}
                        </h2>
                        <p className="text-muted mt-3 line-clamp-2 max-w-prose text-[0.9375rem] leading-relaxed">
                          {study.summary}
                        </p>
                      </div>

                      <div className="border-hair mt-8 flex items-end justify-between gap-6 border-t pt-5">
                        <dl className="flex flex-wrap gap-x-10 gap-y-4">
                          {study.metrics.slice(0, 3).map((metric) => (
                            <div key={metric.label}>
                              <dt className="sr-only">{metric.label}</dt>
                              <dd className="font-display text-brand-600 text-[1.5rem] leading-none font-semibold">
                                {metric.prefix}
                                {metric.value.toLocaleString("en-US")}
                                {metric.suffix}
                              </dd>
                              <p className="text-ink-soft mt-1.5 max-w-[16ch] text-[0.75rem] leading-snug">
                                {metric.label}
                              </p>
                            </div>
                          ))}
                        </dl>
                        <span className="border-hair text-brand-700 grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
                          <ArrowGlyph />
                        </span>
                      </div>
                    </Link>
                  </article>
                </RevealItem>
              );
            })}
          </RevealGroup>

          <MetricsNote className="mt-16 text-right" />
        </Container>
      </Section>

      <CtaSection
        eyebrow="Your turn"
        heading="What would your case study say?"
        body="Tell us the outcome you are measured on. We will tell you what it would take to move it."
      />
    </>
  );
}
