"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  isGlobal: boolean;
  sendEmail: boolean;
  sentAt: string | null;
  createdAt: string;
  readCount: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const typeBadges: Record<string, { label: string; className: string }> = {
  GENERAL: { label: "Genel", className: "bg-gray-100 text-gray-800" },
  LIVE_STREAM: { label: "Canlı Yayın", className: "bg-red-100 text-red-800" },
  EVENT: { label: "Etkinlik", className: "bg-blue-100 text-blue-800" },
  ANNOUNCEMENT: { label: "Duyuru", className: "bg-purple-100 text-purple-800" },
  CAMPAIGN: { label: "Kampanya", className: "bg-green-100 text-green-800" },
  SYSTEM: { label: "Sistem", className: "bg-orange-100 text-orange-800" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", pagination.page.toString());
    params.set("limit", "20");
    if (typeFilter) params.set("type", typeFilter);

    try {
      const res = await fetch(`/api/admin/notifications?${params}`);
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data.notifications);
        setPagination(json.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, typeFilter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const deleteNotification = async (id: string) => {
    if (!confirm("Bu bildirimi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Bildirimler</h1>
          <p className="text-muted text-sm">Bildirimleri yönetin ve yeni bildirim gönderin</p>
        </div>
        <Link href="/admin/bildirimler/yeni" className="btn-primary px-5 py-2.5 text-sm">
          + Yeni Bildirim
        </Link>
      </div>

      {/* Filter */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="">Tüm Türler</option>
            <option value="GENERAL">Genel</option>
            <option value="LIVE_STREAM">Canlı Yayın</option>
            <option value="EVENT">Etkinlik</option>
            <option value="ANNOUNCEMENT">Duyuru</option>
            <option value="CAMPAIGN">Kampanya</option>
            <option value="SYSTEM">Sistem</option>
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-muted/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-muted">Henüz bildirim bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-alt">
                <tr>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Başlık</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">Tür</th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Okunma</th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">Tarih</th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {notifications.map((notification) => {
                  const badge = typeBadges[notification.type] || typeBadges.GENERAL;
                  return (
                    <tr key={notification.id} className="hover:bg-background-alt/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                        <p className="text-xs text-muted mt-0.5 line-clamp-1">
                          {notification.message.length > 80
                            ? notification.message.slice(0, 80) + "..."
                            : notification.message}
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center hidden lg:table-cell">
                        <span className="text-sm font-medium text-foreground">{notification.readCount}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-muted hidden md:table-cell">
                        {formatDate(notification.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted">
              Toplam {pagination.total} bildirim
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted hover:bg-background-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Önceki
              </button>
              <span className="text-sm text-muted">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted hover:bg-background-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
