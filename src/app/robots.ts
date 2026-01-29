import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Disallow pages that are explicitly hidden from search engines in Strapi
      // These are handled at the page level via generateMetadata robots property
    },
    sitemap: `${process.env.SITE_URL || "https://www.matlu.fi"}/sitemap.xml`,
  };
}
