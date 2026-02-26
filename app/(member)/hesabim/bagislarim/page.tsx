"use client";

import { useState, useEffect } from "react";

interface Donation {
  id: string;
  amount: number;
  donationType: string;
  paymentMethod: string;
  status: string;
  isAnonymous: boolean;
  isRecurring: boolean;
  createdAt: string;
  campaign: { title: string } | null;
}

interface Summary {
  totalAmount: number;
  totalCount: number;
  completedCount: number;
}

const typeLabels: Record<string, string> = {
  GENERAL: "Genel",
  ZEKAT: "Zekat",
  FITRE: "Fitre",
  SADAKA: "Sadaka",
  KURBAN: "Kurban",
  ADAK: "Adak",
  AKIKA: "Akika",
};

const paymentLabels: Record<string, string> = {
  CREDIT_CARD: "Kredi Kartı",
  BANK_TRANSFER: "Havale/EFT",
  CASH: "Nakit",
};

const statusLabels: Record<string, string> = {
  COMPLETED: "Tamamlandı",
  PENDING: "Bekliyor",
  FAILED: "Başarısız",
  REFUNDED: "İade Edildi",
};

const statusColors: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(amount);
}

export default function BagislarimPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/member/donations")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setDonations(json.data.donations);
          setSummary(json.data.summary);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
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
        <h1 className="text-2xl font-bold font-heading text-foreground">Bağışlarım</h1>
        <p className="text-muted text-sm">Bağış geçmişinizi görüntüleyin</p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="text-sm text-muted">Toplam Bağış</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(summary.totalAmount)}</p>
            <p className="text-xs text-muted mt-1">{summary.completedCount} tamamlanan bağış</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-muted">Toplam İşlem</p>
            <p className="text-2xl font-bold text-foreground mt-1">{summary.totalCount}</p>
            <p className="text-xs text-muted mt-1">bağış kaydı</p>
          </div>
        </div>
      )}

      {/* Donations Table */}
      <div className="card overflow-hidden">
        {donations.length === 0 ? (
          <div className="p-12 text-center text-muted">Henüz bağış kaydı bulunmuyor.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background-alt/50">
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Tarih</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Tür</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Kampanya</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Ödeme</th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Tutar</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Durum</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b border-border last:border-0 hover:bg-background-alt/30">
                    <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                      {new Date(donation.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {typeLabels[donation.donationType] || donation.donationType}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {donation.campaign?.title || <span className="text-muted">-</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {paymentLabels[donation.paymentMethod] || donation.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[donation.status]}`}>
                        {statusLabels[donation.status]}
                      </span>
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
