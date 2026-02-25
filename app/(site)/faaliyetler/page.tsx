import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faaliyetler",
  description:
    "Dernegimizin gerceklestirdigi projeler, kampanyalar ve toplumsal faaliyetleri kesfet.",
};

const kategoriler = [
  "Tumu",
  "Egitim",
  "Saglik",
  "Cevre",
  "Sosyal Yardim",
  "Kultur",
  "Spor",
];

const faaliyetler = [
  {
    slug: "egitim-bursu-programi",
    baslik: "Egitim Bursu Programi",
    kategori: "Egitim",
    ozet:
      "Ihtiyac sahibi ogrencilere yonelik kapsamli burs programimiz ile egitimde firsat esitligi sagliyoruz.",
    tarih: "2024-01-15",
    gorsel: "/images/placeholder-activity.jpg",
    durum: "Devam Ediyor",
  },
  {
    slug: "saglik-taramasi-kampanyasi",
    baslik: "Ucretsiz Saglik Taramasi",
    kategori: "Saglik",
    ozet:
      "Kirsal bolgelerde ucretsiz saglik taramasi yaparak vatandaslarimizin sagligina kavusmasina destek oluyoruz.",
    tarih: "2024-02-20",
    gorsel: "/images/placeholder-activity.jpg",
    durum: "Tamamlandi",
  },
  {
    slug: "agac-dikme-festivali",
    baslik: "10.000 Agac Dikme Festivali",
    kategori: "Cevre",
    ozet:
      "Sehirlerimizi yesillendirmek icin duzenledigimiz agac dikme kampanyamiza siz de katilin.",
    tarih: "2024-03-21",
    gorsel: "/images/placeholder-activity.jpg",
    durum: "Devam Ediyor",
  },
  {
    slug: "ramazan-yardimlari",
    baslik: "Ramazan Yardim Paketi Dagitimi",
    kategori: "Sosyal Yardim",
    ozet:
      "Ramazan ayinda ihtiyac sahibi ailelere gida paketi ve iftar yemegi dagitimi gerceklestiriyoruz.",
    tarih: "2024-03-10",
    gorsel: "/images/placeholder-activity.jpg",
    durum: "Tamamlandi",
  },
  {
    slug: "kultur-gezisi-programi",
    baslik: "Tarihi ve Kulturel Gezi Programi",
    kategori: "Kultur",
    ozet:
      "Genclerimize yonelik tarihi mekan ziyaretleri ve kulturel gezi programlari duzenliyoruz.",
    tarih: "2024-04-05",
    gorsel: "/images/placeholder-activity.jpg",
    durum: "Planlanıyor",
  },
  {
    slug: "genclik-spor-turnuvasi",
    baslik: "Genclik Spor Turnuvasi",
    kategori: "Spor",
    ozet:
      "Gencler arasi futbol, basketbol ve voleybol turnuvalari duzenleyerek spor bilincini yayginlastiriyoruz.",
    tarih: "2024-05-15",
    gorsel: "/images/placeholder-activity.jpg",
    durum: "Planlanıyor",
  },
];

function getDurumRenk(durum: string) {
  switch (durum) {
    case "Devam Ediyor":
      return "bg-green-100 text-green-800";
    case "Tamamlandi":
      return "bg-blue-100 text-blue-800";
    case "Planlanıyor":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function FaaliyetlerPage() {
  return (
    <main>
      {/* Hero / Breadcrumb */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/70 mb-4">
            <a href="/" className="hover:text-white">
              Ana Sayfa
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">Faaliyetler</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Faaliyetlerimiz
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Egitimden sagliga, cevreden sosyal yardima kadar genis bir yelpazede
            topluma deger katan projelerimizi inceleyin.
          </p>
        </div>
      </section>

      {/* Filtre */}
      <section className="bg-background border-b border-border sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {kategoriler.map((kat) => (
              <button
                key={kat}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  kat === "Tumu"
                    ? "bg-primary text-white"
                    : "bg-background-alt text-muted hover:bg-primary/10 hover:text-primary border border-border"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Faaliyet Grid */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faaliyetler.map((faaliyet) => (
              <a
                key={faaliyet.slug}
                href={`/faaliyetler/${faaliyet.slug}`}
                className="card group"
              >
                {/* Gorsel Placeholder */}
                <div className="aspect-video bg-primary/10 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-primary/20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getDurumRenk(
                        faaliyet.durum
                      )}`}
                    >
                      {faaliyet.durum}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {faaliyet.kategori}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(faaliyet.tarih).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors">
                    {faaliyet.baslik}
                  </h3>
                  <p className="text-muted text-sm line-clamp-3">
                    {faaliyet.ozet}
                  </p>
                </div>
              </a>
            ))}
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
              3
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
