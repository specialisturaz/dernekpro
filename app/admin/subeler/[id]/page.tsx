"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const TYPE_LABELS: Record<string, string> = {
  MERKEZ: "Merkez",
  SUBE: "Şube",
  TEMSILCILIK: "Temsilcilik",
  IRTIBAT_BUROSU: "İrtibat Bürosu",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Aktif", color: "bg-green-100 text-green-700" },
  PASSIVE: { label: "Pasif", color: "bg-yellow-100 text-yellow-700" },
  CLOSED: { label: "Kapalı", color: "bg-red-100 text-red-700" },
};

interface BranchDetail {
  id: string;
  name: string;
  slug: string;
  code?: string;
  type: string;
  status: string;
  phone?: string;
  email?: string;
  fax?: string;
  address?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  presidentName?: string;
  presidentPhone?: string;
  presidentEmail?: string;
  description?: string;
  memberCount: number;
  foundedAt?: string;
  messageCount: number;
  createdAt: string;
}

interface BranchMsg {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function SubeDetayPage() {
  const { id } = useParams() as { id: string };
  const [branch, setBranch] = useState<BranchDetail | null>(null);
  const [messages, setMessages] = useState<BranchMsg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [branchRes, msgsRes] = await Promise.all([
          fetch(`/api/admin/branches/${id}`),
          fetch(`/api/admin/branches/${id}/messages`),
        ]);
        const branchJson = await branchRes.json();
        const msgsJson = await msgsRes.json();
        if (branchJson.success) setBranch(branchJson.data);
        if (msgsJson.success) setMessages(msgsJson.data);
      } catch {
        // Hata
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="card p-6 h-64 animate-pulse bg-gray-100" />
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="card p-12 text-center">
        <p className="text-muted">Şube bulunamadı</p>
        <Link href="/admin/subeler" className="text-primary text-sm mt-2 inline-block">
          Şubelere dön
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin/subeler" className="text-muted hover:text-foreground">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold font-heading text-foreground">{branch.name}</h1>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_LABELS[branch.status]?.color || ""}`}>
              {STATUS_LABELS[branch.status]?.label}
            </span>
          </div>
          <p className="text-muted text-sm ml-8">
            {TYPE_LABELS[branch.type]} {branch.city && `• ${branch.city}`}
          </p>
        </div>
        <Link
          href={`/admin/subeler/${branch.id}/duzenle`}
          className="btn-primary px-6 py-2 text-sm inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Düzenle
        </Link>
      </div>

      {/* Bilgi Kartlari */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Iletisim */}
        <div className="card p-5">
          <h3 className="font-semibold text-foreground mb-3 text-sm">İletişim</h3>
          <div className="space-y-2 text-sm">
            {branch.phone && <p className="text-muted"><span className="font-medium text-foreground">Tel:</span> {branch.phone}</p>}
            {branch.email && <p className="text-muted"><span className="font-medium text-foreground">E-posta:</span> {branch.email}</p>}
            {branch.fax && <p className="text-muted"><span className="font-medium text-foreground">Fax:</span> {branch.fax}</p>}
            {!branch.phone && !branch.email && !branch.fax && <p className="text-muted italic">Bilgi girilmemiş</p>}
          </div>
        </div>

        {/* Adres */}
        <div className="card p-5">
          <h3 className="font-semibold text-foreground mb-3 text-sm">Adres</h3>
          <div className="space-y-1 text-sm text-muted">
            {branch.address && <p>{branch.address}</p>}
            {(branch.district || branch.city) && (
              <p>{[branch.district, branch.city].filter(Boolean).join(", ")} {branch.postalCode && `(${branch.postalCode})`}</p>
            )}
            {!branch.address && !branch.city && <p className="italic">Adres girilmemiş</p>}
          </div>
        </div>

        {/* Baskan */}
        <div className="card p-5">
          <h3 className="font-semibold text-foreground mb-3 text-sm">Başkan</h3>
          <div className="space-y-2 text-sm">
            {branch.presidentName ? (
              <>
                <p className="font-medium text-foreground">{branch.presidentName}</p>
                {branch.presidentPhone && <p className="text-muted">{branch.presidentPhone}</p>}
                {branch.presidentEmail && <p className="text-muted">{branch.presidentEmail}</p>}
              </>
            ) : (
              <p className="text-muted italic">Bilgi girilmemiş</p>
            )}
          </div>
        </div>
      </div>

      {/* Aciklama */}
      {branch.description && (
        <div className="card p-5">
          <h3 className="font-semibold text-foreground mb-3 text-sm">Açıklama</h3>
          <p className="text-sm text-muted whitespace-pre-wrap">{branch.description}</p>
        </div>
      )}

      {/* Mesajlar */}
      <div className="card">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm">
            Mesajlar ({branch.messageCount})
          </h3>
        </div>
        {messages.length === 0 ? (
          <div className="p-8 text-center text-muted text-sm">Henüz mesaj yok</div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((msg) => (
              <div key={msg.id} className="px-5 py-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <span className="font-medium text-foreground text-sm">{msg.name}</span>
                    <span className="text-xs text-muted ml-2">{msg.email}</span>
                  </div>
                  <span className="text-xs text-muted">
                    {new Date(msg.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{msg.subject}</p>
                <p className="text-sm text-muted">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
