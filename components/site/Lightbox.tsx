"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

interface LightboxImage {
  url: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const current = images[currentIndex];

  // ESC tusu ile kapatma
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Scroll'u kilitle
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Arka plan tiklaninca kapat */}
      <button
        className="absolute inset-0 w-full h-full cursor-default"
        onClick={onClose}
        aria-label="Lightbox kapat"
      />

      {/* Kapat butonu */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        aria-label="Kapat"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Sayac */}
      <div className="absolute top-4 left-4 z-10 text-white/80 text-sm font-medium bg-black/40 px-3 py-1.5 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Sol ok */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-2 sm:left-4 z-10 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        aria-label="Onceki fotograf"
      >
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10"
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
      </button>

      {/* Gorsel */}
      <div className="relative z-[1] w-full h-full max-w-5xl max-h-[85vh] mx-4 sm:mx-8 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full transition-opacity duration-300">
          <Image
            src={current.url}
            alt={current.alt || `Fotograf ${currentIndex + 1}`}
            fill
            className="object-contain pointer-events-auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
            priority
          />
        </div>
      </div>

      {/* Sag ok */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-2 sm:right-4 z-10 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        aria-label="Sonraki fotograf"
      >
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Alt bilgi */}
      {current.alt && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/80 text-sm bg-black/40 px-4 py-2 rounded-full max-w-md text-center truncate">
          {current.alt}
        </div>
      )}
    </div>
  );
}
