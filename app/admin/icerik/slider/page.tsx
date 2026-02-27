"use client";

import { useState, useEffect, useCallback } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Slide {
  id: string;
  mediaUrl: string;
  mobileMediaUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  order: number;
  isActive: boolean;
  badge?: string | null;
  bgColor?: string | null;
  accentColor?: string | null;
  statsLabel?: string | null;
  statsValue?: string | null;
  slideDate?: string | null;
  location?: string | null;
}

const emptyForm = {
  mediaUrl: "",
  mobileMediaUrl: "",
  title: "",
  subtitle: "",
  buttonText: "",
  buttonLink: "",
  badge: "",
  bgColor: "#1a3a2a",
  accentColor: "#c8956c",
  statsLabel: "",
  statsValue: "",
  slideDate: "",
  location: "",
  isActive: true,
};

export default function SliderPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const fetchSlides = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/slides");
      if (!res.ok) {
        setError(`Sunucu hatasi: ${res.status}`);
        return;
      }
      const json = await res.json();
      if (json.success) {
        setSlides(json.data || []);
      } else {
        setError(json.message || "Slide'lar yuklenemedi.");
      }
    } catch (err) {
      console.error("Slide fetch error:", err);
      setError("Slide'lar yuklenirken baglanti hatasi olustu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openNewForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (slide: Slide) => {
    setEditingId(slide.id);
    setForm({
      mediaUrl: slide.mediaUrl || "",
      mobileMediaUrl: slide.mobileMediaUrl || "",
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      buttonText: slide.buttonText || "",
      buttonLink: slide.buttonLink || "",
      badge: slide.badge || "",
      bgColor: slide.bgColor || "#1a3a2a",
      accentColor: slide.accentColor || "#c8956c",
      statsLabel: slide.statsLabel || "",
      statsValue: slide.statsValue || "",
      slideDate: slide.slideDate || "",
      location: slide.location || "",
      isActive: slide.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.mediaUrl) {
      showMsg("error", "Gorsel URL zorunludur.");
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/slides/${editingId}`
        : "/api/admin/slides";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.success) {
        showMsg("success", editingId ? "Slide guncellendi." : "Slide olusturuldu.");
        setShowForm(false);
        fetchSlides();
      } else {
        showMsg("error", json.message || "Hata olustu.");
      }
    } catch {
      showMsg("error", "Baglanti hatasi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/slides/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showMsg("success", "Slide silindi.");
        fetchSlides();
      }
    } catch {
      showMsg("error", "Silinemedi.");
    }
    setDeleteConfirm(null);
  };

  const handleToggleActive = async (slide: Slide) => {
    try {
      await fetch(`/api/admin/slides/${slide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !slide.isActive }),
      });
      fetchSlides();
    } catch {
      // silent
    }
  };

  const handleReorder = async (id: string, dir: "up" | "down") => {
    const idx = slides.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= slides.length) return;

    const a = slides[idx];
    const b = slides[swapIdx];

    try {
      await Promise.all([
        fetch(`/api/admin/slides/${a.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: b.order }),
        }),
        fetch(`/api/admin/slides/${b.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: a.order }),
        }),
      ]);
      fetchSlides();
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Slider Yonetimi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ana sayfa slider gorsellerini yonetin. Slide ekleyin, duzenleyin ve siralayin.
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Yeni Slide
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{error}</span>
            <button
              onClick={() => { setLoading(true); fetchSlides(); }}
              className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-xs font-medium transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      )}

      {/* Slide List */}
      {slides.length === 0 && !showForm && !error ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 font-medium">Henuz slide eklenmemis.</p>
          <button
            onClick={openNewForm}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Ilk Slide&apos;i Ekle
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`bg-white rounded-xl border ${
                slide.isActive ? "border-gray-200" : "border-gray-100 opacity-60"
              } p-4 flex items-center gap-4 group hover:shadow-md transition-shadow`}
            >
              {/* Reorder */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleReorder(slide.id, "up")}
                  disabled={idx === 0}
                  className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleReorder(slide.id, "down")}
                  disabled={idx === slides.length - 1}
                  className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Thumbnail */}
              <div
                className="w-32 h-20 rounded-lg bg-cover bg-center flex-shrink-0 border border-gray-100"
                style={{ backgroundImage: `url(${slide.mediaUrl})` }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {slide.badge && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        background: `${slide.accentColor || "#c8956c"}22`,
                        color: slide.accentColor || "#c8956c",
                      }}
                    >
                      {slide.badge}
                    </span>
                  )}
                  {!slide.isActive && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      Pasif
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
                  {slide.title || "Baslksiz Slide"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {slide.subtitle || "Aciklama yok"}
                </p>
              </div>

              {/* Color preview */}
              <div className="hidden sm:flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ background: slide.bgColor || "#1a3a2a" }}
                  title="Arkaplan rengi"
                />
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ background: slide.accentColor || "#c8956c" }}
                  title="Vurgu rengi"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(slide)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    slide.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                  title={slide.isActive ? "Pasif yap" : "Aktif yap"}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-all ${
                      slide.isActive ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>
                <button
                  onClick={() => openEditForm(slide)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Duzenle"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteConfirm(slide.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Sil"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Slide&apos;i Sil</h3>
            <p className="text-sm text-gray-600 mb-6">
              Bu slide kalici olarak silinecektir. Devam etmek istiyor musunuz?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Iptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Slide Duzenle" : "Yeni Slide"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Preview */}
              <div
                className="relative w-full rounded-xl overflow-hidden"
                style={{ aspectRatio: "16/9", minHeight: 200 }}
              >
                {form.mediaUrl ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${form.mediaUrl})` }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${form.bgColor}cc 0%, transparent 60%), linear-gradient(180deg, transparent 30%, ${form.bgColor}ee 100%)`,
                      }}
                    />
                    <div className="absolute bottom-4 left-4 z-10">
                      {form.badge && (
                        <span
                          className="inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2"
                          style={{
                            background: `${form.accentColor}22`,
                            color: form.accentColor,
                          }}
                        >
                          {form.badge}
                        </span>
                      )}
                      {form.title && (
                        <h3 className="text-white text-lg font-bold whitespace-pre-line drop-shadow">
                          {form.title}
                        </h3>
                      )}
                      {form.subtitle && (
                        <p className="text-xs text-white/75 max-w-[280px] line-clamp-2 mt-1">
                          {form.subtitle}
                        </p>
                      )}
                      {(form.slideDate || form.location || (form.statsValue && form.statsLabel)) && (
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {form.slideDate && (
                            <span className="flex items-center gap-1 text-[9px] text-white/50">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {form.slideDate}
                            </span>
                          )}
                          {form.location && (
                            <span className="flex items-center gap-1 text-[9px] text-white/50">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {form.location}
                            </span>
                          )}
                          {form.statsValue && form.statsLabel && (
                            <span className="flex items-center gap-1 text-[9px] text-white/50">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {form.statsValue} {form.statsLabel}
                            </span>
                          )}
                        </div>
                      )}
                      {form.statsValue && form.statsLabel && (
                        <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                          <span className="text-sm font-extrabold text-white leading-none">{form.statsValue}</span>
                          <span className="text-[7px] font-semibold text-white/50 uppercase tracking-wider">{form.statsLabel}</span>
                        </div>
                      )}
                      {form.buttonText && (
                        <span
                          className="inline-block mt-2 text-xs font-bold text-white px-3 py-1.5 rounded-full"
                          style={{ background: form.accentColor }}
                        >
                          {form.buttonText}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">Gorsel yuklendikten sonra onizleme gorunecek</p>
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Slider Gorseli <span className="text-red-500">*</span>
                  </label>
                  <ImageUpload
                    value={form.mediaUrl}
                    onChange={(url) => updateField("mediaUrl", url)}
                    folder="slides"
                    label="Gorsel Yukle"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Mobil Gorsel <span className="text-gray-400 text-xs font-normal">(opsiyonel)</span>
                  </label>
                  <ImageUpload
                    value={form.mobileMediaUrl}
                    onChange={(url) => updateField("mobileMediaUrl", url)}
                    folder="slides"
                    label="Mobil Gorsel"
                  />
                </div>
              </div>

              {/* Badge + Title */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Badge</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => updateField("badge", e.target.value)}
                    placeholder="orn: Egitim Projeleri"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Baslik</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Slide basligi (satir sonu icin \n kullanin)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Aciklama</label>
                <textarea
                  value={form.subtitle}
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  rows={2}
                  placeholder="Slide aciklama metni"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              {/* CTA Button */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Buton Metni</label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={(e) => updateField("buttonText", e.target.value)}
                    placeholder="orn: Bagis Yap"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Buton Linki</label>
                  <input
                    type="text"
                    value={form.buttonLink}
                    onChange={(e) => updateField("buttonLink", e.target.value)}
                    placeholder="orn: /bagis"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Arkaplan Rengi</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.bgColor}
                      onChange={(e) => updateField("bgColor", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.bgColor}
                      onChange={(e) => updateField("bgColor", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Vurgu Rengi</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.accentColor}
                      onChange={(e) => updateField("accentColor", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.accentColor}
                      onChange={(e) => updateField("accentColor", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Istatistik Degeri</label>
                  <input
                    type="text"
                    value={form.statsValue}
                    onChange={(e) => updateField("statsValue", e.target.value)}
                    placeholder="orn: 2,500+"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Istatistik Etiketi</label>
                  <input
                    type="text"
                    value={form.statsLabel}
                    onChange={(e) => updateField("statsLabel", e.target.value)}
                    placeholder="orn: Desteklenen Aile"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Date + Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Tarih</label>
                  <input
                    type="text"
                    value={form.slideDate}
                    onChange={(e) => updateField("slideDate", e.target.value)}
                    placeholder="orn: Devam Ediyor"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Konum</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="orn: Turkiye Geneli"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => updateField("isActive", !form.isActive)}
                  className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${
                    form.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-all ${
                      form.isActive ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {form.isActive ? "Aktif" : "Pasif"}
                </span>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                disabled={saving}
              >
                Iptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Kaydediliyor..." : editingId ? "Guncelle" : "Olustur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
