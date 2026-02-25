import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Album Detay",
  description: "Fotograf albumu detay sayfasi.",
};

const fotograflar = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  alt: `Fotograf ${i + 1}`,
}));

export default function AlbumDetayPage({
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
            <a href="/galeri" className="hover:text-white">
              Galeri
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">{params.slug}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            Gonullu Bulusmasi 2024
          </h1>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span>15 Mart 2024</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span>48 Fotograf</span>
          </div>
        </div>
      </section>

      {/* Aciklama */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <p className="text-muted max-w-3xl">
            2024 yili Gonullu Bulusmamizdan kareler. 150&apos;yi askin gonullumuz
            ile gerceklestirdigimiz etkinlikten en guzel anlar.
          </p>
        </div>
      </section>

      {/* Fotograf Grid */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          {/* Masonry-benzeri grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {fotograflar.map((foto, index) => {
              // Farkli boyutlarda placeholder'lar
              const boyutlar = [
                "aspect-square",
                "aspect-[3/4]",
                "aspect-square",
                "aspect-[4/3]",
                "aspect-square",
                "aspect-[3/4]",
              ];
              const boyut = boyutlar[index % boyutlar.length];

              return (
                <button
                  key={foto.id}
                  className={`${boyut} bg-primary/5 rounded-[var(--border-radius)] border border-border overflow-hidden relative group cursor-pointer`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-primary/20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Daha Fazla */}
          <div className="text-center mt-10">
            <button className="btn-outline">
              Daha Fazla Fotograf Yukle (36 kaldi)
            </button>
          </div>

          {/* Geri Don */}
          <div className="text-center mt-6">
            <a
              href="/galeri"
              className="text-primary font-semibold text-sm inline-flex items-center gap-1.5 hover:underline"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Tum Albumlere Don
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
