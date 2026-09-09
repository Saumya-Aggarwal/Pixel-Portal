import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceSections } from "@/components/sections/service/ServiceSections";
import { SiblingRail } from "@/components/sections/service/SiblingRail";
import {
  ServiceHeroVisual,
  heroLayoutFor,
} from "@/components/sections/service/visuals/ServiceHeroVisual";
import { ArrowGlyph } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";
import { getCategories, getCaseStudiesForService, getService } from "@/lib/content";

/**
 * All 14 sub-service pages, from one file.
 *
 * Every route is enumerated at build time and `dynamicParams = false` turns any
 * unknown slug into a 404 rather than a render attempt.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.flatMap((category) =>
    category.services.map((service) => ({
      category: category.slug,
      service: service.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[category]/[service]">): Promise<Metadata> {
  const { category: categorySlug, service: serviceSlug } = await params;
  const result = await getService(categorySlug, serviceSlug);
  if (!result) return {};

  const { category, service } = result;
  const path = `/${category.slug}/${service.slug}`;

  return {
    title: `${service.title} — ${category.title}`,
    description: service.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${service.title} — Pixel Portal`,
      description: service.description,
      url: path,
    },
  };
}

export default async function ServicePage({ params }: PageProps<"/[category]/[service]">) {
  const { category: categorySlug, service: serviceSlug } = await params;
  const result = await getService(categorySlug, serviceSlug);
  if (!result) notFound();

  const { category, service } = result;
  const related = await getCaseStudiesForService(service.slug);
  const siblings = category.services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        eyebrow={category.title}
        heading={service.tagline}
        body={service.description}
        icon={service.icon}
        crumbs={[
          { label: "Home", href: "/" },
          { label: category.title, href: `/${category.slug}` },
          { label: service.navTitle ?? service.title, href: `/${category.slug}/${service.slug}` },
        ]}
        // Blueprint-built illustrations sit beside the copy; the rest keep the
        // full-width band beneath it they were drawn for. The illustration
        // decides, so the two can never disagree.
        layout={heroLayoutFor(service.visual)}
      >
        {service.visual && (
          <ServiceHeroVisual visual={service.visual} title={service.title} />
        )}
      </PageHero>

      {/* ---- Deliverables (base template — every service gets this) ---- */}
      <Section spacing="base" divider>
        <Container wide>
          <div className="grid grid-cols-12 gap-y-10 lg:gap-x-16">
            <div className="col-span-12 lg:col-span-4">
              <Reveal y={0}>
                <Eyebrow>What you get</Eyebrow>
              </Reveal>
              <TextReveal
                as="h2"
                className="font-display text-h2 text-ink mt-6 max-w-[12ch] font-semibold"
              >
                {service.title}
              </TextReveal>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <RevealGroup className="divide-hair divide-y" stagger={0.07}>
                {service.deliverables.map((item, index) => (
                  <RevealItem key={item}>
                    {/* The row indents by the width of a hair on hover — just
                        enough to confirm the pointer is on this line and not
                        the one above it, which a colour change alone does not
                        do in a list this dense. */}
                    <div className="group ease-soft flex items-baseline gap-6 py-5 transition-transform duration-500 hover:translate-x-1">
                      <span
                        aria-hidden
                        className="text-hair group-hover:text-brand-300 font-display w-8 shrink-0 text-[0.875rem] font-semibold tabular-nums transition-colors duration-500"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-ink group-hover:text-brand-900 text-[1.0625rem] leading-snug transition-colors duration-500">
                        {item}
                      </span>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- Rich blocks, when this service has them authored ---- */}
      {service.sections && <ServiceSections sections={service.sections} />}

      {/* ---- Related work ---- */}
      {related.length > 0 && (
        <Section spacing="base" className="bg-paper" divider>
          <Container wide>
            <Reveal y={0}>
              <Eyebrow>Related work</Eyebrow>
            </Reveal>
            <RevealGroup className="mt-10 grid gap-5 lg:grid-cols-3">
              {related.slice(0, 3).map((study) => (
                <RevealItem key={study.slug}>
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="group border-hair rounded-card hover:border-brand-200 flex h-full flex-col border bg-white p-7 transition-colors duration-500"
                  >
                    <p className="text-eyebrow text-brand-700 uppercase">{study.client}</p>
                    <h3 className="font-display text-ink group-hover:text-brand-800 mt-3 flex-1 text-[1.125rem] leading-snug font-semibold transition-colors">
                      {study.title}
                    </h3>
                    <p className="font-display text-brand-600 mt-6 text-[1.75rem] leading-none font-semibold">
                      {study.metrics[0].prefix}
                      {study.metrics[0].value.toLocaleString("en-US")}
                      {study.metrics[0].suffix}
                    </p>
                    <p className="text-muted mt-2 text-[0.8125rem]">{study.metrics[0].label}</p>
                    <span className="text-brand-700 mt-6 inline-flex items-center gap-2 text-[0.875rem] font-medium">
                      Read case study
                      <ArrowGlyph />
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      )}

      {/* ---- Sibling services ---- */}
      <SiblingRail
        heading={`More in ${category.title}`}
        items={siblings.map((sibling) => ({
          href: `/${category.slug}/${sibling.slug}`,
          title: sibling.navTitle ?? sibling.title,
          tagline: sibling.tagline,
        }))}
        action={{
          href: `/${category.slug}`,
          label: `All ${category.services.length} services`,
        }}
      />

      <CtaSection
        eyebrow="Next step"
        heading={`Need ${(service.navTitle ?? service.title).toLowerCase()}?`}
        body="Send us the brief, or just the problem. We will come back with an honest view of scope, timing, and whether we are the right team."
        primaryLabel="Request a proposal"
      />
    </>
  );
}
