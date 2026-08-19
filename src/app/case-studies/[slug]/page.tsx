import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { ArrowGlyph } from "@/components/ui/Button";
import { Container, Eyebrow, MetricsNote, Section } from "@/components/ui/Layout";
import { getClientLogo } from "@/content/clients";
import { getCaseStudies, getCaseStudy, getServicesBySlugs } from "@/lib/content";
import type { Metric } from "@/types/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const studies = await getCaseStudies();
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};

  return {
    title: `${study.client} — ${study.title}`,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      title: `${study.client} — Pixel Portal`,
      description: study.summary,
      url: `/case-studies/${study.slug}`,
    },
  };
}

/**
 * Abstract interface skeleton — chrome dots, a nav bar, a content grid, three
 * lines of body copy. Stands in for a real UI screenshot without pretending
 * to be one: nothing here claims to depict any client's actual product.
 */
function WireframeInterface() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5">
        <span className="bg-hair h-2 w-2 rounded-full" />
        <span className="bg-hair h-2 w-2 rounded-full" />
        <span className="bg-hair h-2 w-2 rounded-full" />
        <span className="border-hair ml-2 h-5 flex-1 rounded-full border" />
      </div>
      <div className="border-hair rounded-card bg-brand-50 h-8 border" />
      <div className="grid grid-cols-3 gap-3">
        <div className="border-hair rounded-card bg-paper col-span-2 h-20 border" />
        <div className="border-hair rounded-card bg-paper h-20 border" />
      </div>
      <div className="space-y-2">
        <div className="bg-hair h-2 w-full rounded-full" />
        <div className="bg-hair h-2 w-4/5 rounded-full" />
        <div className="bg-hair h-2 w-3/5 rounded-full" />
      </div>
    </div>
  );
}

