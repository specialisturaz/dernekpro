"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface PageItem {
  id: string;
  title: string;
  slug: string;
  template: string | null;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const templateLabels: Record<string, string> = {
  default: "Varsayilan",
  full_width: "Tam Genislik",
  sidebar: "Kenar Cubuklu",
  landing: "Landing",
};

export default function PagesListPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPages = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/admin/pages?${params}`);
      const json = await res.json();
      if (json.success) setPages(json.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const togglePublish = async (id: string, currentPublished: boolean) => {
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentPublished }),
      });
      const json = await res.json();
      if (json.success) {
        setPages((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isPublished: !currentPublished } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm("Bu sayfayi silmek istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) setPages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Sayfalar</h1>
          <p className="text-muted text-sm">CMS sayfalarini yonetin</p>
        </div>
        <button
          onClick={() => router.push("/admin/icerik/sayfalar/yeni")}
          className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Sayfa
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchPages()}
              placeholder="Sayfa basligi veya slug ara..."
              className="w-full px-4 py-2.5 pl-10 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <svg className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button onClick={fetchPages} className="btn-primary px-6 py-2.5 text-sm">
            Filtrele
          </button>
        </div>
      </div>

      {/* Pages Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-muted/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-muted mb-3">Henuz sayfa eklenmemis</p>
            <button
              onClick={() => router.push("/admin/icerik/sayfalar/yeni")}
              className="btn-primary px-5 py-2 text-sm inline-block"
            >
              Ilk Sayfayi Ekle
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-alt">
                <tr>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Baslik</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">Slug</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Sablon</th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Durum</th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Islem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-background-alt/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{page.title}</p>
                        <p className="text-xs text-muted">
                          {new Date(page.updatedAt).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted hidden md:table-cell">
                      <code className="text-xs bg-background-alt px-2 py-1 rounded">/{page.slug}</code>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted hidden lg:table-cell">
                      {page.template ? (templateLabels[page.template] || page.template) : "Varsayilan"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          page.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {page.isPublished ? "Yayinda" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/icerik/sayfalar/${page.id}`)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Duzenle
                        </button>
                        <button
                          onClick={() => togglePublish(page.id, page.isPublished)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-background-alt text-muted hover:text-foreground transition-colors"
                        >
                          {page.isPublished ? "Yayindan Kaldir" : "Yayinla"}
                        </button>
                        <button
                          onClick={() => deletePage(page.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
