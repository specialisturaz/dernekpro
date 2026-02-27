"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SponsorChild {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  country: string;
  city: string;
  category: "giydirme" | "egitim" | "saglik" | "genel";
  story: string;
  photoUrl: string;
  goalAmount: number;
  collectedAmount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

type CategoryKey = SponsorChild["category"];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const categoryLabels: Record<CategoryKey, string> = {
  giydirme: "Giydirme",
  egitim: "Egitim",
  saglik: "Saglik",
  genel: "Genel",
};

const categoryColors: Record<CategoryKey, string> = {
  giydirme: "bg-purple-100 text-purple-700",
  egitim: "bg-blue-100 text-blue-700",
  saglik: "bg-rose-100 text-rose-700",
  genel: "bg-gray-100 text-gray-700",
};

const emptyForm = {
  name: "",
  age: 0,
  gender: "male" as "male" | "female",
  country: "",
  city: "",
  category: "genel" as CategoryKey,
  story: "",
  photoUrl: "",
  goalAmount: 0,
  isFeatured: false,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CocukSponsorlukPage() {
  const [children, setChildren] = useState<SponsorChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [categoryFilter, setCategoryFilter] = useState<CategoryKey | "all">("all");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ---- Toast ----
  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  // ---- Fetch ----
  const fetchChildren = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sponsor-children");
      const json = await res.json();
      if (json.success) {
        setChildren(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  // ---- Derived data ----
  const filteredChildren =
    categoryFilter === "all"
      ? children
      : children.filter((c) => c.category === categoryFilter);

  const totalChildren = children.length;
  const activeChildren = children.filter((c) => c.isActive).length;
  const totalCollected = children.reduce((sum, c) => sum + (c.collectedAmount || 0), 0);

  // ---- Form helpers ----
  const updateField = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openNewForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (child: SponsorChild) => {
    setEditingId(child.id);
    setForm({
      name: child.name,
      age: child.age,
      gender: child.gender,
      country: child.country,
      city: child.city,
      category: child.category,
      story: child.story,
      photoUrl: child.photoUrl || "",
      goalAmount: child.goalAmount,
      isFeatured: child.isFeatured,
    });
    setShowForm(true);
  };

  // ---- Upload ----
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "sponsor-children");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) {
        updateField("photoUrl", json.data.url);
        showToast("success", "Fotograf yuklendi.");
      } else {
        showToast("error", json.message || "Yukleme basarisiz.");
      }
    } catch {
      showToast("error", "Yukleme sirasinda hata olustu.");
    } finally {
      setUploading(false);
    }
  };

  // ---- Save ----
  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast("error", "Cocuk adi zorunludur.");
      return;
    }
    if (form.age <= 0) {
      showToast("error", "Gecerli bir yas giriniz.");
      return;
    }
    if (form.goalAmount <= 0) {
      showToast("error", "Hedef tutari sifirdan buyuk olmalidir.");
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/sponsor-children/${editingId}`
        : "/api/admin/sponsor-children";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", editingId ? "Cocuk bilgileri guncellendi." : "Yeni cocuk eklendi.");
        setShowForm(false);
        fetchChildren();
      } else {
        showToast("error", json.message || "Islem basarisiz.");
      }
    } catch {
      showToast("error", "Baglanti hatasi olustu.");
    } finally {
      setSaving(false);
    }
  };

  // ---- Delete ----
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu cocuk kaydini kalici olarak silmek istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/sponsor-children/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast("success", "Kayit silindi.");
        fetchChildren();
      } else {
        showToast("error", json.message || "Silme basarisiz.");
      }
    } catch {
      showToast("error", "Silme sirasinda hata olustu.");
    }
  };

  // ---- Toggle active ----
  const handleToggleActive = async (child: SponsorChild) => {
    try {
      const res = await fetch(`/api/admin/sponsor-children/${child.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !child.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", child.isActive ? "Cocuk pasif yapildi." : "Cocuk aktif yapildi.");
        fetchChildren();
      }
    } catch {
      showToast("error", "Durum degistirilemedi.");
    }
  };

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // ---- Render ----
  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {toast.text}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Cocuk Sponsorluk</h1>
          <p className="text-muted text-sm">Sponsor cocuklari yonetin, yeni cocuk ekleyin veya mevcut kayitlari duzenleyin</p>
        </div>
        <button
          onClick={openNewForm}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Cocuk Ekle
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Children */}
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted">Toplam Cocuk</p>
              <p className="text-xl font-bold text-foreground">{totalChildren}</p>
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted">Aktif</p>
              <p className="text-xl font-bold text-foreground">{activeChildren}</p>
            </div>
          </div>
        </div>

        {/* Collected Amount */}
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted">Toplanan Bagis</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(totalCollected)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {(["all", "giydirme", "egitim", "saglik", "genel"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              categoryFilter === cat
                ? "bg-primary text-white"
                : "bg-background border border-border text-foreground hover:bg-primary/5"
            }`}
          >
            {cat === "all" ? "Tumu" : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Create / Edit Form Panel */}
      {showForm && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              {editingId ? "Cocuk Bilgilerini Duzenle" : "Yeni Cocuk Ekle"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-background-alt transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Cocugun adi ve soyadi"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Yas <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                max={18}
                value={form.age || ""}
                onChange={(e) => updateField("age", parseInt(e.target.value) || 0)}
                placeholder="Yas"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Cinsiyet</label>
              <select
                value={form.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="male">Erkek</option>
                <option value="female">Kiz</option>
              </select>
            </div>
          </div>

          {/* Country + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Ulke</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="Ulke"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Sehir</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Sehir"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="giydirme">Giydirme</option>
              <option value="egitim">Egitim</option>
              <option value="saglik">Saglik</option>
              <option value="genel">Genel</option>
            </select>
          </div>

          {/* Story */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Hikaye</label>
            <textarea
              value={form.story}
              onChange={(e) => updateField("story", e.target.value)}
              rows={5}
              placeholder="Cocugun hikayesini yazin..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Fotograf</label>
            <div className="flex items-start gap-4">
              {form.photoUrl && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                  <Image
                    src={form.photoUrl}
                    alt="Cocuk fotografI"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-border bg-background hover:bg-primary/5 cursor-pointer transition-colors">
                  {uploading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                  ) : (
                    <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  <span className="text-sm text-muted">
                    {uploading ? "Yukleniyor..." : "Fotograf sec veya suruklep birak"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Goal Amount */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Hedef Tutar <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
                ₺
              </span>
              <input
                type="number"
                min={0}
                value={form.goalAmount || ""}
                onChange={(e) => updateField("goalAmount", parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {/* Is Featured Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateField("isFeatured", !form.isFeatured)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.isFeatured ? "bg-primary" : "bg-border"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  form.isFeatured ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-foreground">
              {form.isFeatured ? "One Cikariliyor" : "One Cikarilmiyor"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              )}
              {saving ? "Kaydediliyor..." : editingId ? "Guncelle" : "Kaydet"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-background-alt transition-colors"
            >
              Iptal
            </button>
          </div>
        </div>
      )}

      {/* Children Grid */}
      {filteredChildren.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 text-muted/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-muted font-medium">Henuz cocuk kaydi bulunmuyor</p>
          <button
            onClick={openNewForm}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Ilk Cocugu Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChildren.map((child) => {
            const progress =
              child.goalAmount > 0
                ? Math.min((child.collectedAmount / child.goalAmount) * 100, 100)
                : 0;

            return (
              <div
                key={child.id}
                className={`card overflow-hidden transition-shadow hover:shadow-lg ${
                  !child.isActive ? "opacity-60" : ""
                }`}
              >
                {/* Photo */}
                <div className="relative aspect-square w-full">
                  {child.photoUrl ? (
                    <Image
                      src={child.photoUrl}
                      alt={child.name}
                      fill
                      className="object-cover rounded-t-xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/5 flex items-center justify-center rounded-t-xl">
                      <svg className="w-16 h-16 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        child.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {child.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {child.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        One Cikan
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  {/* Name & Age */}
                  <div>
                    <h3 className="text-base font-bold text-foreground truncate">{child.name}</h3>
                    <p className="text-xs text-muted mt-0.5">
                      {child.age} yasinda {child.gender === "male" ? "Erkek" : "Kiz"}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">
                      {child.city && child.country
                        ? `${child.city}, ${child.country}`
                        : child.city || child.country || "-"}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        categoryColors[child.category] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {categoryLabels[child.category] || child.category}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted">Toplanan</span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(child.collectedAmount || 0)} / {formatCurrency(child.goalAmount)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted mt-1 text-right">%{progress.toFixed(0)}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-border">
                    {/* Edit */}
                    <button
                      onClick={() => openEditForm(child)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                      title="Duzenle"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Duzenle
                    </button>

                    {/* Toggle Active */}
                    <button
                      onClick={() => handleToggleActive(child)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        child.isActive
                          ? "text-yellow-600 hover:bg-yellow-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                      title={child.isActive ? "Pasif Yap" : "Aktif Yap"}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {child.isActive ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                      {child.isActive ? "Pasif" : "Aktif"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(child.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      title="Sil"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
