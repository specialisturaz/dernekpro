import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkimizda",
  description:
    "Dernegimizin tarihcesi, misyonu, vizyonu ve basarilarimiz hakkinda detayli bilgi edinin.",
};

const istatistikler = [
  { sayi: "2.500+", etiket: "Aktif Uye" },
  { sayi: "150+", etiket: "Tamamlanan Proje" },
  { sayi: "50+", etiket: "Partner Kurum" },
  { sayi: "12", etiket: "Yillik Deneyim" },
];

const yonetimKurulu = [
  {
    ad: "Ahmet Yilmaz",
    gorev: "Genel Baskan",
    foto: "/images/placeholder-avatar.jpg",
  },
  {
    ad: "Fatma Demir",
    gorev: "Baskan Yardimcisi",
    foto: "/images/placeholder-avatar.jpg",
  },
  {
    ad: "Mehmet Kaya",
    gorev: "Genel Sekreter",
    foto: "/images/placeholder-avatar.jpg",
  },
  {
    ad: "Ayse Celik",
    gorev: "Sayman",
    foto: "/images/placeholder-avatar.jpg",
  },
];

const tarihce = [
  {
    yil: "2012",
    baslik: "Kurulusumuz",
    aciklama:
      "Dernegimiz, toplumsal dayanisma ve yardimlasma amaciyla bir grup gonullu tarafindan kuruldu.",
  },
  {
    yil: "2015",
    baslik: "Ilk Buyuk Projemiz",
    aciklama:
      "Egitim bursu programimiz ile 100 ogrenciye burs saglamaya basladik.",
  },
  {
    yil: "2018",
    baslik: "Uluslararasi Is Birlikleri",
    aciklama:
      "Avrupa ve Ortadogu'daki sivil toplum kuruluslari ile is birligi protokolleri imzaladik.",
  },
  {
    yil: "2021",
    baslik: "Dijital Donusum",
    aciklama:
      "Online platformumuzu hayata gecirerek dijital cagda dernek yonetimini modernize ettik.",
  },
  {
    yil: "2024",
    baslik: "2.500 Uye Hedefi",
    aciklama:
      "Aktif uye sayimiz 2.500'u asarak Turkiye'nin en buyuk toplumsal dayanisma derneklerinden biri olduk.",
  },
];

export default function HakkimizdaPage() {
  return (
    <main>
      {/* Hero / Breadcrumb */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/70 mb-4">
            <a href="/" className="hover:text-white">
              Ana Sayfa
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">Hakkimizda</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Hakkimizda
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl">
            Toplumsal dayanisma ve yardimlasma amaciyla kurulan dernegimiz,
            binlerce gonullu ile birlikte topluma deger katmaya devam ediyor.
          </p>
        </div>
      </section>

      {/* Tarihce */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Tarihcemiz
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Kurulusumuzdan bugune kadar gecen surecte attigi adimlar ve
              basarilarimiz.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform md:-translate-x-1/2" />

            {tarihce.map((item, index) => (
              <div
                key={item.yil}
                className={`relative flex items-start mb-12 ${
                  index % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 mt-2 z-10 ring-4 ring-accent" />

                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                  }`}
                >
                  <span className="inline-block bg-primary text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
                    {item.yil}
                  </span>
                  <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                    {item.baslik}
                  </h3>
                  <p className="text-muted">{item.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Misyon */}
            <div className="card p-8 md:p-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-4">
                Misyonumuz
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Toplumsal dayanisma ve yardimlasma bilincini gelistirmek,
                ihtiyac sahibi bireylere ve topluluklara destek saglamak,
                egitim, saglik ve cevre alanlarinda surdurulebilir projeler
                uretmektir.
              </p>
              <ul className="space-y-3">
                {[
                  "Egitimde firsat esitligi saglamak",
                  "Toplumsal dayanismayi guclendirmek",
                  "Surdurulebilir projeler gelistirmek",
                  "Gonullu katilimi tesvik etmek",
                ].map((madde) => (
                  <li key={madde} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-foreground">{madde}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vizyon */}
            <div className="card p-8 md:p-10">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-4">
                Vizyonumuz
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Turkiye&apos;de ve dunyada toplumsal kalkinma alaninda oncu,
                yenilikci ve guvenilir bir sivil toplum kurulusu olmak;
                bireylerin ve topluluklarin yasam kalitesini artirmaya yonelik
                calismalarda lider rol ustlenmektir.
              </p>
              <ul className="space-y-3">
                {[
                  "Ulusal ve uluslararasi alanda soz sahibi olmak",
                  "Teknoloji odakli toplumsal cozumler uretmek",
                  "Genc nesillere ilham vermek",
                  "Seffaf ve hesap verebilir yonetim anlayisi",
                ].map((madde) => (
                  <li key={madde} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-foreground">{madde}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Istatistikler */}
      <section className="section-padding bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Rakamlarla Biz
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Kurulusumuzdan bugune kadar elde ettigimiz basarilar.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {istatistikler.map((stat) => (
              <div key={stat.etiket} className="text-center">
                <div className="text-4xl md:text-5xl font-bold font-heading mb-2 animate-count-up">
                  {stat.sayi}
                </div>
                <div className="text-white/70 text-sm md:text-base uppercase tracking-wider">
                  {stat.etiket}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yonetim Kurulu */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Yonetim Kurulu
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Dernegimizin yonetim kurulu uyeleri ile tanisin.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {yonetimKurulu.map((uye) => (
              <div key={uye.ad} className="card p-6 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-primary/40"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold font-heading text-foreground">
                  {uye.ad}
                </h3>
                <p className="text-muted text-sm">{uye.gorev}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
            Bize Katilin
          </h2>
          <p className="text-muted max-w-2xl mx-auto mb-8">
            Siz de dernegimize uye olarak toplumsal degisimin bir parcasi olun.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/uye-ol" className="btn-primary">
              Uye Ol
            </a>
            <a href="/iletisim" className="btn-outline">
              Bize Ulasin
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
