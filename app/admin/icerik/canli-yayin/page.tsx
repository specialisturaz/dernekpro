"use client";

import { useState, useEffect, useCallback } from "react";
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

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  LIVE: "bg-red-100 text-red-800 animate-pulse",
  ENDED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-yellow-100 text-yellow-800",
};

const statusLabels: Record<string, string> = {
  SCHEDULED: "Planlandı",
  LIVE: "Canlı",
  ENDED: "Sona Erdi",
  CANCELLED: "İptal Edildi",
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export default function LiveStreamListPage() {
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchLiveStreams = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/admin/livestreams?${params}`);
      const json = await res.json();
      if (json.success) setLiveStreams(json.data.liveStreams);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchLiveStreams();
  }, [fetchLiveStreams]);

  const deleteLiveStream = async (id: string) => {
    if (!confirm("Bu canlı yayını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/livestreams/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success)
        setLiveStreams((prev) => prev.filter((ls) => ls.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Canli Yayin
          </h1>
          <p className="text-muted text-sm">
            YouTube canli yayinlarini yonetin
          </p>
        </div>
        <Link
          href="/admin/icerik/canli-yayin/yeni"
          className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Yeni Yayin Olustur
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm flex-1"
          >
            <option value="">Tum Durumlar</option>
            <option value="SCHEDULED">Planlandi</option>
            <option value="LIVE">Canli</option>
            <option value="ENDED">Sona Erdi</option>
            <option value="CANCELLED">Iptal Edildi</option>
          </select>
          <button
            onClick={fetchLiveStreams}
            className="btn-primary px-6 py-2.5 text-sm"
          >
            Filtrele
          </button>
        </div>
      </div>

      {/* LiveStreams Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : liveStreams.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-12 h-12 text-muted/30 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-muted mb-3">Henuz canli yayin eklenmemis</p>
            <Link
              href="/admin/icerik/canli-yayin/yeni"
              className="btn-primary px-5 py-2 text-sm inline-block"
            >
              Ilk Yayini Olustur
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-alt">
                <tr>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                    Baslik
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                    YouTube URL
                  </th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                    Durum
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                    Planlanan Tarih
                  </th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                    Islem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {liveStreams.map((ls) => (
                  <tr
                    key={ls.id}
                    className="hover:bg-background-alt/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-foreground">
                        {ls.title}
                      </p>
                      {ls.description && (
                        <p className="text-xs text-muted line-clamp-1">
                          {ls.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <a
                        href={ls.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline truncate block max-w-[200px]"
                      >
                        {ls.youtubeUrl}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[ls.status]}`}
                      >
                        {statusLabels[ls.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-foreground">
                        {formatDate(ls.scheduledAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/icerik/canli-yayin/${ls.id}`}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Duzenle
                        </Link>
                        <button
                          onClick={() => deleteLiveStream(ls.id)}
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
