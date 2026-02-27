import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getDonationHref } from "@/lib/modules/utils";
import ContactMapSection from "@/components/site/ContactMapSection";
import { sanitizeMapEmbed } from "@/lib/utils";
import ContactForm from "@/components/site/ContactForm";
import type { ContactPageSettings } from "@/types";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Derneğimizle iletişime geçin. Adres, telefon, e-posta bilgileri ve iletişim formu.",
  openGraph: {
    title: "İletişim",
    description: "Derneğimizle iletişime geçin. Adres, telefon, e-posta bilgileri ve iletişim formu.",
  },
  alternates: {
    canonical: "/iletisim",
  },
};

const DEFAULT_CONTACT: ContactPageSettings = {
  address: "Balat, Manyasizade Cd. 58/B, 34087 Fatih/İstanbul",
  phone: "+90 (531) 325 01 66",
  email: "info@siemder.org.tr",
  workingHours: "Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 10:00 - 14:00",
  mapLat: 41.027125,
  mapLng: 28.946794,
  mapZoom: 15,
  socialMedia: [],
  faq: [],
};

const DEFAULT_SOCIAL = [
  { ad: "Facebook", harf: "f", platform: "Facebook", bg: "hover:bg-[#1877F2]" },
  { ad: "Twitter", harf: "X", platform: "Twitter", bg: "hover:bg-[#000]" },
  { ad: "Instagram", harf: "in", platform: "Instagram", bg: "hover:bg-[#E4405F]" },
  { ad: "YouTube", harf: "YT", platform: "YouTube", bg: "hover:bg-[#FF0000]" },
  { ad: "LinkedIn", harf: "Li", platform: "LinkedIn", bg: "hover:bg-[#0A66C2]" },
];

async function getContactSettings(): Promise<ContactPageSettings> {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({ where: { id: tenantId }, select: { settings: true } })
      : await prisma.tenant.findFirst({ where: { isActive: true }, select: { settings: true }, orderBy: { createdAt: "asc" } });

    if (!tenant) return DEFAULT_CONTACT;

    const settings = (tenant.settings as Record<string, unknown>) || {};
    const contact = settings.contactPage as ContactPageSettings | undefined;

    return contact && contact.address ? contact : DEFAULT_CONTACT;
  } catch {
    return DEFAULT_CONTACT;
  }
}

