"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LiveStreamData {
  id: string;
  title: string;
  status: string;
  scheduledAt: string;
}

export default function LiveStreamBar() {
  const [stream, setStream] = useState<LiveStreamData | null>(null);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await fetch("/api/livestreams/active");
        const json = await res.json();
        if (json.success && json.data) {
          setStream(json.data);
        }
      } catch {
        // silently fail
      }
    };
    fetchActive();
    // Refetch every 30 seconds
    const interval = setInterval(fetchActive, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stream) return null;

  if (stream.status === "LIVE") {
    return (
      <div className="sticky top-0 z-40 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center gap-2 flex-shrink-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <span className="text-sm font-bold uppercase tracking-wide">
                Canli Yayin
              </span>
            </span>
            <span className="text-sm font-medium truncate">
              {stream.title}
            </span>
          </div>
          <Link
            href="/canli-yayin"
            className="flex-shrink-0 bg-white text-red-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
          >
            Izle
          </Link>
        </div>
      </div>
    );
  }

  if (stream.status === "SCHEDULED") {
    const scheduledDate = new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(stream.scheduledAt));

    return (
      <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium truncate">
              {stream.title} &mdash; {scheduledDate} tarihinde baslayacak
            </span>
          </div>
          <Link
            href="/canli-yayin"
            className="flex-shrink-0 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Detay
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
