import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Duyurular",
  description:
    "Dernegimizin resmi duyurulari, onemli bilgilendirmeler ve guncel aciklamalar.",
};

const duyurular = [
  {
    slug: "genel-kurul-daveti",
    baslik: "2024 Olagan Genel Kurul Toplanti Daveti",
    ozet:
      "Dernegimizin 2024 yili olagan genel kurul toplantisi 15 Mart 2024 tarihinde gerceklestirilecektir.",
    tarih: "2024-02-01",
    onem: "yuksek",
    sabitlenmis: true,
  },
  {
    slug: "aidatlarda-degisiklik",
    baslik: "Uyelik Aidat Bedelleri Guncellendi",
    ozet:
      "2024 yili icin gecerli olan uyelik aidat bedelleri yonetim kurulu karari ile guncellenmistir.",
    tarih: "2024-01-25",
    onem: "orta",
    sabitlenmis: false,
  },
  {
    slug: "bayram-mesaji",
    baslik: "Ramazan Bayrami Kutlama Mesaji",
    ozet:
      "Tum uyelerimizin ve vatandaslarimizin Ramazan Bayramini en icten dileklerimizle kutlariz.",
    tarih: "2024-01-20",
    onem: "normal",
    sabitlenmis: false,
  },
  {
    slug: "ofis-tasinma",
    baslik: "Merkez Ofis Adres Degisikligi",
    ozet:
      "Dernegimizin merkez ofisi 1 Subat 2024 itibariyle yeni adresine tasiniyor.",
    tarih: "2024-01-18",
    onem: "yuksek",
    sabitlenmis: false,
  },
  {
    slug: "gonullu-cagri",
    baslik: "Gonullu Basvurulari Acildi",
    ozet:
      "2024 yili projelerimiz icin gonullu basvurulari baslamistir. Basvurular 15 Subat tarihine kadar devam edecektir.",
    tarih: "2024-01-12",
    onem: "orta",
    sabitlenmis: false,
  },
  {
    slug: "web-sitesi-yenilendi",
    baslik: "Web Sitemiz Yenilendi",
    ozet:
      "Dernegimizin web sitesi tamamen yenilenarak modern ve kullanici dostu bir hale getirildi.",
    tarih: "2024-01-05",
    onem: "normal",
    sabitlenmis: false,
  },
];

function getOnemStil(onem: string) {
  switch (onem) {
    case "yuksek":
      return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
    case "orta":
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
    default:
      return "bg-background border-border";
  }
}

function getOnemEtiket(onem: string) {
  switch (onem) {
    case "yuksek":
      return { text: "Onemli", renk: "bg-red-100 text-red-800" };
    case "orta":
      return { text: "Bilgilendirme", renk: "bg-yellow-100 text-yellow-800" };
    default:
      return { text: "Genel", renk: "bg-gray-100 text-gray-800" };
  }
}

export default function DuyurularPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/70 mb-4">
            <a href="/" className="hover:text-white">
              Ana Sayfa
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">Duyurular</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Duyurular
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Dernegimize ait resmi duyurular, onemli bilgilendirmeler ve
            aciklamalari bu sayfada bulabilirsiniz.
          </p>
        </div>
      </section>

      {/* Duyuru Listesi */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Sabitlenmis Duyuru */}
          {duyurular
            .filter((d) => d.sabitlenmis)
            .map((duyuru) => (
              <a
                key={duyuru.slug}
                href={`/duyurular/${duyuru.slug}`}
                className="block mb-6 p-6 rounded-[var(--border-radius)] border-2 border-primary bg-accent hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                  </svg>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    Sabitlenmis Duyuru
                  </span>
                </div>
                <h2 className="text-xl font-bold font-heading text-foreground mb-2">
                  {duyuru.baslik}
                </h2>
                <p className="text-muted text-sm mb-3">{duyuru.ozet}</p>
                <span className="text-xs text-muted">
                  {new Date(duyuru.tarih).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </a>
            ))}

          {/* Diger Duyurular */}
          <div className="space-y-4">
            {duyurular
              .filter((d) => !d.sabitlenmis)
              .map((duyuru) => {
                const etiket = getOnemEtiket(duyuru.onem);
                return (
                  <a
                    key={duyuru.slug}
                    href={`/duyurular/${duyuru.slug}`}
                    className={`block p-5 rounded-[var(--border-radius)] border hover:shadow-md transition-shadow ${getOnemStil(
                      duyuru.onem
                    )}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${etiket.renk}`}
                          >
                            {etiket.text}
                          </span>
                          <span className="text-xs text-muted">
                            {new Date(duyuru.tarih).toLocaleDateString("tr-TR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold font-heading text-foreground mb-1">
                          {duyuru.baslik}
                        </h3>
                        <p className="text-muted text-sm">{duyuru.ozet}</p>
                      </div>
                      <svg
                        className="w-5 h-5 text-muted flex-shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </a>
                );
              })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-12">
            <button className="px-4 py-2 rounded border border-border text-muted hover:bg-background transition-colors">
              Onceki
            </button>
            <button className="px-4 py-2 rounded bg-primary text-white font-semibold">
              1
            </button>
            <button className="px-4 py-2 rounded border border-border text-muted hover:bg-background transition-colors">
              2
            </button>
            <button className="px-4 py-2 rounded border border-border text-muted hover:bg-background transition-colors">
              Sonraki
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
