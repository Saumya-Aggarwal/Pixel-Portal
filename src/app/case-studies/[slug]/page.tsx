import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { StatRail } from "@/components/sections/StatRail";
import { ArrowGlyph } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";
import { getCaseStudies, getCaseStudy, getServicesBySlugs } from "@/lib/content";

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

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const [services, all] = await Promise.all([
    getServicesBySlugs(study.services),
    getCaseStudies(),
  ]);

  const others = all.filter((s) => s.slug !== study.slug).slice(0, 2);

  return (
    <>
      <PageHero
        eyebrow={`${study.client} · ${study.industry}`}
        heading={study.title}
        body={study.summary}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/case-studies" },
          { label: study.client, href: `/case-studies/${study.slug}` },
        ]}
      >
        <Reveal delay={0.3} className="mt-14">
          <ParallaxImage
            alt={`${study.client} — ${study.title}`}
            seed={study.slug}
            aspect="aspect-[16/9]"
            className="rounded-panel"
            strength={8}
            sizes="100vw"
            priority
          />
        </Reveal>
      </PageHero>

      {/* ---- Metric band ---- */}
      <Section spacing="tight" className="bg-paper">
        <Container wide>
          <StatRail items={study.metrics} size="sm" labelWidth="max-w-[20ch]" />
        </Container>
      </Section>

      {/* ---- Challenge ---- */}
      <Section spacing="base">
        <Container wide>
          <div className="grid grid-cols-12 gap-y-8 lg:gap-x-16">
            <div className="col-span-12 lg:col-span-4">
              <Reveal y={0}>
                <Eyebrow>The challenge</Eyebrow>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-8">
              <TextReveal
                as="h2"
                className="font-display text-h3 text-ink max-w-[30ch] font-semibold"
              >
                {study.challenge}
              </TextReveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- Approach ---- */}
      <Section spacing="base">
        <Container wide>
          <div className="grid grid-cols-12 gap-y-10 lg:gap-x-16">
            <div className="col-span-12 lg:col-span-4">
              <Reveal y={0}>
                <Eyebrow>What we did</Eyebrow>
              </Reveal>

              <div className="mt-8">
                <p className="text-eyebrow text-ink uppercase">Services applied</p>
                <ul className="mt-4 space-y-2">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/${service.category}/${service.slug}`}
                        className="text-brand-700 hover:text-brand-900 group inline-flex min-h-11 items-center gap-2 text-[0.9375rem]"
                      >
                        {service.navTitle ?? service.title}
                        <ArrowGlyph />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <RevealGroup className="divide-hair divide-y" stagger={0.09}>
                {study.approach.map((item, index) => (
                  <RevealItem key={item}>
                    <div className="flex items-baseline gap-6 py-6">
                      <span
                        aria-hidden
                        className="text-brand-300 font-display w-8 shrink-0 text-[0.875rem] font-semibold tabular-nums"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-ink text-[1.0625rem] leading-relaxed">{item}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- Gallery ---- */}
      <Section spacing="base">
        <Container wide>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-5">
              <ParallaxImage
                alt={`${study.client} interface detail`}
                seed={`${study.slug}-detail-a`}
                aspect="aspect-[4/5]"
                className="rounded-panel"
                strength={11}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="col-span-12 lg:col-span-7 lg:mt-20">
              <ParallaxImage
                alt={`${study.client} platform overview`}
                seed={`${study.slug}-detail-b`}
                aspect="aspect-[16/11]"
                className="rounded-panel"
                strength={-9}
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- Next studies ---- */}
      <Section spacing="base" className="bg-paper">
        <Container wide>
          <Reveal y={0}>
            <Eyebrow>Keep reading</Eyebrow>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-8 lg:grid-cols-2">
            {others.map((other) => (
              <RevealItem key={other.slug}>
                <Link href={`/case-studies/${other.slug}`} className="group block">
                  <div className="rounded-panel overflow-hidden">
                    <ParallaxImage
                      alt={`${other.client} — ${other.title}`}
                      seed={other.slug}
                      aspect="aspect-[16/9]"
                      strength={8}
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>
                  <p className="text-eyebrow text-brand-700 mt-5 uppercase">{other.client}</p>
                  <h2 className="font-display text-ink group-hover:text-brand-800 mt-2.5 text-[1.25rem] leading-snug font-semibold transition-colors">
                    {other.title}
                  </h2>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
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
