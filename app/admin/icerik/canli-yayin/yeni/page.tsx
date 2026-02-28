"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewLiveStreamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notifyUsers, setNotifyUsers] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Baslik zorunludur");
      return;
    }
    if (!youtubeUrl.trim()) {
      setError("YouTube URL zorunludur");
      return;
    }
    if (!scheduledAt) {
      setError("Planlanan tarih zorunludur");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/livestreams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          youtubeUrl: youtubeUrl.trim(),
          thumbnailUrl: thumbnailUrl.trim() || null,
          scheduledAt: new Date(scheduledAt).toISOString(),
          notifyUsers,
        }),
      });

      const json = await res.json();
      if (json.success) {
        router.push("/admin/icerik/canli-yayin");
      } else {
        setError(json.message || "Bir hata olustu");
      }
    } catch {
      setError("Bir hata olustu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/icerik/canli-yayin"
          className="p-2 rounded-lg hover:bg-background-alt transition-colors"
        >
          <svg
            className="w-5 h-5 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Yeni Canli Yayin
          </h1>
          <p className="text-muted text-sm">
            Yeni bir canli yayin planlayın
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Baslik <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Canli yayin basligi"
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Aciklama
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Yayin aciklamasi (istege bagli)"
            rows={3}
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </div>

        {/* YouTube URL */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            YouTube URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... veya https://youtu.be/..."
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Kucuk Resim URL
          </label>
          <input
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://... (istege bagli)"
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Scheduled At */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Planlanan Tarih ve Saat <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Notify Users */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setNotifyUsers(!notifyUsers)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              notifyUsers ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                notifyUsers ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <label className="text-sm font-semibold text-foreground cursor-pointer" onClick={() => setNotifyUsers(!notifyUsers)}>
            Uyelere bildirim gonder
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
          >
            {loading ? "Olusturuluyor..." : "Yayin Olustur"}
          </button>
          <Link
            href="/admin/icerik/canli-yayin"
            className="px-6 py-2.5 text-sm rounded-[var(--border-radius)] border border-border text-muted hover:text-foreground transition-colors"
          >
            Iptal
          </Link>
        </div>
      </form>
    </div>
  );
}
