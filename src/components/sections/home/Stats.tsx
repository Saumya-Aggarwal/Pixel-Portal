import { CountUp } from "@/components/motion/CountUp";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Container, Section } from "@/components/ui/Layout";
import { stats } from "@/content/site";

/**
 * Headline numbers.
 *
 * Set in brand-600, not the anchor. At this size the text qualifies as "large"
 * under WCAG, which needs 3:1 — brand-600 clears that at 4.27:1 while brand-500
 * would land at 2.87:1 and fail even the relaxed threshold.
 */
export function Stats() {
  return (
    <Section spacing="base" divider>
      <Container wide>
        {/* Centred in each cell rather than flush left. The columns are far
            wider than the numbers, so left-aligned content left a growing gap
            before each divider and the four items read as drifting apart
            instead of as one row. */}
        <RevealGroup className="divide-hair grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x">
          {stats.map((stat) => (
            <RevealItem key={stat.label} className="px-4 text-center lg:px-8">
              <p className="font-display text-brand-600 text-[clamp(2.75rem,6vw,4.5rem)] leading-none font-semibold tracking-tight">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-ink-soft mx-auto mt-4 max-w-[18ch] text-[0.9375rem] leading-snug">
                {stat.label}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
