"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  createdAt: string;
  isRead: boolean;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread-count");
      const json = await res.json();
      if (json.success) {
        setUnreadCount(json.data.unreadCount);
      }
    } catch {
      // Silently fail
    }
  }, []);

  // Fetch notifications when panel opens
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/member/notifications");
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data);
        const unread = json.data.filter((n: NotificationItem) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial unread count fetch
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Fetch full list when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markAsRead = async (notificationId: string) => {
    try {
      const res = await fetch("/api/member/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      const json = await res.json();
      if (json.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // Silently fail
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      window.location.href = notification.link;
      setIsOpen(false);
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
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-primary/5 transition-colors"
        aria-label="Bildirimler"
      >
        <svg
          className="w-5 h-5 text-foreground/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-background rounded-xl shadow-xl border border-border/50 z-50 animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Bildirimler</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-primary font-medium">
                {unreadCount} okunmamış
              </span>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-10 h-10 text-muted/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm text-muted">Bildirim yok</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left px-4 py-3 hover:bg-background-alt/50 transition-colors ${
                      !notification.isRead ? "bg-primary/5" : ""
                    } ${notification.link ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                      <div className={`flex-1 min-w-0 ${notification.isRead ? "ml-5" : ""}`}>
                        <p className={`text-sm ${!notification.isRead ? "font-semibold" : "font-medium"} text-foreground truncate`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[11px] text-muted/70 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
