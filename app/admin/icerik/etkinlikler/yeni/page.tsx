"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import RichEditor from "@/components/admin/RichEditor";

const inputClass =
  "w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function NewEventPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    coverImage: "",
    startAt: "",
    endAt: "",
    location: "",
    eventType: "IN_PERSON",
    capacity: "",
    isFree: true,
    price: "",
    requiresRegistration: false,
    status: "UPCOMING",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!form.title || !form.startAt || !form.endAt) {
      setError("Başlık, başlangıç ve bitiş tarihi zorunludur");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          capacity: form.capacity || null,
          price: form.isFree ? null : form.price || null,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Hata oluştu");
        return;
      }

      router.push("/admin/icerik/etkinlikler");
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/icerik/etkinlikler" className="text-muted hover:text-foreground">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold font-heading text-foreground">Yeni Etkinlik</h1>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="card p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                Başlık <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Etkinlik başlığı" className={inputClass} />
            </div>
          </div>

          {/* Date & Location */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-foreground">Tarih ve Konum</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">
                  Başlangıç <span className="text-red-500">*</span>
                </label>
                <input type="datetime-local" value={form.startAt} onChange={(e) => updateField("startAt", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">
                  Bitiş <span className="text-red-500">*</span>
                </label>
                <input type="datetime-local" value={form.endAt} onChange={(e) => updateField("endAt", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Konum</label>
              <input type="text" value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="Etkinlik konumu" className={inputClass} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Etkinlik Türü</label>
                <select value={form.eventType} onChange={(e) => updateField("eventType", e.target.value)} className={inputClass}>
                  <option value="IN_PERSON">Yüz Yüze</option>
                  <option value="ONLINE">Online</option>
                  <option value="HYBRID">Hibrit</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Kontenjan</label>
                <input type="number" value={form.capacity} onChange={(e) => updateField("capacity", e.target.value)} placeholder="Sınırsız" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <label className="text-sm font-semibold text-foreground mb-1.5 block">Açıklama</label>
            <RichEditor value={form.description} onChange={(html) => updateField("description", html)} placeholder="Etkinlik açıklamasını yazın..." />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card p-6">
            <h3 className="font-bold text-foreground mb-4">Ayarlar</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFree} onChange={(e) => updateField("isFree", e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-foreground">Ücretsiz etkinlik</span>
              </label>
              {!form.isFree && (
                <div>
                  <label className="text-sm text-foreground mb-1 block">Ücret (TL)</label>
                  <input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="0.00" className={inputClass} />
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.requiresRegistration} onChange={(e) => updateField("requiresRegistration", e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-foreground">Kayıt zorunlu</span>
              </label>
            </div>
            <button onClick={handleSubmit} disabled={saving} className="btn-primary w-full mt-4 py-2.5 text-sm disabled:opacity-50">
              {saving ? "Oluşturuluyor..." : "Etkinlik Oluştur"}
            </button>
          </div>

          {/* Cover Image */}
          <div className="card p-6">
            <ImageUpload value={form.coverImage} onChange={(url) => updateField("coverImage", url)} folder="events" label="Kapak Görseli" />
          </div>
        </div>
      </div>
    </div>
  );
}
