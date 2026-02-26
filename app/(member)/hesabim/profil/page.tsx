"use client";

import { useState, useEffect } from "react";

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  occupation: string | null;
  education: string | null;
  photo: string | null;
  status: string;
  joinedAt: string | null;
  createdAt: string;
  memberType: { name: string } | null;
}

const genderLabels: Record<string, string> = { MALE: "Erkek", FEMALE: "Kadın" };
const statusLabels: Record<string, string> = { ACTIVE: "Aktif", PENDING: "Onay Bekliyor", PASSIVE: "Pasif", SUSPENDED: "Askıda", REJECTED: "Reddedildi" };
const statusColors: Record<string, string> = { ACTIVE: "bg-green-100 text-green-800", PENDING: "bg-yellow-100 text-yellow-800", PASSIVE: "bg-gray-100 text-gray-800", SUSPENDED: "bg-red-100 text-red-800", REJECTED: "bg-red-100 text-red-800" };

const inputClass =
  "w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

const cities = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir",
  "Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli",
  "Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari",
  "Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir",
  "Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir",
  "Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat",
  "Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman",
  "Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce",
];

export default function ProfilPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    occupation: "",
    education: "",
  });

  useEffect(() => {
    fetch("/api/member/profile")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProfile(json.data);
          setForm({
            fullName: json.data.fullName || "",
            phone: json.data.phone || "",
            address: json.data.address || "",
            city: json.data.city || "",
            occupation: json.data.occupation || "",
            education: json.data.education || "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setProfile((prev) => (prev ? { ...prev, ...json.data } : prev));
        setEditing(false);
        setMessage("Profil başarıyla güncellendi.");
      } else {
        setMessage(json.message || "Hata oluştu.");
      }
    } catch {
      setMessage("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="card p-6 h-96 animate-pulse bg-gray-100" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card p-12 text-center">
        <p className="text-muted">Profil yüklenemedi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Profilim</h1>
          <p className="text-muted text-sm">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Düzenle
          </button>
        )}
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes("başarı") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="card p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary">
              {profile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </span>
          </div>
          <h2 className="text-lg font-bold text-foreground">{profile.fullName}</h2>
          <p className="text-sm text-muted">{profile.email}</p>
          <div className="mt-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[profile.status]}`}>
              {statusLabels[profile.status]}
            </span>
          </div>
          {profile.memberType && (
            <p className="text-xs text-muted mt-2">Üyelik: {profile.memberType.name}</p>
          )}
          {profile.joinedAt && (
            <p className="text-xs text-muted mt-1">
              Üye olma: {new Date(profile.joinedAt).toLocaleDateString("tr-TR")}
            </p>
          )}
        </div>

        {/* Details / Edit Form */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-bold text-foreground mb-6">Kişisel Bilgiler</h3>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Ad Soyad</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Telefon</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className={inputClass}
                    placeholder="05xx xxx xx xx"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Şehir</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">Seçiniz</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Adres</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Meslek</label>
                  <input
                    type="text"
                    value={form.occupation}
                    onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Eğitim</label>
                  <select
                    value={form.education}
                    onChange={(e) => setForm((p) => ({ ...p, education: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">Seçiniz</option>
                    <option value="İlkokul">İlkokul</option>
                    <option value="Ortaokul">Ortaokul</option>
                    <option value="Lise">Lise</option>
                    <option value="Ön Lisans">Ön Lisans</option>
                    <option value="Lisans">Lisans</option>
                    <option value="Yüksek Lisans">Yüksek Lisans</option>
                    <option value="Doktora">Doktora</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
                >
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      fullName: profile.fullName || "",
                      phone: profile.phone || "",
                      address: profile.address || "",
                      city: profile.city || "",
                      occupation: profile.occupation || "",
                      education: profile.education || "",
                    });
                  }}
                  className="px-6 py-2.5 text-sm font-semibold rounded-lg border border-border hover:bg-background-alt transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: "E-posta", value: profile.email },
                { label: "Telefon", value: profile.phone || "-" },
                { label: "Doğum Tarihi", value: profile.birthDate ? new Date(profile.birthDate).toLocaleDateString("tr-TR") : "-" },
                { label: "Cinsiyet", value: profile.gender ? genderLabels[profile.gender] : "-" },
                { label: "Şehir", value: profile.city || "-" },
                { label: "Adres", value: profile.address || "-" },
                { label: "Meslek", value: profile.occupation || "-" },
                { label: "Eğitim", value: profile.education || "-" },
              ].map((item) => (
                <div key={item.label} className="flex items-start py-2 border-b border-border last:border-0">
                  <span className="text-sm font-semibold text-muted w-32 flex-shrink-0">{item.label}</span>
                  <span className="text-sm text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
