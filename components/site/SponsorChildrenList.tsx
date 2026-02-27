"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SponsorChild {
  id: string;
  name: string;
  age: number;
  gender: string;
  country: string;
  city: string | null;
  story: string;
  photoUrl: string;
  goalAmount: number;
  collected: number;
  category: string;
  isFeatured: boolean;
}

interface SponsorChildrenListProps {
  items: SponsorChild[];
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string; progressColor: string }
> = {
  giydirme: {
    label: "Giydirme Programi",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    progressColor: "from-rose-400 to-rose-600",
  },
  egitim: {
    label: "Egitim Destegi",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    progressColor: "from-blue-400 to-blue-600",
  },
  saglik: {
    label: "Saglik Destegi",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    progressColor: "from-emerald-400 to-emerald-600",
  },
  genel: {
    label: "Genel Destek",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    progressColor: "from-amber-400 to-amber-600",
  },
};

function getCategoryConfig(category: string) {
  return (
    CATEGORY_CONFIG[category] || {
      label: category,
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      progressColor: "from-primary to-primary-light",
    }
  );
}

function formatTL(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const ALL_FILTER = "tumu";

export default function SponsorChildrenList({ items }: SponsorChildrenListProps) {
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);

  // Derive unique categories from data
  const categories = Array.from(new Set(items.map((c) => c.category)));

  const filteredChildren =
    activeFilter === ALL_FILTER
      ? items
      : items.filter((c) => c.category === activeFilter);

  return (
    <>
      {/* ── Category Filter Bar ── */}
      {categories.length > 1 && (
        <section className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-4 overflow-x-auto hero-scrollbar-hide">
              <button
                onClick={() => setActiveFilter(ALL_FILTER)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === ALL_FILTER
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-background-alt text-muted border border-border hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  {/* Grid icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  Tumu ({items.length})
                </span>
              </button>

              {categories.map((cat) => {
                const config = getCategoryConfig(cat);
                const count = items.filter((c) => c.category === cat).length;
                const isActive = activeFilter === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? `${config.bgColor} ${config.color} shadow-md border ${config.borderColor}`
                        : "bg-background-alt text-muted border border-border hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {config.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Children Grid ── */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          {filteredChildren.length === 0 ? (
            /* ── Empty State ── */
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-primary/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-heading text-foreground mb-3">
                Su anda bu kategoride cocuk bulunmuyor
              </h3>
              <p className="text-muted max-w-md mx-auto mb-6">
                Farkli bir kategori secebilir veya tum cocuklari goruntuleyebilirsiniz.
              </p>
              {activeFilter !== ALL_FILTER && (
                <button
                  onClick={() => setActiveFilter(ALL_FILTER)}
                  className="btn-outline"
                >
                  Tum Cocuklari Goster
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredChildren.map((child) => {
                const config = getCategoryConfig(child.category);
                const percentage =
                  child.goalAmount > 0
                    ? Math.min(100, Math.round((child.collected / child.goalAmount) * 100))
                    : 0;
                const remaining = Math.max(0, child.goalAmount - child.collected);

                return (
                  <div
                    key={child.id}
                    className="group bg-background rounded-2xl shadow-sm hover:shadow-xl border border-border/60 overflow-hidden transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* ── Photo Section ── */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={child.photoUrl}
                        alt={child.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />

                      {/* Gradient overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* Featured badge */}
                      {child.isFeatured && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1.5 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            One Cikan
                          </span>
                        </div>
                      )}

                      {/* Category badge on photo */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${config.bgColor} ${config.color} border ${config.borderColor}`}
                        >
                          {config.label}
                        </span>
                      </div>

                      {/* Name overlay on photo bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-white text-lg font-bold font-heading leading-tight drop-shadow-md">
                          Merhaba, ben {child.name}!
                        </h3>
                        <p className="text-white/80 text-sm mt-1 font-medium">
                          {child.age} yasindayim
                        </p>
                      </div>
                    </div>

                    {/* ── Content Section ── */}
                    <div className="p-5">
                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-muted text-sm mb-3">
                        <svg
                          className="w-4 h-4 text-primary/60 flex-shrink-0"
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
                        <span>
                          {child.city ? `${child.city}, ` : ""}
                          {child.country}
                        </span>
                      </div>

                      {/* Story excerpt */}
                      <p className="text-muted text-sm leading-relaxed line-clamp-3 mb-4 min-h-[3.75rem]">
                        {child.story}
                      </p>

                      {/* Progress section */}
                      <div className="mb-4">
                        <div className="flex justify-between items-baseline text-sm mb-2">
                          <span className="font-bold text-foreground">
                            {formatTL(child.collected)}
                          </span>
                          <span className="text-muted text-xs">
                            / {formatTL(child.goalAmount)}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-2.5 bg-background-alt rounded-full overflow-hidden border border-border/50">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${config.progressColor} transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-semibold text-primary">
                            %{percentage} tamamlandi
                          </span>
                          <span className="text-xs text-muted">
                            Kalan: {formatTL(remaining)}
                          </span>
                        </div>
                      </div>

                      {/* Sponsor button */}
                      <Link
                        href={`/cocuk-sponsorluk/${child.id}`}
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20 group/btn"
                      >
                        {/* Heart icon */}
                        <svg
                          className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        Sponsor Ol
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
