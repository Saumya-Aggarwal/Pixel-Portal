import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Accordion } from "@/components/ui/Accordion";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";
import type { ServiceSection } from "@/types/content";

/**
 * Renders a service page's optional rich blocks.
 *
 * This is the fidelity gradient in practice: a service with no `sections`
 * renders the base template, and authoring blocks in content raises that page
 * without forking the route component. Adding a new block type means extending
 * the `ServiceSection` union and adding one case here — the union makes the
 * exhaustiveness check a compile error rather than a blank section.
 */
export function ServiceSections({ sections }: { sections: ServiceSection[] }) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case "narrative":
            return (
              <Section key={index} spacing="base" divider>
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
                    <div className="col-span-12 lg:col-span-7 lg:pt-2">
                      <RevealGroup className="space-y-5">
                        {section.body.map((paragraph) => (
                          <RevealItem key={paragraph} y={20}>
                            <p className="text-lead text-muted">{paragraph}</p>
                          </RevealItem>
                        ))}
                      </RevealGroup>
                    </div>
                  </div>
                </Container>
              </Section>
            );

          case "metrics":
            return (
              <Section key={index} spacing="base" className="bg-paper" divider>
                <Container wide>
                  <Reveal y={0}>
                    <h2 className="font-display text-h3 text-ink max-w-[20ch] font-semibold">
                      {section.heading}
                    </h2>
                  </Reveal>
                  <RevealGroup className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
                    {section.items.map((metric) => (
                      <RevealItem key={metric.label}>
                        <p className="font-display text-brand-600 text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-semibold tracking-tight">
                          <CountUp
                            value={metric.value}
                            prefix={metric.prefix}
                            suffix={metric.suffix}
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
              <Section key={index} spacing="base" divider>
                <Container wide>
                  <Reveal y={0}>
                    <h2 className="font-display text-h2 text-ink max-w-[16ch] font-semibold">
                      {section.heading}
                    </h2>
                  </Reveal>
                  <RevealGroup
                    className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-4"
                    stagger={0.09}
                  >
                    {section.steps.map((step, stepIndex) => (
                      <RevealItem key={step.title}>
                        <div className="border-hair h-full border-t pt-6">
                          <span
                            aria-hidden
                            className="text-brand-300 font-display block text-[0.875rem] font-semibold tabular-nums"
                          >
                            {String(stepIndex + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-display text-ink mt-4 text-[1.125rem] leading-tight font-semibold">
                            {step.title}
                          </h3>
                          <p className="text-muted mt-3 text-[0.9375rem] leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </Container>
              </Section>
            );

          case "faq":
            return (
              <Section key={index} spacing="base" divider>
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
        }
      })}
    </>
  );
}
