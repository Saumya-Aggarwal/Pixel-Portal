import type { Metadata } from "next";

import { CountUp } from "@/components/motion/CountUp";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { TeamBento } from "@/components/sections/about/TeamBento";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Layout";
import { site, stats } from "@/content/site";
import { getDepartments, getTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pixel Portal is a fifty-person team across strategy, design, engineering, and delivery, working from Gurgaon.",
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
        heading="Fifty people who would rather build the thing than talk about it."
        body="Founded in 2016. One studio, one team, and a deliberate refusal to grow faster than we can hire well."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />

      {/* ---- Vision ---- */}
      <Section spacing="base" divider>
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
                  "That is also why we have stayed at fifty people. It is the largest size at which everyone still knows what everyone else is shipping.",
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
      <Section spacing="tight" className="bg-paper" divider>
        <Container wide>
          <RevealGroup className="divide-hair grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x">
            {stats.map((stat) => (
              <RevealItem key={stat.label} className="lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <p className="font-display text-brand-600 text-[clamp(2.5rem,5vw,4rem)] leading-none font-semibold tracking-tight">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-ink-soft mt-3.5 max-w-[18ch] text-[0.9375rem] leading-snug">
                  {stat.label}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- Team bento ---- */}
      <Section spacing="base" id="team" divider>
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
      <Section spacing="base" divider>
        <Container wide>
          <Reveal y={0}>
            <Eyebrow>How we operate</Eyebrow>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-x-8 gap-y-10 lg:grid-cols-3">
            {values.map((value, index) => (
              <RevealItem key={value.title}>
                <div className="border-hair border-t pt-6">
                  <span
                    aria-hidden
                    className="text-brand-300 font-display block text-[0.875rem] font-semibold tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-ink mt-4 text-[1.25rem] leading-tight font-semibold">
                    {value.title}
                  </h3>
                  <p className="text-muted mt-3 text-[0.9375rem] leading-relaxed">
                    {value.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- Careers ---- */}
      <Section spacing="base" className="bg-paper" divider>
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
