import Link from "next/link";

import { Icon } from "@/components/icons";
import { LiftCard } from "@/components/motion/LiftCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ArrowGlyph } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";
import { getCategories } from "@/lib/content";

/**
 * The three service pillars — the primary route into the category tree.
 */
export async function ServicePillars() {
  const categories = await getCategories();

  return (
    <Section spacing="loose">
      <Container wide>
        <div className="grid grid-cols-12 items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Reveal y={0}>
              <Eyebrow>What we do</Eyebrow>
            </Reveal>
            <TextReveal
              as="h2"
              className="font-display text-h1 text-ink mt-6 max-w-[18ch] font-semibold"
            >
              Three disciplines, run as one practice.
            </TextReveal>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:pb-2">
            <Reveal delay={0.1}>
              <p className="text-lead text-muted lg:text-right">
                Most agencies hand you off between them. We do not — the people who plan the
                work are in the room when it ships.
              </p>
            </Reveal>
          </div>
        </div>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {categories.map((category) => (
            <RevealItem key={category.slug}>
              <LiftCard className="rounded-panel h-full">
                <Link
                  href={`/${category.slug}`}
                  className="group border-hair rounded-panel hover:border-brand-200 relative flex h-full flex-col overflow-hidden border bg-white p-8 transition-colors duration-500 lg:p-10"
                >
                  {/* Green wash that rises on hover */}
                  <span
                    aria-hidden
                    className="from-brand-50 pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t to-transparent transition-all duration-700 ease-out-expo group-hover:h-2/3"
                  />

                  <span className="relative">
                    <span className="text-brand-600 bg-brand-50 group-hover:bg-brand-500 grid h-14 w-14 place-items-center rounded-2xl transition-colors duration-500 group-hover:text-white">
                      <Icon name={category.icon} size={26} />
                    </span>

                    <span className="text-eyebrow text-brand-700 mt-8 block uppercase">
                      {category.eyebrow}
                    </span>

                    <h3 className="font-display text-h3 text-ink mt-3 font-semibold">
                      {category.title}
                    </h3>

                    <span className="text-muted mt-4 block text-[0.9375rem] leading-relaxed">
                      {category.description}
                    </span>
                  </span>

                  <span className="relative mt-8 flex-1">
                    <ul className="space-y-2">
                      {category.services.slice(0, 3).map((service) => (
                        <li
                          key={service.slug}
                          className="text-ink-soft flex items-center gap-2.5 text-[0.875rem]"
                        >
                          <svg
                            aria-hidden
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="text-brand-400 shrink-0"
                          >
                            <path
                              d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {service.navTitle ?? service.title}
                        </li>
                      ))}
                    </ul>
                    {category.services.length > 3 && (
                      <span className="text-muted mt-3 block text-[0.8125rem]">
                        +{category.services.length - 3} more services
                      </span>
                    )}
                  </span>

                  <span className="text-brand-700 relative mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-medium">
                    Explore {category.title}
                    <ArrowGlyph />
                  </span>
                </Link>
              </LiftCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
