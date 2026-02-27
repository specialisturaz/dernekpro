"use client";

import Image from "next/image";
import { useState, useCallback } from "react";

interface Album {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
  imageCount: number;
  coverImage: string | null;
  category: string;
}

const categories = [
  { label: "Tümü", value: "all" },
  { label: "Etkinlik", value: "etkinlik" },
  { label: "Proje", value: "proje" },
  { label: "Gezi", value: "gezi" },
  { label: "Toplantı", value: "toplanti" },
  { label: "Genel", value: "genel" },
];

const fallbackAlbumler: Album[] = [
  {
    id: "1",
    slug: "gonullu-bulusmasi-2024",
    title: "Gonullu Bulusmasi 2024",
    createdAt: "2024-03-15",
    imageCount: 48,
    coverImage: "https://picsum.photos/seed/gallery-gonullu/600/450",
    category: "etkinlik",
  },
  {
    id: "2",
    slug: "agac-dikme-festivali",
    title: "Agac Dikme Festivali",
    createdAt: "2024-03-21",
    imageCount: 35,
    coverImage: "https://picsum.photos/seed/gallery-agac/600/450",
    category: "etkinlik",
  },
  {
    id: "3",
    slug: "iftar-programi-2024",
    title: "Iftar Programi 2024",
    createdAt: "2024-03-28",
    imageCount: 62,
    coverImage: "https://picsum.photos/seed/gallery-iftar/600/450",
    category: "etkinlik",
  },
  {
    id: "4",
    slug: "egitim-semineri",
    title: "Dijital Okuryazarlik Semineri",
    createdAt: "2024-02-10",
    imageCount: 24,
    coverImage: "https://picsum.photos/seed/gallery-seminer/600/450",
    category: "proje",
  },
  {
    id: "5",
    slug: "genel-kurul-2023",
    title: "Genel Kurul Toplantisi 2023",
    createdAt: "2023-12-15",
    imageCount: 30,
    coverImage: "https://picsum.photos/seed/gallery-kurul/600/450",
    category: "toplanti",
  },
  {
    id: "6",
    slug: "yardim-dagitimi",
    title: "Ramazan Yardim Dagitimi",
    createdAt: "2023-11-20",
    imageCount: 41,
    coverImage: "https://picsum.photos/seed/gallery-yardim/600/450",
    category: "proje",
  },
  {
    id: "7",
    slug: "spor-turnuvasi-2023",
    title: "Dernekler Arasi Spor Turnuvasi",
    createdAt: "2023-10-05",
    imageCount: 55,
    coverImage: "https://picsum.photos/seed/gallery-spor/600/450",
    category: "genel",
  },
  {
    id: "8",
    slug: "kultur-gezisi-edirne",
    title: "Edirne Kultur Gezisi",
    createdAt: "2023-09-18",
    imageCount: 38,
    coverImage: "https://picsum.photos/seed/gallery-edirne/600/450",
    category: "gezi",
  },
];

interface GalleryClientProps {
  initialAlbums: Album[];
}

export default function GalleryClient({ initialAlbums }: GalleryClientProps) {
  const [albums, setAlbums] = useState<Album[]>(
    initialAlbums.length > 0 ? initialAlbums : fallbackAlbumler
  );
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = useCallback(async (categoryValue: string) => {
    setActiveCategory(categoryValue);
    setLoading(true);

    try {
      const url =
        categoryValue === "all"
          ? "/api/gallery"
          : `/api/gallery?category=${categoryValue}`;

      const res = await fetch(url);

      if (!res.ok) throw new Error("API error");

      const json = await res.json();

      if (json.success && json.data && json.data.length > 0) {
        setAlbums(json.data);
      } else {
        // Fallback: filter hardcoded data client-side
        if (categoryValue === "all") {
          setAlbums(fallbackAlbumler);
        } else {
          setAlbums(
            fallbackAlbumler.filter((a) => a.category === categoryValue)
          );
        }
      }
    } catch {
      // On error, filter fallback data client-side
      if (categoryValue === "all") {
        setAlbums(fallbackAlbumler);
      } else {
        setAlbums(
          fallbackAlbumler.filter((a) => a.category === categoryValue)
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {/* Filtre */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto">
              {categories.map((kat) => (
                <button
                  key={kat.value}
                  onClick={() => handleCategoryChange(kat.value)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === kat.value
                      ? "bg-primary text-white"
                      : "bg-background-alt text-muted hover:bg-primary/10 hover:text-primary border border-border"
                  }`}
                >
                  {kat.label}
                </button>
              ))}
            </div>
            <span className="hidden md:block text-sm text-muted">
              {albums.length} alb&uuml;m
            </span>
          </div>
        </div>
      </section>

      {/* Album Grid */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted">
                  Albumler yukleniyor...
                </p>
              </div>
            </div>
          ) : albums.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg
                className="w-20 h-20 text-primary/20 mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                Bu kategoride album bulunamadi
              </h3>
              <p className="text-sm text-muted max-w-md">
                Sectiginiz kategoride henuz album bulunmamaktadir. Diger
                kategorileri inceleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {albums.map((album) => (
                <a
                  key={album.slug}
                  href={`/galeri/${album.slug}`}
                  className="card group"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-primary/5">
                    {album.coverImage ? (
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <svg
                          className="w-16 h-16 text-primary/20 group-hover:scale-110 transition-transform duration-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                    )}
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
                      {album.imageCount}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold font-heading text-foreground group-hover:text-primary transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      {new Date(album.createdAt).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
