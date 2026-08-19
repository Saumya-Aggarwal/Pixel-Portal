export interface ClientLogo {
  name: string;
  logo: string;
}

/** Real client logos, hosted on each client's own domain. */
export const clients: ClientLogo[] = [
  {
    name: "CredXP",
    logo: "https://www.credxp.com/_next/image?url=%2Flogos%2FCredxp.webp&w=640&q=75&dpl=dpl_7guZQZXKPHr91JfsA6f7VkUpF1F8",
  },
  {
    name: "IAS Mentorship",
    logo: "https://iasmentorship.com/wp-content/themes/riyasat-theme/assets/banners/logo.png",
  },
  {
    name: "Desqworx",
    logo: "https://www.desqworx.com/media/images/logo.png",
  },
  {
    name: "Vivechna IAS",
    logo: "https://vivechnaias.com/wp-content/uploads/2025/12/logo-k40CLxQW-e1766581502964.png",
  },
  {
    name: "Web Dynamics",
    logo: "http://webdynamics.in/wp-content/uploads/2026/07/Web-Dynamics-logo.png",
  },
  {
    name: "Astra",
    logo: "https://static.wixstatic.com/media/7584dd_385274e33c3e4fe6be6ee46f07333e3a~mv2.png/v1/fill/w_228,h_104,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/astra%20final%20logo.png",
  },
  {
    name: "Kiser India",
    logo: "https://kiserindia.com/wp-content/uploads/2026/05/download-11-e1777877542138.png",
  },
  {
    name: "Kars Yanam",
    logo: "https://kars-yanam.com/wp-content/uploads/2025/04/KARS-YANAM-LOGO-2.svg",
  },
  {
    name: "Bikes Yanam",
    logo: "https://bikes-yanam.com/wp-content/uploads/2025/08/bikes-yanam.png",
  },
  {
    name: "Web Affino",
    logo: "https://admin.webaffino.com/wp-content/uploads/2025/11/web-affino-new-logo.png",
  },
  {
    name: "The Coupons Feed",
    logo: "https://thecouponsfeed.com/wp-content/uploads/2025/06/cropped-thecouponsfeedlogo-e1779109484367.png",
  },
  {
    name: "The Holiday Feed",
    logo: "https://theholidayfeed.com/wp-content/uploads/2025/06/Untitled-design-7.png",
  },
  {
    name: "Sports Resso",
    logo: "https://sportsresso.com/wp-content/uploads/2025/10/Gemini_Generated_Image_32nq8m32nq8m32nq-removebg-preview-e1761378716994.png",
  },
  {
    name: "Content Delight",
    logo: "https://contentdelight.com/wp-content/uploads/2025/09/Untitled20Image.webp",
  },
  {
    name: "The Digital Media Feed",
    logo: "https://thedigitalmediafeed.com/wp-content/uploads/2025/10/TDMF-Logo.webp",
  },
  {
    name: "Fitclass Gyms",
    logo: "https://fitclass.in/wp-content/uploads/2026/02/fitclass-logo.png",
  },
];

/**
 * Look up a client's logo by name.
 *
 * Case study `client` strings don't always match a `ClientLogo.name` exactly
 * — "Webaffino" vs. "Web Affino", "The Couponsfeed" vs. "The Coupons Feed" —
 * so the match ignores case and whitespace rather than requiring an exact
 * string. Returns `undefined` for clients with no logo on file (e.g. Sassy
 * Strides) so callers can omit the mark rather than render a broken image.
 */
export function getClientLogo(name: string): string | undefined {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return clients.find((client) => client.name.toLowerCase().replace(/\s+/g, "") === key)?.logo;
}
