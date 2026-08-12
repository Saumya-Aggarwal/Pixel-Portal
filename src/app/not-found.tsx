import Link from "next/link";

import { ArrowGlyph, Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { getCategories } from "@/lib/content";

export default async function NotFound() {
  const categories = await getCategories();

  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,black,transparent)]"
      />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow withRule={false} className="justify-center">
            Error 404
          </Eyebrow>

          <p
            aria-hidden
            className="font-display text-brand-500 mt-8 text-[clamp(5rem,18vw,11rem)] leading-none font-semibold tracking-tight"
          >
            404
          </p>

          <h1 className="font-display text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-semibold tracking-tight">
            That page has moved, or never existed.
          </h1>

          <p className="text-lead text-muted mx-auto mt-5 max-w-md">
            Either way, the links below will get you where you were going.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <Button href="/" size="lg" className="group">
              Back to home
              <ArrowGlyph />
            </Button>
            <Button href="/contact" size="lg" variant="outline" className="group">
              Contact us
              <ArrowGlyph />
            </Button>
          </div>

          <nav aria-label="Service categories" className="border-hair mt-14 border-t pt-8">
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
        </div>
      </Container>
    </section>
  );
}
