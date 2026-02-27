"use client";

import { useState } from "react";

const DEFAULT_TOPICS = [
  "Genel Bilgi Talebi",
  "Uyelik Hakkinda",
  "Bagis ve Destek",
  "Etkinlik Bilgisi",
  "Is Birligi Teklifi",
  "Sikayet ve Oneri",
  "Basin ve Medya",
  "Diger",
];

const inputClass =
  "w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

interface ContactFormProps {
  topics?: string[];
}

export default function ContactForm({ topics }: ContactFormProps) {
  const konular = topics?.length ? topics : DEFAULT_TOPICS;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    kvkk: false,
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (result) setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validasyon
    if (!form.name.trim()) {
      setResult({ success: false, message: "Ad alani zorunludur." });
      return;
    }
    if (!form.email.trim()) {
      setResult({ success: false, message: "E-posta alani zorunludur." });
      return;
    }
    if (!form.subject) {
      setResult({ success: false, message: "Lutfen bir konu seciniz." });
      return;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      setResult({ success: false, message: "Mesaj en az 10 karakter olmalidir." });
      return;
    }
    if (!form.kvkk) {
      setResult({ success: false, message: "KVKK Aydinlatma Metnini kabul etmeniz gerekmektedir." });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          subject: form.subject,
          message: form.message.trim(),
        }),
      });

      const json = await res.json();
      setResult({ success: json.success, message: json.message });

      if (json.success) {
        setForm({ name: "", email: "", phone: "", subject: "", message: "", kvkk: false });
      }
    } catch {
      setResult({ success: false, message: "Baglanti hatasi. Lutfen tekrar deneyiniz." });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Sonuc Mesaji */}
      {result && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            result.success
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {result.message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">
            Ad Soyad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Adiniz Soyadiniz"
            className={inputClass}
            disabled={sending}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">
            E-posta <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="ornek@email.com"
            className={inputClass}
            disabled={sending}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">
            Telefon
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="0 (5XX) XXX XX XX"
            className={inputClass}
            disabled={sending}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">
            Konu <span className="text-red-500">*</span>
          </label>
          <select
            value={form.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            className={inputClass}
            disabled={sending}
          >
            <option value="">Konu seciniz</option>
            {konular.map((konu) => (
              <option key={konu} value={konu}>
                {konu}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground mb-1.5 block">
          Mesajiniz <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          placeholder="Mesajinizi buraya yaziniz..."
          className={`${inputClass} resize-none`}
          disabled={sending}
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.kvkk}
          onChange={(e) => updateField("kvkk", e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary mt-0.5"
          disabled={sending}
        />
        <span className="text-sm text-muted">
          <a href="/kvkk" className="text-primary underline">
            KVKK Aydinlatma Metnini
          </a>{" "}
          okudum ve kabul ediyorum.{" "}
          <span className="text-red-500">*</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={sending}
        className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Gonderiliyor...
          </span>
        ) : (
          "Mesaj Gonder"
        )}
      </button>
    </form>
  );
}
