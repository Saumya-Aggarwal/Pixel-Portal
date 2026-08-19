import Link from "next/link";

import { BackdropIn } from "@/components/motion/BackdropIn";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { getCategories } from "@/lib/content";

/**
 * Delay ladder, same idea as `PageHero`'s: everything here is above the fold
 * on arrival, so each piece animates on mount rather than waiting on scroll.
 */
const LADDER = {
  eyebrow: 0.1,
  numeral: 0.18,
  heading: 0.26,
  body: 0.4,
  actions: 0.5,
  nav: 0.6,
} as const;

export default async function NotFound() {
  const categories = await getCategories();

  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      <BackdropIn
        to={0.6}
        duration={0.8}
        className="grid-field pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,black,transparent)]"
      />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal y={0} delay={LADDER.eyebrow}>
            <Eyebrow withRule={false} className="justify-center">
              Error 404
            </Eyebrow>
          </Reveal>

          <Reveal delay={LADDER.numeral}>
            <p
              aria-hidden
              className="font-display text-brand-500 mt-8 text-[clamp(5rem,18vw,11rem)] leading-none font-semibold tracking-tight"
            >
              404
            </p>
          </Reveal>

          <TextReveal
            as="h1"
            immediate
            delay={LADDER.heading}
            className="font-display text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-semibold tracking-tight"
          >
            That page has moved, or never existed.
          </TextReveal>

          <Reveal delay={LADDER.body}>
            <p className="text-lead text-muted mx-auto mt-5 max-w-md">
              Either way, the links below will get you where you were going.
            </p>
          </Reveal>

          <Reveal delay={LADDER.actions} className="mt-10">
            <div className="flex flex-wrap justify-center gap-2">
              <Button href="/" size="lg" className="group">
                Back to home
                <ArrowGlyph />
              </Button>
              <Button href="/contact" size="lg" variant="outline" className="group">
                Contact us
                <ArrowGlyph />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={LADDER.nav} className="border-hair mt-14 border-t pt-8">
            <nav aria-label="Service categories">
              <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/${category.slug}`}
                      className="text-brand-700 hover:text-brand-900 inline-flex min-h-11 items-center text-[0.9375rem] font-medium"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
