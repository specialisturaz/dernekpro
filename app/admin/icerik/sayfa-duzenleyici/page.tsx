"use client";

import { useState, useEffect, useCallback } from "react";
import PageBuilder from "@/components/admin/PageBuilder";
import RichEditor from "@/components/admin/RichEditor";
import type { PageSection } from "@/types/page-builder";
import { DEFAULT_HOMEPAGE_SECTIONS } from "@/types/page-builder";

interface PageListItem {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  order: number;
}

interface PageDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string | null;
  metaDesc: string | null;
  isPublished: boolean;
  order: number;
  customCss: string | null;
  sections: PageSection[] | null;
}

type EditorMode = "visual" | "html" | "builder";

function slugify(text: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u" };
  return text.split("").map((ch) => map[ch] || ch).join("").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function SayfaDuzenleyiciPage() {
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [pageDetail, setPageDetail] = useState<PageDetail | null>(null);

  // Editor states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [customCss, setCustomCss] = useState("");
  const [sections, setSections] = useState<PageSection[]>([]);
  const [editorMode, setEditorMode] = useState<EditorMode>("visual");

  // UI states
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Load page list
  const loadPages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (data.success && data.data) {
        const pageList: PageListItem[] = Array.isArray(data.data) ? data.data : data.data.pages || [];
        setPages(pageList);
        // Auto-select homepage
        const homepage = pageList.find((p) => p.slug === "anasayfa");
        if (homepage) {
          fetchPageDetail(homepage.id);
        } else if (pageList.length > 0) {
          fetchPageDetail(pageList[0].id);
        }
      }
    } catch {
      setPages([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  // Fetch full page data
  const fetchPageDetail = async (pageId: string) => {
    setSelectedPageId(pageId);
    setLoadingPage(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`);
      const data = await res.json();
      if (data.success && data.data) {
        const page = data.data as PageDetail;
        setPageDetail(page);
        applyPageData(page);
      }
    } catch {
      showToast("error", "Sayfa verisi yüklenemedi");
    }
    setLoadingPage(false);
  };

  // Apply page data to editor state
  const applyPageData = (page: PageDetail) => {
    setTitle(page.title || "");
    setSlug(page.slug || "");
    setContent(page.content || "");
    setMetaTitle(page.metaTitle || "");
    setMetaDesc(page.metaDesc || "");
    setIsPublished(page.isPublished);
    setCustomCss(page.customCss || "");

    const hasSections = page.sections && Array.isArray(page.sections) && page.sections.length > 0;

    if (page.slug === "anasayfa") {
      setSections((page.sections as PageSection[]) || DEFAULT_HOMEPAGE_SECTIONS);
      setEditorMode("builder");
    } else if (hasSections) {
      setSections(page.sections as PageSection[]);
      setEditorMode("builder");
    } else {
      setSections([]);
      setEditorMode("visual");
    }
  };

  const handlePageChange = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (page) fetchPageDetail(page.id);
  };

  const selectedPage = pages.find((p) => p.id === selectedPageId);
  const isHomepage = selectedPage?.slug === "anasayfa";

  // Save page
  const handleSave = async () => {
    if (!selectedPageId) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        title,
        slug,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
        isPublished,
        customCss: customCss || null,
      };

      if (editorMode === "builder") {
        body.sections = sections;
      } else {
        body.content = content;
      }

      const res = await fetch(`/api/admin/pages/${selectedPageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        // Update pages list with new title/slug/status
        setPages((prev) =>
          prev.map((p) =>
            p.id === selectedPageId ? { ...p, title, slug, isPublished } : p
          )
        );
        setPageDetail(data.data);
        showToast("success", "Sayfa başarıyla kaydedildi");
      } else {
        showToast("error", data.message || "Hata oluştu");
      }
    } catch {
      showToast("error", "Bağlantı hatası");
    }
    setSaving(false);
  };

  // Delete page
  const handleDelete = async () => {
    if (!selectedPageId || isHomepage) return;
    if (!confirm(`"${title}" sayfasını silmek istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/admin/pages/${selectedPageId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Sayfa silindi");
        setPages((prev) => prev.filter((p) => p.id !== selectedPageId));
        setSelectedPageId(null);
        setPageDetail(null);
        // Select first remaining page
        const remaining = pages.filter((p) => p.id !== selectedPageId);
        if (remaining.length > 0) {
          fetchPageDetail(remaining[0].id);
        }
      } else {
        showToast("error", data.message || "Silinemedi");
      }
    } catch {
      showToast("error", "Bağlantı hatası");
    }
  };

  // Create new page
  const handleCreatePage = async () => {
    if (!newPageTitle.trim()) return;
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPageTitle.trim(),
          content: `<h2>${newPageTitle.trim()}</h2><p>Sayfa içeriğini buraya yazın...</p>`,
          isPublished: false,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        showToast("success", "Yeni sayfa oluşturuldu");
        setShowNewPageModal(false);
        setNewPageTitle("");
        // Add to list and select it
        const newPage: PageListItem = {
          id: data.data.id,
          title: data.data.title,
          slug: data.data.slug,
          isPublished: data.data.isPublished,
          order: data.data.order,
        };
        setPages((prev) => [...prev, newPage]);
        fetchPageDetail(data.data.id);
      } else {
        showToast("error", data.message || "Oluşturulamadı");
      }
    } catch {
      showToast("error", "Bağlantı hatası");
    }
  };

  // Reset to original
  const handleReset = () => {
    if (!pageDetail) return;
    if (confirm("Değişiklikleri geri almak istediğinize emin misiniz?")) {
      applyPageData(pageDetail);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="card p-6 h-96 animate-pulse bg-gray-100" />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Sayfa Yönetimi</h1>
          <p className="text-muted text-sm">Tüm sayfalarınızı buradan yönetin ve düzenleyin</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewPageModal(true)}
            className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            + Yeni Sayfa
          </button>
          <button
            onClick={handleReset}
            disabled={!selectedPageId || loadingPage}
            className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground border border-border rounded-lg transition-colors disabled:opacity-50"
          >
            Geri Al
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedPageId || loadingPage}
            className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      {/* Page Selector Bar */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Page dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-foreground mb-1.5">Düzenlenecek Sayfa</label>
            <select
              value={selectedPageId || ""}
              onChange={(e) => handlePageChange(e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>Sayfa seçin...</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (/{p.slug}){!p.isPublished ? " — Taslak" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Quick actions */}
          {selectedPage && !loadingPage && (
            <>
              {/* Publish toggle */}
              <button
                onClick={() => setIsPublished(!isPublished)}
                className={`px-4 py-2.5 text-sm font-medium rounded-[var(--border-radius)] border transition-colors ${
                  isPublished
                    ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    : "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                }`}
              >
                {isPublished ? "Yayında" : "Taslak"}
              </button>

              {/* Settings toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`px-4 py-2.5 text-sm font-medium rounded-[var(--border-radius)] border border-border transition-colors ${
                  showSettings ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-background-alt"
                }`}
                title="Sayfa Ayarları"
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ayarlar
              </button>

              {/* View page */}
              <a
                href={selectedPage.slug === "anasayfa" ? "/" : `/${selectedPage.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-sm font-medium rounded-[var(--border-radius)] border border-border text-muted hover:text-foreground hover:bg-background-alt transition-colors"
              >
                Sayfayı Gör →
              </a>

              {/* Delete */}
              {!isHomepage && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2.5 text-sm font-medium rounded-[var(--border-radius)] bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
                >
                  Sil
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Page Settings Panel (collapsible) */}
      {showSettings && selectedPage && !loadingPage && (
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Sayfa Ayarları</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Sayfa Başlığı</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!isHomepage && pageDetail && slug === pageDetail.slug) {
                    setSlug(slugify(e.target.value));
                  }
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-muted text-sm">/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={isHomepage}
                  className={`${inputClass} ${isHomepage ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Meta Başlık (SEO)</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Arama motorları için başlık"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Meta Açıklama (SEO)</label>
              <input
                type="text"
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="Arama motorları için açıklama"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Özel CSS</label>
            <textarea
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
              rows={4}
              placeholder=".custom-class { color: red; }"
              className={`${inputClass} font-mono resize-y`}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`p-3 rounded-lg text-sm ${
          toast.type === "success"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Loading state */}
      {loadingPage ? (
        <div className="card p-12 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : selectedPage ? (
        <>
          {/* Editor Mode Toggle (non-homepage) */}
          {!isHomepage && (
            <div className="flex items-center gap-1 bg-background rounded-lg p-1 border border-border w-fit">
              <button
                type="button"
                onClick={() => setEditorMode("visual")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  editorMode === "visual" ? "bg-primary text-white" : "text-muted hover:text-foreground"
                }`}
              >
                Görsel Editör
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("html")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  editorMode === "html" ? "bg-primary text-white" : "text-muted hover:text-foreground"
                }`}
              >
                HTML Editör
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditorMode("builder");
                  if (sections.length === 0) {
                    setSections([
                      { id: `section-text-${Date.now()}`, type: "text", visible: true, order: 0, config: {} },
                    ]);
                  }
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  editorMode === "builder" ? "bg-primary text-white" : "text-muted hover:text-foreground"
                }`}
              >
                Bölüm Düzenleyici
              </button>
            </div>
          )}

          {/* Editor Content */}
          {editorMode === "builder" ? (
            <PageBuilder
              sections={sections}
              onChange={setSections}
              customCss={customCss}
              onCustomCssChange={setCustomCss}
            />
          ) : editorMode === "html" ? (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* HTML Source */}
              <div className="card p-6">
                <label className="block text-sm font-bold text-foreground mb-3">HTML Kaynak Kodu</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={30}
                  className={`${inputClass} font-mono text-xs resize-y`}
                  placeholder="<h2>Başlık</h2>\n<p>İçerik...</p>"
                />
              </div>
              {/* Live Preview */}
              <div className="card overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-background-alt">
                  <h3 className="text-sm font-bold text-foreground">Canlı Önizleme</h3>
                </div>
                <div className="p-6 bg-white">
                  {content.trim() ? (
                    <div
                      className="prose prose-lg max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <p className="text-muted text-sm text-center py-10">HTML içerik yazdığınızda önizleme burada görünecek</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Visual RichEditor */
            <div className="card p-6">
              <label className="block text-sm font-bold text-foreground mb-3">Sayfa İçeriği</label>
              <RichEditor
                value={content}
                onChange={setContent}
                placeholder="Sayfa içeriğini yazın..."
              />
            </div>
          )}
        </>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-muted">Düzenlemek istediğiniz sayfayı yukarıdan seçin veya yeni bir sayfa oluşturun.</p>
        </div>
      )}

      {/* New Page Modal */}
      {showNewPageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-foreground">Yeni Sayfa Oluştur</h3>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Sayfa Başlığı</label>
              <input
                type="text"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="Örn: Projelerimiz"
                className={inputClass}
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleCreatePage(); }}
              />
              {newPageTitle.trim() && (
                <p className="text-xs text-muted mt-1">URL: /{slugify(newPageTitle)}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setShowNewPageModal(false); setNewPageTitle(""); }}
                className="px-4 py-2 text-sm rounded-[var(--border-radius)] border border-border text-muted hover:text-foreground transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreatePage}
                disabled={!newPageTitle.trim()}
                className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
