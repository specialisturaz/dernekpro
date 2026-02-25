import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haberler",
  description:
    "Dernegimizin son haberleri, basin bultenleri ve guncel gelismeler.",
};

const haberler = [
  {
    slug: "egitim-bursu-basvurulari-basladi",
    baslik: "2024 Egitim Bursu Basvurulari Basladi",
    ozet:
      "Yeni donem icin burs basvurulari 1 Subat itibariyle baslamistir. Son basvuru tarihi 28 Subat 2024.",
    tarih: "2024-01-28",
    kategori: "Duyuru",
    gorsel: "/images/placeholder-news.jpg",
  },
  {
    slug: "yillik-genel-kurul-toplantisi",
    baslik: "Yillik Genel Kurul Toplantisi Gerceklestirildi",
    ozet:
      "Dernegimizin 12. yillik genel kurul toplantisi buyuk bir katilim ile basariyla tamamlanmistir.",
    tarih: "2024-01-20",
    kategori: "Kurumsal",
    gorsel: "/images/placeholder-news.jpg",
  },
  {
    slug: "uluslararasi-is-birligi-protokolu",
    baslik: "Almanya STK'lari ile Is Birligi Protokolu Imzalandi",
    ozet:
      "Dernegimiz, Almanya merkezli uc sivil toplum kurulusu ile ortak proje gelistirme protokolu imzaladi.",
    tarih: "2024-01-15",
    kategori: "Uluslararasi",
    gorsel: "/images/placeholder-news.jpg",
  },
  {
    slug: "gonullu-egitim-programi",
    baslik: "Yeni Gonullu Egitim Programi Duyuruldu",
    ozet:
      "Gonullu adaylarimiz icin hazirlanan kapsamli egitim programi mart ayinda basliyor.",
    tarih: "2024-01-10",
    kategori: "Egitim",
    gorsel: "/images/placeholder-news.jpg",
  },
  {
    slug: "deprem-yardim-kampanyasi-sonuclari",
    baslik: "Deprem Yardim Kampanyasi Sonuclari Aciklandi",
    ozet:
      "Gectigimiz ay duzenledigimiz deprem yardim kampanyasinda toplam 2.5 milyon TL bagis toplandi.",
    tarih: "2024-01-05",
    kategori: "Yardim",
    gorsel: "/images/placeholder-news.jpg",
  },
  {
    slug: "yeni-sube-acilisi",
    baslik: "Ankara Subemiz Hizmete Acildi",
    ozet:
      "Baskent Ankara'da yeni subemiz torene katilan cok sayida davetli ile resmi olarak acildi.",
    tarih: "2023-12-28",
    kategori: "Kurumsal",
    gorsel: "/images/placeholder-news.jpg",
  },
];

export default function HaberlerPage() {
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
            <span className="text-white">Haberler</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Haberler
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Dernegimizin guncel haberleri, basin bultenleri ve onemli
            gelismelerden haberdar olun.
          </p>
        </div>
      </section>

      {/* Featured Haber */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <a
            href={`/haberler/${haberler[0].slug}`}
            className="card grid md:grid-cols-2 group"
          >
            <div className="aspect-video md:aspect-auto bg-primary/10 flex items-center justify-center">
              <svg
                className="w-20 h-20 text-primary/20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {haberler[0].kategori}
                </span>
                <span className="text-xs text-muted">
                  {new Date(haberler[0].tarih).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-3 group-hover:text-primary transition-colors">
                {haberler[0].baslik}
              </h2>
              <p className="text-muted mb-4">{haberler[0].ozet}</p>
              <span className="text-primary font-semibold text-sm inline-flex items-center gap-1">
                Devamini Oku
                <svg
                  className="w-4 h-4"
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
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* Haber Listesi */}
      <section className="pb-16 md:pb-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {haberler.slice(1).map((haber) => (
              <a
                key={haber.slug}
                href={`/haberler/${haber.slug}`}
                className="card group"
              >
                <div className="aspect-video bg-primary/5 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-primary/20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      {haber.kategori}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(haber.tarih).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors">
                    {haber.baslik}
                  </h3>
                  <p className="text-muted text-sm line-clamp-2">{haber.ozet}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-12">
            <button className="px-4 py-2 rounded border border-border text-muted hover:bg-background-alt transition-colors">
              Onceki
            </button>
            <button className="px-4 py-2 rounded bg-primary text-white font-semibold">
              1
            </button>
            <button className="px-4 py-2 rounded border border-border text-muted hover:bg-background-alt transition-colors">
              2
            </button>
            <button className="px-4 py-2 rounded border border-border text-muted hover:bg-background-alt transition-colors">
              3
            </button>
            <button className="px-4 py-2 rounded border border-border text-muted hover:bg-background-alt transition-colors">
              Sonraki
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
