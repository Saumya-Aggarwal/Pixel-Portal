import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icons";
import { LiftCard } from "@/components/motion/LiftCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ArrowGlyph } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";
import { getCategories, getCategory } from "@/lib/content";

/**
 * Category pages — three routes from one file.
 *
 * `dynamicParams = false` is what makes the flat top-level URL scheme safe:
 * every valid slug is enumerated at build time, so `/not-a-category` 404s
 * instead of rendering. Static segments like `/about` and `/contact` still win
 * over this dynamic segment in Next's route resolution order.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};

  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/${category.slug}` },
    openGraph: {
      title: `${category.title} — Pixel Portal`,
      description: category.description,
      url: `/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps<"/[category]">) {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  return (
    <>
      <PageHero
        eyebrow={category.eyebrow}
        heading={category.headline}
        body={category.description}
        icon={category.icon}
        crumbs={[
          { label: "Home", href: "/" },
          { label: category.title, href: `/${category.slug}` },
        ]}
      />

      {/* ---- Sub-service grid ---- */}
      <Section spacing="base" id="services" divider>
        <Container wide>
          <div className="grid grid-cols-12 items-end gap-y-6">
            <div className="col-span-12 lg:col-span-7">
              <Reveal y={0}>
                <Eyebrow>Capabilities</Eyebrow>
              </Reveal>
              <TextReveal
                as="h2"
                className="font-display text-h2 text-ink mt-6 max-w-[16ch] font-semibold"
              >
                {category.services.length} ways we work in {category.title.toLowerCase()}.
              </TextReveal>
            </div>
          </div>

          {/*
            Asymmetric by construction: the first card spans two columns on a
            six-column track and the rest fill around it, so a five- or
            four-item category still produces a composed block rather than a
            row with an orphan.
          */}
          <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {category.services.map((service, index) => (
              <RevealItem
                key={service.slug}
                className={index === 0 ? "lg:col-span-4" : "lg:col-span-2"}
              >
                <LiftCard className="rounded-panel h-full" tilt={4}>
                  <Link
                    href={`/${category.slug}/${service.slug}`}
                    className="group border-hair rounded-panel hover:border-brand-200 relative flex h-full flex-col overflow-hidden border bg-white p-7 transition-colors duration-500 lg:p-8"
                  >
                    <span
                      aria-hidden
                      className="from-brand-50 pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t to-transparent transition-all duration-700 ease-out-expo group-hover:h-full"
                    />

                    <span className="relative flex items-start justify-between gap-4">
                      <span className="text-brand-600 bg-brand-50 group-hover:bg-brand-500 grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors duration-500 group-hover:text-white">
                        <Icon name={service.icon} size={22} />
                      </span>
                      <span className="text-brand-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <ArrowGlyph />
                      </span>
                    </span>

                    <h3 className="font-display text-ink group-hover:text-brand-800 relative mt-7 text-[1.25rem] leading-tight font-semibold tracking-tight transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-brand-700 relative mt-2 text-[0.9375rem] font-medium">
                      {service.tagline}
                    </p>

                    <p className="text-muted relative mt-4 flex-1 text-[0.9375rem] leading-relaxed">
                      {service.description}
                    </p>

                    {index === 0 && (
                      <ul className="border-hair/70 relative mt-6 grid gap-2 border-t pt-5 sm:grid-cols-2">
                        {service.deliverables.slice(0, 4).map((item) => (
                          <li
                            key={item}
                            className="text-ink-soft flex items-start gap-2.5 text-[0.875rem]"
                          >
                            <span
                              aria-hidden
                              className="bg-brand-400 mt-2 h-px w-3.5 shrink-0"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Link>
                </LiftCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- Credibility strip ---- */}
      <Section spacing="tight" className="bg-paper" divider>
        <Container wide>
          <RevealGroup className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "One accountable team",
                body: "Strategy, design, and engineering sit together. No handoffs between agencies that do not speak.",
              },
              {
                title: "Fixed checkpoints",
                body: "Every phase has a written sign-off. You always know what is done and what is next.",
              },
              {
                title: "Built to be handed over",
                body: "Documentation and training are part of delivery, not an upsell after it.",
              },
            ].map((item) => (
              <RevealItem key={item.title}>
                <h3 className="font-display text-ink text-[1.125rem] font-semibold">
                  {item.title}
                </h3>
                <p className="text-muted mt-3 text-[0.9375rem] leading-relaxed">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Next step"
        heading={`Talk to the ${category.title.toLowerCase()} team.`}
        body="Tell us the outcome you need. We will tell you honestly whether this is the right service for it."
      />
    </>
  );
}
