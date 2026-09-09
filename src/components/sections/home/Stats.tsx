import { StatRail } from "@/components/sections/StatRail";
import { Container, Section } from "@/components/ui/Layout";
import { stats } from "@/content/site";

/**
 * Headline numbers.
 *
 * The rail itself now lives in `StatRail`, shared with the about and case-study
 * pages. This is only its placement on the home page.
 */
export function Stats() {
  return (
    <Section spacing="base" divider>
      <Container wide>
        <StatRail items={stats} size="lg" align="center" />
      </Container>
    </Section>
  );
}
