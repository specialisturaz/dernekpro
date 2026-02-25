import { Metadata } from "next";
import HeroSection from "@/components/site/HeroSection";
import StatsSection from "@/components/site/StatsSection";
import AboutSection from "@/components/site/AboutSection";
import CampaignsSection from "@/components/site/CampaignsSection";
import ActivitiesSection from "@/components/site/ActivitiesSection";
import NewsSection from "@/components/site/NewsSection";
import EventsSection from "@/components/site/EventsSection";
import GalleryPreview from "@/components/site/GalleryPreview";
import DonationBanner from "@/components/site/DonationBanner";
import PartnersSection from "@/components/site/PartnersSection";

export const metadata: Metadata = {
  title: "DernekPro — Dernek Yönetim ve Web Sistemi",
  description:
    "Türkiye'nin en kapsamlı dernek yönetim ve web sitesi platformu. Üye yönetimi, bağış sistemi, etkinlik takvimi ve daha fazlası.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <CampaignsSection />
      <ActivitiesSection />
      <NewsSection />
      <EventsSection />
      <DonationBanner />
      <GalleryPreview />
      <PartnersSection />
    </>
  );
}
