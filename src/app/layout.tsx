import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProvider } from "@/components/motion/ScrollProvider";
import { site } from "@/content/site";
import "./globals.css";

/**
 * One face, everywhere — headings, body, UI, the hero.
 *
 * The site previously ran three: Bricolage for headings, Geist for body, and
 * Plus Jakarta for the home hero alone, which meant the home headline was set
 * in a different typeface from the headline on every other route. Three
 * families is also three sets of font files on a page whose first impression
 * is an animation, so consolidating buys back the request budget.
 *
 * Inter is the choice a global client roster argues for: it is the neutral
 * grotesque most international agency and product sites converge on, and its
 * Latin Extended coverage sets Central and Eastern European client names —
 * the Š, ő, ł, ț a roster like this actually contains — in the same face as
 * everything around them rather than dropping to a fallback mid-word.
 *
 * Subsets are `latin` + `latin-ext` and no more, which is a payload decision.
 * `next/font` emits a `<link rel="preload">` per declared subset rather than
 * leaving them to `unicode-range`, so every subset listed here is downloaded
 * on first paint whether or not the page sets a single glyph from it. Measured
 * on /about: these two cost 202KB, and adding Greek, Cyrillic, and Vietnamese
 * took it to 277KB for scripts no route currently sets. They are one word away
 * in this array on the day one genuinely needs them.
 *
 * `opsz` is declared explicitly and is the reason one family can do both jobs:
 * it optically tightens spacing and thins the strokes as size climbs, so the
 * 80px h1 does not read as body copy inflated and the 15px paragraph does not
 * read as a headline shrunk. Without the axis listed, next/font ships a
 * weight-only instance and `font-optical-sizing` silently does nothing.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
    >
      <head>
        {/*
          Motion serialises `initial={{ opacity: 0 }}` into the server-rendered
          markup, so roughly two dozen elements arrive hidden and are only
          revealed once hydration runs. If JavaScript is disabled or the bundle
          fails, the page renders almost entirely blank.

          The content is in the DOM either way — crawlers are unaffected — but a
          reader without JS should still get the page, so force those elements
          visible when scripting is off.

          The hero's boot sequence needs two more rules. It server-renders in
          its first phase, so without hydration to advance it the brand tile
          would sit pinned over the page forever and the 3D core would never
          leave the middle of the screen. Drop the tile and return the core to
          the column — the same end state the sequence would have reached.
        */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}
[data-boot="overlay"]{display:none!important}
[data-boot="core"]{position:relative!important;inset:auto!important;margin:0!important;width:100%!important;z-index:auto!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col bg-white">
        <ScrollProvider>
          <Header />
          {/* Offsets the fixed header. Pages that want the hero to run under
              the header opt out with a negative margin of their own. */}
          <main id="main" className="flex-1 pt-18 lg:pt-20">
            {children}
          </main>
          <Footer />
        </ScrollProvider>
      </body>
    </html>
  );
}
