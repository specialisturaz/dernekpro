import Link from "next/link";
import { prisma } from "@/lib/db";
import { getDonationHref } from "@/lib/modules/utils";
import type { FooterSettings } from "@/types";
import FooterNewsletter from "./FooterNewsletter";
import ScrollToTopButton from "./ScrollToTopButton";

const footerLinks = {
  kurumsal: [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Yönetim Kurulu", href: "/hakkimizda/yonetim-kurulu" },
    { label: "Dernek Tüzüğü", href: "/hakkimizda/tuzuk" },
    { label: "Bize Katıl", href: "/uye-ol" },
  ],
  faaliyetler: [
    { label: "Faaliyetler", href: "/faaliyetler" },
    { label: "Haberler", href: "/haberler" },
    { label: "Duyurular", href: "/duyurular" },
    { label: "Etkinlikler", href: "/etkinlikler" },
  ],
  destek: [
    { label: "Bağış Yap", href: "/bagis" },
    { label: "Gönüllü Ol", href: "/uye-ol" },
    { label: "İletişim", href: "/iletisim" },
    { label: "SSS", href: "/sss" },
  ],
  yasal: [
    { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    { label: "Çerez Politikası", href: "/cerez-politikasi" },
    { label: "KVKK Aydınlatma", href: "/kvkk" },
  ],
};

const socialIcons: Record<string, React.ReactNode> = {
  facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth={2} />
      <circle cx="12" cy="12" r="4" strokeWidth={2} />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  tiktok: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.44v-7.1a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3-.58z" />
    </svg>
  ),
};

async function getFooterData() {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({
          where: { id: tenantId },
          select: { name: true, settings: true },
        })
      : await prisma.tenant.findFirst({
          where: { isActive: true },
          select: { name: true, settings: true },
          orderBy: { createdAt: "asc" },
        });

    if (!tenant) return null;

    const settings = (tenant.settings as Record<string, unknown>) || {};
    const footer = (settings.footer as FooterSettings) || null;
    const contact = (settings.contact as Record<string, string>) || {};
    const social = (settings.social as Record<string, string>) || {};
    const logoConfig = (settings.logo as { logoUrl?: string; logoWidth?: number; logoHeight?: number }) || {};

    return {
      tenantName: tenant.name,
      footer,
      contact,
      social,
      logo: {
        logoUrl: logoConfig.logoUrl || "",
        logoWidth: logoConfig.logoWidth || 140,
        logoHeight: logoConfig.logoHeight || 40,
      },
    };
  } catch {
    return null;
  }
}

export default async function Footer() {
  const [data, donationHref] = await Promise.all([getFooterData(), getDonationHref()]);

  // Bagis linkini kampanya modulune gore guncelle
  const destekLinks = footerLinks.destek.map((link) =>
    link.href === "/bagis" ? { ...link, href: donationHref } : link
  );

  const brandName = data?.footer?.brandName || data?.tenantName || "DernekPro";
  const tagline = data?.footer?.tagline || "Türkiye'nin en kapsamlı dernek yönetim ve web sitesi platformu. Güçlü sivil toplum, güçlü toplum.";
  const copyright = data?.footer?.copyright || `${brandName}. Tüm hakları saklıdır.`;
  const showNewsletter = data?.footer?.showNewsletter ?? true;
  const newsletterTitle = data?.footer?.newsletterTitle || "";
  const newsletterDescription = data?.footer?.newsletterDescription || "";

  const contact = data?.contact || {};
  const social = data?.social || {};

  const activeSocials = Object.entries(social).filter(
    ([key, url]) => url && key !== "whatsapp" && socialIcons[key]
  );

  return (
    <footer>
      {/* Newsletter Banner */}
      {showNewsletter && (
        <FooterNewsletter title={newsletterTitle} description={newsletterDescription} />
      )}

      {/* Main Footer */}
      <div className="bg-primary-dark text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                {data?.logo?.logoUrl ? (
                  <img
                    src={data.logo.logoUrl}
                    alt={brandName}
                    width={Math.round(data.logo.logoWidth * 0.75)}
                    height={Math.round(data.logo.logoHeight * 0.75)}
                    className="object-contain brightness-0 invert"
                  />
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{brandName.charAt(0)}</span>
                    </div>
                    <span className="font-heading font-bold text-xl">{brandName}</span>
                  </>
                )}
              </Link>
              <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
                {tagline}
              </p>

              {/* İletişim Bilgileri */}
              <div className="space-y-3 mb-6">
                {contact.address && (
                  <div className="flex items-start gap-3 text-sm text-white/60">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{contact.address}{contact.city ? ` / ${contact.city}` : ""}</span>
                  </div>
                )}
                {contact.phone && (
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{contact.phone}</span>
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{contact.email}</span>
                  </a>
                )}
              </div>

              {/* Sosyal Medya */}
              {activeSocials.length > 0 && (
                <div className="flex items-center gap-3">
                  {activeSocials.map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label={key}
                    >
                      {socialIcons[key]}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Kurumsal */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/90">
                Kurumsal
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.kurumsal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Faaliyetler */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/90">
                İçerikler
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.faaliyetler.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destek */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/90">
                Destek
              </h4>
              <ul className="space-y-2.5">
                {destekLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-white/50 text-sm">
                &copy; {new Date().getFullYear()} {copyright}
              </p>
              <div className="flex items-center gap-4">
                {footerLinks.yasal.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/40 hover:text-white/70 text-xs transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <ScrollToTopButton />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
