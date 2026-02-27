"use client";

import { useState, useEffect, useCallback } from "react";

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string | null;
  amount: number;
  donationType: string;
  paymentMethod: string;
  status: string;
  isAnonymous: boolean;
  isRecurring: boolean;
  createdAt: string;
  campaign: { id: string; title: string } | null;
}

interface Summary {
  total: number;
  totalAmount: number;
  completedCount: number;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-blue-100 text-blue-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  COMPLETED: "Tamamlandi",
  FAILED: "Basarisiz",
  REFUNDED: "Iade",
};

const donationTypeLabels: Record<string, string> = {
  GENERAL: "Genel",
  ZEKAT: "Zekat",
  FITRE: "Fitre",
  SADAKA: "Sadaka",
  KURBAN: "Kurban",
  ADAK: "Adak",
  AKIKA: "Akika",
};

const paymentLabels: Record<string, string> = {
  CREDIT_CARD: "Kredi Karti",
  BANK_TRANSFER: "Havale",
  CASH: "Nakit",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, totalAmount: 0, completedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("donationType", typeFilter);

    try {
      const res = await fetch(`/api/admin/donations?${params}`);
      const json = await res.json();
      if (json.success) {
        setDonations(json.data.donations);
        setSummary(json.data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Bagislar</h1>
          <p className="text-muted text-sm">Tum bagislari goruntuleyin ve yonetin</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted">Toplam Bagis</p>
              <p className="text-xl font-bold text-foreground">{summary.total}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted">Toplam Tutar</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(summary.totalAmount)}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted">Tamamlanan</p>
              <p className="text-xl font-bold text-foreground">{summary.completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchDonations()}
              placeholder="Bagisci adi veya e-posta ara..."
              className="w-full px-4 py-2.5 pl-10 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <svg className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="">Tum Durumlar</option>
            <option value="PENDING">Beklemede</option>
            <option value="COMPLETED">Tamamlandi</option>
            <option value="FAILED">Basarisiz</option>
            <option value="REFUNDED">Iade</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="">Tum Turler</option>
            <option value="GENERAL">Genel</option>
            <option value="ZEKAT">Zekat</option>
            <option value="FITRE">Fitre</option>
            <option value="SADAKA">Sadaka</option>
            <option value="KURBAN">Kurban</option>
            <option value="ADAK">Adak</option>
            <option value="AKIKA">Akika</option>
          </select>
          <button onClick={fetchDonations} className="btn-primary px-6 py-2.5 text-sm">
            Filtrele
          </button>
        </div>
      </div>

      {/* Donations Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-muted/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-muted">Henuz bagis bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-alt">
                <tr>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Bagisci</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">E-posta</th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Tutar</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Kampanya</th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">Tur</th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Odeme</th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Durum</th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-background-alt/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-foreground">
                        {donation.isAnonymous ? "Anonim" : donation.donorName}
                      </p>
                      {donation.isRecurring && (
                        <span className="text-xs text-primary font-medium">Tekrarli</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted hidden md:table-cell">
                      {donation.donorEmail || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-foreground">
                        {formatCurrency(donation.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted hidden lg:table-cell">
                      {donation.campaign?.title || "-"}
                    </td>
                    <td className="px-6 py-4 text-center hidden md:table-cell">
                      <span className="text-xs font-medium text-muted">
                        {donationTypeLabels[donation.donationType] || donation.donationType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center hidden lg:table-cell">
                      <span className="text-xs font-medium text-muted">
                        {paymentLabels[donation.paymentMethod] || donation.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          statusColors[donation.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusLabels[donation.status] || donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-muted hidden md:table-cell">
                      {new Date(donation.createdAt).toLocaleDateString("tr-TR")}
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
