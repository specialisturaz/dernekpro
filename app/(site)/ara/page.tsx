import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arama",
  description: "DernekPro web sitesinde arama yapin. Haber, etkinlik, faaliyet ve daha fazlasini bulun.",
};

const ornekSonuclar = [
  {
    tip: "Haber",
    baslik: "2024 Egitim Bursu Basvurulari Basladi",
    ozet:
      "Yeni donem icin burs basvurulari 1 Subat itibariyle baslamistir. Son basvuru tarihi 28 Subat 2024.",
    url: "/haberler/egitim-bursu-basvurulari-basladi",
    tarih: "2024-01-28",
  },
  {
    tip: "Faaliyet",
    baslik: "Egitim Bursu Programi",
    ozet:
      "Ihtiyac sahibi ogrencilere yonelik kapsamli burs programimiz ile egitimde firsat esitligi sagliyoruz.",
    url: "/faaliyetler/egitim-bursu-programi",
    tarih: "2024-01-15",
  },
  {
    tip: "Etkinlik",
    baslik: "Dijital Okuryazarlik Semineri",
    ozet:
      "Gonullu ve uyelerimize yonelik dijital okuryazarlik egitim semineri.",
    url: "/etkinlikler/egitim-semineri-dijital-okuryazarlik",
    tarih: "2024-03-22",
  },
  {
    tip: "Duyuru",
    baslik: "Gonullu Basvurulari Acildi",
    ozet:
      "2024 yili projelerimiz icin gonullu basvurulari baslamistir.",
    url: "/duyurular/gonullu-cagri",
    tarih: "2024-01-12",
  },
];

function getTipRenk(tip: string) {
  const renkler: Record<string, string> = {
    Haber: "bg-blue-100 text-blue-800",
    Faaliyet: "bg-green-100 text-green-800",
    Etkinlik: "bg-purple-100 text-purple-800",
    Duyuru: "bg-orange-100 text-orange-800",
  };
  return renkler[tip] || "bg-gray-100 text-gray-800";
}

export default function AramaPage() {
  return (
    <main>
      {/* Arama Hero */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              Arama
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Haberler, etkinlikler, faaliyetler ve daha fazlasini arayin.
            </p>
            <div className="relative">
              <input
                type="search"
                placeholder="Ne aramak istiyorsunuz?"
                className="w-full px-6 py-4 pl-14 rounded-[var(--border-radius)] bg-white text-foreground text-lg placeholder:text-muted focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
              />
              <svg
                className="w-6 h-6 text-muted absolute left-5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Filtre & Sonuclar */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Filtreler */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 overflow-x-auto">
                {["Tumu", "Haberler", "Faaliyetler", "Etkinlikler", "Duyurular"].map(
                  (filtre) => (
                    <button
                      key={filtre}
                      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                        filtre === "Tumu"
                          ? "bg-primary text-white"
                          : "bg-background-alt text-muted border border-border hover:text-primary hover:border-primary"
                      }`}
                    >
                      {filtre}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Sonuc Bilgisi */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <p className="text-muted text-sm">
                <span className="text-foreground font-semibold">&ldquo;egitim&rdquo;</span> icin{" "}
                <span className="text-foreground font-semibold">4 sonuc</span> bulundu
              </p>
              <select className="text-sm border border-border rounded-[var(--border-radius)] px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>En Yeni</option>
                <option>En Eski</option>
                <option>En Alakali</option>
              </select>
            </div>

            {/* Sonuc Listesi */}
            <div className="space-y-6">
              {ornekSonuclar.map((sonuc) => (
                <a
                  key={sonuc.url}
                  href={sonuc.url}
                  className="block p-5 rounded-[var(--border-radius)] border border-border hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getTipRenk(
                        sonuc.tip
                      )}`}
                    >
                      {sonuc.tip}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(sonuc.tarih).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-heading text-foreground group-hover:text-primary transition-colors mb-1">
                    {sonuc.baslik}
                  </h3>
                  <p className="text-muted text-sm line-clamp-2">{sonuc.ozet}</p>
                </a>
              ))}
            </div>

            {/* Bos Durum - Sonuc bulunamazsa gosterilecek */}
            <div className="hidden text-center py-16">
              <svg
                className="w-16 h-16 text-muted/30 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                Sonuc Bulunamadi
              </h3>
              <p className="text-muted">
                Aramanizla eslesen bir sonuc bulunamadi. Farkli kelimeler
                deneyebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
