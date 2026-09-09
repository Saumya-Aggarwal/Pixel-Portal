import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { StatRail } from "@/components/sections/StatRail";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";
import { clients as clientLogos } from "@/content/clients";
import { site, stats } from "@/content/site";

/**
 * The credibility surface: headline numbers, verifiable facts, client names.
 *
 * Every figure on it already existed in `content/site.ts` — project count,
 * headcount, years, countries, founding year, office. Nothing here was invented
 * for the sake of filling the panel, which matters more on this component than
 * anywhere else on the site: a trust surface carrying made-up numbers is worse
 * than no trust surface.
 *
 * That is also why the progress bar is opt-in. The reference design this is
 * modelled on shows "Client Satisfaction — 98%", and there is no measured
 * equivalent here. The bar renders only when `assurance` is passed; until
 * someone supplies a real figure, the panel simply does not have one. See
 * docs/CONTENT-TODO.md.
 *
 * The client row reuses the real logo marquee `ClientStrip` renders, just at
 * a smaller scale for this panel's tighter footprint.
 */
export function TrustPanel({
  assurance,
  clients = false,
  className,
}: {
  /** A measured percentage, if one exists. Omit rather than estimate. */
  assurance?: { label: string; value: number };
  /**
   * Show the client marquee. Off by default — the home page already runs
   * `ClientStrip` above the fold, and the same eight names twice on one page
   * reads as padding rather than reassurance.
   */
  clients?: boolean;
  className?: string;
}) {
  const facts = [
    `Founded ${site.founded}`,
    `${site.offices[0].city}, ${site.offices[0].country}`,
    `${site.teamSize} specialists`,
  ];

  return (
    <Section spacing="base" className={className} divider>
      <Container wide>
        <Reveal y={0}>
          <div className="border-hair rounded-panel relative overflow-hidden border bg-white/70 backdrop-blur-sm">
            {/* Same grid ground and bloom the hero visuals use, so the panel
                reads as part of that family rather than a stray card. */}
            <span
              aria-hidden
              className="grid-field pointer-events-none absolute inset-0 opacity-60 mask-[radial-gradient(ellipse_70%_70%_at_50%_0%,black,transparent)]"
            />
            <span
              aria-hidden
              className="bg-brand-100/50 pointer-events-none absolute -top-32 right-0 size-80 rounded-full blur-3xl"
            />

            <div className="relative px-6 py-10 lg:px-12 lg:py-12">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Eyebrow>By the numbers</Eyebrow>
                <ul className="flex flex-wrap gap-2">
                  {facts.map((fact) => (
                    <li
                      key={fact}
                      className="border-hair text-ink-soft rounded-full border bg-white px-3 py-1.5 text-[0.8125rem] leading-none"
                    >
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              <StatRail items={stats} size="md" className="mt-10" />

              {assurance && (
                <div className="border-hair mt-10 border-t pt-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-ink-soft text-[0.9375rem]">{assurance.label}</span>
                    <span className="font-display text-brand-700 text-[1.125rem] leading-none font-semibold tabular-nums">
                      {assurance.value}%
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={assurance.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={assurance.label}
                    className="bg-hair mt-3 h-1.5 w-full overflow-hidden rounded-full"
                  >
                    <span
                      className="from-brand-400 to-brand-600 block h-full rounded-full bg-linear-to-r"
                      style={{ width: `${assurance.value}%` }}
                    />
                  </div>
                </div>
              )}

              {clients && (
              <div className="border-hair mt-10 border-t pt-8">
                <p className="text-eyebrow text-muted text-center uppercase">
                  Trusted by teams at
                </p>
                <Marquee speed={44} className="mt-5">
                  {clientLogos.map((client) => (
                    <span key={client.name} className="flex shrink-0 items-center px-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={client.logo}
                        alt={client.name}
                        loading="lazy"
                        decoding="async"
                        className="h-6 w-auto max-w-32 object-contain opacity-50 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                      />
                    </span>
                  ))}
                </Marquee>
              </div>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
