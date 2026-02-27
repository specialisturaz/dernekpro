"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface BranchItem {
  id: string;
  name: string;
  slug: string;
  code?: string;
  type: string;
  status: string;
  city?: string;
  phone?: string;
  email?: string;
}

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

export default function SubelerPage() {
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (search) params.set("search", search);
    if (filterStatus) params.set("status", filterStatus);
    if (filterType) params.set("type", filterType);

    try {
      const res = await fetch(`/api/admin/branches?${params}`);
      const json = await res.json();
      if (json.success) {
        setBranches(json.data.branches);
        setTotal(json.data.total);
        setTotalPages(json.data.totalPages);
      }
    } catch {
      // Hata
    }
    setLoading(false);
  }, [page, search, filterStatus, filterType]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" şubesini silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/branches/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchBranches();
      }
    } catch {
      // Hata
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Şubeler</h1>
          <p className="text-muted text-sm">
            {total} şube kayıtlı
          </p>
        </div>
        <Link
          href="/admin/subeler/yeni"
          className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Şube
        </Link>
      </div>

      {/* Filtreler */}
      <div className="card p-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Şube ara..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
        >
          <option value="">Tüm Durumlar</option>
          <option value="ACTIVE">Aktif</option>
          <option value="PASSIVE">Pasif</option>
          <option value="CLOSED">Kapalı</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
        >
          <option value="">Tüm Türler</option>
          <option value="MERKEZ">Merkez</option>
          <option value="SUBE">Şube</option>
          <option value="TEMSILCILIK">Temsilcilik</option>
          <option value="IRTIBAT_BUROSU">İrtibat Bürosu</option>
        </select>
      </div>

      {/* Tablo */}
      {loading ? (
        <div className="card p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : branches.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-muted/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-muted font-medium">Henüz şube eklenmemiş</p>
          <Link href="/admin/subeler/yeni" className="btn-primary px-6 py-2 text-sm inline-block mt-4">
            İlk Şubeyi Ekle
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background-alt border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Şube</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Tür</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Şehir</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">Telefon</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Durum</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-background-alt/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/subeler/${branch.id}`} className="font-medium text-foreground hover:text-primary">
                        {branch.name}
                      </Link>
                      {branch.code && (
                        <span className="text-xs text-muted ml-2">({branch.code})</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {TYPE_LABELS[branch.type] || branch.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted hidden md:table-cell">
                      {branch.city || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted hidden lg:table-cell">
                      {branch.phone || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_LABELS[branch.status]?.color || ""}`}>
                        {STATUS_LABELS[branch.status]?.label || branch.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/subeler/${branch.id}`}
                          className="p-1.5 text-muted hover:text-primary rounded-lg hover:bg-primary/5"
                          title="Detay"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/subeler/${branch.id}/duzenle`}
                          className="p-1.5 text-muted hover:text-primary rounded-lg hover:bg-primary/5"
                          title="Düzenle"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(branch.id, branch.name)}
                          className="p-1.5 text-muted hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Sil"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-xs text-muted">
                Toplam {total} şube
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs rounded border border-border hover:bg-background-alt disabled:opacity-50"
                >
                  Önceki
                </button>
                <span className="px-3 py-1.5 text-xs text-muted">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs rounded border border-border hover:bg-background-alt disabled:opacity-50"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
