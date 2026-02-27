"use client";

import type { PageSection } from "@/types/page-builder";
import { SECTION_LABELS, SECTION_ICONS } from "@/types/page-builder";

/* ------------------------------------------------------------------ */
/*  Lightweight preview placeholders for admin page builder.          */
/*  Real section components use async data fetching (Server Components) */
/*  which can't render inside a "use client" tree. These placeholders  */
/*  show a visual skeleton so admins can see layout & order.          */
/* ------------------------------------------------------------------ */

function PreviewCard({
  icon,
  label,
  height = "h-40",
  children,
}: {
  icon: string;
  label: string;
  height?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={`${height} flex flex-col items-center justify-center gap-2 bg-gray-50 border-b border-gray-200`}>
      <span className="text-3xl">{icon}</span>
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      {children}
    </section>
  );
}

function HeroPreview() {
  return (
    <section className="h-64 bg-gradient-to-br from-primary/80 to-primary flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 text-center px-4">
        <div className="w-40 h-4 bg-white/30 rounded mx-auto mb-3" />
        <div className="w-64 h-3 bg-white/20 rounded mx-auto mb-2" />
        <div className="w-48 h-3 bg-white/20 rounded mx-auto" />
      </div>
      <div className="absolute bottom-4 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-white" />
        <div className="w-2 h-2 rounded-full bg-white/50" />
        <div className="w-2 h-2 rounded-full bg-white/50" />
      </div>
    </section>
  );
}

function StatsPreview() {
  return (
    <section className="py-8 bg-white border-b border-gray-200">
      <div className="flex justify-center gap-8 px-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center">
            <div className="w-12 h-5 bg-primary/20 rounded mx-auto mb-1" />
            <div className="w-16 h-3 bg-gray-200 rounded mx-auto" />
          </div>
        ))}
      </div>
    </section>
  );
}

function CardsPreview({ label, icon, count = 3 }: { label: string; icon: string; count?: number }) {
  return (
    <section className="py-8 px-6 bg-white border-b border-gray-200">
      <div className="text-center mb-4">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-semibold text-gray-500 ml-2">{label}</span>
      </div>
      <div className="flex gap-3 justify-center">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-36 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="h-20 bg-gray-200" />
            <div className="p-2">
              <div className="w-full h-2.5 bg-gray-200 rounded mb-1.5" />
              <div className="w-3/4 h-2 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DonationBannerPreview() {
  return (
    <section className="py-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-gray-200">
      <div className="text-center px-6">
        <div className="w-48 h-4 bg-primary/20 rounded mx-auto mb-2" />
        <div className="w-64 h-3 bg-gray-200 rounded mx-auto mb-3" />
        <div className="w-28 h-8 bg-primary/30 rounded-lg mx-auto" />
      </div>
    </section>
  );
}

function TextPreview({ config }: { config: Record<string, unknown> }) {
  const content = (config.content as string) || "";
  if (!content) {
    return <PreviewCard icon="📝" label="Metin Bloğu" height="h-24" />;
  }
  return (
    <section className="py-6 px-6 bg-white border-b border-gray-200">
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
}

function HtmlPreview({ config }: { config: Record<string, unknown> }) {
  const rawHtml = (config.rawHtml as string) || "";
  if (!rawHtml) {
    return <PreviewCard icon="🧩" label="HTML Bloğu" height="h-24" />;
  }
  return (
    <section className="py-4 px-6 bg-white border-b border-gray-200">
      <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
    </section>
  );
}

interface SectionRendererPreviewProps {
  sections: PageSection[];
}

export default function SectionRendererPreview({ sections }: SectionRendererPreviewProps) {
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {visibleSections.map((section) => {
        switch (section.type) {
          case "hero":
            return <HeroPreview key={section.id} />;
          case "stats":
            return <StatsPreview key={section.id} />;
          case "campaign":
            return <CardsPreview key={section.id} label="Kampanyalar" icon="🎯" />;
          case "news":
            return <CardsPreview key={section.id} label="Haberler" icon="📰" />;
          case "events":
            return <CardsPreview key={section.id} label="Etkinlikler" icon="📅" />;
          case "gallery":
            return <CardsPreview key={section.id} label="Galeri" icon="🖼️" count={4} />;
          case "donation-banner":
            return <DonationBannerPreview key={section.id} />;
          case "text":
            return <TextPreview key={section.id} config={section.config} />;
          case "html":
            return <HtmlPreview key={section.id} config={section.config} />;
          case "about":
            return <PreviewCard key={section.id} icon="ℹ️" label="Hakkımızda" height="h-48" />;
          case "partners":
            return <PreviewCard key={section.id} icon="🤝" label="İş Ortakları" />;
          case "child-sponsor":
            return <CardsPreview key={section.id} label="Çocuk Sponsorluk" icon="❤️" />;
          case "completed-projects":
            return <CardsPreview key={section.id} label="Tamamlanan Projeler" icon="✅" />;
          case "announcements":
            return <CardsPreview key={section.id} label="Duyurular" icon="📢" />;
          case "activities":
            return <CardsPreview key={section.id} label="Faaliyetler" icon="🏃" />;
          case "news-announcements":
            return <CardsPreview key={section.id} label="Haberler & Duyurular" icon="📰" count={4} />;
          case "contact-cta":
            return <PreviewCard key={section.id} icon="📞" label="İletişim CTA" height="h-32" />;
          default:
            return (
              <PreviewCard
                key={section.id}
                icon={SECTION_ICONS[section.type] || "❓"}
                label={SECTION_LABELS[section.type] || section.type}
              />
            );
        }
      })}
    </>
  );
}
