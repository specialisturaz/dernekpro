"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardData {
  member: {
    fullName: string;
    status: string;
    memberSince: string | null;
    membershipYears: number;
  };
  stats: {
    totalDonations: number;
    donationCount: number;
    pendingDuesCount: number;
    pendingDuesAmount: number;
    dueStatus: string;
  };
  recentDonations: {
    id: string;
    amount: number;
    type: string;
    campaign: string | null;
    date: string;
    status: string;
  }[];
  recentDues: {
    id: string;
    period: string;
    amount: number;
    status: string;
    paidAt: string | null;
  }[];
  upcomingEvents: {
    id: string;
    title: string;
    startAt: string;
    location: string | null;
    eventType: string;
  }[];
}

const donationTypeLabels: Record<string, string> = {
  GENERAL: "Genel",
  ZEKAT: "Zekat",
  FITRE: "Fitre",
  SADAKA: "Sadaka",
  KURBAN: "Kurban",
  ADAK: "Adak",
  AKIKA: "Akika",
};

const dueStatusLabels: Record<string, string> = { PAID: "Ödendi", PENDING: "Bekliyor", OVERDUE: "Gecikmiş" };
const dueStatusColors: Record<string, string> = { PAID: "text-green-600", PENDING: "text-yellow-600", OVERDUE: "text-red-600" };

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(amount);
}

export default function HesabimPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/member/dashboard")
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
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 h-32 animate-pulse bg-gray-100" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6 h-64 animate-pulse bg-gray-100" />
          <div className="card p-6 h-64 animate-pulse bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card p-12 text-center">
        <p className="text-muted">Veriler yüklenemedi. Lütfen sayfayı yenileyin.</p>
      </div>
    );
  }

  const firstName = data.member.fullName.split(" ")[0];

  const statsCards = [
    {
      label: "Toplam Bağış",
      value: formatCurrency(data.stats.totalDonations),
      sub: `${data.stats.donationCount} bağış`,
      color: "text-green-600",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    },
    {
      label: "Üyelik Süresi",
      value: data.member.membershipYears > 0 ? `${data.member.membershipYears} Yıl` : "Yeni Üye",
      sub: data.member.status === "ACTIVE" ? "Aktif Üye" : data.member.status,
      color: "text-primary",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
    {
      label: "Aidat Durumu",
      value: data.stats.pendingDuesCount === 0 ? "Güncel" : `${data.stats.pendingDuesCount} Bekleyen`,
      sub: data.stats.pendingDuesAmount > 0 ? formatCurrency(data.stats.pendingDuesAmount) : "Tüm aidatlar ödendi",
      color: data.stats.pendingDuesCount === 0 ? "text-green-600" : "text-yellow-600",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    },
    {
      label: "Yaklaşan Etkinlik",
      value: `${data.upcomingEvents.length}`,
      sub: data.upcomingEvents.length > 0 ? data.upcomingEvents[0].title : "Kayıtlı etkinlik yok",
      color: "text-blue-600",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-1">
          Hoş Geldiniz, {firstName}!
        </h1>
        <p className="text-muted">Üyelik panelinize genel bakış.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold font-heading text-foreground">{stat.value}</p>
            <p className="text-sm text-muted mt-0.5">{stat.label}</p>
            <p className={`text-xs mt-2 font-semibold ${stat.color}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Dues + Donations */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-heading text-foreground">Son İşlemler</h2>
            <Link href="/hesabim/bagislarim" className="text-sm text-primary font-semibold hover:underline">
              Tümünü Gör
            </Link>
          </div>

          {data.recentDues.length === 0 && data.recentDonations.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">Henüz işlem bulunmuyor.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider pb-3">Tarih</th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider pb-3">İşlem</th>
                    <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider pb-3">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentDues.map((due) => (
                    <tr key={`due-${due.id}`} className="border-b border-border last:border-0">
                      <td className="py-3 text-sm text-muted whitespace-nowrap">{due.period}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-sm text-foreground">Aidat</span>
                          <span className={`text-xs font-semibold ${dueStatusColors[due.status]}`}>
                            ({dueStatusLabels[due.status]})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-foreground text-right font-semibold">
                        {formatCurrency(due.amount)}
                      </td>
                    </tr>
                  ))}
                  {data.recentDonations.map((donation) => (
                    <tr key={`don-${donation.id}`} className="border-b border-border last:border-0">
                      <td className="py-3 text-sm text-muted whitespace-nowrap">
                        {new Date(donation.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-sm text-foreground">
                            {donationTypeLabels[donation.type] || donation.type} Bağış
                            {donation.campaign && ` - ${donation.campaign}`}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-foreground text-right font-semibold">
                        {formatCurrency(donation.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-heading text-foreground">Yaklaşan Etkinlikler</h2>
          </div>
          {data.upcomingEvents.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">Kayıtlı etkinlik yok.</p>
          ) : (
            <div className="space-y-4">
              {data.upcomingEvents.map((event) => {
                const d = new Date(event.startAt);
                return (
                  <div key={event.id} className="flex gap-3 p-3 rounded-[var(--border-radius)] bg-background-alt">
                    <div className="w-12 h-12 bg-primary text-white rounded-[var(--border-radius)] flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold leading-none">{d.getDate()}</span>
                      <span className="text-[10px] uppercase">
                        {d.toLocaleDateString("tr-TR", { month: "short" })}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">{event.title}</h3>
                      <p className="text-xs text-muted mt-0.5">
                        {d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                        {event.location && ` - ${event.location}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <Link href="/bagis" className="card p-5 text-center hover:border-primary transition-colors group">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Bağış Yap</h3>
          <p className="text-xs text-muted mt-1">Projelere destek ol</p>
        </Link>
        <Link href="/etkinlikler" className="card p-5 text-center hover:border-primary transition-colors group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Etkinliklere Katıl</h3>
          <p className="text-xs text-muted mt-1">Takvimi incele</p>
        </Link>
        <Link href="/hesabim/profil" className="card p-5 text-center hover:border-primary transition-colors group">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Profili Düzenle</h3>
          <p className="text-xs text-muted mt-1">Bilgilerini güncelle</p>
        </Link>
      </div>
    </div>
  );
}
