import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getDefaultTenant } from "@/lib/tenant";
import { isModuleActive } from "@/lib/modules/utils";
import BankAccountsClient from "@/components/site/BankAccountsClient";

export const metadata: Metadata = {
  title: "Hesap Numaralarımız",
  description: "Derneğimize bağış yapmak için kullanabileceğiniz banka hesap bilgileri ve IBAN numaraları.",
  openGraph: {
    title: "Hesap Numaralarımız",
    description: "Derneğimize bağış yapmak için kullanabileceğiniz banka hesap bilgileri ve IBAN numaraları.",
  },
  alternates: {
    canonical: "/hesaplar",
  },
};

async function getBankAccounts() {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({ where: { id: tenantId }, select: { id: true } })
      : await prisma.tenant.findFirst({ where: { isActive: true }, select: { id: true }, orderBy: { createdAt: "asc" } });

    if (!tenant) return [];

    return prisma.bankAccount.findMany({
      where: { tenantId: tenant.id, isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        bankName: true,
        bankLogo: true,
        accountName: true,
        iban: true,
        accountNo: true,
        branchName: true,
        branchCode: true,
        currency: true,
        description: true,
      },
    });
  } catch {
    return [];
  }
}

function countUniqueBanks(accounts: { bankName: string }[]) {
  return new Set(accounts.map((a) => a.bankName)).size;
}

const trustItems = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Güvenli Bağış",
    desc: "Tüm hesaplar resmi kuruluş adına",
    bg: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: "Şeffaf Yönetim",
    desc: "Bağışlarınız denetim altında",
    bg: "bg-blue-50 text-blue-600",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Makbuz Verilir",
    desc: "Talep halinde bağış makbuzu",
    bg: "bg-amber-50 text-amber-600",
  },
];

const donationSteps = [
  {
    step: 1,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "IBAN'ı Kopyalayın",
    desc: "Aşağıdaki listeden ilgili hesabın IBAN numarasını kopyalayın.",
  },
  {
    step: 2,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Havale / EFT Yapın",
    desc: "Bankanızın mobil uygulaması veya internet şubesinden transfer yapın.",
  },
  {
    step: 3,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: "Açıklama Ekleyin",
    desc: "Havale açıklamasına adınızı ve bağış türünü (zekat, fitre vb.) yazın.",
  },
];

export default async function HesaplarPage() {
  const accounts = await getBankAccounts();
  const tenant = await getDefaultTenant();
  const donationsActive = tenant ? await isModuleActive(tenant.id, "donations") : true;
  const bankCount = countUniqueBanks(accounts);

  return (
    <main>
      {/* Bölüm 1: Kompakt Header */}
      <section className="relative bg-primary text-white pt-32 pb-10 md:pt-36 md:pb-14 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        {/* Dekoratif banka ikonu */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.06] hidden lg:block" aria-hidden="true">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v1h20V7L12 2zm0 2.236L18.09 7H5.91L12 4.236zM4 9v7h2V9H4zm5 0v7h2V9H9zm5 0v7h2V9h-2zm5 0v7h2V9h-2zM2 17v2h20v-2H2z" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Hesap Numaralarımız</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-3xl md:text-4xl font-bold font-heading">
                  Banka Hesaplarımız
                </h1>
                {bankCount > 0 && (
                  <span className="bg-white/20 backdrop-blur text-white text-sm font-semibold px-3 py-1 rounded-full hidden sm:inline-flex">
                    {bankCount} Banka
                  </span>
                )}
              </div>
              <p className="text-white/80 text-base max-w-lg">
                IBAN numarasını kopyalayarak kolayca bağışta bulunabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bölüm 2: Güven Göstergeleri */}
      <section className="relative -mt-6 z-10 mb-2">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex items-center gap-3 hover:shadow-xl transition-shadow"
              >
                <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{item.title}</p>
                  <p className="text-muted text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bölüm 3: Banka Kartları */}
      <section className="relative py-12 md:py-16 bg-background">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/[0.02] rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <BankAccountsClient accounts={accounts} />
          </div>
        </div>
      </section>

      {/* Bölüm 4: Nasıl Bağış Yapılır */}
      <section className="py-12 md:py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-2">
              Nasıl Bağış Yapılır?
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Banka havalesi ile bağış yapmak çok kolay. 3 adımda tamamlayın.
            </p>
          </div>
          {/* Desktop: 3 sütun grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {donationSteps.map((s, i) => (
              <div key={s.step} className="text-center relative">
                {/* Bağlayıcı çizgi */}
                {i < donationSteps.length - 1 && (
                  <div className="absolute top-6 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" aria-hidden="true" />
                )}
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold relative z-10">
                  {s.step}
                </div>
                <div className="text-primary mb-3 flex justify-center">{s.icon}</div>
                <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                <p className="text-muted text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          {/* Mobil: Dikey timeline */}
          <div className="md:hidden space-y-6 max-w-sm mx-auto">
            {donationSteps.map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {s.step}
                  </div>
                  {s.step < donationSteps.length && (
                    <div className="w-0.5 flex-1 bg-primary/20 mt-2" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-muted text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bölüm 5: Bilgi + CTA */}
      <section className="py-12 md:py-16 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Sol: Bilgilendirme */}
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-3">
                Bağış Bilgilendirme
              </h3>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  Havale açıklamasına <strong className="text-foreground">adınızı</strong> ve <strong className="text-foreground">bağış türünü</strong> yazın.
                </li>
                <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  Bağış türleri: Genel bağış, zekat, fitre, sadaka, kurban vb.
                </li>
                <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  Makbuz almak için <Link href="/iletisim" className="text-primary hover:underline font-medium">iletişim sayfamızdan</Link> bize ulaşabilirsiniz.
                </li>
              </ul>
            </div>

            {/* Sağ: CTA */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold font-heading mb-2">
                  {donationsActive ? "Online Bağış Yapın" : "Sorularınız mı var?"}
                </h3>
                <p className="text-white/80 text-sm mb-6">
                  {donationsActive
                    ? "Kredi kartı veya banka kartınız ile güvenli şekilde online bağış yapabilirsiniz."
                    : "Bağış ve hesap bilgileri hakkında sorularınız için bizimle iletişime geçebilirsiniz."}
                </p>
              </div>
              <Link
                href={donationsActive ? "/bagis" : "/iletisim"}
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold py-3 px-6 rounded-xl hover:bg-white/90 transition-colors text-center"
              >
                {donationsActive ? "Online Bağış Yap" : "İletişime Geç"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
