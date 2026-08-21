import type { Metadata } from "next";

import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { PrincipleCards } from "@/components/sections/PrincipleCards";
import { TrustPanel } from "@/components/sections/TrustPanel";
import { TeamBento } from "@/components/sections/about/TeamBento";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";
import { site } from "@/content/site";
import { getDepartments, getTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pixel Portal is a ten-person team across strategy, design, engineering, and delivery, working from Gurgaon.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Say the difficult thing early",
    body: "If a deadline is unrealistic or a brief is pointed at the wrong problem, you hear it in week one rather than at handover.",
  },
  {
    title: "One team, start to finish",
    body: "The people who scope the work build it. Nothing is thrown over a wall to a delivery unit you have never met.",
  },
  {
    title: "Leave it better than we found it",
    body: "Documentation, training, and clean handover are part of the engagement, not an upsell after the invoice.",
  },
];

export default async function AboutPage() {
  const [team, departments] = await Promise.all([getTeam(), getDepartments()]);

  return (
    <>
      <PageHero
        eyebrow="About us"
        heading="Ten people who would rather build the thing than talk about it."
        body="Founded in 2024. One studio, one team, and a deliberate refusal to grow faster than we can hire well."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />

      {/* ---- Vision ---- */}
      <Section spacing="base">
        <Container wide>
          <div className="grid grid-cols-12 gap-y-12 lg:gap-x-16">
            <div className="col-span-12 lg:col-span-5">
              <Reveal y={0}>
                <Eyebrow>Why we exist</Eyebrow>
              </Reveal>
              <TextReveal
                as="h2"
                className="font-display text-h2 text-ink mt-6 max-w-[13ch] font-semibold"
              >
                Agencies fragment. We deliberately did not.
              </TextReveal>
            </div>

            <div className="col-span-12 lg:col-span-7">
              <RevealGroup className="space-y-5">
                {[
                  "Most companies end up with a media agency that does not talk to a web agency that does not talk to whoever built the internal tooling. The seams between them are where budgets disappear.",
                  "Pixel Portal was built to remove those seams. Demand generation, platform engineering, and bespoke software sit in one company, under one commercial relationship, with one team accountable for the outcome.",
                  "That is also why we have stayed at ten people. It is the largest size at which everyone still knows what everyone else is shipping.",
                ].map((paragraph) => (
                  <RevealItem key={paragraph} y={20}>
                    <p className="text-lead text-muted">{paragraph}</p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>

          {/* Offset image pair — intentionally uneven */}
          <div className="mt-16 grid grid-cols-12 gap-6 lg:mt-24">
            <div className="col-span-12 lg:col-span-7">
              <ParallaxImage
                alt="The Gurgaon studio"
                seed="studio-gurgaon"
                aspect="aspect-[16/10]"
                className="rounded-panel"
                strength={12}
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
            <div className="col-span-12 lg:col-span-5 lg:mt-16">
              <ParallaxImage
                alt="Inside the studio"
                seed="studio-gurgaon-interior"
                aspect="aspect-[4/5]"
                className="rounded-panel"
                strength={-9}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- Numbers ---- */}
      {/* `clients` on here but not on home: this page has no ClientStrip, so
          the marquee is the only place the roster appears. */}
      <TrustPanel clients className="bg-paper" />

      {/* ---- Team bento ---- */}
      <Section spacing="base" id="team">
        <Container wide>
          <div className="grid grid-cols-12 items-end gap-y-8">
            <div className="col-span-12 lg:col-span-7">
              <Reveal y={0}>
                <Eyebrow>The team</Eyebrow>
              </Reveal>
              <TextReveal
                as="h2"
                className="font-display text-h2 text-ink mt-6 max-w-[15ch] font-semibold"
              >
                {site.teamSize} specialists across five disciplines.
              </TextReveal>
            </div>
            <div className="col-span-12 lg:col-span-5 lg:pb-2">
              <Reveal delay={0.1}>
                <p className="text-muted lg:text-right">
                  Strategy, design, engineering, and delivery — plus the leadership who still
                  sit on client calls.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="mt-12">
            <TeamBento members={team} departments={departments} />
          </div>
        </Container>
      </Section>

      {/* ---- Values ---- */}
      <Section spacing="base">
        <Container wide>
          <Reveal y={0}>
            <Eyebrow>How we operate</Eyebrow>
          </Reveal>
          {/* The three cards below are all things a client normally discovers
              are missing only after signing — an unrealistic deadline nobody
              flagged, a delivery team they never met, a handover with no
              documentation. The heading names that pattern so the cards land as
              answers to something rather than as three assertions in a row. */}
          <TextReveal
            as="h2"
            className="font-display text-h2 text-ink mt-6 max-w-[16ch] font-semibold"
          >
            The things you usually find out too late.
          </TextReveal>

          <div className="mt-12 lg:mt-16">
            <PrincipleCards items={values} />
          </div>
        </Container>
      </Section>

      {/* ---- Careers ---- */}
      <Section spacing="base" className="bg-paper">
        <Container wide>
          <div className="grid grid-cols-12 items-center gap-y-8">
            <div className="col-span-12 lg:col-span-8">
              <Reveal y={0}>
                <Eyebrow>Careers</Eyebrow>
              </Reveal>
              <TextReveal
                as="h2"
                className="font-display text-h2 text-ink mt-6 max-w-[18ch] font-semibold"
              >
                We hire slowly, and we mean it.
              </TextReveal>
              <Reveal delay={0.1}>
                <p className="text-muted mt-6 max-w-xl text-[0.9375rem] leading-relaxed">
                  There is no permanent pipeline of open roles here. When we do hire, it is
                  because a specific team needs a specific person — and the process is four
                  conversations, not eleven.
                </p>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:flex lg:justify-end">
              <Reveal delay={0.2}>
                <Button href={`mailto:${site.email}`} variant="outline" size="lg" className="group">
                  Send an introduction
                  <ArrowGlyph />
                </Button>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Work with us"
        heading="Bring us a problem worth solving."
        primaryLabel="Start a project"
      />
    </>
  );
}
