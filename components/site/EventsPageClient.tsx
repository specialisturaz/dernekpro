"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  startAt: string;
  endAt: string;
  location: string | null;
  eventType: string;
  capacity: number | null;
  isFree: boolean;
  status: string;
}

const aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

const STATUS_FILTERS = [
  { value: "ALL", label: "Tümü" },
  { value: "UPCOMING", label: "Yaklaşan" },
  { value: "ONGOING", label: "Devam Eden" },
  { value: "COMPLETED", label: "Tamamlandı" },
];

const TYPE_FILTERS = [
  { value: "ALL", label: "Tümü" },
  { value: "IN_PERSON", label: "Yüz Yüze" },
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hibrit" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "UPCOMING": return { text: "Yaklaşan", cls: "bg-blue-100 text-blue-700 border-blue-200" };
    case "ONGOING": return { text: "Devam Ediyor", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" };
    case "COMPLETED": return { text: "Tamamlandı", cls: "bg-gray-100 text-gray-600 border-gray-200" };
    default: return { text: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case "ONLINE": return { text: "Online", cls: "bg-violet-100 text-violet-700" };
    case "IN_PERSON": return { text: "Yüz Yüze", cls: "bg-amber-100 text-amber-700" };
    case "HYBRID": return { text: "Hibrit", cls: "bg-cyan-100 text-cyan-700" };
    default: return { text: type, cls: "bg-gray-100 text-gray-600" };
  }
}

// Gradient placeholders for events without cover images
const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-purple-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-red-600",
];

export default function EventsPageClient({ events }: { events: Event[] }) {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filtered = events.filter((e) => {
    if (statusFilter !== "ALL" && e.status !== statusFilter) return false;
    if (typeFilter !== "ALL" && e.eventType !== typeFilter) return false;
    return true;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted">Durum:</span>
          <div className="flex gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === f.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-background-alt text-muted hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="w-px h-6 bg-border hidden sm:block" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted">Tür:</span>
          <div className="flex gap-1">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === f.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-background-alt text-muted hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted mb-6">{filtered.length} etkinlik bulundu</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-bold text-foreground mb-2">Etkinlik bulunamadı</h2>
          <p className="text-muted">Filtreleri değiştirmeyi deneyin.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((etkinlik, idx) => {
            const tarih = new Date(etkinlik.startAt);
            const gun = tarih.getDate();
            const ay = aylar[tarih.getMonth()];
            const yil = tarih.getFullYear();
            const saat = tarih.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
            const badge = getStatusBadge(etkinlik.status);
            const typeBadge = getTypeBadge(etkinlik.eventType);
            const gradient = GRADIENTS[idx % GRADIENTS.length];

            return (
              <Link
                key={etkinlik.id}
                href={`/etkinlikler/${etkinlik.slug}`}
                className="group relative bg-background/80 backdrop-blur-sm rounded-2xl border border-border/60 overflow-hidden hover:shadow-xl hover:shadow-primary/[0.06] hover:-translate-y-1 transition-all duration-500"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  {etkinlik.coverImage ? (
                    <Image
                      src={etkinlik.coverImage}
                      alt={etkinlik.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                      <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Date badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-lg">
                    <span className="block text-2xl font-bold text-primary leading-none">{gun}</span>
                    <span className="block text-xs font-semibold text-muted uppercase">{ay}</span>
                    <span className="block text-[10px] text-muted">{yil}</span>
                  </div>

                  {/* Status badge */}
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.cls}`}>
                    {badge.text}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Type + Time */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge.cls}`}>
                      {typeBadge.text}
                    </span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {saat}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {etkinlik.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted line-clamp-2 mb-4">{etkinlik.description}</p>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-muted pt-3 border-t border-border/40">
                    {etkinlik.location && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate max-w-[120px]">{etkinlik.location}</span>
                      </span>
                    )}
                    {etkinlik.capacity && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {etkinlik.capacity} kişi
                      </span>
                    )}
                    {!etkinlik.isFree && (
                      <span className="text-secondary font-semibold">Ücretli</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
