"use client";

import { useState, useEffect } from "react";

interface LiveStreamData {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
  thumbnailUrl: string | null;
  scheduledAt: string;
  status: string;
}

function extractVideoId(url: string): string | null {
  // youtube.com/watch?v=XXX
  const watchMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([a-zA-Z0-9_-]{11})/
  );
  if (watchMatch) return watchMatch[1];

  // youtu.be/XXX
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/embed/XXX
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // youtube.com/live/XXX
  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];

  return null;
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const blocks = [
    { label: "Gun", value: timeLeft.days },
    { label: "Saat", value: timeLeft.hours },
    { label: "Dakika", value: timeLeft.minutes },
    { label: "Saniye", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-4">
      {blocks.map((block) => (
        <div key={block.label} className="text-center">
          <div className="bg-primary-dark text-white rounded-xl w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shadow-lg">
            <span className="text-3xl sm:text-4xl font-bold font-heading">
              {block.value.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="text-sm text-muted mt-2 block font-medium">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function LiveStreamPage() {
  const [stream, setStream] = useState<LiveStreamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await fetch("/api/livestreams/active");
        const json = await res.json();
        if (json.success) {
          setStream(json.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchActive();
    // Refetch every 15 seconds
    const interval = setInterval(fetchActive, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // No active stream
  if (!stream) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
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
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground mb-2">
            Su anda aktif yayin bulunmuyor
          </h1>
          <p className="text-muted">
            Planli bir canli yayin olduğunda burada gorebilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  // Live stream - show YouTube embed
  if (stream.status === "LIVE") {
    const videoId = extractVideoId(stream.youtubeUrl);
    const embedUrl = videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
      : null;

    return (
      <div className="min-h-screen bg-gray-950 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Live Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              CANLI
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {stream.title}
            </h1>
          </div>

          {/* YouTube Embed */}
          {embedUrl ? (
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black">
              <iframe
                src={embedUrl}
                title={stream.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center">
              <p className="text-white text-lg">
                Video yuklenemiyor. Lutfen{" "}
                <a
                  href={stream.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 underline"
                >
                  YouTube uzerinden izleyin
                </a>
                .
              </p>
            </div>
          )}

          {/* Description */}
          {stream.description && (
            <div className="max-w-5xl mx-auto mt-6 bg-white/5 rounded-xl p-6">
              <p className="text-white/80 text-sm leading-relaxed">
                {stream.description}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Scheduled stream - show countdown
  if (stream.status === "SCHEDULED") {
    const scheduledDate = new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
    }).format(new Date(stream.scheduledAt));

    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-2xl w-full">
          {/* Icon */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-10 h-10 text-primary"
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
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-3">
            {stream.title}
          </h1>

          {stream.description && (
            <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
              {stream.description}
            </p>
          )}

          <p className="text-sm text-muted mb-8">{scheduledDate}</p>

          {/* Countdown */}
          <Countdown targetDate={stream.scheduledAt} />

          <p className="text-muted text-sm mt-10">
            Yayin basladiginda bu sayfa otomatik olarak guncellenecektir.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
