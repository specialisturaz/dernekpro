import Link from "next/link";
import { prisma } from "@/lib/db";

interface ContactData {
  tenantName: string;
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
    whatsapp?: string;
  };
}

async function getContactData(): Promise<ContactData | null> {
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
    return {
      tenantName: tenant.name,
      contact: (settings.contact as ContactData["contact"]) || {},
      social: (settings.social as ContactData["social"]) || {},
    };
  } catch {
    return null;
  }
}

const SOCIAL_ICONS: Record<string, { label: string; path: string }> = {
  facebook: {
    label: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  instagram: {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  twitter: {
    label: "X (Twitter)",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  youtube: {
    label: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  linkedin: {
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  whatsapp: {
    label: "WhatsApp",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
  },
  tiktok: {
    label: "TikTok",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
};

export default async function ContactCTASection() {
  const data = await getContactData();
  if (!data) return null;

  const activeSocials = Object.entries(data.social).filter(
    ([, url]) => url && url.trim()
  );

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary-dark to-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-10 items-center">
          {/* Contact Info */}
          <div className="text-white/90 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">İletişim</h3>
            {data.contact.address && (
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm leading-relaxed">{data.contact.address}</span>
              </div>
            )}
            {data.contact.phone && (
              <a href={`tel:${data.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-white transition-colors">
                <svg className="w-5 h-5 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm">{data.contact.phone}</span>
              </a>
            )}
            {data.contact.email && (
              <a href={`mailto:${data.contact.email}`} className="flex items-center gap-3 hover:text-white transition-colors">
                <svg className="w-5 h-5 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{data.contact.email}</span>
              </a>
            )}
          </div>

          {/* Social Media */}
          {activeSocials.length > 0 && (
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Bizi Takip Edin</h3>
              <div className="flex justify-center gap-3 flex-wrap">
                {activeSocials.map(([platform, url]) => {
                  const icon = SOCIAL_ICONS[platform];
                  if (!icon) return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={icon.label}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d={icon.path} />
                      </svg>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <h3 className="text-xl font-bold text-white mb-2">Bize Katılın</h3>
            <Link
              href="/uye-ol"
              className="w-full md:w-auto px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors text-center shadow-lg"
            >
              Üye Ol
            </Link>
            <Link
              href="/bagis"
              className="w-full md:w-auto px-8 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-colors text-center shadow-lg"
            >
              Bağış Yap
            </Link>
            <Link
              href="/iletisim"
              className="w-full md:w-auto px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-center"
            >
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
