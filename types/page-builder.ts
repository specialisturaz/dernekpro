export type SectionType =
  | "hero"
  | "text"
  | "campaign"
  | "news"
  | "events"
  | "gallery"
  | "html"
  | "custom-css"
  | "donation-banner"
  | "stats"
  | "about"
  | "partners"
  | "child-sponsor"
  | "completed-projects"
  | "announcements"
  | "activities"
  | "news-announcements"
  | "contact-cta";

export interface PageSection {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
  config: Record<string, unknown>;
}

export interface PageStructure {
  sections: PageSection[];
}

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero Slider",
  text: "Metin Bloğu",
  campaign: "Kampanyalar",
  news: "Haberler",
  events: "Etkinlikler",
  gallery: "Galeri",
  html: "HTML Bloğu",
  "custom-css": "Özel CSS",
  "donation-banner": "Bağış Çağrısı",
  stats: "İstatistikler",
  about: "Hakkımızda",
  partners: "İş Ortakları",
  "child-sponsor": "Çocuk Sponsorluk",
  "completed-projects": "Tamamlanan Projeler",
  announcements: "Duyurular",
  activities: "Faaliyetler",
  "news-announcements": "Haberler & Duyurular",
  "contact-cta": "İletişim CTA",
};

export const SECTION_ICONS: Record<SectionType, string> = {
  hero: "🖼️",
  text: "📝",
  campaign: "🎯",
  news: "📰",
  events: "📅",
  gallery: "🖼️",
  html: "🧩",
  "custom-css": "🎨",
  "donation-banner": "💖",
  stats: "📊",
  about: "ℹ️",
  partners: "🤝",
  "child-sponsor": "❤️",
  "completed-projects": "✅",
  announcements: "📢",
  activities: "🏃",
  "news-announcements": "📰",
  "contact-cta": "📞",
};

export const DEFAULT_HOMEPAGE_SECTIONS: PageSection[] = [
  { id: "section-hero", type: "hero", visible: true, order: 0, config: {} },
  { id: "section-stats", type: "stats", visible: true, order: 1, config: {} },
  { id: "section-campaign", type: "campaign", visible: true, order: 2, config: {} },
  { id: "section-about", type: "about", visible: true, order: 3, config: {} },
  { id: "section-activities", type: "activities", visible: true, order: 4, config: {} },
  { id: "section-donation-banner", type: "donation-banner", visible: true, order: 5, config: {} },
  { id: "section-events", type: "events", visible: true, order: 6, config: {} },
  { id: "section-news-announcements", type: "news-announcements", visible: true, order: 7, config: {} },
  { id: "section-gallery", type: "gallery", visible: true, order: 8, config: {} },
  { id: "section-contact-cta", type: "contact-cta", visible: true, order: 9, config: {} },
];
