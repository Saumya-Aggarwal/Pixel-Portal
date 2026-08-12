import Link from "next/link";

import { Icon } from "@/components/icons";
import { BackdropIn } from "@/components/motion/BackdropIn";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Container, Eyebrow } from "@/components/ui/Layout";
import type { IconName } from "@/types/content";

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Interior page hero, shared by category, service, about, case study, and
 * contact pages. Consistent entry rhythm across every route without each page
 * reinventing a masthead.
 *
 * Everything here animates on mount rather than on scroll — it is above the
 * fold on arrival, so a scroll trigger would either fire instantly anyway or,
 * worse, never fire for a reader who does not scroll. The delays below are one
 * hand-tuned ladder shared by every interior route, which is what stops six
 * different pages from each feeling like a slightly different website.
 *
 * It layers under the route transition in `app/template.tsx`: that fades the
 * page in as a whole, this gives the masthead its internal cascade. Keeping
 * the two separate is why the transition can stay opacity-only.
 */
const LADDER = {
  crumbs: 0.1,
  eyebrow: 0.18,
  heading: 0.26,
  body: 0.4,
} as const;

export function PageHero({
  eyebrow,
  heading,
  body,
  icon,
  crumbs,
  children,
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  icon?: IconName;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-14 pb-16 lg:pt-20 lg:pb-24">
      {/* The ground settles first, then the type arrives on it — the grid
          leads by a beat and the bloom trails, so the backdrop reads as depth
          rather than as two layers switching on together. */}
      <BackdropIn
        to={0.5}
        duration={0.7}
        className="grid-field pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_80%_at_30%_0%,black,transparent)]"
      />
      <BackdropIn
        delay={0.15}
        duration={1.1}
        className="bg-brand-200/25 pointer-events-none absolute -top-48 right-0 h-[30rem] w-[30rem] rounded-full blur-3xl"
      />

      <Container wide className="relative">
        {crumbs && crumbs.length > 0 && (
          <Reveal y={0} duration={0.5} delay={LADDER.crumbs}>
            <nav aria-label="Breadcrumb">
              <ol className="text-muted flex flex-wrap items-center gap-2 text-[0.8125rem]">
                {crumbs.map((crumb, index) => (
                  <li key={crumb.href} className="flex items-center gap-2">
                    {index > 0 && (
                      <span aria-hidden className="text-hair">
                        /
                      </span>
                    )}
                    <Link href={crumb.href} className="hover:text-brand-700 transition-colors">
                      {crumb.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        )}

        <div className="mt-8 grid grid-cols-12 items-end gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <Reveal y={0} delay={LADDER.eyebrow}>
              <div className="flex items-center gap-4">
                {icon && (
                  <span className="text-brand-600 bg-brand-50 grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                    <Icon name={icon} size={24} />
                  </span>
                )}
                <Eyebrow withRule={!icon}>{eyebrow}</Eyebrow>
              </div>
            </Reveal>

            <TextReveal
              as="h1"
              immediate
              delay={LADDER.heading}
              className="font-display text-h1 text-ink mt-6 max-w-[17ch] font-semibold"
            >
              {heading}
            </TextReveal>
          </div>

          {body && (
            <div className="col-span-12 lg:col-span-4 lg:pb-2">
              <Reveal delay={LADDER.body}>
                <p className="text-lead text-muted">{body}</p>
              </Reveal>
            </div>
          )}
        </div>

        {children}
      </Container>
    </section>
  );
}
