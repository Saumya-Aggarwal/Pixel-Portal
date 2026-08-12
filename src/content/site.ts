/**
 * Site-wide constants: identity, contact details, and default SEO.
 */

export const site = {
  name: "Pixel Portal",
  /** Used for absolute URLs in metadata, sitemap, and OG tags. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixelportal.com",
  tagline: "Digital marketing, websites, and software — under one roof.",
  description:
    "Pixel Portal is a fifty-person digital agency building demand, platforms, and bespoke software for companies that have outgrown off-the-shelf.",
  teamSize: 50,
  founded: 2016,
  email: "Hello@pixelportal.in",
  phone: "+91 92203 95353",
  offices: [
    {
      city: "Gurgaon",
      country: "India",
      lines: ["Iris Tech Park", "Sector 48", "Gurgaon, Haryana"],
    },
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "YouTube", href: "https://www.youtube.com/" },
    { label: "X", href: "https://x.com/" },
  ],
} as const;

/** Headline numbers used on the home and about pages. */
export const stats = [
  { value: 50, label: "Specialists across five disciplines" },
  { value: 9, suffix: "+", label: "Years building for clients" },
  { value: 240, suffix: "+", label: "Projects delivered" },
  { value: 18, label: "Countries served" },
];

/** Marquee strip on the home page. Placeholder client names. */
export const clientNames = [
  "Northwind Supply",
  "Meridian Health",
  "Atlas Trade",
  "Verdant Living",
  "Halcyon Group",
  "Solaris Energy",
  "Kestrel Financial",
  "Orchard & Vine",
];
