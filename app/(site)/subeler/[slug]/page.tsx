"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/site/LeafletMap"), { ssr: false });

const TYPE_LABELS: Record<string, string> = {
  MERKEZ: "Merkez",
  SUBE: "Şube",
  TEMSILCILIK: "Temsilcilik",
  IRTIBAT_BUROSU: "İrtibat Bürosu",
};

interface BranchFull {
  id: string;
  name: string;
  slug: string;
  type: string;
  phone?: string;
  email?: string;
  fax?: string;
  address?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  presidentName?: string;
  presidentPhone?: string;
  presidentEmail?: string;
  presidentPhoto?: string;
  workingHours?: Record<string, { open: string; close: string; closed?: boolean }>;
  socialMedia?: { facebook?: string; instagram?: string; twitter?: string; youtube?: string; whatsapp?: string };
  gallery?: string[];
  description?: string;
  foundedAt?: string;
  memberCount?: number;
}

const DAY_LABELS: Record<string, string> = {
  pazartesi: "Pzt",
  sali: "Sal",
  carsamba: "Çar",
  persembe: "Per",
  cuma: "Cum",
  cumartesi: "Cmt",
  pazar: "Paz",
};

export default function SubeDetayPublicPage() {
  const { slug } = useParams() as { slug: string };
  const [branch, setBranch] = useState<BranchFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [contactToast, setContactToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/branches/${slug}`);
        const json = await res.json();
        if (json.success) setBranch(json.data);
      } catch {
        // Hata
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`/api/branches/${slug}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const json = await res.json();
      if (json.success) {
        setContactToast({ type: "success", message: "Mesajınız iletildi" });
        setContactForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setContactToast({ type: "error", message: json.message || "Hata oluştu" });
      }
    } catch {
      setContactToast({ type: "error", message: "Bağlantı hatası" });
    }
    setSending(false);
    setTimeout(() => setContactToast(null), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-6">
            <div className="h-8 w-64 bg-white/20 rounded animate-pulse" />
          </div>
        </section>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted text-lg mb-4">Şube bulunamadı</p>
          <Link href="/subeler" className="text-primary font-medium hover:underline">Şubelere dön</Link>
        </div>
      </div>
    );
  }

  const hasLocation = branch.latitude && branch.longitude;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-6">
          <Link href="/subeler" className="text-white/60 hover:text-white text-sm mb-4 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Şubeler
          </Link>
          <h1 className="text-4xl font-bold font-heading mb-2">{branch.name}</h1>
          <span className="inline-block bg-white/20 text-white px-3 py-1 rounded text-sm">
            {TYPE_LABELS[branch.type]}
          </span>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sol: Iletisim + Adres + Saatler */}
            <div className="lg:col-span-2 space-y-6">
              {/* Iletisim */}
              <div className="card p-6">
                <h2 className="font-bold text-foreground text-lg mb-4">İletişim Bilgileri</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {branch.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-muted text-xs">Telefon</p>
                        <p className="font-medium text-foreground">{branch.phone}</p>
                      </div>
                    </div>
                  )}
                  {branch.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-muted text-xs">E-posta</p>
                        <p className="font-medium text-foreground">{branch.email}</p>
                      </div>
                    </div>
                  )}
                  {branch.address && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-muted text-xs">Adres</p>
                        <p className="font-medium text-foreground">
                          {branch.address}
                          {(branch.district || branch.city) && (
                            <>, {[branch.district, branch.city].filter(Boolean).join(", ")}</>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Harita */}
              {hasLocation && (
                <div className="card p-6">
                  <h2 className="font-bold text-foreground text-lg mb-4">Konum</h2>
                  <LeafletMap
                    center={[branch.latitude!, branch.longitude!]}
                    zoom={14}
                    markers={[{ position: [branch.latitude!, branch.longitude!], title: branch.name }]}
                    className="h-[350px] w-full rounded-lg"
                  />
                </div>
              )}

              {/* Aciklama */}
              {branch.description && (
                <div className="card p-6">
                  <h2 className="font-bold text-foreground text-lg mb-4">Hakkında</h2>
                  <p className="text-muted text-sm leading-relaxed whitespace-pre-wrap">{branch.description}</p>
                </div>
              )}

              {/* Galeri */}
              {branch.gallery && branch.gallery.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-bold text-foreground text-lg mb-4">Galeri</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {branch.gallery.map((url, i) => (
                      <img key={i} src={url} alt={`${branch.name} galeri ${i + 1}`} className="w-full h-40 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sag: Baskan + Saatler + Sosyal + Iletisim Formu */}
            <div className="space-y-6">
              {/* Baskan */}
              {branch.presidentName && (
                <div className="card p-6">
                  <h3 className="font-bold text-foreground mb-3">Şube Başkanı</h3>
                  <div className="flex items-center gap-3">
                    {branch.presidentPhoto ? (
                      <img src={branch.presidentPhoto} alt={branch.presidentName} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">
                          {branch.presidentName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{branch.presidentName}</p>
                      {branch.presidentPhone && <p className="text-sm text-muted">{branch.presidentPhone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Calisma Saatleri */}
              {branch.workingHours && Object.keys(branch.workingHours).length > 0 && (
                <div className="card p-6">
                  <h3 className="font-bold text-foreground mb-3">Çalışma Saatleri</h3>
                  <div className="space-y-2">
                    {Object.entries(branch.workingHours).map(([day, wh]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{DAY_LABELS[day] || day}</span>
                        <span className="text-muted">
                          {wh.closed ? "Kapalı" : `${wh.open} - ${wh.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sosyal Medya */}
              {branch.socialMedia && Object.values(branch.socialMedia).some(Boolean) && (
                <div className="card p-6">
                  <h3 className="font-bold text-foreground mb-3">Sosyal Medya</h3>
                  <div className="flex gap-3">
                    {branch.socialMedia.facebook && (
                      <a href={branch.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:opacity-80 text-sm font-bold">f</a>
                    )}
                    {branch.socialMedia.instagram && (
                      <a href={branch.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:opacity-80 text-sm font-bold">ig</a>
                    )}
                    {branch.socialMedia.twitter && (
                      <a href={branch.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:opacity-80 text-sm font-bold">X</a>
                    )}
                    {branch.socialMedia.youtube && (
                      <a href={branch.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center hover:opacity-80 text-sm font-bold">YT</a>
                    )}
                  </div>
                </div>
              )}

              {/* Iletisim Formu */}
              <div className="card p-6">
                <h3 className="font-bold text-foreground mb-4">Mesaj Gönderin</h3>
                {contactToast && (
                  <div className={`p-3 rounded-lg text-sm mb-4 ${contactToast.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {contactToast.message}
                  </div>
                )}
                <form onSubmit={handleContact} className="space-y-3">
                  <input type="text" required value={contactForm.name} onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))} placeholder="Adınız *" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="email" required value={contactForm.email} onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))} placeholder="E-posta *" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="tel" value={contactForm.phone} onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Telefon" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="text" required value={contactForm.subject} onChange={(e) => setContactForm((p) => ({ ...p, subject: e.target.value }))} placeholder="Konu *" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <textarea required value={contactForm.message} onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))} placeholder="Mesajınız *" rows={4} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
                  <button type="submit" disabled={sending} className="w-full btn-primary py-2.5 text-sm disabled:opacity-50">
                    {sending ? "Gönderiliyor..." : "Gönder"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
