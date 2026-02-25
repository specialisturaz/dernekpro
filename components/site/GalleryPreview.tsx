import Link from "next/link";

const demoImages = [
  { id: 1, alt: "Eğitim faaliyeti" },
  { id: 2, alt: "Su kuyusu açılışı" },
  { id: 3, alt: "Gıda dağıtımı" },
  { id: 4, alt: "Sağlık taraması" },
  { id: 5, alt: "Kurban kesimi" },
  { id: 6, alt: "İftar programı" },
];

export default function GalleryPreview() {
  return (
    <section className="section-padding bg-background-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Galeri
          </span>
          <h2 className="mt-3">
            Faaliyetlerimizden <span className="text-primary">Kareler</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {demoImages.map((img) => (
            <div
              key={img.id}
              className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-accent overflow-hidden group cursor-pointer relative"
            >
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
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
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/galeri" className="btn-outline">
            Galeriyi Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
