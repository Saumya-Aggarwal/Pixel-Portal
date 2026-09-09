import type { Metadata } from "next";
import Link from "next/link";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ArrowGlyph } from "@/components/ui/Button";
import { ClientMark } from "@/components/ui/ClientMark";
import { Container, MetricsNote, Section } from "@/components/ui/Layout";
import { getClientLogo } from "@/content/clients";
import { getCaseStudies } from "@/lib/content";
import type { CaseStudy, Metric } from "@/types/content";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Deep dives into specific industry results — replatforming, demand generation, marketplaces, and internal tooling.",
  alternates: { canonical: "/case-studies" },
};

const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-12"];

/**
 * Which span an entry takes, in a cycle of three: a 7/5 pair then a full-width
 * tile, the same rhythm as the homepage's Featured Work grid.
 *
 * The last entry is the exception. With seven studies the plain cycle ends on a
 * 7 with no 5 to pair with, so the page finished on a card two-thirds of the
 * way across the grid and five columns of nothing beside it. A wide tile has no
 * partner to be missing, so an orphaned 7 becomes one.
 */
function spanFor(index: number, total: number) {
  const step = index % SPANS.length;
  const orphaned = step === 0 && index === total - 1;
  return orphaned ? SPANS[2] : SPANS[step];
}

/**
 * The industry, minus any parenthetical qualifier.
 *
 * "Health & Fitness (Multi-Location Chain)" is precise and it is also the one
 * industry long enough to wrap a pill onto two lines on a phone. The chip takes
 * the category; the qualifier is still on the study's own page, which is where
 * a reader who wants that detail already is.
 */
function industryLabel(industry: string) {
  return industry.split(" (")[0];
}

export default async function CaseStudiesPage() {
  const studies = await getCaseStudies();

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
          <RevealGroup
            className="grid grid-cols-1 gap-8 lg:grid-cols-12"
            stagger={0.1}
          >
            {studies.map((study, index) => {
              const span = spanFor(index, studies.length);

              return (
                <RevealItem key={study.slug} className={`${span} col-span-1`}>
                  {/* `RevealItem` renders a plain div, so the article element
                      stays here rather than being dropped for the wrapper. */}
                  <StudyCard study={study} wide={span === SPANS[2]} />
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

/**
 * One study.
 *
 * A wide tile is not a narrow one stretched. Given the full twelve columns the
 * old card kept its copy in a single left-hand run and left the right two
 * thirds of a 1,344px band empty, so the widest cards on the page were the
 * emptiest. The wide variant splits its body on the same 7/5 the paired tiles
 * use — copy left, figures right — which puts the extra width to work and gives
 * the whole page one rhythm instead of two.
 */
function StudyCard({ study, wide }: { study: CaseStudy; wide: boolean }) {
  const logo = getClientLogo(study.client);

  return (
    <article className="h-full">
      <Link
        href={`/case-studies/${study.slug}`}
        className="group border-hair rounded-panel ease-soft shadow-lift bg-paper hover:shadow-lift-lg relative flex h-full flex-col overflow-hidden border p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 lg:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <span className="border-hair text-muted rounded-full border bg-white px-3.5 py-1.5 text-[0.75rem] font-medium whitespace-nowrap">
            {industryLabel(study.industry)}
          </span>
          {logo && (
            <ClientMark
              src={logo}
              className="h-12 w-auto max-w-32 shrink-0 object-contain opacity-60 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
            />
          )}
        </div>

        <div
          className={
            wide
              ? "mt-8 flex-1 lg:grid lg:grid-cols-12 lg:gap-10"
              : "mt-8 flex-1"
          }
        >
          <div className={wide ? "lg:col-span-7" : undefined}>
            <p className="text-brand-700 text-[0.75rem] font-semibold tracking-widest uppercase">
              {study.client}
            </p>
            <h2 className="font-display text-ink mt-2.5 line-clamp-3 text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.15] font-bold tracking-tight">
              {study.title}
            </h2>
            <p className="text-muted mt-3 line-clamp-2 max-w-prose text-[0.9375rem] leading-relaxed lg:line-clamp-3">
              {study.summary}
            </p>
          </div>

          {/* The split is a desktop concern only. Below `lg` every tile is the
              full column anyway, so a wide one that moved its figures up here
              and put a "read this" row where they had been would be two rows
              taller than its neighbours and say nothing more. */}
          {wide && (
            <div className="border-hair hidden lg:col-span-5 lg:block lg:border-l lg:pl-10">
              <Metrics items={study.metrics} />
            </div>
          )}
        </div>

        <div className="border-hair mt-8 flex items-end justify-between gap-6 border-t pt-5">
          <div className={wide ? "lg:hidden" : undefined}>
            <Metrics items={study.metrics} />
          </div>
          {wide && (
            <span className="text-ink-soft group-hover:text-brand-700 hidden text-[0.875rem] font-medium transition-colors lg:inline">
              Read the case study
            </span>
          )}
          <span className="border-hair text-brand-700 group-hover:border-brand-600 group-hover:bg-brand-600 grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 group-hover:text-white">
            <ArrowGlyph />
          </span>
        </div>
      </Link>
    </article>
  );
}

/**
 * The figures.
 *
 * Two columns on a phone rather than a wrapping row. `flex-wrap` with a ten-unit
 * gap gave each metric the full column width, so three of them made three rows
 * and every card carried about fifty pixels it did not need — across seven
 * cards, most of a screen of scrolling for nothing.
 */
function Metrics({ items }: { items: Metric[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10">
      {items.slice(0, 3).map((metric) => (
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
  );
}
