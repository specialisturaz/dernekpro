"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

type TabKey = "genel" | "iletisim" | "adres" | "baskan" | "saatler" | "detay";

const TABS: { key: TabKey; label: string }[] = [
  { key: "genel", label: "Genel Bilgiler" },
  { key: "iletisim", label: "İletişim" },
  { key: "adres", label: "Adres & Konum" },
  { key: "baskan", label: "Başkan Bilgileri" },
  { key: "saatler", label: "Saatler & Sosyal" },
  { key: "detay", label: "Açıklama & Galeri" },
];

const DAYS = [
  { key: "pazartesi", label: "Pazartesi" },
  { key: "sali", label: "Salı" },
  { key: "carsamba", label: "Çarşamba" },
  { key: "persembe", label: "Perşembe" },
  { key: "cuma", label: "Cuma" },
  { key: "cumartesi", label: "Cumartesi" },
  { key: "pazar", label: "Pazar" },
];

interface BranchEditorProps {
  mode: "create" | "edit";
  branchId?: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BranchEditor({ mode, branchId }: BranchEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("genel");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    slug: "",
    code: "",
    type: "SUBE" as string,
    status: "ACTIVE" as string,
    phone: "",
    email: "",
    fax: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    latitude: "" as string | number,
    longitude: "" as string | number,
    presidentName: "",
    presidentPhone: "",
    presidentEmail: "",
    presidentPhoto: "",
    workingHours: {} as Record<string, { open: string; close: string; closed?: boolean }>,
    socialMedia: { facebook: "", instagram: "", twitter: "", youtube: "", whatsapp: "" },
    gallery: [] as string[],
    description: "",
    foundedAt: "",
    memberCount: 0,
    order: 0,
  });

  const [autoSlug, setAutoSlug] = useState(true);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  // Edit modunda veri yukle
  useEffect(() => {
    if (mode === "edit" && branchId) {
      const load = async () => {
        try {
          const res = await fetch(`/api/admin/branches/${branchId}`);
          const json = await res.json();
          if (json.success) {
            const d = json.data;
            setForm({
              name: d.name || "",
              slug: d.slug || "",
              code: d.code || "",
              type: d.type || "SUBE",
              status: d.status || "ACTIVE",
              phone: d.phone || "",
              email: d.email || "",
              fax: d.fax || "",
              address: d.address || "",
              city: d.city || "",
              district: d.district || "",
              postalCode: d.postalCode || "",
              latitude: d.latitude ?? "",
              longitude: d.longitude ?? "",
              presidentName: d.presidentName || "",
              presidentPhone: d.presidentPhone || "",
              presidentEmail: d.presidentEmail || "",
              presidentPhoto: d.presidentPhoto || "",
              workingHours: d.workingHours || {},
              socialMedia: d.socialMedia || { facebook: "", instagram: "", twitter: "", youtube: "", whatsapp: "" },
              gallery: d.gallery || [],
              description: d.description || "",
              foundedAt: d.foundedAt ? d.foundedAt.split("T")[0] : "",
              memberCount: d.memberCount || 0,
              order: d.order || 0,
            });
            setAutoSlug(false);
          }
        } catch {
          // Hata
        }
        setLoading(false);
      };
      load();
    }
  }, [mode, branchId]);

  const updateField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "name" && autoSlug) {
      setForm((prev) => ({ ...prev, name: value as string, slug: slugify(value as string) }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      latitude: form.latitude !== "" ? Number(form.latitude) : null,
      longitude: form.longitude !== "" ? Number(form.longitude) : null,
    };

    try {
      const url = mode === "edit" ? `/api/admin/branches/${branchId}` : "/api/admin/branches";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: mode === "edit" ? "Şube güncellendi" : "Şube oluşturuldu" });
        if (mode === "create" && json.data?.id) {
          setTimeout(() => router.push(`/admin/subeler/${json.data.id}`), 1000);
        }
      } else {
        setToast({ type: "error", message: json.message || "Hata oluştu" });
      }
    } catch {
      setToast({ type: "error", message: "Bağlantı hatası" });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="card p-6 h-96 animate-pulse bg-gray-100" />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
  const labelClass = "text-sm font-semibold text-foreground mb-1.5 block";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/subeler")} className="text-muted hover:text-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            {mode === "edit" ? "Şube Düzenle" : "Yeni Şube"}
          </h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary px-6 py-2 text-sm disabled:opacity-50">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`p-3 rounded-lg text-sm ${toast.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          {toast.message}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="card p-6">
        {/* Genel Bilgiler */}
        {activeTab === "genel" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Şube Adı *</label>
              <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} className={inputClass} placeholder="İstanbul Şubesi" />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => { setAutoSlug(false); updateField("slug", e.target.value); }}
                className={inputClass}
                placeholder="istanbul-subesi"
              />
            </div>
            <div>
              <label className={labelClass}>Şube Kodu</label>
              <input type="text" value={form.code} onChange={(e) => updateField("code", e.target.value)} className={inputClass} placeholder="IST-001" />
            </div>
            <div>
              <label className={labelClass}>Tür *</label>
              <select value={form.type} onChange={(e) => updateField("type", e.target.value)} className={inputClass}>
                <option value="MERKEZ">Merkez</option>
                <option value="SUBE">Şube</option>
                <option value="TEMSILCILIK">Temsilcilik</option>
                <option value="IRTIBAT_BUROSU">İrtibat Bürosu</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Durum</label>
              <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className={inputClass}>
                <option value="ACTIVE">Aktif</option>
                <option value="PASSIVE">Pasif</option>
                <option value="CLOSED">Kapalı</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Kuruluş Tarihi</label>
              <input type="date" value={form.foundedAt} onChange={(e) => updateField("foundedAt", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Üye Sayısı</label>
              <input type="number" value={form.memberCount} onChange={(e) => updateField("memberCount", parseInt(e.target.value) || 0)} className={inputClass} min={0} />
            </div>
            <div>
              <label className={labelClass}>Sıralama</label>
              <input type="number" value={form.order} onChange={(e) => updateField("order", parseInt(e.target.value) || 0)} className={inputClass} min={0} />
            </div>
          </div>
        )}

        {/* Iletisim */}
        {activeTab === "iletisim" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Telefon</label>
              <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} placeholder="+90 (212) 000 00 00" />
            </div>
            <div>
              <label className={labelClass}>E-posta</label>
              <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} placeholder="istanbul@dernek.org" />
            </div>
            <div>
              <label className={labelClass}>Fax</label>
              <input type="tel" value={form.fax} onChange={(e) => updateField("fax", e.target.value)} className={inputClass} placeholder="+90 (212) 000 00 01" />
            </div>
          </div>
        )}

        {/* Adres & Konum */}
        {activeTab === "adres" && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Adres</label>
              <textarea value={form.address} onChange={(e) => updateField("address", e.target.value)} className={inputClass} rows={3} placeholder="Sokak, Cadde, Mahalle..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Şehir</label>
                <input type="text" value={form.city} onChange={(e) => updateField("city", e.target.value)} className={inputClass} placeholder="İstanbul" />
              </div>
              <div>
                <label className={labelClass}>İlçe</label>
                <input type="text" value={form.district} onChange={(e) => updateField("district", e.target.value)} className={inputClass} placeholder="Kadıköy" />
              </div>
              <div>
                <label className={labelClass}>Posta Kodu</label>
                <input type="text" value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} className={inputClass} placeholder="34700" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Enlem (Latitude)</label>
                <input type="number" step="any" value={form.latitude} onChange={(e) => updateField("latitude", e.target.value)} className={inputClass} placeholder="41.0082" />
              </div>
              <div>
                <label className={labelClass}>Boylam (Longitude)</label>
                <input type="number" step="any" value={form.longitude} onChange={(e) => updateField("longitude", e.target.value)} className={inputClass} placeholder="28.9784" />
              </div>
            </div>
          </div>
        )}

        {/* Baskan Bilgileri */}
        {activeTab === "baskan" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Başkan Adı</label>
              <input type="text" value={form.presidentName} onChange={(e) => updateField("presidentName", e.target.value)} className={inputClass} placeholder="Ahmet Yılmaz" />
            </div>
            <div>
              <label className={labelClass}>Başkan Telefon</label>
              <input type="tel" value={form.presidentPhone} onChange={(e) => updateField("presidentPhone", e.target.value)} className={inputClass} placeholder="+90 (532) 000 00 00" />
            </div>
            <div>
              <label className={labelClass}>Başkan E-posta</label>
              <input type="email" value={form.presidentEmail} onChange={(e) => updateField("presidentEmail", e.target.value)} className={inputClass} placeholder="baskan@dernek.org" />
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                value={form.presidentPhoto}
                onChange={(url) => updateField("presidentPhoto", url)}
                folder="branches"
                label="Başkan Fotoğrafı"
              />
            </div>
          </div>
        )}

        {/* Saatler & Sosyal Medya */}
        {activeTab === "saatler" && (
          <div className="space-y-8">
            {/* Calisma Saatleri */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Çalışma Saatleri</h3>
              <div className="space-y-3">
                {DAYS.map((day) => {
                  const wh = form.workingHours[day.key] || { open: "09:00", close: "17:00", closed: false };
                  return (
                    <div key={day.key} className="flex items-center gap-3">
                      <span className="w-24 text-sm font-medium text-foreground">{day.label}</span>
                      <label className="flex items-center gap-1.5 text-sm text-muted cursor-pointer">
                        <input
                          type="checkbox"
                          checked={wh.closed || false}
                          onChange={(e) => {
                            const updated = { ...form.workingHours, [day.key]: { ...wh, closed: e.target.checked } };
                            updateField("workingHours", updated);
                          }}
                          className="rounded"
                        />
                        Kapalı
                      </label>
                      {!wh.closed && (
                        <>
                          <input
                            type="time"
                            value={wh.open}
                            onChange={(e) => {
                              const updated = { ...form.workingHours, [day.key]: { ...wh, open: e.target.value } };
                              updateField("workingHours", updated);
                            }}
                            className="px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm"
                          />
                          <span className="text-muted text-sm">—</span>
                          <input
                            type="time"
                            value={wh.close}
                            onChange={(e) => {
                              const updated = { ...form.workingHours, [day.key]: { ...wh, close: e.target.value } };
                              updateField("workingHours", updated);
                            }}
                            className="px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm"
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sosyal Medya */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Sosyal Medya</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(["facebook", "instagram", "twitter", "youtube", "whatsapp"] as const).map((key) => (
                  <div key={key}>
                    <label className={labelClass}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      type="text"
                      value={form.socialMedia[key] || ""}
                      onChange={(e) => updateField("socialMedia", { ...form.socialMedia, [key]: e.target.value })}
                      className={inputClass}
                      placeholder={key === "whatsapp" ? "+90 532 000 00 00" : `https://${key}.com/...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aciklama & Galeri */}
        {activeTab === "detay" && (
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Açıklama</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className={inputClass}
                rows={6}
                placeholder="Şube hakkında detaylı bilgi..."
              />
            </div>

            <div>
              <label className={labelClass}>Galeri</label>
              {/* Gorsel yukle */}
              <div className="mb-3">
                <ImageUpload
                  value=""
                  onChange={(url) => {
                    if (url) updateField("gallery", [...form.gallery, url]);
                  }}
                  folder="branches/gallery"
                  label=""
                />
              </div>
              {/* veya URL ile ekle */}
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="veya URL yapistir..."
                />
                <button
                  onClick={() => {
                    if (newGalleryUrl.trim()) {
                      updateField("gallery", [...form.gallery, newGalleryUrl.trim()]);
                      setNewGalleryUrl("");
                    }
                  }}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Ekle
                </button>
              </div>
              {form.gallery.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {form.gallery.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`Galeri ${i + 1}`} className="w-full h-24 object-cover rounded-lg border border-border" />
                      <button
                        onClick={() => {
                          const updated = form.gallery.filter((_, idx) => idx !== i);
                          updateField("gallery", updated);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
