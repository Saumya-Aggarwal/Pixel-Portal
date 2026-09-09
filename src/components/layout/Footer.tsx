import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { site } from "@/content/site";
import { getCategories, getNavigation } from "@/lib/content";

/**
 * Site footer.
 *
 * Desktop keeps the full service sitemap — useful once someone has scrolled
 * this far and is looking for a specific offering.
 *
 * Mobile does not. A two-column dump of every service is the usual agency
 * footer failure on a phone. Below `lg` this follows the compact pattern used
 * by Linear, Vercel, and Stripe: brand, the same primary destinations as the
 * header, one clear CTA, contact, social, legal. No second mega-menu.
 */
export async function Footer() {
  const [categories, nav] = await Promise.all([
    getCategories(),
    getNavigation(),
  ]);
  const year = new Date().getFullYear();

  return (
    <footer className="border-hair mt-auto border-t bg-white">
      <Container wide>
        {/* ---- Mobile ------------------------------------------------------ */}
        <div className="flex flex-col gap-10 py-12 lg:hidden">
          <div>
            <Link
              href="/"
              aria-label="Pixel Portal — home"
              className="inline-flex"
            >
              <Logo />
            </Link>
            <p className="text-muted mt-4 max-w-[28ch] text-[0.9375rem] leading-relaxed">
              {site.tagline}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink hover:text-brand-700 flex min-h-11 items-center text-[0.9375rem] font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button href="/contact" size="md" className="w-full">
            Start a project
            <ArrowGlyph />
          </Button>

          <div className="space-y-3">
            <a
              href={`mailto:${site.email}`}
              className="text-ink hover:text-brand-700 block text-[0.9375rem] font-medium transition-colors"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="text-muted hover:text-brand-700 block text-[0.9375rem] transition-colors"
            >
              {site.phone}
            </a>
            {site.offices.map((office) => (
              <p
                key={office.city}
                className="text-muted text-[0.875rem] leading-relaxed"
              >
                {office.city}
                <span className="text-hair mx-2" aria-hidden>
                  ·
                </span>
                {office.country}
              </p>
            ))}
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {site.social.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-brand-700 hover:text-brand-900 inline-flex min-h-11 items-center text-[0.875rem] font-medium transition-colors"
                >
                  {channel.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- Desktop: full sitemap --------------------------------------- */}
        <RevealGroup className="hidden grid-cols-12 gap-x-8 gap-y-12 py-20 lg:grid">
          <RevealItem className="col-span-4">
            <Link href="/" aria-label="Pixel Portal — home">
              <Logo />
            </Link>
            <p className="text-muted mt-5 max-w-xs text-[0.9375rem] leading-relaxed">
              {site.description}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {site.social.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-brand-700 hover:text-brand-900 inline-flex min-h-11 items-center text-[0.875rem] font-medium transition-colors"
                  >
                    {channel.label}
                  </a>
                </li>
              ))}
            </ul>
          </RevealItem>

          {categories.map((category) => (
            <RevealItem key={category.slug} className="col-span-2">
              <nav aria-label={category.title}>
                <h2 className="text-eyebrow text-ink uppercase">
                  <Link
                    href={`/${category.slug}`}
                    className="hover:text-brand-700 transition-colors"
                  >
                    {category.title}
                  </Link>
                </h2>
                <ul className="mt-4 space-y-1">
                  {category.services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/${category.slug}/${service.slug}`}
                        className="text-muted hover:text-brand-700 flex min-h-9 items-center text-[0.875rem] leading-snug transition-colors"
                      >
                        {service.navTitle ?? service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </RevealItem>
          ))}

          <RevealItem className="col-span-2">
            <h2 className="text-eyebrow text-ink uppercase">Contact</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-muted hover:text-brand-700 text-[0.875rem] transition-colors"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="text-muted hover:text-brand-700 text-[0.875rem] transition-colors"
                >
                  {site.phone}
                </a>
              </li>
            </ul>
            {site.offices.map((office) => (
              <address
                key={office.city}
                className="text-muted mt-5 text-[0.875rem] not-italic"
              >
                <span className="text-ink block font-medium">
                  {office.city}
                </span>
                {office.lines.map((line) => (
                  <span key={line} className="block leading-relaxed">
                    {line}
                  </span>
                ))}
              </address>
            ))}
          </RevealItem>
        </RevealGroup>

        {/* Closing CTA — desktop only; mobile already has the primary button. */}
        <Reveal y={0} className="border-hair hidden border-t py-10 lg:block">
          <Link
            href="/contact"
            className="group flex flex-wrap items-baseline justify-between gap-4"
          >
            <span className="font-display text-ink group-hover:text-brand-700 text-[clamp(1.75rem,4vw,3rem)] leading-none font-semibold tracking-tight transition-colors duration-300">
              Have something in mind?
            </span>
            <span className="text-brand-700 inline-flex items-center gap-2 text-[0.9375rem] font-medium">
              Start a project
              <ArrowGlyph />
            </span>
          </Link>
        </Reveal>

        <div className="border-hair text-muted flex flex-col gap-2 border-t py-6 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          {/* The build credit and the platform note share a line: two separate
              rows of small print at the foot of a page is one row too many. */}
          <p className="flex items-center gap-2">
            <span>
              Designed by{" "}
              <a
                href="https://github.com/Saumya-Aggarwal"
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink-soft hover:text-brand-700 font-medium underline-offset-4 transition-colors hover:underline"
              >
                Saumya
              </a>
            </span>
            <span className="text-hair hidden sm:inline" aria-hidden>
              ·
            </span>
            <span className="hidden sm:inline">
              Built with Next.js on Vercel.
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