const iletisimIkonlari = [
  { key: "address", baslik: "Adres", ikon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", renkHafif: "bg-blue-50 text-blue-600" },
  { key: "phone", baslik: "Telefon", ikon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", renkHafif: "bg-green-50 text-green-600" },
  { key: "email", baslik: "E-posta", ikon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", renkHafif: "bg-purple-50 text-purple-600" },
  { key: "workingHours", baslik: "Çalışma Saatleri", ikon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", renkHafif: "bg-orange-50 text-orange-600" },
];

function getPhoneHref(phone: string): string {
  const firstLine = phone.split("\n")[0].trim();
  return "tel:" + firstLine.replace(/[^\d+]/g, "");
}

function getEmailHref(email: string): string {
  const firstLine = email.split("\n")[0].trim();
  return "mailto:" + firstLine;
}

export default async function IletisimPage() {
  const [contact, donationHref] = await Promise.all([getContactSettings(), getDonationHref()]);

  const heroTitle = contact.heroTitle || "İletişim";
  const heroDesc = contact.heroDescription || "Her türlü soru, öneri ve iş birliği teklifleriniz için bizimle iletişime geçebilirsiniz.";

  const contactValues: Record<string, string> = {
    address: contact.address,
    phone: contact.phone,
    email: contact.email,
    workingHours: contact.workingHours,
  };

  const socialLinks = contact.socialMedia?.length > 0
    ? contact.socialMedia.map((sm) => {
        const def = DEFAULT_SOCIAL.find((d) => d.platform === sm.platform);
        return { ad: sm.platform, harf: def?.harf || sm.platform.slice(0, 2), url: sm.url, bg: def?.bg || "hover:bg-gray-700" };
      })
    : DEFAULT_SOCIAL.map((d) => ({ ...d, url: "#" }));

  return (
    <main>
      {/* Hero */}
      <section className="bg-primary text-white pt-32 pb-10 md:pt-36 md:pb-12 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.06] hidden lg:flex items-center justify-center">
          <svg className="w-[400px] h-[400px]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M60 40 L60 20 L80 20 M120 20 L140 20 L140 40 M140 80 L140 100 L120 100 M80 100 L60 100 L60 80" strokeLinecap="round" />
            <circle cx="100" cy="60" r="12" />
            <path d="M40 130 L100 160 L160 130 M40 130 L40 170 L100 200 L160 170 L160 130" />
            <path d="M70 145 L100 160 L130 145" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <a href="/" className="hover:text-white transition-colors">Ana Sayfa</a>
            <span className="mx-2">/</span>
            <span className="text-white">İletişim</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">{heroTitle}</h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl">{heroDesc}</p>
        </div>
      </section>

      {/* İletişim Bilgi Kartları */}
      <section className="relative -mt-8 z-10 mb-4">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {iletisimIkonlari.map((bilgi) => {
              const value = contactValues[bilgi.key] || "";
              const isPhone = bilgi.key === "phone";
              const isEmail = bilgi.key === "email";

              const cardContent = (
                <>
                  <div className={`w-12 h-12 ${bilgi.renkHafif} rounded-xl flex items-center justify-center mb-4`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={bilgi.ikon} />
                    </svg>
                  </div>
                  <h3 className="font-bold font-heading text-foreground mb-2 text-lg">{bilgi.baslik}</h3>
                  <p className="text-muted text-sm whitespace-pre-line leading-relaxed">{value}</p>
                </>
              );

              if (isPhone && value) {
                return (
                  <a key={bilgi.key} href={getPhoneHref(value)} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-primary/20 transition-all block">
                    {cardContent}
                  </a>
                );
              }

              if (isEmail && value) {
                return (
                  <a key={bilgi.key} href={getEmailHref(value)} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-primary/20 transition-all block">
                    {cardContent}
                  </a>
                );
              }

              return (
                <div key={bilgi.key} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Güven Göstergeleri */}
      <section className="relative z-10 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Güvenli İletişim
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Hızlı Yanıt
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              7/24 Destek
            </span>
          </div>
        </div>
      </section>

      {/* İletişim Formu + Harita */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">Bize Yazın</span>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">{contact.formTitle || "Mesaj Gönderin"}</h2>
                <p className="text-muted leading-relaxed">{contact.formDescription || "Formu doldurarak bize ulaşabilirsiniz. Mesajınız dernek yönetimimize iletilecek ve en kısa sürede size dönüş yapılacaktır."}</p>
              </div>
              <ContactForm topics={contact.formTopics?.length ? contact.formTopics : undefined} />
            </div>
            <div>
              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-sm font-semibold rounded-full mb-3">Ziyaret Edin</span>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">{contact.mapTitle || "Bizi Bulun"}</h2>
                <p className="text-muted leading-relaxed">{contact.mapDescription || "Merkez ofisimiz ve şubelerimizi haritadan görüntüleyebilir, detaylı bilgi için şube sayfalarını ziyaret edebilirsiniz."}</p>
              </div>
              {contact.mapEmbed ? (
                <div className="rounded-[var(--border-radius)] overflow-hidden border border-border" dangerouslySetInnerHTML={{ __html: sanitizeMapEmbed(contact.mapEmbed) }} />
              ) : (
                <ContactMapSection />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sosyal Medya + CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">{contact.socialTitle || "Sosyal Medyada Takip Edin"}</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">{contact.socialDescription || "Güncel gelişmelerden haberdar olmak, etkinlik duyurularını kaçırmamak için sosyal medya hesaplarımızı takip edin."}</p>
          <div className="flex justify-center gap-4 mb-10">
            {socialLinks.map((platform) => (
              <a key={platform.ad} href={platform.url} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-sm font-bold ${platform.bg} hover:border-transparent hover:scale-110 transition-all`} title={platform.ad}>
                {platform.harf}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={contact.ctaPrimaryLink || "/uye-ol"} className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-white/90 transition-colors">{contact.ctaPrimaryText || "Üye Ol"}</a>
            <a href={contact.ctaSecondaryLink || donationHref} className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">{contact.ctaSecondaryText || "Bağış Yap"}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