/** Abstract chart skeleton — bars plus a two-item legend, no invented figures. */
function WireframeMetrics() {
  const bars = [42, 68, 52, 84, 60, 92, 74];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-28 items-end gap-2.5">
        {bars.map((height, index) => (
          <span
            key={index}
            aria-hidden
            className="bg-brand-200 flex-1 rounded-t-md"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="border-hair flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <span className="bg-brand-500 h-2.5 w-2.5 rounded-full" />
          <span className="text-ink-soft text-[0.75rem]">Engagement</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-hair h-2.5 w-2.5 rounded-full" />
          <span className="text-ink-soft text-[0.75rem]">Baseline</span>
        </div>
      </div>
    </div>
  );
}

/** Alternating fills stand in for the nine photorealistic renders in the grid. */
const GRID_SWATCHES = ["bg-brand-50", "bg-paper", "bg-brand-100"];

/** Evidence panel for `evidenceLayout: "curated-grid"` — the launch grid itself. */
function CuratedGridCard() {
  return (
    <div className="border-hair rounded-panel border bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-paper border-hair h-10 w-10 shrink-0 rounded-full border" />
          <div>
            <p className="text-ink text-sm font-semibold">@credxp.commercial</p>
            <p className="text-ink-soft text-xs">Commercial Real Estate</p>
          </div>
        </div>
        <span className="bg-brand-500 rounded-full px-3 py-1 text-xs font-medium text-white">
          Follow
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-1">
        {GRID_SWATCHES.concat(GRID_SWATCHES, GRID_SWATCHES).map((swatch, index) => (
          <div
            key={index}
            aria-hidden
            className={`aspect-square transition-opacity duration-300 hover:opacity-80 ${swatch}`}
          />
        ))}
      </div>
    </div>
  );
}

const MOCK_LEADS = [
  { name: "J. Sharma", intent: "Premium Office Rental", status: "Tour Booked" },
  { name: "A. Verma", intent: "Pre-Leased Retail Shop", status: "Qualified" },
  { name: "R. Nair", intent: "Commercial Office Space", status: "Qualified" },
];

/** Evidence panel for `evidenceLayout: "curated-grid"` — the inquiry lift. */
function InquiryPipelineCard({ metric }: { metric?: Metric }) {
  return (
    <div className="border-hair rounded-panel flex h-full flex-col gap-4 border bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-ink-soft text-sm">Inquiry Volume</p>
        {metric && (
          <span className="bg-brand-50 text-brand-700 rounded-full px-2.5 py-1 text-xs font-semibold">
            ↑ {metric.value.toFixed(1)}
            {metric.suffix}
          </span>
        )}
      </div>

      <div>
        {MOCK_LEADS.map((lead) => (
          <div
            key={lead.name}
            className="border-hair flex items-center justify-between gap-4 border-b py-3 first:pt-0 last:border-0 last:pb-0"
          >
            <div>
              <p className="text-ink text-sm font-medium">{lead.name}</p>
              <p className="text-ink-soft text-xs">{lead.intent}</p>
            </div>
            <span className="border-hair text-brand-700 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase">
              {lead.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * A teardown, not a blog post.
 *
 * Editorial hero (centred, no imagery — there is no real photography for
 * these engagements yet, and a full-bleed placeholder gradient behind the
 * title is exactly the "wall of dark green" problem this layout replaces)
 * hands off to a sticky 4/8 split: a condensed challenge/solution/results
 * rail that tracks the scroll, next to the long-form narrative. The numbers
 * get a dedicated evidence bento before the page loops into the next study —
 * nothing here dead-ends on a "the end" footer.
 */
export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const [services, all] = await Promise.all([
    getServicesBySlugs(study.services),
    getCaseStudies(),
  ]);

  const logo = getClientLogo(study.client);
  const currentIndex = all.findIndex((s) => s.slug === study.slug);
  const next = all[(currentIndex + 1) % all.length];

  return (
    <>
      {/* ---- Editorial hero ---- */}
      <Section spacing="loose">
        <Container>
          <div className="mx-auto max-w-200 text-center">
            <Reveal y={0}>
              <Link
                href="/case-studies"
                className="text-muted hover:text-brand-700 inline-flex items-center gap-2 text-[0.8125rem] transition-colors"
              >
                <span aria-hidden>←</span>
                All case studies
              </Link>
            </Reveal>

            {logo && (
              <Reveal delay={0.12} className="mt-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={study.client}
                  className="mx-auto h-9 w-auto max-w-40 object-contain"
                />
              </Reveal>
            )}

            <Reveal y={0} delay={0.18} className={logo ? "mt-6" : "mt-10"}>
              <p className="text-brand-700 text-[0.75rem] font-semibold tracking-widest uppercase">
                {study.client}
              </p>
            </Reveal>

            <TextReveal
              as="h1"
              immediate
              delay={0.24}
              className="font-display text-h1 text-ink mt-4 font-semibold text-balance"
            >
              {study.title}
            </TextReveal>

            <Reveal delay={0.4} className="border-hair mb-16 mt-10 border-t pt-8">
              <dl className="flex flex-wrap items-start justify-center gap-x-10 gap-y-5">
                <div>
                  <dt className="text-eyebrow text-muted uppercase">Industry</dt>
                  <dd className="text-ink mt-1.5 max-w-[28ch] text-[0.9375rem] font-medium">
                    {study.industry}
                  </dd>
                </div>
                <span aria-hidden className="bg-hair mt-1 hidden h-8 w-px sm:block" />
                <div>
                  <dt className="text-eyebrow text-muted uppercase">Services</dt>
                  <dd className="text-ink mt-1.5 max-w-[28ch] text-[0.9375rem] font-medium">
                    {services.map((service) => service.navTitle ?? service.title).join(", ")}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- The 4/8 split ---- */}
      <Section spacing="base" className="border-hair border-t">
        <Container wide>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <div className="border-hair rounded-panel border bg-paper p-8">
                  <Reveal y={0}>
                    <Eyebrow>The challenge</Eyebrow>
                    <p className="text-ink-soft mt-4 text-[0.9375rem] leading-relaxed">
                      {study.challenge}
                    </p>
                  </Reveal>

                  <Reveal y={0} delay={0.05} className="border-hair mt-8 border-t pt-8">
                    <Eyebrow>The solution</Eyebrow>
                    <ul className="mt-4 space-y-3">
                      {study.approach.map((item) => (
                        <li
                          key={item}
                          className="text-ink-soft flex gap-3 text-[0.9375rem] leading-relaxed"
                        >
                          <span
                            aria-hidden
                            className="bg-brand-400 mt-[0.6em] block h-1 w-1 shrink-0 rounded-full"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal y={0} delay={0.1} className="border-hair mt-8 border-t pt-8">
                    <Eyebrow>The results</Eyebrow>
                    <dl className="mt-4 space-y-3">
                      {study.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="flex items-baseline justify-between gap-4"
                        >
                          <dt className="text-ink-soft text-[0.875rem] leading-snug">
                            {metric.label}
                          </dt>
                          <dd className="font-display text-brand-700 shrink-0 text-[1.0625rem] font-semibold tabular-nums">
                            {metric.prefix}
                            {metric.value.toLocaleString("en-US")}
                            {metric.suffix}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <MetricsNote className="mt-4" />
                  </Reveal>
                </div>

                <div className="mt-8">
                  <p className="text-eyebrow text-muted uppercase">Capabilities applied</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {services.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/${service.category}/${service.slug}`}
                          className="border-hair text-ink-soft hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800 inline-flex min-h-9 items-center rounded-full border px-3.5 text-[0.8125rem] transition-colors"
                        >
                          {service.navTitle ?? service.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <RevealGroup className="space-y-6" stagger={0.1}>
                <RevealItem>
                  <p className="text-ink-soft text-xl leading-relaxed">{study.summary}</p>
                </RevealItem>
                {study.approach.map((item) => (
                  <RevealItem key={item}>
                    <p className="text-ink-soft text-xl leading-relaxed">{item}</p>
                  </RevealItem>
                ))}
              </RevealGroup>

              <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2" stagger={0.1}>
                {study.evidenceLayout === "curated-grid" ? (
                  <>
                    <RevealItem>
                      <CuratedGridCard />
                    </RevealItem>
                    <RevealItem>
                      <InquiryPipelineCard
                        metric={study.metrics.find((metric) => metric.suffix === "x")}
                      />
                    </RevealItem>
                  </>
                ) : (
                  <>
                    <RevealItem>
                      <FloatPanel playing={false} className="h-full p-8">
                        <WireframeInterface />
                      </FloatPanel>
                    </RevealItem>
                    <RevealItem>
                      <FloatPanel playing={false} className="h-full p-8">
                        <WireframeMetrics />
                      </FloatPanel>
                    </RevealItem>
                  </>
                )}
              </RevealGroup>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- Evidence bento ---- */}
      <Section spacing="base">
        <Container wide>
          <Reveal y={0}>
            <Eyebrow>By the numbers</Eyebrow>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4" stagger={0.08}>
            {study.metrics.map((metric) => (
              <RevealItem key={metric.label}>
                <FloatPanel playing={false} className="h-full p-8">
                  <p className="font-display text-brand-600 text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold tabular-nums">
                    <CountUp value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
                  </p>
                  <p className="text-ink-soft mt-3 text-[0.875rem] leading-snug">
                    {metric.label}
                  </p>
                </FloatPanel>
              </RevealItem>
            ))}
          </RevealGroup>

          <MetricsNote className="mt-6 text-right" />
        </Container>
      </Section>

      {/* ---- The continuous loop ---- */}
      <Section spacing="tight" className="border-hair border-t">
        <Container wide>
          <Reveal y={0}>
            <Link
              href={`/case-studies/${next.slug}`}
              className="group flex flex-col items-start justify-between gap-6 py-6 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-eyebrow text-muted uppercase">Next case study</p>
                <h2 className="font-display text-h2 text-ink group-hover:text-brand-800 mt-3 font-semibold transition-colors">
                  {next.client} — {next.title}
                </h2>
              </div>
              <span className="border-hair text-brand-700 group-hover:border-brand-600 group-hover:bg-brand-600 grid h-14 w-14 shrink-0 place-items-center rounded-full border transition-colors duration-300 group-hover:text-white">
                <ArrowGlyph />
              </span>
            </Link>
          </Reveal>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Similar problem?"
        heading="Let's talk about your version of this."
        body="If any of the above sounds close to what you are dealing with, a short call is the fastest way to find out whether we can help."
      />
    </>
  );
}
