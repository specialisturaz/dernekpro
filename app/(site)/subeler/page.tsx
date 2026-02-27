"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/site/LeafletMap"), { ssr: false });

const TYPE_LABELS: Record<string, string> = {
  MERKEZ: "Merkez",
  SUBE: "Şube",
  TEMSILCILIK: "Temsilcilik",
  IRTIBAT_BUROSU: "İrtibat Bürosu",
};

interface BranchPublic {
  id: string;
  name: string;
  slug: string;
  code?: string;
  type: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  presidentName?: string;
}

type ViewMode = "kart" | "liste" | "harita";

export default function SubelerPublicPage() {
  const [branches, setBranches] = useState<BranchPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("kart");
  const [filterCity, setFilterCity] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/branches");
        const json = await res.json();
        if (json.success) setBranches(json.data);
      } catch {
        // Hata
      }
      setLoading(false);
    };
    load();
  }, []);

  // Sehir listesi
  const cities = Array.from(new Set(branches.map((b) => b.city).filter(Boolean))) as string[];

  const filtered = branches.filter((b) => {
    if (filterCity && b.city !== filterCity) return false;
    if (filterType && b.type !== filterType) return false;
    return true;
  });

  const markers = filtered
    .filter((b) => b.latitude && b.longitude)
    .map((b) => ({
      position: [b.latitude!, b.longitude!] as [number, number],
      title: b.name,
      description: `${TYPE_LABELS[b.type] || b.type}${b.city ? ` • ${b.city}` : ""}`,
      href: `/subeler/${b.slug}`,
    }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold font-heading mb-3">Şubelerimiz</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Türkiye genelindeki şube, temsilcilik ve irtibat bürolarımız
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6">
          {/* Filtreler + Gorunum Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex gap-3">
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              >
                <option value="">Tüm Şehirler</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              >
                <option value="">Tüm Türler</option>
                <option value="MERKEZ">Merkez</option>
                <option value="SUBE">Şube</option>
                <option value="TEMSILCILIK">Temsilcilik</option>
                <option value="IRTIBAT_BUROSU">İrtibat Bürosu</option>
              </select>
            </div>
            <div className="flex border border-border rounded-lg overflow-hidden">
              {(["kart", "liste", "harita"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    view === v ? "bg-primary text-white" : "bg-background text-muted hover:bg-background-alt"
                  }`}
                >
                  {v === "kart" ? "Kart" : v === "liste" ? "Liste" : "Harita"}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 h-48 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted text-lg">Şube bulunamadı</p>
            </div>
          ) : view === "harita" ? (
            <LeafletMap center={[39.0, 35.0]} zoom={6} markers={markers} className="h-[600px] w-full rounded-xl" />
          ) : view === "liste" ? (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-background-alt border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Şube</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Tür</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Şehir</th>
                    <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Telefon</th>
                    <th className="text-right px-4 py-3 font-semibold">Detay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-background-alt/50">
                      <td className="px-4 py-3 font-medium">{b.name}</td>
                      <td className="px-4 py-3 text-muted hidden md:table-cell">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {TYPE_LABELS[b.type]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted hidden md:table-cell">{b.city || "—"}</td>
                      <td className="px-4 py-3 text-muted hidden lg:table-cell">{b.phone || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/subeler/${b.slug}`} className="text-primary text-sm font-medium hover:underline">
                          Detay
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((b) => (
                <Link key={b.id} href={`/subeler/${b.slug}`} className="card p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{b.name}</h3>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {TYPE_LABELS[b.type]}
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="space-y-1.5 text-sm text-muted">
                    {b.city && (
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {b.district ? `${b.district}, ${b.city}` : b.city}
                      </p>
                    )}
                    {b.phone && (
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {b.phone}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
