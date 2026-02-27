import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Yönetim Kurulu",
  description:
    "Derneğimizin yönetim kurulu üyeleri, görevleri ve iletişim bilgileri.",
  openGraph: {
    title: "Yönetim Kurulu",
    description: "Derneğimizin yönetim kurulu üyeleri, görevleri ve iletişim bilgileri.",
  },
  alternates: {
    canonical: "/hakkimizda/yonetim-kurulu",
  },
};

async function getPageFromDB() {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({ where: { id: tenantId }, select: { id: true } })
      : await prisma.tenant.findFirst({ where: { isActive: true }, select: { id: true }, orderBy: { createdAt: "asc" } });

    if (!tenant) return null;

    const page = await prisma.page.findFirst({
      where: {
        slug: "yonetim-kurulu",
        tenantId: tenant.id,
        isPublished: true,
      },
    });

    return page;
  } catch {
    return null;
  }
}

interface BoardMember {
  ad: string;
  gorev: string;
  aciklama: string;
}

const yonetimKurulu: BoardMember[] = [
  {
    ad: "Ahmet Yılmaz",
    gorev: "Genel Başkan",
    aciklama: "Derneğimizin kurucu üyelerinden olup, 2018 yılından bu yana genel başkanlık görevini yürütmektedir.",
  },
  {
    ad: "Fatma Demir",
    gorev: "Başkan Yardımcısı",
    aciklama: "Eğitim projeleri koordinasyonu ve uluslararası ilişkilerden sorumlu başkan yardımcısıdır.",
  },
  {
    ad: "Mehmet Kaya",
    gorev: "Genel Sekreter",
    aciklama: "Dernek iç işleyişi, yazışmalar ve kurumsal iletişimden sorumludur.",
  },
  {
    ad: "Ayşe Çelik",
    gorev: "Sayman",
    aciklama: "Derneğin mali işleri, bütçe planlaması ve bağış yönetiminden sorumludur.",
  },
  {
    ad: "Ali Öztürk",
    gorev: "Yönetim Kurulu Üyesi",
    aciklama: "Sosyal medya ve dijital iletişim stratejilerinden sorumludur.",
  },
  {
    ad: "Zeynep Aksoy",
    gorev: "Yönetim Kurulu Üyesi",
    aciklama: "Etkinlik organizasyonu ve gönüllü koordinasyonundan sorumludur.",
  },
  {
    ad: "Hasan Yıldız",
    gorev: "Yönetim Kurulu Üyesi",
    aciklama: "Hukuki danışmanlık ve mevzuat uyumundan sorumludur.",
  },
];

const denetimKurulu: BoardMember[] = [
  {
    ad: "Elif Şahin",
    gorev: "Denetim Kurulu Başkanı",
    aciklama: "Mali denetim ve iç kontrol süreçlerinden sorumludur.",
  },
  {
    ad: "Burak Arslan",
    gorev: "Denetim Kurulu Üyesi",
    aciklama: "Faaliyet denetimi ve raporlamasından sorumludur.",
  },
  {
    ad: "Selin Koç",
    gorev: "Denetim Kurulu Üyesi",
    aciklama: "Mevzuat uyumu ve tüzük denetiminden sorumludur.",
  },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("");
}

