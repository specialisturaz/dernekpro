import { Metadata } from "next";

interface SEOParams {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export const SITE_NAME = "DernekPro";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dernekpro.com";
export const DEFAULT_OG_IMAGE = "/images/og-default.jpg";

export function generateSEO({
  title,
  description,
  path = "",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
}: SEOParams): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    title: fullTitle,
    description,
    keywords: tags,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "tr_TR",
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateOrganizationJsonLd(params: {
  name: string;
  url: string;
  logo: string;
  foundingDate?: string;
  address?: { city: string; country: string };
  phone?: string;
  social?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: params.name,
    url: params.url,
    logo: params.logo,
    ...(params.foundingDate && { foundingDate: params.foundingDate }),
    ...(params.address && {
      address: {
        "@type": "PostalAddress",
        addressLocality: params.address.city,
        addressCountry: params.address.country,
      },
    }),
    ...(params.phone && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: params.phone,
        contactType: "customer support",
      },
    }),
    ...(params.social && { sameAs: params.social }),
  };
}

export function generateArticleJsonLd(params: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: params.title,
    description: params.description,
    url: params.url,
    image: params.image,
    datePublished: params.publishedTime,
    dateModified: params.modifiedTime || params.publishedTime,
    author: {
      "@type": "Person",
      name: params.author,
    },
  };
}

export function generateEventJsonLd(params: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: params.name,
    description: params.description,
    startDate: params.startDate,
    endDate: params.endDate,
    url: params.url,
    ...(params.image && { image: params.image }),
    ...(params.location && {
      location: {
        "@type": "Place",
        name: params.location,
      },
    }),
  };
}

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/ara?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

export function generateDonationJsonLd(params: {
  name: string;
  description: string;
  url: string;
  image?: string;
  targetAmount?: number;
  collectedAmount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    name: params.name,
    description: params.description,
    url: params.url,
    ...(params.image && { image: params.image }),
    recipient: {
      "@type": "NGO",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

