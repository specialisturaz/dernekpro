"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface LiveStream {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
  thumbnailUrl: string | null;
  scheduledAt: string;
  startedAt: string | null;
  endedAt: string | null;
  status: string;
  notifyUsers: boolean;
  createdAt: string;
  updatedAt: string;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(new Date(dateStr));
}

function toLocalDatetime(dateStr: string): string {
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function EditLiveStreamPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [liveStream, setLiveStream] = useState<LiveStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notifyUsers, setNotifyUsers] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/livestreams/${id}`);
        const json = await res.json();
        if (json.success) {
          const ls = json.data as LiveStream;
          setLiveStream(ls);
          setTitle(ls.title);
          setDescription(ls.description || "");
          setYoutubeUrl(ls.youtubeUrl);
          setThumbnailUrl(ls.thumbnailUrl || "");
          setScheduledAt(toLocalDatetime(ls.scheduledAt));
          setNotifyUsers(ls.notifyUsers);
        } else {
          setError("Canli yayin bulunamadi");
        }
      } catch {
        setError("Veri yuklenirken hata olustu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Baslik zorunludur");
      return;
    }
    if (!youtubeUrl.trim()) {
      setError("YouTube URL zorunludur");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/livestreams/${id}`, {
        method: "PATCH",
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
        setLiveStream(json.data);
        setSuccess("Canli yayin guncellendi");
      } else {
        setError(json.message || "Bir hata olustu");
      }
    } catch {
      setError("Bir hata olustu");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (newStatus: string) => {
    const confirmMessages: Record<string, string> = {
      LIVE: "Yayini baslatmak istediginize emin misiniz?",
      ENDED: "Yayini bitirmek istediginize emin misiniz?",
      CANCELLED: "Yayini iptal etmek istediginize emin misiniz?",
    };
    if (!confirm(confirmMessages[newStatus] || "Emin misiniz?")) return;

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/livestreams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setLiveStream(json.data);
        const statusMessages: Record<string, string> = {
          LIVE: "Yayin baslatildi!",
          ENDED: "Yayin sonlandirildi",
          CANCELLED: "Yayin iptal edildi",
        };
        setSuccess(statusMessages[newStatus] || "Durum guncellendi");
      } else {
        setError(json.message || "Bir hata olustu");
      }
    } catch {
      setError("Bir hata olustu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu canli yayini kalici olarak silmek istediginize emin misiniz?"))
      return;
    try {
      const res = await fetch(`/api/admin/livestreams/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        router.push("/admin/icerik/canli-yayin");
      } else {
        setError(json.message || "Silinemedi");
      }
    } catch {
      setError("Bir hata olustu");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!liveStream) {
    return (
      <div className="text-center p-12">
        <p className="text-muted mb-4">Canli yayin bulunamadi</p>
        <Link href="/admin/icerik/canli-yayin" className="btn-primary px-5 py-2 text-sm">
          Listeye Don
        </Link>
      </div>
    );
  }

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
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Canli Yayini Duzenle
          </h1>
          <p className="text-muted text-sm">
            {liveStream.title}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Status Actions */}
      <div className="card p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">
              Durum:
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                {
                  SCHEDULED: "bg-blue-100 text-blue-800",
                  LIVE: "bg-red-100 text-red-800 animate-pulse",
                  ENDED: "bg-gray-100 text-gray-800",
                  CANCELLED: "bg-yellow-100 text-yellow-800",
                }[liveStream.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {
                {
                  SCHEDULED: "Planlandi",
                  LIVE: "Canli",
                  ENDED: "Sona Erdi",
                  CANCELLED: "Iptal Edildi",
                }[liveStream.status]
              }
            </span>
            {liveStream.startedAt && (
              <span className="text-xs text-muted">
                Basladi: {formatDate(liveStream.startedAt)}
              </span>
            )}
            {liveStream.endedAt && (
              <span className="text-xs text-muted">
                Bitti: {formatDate(liveStream.endedAt)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {liveStream.status === "SCHEDULED" && (
              <button
                onClick={() => changeStatus("LIVE")}
                disabled={saving}
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Yayini Baslat
              </button>
            )}
            {liveStream.status === "LIVE" && (
              <button
                onClick={() => changeStatus("ENDED")}
                disabled={saving}
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Yayini Bitir
              </button>
            )}
            {(liveStream.status === "SCHEDULED" ||
              liveStream.status === "LIVE") && (
              <button
                onClick={() => changeStatus("CANCELLED")}
                disabled={saving}
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors disabled:opacity-50"
              >
                Iptal Et
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="card p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Baslik <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Scheduled At */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Planlanan Tarih ve Saat
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
          <label
            className="text-sm font-semibold text-foreground cursor-pointer"
            onClick={() => setNotifyUsers(!notifyUsers)}
          >
            Uyelere bildirim gonder
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Degisiklikleri Kaydet"}
            </button>
            <Link
              href="/admin/icerik/canli-yayin"
              className="px-6 py-2.5 text-sm rounded-[var(--border-radius)] border border-border text-muted hover:text-foreground transition-colors"
            >
              Iptal
            </Link>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm font-semibold px-4 py-2.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            Yayini Sil
          </button>
        </div>
      </form>
    </div>
  );
}
