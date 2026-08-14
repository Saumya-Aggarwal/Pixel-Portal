import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";

/**
 * Closing conversion block, shared by the home, category, and service pages.
 * One component means the primary CTA is phrased and styled identically
 * wherever a visitor reaches the end of a page.
 */
export function CtaSection({
  eyebrow = "Next step",
  heading = "Tell us what you are trying to build.",
  body = "Fifteen minutes on a call is usually enough to know whether we are the right team for it. If we are not, we will say so.",
  primaryLabel = "Start a project",
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  primaryLabel?: string;
}) {
  return (
    <Section spacing="loose" className="relative">
      {/* The clip lives on this layer rather than on the section itself, so
          the bloom's overhang is contained without the section box itself
          becoming a clipping context for anything placed on its edges. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="grid-field absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]" />
        <div className="bg-brand-200/30 absolute -bottom-56 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal y={0}>
            <Eyebrow withRule={false} className="justify-center">
              {eyebrow}
            </Eyebrow>
          </Reveal>

          <TextReveal
            as="h2"
            className="font-display text-h1 text-ink mt-6 font-semibold"
          >
            {heading}
          </TextReveal>

          <Reveal delay={0.12}>
            <p className="text-lead text-muted mx-auto mt-6 max-w-xl">{body}</p>
          </Reveal>

          <Reveal delay={0.22} className="mt-10">
            <div className="flex flex-wrap justify-center gap-2">
              <Magnetic strength={0.32} padding={10}>
                <Button href="/contact" size="lg" className="group">
                  {primaryLabel}
                  <ArrowGlyph />
                </Button>
              </Magnetic>
              <Magnetic strength={0.22} padding={10}>
                <Button href="/about" size="lg" variant="outline" className="group">
                  Meet the team
                  <ArrowGlyph />
                </Button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
