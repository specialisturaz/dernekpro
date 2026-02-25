import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haber Detay",
  description: "Haber iceriginin detayli sayfasi.",
};

const ilgiliHaberler = [
  {
    slug: "yillik-genel-kurul-toplantisi",
    baslik: "Yillik Genel Kurul Toplantisi Gerceklestirildi",
    tarih: "2024-01-20",
    kategori: "Kurumsal",
  },
  {
    slug: "gonullu-egitim-programi",
    baslik: "Yeni Gonullu Egitim Programi Duyuruldu",
    tarih: "2024-01-10",
    kategori: "Egitim",
  },
  {
    slug: "deprem-yardim-kampanyasi-sonuclari",
    baslik: "Deprem Yardim Kampanyasi Sonuclari Aciklandi",
    tarih: "2024-01-05",
    kategori: "Yardim",
  },
];

export default function HaberDetayPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/70 mb-4">
            <a href="/" className="hover:text-white">
              Ana Sayfa
            </a>
            <span className="mx-2">/</span>
            <a href="/haberler" className="hover:text-white">
              Haberler
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">{params.slug}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              Duyuru
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            2024 Egitim Bursu Basvurulari Basladi
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              28 Ocak 2024
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              DernekPro Yonetim
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              5 dk okuma
            </span>
          </div>
        </div>
      </section>

      {/* Icerik */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Makale */}
            <article className="lg:col-span-2">
              {/* Gorsel */}
              <div className="aspect-video bg-primary/5 rounded-[var(--border-radius)] mb-8 flex items-center justify-center border border-border">
                <svg className="w-20 h-20 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted leading-relaxed mb-6">
                  Dernegimizin 2024 yili egitim bursu basvurulari 1 Subat itibariyle resmi
                  olarak baslamistir. Universite ve lise ogrencilerine yonelik hazirlanan
                  burs programi icin son basvuru tarihi 28 Subat 2024 olarak belirlenmistir.
                </p>

                <h2 className="text-2xl font-bold font-heading text-foreground mb-4 mt-8">
                  Basvuru Sartlari
                </h2>
                <p className="text-muted leading-relaxed mb-4">
                  Burs programina basvurmak isteyen ogrencilerin asagidaki sartlari
                  tasimasi gerekmektedir:
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "T.C. vatandasi olmak",
                    "Universite veya lise ogrencisi olmak",
                    "Genel not ortalamasinin 2.5 ve uzeri olmasi",
                    "Ailenin yillik gelirinin belirli bir sinirin altinda olmasi",
                    "Baska bir kurumdan burs almiyor olmak",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>

                <h2 className="text-2xl font-bold font-heading text-foreground mb-4 mt-8">
                  Basvuru Sureci
                </h2>
                <p className="text-muted leading-relaxed mb-4">
                  Basvurular online olarak dernegimizin web sitesi uzerinden
                  yapilabilecektir. Basvuru formu doldurulduktan sonra gerekli belgeler
                  sisteme yuklenmelidir. Degerlendirme komisyonu, basvurulari inceleyerek
                  mart ayi icerisinde sonuclari aciklayacaktir.
                </p>

                <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 bg-accent rounded-r-[var(--border-radius)]">
                  <p className="text-foreground italic mb-2">
                    &ldquo;Her ogrencinin kaliteli egitime erisim hakki vardir.
                    Burs programimiz ile bu hakki gerceklestirmek icin calismaya
                    devam ediyoruz.&rdquo;
                  </p>
                  <cite className="text-muted text-sm not-italic">
                    — Ahmet Yilmaz, Genel Baskan
                  </cite>
                </blockquote>

                <h2 className="text-2xl font-bold font-heading text-foreground mb-4 mt-8">
                  Onemli Tarihler
                </h2>
                <div className="bg-background-alt rounded-[var(--border-radius)] p-6 border border-border">
                  <div className="grid gap-3">
                    {[
                      { tarih: "1 Subat 2024", olay: "Basvurularin baslamasi" },
                      { tarih: "28 Subat 2024", olay: "Son basvuru tarihi" },
                      { tarih: "1-15 Mart 2024", olay: "Degerlendirme sureci" },
                      { tarih: "20 Mart 2024", olay: "Sonuclarin aciklanmasi" },
                      { tarih: "1 Nisan 2024", olay: "Burs odemelerinin baslamasi" },
                    ].map((item) => (
                      <div key={item.tarih} className="flex items-center gap-4">
                        <span className="text-sm font-bold text-primary min-w-[140px]">
                          {item.tarih}
                        </span>
                        <span className="text-muted text-sm">{item.olay}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Paylas */}
              <div className="mt-10 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-semibold">Bu haberi paylas:</span>
                  <div className="flex gap-3">
                    {["Facebook", "Twitter", "WhatsApp", "LinkedIn"].map((p) => (
                      <button
                        key={p}
                        className="w-10 h-10 rounded-full bg-background-alt border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors text-xs font-bold"
                        title={p}
                      >
                        {p[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">
                  Ilgili Haberler
                </h3>
                <div className="space-y-4">
                  {ilgiliHaberler.map((haber) => (
                    <a
                      key={haber.slug}
                      href={`/haberler/${haber.slug}`}
                      className="block group"
                    >
                      <span className="text-xs text-muted">
                        {new Date(haber.tarih).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mt-1">
                        {haber.baslik}
                      </h4>
                      {haber !== ilgiliHaberler[ilgiliHaberler.length - 1] && (
                        <hr className="border-border mt-4" />
                      )}
                    </a>
                  ))}
                </div>
              </div>

              <div className="card p-6 bg-accent">
                <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                  E-Bulten Aboneligi
                </h3>
                <p className="text-muted text-sm mb-4">
                  Haberlerimizden aninda haberdar olmak icin e-bultenimize abone olun.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <button className="btn-primary w-full text-sm">Abone Ol</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
