"use client";

import { useState, useEffect } from "react";

interface Due {
  id: string;
  period: string;
  amount: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

interface Summary {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalCount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}

const statusLabels: Record<string, string> = { PAID: "Ödendi", PENDING: "Bekliyor", OVERDUE: "Gecikmiş" };
const statusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  OVERDUE: "bg-red-100 text-red-800",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(amount);
}

function formatPeriod(period: string) {
  const [year, month] = period.split("-");
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export default function AidatlarPage() {
  const [dues, setDues] = useState<Due[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/member/dues")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setDues(json.data.dues);
          setSummary(json.data.summary);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredDues = filter === "ALL" ? dues : dues.filter((d) => d.status === filter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
        <div className="card p-6 h-64 animate-pulse bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Aidat Ödemeleri</h1>
        <p className="text-muted text-sm">Aidat geçmişinizi ve ödeme durumunuzu görüntüleyin</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-sm text-muted">Ödenen</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(summary.totalPaid)}</p>
            <p className="text-xs text-muted mt-1">{summary.paidCount} aidat</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-muted">Bekleyen</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{formatCurrency(summary.totalPending)}</p>
            <p className="text-xs text-muted mt-1">{summary.pendingCount} aidat</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-muted">Gecikmiş</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(summary.totalOverdue)}</p>
            <p className="text-xs text-muted mt-1">{summary.overdueCount} aidat</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { value: "ALL", label: "Tümü" },
          { value: "PENDING", label: "Bekleyen" },
          { value: "OVERDUE", label: "Gecikmiş" },
          { value: "PAID", label: "Ödenen" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              filter === f.value
                ? "bg-primary text-white"
                : "bg-background border border-border text-muted hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Dues Table */}
      <div className="card overflow-hidden">
        {filteredDues.length === 0 ? (
          <div className="p-12 text-center text-muted">
            {dues.length === 0 ? "Henüz aidat kaydı bulunmuyor." : "Bu filtreye uygun aidat bulunamadı."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background-alt/50">
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Dönem</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Tutar</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Durum</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Ödeme Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDues.map((due) => (
                  <tr key={due.id} className="border-b border-border last:border-0 hover:bg-background-alt/30">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{formatPeriod(due.period)}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{formatCurrency(due.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[due.status]}`}>
                        {statusLabels[due.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {due.paidAt ? new Date(due.paidAt).toLocaleDateString("tr-TR") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
