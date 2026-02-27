"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEmailTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [variablesInput, setVariablesInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim() || !htmlContent.trim()) return;

    setLoading(true);
    try {
      const variables = variablesInput
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          subject: subject.trim(),
          htmlContent: htmlContent,
          variables,
        }),
      });

      const json = await res.json();
      if (json.success) {
        router.push("/admin/icerik/email-sablonlari");
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
        <h1 className="text-2xl font-bold font-heading text-foreground">Yeni E-posta Şablonu</h1>
        <p className="text-muted text-sm">Bildirim e-postaları için yeni bir şablon oluşturun</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6 max-w-3xl">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Şablon Adı (slug) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="bildirim-sablonu"
            required
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <p className="text-xs text-muted mt-1">Benzersiz bir isim girin (ör: genel-bildirim, etkinlik-davet)</p>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            E-posta Konusu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="{{title}} - DernekPro Bildirim"
            required
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <p className="text-xs text-muted mt-1">Değişkenler için {`{{degisken}}`} formatını kullanın</p>
        </div>

        {/* Variables */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Değişkenler (Virgülle ayrılmış)
          </label>
          <input
            type="text"
            value={variablesInput}
            onChange={(e) => setVariablesInput(e.target.value)}
            placeholder="fullName, title, message, link"
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <p className="text-xs text-muted mt-1">
            Şablonda kullanılabilecek değişkenler. Varsayılan: fullName, title, message, link
          </p>
        </div>

        {/* HTML Content */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            HTML İçerik <span className="text-red-500">*</span>
          </label>
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            placeholder={`<html>\n<body>\n  <h1>Merhaba {{fullName}},</h1>\n  <p>{{message}}</p>\n  <a href="{{link}}">Detaylar</a>\n</body>\n</html>`}
            required
            rows={16}
            className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
          />
          <p className="text-xs text-muted mt-1">
            E-posta HTML şablonu. Değişkenler için {`{{degisken}}`} formatını kullanın.
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={loading || !name.trim() || !subject.trim() || !htmlContent.trim()}
            className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Oluşturuluyor..." : "Şablon Oluştur"}
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
