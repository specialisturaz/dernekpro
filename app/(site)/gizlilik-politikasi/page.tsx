import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik Politikasi",
  description:
    "DernekPro gizlilik politikasi. Kisisel verilerinizin nasil toplandigi, kullanildigi ve korunduguyla ilgili bilgiler.",
  alternates: {
    canonical: "/gizlilik-politikasi",
  },
};

const sections = [
  {
    title: "1. Toplanan Bilgiler",
    content:
      "Web sitemizi ziyaret ettiginizde veya hizmetlerimizi kullandiginizda asagidaki bilgiler toplanabilir:",
    list: [
      "Kimlik bilgileri: Ad, soyad, T.C. kimlik numarasi",
      "Iletisim bilgileri: E-posta adresi, telefon numarasi, adres",
      "Uyelik bilgileri: Uyelik tarihi, uyelik turu, aidat bilgileri",
      "Finansal bilgiler: Bagis ve odeme bilgileri (kredi karti bilgileri tarafimizca saklanmaz)",
      "Teknik bilgiler: IP adresi, tarayici turu, ziyaret suresi, sayfa goruntulenmeleri",
      "Cerez bilgileri: Oturum cerezleri ve tercih cerezleri",
    ],
  },
  {
    title: "2. Bilgilerin Kullanim Amaci",
    content: "Toplanan bilgiler asagidaki amaclarla kullanilmaktadir:",
    list: [
      "Uyelik islemlerinin yurutulmesi ve uye hizmetlerinin sunulmasi",
      "Bagis ve aidat islemlerinin gerceklestirilmesi",
      "Etkinlik, faaliyet ve duyuru bilgilendirmelerinin yapilmasi",
      "Web sitesinin islevselliginin ve guvenliginin saglanmasi",
      "Yasal yukumluluklerin yerine getirilmesi",
      "Istatistiksel analizlerin yapilmasi ve hizmet kalitesinin arttirilmasi",
    ],
  },
  {
    title: "3. Bilgi Guvenligi",
    content:
      "Kisisel verilerinizin guvenligini saglamak icin gerekli teknik ve idari tedbirleri almaktayiz. Verileriniz SSL/TLS sifreleme ile korunmakta, erisim yetkileri sinirlandirilmakta ve duzzenli guvenlik degerlendirmeleri yapilmaktadir. Ancak internet uzerinden yapilan veri iletiminin %100 guvenli oldugu garanti edilemez.",
  },
  {
    title: "4. Cerezler",
    content:
      "Web sitemiz, kullanici deneyimini iyilestirmek ve site islevselligini saglamak amaciyla cerezler kullanmaktadir. Cerezler hakkinda detayli bilgi icin Cerez Politikamizi inceleyebilirsiniz.",
    link: { label: "Cerez Politikamiz", href: "/cerez-politikasi" },
  },
  {
    title: "5. Ucuncu Taraf Hizmetler",
    content:
      "Web sitemiz, hizmet kalitesini artirmak amaciyla ucuncu taraf hizmet saglayicilari kullanabilir. Bu hizmetler arasinda analitik araclar (Google Analytics), odeme islemcileri (iyzico), e-posta gonderim hizmetleri ve bulut depolama hizmetleri yer alabilir. Bu hizmet saglayicilari kendi gizlilik politikalarina tabiidir.",
  },
  {
    title: "6. Degisiklikler",
    content:
      "Bu gizlilik politikasi zaman zaman guncellenebilir. Onemli degisiklikler yapilmasi halinde web sitemiz uzerinden bilgilendirme yapilacaktir. Politikayi duzzenli olarak kontrol etmenizi oneririz.",
  },
  {
    title: "7. Iletisim",
    content:
      "Gizlilik politikamiz ile ilgili sorulariniz icin asagidaki iletisim bilgilerini kullanabilirsiniz.",
  },
];

export default function GizlilikPolitikasiPage() {
  return (
    <main>
      {/* Hero / Breadcrumb */}
      <section className="bg-primary text-white pt-32 pb-10 md:pt-36 md:pb-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <Link href="/" className="hover:text-white">
              Ana Sayfa
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Gizlilik Politikasi</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-heading">
            Gizlilik Politikasi
          </h1>
          <p className="text-white/70 mt-3 max-w-2xl">
            Kisisel verilerinizin nasil toplandigi, kullanildigi ve
            korundugu hakkinda bilgi edinin.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="card p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-bold font-heading text-foreground mb-4">
                  {section.title}
                </h2>
                <p className="text-muted text-sm leading-relaxed">
                  {section.content}
                </p>
                {section.list && (
                  <ul className="space-y-2 mt-3">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.link && (
                  <Link
                    href={section.link.href}
                    className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold mt-3 hover:underline"
                  >
                    {section.link.label}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}

            {/* İletişim Kutusu */}
            <div className="card p-6 md:p-8 bg-primary/5 border-primary/20">
              <h3 className="font-bold text-foreground mb-3">Iletisim Bilgileri</h3>
              <div className="space-y-2 text-sm text-muted">
                <p><strong>Adres:</strong> Merkez Mah. Cumhuriyet Cad. No: 42, Besiktas / Istanbul</p>
                <p><strong>E-posta:</strong> info@dernekpro.com</p>
                <p><strong>Telefon:</strong> +90 (212) 123 45 67</p>
              </div>
            </div>

            <p className="text-xs text-muted text-center">
              Bu gizlilik politikasi en son 01.01.2025 tarihinde guncellenmistir.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
