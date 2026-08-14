import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";

const steps = [
  {
    title: "Discovery & architecture",
    description:
      "We map the commercial problem before the solution — sitemap, UX flow, and success measures agreed in writing.",
  },
  {
    title: "High-fidelity design",
    description:
      "Interface design and motion direction produced together, so the animation states are designed rather than added afterwards.",
  },
  {
    title: "Build & integration",
    description:
      "Frontend, backend, and CMS built in parallel against a shared component system, with preview environments from week one.",
  },
  {
    title: "QA, optimisation & launch",
    description:
      "Cross-browser and cross-device testing, performance budgets enforced, then deployment with monitoring in place.",
  },
];

/**
 * Process rail.
 *
 * The heading column is sticky on desktop and the steps scroll past it — the
 * section explains itself as you move through it, instead of presenting four
 * equal boxes and hoping the reader infers a sequence.
 */
export function Process() {
  return (
    <Section spacing="loose">
      <Container wide>
        <div className="grid grid-cols-12 gap-y-12 lg:gap-x-16">
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal y={0}>
                <Eyebrow>How we work</Eyebrow>
              </Reveal>
              <TextReveal
                as="h2"
                className="font-display text-h2 text-ink mt-6 max-w-[14ch] font-semibold"
              >
                A process that survives contact with reality.
              </TextReveal>
              <Reveal delay={0.1}>
                <p className="text-muted mt-6 max-w-sm text-[0.9375rem] leading-relaxed">
                  Five phases, fixed checkpoints, and no stage that begins before the previous
                  one is signed off.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <RevealGroup className="divide-hair divide-y" stagger={0.1}>
              {steps.map((step, index) => (
                <RevealItem key={step.title}>
                  <div className="group grid grid-cols-[auto_1fr] gap-6 py-8 lg:gap-10 lg:py-10">
                    <span
                      aria-hidden
                      className="font-display text-hair group-hover:text-brand-200 text-[clamp(2.5rem,5vw,4rem)] leading-none font-semibold tabular-nums transition-colors duration-500"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-ink text-h3 font-semibold">
                        {step.title}
                      </h3>
                      <p className="text-muted mt-3 max-w-xl text-[0.9375rem] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Container>
    </Section>
  );
}
