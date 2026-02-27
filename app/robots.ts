import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dernekpro.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/giris",
          "/kayit",
          "/hesabim/",
          "/api/",
          "/bakim",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
