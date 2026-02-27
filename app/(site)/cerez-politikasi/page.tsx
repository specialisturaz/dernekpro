import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cerez Politikasi",
  description:
    "DernekPro cerez politikasi. Web sitemizde kullanilan cerezler ve yonetimi hakkinda bilgi.",
  alternates: {
    canonical: "/cerez-politikasi",
  },
};

const cookieTypes = [
  {
    name: "Zorunlu Cerezler",
    description:
      "Web sitesinin temel islevlerini yerine getirmesi icin gerekli olan cerezlerdir. Bu cerezler olmadan site duzgun calismaz.",
    examples: [
      "Oturum yonetimi (giris yapma, sepet bilgileri)",
      "Guvenlik cerezleri (CSRF korumasi)",
      "Yuk dengeleme cerezleri",
    ],
    required: true,
  },
  {
    name: "Analitik Cerezler",
    description:
      "Ziyaretcilerin web sitesini nasil kullandigini anlamamiza yardimci olan cerezlerdir. Bu veriler anonim olarak toplanir.",
    examples: [
      "Sayfa goruntulenme sayilari",
      "Ziyaretci sayisi ve kaynaklari",
      "Sitede gecirilen sure",
    ],
    required: false,
  },
  {
    name: "Islevsel Cerezler",
    description:
      "Kullanici tercihlerini hatirlamamiza yardimci olan cerezlerdir. Bu cerezler kisisellestirilmis deneyim saglar.",
    examples: [
      "Dil ve bolge tercihleri",
      "Tema tercihleri (acik/koyu mod)",
      "Son ziyaret edilen sayfalar",
    ],
    required: false,
  },
];

export default function CerezPolitikasiPage() {
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
            <span className="text-white">Cerez Politikasi</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-heading">
            Cerez Politikasi
          </h1>
          <p className="text-white/70 mt-3 max-w-2xl">
            Web sitemizde kullanilan cerezler ve bunlari nasil yonetebileceginiz
            hakkinda bilgi edinin.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Çerez Nedir? */}
            <div className="card p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold font-heading text-foreground mb-4">
                Cerez Nedir?
              </h2>
              <p className="text-muted text-sm leading-relaxed">
                Cerezler (cookies), web sitelerinin tarayiciniza gonderigi kucuk
                metin dosyalaridir. Bu dosyalar cihazinizda saklanarak web sitesinin
                sizi tanimlamasini ve tercihlerinizi hatirlmasini saglar. Cerezler,
                web sitelerinin duzgun calismasi, guvenligin saglanmasi ve kullanici
                deneyiminin iyilestirilmesi icin yaygin olarak kullanilmaktadir.
              </p>
            </div>

            {/* Çerez Türleri */}
            <div className="card p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold font-heading text-foreground mb-6">
                Kullandigimiz Cerez Turleri
              </h2>
              <div className="space-y-6">
                {cookieTypes.map((type) => (
                  <div
                    key={type.name}
                    className="p-4 rounded-lg border border-border bg-background-alt"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-foreground text-sm">{type.name}</h3>
                      {type.required ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          Zorunlu
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-muted">
                          Opsiyonel
                        </span>
                      )}
                    </div>
                    <p className="text-muted text-sm leading-relaxed mb-3">
                      {type.description}
                    </p>
                    <ul className="space-y-1.5">
                      {type.examples.map((example) => (
                        <li key={example} className="flex items-start gap-2 text-xs text-muted">
                          <span className="w-1 h-1 bg-primary/50 rounded-full mt-1.5 flex-shrink-0" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Çerez Kontrolü */}
            <div className="card p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold font-heading text-foreground mb-4">
                Cerezleri Nasil Kontrol Edebilirsiniz?
              </h2>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Cerez tercihlerinizi tarayici ayarlariniz uzerinden yonetebilirsiniz.
                Cogu tarayici cerezleri kabul etme, reddetme veya silme secenekleri sunar.
                Asagidaki baglantilari kullanarak tarayicinizin cerez ayarlarina ulasabilirsiniz:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
                  { name: "Mozilla Firefox", url: "https://support.mozilla.org/tr/kb/cerezleri-silme" },
                  { name: "Apple Safari", url: "https://support.apple.com/tr-tr/guide/safari/sfri11471" },
                  { name: "Microsoft Edge", url: "https://support.microsoft.com/tr-tr/microsoft-edge" },
                ].map((browser) => (
                  <a
                    key={browser.name}
                    href={browser.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors text-sm"
                  >
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="text-foreground font-medium">{browser.name}</span>
                  </a>
                ))}
              </div>
              <p className="text-xs text-muted mt-4">
                Cerezleri devre disi birakmaniz durumunda web sitemizin bazi ozellikleri
                duzgun calismayabilir.
              </p>
            </div>

            {/* Üçüncü Taraf Çerezler */}
            <div className="card p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold font-heading text-foreground mb-4">
                Ucuncu Taraf Cerezler
              </h2>
              <p className="text-muted text-sm leading-relaxed">
                Web sitemiz, ucuncu taraf hizmet saglayicilari tarafindan yerlestirilmis
                cerezler icerebilir. Bu cerezler, analitik veriler toplama (Google Analytics),
                sosyal medya entegrasyonlari saglama ve odeme islemlerini gerceklestirme
                gibi amaclarla kullanilir. Ucuncu taraf cerezleri, ilgili hizmet saglayicisinin
                gizlilik politikasina tabidir.
              </p>
            </div>

            {/* İletişim */}
            <div className="card p-6 md:p-8 bg-primary/5 border-primary/20">
              <h3 className="font-bold text-foreground mb-3">Iletisim</h3>
              <p className="text-muted text-sm mb-3">
                Cerez politikamiz hakkinda sorulariniz icin bizimle iletisime gecebilirsiniz.
              </p>
              <div className="space-y-2 text-sm text-muted">
                <p><strong>E-posta:</strong> info@dernekpro.com</p>
                <p><strong>Telefon:</strong> +90 (212) 123 45 67</p>
              </div>
            </div>

            <p className="text-xs text-muted text-center">
              Bu cerez politikasi en son 01.01.2025 tarihinde guncellenmistir.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
