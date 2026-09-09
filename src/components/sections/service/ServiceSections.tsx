import { Icon } from "@/components/icons";
import { CountUp } from "@/components/motion/CountUp";
import { LiftCard } from "@/components/motion/LiftCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { TracingRail } from "@/components/motion/TracingRail";
import { ComparisonTable } from "@/components/sections/service/ComparisonTable";
import { Accordion } from "@/components/ui/Accordion";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";
import type { Capability, Pillar, ServiceSection } from "@/types/content";

/**
 * Renders a service page's optional rich blocks.
 *
 * This is the fidelity gradient in practice: a service with no `sections`
 * renders the base template, and authoring blocks in content raises that page
 * without forking the route component. Adding a new block type means extending
 * the `ServiceSection` union and adding one case here — the union makes the
 * exhaustiveness check a compile error rather than a blank section.
 *
 * Background tone is decided here from block position rather than authored per
 * block. Content should not have to know what colour the section above it was,
 * and alternating from the index guarantees the page keeps its rhythm however
 * the blocks are reordered.
 */
export function ServiceSections({ sections }: { sections: ServiceSection[] }) {
  return (
    <>
      {sections.map((section, index) => {
        const paper = index % 2 === 1;
        const tone = paper ? "bg-paper" : undefined;

        switch (section.type) {
          case "narrative":
            return (
              <Section key={index} spacing="base" className={tone} divider>
                <Container wide>
                  <div className="grid grid-cols-12 gap-y-8 lg:gap-x-16">
                    <div className="col-span-12 lg:col-span-5">
                      <Reveal y={0}>
                        <Eyebrow>{section.eyebrow}</Eyebrow>
                      </Reveal>
                      <TextReveal
                        as="h2"
                        className="font-display text-h2 text-ink mt-6 max-w-[14ch] font-semibold"
                      >
                        {section.heading}
                      </TextReveal>
                    </div>
                    {section.body && (
                      <div className="col-span-12 lg:col-span-7 lg:pt-2">
                        <RevealGroup className="space-y-5">
                          {section.body.map((paragraph) => (
                            <RevealItem key={paragraph} y={20}>
                              <p className="text-lead text-muted">{paragraph}</p>
                            </RevealItem>
                          ))}
                        </RevealGroup>
                      </div>
                    )}
                  </div>
                </Container>
              </Section>
            );

          case "metrics":
            return (
              <Section key={index} spacing="base" className={tone} divider>
                <Container wide>
                  <Reveal y={0}>
                    <h2 className="font-display text-h3 text-ink max-w-[20ch] font-semibold">
                      {section.heading}
                    </h2>
                  </Reveal>
                  <RevealGroup className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
                    {section.items.map((metric) => (
                      <RevealItem key={metric.label}>
                        {/* Tabular figures: a live counter that re-measures its
                            own width every two seconds makes the whole row
                            twitch sideways. */}
                        <p className="font-display text-brand-600 text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-semibold tracking-tight tabular-nums">
                          <CountUp
                            value={metric.value}
                            prefix={metric.prefix}
                            suffix={metric.suffix}
                            live={section.live}
                          />
                        </p>
                        <p className="text-ink-soft mt-3.5 max-w-[20ch] text-[0.9375rem] leading-snug">
                          {metric.label}
                        </p>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </Container>
              </Section>
            );

          case "process":
            return (
              <Section key={index} spacing="base" className={tone} divider>
                <Container wide>
                  <Reveal y={0}>
                    <h2 className="font-display text-h2 text-ink max-w-[16ch] font-semibold">
                      {section.heading}
                    </h2>
                  </Reveal>
                  <TracingRail steps={section.steps} className="mt-16 lg:mt-20" />
                </Container>
              </Section>
            );

          case "faq":
            return (
              <Section key={index} spacing="base" className={tone} divider>
                <Container>
                  <div className="mx-auto max-w-3xl">
                    <Reveal y={0}>
                      <h2 className="font-display text-h2 text-ink font-semibold">
                        {section.heading}
                      </h2>
                    </Reveal>
                    <Reveal delay={0.1} className="mt-10">
                      <Accordion items={section.items} />
                    </Reveal>
                  </div>
                </Container>
              </Section>
            );

          case "pillars":
            return (
              <Section key={index} spacing="tight" className={tone} divider>
                <Container wide>
                  <RevealGroup className="grid gap-5 lg:grid-cols-3" stagger={0.09}>
                    {section.items.map((pillar) => (
                      <RevealItem key={pillar.title} className="h-full">
                        <PillarCard pillar={pillar} />
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </Container>
              </Section>
            );

          case "capabilities":
            return (
              <Section key={index} spacing="base" className={tone} divider>
                <Container wide>
                  <div className="max-w-[60ch]">
                    <TextReveal
                      as="h2"
                      className="font-display text-h2 text-ink max-w-[18ch] font-semibold"
                    >
                      {section.heading}
                    </TextReveal>
                    {section.intro && (
                      <Reveal delay={0.1}>
                        <p className="text-lead text-muted mt-6">{section.intro}</p>
                      </Reveal>
                    )}
                  </div>
                  <RevealGroup
                    className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    stagger={0.06}
                  >
                    {section.items.map((capability) => (
                      <RevealItem key={capability.title} className="h-full">
                        <CapabilityCard capability={capability} />
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </Container>
              </Section>
            );

          case "tags":
            return (
              <Section key={index} spacing="base" className={tone} divider>
                <Container wide>
                  <div className="grid grid-cols-12 gap-y-10 lg:gap-x-16">
                    <div className="col-span-12 lg:col-span-5">
                      <TextReveal
                        as="h2"
                        className="font-display text-h2 text-ink max-w-[16ch] font-semibold"
                      >
                        {section.heading}
                      </TextReveal>
                      {section.intro && (
                        <Reveal delay={0.1}>
                          <p className="text-muted mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed">
                            {section.intro}
                          </p>
                        </Reveal>
                      )}
                    </div>
                    <div className="col-span-12 lg:col-span-7 lg:pt-3">
                      <RevealGroup className="flex flex-wrap gap-2.5" stagger={0.035}>
                        {section.items.map((tag) => (
                          <RevealItem key={tag} y={14}>
                            <span className="border-hair text-ink-soft ease-soft hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800 inline-flex rounded-full border px-4 py-2 text-[0.875rem] leading-none transition-colors duration-300">
                              {tag}
                            </span>
                          </RevealItem>
                        ))}
                      </RevealGroup>
                    </div>
                  </div>
                </Container>
              </Section>
            );

          case "checklist":
            return (
              <Section key={index} spacing="base" className={tone} divider>
                <Container wide>
                  <div className="grid grid-cols-12 gap-y-10 lg:gap-x-16">
                    <div className="col-span-12 lg:col-span-5">
                      <Reveal y={0}>
                        <Eyebrow>{section.eyebrow}</Eyebrow>
                      </Reveal>
                      <TextReveal
                        as="h2"
                        className="font-display text-h2 text-ink mt-6 max-w-[14ch] font-semibold"
                      >
                        {section.heading}
                      </TextReveal>
                      {section.body && (
                        <RevealGroup className="mt-8 space-y-5">
                          {section.body.map((paragraph) => (
                            <RevealItem key={paragraph} y={20}>
                              <p className="text-muted text-[1.0625rem] leading-relaxed">
                                {paragraph}
                              </p>
                            </RevealItem>
                          ))}
                        </RevealGroup>
                      )}
                    </div>
                    <div className="col-span-12 lg:col-span-7 lg:pt-2">
                      <RevealGroup className="divide-hair divide-y" stagger={0.07}>
                        {section.items.map((item) => (
                          <RevealItem key={item}>
                            <div className="flex items-start gap-4 py-4">
                              <span
                                aria-hidden
                                className="bg-brand-50 text-brand-700 mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-semibold"
                              >
                                ✓
                              </span>
                              <span className="text-ink text-[1.0625rem] leading-snug">{item}</span>
                            </div>
                          </RevealItem>
                        ))}
                      </RevealGroup>
                    </div>
                  </div>
                </Container>
              </Section>
            );

          case "comparison":
            return (
              <Section key={index} spacing="base" className={tone} divider>
                <Container>
                  <div className="mx-auto max-w-4xl">
                    <TextReveal
                      as="h2"
                      className="font-display text-h2 text-ink max-w-[18ch] font-semibold"
                    >
                      {section.heading}
                    </TextReveal>
                    {section.intro && (
                      <Reveal delay={0.1}>
                        <p className="text-muted mt-6 max-w-[54ch] text-[1.0625rem] leading-relaxed">
                          {section.intro}
                        </p>
                      </Reveal>
                    )}
                    <Reveal delay={0.15} className="mt-12">
                      <ComparisonTable columns={section.columns} rows={section.rows} />
                    </Reveal>
                  </div>
                </Container>
              </Section>
            );
        }
      })}
    </>
  );
}

/**
 * Value-proposition card. Sits directly under the hero, so it stays quiet.
 *
 * The visible surface is a child of `LiftCard`, not its className: LiftCard
 * puts `group/lift` on its own wrapper, and `group-hover/lift:` compiles to a
 * descendant selector, so utilities keyed off the hover have to live one level
 * in. Same arrangement in CapabilityCard below.
 */
function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <LiftCard className="rounded-card h-full" tilt={4} lift={6}>
      <div className="border-hair rounded-card group-hover/lift:border-brand-200 h-full border bg-white p-7 transition-colors duration-500">
        <span className="bg-brand-50 text-brand-700 ease-soft group-hover/lift:bg-brand-100 inline-flex size-11 items-center justify-center rounded-full transition-all duration-500 group-hover/lift:scale-110 group-hover/lift:rotate-6">
          <Icon name={pillar.icon} size={20} />
        </span>
        <h3 className="font-display text-ink mt-6 text-[1.0625rem] leading-snug font-semibold">
          {pillar.title}
        </h3>
        {pillar.body && (
          <p className="text-muted mt-2.5 text-[0.9375rem] leading-relaxed">{pillar.body}</p>
        )}
      </div>
    </LiftCard>
  );
}

/**
 * One of six capability cards.
 *
 * This is the densest hover on the site — sweep, spotlight, tilt, border shift
 * and a rotating icon at once — and it is deliberately confined to this grid.
 * Used everywhere it would read as noise; used on one grid per page it reads
 * as the page's most interactive surface.
 */
function CapabilityCard({ capability }: { capability: Capability }) {
  return (
    <LiftCard className="rounded-card h-full" tilt={5} lift={8} sweep>
      <div className="border-hair rounded-card group-hover/lift:border-brand-300 h-full border bg-white p-7 transition-colors duration-500">
        <span className="text-brand-600 ease-soft inline-flex transition-transform duration-500 group-hover/lift:scale-110 group-hover/lift:rotate-6">
          <Icon name={capability.icon} size={24} />
        </span>
        <h3 className="font-display text-ink group-hover/lift:text-brand-900 mt-7 text-[1.0625rem] leading-snug font-semibold transition-colors duration-500">
          {capability.title}
        </h3>
        {capability.body && (
          <p className="text-muted mt-3 text-[0.9375rem] leading-relaxed">{capability.body}</p>
        )}
      </div>
    </LiftCard>
  );
}
