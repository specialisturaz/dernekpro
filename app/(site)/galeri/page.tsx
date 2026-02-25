import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Dernegimizin etkinlik, proje ve faaliyet fotograflari, video arsivi ve album koleksiyonu.",
};

const albumler = [
  {
    slug: "gonullu-bulusmasi-2024",
    baslik: "Gonullu Bulusmasi 2024",
    tarih: "2024-03-15",
    fotografSayisi: 48,
    kapak: "/images/placeholder-gallery.jpg",
  },
  {
    slug: "agac-dikme-festivali",
    baslik: "Agac Dikme Festivali",
    tarih: "2024-03-21",
    fotografSayisi: 35,
    kapak: "/images/placeholder-gallery.jpg",
  },
  {
    slug: "iftar-programi-2024",
    baslik: "Iftar Programi 2024",
    tarih: "2024-03-28",
    fotografSayisi: 62,
    kapak: "/images/placeholder-gallery.jpg",
  },
  {
    slug: "egitim-semineri",
    baslik: "Dijital Okuryazarlik Semineri",
    tarih: "2024-02-10",
    fotografSayisi: 24,
    kapak: "/images/placeholder-gallery.jpg",
  },
  {
    slug: "genel-kurul-2023",
    baslik: "Genel Kurul Toplantisi 2023",
    tarih: "2023-12-15",
    fotografSayisi: 30,
    kapak: "/images/placeholder-gallery.jpg",
  },
  {
    slug: "yardim-dagitimi",
    baslik: "Ramazan Yardim Dagitimi",
    tarih: "2023-11-20",
    fotografSayisi: 41,
    kapak: "/images/placeholder-gallery.jpg",
  },
  {
    slug: "spor-turnuvasi-2023",
    baslik: "Dernekler Arasi Spor Turnuvasi",
    tarih: "2023-10-05",
    fotografSayisi: 55,
    kapak: "/images/placeholder-gallery.jpg",
  },
  {
    slug: "kultur-gezisi-edirne",
    baslik: "Edirne Kultur Gezisi",
    tarih: "2023-09-18",
    fotografSayisi: 38,
    kapak: "/images/placeholder-gallery.jpg",
  },
];

export default function GaleriPage() {
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
            <span className="text-white">Galeri</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Foto Galeri
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Faaliyetlerimiz, etkinliklerimiz ve projelerimize ait fotograf ve
            video arsivimizi inceleyin.
          </p>
        </div>
      </section>

      {/* Filtre */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto">
              {["Tumu", "Etkinlik", "Proje", "Gezi", "Toplanti"].map((kat) => (
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
            <span className="hidden md:block text-sm text-muted">
              {albumler.length} album
            </span>
          </div>
        </div>
      </section>

      {/* Album Grid */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albumler.map((album) => (
              <a
                key={album.slug}
                href={`/galeri/${album.slug}`}
                className="card group"
              >
                <div className="aspect-[4/3] bg-primary/5 relative overflow-hidden">
                  {/* Placeholder gorsel */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <svg
                      className="w-16 h-16 text-primary/20 group-hover:scale-110 transition-transform duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  {/* Fotograf sayisi */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                    {album.fotografSayisi}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold font-heading text-foreground group-hover:text-primary transition-colors">
                    {album.baslik}
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    {new Date(album.tarih).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Daha Fazla */}
          <div className="text-center mt-12">
            <button className="btn-outline">Daha Fazla Album Yukle</button>
          </div>
        </div>
      </section>
    </main>
  );
}
