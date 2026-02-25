import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bagis Yap",
  description:
    "Dernegimize bagis yaparak toplumsal projelere destek olun. Guvenli online odeme ile egitim, saglik ve cevre projelerine katki saglayin.",
};

const kampanyalar = [
  {
    slug: "egitim-bursu-fonu",
    baslik: "Egitim Bursu Fonu",
    aciklama: "Ihtiyac sahibi ogrencilere burs saglamak icin bagis yapin.",
    hedef: 1200000,
    toplanan: 850000,
    destekci: 342,
  },
  {
    slug: "saglik-taramasi-kampanyasi",
    baslik: "Saglik Taramasi Kampanyasi",
    aciklama: "Kirsal bolgelerde ucretsiz saglik taramasi icin destek olun.",
    hedef: 500000,
    toplanan: 320000,
    destekci: 178,
  },
  {
    slug: "cevre-koruma-projesi",
    baslik: "Cevre Koruma Projesi",
    aciklama: "10.000 agac dikme hedefimize ulasmak icin katki saglayin.",
    hedef: 300000,
    toplanan: 180000,
    destekci: 215,
  },
];

const bagisSecenekleri = [50, 100, 250, 500, 1000, 2500];

export default function BagisPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/70 mb-4">
            <a href="/" className="hover:text-white">
              Ana Sayfa
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">Bagis</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
              Bagis Yapin, Hayat Degistirin
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Her bagis, ihtiyac sahibi birinin hayatinda anlamli bir degisim
              yaratir. Siz de toplumsal projelere destek olarak farkindalik
              yaratabilirsiniz.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#bagis-formu" className="btn-secondary">
                Hemen Bagis Yap
              </a>
              <a
                href="#kampanyalar"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-[var(--border-radius)] hover:bg-white hover:text-primary transition-all duration-200"
              >
                Kampanyalari Gor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Neden Bagis */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Bagislariniz Nasil Kullanilir?
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Tam seffaflik ilkesiyle yonetilen bagis sistemimiz ile her
              kurusun nereye harcandigi takip edilebilir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                ikon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
                baslik: "Egitim",
                aciklama:
                  "Bagisinizin %40'i ogrenci burslari, kitap yardimi ve egitim programlarina aktarilir.",
                yuzde: 40,
              },
              {
                ikon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                baslik: "Saglik",
                aciklama:
                  "Bagisinizin %30'u saglik taramasi, tedavi destegi ve saglik egitimi projelerine ayrılır.",
                yuzde: 30,
              },
              {
                ikon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
                baslik: "Cevre",
                aciklama:
                  "Bagisinizin %30'u cevre koruma, agaclandirma ve surdurulebilirlik projelerine harcanir.",
                yuzde: 30,
              },
            ].map((item) => (
              <div key={item.baslik} className="card p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={item.ikon}
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                  {item.baslik}
                </h3>
                <p className="text-muted text-sm mb-4">{item.aciklama}</p>
                <div className="w-full bg-background-alt rounded-full h-2 border border-border">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${item.yuzde}%` }}
                  />
                </div>
                <p className="text-primary font-bold text-sm mt-2">%{item.yuzde}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kampanyalar */}
      <section id="kampanyalar" className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Aktif Kampanyalar
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Belirli bir projeye destek olmak istiyorsaniz aktif kampanyalarimizdan
              birini secebilirsiniz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {kampanyalar.map((kampanya) => {
              const yuzde = Math.round(
                (kampanya.toplanan / kampanya.hedef) * 100
              );
              return (
                <a
                  key={kampanya.slug}
                  href={`/bagis/${kampanya.slug}`}
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
                    <h3 className="text-lg font-bold font-heading text-foreground group-hover:text-primary transition-colors mb-2">
                      {kampanya.baslik}
                    </h3>
                    <p className="text-muted text-sm mb-4">{kampanya.aciklama}</p>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground font-semibold">
                          {kampanya.toplanan.toLocaleString("tr-TR")} TL
                        </span>
                        <span className="text-muted">
                          {kampanya.hedef.toLocaleString("tr-TR")} TL
                        </span>
                      </div>
                      <div className="w-full bg-background-alt rounded-full h-2.5 border border-border">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${yuzde}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>%{yuzde} tamamlandi</span>
                      <span>{kampanya.destekci} destekci</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bagis Formu */}
      <section id="bagis-formu" className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
                Genel Bagis
              </h2>
              <p className="text-muted">
                Genel bagis fonumuza katki yaparak tum projelerimize destek
                olabilirsiniz.
              </p>
            </div>

            <div className="card p-8">
              {/* Bagis Tipi */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Bagis Tipi
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-3 rounded-[var(--border-radius)] border-2 border-primary bg-primary/5 text-primary font-semibold text-sm">
                    Tek Seferlik
                  </button>
                  <button className="px-4 py-3 rounded-[var(--border-radius)] border-2 border-border text-muted font-semibold text-sm hover:border-primary hover:text-primary transition-colors">
                    Aylik Duzenli
                  </button>
                </div>
              </div>

              {/* Tutar Secimi */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Bagis Tutari (TL)
                </label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {bagisSecenekleri.map((tutar) => (
                    <button
                      key={tutar}
                      className={`px-4 py-3 rounded-[var(--border-radius)] border-2 font-semibold text-sm transition-colors ${
                        tutar === 250
                          ? "border-primary bg-primary text-white"
                          : "border-border text-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {tutar.toLocaleString("tr-TR")} TL
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">
                    TL
                  </span>
                  <input
                    type="number"
                    placeholder="Diger tutar giriniz"
                    className="w-full pl-10 pr-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              {/* Kisisel Bilgiler */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Kisisel Bilgiler
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Adiniz"
                      className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Soyadiniz"
                      className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon numaraniz"
                    className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              {/* Anonim */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-muted">
                    Bagisimi anonim olarak yapmak istiyorum
                  </span>
                </label>
              </div>

              {/* Not */}
              <div className="mb-8">
                <textarea
                  rows={3}
                  placeholder="Bagis notu (istege bagli)"
                  className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>

              <button className="btn-primary w-full text-lg py-4">
                250 TL Bagis Yap
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                256-bit SSL ile guvenli odeme altyapisi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banka Bilgileri */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-heading text-foreground mb-4">
              Banka Havalesi ile Bagis
            </h2>
            <p className="text-muted mb-8">
              Online odeme yerine banka havalesi tercih ediyorsaniz asagidaki
              hesap bilgilerini kullanabilirsiniz.
            </p>
            <div className="card p-6 text-left">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted">Hesap Sahibi</dt>
                  <dd className="text-foreground font-semibold">DernekPro Dernegi</dd>
                </div>
                <hr className="border-border" />
                <div>
                  <dt className="text-sm text-muted">Banka</dt>
                  <dd className="text-foreground font-semibold">Turkiye Is Bankasi</dd>
                </div>
                <hr className="border-border" />
                <div>
                  <dt className="text-sm text-muted">IBAN</dt>
                  <dd className="text-foreground font-semibold font-mono text-sm">
                    TR00 0000 0000 0000 0000 0000 00
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
