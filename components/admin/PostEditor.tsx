"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "./ImageUpload";
import RichEditor from "./RichEditor";

interface PostEditorProps {
  postId?: string;
  postType: "NEWS" | "ANNOUNCEMENT" | "ACTIVITY";
  backUrl: string;
  typeLabelTr: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const inputClass =
  "w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function PostEditor({ postId, postType, backUrl, typeLabelTr }: PostEditorProps) {
  const router = useRouter();
  const isEdit = !!postId;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    status: "DRAFT",
    isFeatured: false,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/admin/posts/${postId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            const p = json.data;
            setForm({
              title: p.title,
              slug: p.slug,
              excerpt: p.excerpt || "",
              content: p.content,
              coverImage: p.coverImage || "",
              status: p.status,
              isFeatured: p.isFeatured,
            });
            setAutoSlug(false);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isEdit, postId]);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && autoSlug) {
        next.slug = slugify(value as string);
      }
      return next;
    });
    if (error) setError("");
  };

  const handleSubmit = async (publishNow = false) => {
    if (!form.title || !form.content) {
      setError("Başlık ve içerik zorunludur");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      ...form,
      type: postType,
      slug: form.slug || slugify(form.title),
      status: publishNow ? "PUBLISHED" : form.status,
    };

    try {
      const url = isEdit ? `/api/admin/posts/${postId}` : "/api/admin/posts";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || "Hata oluştu");
        return;
      }

      router.push(backUrl);
    } catch {
      setError("Bağlantı hatası");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={backUrl} className="text-muted hover:text-foreground">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            {isEdit ? `${typeLabelTr} Düzenle` : `Yeni ${typeLabelTr}`}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="card p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                Başlık <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Haber başlığını girin"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                URL (Slug)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    updateField("slug", e.target.value);
                  }}
                  placeholder="otomatik-olusturulur"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                Özet
              </label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="Kısa açıklama (liste görünümünde gösterilir)"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Content */}
          <div className="card p-6">
            <label className="text-sm font-semibold text-foreground mb-1.5 block">
              İçerik <span className="text-red-500">*</span>
            </label>
            <RichEditor
              value={form.content}
              onChange={(html) => updateField("content", html)}
              placeholder="Haber içeriğini buraya yazın..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish */}
          <div className="card p-6">
            <h3 className="font-bold text-foreground mb-4">Yayın Durumu</h3>
            <div className="space-y-3">
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className={inputClass}
              >
                <option value="DRAFT">Taslak</option>
                <option value="PUBLISHED">Yayında</option>
                <option value="ARCHIVED">Arşiv</option>
              </select>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => updateField("isFeatured", e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Öne çıkan içerik</span>
              </label>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleSubmit(false)}
                disabled={saving}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg border border-border hover:bg-background-alt transition-colors disabled:opacity-50"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={saving}
                className="flex-1 btn-primary px-4 py-2.5 text-sm disabled:opacity-50"
              >
                {saving ? "..." : "Yayınla"}
              </button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="card p-6">
            <ImageUpload
              value={form.coverImage}
              onChange={(url) => updateField("coverImage", url)}
              folder="posts"
              label="Kapak Gorseli"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
