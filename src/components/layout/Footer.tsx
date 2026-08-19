import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowGlyph } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { site } from "@/content/site";
import { getCategories } from "@/lib/content";

export async function Footer() {
  const categories = await getCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="border-hair mt-auto border-t bg-white">
      <Container wide>
        <RevealGroup className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 lg:grid-cols-12 lg:py-20">
          {/* Identity */}
          <RevealItem className="col-span-2 lg:col-span-4">
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

          {/* Service columns — generated, so they cannot drift from the nav */}
          {categories.map((category) => (
            <RevealItem key={category.slug} className="lg:col-span-2">
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

          {/* Contact */}
          <RevealItem className="col-span-2 lg:col-span-2">
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
              <address key={office.city} className="text-muted mt-5 text-[0.875rem] not-italic">
                <span className="text-ink block font-medium">{office.city}</span>
                {office.lines.map((line) => (
                  <span key={line} className="block leading-relaxed">
                    {line}
                  </span>
                ))}
              </address>
            ))}
          </RevealItem>
        </RevealGroup>

        {/* Closing CTA */}
        <Reveal y={0} className="border-hair border-t py-10">
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

        <div className="border-hair text-muted flex flex-col gap-3 border-t py-6 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p>
            Built with Next.js on Vercel.
          </p>
        </div>
      </Container>
    </footer>
  );
}
