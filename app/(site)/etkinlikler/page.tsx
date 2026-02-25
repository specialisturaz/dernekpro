import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Etkinlikler",
  description:
    "Dernegimizin duzenledigi etkinlikler, seminerler, konferanslar ve sosyal bulusmalarin takvimi.",
};

const etkinlikler = [
  {
    slug: "gonullu-bulusmasi-2024",
    baslik: "Gonullu Bulusmasi 2024",
    tarih: "2024-03-15",
    saat: "14:00",
    yer: "DernekPro Merkez, Istanbul",
    aciklama:
      "Yillik gonullu bulusmasi ile birbirimizi taniyor, deneyimlerimizi paylasiyoruz.",
    kategori: "Bulusma",
    kontenjan: 150,
    kayitli: 87,
  },
  {
    slug: "egitim-semineri-dijital-okuryazarlik",
    baslik: "Dijital Okuryazarlik Semineri",
    tarih: "2024-03-22",
    saat: "10:00",
    yer: "Online (Zoom)",
    aciklama:
      "Gonullu ve uyelerimize yonelik dijital okuryazarlik egitim semineri.",
    kategori: "Seminer",
    kontenjan: 200,
    kayitli: 134,
  },
  {
    slug: "iftar-programi",
    baslik: "Geleneksel Iftar Programi",
    tarih: "2024-03-28",
    saat: "18:30",
    yer: "Buyuk Salon, Ankara",
    aciklama:
      "Her yil geleneksel olarak duzenledigimiz iftar programimiza tum uyelerimiz davetlidir.",
    kategori: "Sosyal",
    kontenjan: 500,
    kayitli: 312,
  },
  {
    slug: "cevre-temizlik-etkinligi",
    baslik: "Bahar Cevre Temizlik Etkinligi",
    tarih: "2024-04-05",
    saat: "09:00",
    yer: "Belgrad Ormani, Istanbul",
    aciklama:
      "Bahar ayi ile birlikte dogayi koruma amacli cevre temizlik etkinligimiz.",
    kategori: "Cevre",
    kontenjan: 100,
    kayitli: 45,
  },
  {
    slug: "fotograf-yarismasi",
    baslik: "Doganin Renkleri Fotograf Yarismasi",
    tarih: "2024-04-20",
    saat: "00:00",
    yer: "Online Basvuru",
    aciklama:
      "Doga temalı fotograf yarismamiz ile yeteneklerinizi sergileyebilirsiniz.",
    kategori: "Kultur",
    kontenjan: 0,
    kayitli: 78,
  },
  {
    slug: "spor-turnuvasi",
    baslik: "Dernekler Arasi Futbol Turnuvasi",
    tarih: "2024-05-10",
    saat: "10:00",
    yer: "Spor Kompleksi, Izmir",
    aciklama:
      "Farkli derneklerin katilimiyla gerceklesecek futbol turnuvasina takiminizla katilin.",
    kategori: "Spor",
    kontenjan: 160,
    kayitli: 96,
  },
];

const aylar = [
  "Ocak",
  "Subat",
  "Mart",
  "Nisan",
  "Mayis",
  "Haziran",
  "Temmuz",
  "Agustos",
  "Eylul",
  "Ekim",
  "Kasim",
  "Aralik",
];

function getKategoriRenk(kategori: string) {
  const renkler: Record<string, string> = {
    Bulusma: "bg-blue-100 text-blue-800",
    Seminer: "bg-purple-100 text-purple-800",
    Sosyal: "bg-pink-100 text-pink-800",
    Cevre: "bg-green-100 text-green-800",
    Kultur: "bg-orange-100 text-orange-800",
    Spor: "bg-red-100 text-red-800",
  };
  return renkler[kategori] || "bg-gray-100 text-gray-800";
}

