import type { Metadata } from "next";

import { InquiryStepper } from "@/components/contact/InquiryStepper";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Layout";
import { site } from "@/content/site";
import { getCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Pixel Portal. A short onboarding questionnaire, and a reply within one working day.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        heading="Start with the problem, not the brief."
        body="Five short steps. It takes about three minutes and means our first reply is useful rather than a request for more information."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <Section spacing="base">
        <Container wide>
          <div className="grid grid-cols-12 gap-y-12 lg:gap-x-12">
            {/* Questionnaire */}
            <div className="col-span-12 lg:col-span-8">
              <Reveal y={20}>
                <InquiryStepper categories={categories} />
              </Reveal>
            </div>

            {/* Details rail */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Reveal delay={0.15}>
                  <div className="glass-tint rounded-panel p-7">
                    <h2 className="font-display text-ink text-[1.125rem] font-semibold">
                      Prefer to just email?
                    </h2>
                    <p className="text-muted mt-3 text-[0.9375rem] leading-relaxed">
                      That is fine too. Tell us what you are trying to build and we will pick it
                      up from there.
                    </p>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-brand-800 hover:text-brand-900 mt-5 inline-flex min-h-11 items-center text-[1rem] font-medium underline underline-offset-4"
                    >
                      {site.email}
                    </a>
                    <p className="mt-4">
                      <a
                        href={`tel:${site.phone.replace(/\s/g, "")}`}
                        className="text-ink-soft hover:text-brand-700 inline-flex min-h-11 items-center text-[0.9375rem]"
                      >
                        {site.phone}
                      </a>
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={0.25}>
                  <div className="mt-8 space-y-8">
                    {site.offices.map((office) => (
                      <div key={office.city}>
                        <h2 className="text-eyebrow text-brand-700 uppercase">
                          {office.city}, {office.country}
                        </h2>
                        <address className="text-muted mt-3 text-[0.9375rem] leading-relaxed not-italic">
                          {office.lines.map((line) => (
                            <span key={line} className="block">
                              {line}
                            </span>
                          ))}
                        </address>
                      </div>
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={0.35}>
                  <div className="border-hair mt-8 border-t pt-6">
                    <p className="text-muted text-[0.875rem] leading-relaxed">
                      We reply to every enquiry within one working day — including the ones we
                      are not the right fit for.
                    </p>
                  </div>
                </Reveal>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
