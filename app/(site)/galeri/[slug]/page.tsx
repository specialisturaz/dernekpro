"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Lightbox from "@/components/site/Lightbox";

// Fallback verisi (DB'den veri gelmezse)
const fallbackFotograflar = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  url: "/images/placeholder-gallery.jpg",
  alt: `Fotograf ${i + 1}`,
  order: i,
}));

interface AlbumImage {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
  alt: string;
  order: number;
}

interface AlbumData {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  createdAt: string;
  images: AlbumImage[];
}

export default function AlbumDetayPage({
  params,
}: {
  params: { slug: string };
}) {
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [images, setImages] = useState<AlbumImage[]>(fallbackFotograflar);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const res = await fetch(`/api/gallery/${params.slug}`);
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        if (json.success && json.data) {
          setAlbum(json.data);
          if (json.data.images && json.data.images.length > 0) {
            setImages(json.data.images);
          }
        }
      } catch {
        // Fallback verisi zaten set edildi
      } finally {
        setLoading(false);
      }
    }
    fetchAlbum();
  }, [params.slug]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const albumTitle = album?.title || params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const albumDate = album?.createdAt
    ? new Date(album.createdAt).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Lightbox icin gorsel listesi
  const lightboxImages = images.map((img) => ({
    url: img.url,
    alt: img.alt,
  }));

  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-primary text-white pt-28 pb-8 md:pt-32 md:pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <a href="/" className="hover:text-white">
              Ana Sayfa
            </a>
            <span className="mx-2">/</span>
            <a href="/galeri" className="hover:text-white">
              Galeri
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">{albumTitle}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            {loading ? (
              <span className="inline-block w-64 h-10 bg-white/20 rounded animate-pulse" />
            ) : (
              albumTitle
            )}
          </h1>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            {albumDate && <span>{albumDate}</span>}
            {albumDate && images.length > 0 && (
              <span className="w-1 h-1 bg-white/40 rounded-full" />
            )}
            <span>{images.length} Fotograf</span>
          </div>
        </div>
      </section>

      {/* Fotograf Grid */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          {loading ? (
            // Skeleton loader
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-primary/5 rounded-[var(--border-radius)] border border-border animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((foto, index) => (
                <button
                  key={foto.id}
                  onClick={() => openLightbox(index)}
                  className="aspect-square bg-primary/5 rounded-[var(--border-radius)] border border-border overflow-hidden relative group cursor-pointer"
                >
                  {foto.url && foto.url !== "/images/placeholder-gallery.jpg" ? (
                    <Image
                      src={foto.thumbnailUrl || foto.url}
                      alt={foto.alt || `Fotograf ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-primary/20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                    </div>
                  )}
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
              ))}
            </div>
          )}

          {/* Geri Don */}
          <div className="text-center mt-8">
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

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </main>
  );
}
