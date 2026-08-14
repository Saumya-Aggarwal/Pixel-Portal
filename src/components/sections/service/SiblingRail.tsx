import Link from "next/link";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowGlyph } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";


/**
 * The rest of a category, at the foot of one of its service pages.
 *
 * This replaced four bare text columns, and the reason it is a numbered rail
 * rather than another card grid is that it sits eight scrolls below a page that
 * is already almost entirely card grids. The category page one level up leads
 * every service with an icon tile; the mega-menu does the same. A third icon
 * grid would read as the same block appearing for the third time.
 *
 * So the ornament here is the index, which is the one treatment nothing else on
 * the site uses — and the titles carry the weight instead. Large type is the
 * cheapest thing there is for making a list of links look considered, and it is
 * also simply the more useful surface: this block's whole job is to get a
 * reader to the next service, and titles you can scan at a glance do that
 * better than a paragraph each.
 *
 * A server component. Every hover response below is CSS on `group`, so none of
 * this needs to ship as JavaScript.
 */
export interface RailItem {
  href: string;
  title: string;
  tagline: string;
}

export function SiblingRail({
  heading,
  items,
  action,
}: {
  heading: string;
  /** The current page is already filtered out by the caller. */
  items: RailItem[];
  /** Optional link on the heading rule — omitted where there is nothing to link to. */
  action?: { href: string; label: string };
}) {
  if (items.length === 0) return null;

  return (
    <Section spacing="base">
      <Container wide>
        <Reveal y={0}>
          <div className="border-hair flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b pb-6">
            <h2 className="font-display text-h3 text-ink font-semibold tracking-tight">
              {heading}
            </h2>
            {/* Missing until now: a service page offered no way back up to its
                own category except the header. Optional, because the category
                variant of this rail has no index page to point at. */}
            {action && (
              <Link
                href={action.href}
                className="group text-brand-700 hover:text-brand-800 inline-flex items-center gap-2 text-[0.9375rem] font-medium transition-colors"
              >
                {action.label}
                <ArrowGlyph />
              </Link>
            )}
          </div>
        </Reveal>

        <RevealGroup className="mt-2" stagger={0.07}>
          {items.map((item, index) => (
            <RevealItem key={item.href} className="border-hair border-b">
              <Link
                href={item.href}
                className="group relative flex items-center gap-5 py-6 lg:gap-8 lg:py-7"
              >
                {/* Wash and accent both sit behind the content, which is why
                    every content node below carries `relative`. Bleeding the
                    wash past the container gutters is what stops it reading as
                    a button and keeps it reading as a row of a table. */}
                <span
                  aria-hidden
                  className="bg-brand-50/70 pointer-events-none absolute inset-y-0 -right-4 -left-4 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                {/* Drawn from the left rather than faded in — the row's own
                    hairline lighting up under the cursor, not a second border
                    appearing on top of it. */}
                <span
                  aria-hidden
                  className="bg-brand-400 ease-out-expo pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
                />

                <span className="text-muted group-hover:text-brand-600 relative w-8 shrink-0 text-[0.8125rem] font-medium tabular-nums transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="relative min-w-0 flex-1 lg:flex lg:items-baseline lg:gap-8">
                  <span className="font-display text-ink group-hover:text-brand-800 ease-out-expo block text-[1.25rem] leading-tight font-semibold tracking-tight transition-all duration-500 group-hover:translate-x-1 sm:text-[1.4375rem] lg:w-[19rem] lg:shrink-0 lg:text-[1.5rem]">
                    {item.title}
                  </span>
                  {/* Capped rather than left to fill the row. The container
                      runs to 1600px, and a nine-word tagline stretched across
                      what is left of that reads as a stray line of text; the
                      gap it leaves before the arrow is deliberate. */}
                  <span className="text-muted mt-1.5 block text-[0.9375rem] leading-snug text-balance lg:mt-0 lg:max-w-[34rem] lg:flex-1">
                    {item.tagline}
                  </span>
                </span>

                <span className="border-hair text-brand-700 group-hover:border-brand-500 group-hover:bg-brand-500 relative grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-500 group-hover:text-white">
                  <ArrowGlyph />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
