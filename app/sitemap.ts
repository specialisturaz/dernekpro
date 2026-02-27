import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dernekpro.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/hakkimizda/yonetim-kurulu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/hakkimizda/tuzuk`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/bagis`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/etkinlikler`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/haberler`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/duyurular`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/faaliyetler`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/galeri`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/subeler`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/hesaplar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/cocuk-sponsorluk`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/kvkk`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/gizlilik-politikasi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/cerez-politikasi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic pages from database
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({ where: { id: tenantId }, select: { id: true } })
      : await prisma.tenant.findFirst({ where: { isActive: true }, select: { id: true }, orderBy: { createdAt: "asc" } });

    if (tenant) {
      // News articles
      const news = await prisma.post.findMany({
        where: { tenantId: tenant.id, type: "NEWS", status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
      });
      for (const item of news) {
        dynamicPages.push({
          url: `${siteUrl}/haberler/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }

      // Announcements
      const announcements = await prisma.post.findMany({
        where: { tenantId: tenant.id, type: "ANNOUNCEMENT", status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
      });
      for (const item of announcements) {
        dynamicPages.push({
          url: `${siteUrl}/duyurular/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }

      // Activities
      const activities = await prisma.post.findMany({
        where: { tenantId: tenant.id, type: "ACTIVITY", status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
      });
      for (const item of activities) {
        dynamicPages.push({
          url: `${siteUrl}/faaliyetler/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }

      // Events
      const events = await prisma.event.findMany({
        where: { tenantId: tenant.id },
        select: { slug: true, updatedAt: true },
        orderBy: { startAt: "desc" },
      });
      for (const item of events) {
        dynamicPages.push({
          url: `${siteUrl}/etkinlikler/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }

      // Campaigns
      const campaigns = await prisma.campaign.findMany({
        where: { tenantId: tenant.id, isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { createdAt: "desc" },
      });
      for (const item of campaigns) {
        dynamicPages.push({
          url: `${siteUrl}/bagis/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }

      // Gallery albums
      const albums = await prisma.galleryAlbum.findMany({
        where: { tenantId: tenant.id },
        select: { slug: true, updatedAt: true },
        orderBy: { createdAt: "desc" },
      });
      for (const item of albums) {
        dynamicPages.push({
          url: `${siteUrl}/galeri/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }

      // Branches
      const branches = await prisma.branch.findMany({
        where: { tenantId: tenant.id, status: "ACTIVE" },
        select: { slug: true, updatedAt: true },
        orderBy: { order: "asc" },
      });
      for (const item of branches) {
        dynamicPages.push({
          url: `${siteUrl}/subeler/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // If DB fails, return static pages only
  }

  return [...staticPages, ...dynamicPages];
}
