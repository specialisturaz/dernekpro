import type { PageSection } from "@/types/page-builder";
import HeroSection, { type SlideData } from "./HeroSection";
import CampaignsSection from "./CampaignsSection";
import EventsSection from "./EventsSection";
import NewsSection from "./NewsSection";
import StatsSection from "./StatsSection";
import DonationBanner from "./DonationBanner";
import AboutSection from "./AboutSection";
import GalleryPreview from "./GalleryPreview";
import PartnersSection from "./PartnersSection";
import ChildSponsorSection from "./sections/ChildSponsorSection";
import CompletedProjectsSection from "./CompletedProjectsSection";
import AnnouncementsSection from "./AnnouncementsSection";
import ActivitiesSection from "./ActivitiesSection";
import NewsAnnouncementsSection from "./NewsAnnouncementsSection";
import ContactCTASection from "./ContactCTASection";

function TextSection({ config }: { config: Record<string, unknown> }) {
  const content = (config.content as string) || "";
  return (
    <section className="section-padding">
      <div className="container mx-auto px-6 prose prose-lg max-w-4xl">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </section>
  );
}

function HtmlSection({ config }: { config: Record<string, unknown> }) {
  const rawHtml = (config.rawHtml as string) || "";
  return (
    <section>
      <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
    </section>
  );
}

interface SectionRendererProps {
  sections: PageSection[];
  slides?: SlideData[];
}

export default function SectionRenderer({ sections, slides }: SectionRendererProps) {
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {visibleSections.map((section) => {
        switch (section.type) {
          case "hero":
            return <HeroSection key={section.id} slides={slides} />;
          case "stats":
            return <StatsSection key={section.id} />;
          case "campaign":
            return <CampaignsSection key={section.id} />;
          case "news":
            return <NewsSection key={section.id} />;
          case "events":
            return <EventsSection key={section.id} />;
          case "donation-banner":
            return <DonationBanner key={section.id} />;
          case "text":
            return <TextSection key={section.id} config={section.config} />;
          case "html":
            return <HtmlSection key={section.id} config={section.config} />;
          case "gallery":
            return <GalleryPreview key={section.id} />;
          case "about":
            return <AboutSection key={section.id} />;
          case "partners":
            return <PartnersSection key={section.id} />;
          case "child-sponsor":
            return <ChildSponsorSection key={section.id} />;
          case "completed-projects":
            return <CompletedProjectsSection key={section.id} />;
          case "announcements":
            return <AnnouncementsSection key={section.id} />;
          case "activities":
            return <ActivitiesSection key={section.id} />;
          case "news-announcements":
            return <NewsAnnouncementsSection key={section.id} />;
          case "contact-cta":
            return <ContactCTASection key={section.id} />;
          default:
            return null;
        }
      })}
    </>
  );
}