function MemberCard({ member, featured = false }: { member: BoardMember; featured?: boolean }) {
  if (featured) {
    return (
      <div className="col-span-full">
        <div className="bg-primary rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 hover:shadow-xl transition-all duration-300">
          <div className="w-20 h-20 rounded-full bg-accent border-2 border-accent flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-primary">{getInitials(member.ad)}</span>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">{member.ad}</h3>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent text-primary">
              {member.gorev}
            </span>
            <p className="mt-3 text-sm text-white/75 leading-relaxed max-w-lg">
              {member.aciklama}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      <div className="card p-7 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        {/* Top accent line on hover */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-primary transition-all duration-300" />
        <div className="w-14 h-14 rounded-full bg-accent border-2 border-border flex items-center justify-center mb-4">
          <span className="text-base font-bold text-primary">{getInitials(member.ad)}</span>
        </div>
        <h3 className="text-lg font-bold text-foreground">{member.ad}</h3>
        <span className="inline-block mt-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-accent text-primary">
          {member.gorev}
        </span>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          {member.aciklama}
        </p>
      </div>
    </div>
  );
}

function AuditCard({ member }: { member: BoardMember }) {
  return (
    <div className="group">
      <div className="card p-6 text-center relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-primary transition-all duration-300" />
        <div className="w-14 h-14 rounded-full bg-accent border-2 border-border flex items-center justify-center mx-auto mb-3">
          <span className="text-base font-bold text-primary">{getInitials(member.ad)}</span>
        </div>
        <h3 className="font-bold text-foreground">{member.ad}</h3>
        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-accent text-primary">
          {member.gorev}
        </span>
        <p className="mt-2.5 text-sm text-muted leading-relaxed">
          {member.aciklama}
        </p>
      </div>
    </div>
  );
}

export default async function YonetimKuruluPage() {
  const dbPage = await getPageFromDB();

  if (dbPage) {
    return (
      <main>
        <section className="relative overflow-hidden bg-primary text-white pt-32 pb-10 md:pt-36 md:pb-12">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
          </div>
          <div className="relative container mx-auto px-4">
            <nav className="text-sm text-white/70 mb-4">
              <Link href="/" className="hover:text-white">Ana Sayfa</Link>
              <span className="mx-2">/</span>
              <Link href="/hakkimizda" className="hover:text-white">Hakkımızda</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Yönetim Kurulu</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
              {dbPage.title}
            </h1>
            {dbPage.metaDesc && (
              <p className="text-base md:text-lg text-white/80 max-w-2xl">
                {dbPage.metaDesc}
              </p>
            )}
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg max-w-4xl mx-auto text-foreground">
              <div dangerouslySetInnerHTML={{ __html: dbPage.content }} />
            </div>
          </div>
        </section>

        {dbPage.customCss && (
          <style dangerouslySetInnerHTML={{ __html: dbPage.customCss }} />
        )}
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white pt-32 pb-10 md:pt-36 md:pb-12">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4">
          <nav className="text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href="/hakkimizda" className="hover:text-white">Hakkımızda</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Yönetim Kurulu</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
            Yönetim Kurulu
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl">
            Derneğimizin yönetim ve denetim kurulu üyeleri ile tanışın.
          </p>
        </div>
      </section>

      {/* Yönetim Kurulu */}
      <section className="section-padding bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
              Yönetim Kurulu
            </h2>
            <div className="w-12 h-[3px] bg-primary rounded-full mx-auto mt-4" />
            <p className="text-muted mt-4 max-w-lg mx-auto text-sm">
              Derneğimizin yönetim kurulu, genel kurul tarafından seçilen 7 asıl üyeden oluşmaktadır.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {yonetimKurulu.map((uye, idx) => (
              <MemberCard key={uye.ad} member={uye} featured={idx === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Denetim Kurulu */}
      <section className="section-padding bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
              Denetim Kurulu
            </h2>
            <div className="w-12 h-[3px] bg-primary rounded-full mx-auto mt-4" />
            <p className="text-muted mt-4 max-w-lg mx-auto text-sm">
              Derneğimizin mali ve idari denetimini yürüten kurul üyelerimiz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {denetimKurulu.map((uye) => (
              <AuditCard key={uye.ad} member={uye} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-3">
            Bize Katılın
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-6 text-sm">
            Siz de derneğimize üye olarak toplumsal değişimin bir parçası olun.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/uye-ol" className="btn-primary">Üye Ol</Link>
            <Link href="/iletisim" className="btn-outline">Bize Ulaşın</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
