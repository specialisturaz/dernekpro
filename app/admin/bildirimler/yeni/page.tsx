"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
}

export default function NewNotificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("GENERAL");
  const [link, setLink] = useState("");
  const [isGlobal, setIsGlobal] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [emailTemplateId, setEmailTemplateId] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/admin/email-templates");
        const json = await res.json();
        if (json.success) {
          setTemplates(json.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTemplates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          type,
          link: link.trim() || null,
          isGlobal,
          sendEmail,
          emailTemplateId: sendEmail && emailTemplateId ? emailTemplateId : null,
        }),
      });

      const json = await res.json();
      if (json.success) {
        router.push("/admin/bildirimler");
      } else {
        alert(json.message || "Bir hata oluştu");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Yeni Bildirim</h1>
        <p className="text-muted text-sm">Üyelere yeni bir bildirim gönderin</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6 max-w-2xl">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Başlık <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bildirim başlığı"
            required
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Mesaj <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Bildirim mesajı"
            required
            rows={5}
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Bildirim Türü
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="GENERAL">Genel</option>
            <option value="LIVE_STREAM">Canlı Yayın</option>
            <option value="EVENT">Etkinlik</option>
            <option value="ANNOUNCEMENT">Duyuru</option>
            <option value="CAMPAIGN">Kampanya</option>
            <option value="SYSTEM">Sistem</option>
          </select>
        </div>

        {/* Link */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Bağlantı (Opsiyonel)
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://ornek.com/sayfa"
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* isGlobal Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsGlobal(!isGlobal)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              isGlobal ? "bg-primary" : "bg-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isGlobal ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-foreground">
            Tüm üyelere gönder (Global)
          </span>
        </div>

        {/* sendEmail Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSendEmail(!sendEmail)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              sendEmail ? "bg-primary" : "bg-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                sendEmail ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-foreground">
            E-posta ile de gönder
          </span>
        </div>

        {/* Email Template Selector */}
        {sendEmail && (
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              E-posta Şablonu
            </label>
            {templates.length === 0 ? (
              <p className="text-sm text-muted">
                Henüz e-posta şablonu oluşturulmamış.{" "}
                <a href="/admin/icerik/email-sablonlari/yeni" className="text-primary hover:underline">
                  Şablon oluşturun
                </a>
              </p>
            ) : (
              <select
                value={emailTemplateId}
                onChange={(e) => setEmailTemplateId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="">Şablon seçin...</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.subject}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={loading || !title.trim() || !message.trim()}
            className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Gönderiliyor..." : "Bildirim Gönder"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 text-sm rounded-[var(--border-radius)] border border-border text-muted hover:text-foreground hover:bg-background-alt transition-colors"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
