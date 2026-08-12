import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The inquiry endpoint has nothing to index and should not be crawled.
      disallow: ["/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
