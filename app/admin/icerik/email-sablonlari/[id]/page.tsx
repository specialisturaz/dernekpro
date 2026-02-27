"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditEmailTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [variablesInput, setVariablesInput] = useState("");
  const [previewTab, setPreviewTab] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/admin/email-templates/${id}`);
        const json = await res.json();
        if (json.success) {
          const t = json.data;
          setName(t.name);
          setSubject(t.subject);
          setHtmlContent(t.htmlContent);
          setVariablesInput((t.variables || []).join(", "));
          setIsDefault(t.isDefault);
        } else {
          alert("Şablon bulunamadı");
          router.push("/admin/icerik/email-sablonlari");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id, router]);

  // Replace template variables with sample data for preview
  const previewHtml = useMemo(() => {
    const sampleData: Record<string, string> = {
      fullName: "Ahmet Yılmaz",
      title: "Örnek Başlık",
      message: "Bu bir örnek mesaj içeriğidir.",
      link: "https://dernekpro.com",
      email: "ornek@dernekpro.com",
      date: new Date().toLocaleDateString("tr-TR"),
      amount: "500 TL",
      eventName: "Örnek Etkinlik",
      tenantName: "DernekPro Demo Derneği",
    };

    let html = htmlContent;
    for (const [key, value] of Object.entries(sampleData)) {
      html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    }
    // Replace any remaining {{...}} with placeholder
    html = html.replace(/\{\{(\w+)\}\}/g, "[$1]");
    return html;
  }, [htmlContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim() || !htmlContent.trim()) return;

    setSaving(true);
    try {
      const variables = variablesInput
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      const res = await fetch(`/api/admin/email-templates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          subject: subject.trim(),
          htmlContent,
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
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isDefault) {
      alert("Varsayılan şablonlar silinemez");
      return;
    }
    if (!confirm("Bu şablonu silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/email-templates/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        router.push("/admin/icerik/email-sablonlari");
      } else {
        alert(json.message || "Silinemedi");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Şablon Düzenle</h1>
          <p className="text-muted text-sm">E-posta şablonunu güncelleyin — sağ tarafta canlı önizleme</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDefault}
          className="px-5 py-2.5 text-sm rounded-[var(--border-radius)] bg-red-100 text-red-700 hover:bg-red-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={isDefault ? "Varsayılan şablonlar silinemez" : "Şablonu sil"}
        >
          Şablonu Sil
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Editor */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          {isDefault && (
            <div className="bg-blue-50 border border-blue-200 rounded-[var(--border-radius)] p-4">
              <p className="text-sm text-blue-800 font-medium">
                Bu varsayılan bir şablondur. Düzenleyebilirsiniz ancak silemezsiniz.
              </p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Şablon Adı (slug) <span className="text-red-500">*</span>
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="bildirim-sablonu" required className={inputClass} />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              E-posta Konusu <span className="text-red-500">*</span>
            </label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="{{title}} - DernekPro Bildirim" required className={inputClass} />
          </div>

          {/* Variables */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Değişkenler (Virgülle ayrılmış)
            </label>
            <input type="text" value={variablesInput} onChange={(e) => setVariablesInput(e.target.value)} placeholder="fullName, title, message, link" className={inputClass} />
            <p className="text-xs text-muted mt-1">
              Kullanım: {"{{değişkenAdı}}"} — Önizlemede örnek verilerle doldurulur
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
              required
              rows={20}
              className={`${inputClass} font-mono resize-y`}
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={saving || !name.trim() || !subject.trim() || !htmlContent.trim()}
              className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
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

        {/* Right: Live Preview */}
        <div className="space-y-4">
          <div className="card overflow-hidden">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background-alt">
              <h3 className="text-sm font-bold text-foreground">Canlı Önizleme</h3>
              <div className="flex items-center gap-1 bg-background rounded-lg p-0.5 border border-border">
                <button
                  type="button"
                  onClick={() => setPreviewTab("desktop")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewTab === "desktop"
                      ? "bg-primary text-white"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Masaüstü
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("mobile")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewTab === "mobile"
                      ? "bg-primary text-white"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Mobil
                </button>
              </div>
            </div>

            {/* Subject Preview */}
            <div className="px-4 py-2 border-b border-border bg-background">
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="font-semibold">Konu:</span>
                <span className="text-foreground">{subject || "—"}</span>
              </div>
            </div>

            {/* HTML Preview */}
            <div className={`bg-white flex justify-center ${previewTab === "mobile" ? "p-4" : ""}`}>
              <div
                className={`transition-all duration-300 ${
                  previewTab === "mobile" ? "w-[375px] border border-gray-200 rounded-xl shadow-lg" : "w-full"
                }`}
              >
                {htmlContent.trim() ? (
                  <iframe
                    srcDoc={previewHtml}
                    title="E-posta Önizleme"
                    className="w-full border-0"
                    style={{ minHeight: previewTab === "mobile" ? "500px" : "600px" }}
                    sandbox="allow-same-origin"
                  />
                ) : (
                  <div className="flex items-center justify-center py-20 text-muted text-sm">
                    HTML içerik yazdığınızda önizleme burada görünecek
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Variables Reference */}
          {variablesInput.trim() && (
            <div className="card p-4">
              <h4 className="text-sm font-bold text-foreground mb-2">Kullanılabilir Değişkenler</h4>
              <div className="flex flex-wrap gap-2">
                {variablesInput
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean)
                  .map((v) => (
                    <code
                      key={v}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md font-mono cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(`{{${v}}}`);
                      }}
                      title="Kopyalamak için tıklayın"
                    >
                      {`{{${v}}}`}
                    </code>
                  ))}
              </div>
              <p className="text-xs text-muted mt-2">Kopyalamak için değişkene tıklayın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
