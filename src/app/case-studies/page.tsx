import type { Metadata } from "next";
import Link from "next/link";

import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ArrowGlyph } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { getCaseStudies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Deep dives into specific industry results — replatforming, demand generation, marketplaces, and internal tooling.",
  alternates: { canonical: "/case-studies" },
};

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
          {/*
            Masonry-ish rhythm: every third entry claims a wider span and the
            offsets alternate, so the column edges never line up into the
            standard three-across grid the brief asks us to avoid.
          */}
          <RevealGroup className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-12" stagger={0.1}>
            {studies.map((study, index) => {
              const wide = index % 3 === 0;

              return (
                <RevealItem
                  key={study.slug}
                  className={
                    wide
                      ? "lg:col-span-7"
                      : index % 3 === 1
                        ? "lg:col-span-5 lg:mt-20"
                        : "lg:col-span-6 lg:col-start-4 lg:-mt-4"
                  }
                >
                  <article>
                    <Link href={`/case-studies/${study.slug}`} className="group block">
                      {/* Lift lives on this wrapper, never on the image
                          inside it — `ParallaxImage` scrubs a transform on its
                          own inner node, and two owners of one property is how
                          you get a card that judders on scroll. */}
                      <div className="rounded-panel ease-soft relative overflow-hidden transition-[transform,box-shadow] duration-500 group-hover:-translate-y-1.5 group-hover:shadow-lift-lg">
                        <ParallaxImage
                          alt={`${study.client} — ${study.title}`}
                          seed={study.slug}
                          aspect={wide ? "aspect-[16/10]" : "aspect-[4/3]"}
                          strength={index % 2 === 0 ? 12 : -10}
                          sizes="(max-width: 1024px) 100vw, 55vw"
                        />
                        <span className="glass text-brand-800 absolute top-5 left-5 rounded-full px-3.5 py-1.5 text-[0.75rem] font-medium">
                          {study.industry}
                        </span>
                      </div>

                      <div className="mt-6 flex items-start justify-between gap-6">
                        <div className="min-w-0">
                          <p className="text-eyebrow text-brand-700 uppercase">{study.client}</p>
                          <h2 className="font-display text-ink group-hover:text-brand-800 mt-2.5 text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight font-semibold tracking-tight transition-colors duration-300">
                            {study.title}
                          </h2>
                          <p className="text-muted mt-3 max-w-prose text-[0.9375rem] leading-relaxed">
                            {study.summary}
                          </p>
                        </div>
                        <span className="text-brand-700 mt-1 shrink-0">
                          <ArrowGlyph />
                        </span>
                      </div>

                      <dl className="border-hair mt-5 flex flex-wrap gap-x-10 gap-y-4 border-t pt-5">
                        {study.metrics.slice(0, 3).map((metric) => (
                          <div key={metric.label}>
                            <dt className="sr-only">{metric.label}</dt>
                            <dd className="font-display text-brand-700 text-[1.375rem] leading-none font-semibold">
                              {metric.prefix}
                              {metric.value.toLocaleString("en-US")}
                              {metric.suffix}
                            </dd>
                            <p className="text-muted mt-1.5 max-w-[16ch] text-[0.8125rem] leading-snug">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </dl>
                    </Link>
                  </article>
                </RevealItem>
              );
            })}
          </RevealGroup>
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
