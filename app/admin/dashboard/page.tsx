"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalMembers: number;
    pendingMembers: number;
    activeMembers: number;
    totalDonations: number;
    monthlyDonationSum: number;
    upcomingEvents: number;
    unreadMessages: number;
  };
  recentMembers: Array<{
    id: string;
    fullName: string;
    email: string;
    city: string | null;
    status: string;
    createdAt: string;
  }>;
  recentDonations: Array<{
    id: string;
    donorName: string;
    amount: number;
    isAnonymous: boolean;
    status: string;
    createdAt: string;
    campaign: { title: string } | null;
  }>;
  recentMessages: Array<{
    id: string;
    name: string;
    subject: string | null;
    isRead: boolean;
    createdAt: string;
  }>;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  PASSIVE: "bg-gray-100 text-gray-800",
  SUSPENDED: "bg-red-100 text-red-800",
  REJECTED: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Bekliyor",
  ACTIVE: "Aktif",
  PASSIVE: "Pasif",
  SUSPENDED: "Askıda",
  REJECTED: "Reddedildi",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(amount);
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 h-28 animate-pulse bg-gray-100" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6 h-64 animate-pulse bg-gray-100" />
          <div className="card p-6 h-64 animate-pulse bg-gray-100" />
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Dashboard</h1>
        <p className="text-muted text-sm">Dernek yönetim paneline hoş geldiniz</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.totalMembers || 0}</p>
          <p className="text-sm text-muted">Toplam Üye</p>
          <p className="text-xs text-green-600 mt-1">{stats?.activeMembers || 0} aktif</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.pendingMembers || 0}</p>
          <p className="text-sm text-muted">Bekleyen Başvuru</p>
          <Link href="/admin/uyeler?status=PENDING" className="text-xs text-primary hover:underline mt-1 inline-block">
            Başvuruları incele &rarr;
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(stats?.monthlyDonationSum || 0)}</p>
          <p className="text-sm text-muted">Bu Ay Bağış</p>
          <p className="text-xs text-muted mt-1">{stats?.totalDonations || 0} toplam bağış</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.upcomingEvents || 0}</p>
          <p className="text-sm text-muted">Yaklaşan Etkinlik</p>
          <p className="text-xs text-muted mt-1">{stats?.unreadMessages || 0} okunmamış mesaj</p>
        </div>
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Son Üye Başvuruları</h2>
            <Link href="/admin/uyeler" className="text-xs text-primary hover:underline font-semibold">
              Tümünü Gör
            </Link>
          </div>
          <div className="divide-y divide-border">
            {data?.recentMembers?.length ? (
              data.recentMembers.map((m) => (
                <Link key={m.id} href={`/admin/uyeler/${m.id}`} className="px-6 py-3 flex items-center justify-between hover:bg-background-alt transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {m.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{m.fullName}</p>
                      <p className="text-xs text-muted">{m.city || m.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[m.status] || "bg-gray-100 text-gray-800"}`}>
                    {statusLabels[m.status] || m.status}
                  </span>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-muted text-sm">Henüz üye başvurusu yok</div>
            )}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Son Bağışlar</h2>
            <Link href="/admin/bagislar" className="text-xs text-primary hover:underline font-semibold">
              Tümünü Gör
            </Link>
          </div>
          <div className="divide-y divide-border">
            {data?.recentDonations?.length ? (
              data.recentDonations.map((d) => (
                <div key={d.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {d.isAnonymous ? "Anonim Bağışçı" : d.donorName}
                    </p>
                    <p className="text-xs text-muted">{d.campaign?.title || "Genel Bağış"}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">{formatCurrency(d.amount)}</span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-muted text-sm">Henüz bağış yok</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-foreground">Son Mesajlar</h2>
          <Link href="/admin/mesajlar" className="text-xs text-primary hover:underline font-semibold">
            Tümünü Gör
          </Link>
        </div>
        <div className="divide-y divide-border">
          {data?.recentMessages?.length ? (
            data.recentMessages.map((msg) => (
              <div key={msg.id} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {!msg.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{msg.name}</p>
                    <p className="text-xs text-muted truncate">{msg.subject || "Konu belirtilmemiş"}</p>
                  </div>
                </div>
                <span className="text-xs text-muted whitespace-nowrap">{timeAgo(msg.createdAt)}</span>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-muted text-sm">Henüz mesaj yok</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="font-bold text-foreground mb-4">Hızlı İşlemler</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: "/admin/icerik/haberler/yeni", label: "Yeni Haber Ekle", icon: "M12 4v16m8-8H4" },
            { href: "/admin/icerik/duyurular/yeni", label: "Duyuru Yayınla", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6" },
            { href: "/admin/icerik/etkinlikler/yeni", label: "Etkinlik Oluştur", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { href: "/admin/uyeler?status=PENDING", label: "Başvuruları İncele", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { href: "/admin/bagislar", label: "Bağış Raporu", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            { href: "/admin/ayarlar", label: "Site Ayarları", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
            >
              <svg className="w-5 h-5 text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
              </svg>
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
