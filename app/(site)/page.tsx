import { Metadata } from "next";
import { prisma } from "@/lib/db";
import SectionRenderer from "@/components/site/SectionRenderer";
import type { PageSection } from "@/types/page-builder";
import type { SlideData } from "@/components/site/HeroSection";
import HeroSection from "@/components/site/HeroSection";
import StatsSection from "@/components/site/StatsSection";
import CampaignsSection from "@/components/site/CampaignsSection";
import AboutSection from "@/components/site/AboutSection";
import ActivitiesSection from "@/components/site/ActivitiesSection";
import DonationBanner from "@/components/site/DonationBanner";
import EventsSection from "@/components/site/EventsSection";
import ChildSponsorSection from "@/components/site/sections/ChildSponsorSection";
import NewsAnnouncementsSection from "@/components/site/NewsAnnouncementsSection";
import GalleryPreview from "@/components/site/GalleryPreview";

export const metadata: Metadata = {
  title: "DernekPro — Dernek Yönetim ve Web Sistemi",
  description:
    "Türkiye'nin en kapsamlı dernek yönetim ve web sitesi platformu. Üye yönetimi, bağış sistemi, etkinlik takvimi ve daha fazlası.",
};

async function getHomepageSections(): Promise<PageSection[] | null> {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({ where: { id: tenantId }, select: { id: true } })
      : await prisma.tenant.findFirst({ where: { isActive: true }, select: { id: true }, orderBy: { createdAt: "asc" } });

    if (!tenant) return null;

    const page = await prisma.page.findUnique({
      where: { tenantId_slug: { tenantId: tenant.id, slug: "anasayfa" } },
      select: { sections: true, customCss: true },
    });

    if (!page?.sections) return null;
    return page.sections as unknown as PageSection[];
  } catch {
    return null;
  }
}

async function getSlides(): Promise<SlideData[]> {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({ where: { id: tenantId }, select: { id: true } })
      : await prisma.tenant.findFirst({ where: { isActive: true }, select: { id: true }, orderBy: { createdAt: "asc" } });

    if (!tenant) return [];

    const slides = await prisma.slide.findMany({
      where: { tenantId: tenant.id, isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        mediaUrl: true,
        mobileMediaUrl: true,
        title: true,
        subtitle: true,
        buttonText: true,
        buttonLink: true,
        badge: true,
        bgColor: true,
        accentColor: true,
        statsLabel: true,
        statsValue: true,
        slideDate: true,
        location: true,
      },
    });

    return slides;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [sections, slides] = await Promise.all([
    getHomepageSections(),
    getSlides(),
  ]);

  // If we have sections from DB, render dynamically
  if (sections && sections.length > 0) {
    return <SectionRenderer sections={sections} slides={slides} />;
  }

  // Fallback: static render — yeni 10 bölüm sırası
  return (
    <>
      <HeroSection slides={slides} />
      <StatsSection />
      <CampaignsSection />
      <AboutSection />
      <ActivitiesSection />
      <DonationBanner />
      <ChildSponsorSection />
      <EventsSection />
      <NewsAnnouncementsSection />
      <GalleryPreview />
    </>
  );
}
