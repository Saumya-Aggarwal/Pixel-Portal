import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Layout";
import { clientNames } from "@/content/site";

/**
 * Client ticker. Set in the display face rather than logo images — placeholder
 * logos look worse than none, and typographic treatment is the more premium
 * choice regardless.
 */
export function ClientStrip() {
  return (
    <section aria-label="Selected clients" className="border-hair border-t bg-white py-8">
      <Container wide className="mb-6">
        {/* `Eyebrow`'s own rule is a left-hand tick, which reads as a hanging
            indent once the label is centred — so this one is set plainly. */}
        <Reveal y={0}>
          <p className="text-eyebrow text-muted text-center uppercase">Trusted by teams at</p>
        </Reveal>
      </Container>

      <div className="relative">
        <Marquee speed={38}>
          {clientNames.map((name) => (
            <span
              key={name}
              className="font-display text-ink/25 hover:text-brand-600 flex items-center gap-10 px-8 text-[clamp(1.25rem,2.5vw,1.875rem)] font-semibold tracking-tight whitespace-nowrap transition-colors duration-500"
            >
              {name}
              <span aria-hidden className="bg-brand-300 h-1.5 w-1.5 rounded-full" />
            </span>
          ))}
        </Marquee>

        {/* Fade the ticker into the page edges instead of cutting it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent"
        />
      </div>
    </section>
  );
}