export default function EtkinliklerPage() {
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
            <span className="text-white">Etkinlikler</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Etkinlikler
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Seminerlerden sosyal bulusmalara, spor turnuvalarindan cevre
            etkinliklerine kadar genis kapsamli etkinlik takvimimizi kesfet.
          </p>
        </div>
      </section>

      {/* Gorunum Secici */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-white">
                Liste Gorunumu
              </button>
              <button className="px-4 py-2 rounded-full text-sm font-semibold bg-background-alt text-muted border border-border hover:text-primary">
                Takvim Gorunumu
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted">Ay:</span>
              <select className="px-3 py-2 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                {aylar.map((ay) => (
                  <option key={ay}>{ay} 2024</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Takvim + Etkinlik Listesi */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Etkinlik Listesi */}
            <div className="lg:col-span-2 space-y-4">
              {etkinlikler.map((etkinlik) => {
                const tarih = new Date(etkinlik.tarih);
                const gun = tarih.getDate();
                const ay = aylar[tarih.getMonth()];
                return (
                  <a
                    key={etkinlik.slug}
                    href={`/etkinlikler/${etkinlik.slug}`}
                    className="card p-5 flex gap-4 md:gap-6 group"
                  >
                    {/* Tarih Kutusu */}
                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-primary text-white rounded-[var(--border-radius)] flex flex-col items-center justify-center">
                      <span className="text-2xl md:text-3xl font-bold leading-none">
                        {gun}
                      </span>
                      <span className="text-xs md:text-sm uppercase tracking-wider">
                        {ay}
                      </span>
                    </div>

                    {/* Icerik */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getKategoriRenk(
                            etkinlik.kategori
                          )}`}
                        >
                          {etkinlik.kategori}
                        </span>
                        {etkinlik.saat !== "00:00" && (
                          <span className="text-xs text-muted">
                            {etkinlik.saat}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold font-heading text-foreground group-hover:text-primary transition-colors truncate">
                        {etkinlik.baslik}
                      </h3>
                      <p className="text-muted text-sm mt-1 line-clamp-1">
                        {etkinlik.aciklama}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {etkinlik.yer}
                        </span>
                        {etkinlik.kontenjan > 0 && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {etkinlik.kayitli}/{etkinlik.kontenjan}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Sidebar - Mini Takvim */}
            <aside className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">
                  Mart 2024
                </h3>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {["Pzt", "Sal", "Car", "Per", "Cum", "Cmt", "Paz"].map(
                    (gun) => (
                      <div key={gun} className="font-semibold text-muted py-1">
                        {gun}
                      </div>
                    )
                  )}
                  {/* Bos gunler (Mart 2024 Cuma gunu basliyor) */}
                  {[null, null, null, null].map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((gun) => {
                    const etkinlikGunleri = [15, 22, 28];
                    const aktif = etkinlikGunleri.includes(gun);
                    return (
                      <div
                        key={gun}
                        className={`py-1.5 rounded ${
                          aktif
                            ? "bg-primary text-white font-bold"
                            : "text-foreground hover:bg-background-alt"
                        }`}
                      >
                        {gun}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">
                  Kategoriler
                </h3>
                <div className="space-y-2">
                  {[
                    { ad: "Bulusma", sayi: 3 },
                    { ad: "Seminer", sayi: 5 },
                    { ad: "Sosyal", sayi: 4 },
                    { ad: "Cevre", sayi: 2 },
                    { ad: "Kultur", sayi: 3 },
                    { ad: "Spor", sayi: 2 },
                  ].map((kat) => (
                    <div
                      key={kat.ad}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span className="text-sm text-foreground">{kat.ad}</span>
                      <span className="text-xs bg-background-alt text-muted px-2 py-0.5 rounded-full">
                        {kat.sayi}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 bg-accent">
                <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                  Etkinlik Onerisi
                </h3>
                <p className="text-muted text-sm mb-4">
                  Bir etkinlik fikriniz mi var? Bize bildirin, birlikte
                  hayata gecirelim.
                </p>
                <a href="/iletisim" className="btn-primary text-sm w-full text-center">
                  Oneri Gonder
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
