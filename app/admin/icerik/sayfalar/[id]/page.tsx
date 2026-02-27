"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import RichEditor from "@/components/admin/RichEditor";

function generateSlug(title: string): string {
  const turkishMap: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return title
    .split("")
    .map((ch) => turkishMap[ch] || ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string | null;
  metaDesc: string | null;
  isPublished: boolean;
  customCss: string | null;
  sections: unknown | null;
}

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [customCss, setCustomCss] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`);
      const json = await res.json();
      if (json.success) {
        const p: PageData = json.data;
        setTitle(p.title);
        setSlug(p.slug);
        setContent(p.content);
        setMetaTitle(p.metaTitle || "");
        setMetaDesc(p.metaDesc || "");
        setIsPublished(p.isPublished);
        setCustomCss(p.customCss || "");
      } else {
        showToast("error", "Sayfa bulunamadi");
        setTimeout(() => router.push("/admin/icerik/sayfalar"), 1000);
      }
    } catch {
      showToast("error", "Sayfa yuklenirken hata olustu");
    } finally {
      setLoading(false);
    }
  }, [pageId, router, showToast]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      showToast("error", "Baslik ve icerik alanlari zorunludur");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          metaTitle: metaTitle || null,
          metaDesc: metaDesc || null,
          isPublished,
          customCss: customCss || null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", "Sayfa basariyla guncellendi");
      } else {
        showToast("error", json.message || "Sayfa guncellenirken hata olustu");
      }
    } catch {
      showToast("error", "Sayfa guncellenirken hata olustu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu sayfayi silmek istediginize emin misiniz? Bu islem geri alinamaz.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", "Sayfa basariyla silindi");
        setTimeout(() => router.push("/admin/icerik/sayfalar"), 500);
      } else {
        showToast("error", json.message || "Sayfa silinirken hata olustu");
      }
    } catch {
      showToast("error", "Sayfa silinirken hata olustu");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Sayfa Duzenle</h1>
          <p className="text-muted text-sm">Sayfa bilgilerini guncelleyin</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2.5 text-sm rounded-[var(--border-radius)] bg-red-100 text-red-700 hover:bg-red-200 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {deleting ? "Siliniyor..." : "Sil"}
          </button>
          <button
            onClick={() => router.push("/admin/icerik/sayfalar")}
            className="px-5 py-2.5 text-sm rounded-[var(--border-radius)] border border-border text-muted hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Geri Don
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground">Sayfa Bilgileri</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Baslik <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Sayfa basligi..."
              className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-muted text-sm">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="sayfa-slug"
                className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <p className="text-xs text-muted mt-1">Slug otomatik olusturulur, isterseniz degistirebilirsiniz</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Icerik <span className="text-red-500">*</span>
            </label>
            <RichEditor
              value={content}
              onChange={setContent}
              placeholder="Sayfa içeriğini buraya yazın..."
            />
          </div>

          {/* isPublished Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublished ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublished ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-foreground">
              {isPublished ? "Yayinda" : "Taslak"}
            </span>
          </div>
        </div>

        {/* SEO */}
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground">SEO Ayarlari</h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Meta Baslik</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Meta baslik (bos birakilirsa sayfa basligi kullanilir)"
              className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Meta Aciklama</label>
            <textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              placeholder="Meta aciklama (SEO icin kisa bir aciklama)"
              rows={3}
              className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
            />
          </div>
        </div>

        {/* Custom CSS */}
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground">Ozel CSS</h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Custom CSS</label>
            <textarea
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
              placeholder="/* Bu sayfaya ozel CSS kodlari */"
              rows={5}
              className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || !title.trim() || !content.trim()}
            className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Degisiklikleri Kaydet"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/icerik/sayfalar")}
            className="px-6 py-2.5 text-sm rounded-[var(--border-radius)] border border-border text-muted hover:text-foreground transition-colors"
          >
            Iptal
          </button>
        </div>
      </form>
    </div>
  );
}
