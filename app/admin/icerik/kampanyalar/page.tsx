"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  targetAmount: number;
  collectedAmount: number;
  deadline: string | null;
  isActive: boolean;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
  createdAt: string;
  _count: { donations: number };
}

type FormMode = "closed" | "create" | "edit";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Aktif", cls: "bg-green-100 text-green-700" },
  { value: "COMPLETED", label: "Tamamlandı", cls: "bg-blue-100 text-blue-700" },
  { value: "PAUSED", label: "Duraklatıldı", cls: "bg-yellow-100 text-yellow-700" },
] as const;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(amount);
}

export default function CampaignsAdminPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("closed");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    coverImage: "",
    targetAmount: "",
    deadline: "",
    status: "ACTIVE" as string,
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/campaigns");
      const data = await res.json();
      if (data.success) setCampaigns(data.data);
    } catch {
      showToast("Kampanyalar yüklenemedi", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const resetForm = () => {
    setForm({ title: "", description: "", coverImage: "", targetAmount: "", deadline: "", status: "ACTIVE" });
    setCoverPreview(null);
    setFormMode("closed");
    setEditingId(null);
  };

  const openCreate = () => { resetForm(); setFormMode("create"); };

  const openEdit = (c: Campaign) => {
    setForm({
      title: c.title,
      description: c.description,
      coverImage: c.coverImage || "",
      targetAmount: c.targetAmount.toString(),
      deadline: c.deadline ? c.deadline.slice(0, 10) : "",
      status: c.status,
    });
    setCoverPreview(c.coverImage);
    setEditingId(c.id);
    setFormMode("edit");
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "campaigns");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, coverImage: data.url }));
      } else {
        showToast("Görsel yüklenemedi", "error");
      }
    } catch {
      showToast("Görsel yüklenirken hata oluştu", "error");
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.description) {
      showToast("Başlık ve açıklama zorunludur", "error");
      return;
    }
    setSaving(true);
    try {
      const url = formMode === "edit" ? `/api/admin/campaigns/${editingId}` : "/api/admin/campaigns";
      const method = formMode === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        resetForm();
        fetchCampaigns();
      } else {
        showToast(data.message || "Hata oluştu", "error");
      }
    } catch {
      showToast("Bir hata oluştu", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kampanyayı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Kampanya silindi", "success");
        fetchCampaigns();
      } else {
        showToast(data.message || "Silinemedi", "error");
      }
    } catch {
      showToast("Bir hata oluştu", "error");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) fetchCampaigns();
    } catch {
      showToast("Durum güncellenemedi", "error");
    }
  };

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm";

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kampanyalar</h1>
          <p className="text-sm text-gray-500 mt-1">Bağış kampanyalarını oluşturun ve yönetin</p>
        </div>
        {formMode === "closed" && (
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            + Yeni Kampanya
          </button>
        )}
      </div>

      {/* Form */}
      {formMode !== "closed" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {formMode === "create" ? "Yeni Kampanya" : "Kampanya Düzenle"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
              <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Kampanya başlığı" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
              <textarea className={inputCls} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Kampanya açıklaması..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Tutar (₺)</label>
              <input type="number" className={inputCls} value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} placeholder="100000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Son Tarih</label>
              <input type="date" className={inputCls} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli</label>
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="text-sm" />
              {coverPreview && (
                <div className="mt-2 relative w-32 h-20 rounded overflow-hidden">
                  <Image src={coverPreview} alt="Kapak" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium">
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button onClick={resetForm} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-500">Henüz kampanya eklenmemiş</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Kampanya</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Hedef</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Toplanan</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Bağış</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Durum</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map((c) => {
                const statusOpt = STATUS_OPTIONS.find((s) => s.value === c.status) || STATUS_OPTIONS[0];
                const progress = c.targetAmount > 0 ? Math.min(100, Math.round((c.collectedAmount / c.targetAmount) * 100)) : 0;

                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {c.coverImage && (
                          <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                            <Image src={c.coverImage} alt={c.title} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{c.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{c.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(c.targetAmount)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-gray-900 font-medium">{formatCurrency(c.collectedAmount)}</span>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{c._count.donations}</td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer ${statusOpt.cls}`}
                      >
                        {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Düzenle</button>
                        <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Sil</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
