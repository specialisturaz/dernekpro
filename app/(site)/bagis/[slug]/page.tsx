import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kampanya Detay",
  description: "Bagis kampanyasi detaylari ve destek formu.",
};

const sonDestekler = [
  { ad: "Mehmet K.", tutar: 500, tarih: "2 saat once" },
  { ad: "Anonim", tutar: 1000, tarih: "5 saat once" },
  { ad: "Ayse D.", tutar: 250, tarih: "1 gun once" },
  { ad: "Anonim", tutar: 100, tarih: "1 gun once" },
  { ad: "Ali R.", tutar: 2500, tarih: "2 gun once" },
];

export default function KampanyaDetayPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-primary text-white pt-28 pb-8 md:pt-32 md:pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <a href="/" className="hover:text-white">
              Ana Sayfa
            </a>
            <span className="mx-2">/</span>
            <a href="/bagis" className="hover:text-white">
              Bagis
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">{params.slug}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            Egitim Bursu Fonu
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Ihtiyac sahibi ogrencilere burs saglamak icin bagis yapin ve bir
            ogrencinin gelecegine isik tutun.
          </p>
        </div>
      </section>

      {/* Ilerleme Cubugu */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-3xl font-bold font-heading text-primary">
                  850.000 TL
                </span>
                <span className="text-muted ml-2">/ 1.200.000 TL hedef</span>
              </div>
              <span className="text-sm text-muted">342 destekci</span>
            </div>
            <div className="w-full bg-background-alt rounded-full h-4 border border-border">
              <div className="bg-primary h-4 rounded-full" style={{ width: "71%" }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted">
              <span>%71 tamamlandi</span>
              <span>Kalan: 350.000 TL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Icerik */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Detay */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-primary/5 rounded-[var(--border-radius)] mb-8 flex items-center justify-center border border-border">
                <svg className="w-20 h-20 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>

              <article className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold font-heading text-foreground mb-4">
                  Kampanya Hakkinda
                </h2>
                <p className="text-muted leading-relaxed mb-6">
                  Egitim Bursu Fonu, Turkiye genelinde maddi imkanlari yetersiz olan
                  basarili ogrencilere yonelik kapsamli bir destek programidir. 2012
                  yilindan bu yana 3.000&apos;den fazla ogrenciye burs destegi sagladik.
                </p>
                <p className="text-muted leading-relaxed mb-6">
                  2024 yili hedefimiz 750 yeni ogrenciye burs destegi ulastirmaktir.
                  Su ana kadar 500 ogrenci programa dahil edilmis olup, kalan 250 ogrenci
                  icin sizlerin desteginize ihtiyac duymaktayiz.
                </p>

                <h3 className="text-xl font-bold font-heading text-foreground mb-3 mt-8">
                  Bagisinizla Neler Yapilir?
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { tutar: "100 TL", etki: "1 ogrencinin 1 aylik kitap ihtiyaci" },
                    { tutar: "250 TL", etki: "1 ogrencinin 1 aylik ulasim gideri" },
                    { tutar: "500 TL", etki: "1 ogrencinin 1 aylik burs destegi" },
                    { tutar: "2.500 TL", etki: "1 ogrencinin 1 donemlik bursu" },
                  ].map((item) => (
                    <div
                      key={item.tutar}
                      className="bg-accent rounded-[var(--border-radius)] p-4 border border-primary/10"
                    >
                      <span className="text-lg font-bold text-primary">{item.tutar}</span>
                      <p className="text-muted text-sm mt-1">{item.etki}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            {/* Sidebar - Bagis Formu */}
            <aside className="space-y-6">
              <div className="card p-6 sticky top-4">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">
                  Bu Kampanyaya Destek Ol
                </h3>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[100, 250, 500, 1000, 2500, 5000].map((tutar) => (
                    <button
                      key={tutar}
                      className={`py-2 rounded-[var(--border-radius)] border text-sm font-semibold transition-colors ${
                        tutar === 500
                          ? "border-primary bg-primary text-white"
                          : "border-border text-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {tutar >= 1000
                        ? `${(tutar / 1000).toFixed(tutar % 1000 === 0 ? 0 : 1)}K`
                        : tutar}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  placeholder="Diger tutar (TL)"
                  className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mb-4"
                />

                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Ad Soyad"
                    className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <input
                    type="email"
                    placeholder="E-posta"
                    className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-xs text-muted">Anonim bagis yap</span>
                </label>

                <button className="btn-primary w-full">500 TL Bagis Yap</button>

                <p className="text-xs text-muted text-center mt-3">
                  Guvenli odeme altyapisi ile korunmaktadir.
                </p>
              </div>

              {/* Son Destekler */}
              <div className="card p-6">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">
                  Son Destekler
                </h3>
                <div className="space-y-3">
                  {sonDestekler.map((destek, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {destek.ad[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {destek.ad}
                          </p>
                          <p className="text-xs text-muted">{destek.tarih}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {destek.tutar.toLocaleString("tr-TR")} TL
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paylas */}
              <div className="card p-6">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">
                  Kampanyayi Paylas
                </h3>
                <p className="text-muted text-sm mb-3">
                  Paylasarak daha fazla kisiye ulasmasina yardimci olun.
                </p>
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
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
