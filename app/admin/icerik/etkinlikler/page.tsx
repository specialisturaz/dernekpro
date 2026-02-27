"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  startAt: string;
  endAt: string;
  location: string | null;
  eventType: string;
  capacity: number | null;
  isFree: boolean;
  price: number | null;
  requiresRegistration: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count: { registrations: number };
}

const statusColors: Record<string, string> = {
  UPCOMING: "bg-blue-100 text-blue-800",
  ONGOING: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  UPCOMING: "Yaklaşan",
  ONGOING: "Devam Eden",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal",
};

const eventTypeLabels: Record<string, string> = {
  IN_PERSON: "Yüz Yüze",
  ONLINE: "Online",
  HYBRID: "Hibrit",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/admin/events?${params}`);
      const json = await res.json();
      if (json.success) setEvents(json.data.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const deleteEvent = async (id: string) => {
    if (!confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "UPCOMING" ? "CANCELLED" : "UPCOMING";
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Etkinlikler</h1>
          <p className="text-muted text-sm">Etkinlikleri yönetin</p>
        </div>
        <Link
          href="/admin/icerik/etkinlikler/yeni"
          className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Etkinlik
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchEvents()}
              placeholder="Etkinlik başlığı ara..."
              className="w-full px-4 py-2.5 pl-10 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <svg
              className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm"
          >
            <option value="">Tüm Durumlar</option>
            <option value="UPCOMING">Yaklaşan</option>
            <option value="ONGOING">Devam Eden</option>
            <option value="COMPLETED">Tamamlandı</option>
            <option value="CANCELLED">İptal</option>
          </select>
          <button onClick={fetchEvents} className="btn-primary px-6 py-2.5 text-sm">
            Filtrele
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : events.length === 0 ? (
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-muted mb-3">Henüz etkinlik eklenmemiş</p>
            <Link
              href="/admin/icerik/etkinlikler/yeni"
              className="btn-primary px-5 py-2 text-sm inline-block"
            >
              İlk Etkinliği Ekle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-alt">
                <tr>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                    Başlık
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                    Tarih
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden lg:table-cell">
                    Konum
                  </th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden lg:table-cell">
                    Tür
                  </th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                    Kapasite
                  </th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                    Durum
                  </th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-background-alt/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{event.title}</p>
                        <p className="text-xs text-muted">
                          {event._count.registrations} kayıt
                          {event.isFree ? (
                            <span className="ml-2 text-green-600">Ücretsiz</span>
                          ) : (
                            event.price && (
                              <span className="ml-2 text-yellow-600">
                                {event.price.toFixed(2)} TL
                              </span>
                            )
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-foreground">{formatDate(event.startAt)}</p>
                      <p className="text-xs text-muted">{formatDate(event.endAt)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted hidden lg:table-cell">
                      {event.location || "-"}
                    </td>
                    <td className="px-6 py-4 text-center hidden lg:table-cell">
                      <span className="text-xs font-medium text-muted">
                        {eventTypeLabels[event.eventType] || event.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-muted hidden md:table-cell">
                      {event.capacity != null ? (
                        <span>
                          {event._count.registrations}/{event.capacity}
                        </span>
                      ) : (
                        <span>Sınırsız</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[event.status]}`}
                      >
                        {statusLabels[event.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(event.id, event.status)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-background-alt text-muted hover:text-foreground transition-colors"
                        >
                          {event.status === "UPCOMING" ? "İptal Et" : "Yaklaşana Al"}
                        </button>
                        <Link
                          href={`/admin/icerik/etkinlikler/${event.id}`}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Düzenle
                        </Link>
                        <button
                          onClick={() => deleteEvent(event.id)}
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
