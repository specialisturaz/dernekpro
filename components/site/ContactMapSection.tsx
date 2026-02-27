"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/site/LeafletMap"), { ssr: false });

interface BranchPublic {
  id: string;
  name: string;
  slug: string;
  type: string;
  phone?: string;
  email?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

const TYPE_LABELS: Record<string, string> = {
  MERKEZ: "Merkez",
  SUBE: "Şube",
  TEMSILCILIK: "Temsilcilik",
  IRTIBAT_BUROSU: "İrtibat Bürosu",
};

export default function ContactMapSection() {
  const [branches, setBranches] = useState<BranchPublic[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/branches");
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setBranches(json.data);
        }
      } catch {
        // Sessiz hata
      }
    };
    load();
  }, []);

  const markers = branches
    .filter((b) => b.latitude && b.longitude)
    .map((b) => ({
      position: [b.latitude!, b.longitude!] as [number, number],
      title: b.name,
      description: `${TYPE_LABELS[b.type] || b.type}${b.city ? ` • ${b.city}` : ""}`,
      href: `/subeler/${b.slug}`,
    }));

  if (branches.length === 0) {
    // Harita placeholder (fallback)
    return (
      <div className="aspect-square lg:aspect-auto lg:h-[500px] bg-background-alt rounded-[var(--border-radius)] border border-border flex items-center justify-center">
        <div className="text-center p-8">
          <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-foreground font-semibold text-sm">
            Besiktas Mah., Dernek Sok. No:42/A<br />34353 Besiktas / Istanbul
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Harita */}
      <LeafletMap
        center={[39.0, 35.0]}
        zoom={6}
        markers={markers}
        className="h-[400px] w-full rounded-[var(--border-radius)]"
      />

      {/* Sube Kartlari */}
      <div>
        <h3 className="font-bold font-heading text-foreground mb-3">Şubelerimiz</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {branches.slice(0, 6).map((b) => (
            <Link
              key={b.id}
              href={`/subeler/${b.slug}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{b.name}</p>
                <p className="text-xs text-muted">{b.city || TYPE_LABELS[b.type]}</p>
              </div>
            </Link>
          ))}
        </div>
        {branches.length > 6 && (
          <Link href="/subeler" className="text-primary text-sm font-medium mt-3 inline-block hover:underline">
            Tüm Şubeleri Gör ({branches.length})
          </Link>
        )}
      </div>
    </div>
  );
}
