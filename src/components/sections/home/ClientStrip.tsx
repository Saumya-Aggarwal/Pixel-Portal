import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Layout";
import { clients } from "@/content/clients";

/**
 * Client ticker. Real logos, held to greyscale/low-opacity by default so the
 * mixed formats (svg/png/webp) and source dimensions still read as one row —
 * full colour only reveals on hover. Plain `<img>` rather than `next/image`:
 * the logos are served from sixteen different client domains, several with
 * URLs Vercel's image optimiser cannot re-encode (Next's own `_next/image`
 * proxy URL, a Wix CDN transform URL), so remote-pattern allowlisting would
 * not even cover every case.
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
          {clients.map((client) => (
            <span key={client.name} className="flex shrink-0 items-center px-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                decoding="async"
                className="h-7 w-auto max-w-36 object-contain opacity-50 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
              />
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
