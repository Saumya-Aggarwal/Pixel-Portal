/**
 * Site-wide constants: identity, contact details, and default SEO.
 */

export const site = {
  name: "Pixel Portal",
  /** Used for absolute URLs in metadata, sitemap, and OG tags. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixelportal.com",
  tagline: "Digital marketing, websites, and software — under one roof.",
  description:
    "Pixel Portal is a ten-person digital agency building demand, platforms, and bespoke software for companies that have outgrown off-the-shelf.",
  teamSize: 10,
  founded: 2024,
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
  { value: 10, suffix: "+", label: "Specialists across five disciplines" },
  { value: 2, suffix: "+", label: "Years building for clients" },
  { value: 100, suffix: "+", label: "Projects delivered" },
  { value: 3, suffix: "+", label: "Countries served" },
];
