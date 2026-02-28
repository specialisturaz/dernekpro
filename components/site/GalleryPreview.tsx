import Link from "next/link";
import Image from "next/image";
import { getGalleryAlbums } from "@/lib/data";

const GRADIENTS = [
  "from-primary/20 to-accent",
  "from-blue-500/20 to-indigo-500/10",
  "from-emerald-500/20 to-teal-500/10",
  "from-orange-500/20 to-red-500/10",
  "from-purple-500/20 to-pink-500/10",
  "from-cyan-500/20 to-blue-500/10",
];

export default async function GalleryPreview() {
  const albums = (await getGalleryAlbums()).slice(0, 6);
  if (albums.length === 0) return null;

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
          {albums.map((album, idx) => (
            <Link
              key={album.id}
              href={`/galeri/${album.slug}`}
              className="aspect-square rounded-xl overflow-hidden group cursor-pointer relative"
            >
              {album.coverImage ? (
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]}`} />
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col items-center justify-center">
                <svg
                  className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                  {album.title}
                </span>
              </div>
              {/* Image count badge */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {album.imageCount}
              </div>
            </Link>
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
