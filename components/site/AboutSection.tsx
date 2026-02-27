import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import type { AboutSettings } from "@/types";

const DEFAULT_ABOUT: AboutSettings = {
  title: "Güçlü Sivil Toplum, Güçlü Toplum",
  subtitle: "Hakkımızda",
  description:
    "İhtiyaç sahiplerine ulaşmak ve sürdürülebilir yardım projeleri geliştirmek amacıyla kurulmuş derneğimiz, eğitimden sağlığa, gıdadan barınmaya kadar pek çok alanda faaliyet göstermektedir.",
  mission:
    "İhtiyaç sahiplerine ulaşmak, sürdürülebilir yardım projeleri geliştirmek ve toplumsal dayanışmayı güçlendirmek.",
  vision:
    "Güçlü sivil toplum ile daha adil, eşit ve müreffeh bir dünya inşa etmek.",
  imageUrl: "",
  badgeText: "50K+",
  badgeSubtext: "Ulaşılan Kişi",
};

async function getAboutSettings(): Promise<AboutSettings> {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({
          where: { id: tenantId },
          select: { settings: true },
        })
      : await prisma.tenant.findFirst({
          where: { isActive: true },
          select: { settings: true },
          orderBy: { createdAt: "asc" },
        });
    if (!tenant) return DEFAULT_ABOUT;
    const settings = (tenant.settings as Record<string, unknown>) || {};
    const about = settings.about as AboutSettings | undefined;
    if (about && about.description) return { ...DEFAULT_ABOUT, ...about };
    return DEFAULT_ABOUT;
  } catch {
    return DEFAULT_ABOUT;
  }
}

export default async function AboutSection() {
  const about = await getAboutSettings();

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              {about.subtitle || "Hakkımızda"}
            </span>
            <h2 className="mt-3 mb-6">
              {about.title ? (
                about.title
              ) : (
                <>
                  Güçlü Sivil Toplum,{" "}
                  <span className="text-primary">Güçlü Toplum</span>
                </>
              )}
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              {about.description}
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-accent">
                <h4 className="text-lg font-bold text-primary mb-2">
                  Misyonumuz
                </h4>
                <p className="text-sm text-muted">{about.mission}</p>
              </div>
              <div className="p-4 rounded-xl bg-accent">
                <h4 className="text-lg font-bold text-primary mb-2">
                  Vizyonumuz
                </h4>
                <p className="text-sm text-muted">{about.vision}</p>
              </div>
            </div>
            <Link href="/hakkimizda" className="btn-primary">
              Daha Fazla Bilgi
            </Link>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            {about.imageUrl ? (
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <Image
                  src={about.imageUrl}
                  alt={about.title || "Hakkımızda"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <p className="text-primary font-heading font-bold text-2xl">
                    15+ Yıllık Deneyim
                  </p>
                  <p className="text-muted text-sm mt-2">
                    Kurulduğumuz günden bu yana binlerce kişiye ulaştık
                  </p>
                </div>
              </div>
            )}
            {/* Floating badge */}
            {(about.badgeText || DEFAULT_ABOUT.badgeText) && (
              <div className="absolute -bottom-4 -right-4 bg-secondary text-white rounded-xl p-4 shadow-lg">
                <span className="text-2xl font-bold">
                  {about.badgeText || DEFAULT_ABOUT.badgeText}
                </span>
                <p className="text-xs text-white/80">
                  {about.badgeSubtext || DEFAULT_ABOUT.badgeSubtext}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
