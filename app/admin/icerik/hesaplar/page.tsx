"use client";

import { useState, useEffect, useCallback } from "react";

interface BankAccount {
  id: string;
  bankName: string;
  bankLogo: string | null;
  accountName: string;
  iban: string;
  accountNo: string | null;
  branchName: string | null;
  branchCode: string | null;
  currency: string;
  description: string | null;
  isActive: boolean;
  order: number;
}

type FormMode = "closed" | "create" | "edit";

const CURRENCIES = ["TRY", "USD", "EUR", "GBP"] as const;

export default function BankAccountsAdminPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("closed");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    bankName: "",
    accountName: "",
    iban: "",
    accountNo: "",
    branchName: "",
    branchCode: "",
    currency: "TRY",
    description: "",
    order: 0,
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bank-accounts");
      const data = await res.json();
      if (data.success) setAccounts(data.data);
    } catch {
      showToast("Hesaplar yüklenemedi", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const resetForm = () => {
    setForm({ bankName: "", accountName: "", iban: "", accountNo: "", branchName: "", branchCode: "", currency: "TRY", description: "", order: 0 });
    setFormMode("closed");
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setFormMode("create");
  };

  const openEdit = (acc: BankAccount) => {
    setForm({
      bankName: acc.bankName,
      accountName: acc.accountName,
      iban: acc.iban,
      accountNo: acc.accountNo || "",
      branchName: acc.branchName || "",
      branchCode: acc.branchCode || "",
      currency: acc.currency,
      description: acc.description || "",
      order: acc.order,
    });
    setEditingId(acc.id);
    setFormMode("edit");
  };

  const handleSave = async () => {
    if (!form.bankName || !form.accountName || !form.iban) {
      showToast("Banka adı, hesap sahibi ve IBAN zorunludur", "error");
      return;
    }

    setSaving(true);
    try {
      const url = formMode === "edit" ? `/api/admin/bank-accounts/${editingId}` : "/api/admin/bank-accounts";
      const method = formMode === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();

      if (data.success) {
        showToast(data.message, "success");
        resetForm();
        fetchAccounts();
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
    if (!confirm("Bu hesabı silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/bank-accounts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Hesap silindi", "success");
        fetchAccounts();
      } else {
        showToast(data.message || "Silinemedi", "error");
      }
    } catch {
      showToast("Bir hata oluştu", "error");
    }
  };

  const toggleActive = async (acc: BankAccount) => {
    try {
      const res = await fetch(`/api/admin/bank-accounts/${acc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !acc.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAccounts();
      }
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
          <h1 className="text-2xl font-bold text-gray-900">Banka Hesapları</h1>
          <p className="text-sm text-gray-500 mt-1">Hesap numaralarımız sayfası için banka hesaplarını yönetin</p>
        </div>
        {formMode === "closed" && (
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            + Yeni Hesap
          </button>
        )}
      </div>

      {/* Form */}
      {formMode !== "closed" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {formMode === "create" ? "Yeni Hesap Ekle" : "Hesap Düzenle"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banka Adı *</label>
              <input className={inputCls} value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} placeholder="Türkiye İş Bankası" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Sahibi *</label>
              <input className={inputCls} value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} placeholder="Dernek Adı" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">IBAN *</label>
              <input className={inputCls} value={form.iban} onChange={(e) => setForm({ ...form, iban: e.target.value.toUpperCase() })} placeholder="TR00 0000 0000 0000 0000 0000 00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hesap No</label>
              <input className={inputCls} value={form.accountNo} onChange={(e) => setForm({ ...form, accountNo: e.target.value })} placeholder="1234567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şube Adı</label>
              <input className={inputCls} value={form.branchName} onChange={(e) => setForm({ ...form, branchName: e.target.value })} placeholder="Esenler" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şube Kodu</label>
              <input className={inputCls} value={form.branchCode} onChange={(e) => setForm({ ...form, branchCode: e.target.value })} placeholder="0001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
              <select className={inputCls} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
              <input type="number" className={inputCls} value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea className={inputCls} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Opsiyonel açıklama..." />
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
      ) : accounts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p className="text-gray-500">Henüz banka hesabı eklenmemiş</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Banka</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Şube</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">IBAN</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Para Birimi</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Durum</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{acc.bankName}</td>
                  <td className="px-4 py-3 text-gray-600">{acc.branchName || "-"}{acc.branchCode ? ` (${acc.branchCode})` : ""}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{acc.iban}</td>
                  <td className="px-4 py-3 text-gray-600">{acc.currency}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(acc)} className={`px-2 py-0.5 rounded-full text-xs font-medium ${acc.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {acc.isActive ? "Aktif" : "Pasif"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(acc)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Düzenle</button>
                      <button onClick={() => handleDelete(acc.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
