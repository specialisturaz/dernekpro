"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

interface StatsClientProps {
  title: string;
  subtitle: string;
  items: StatItem[];
}

/* ── Animated counter with IntersectionObserver ── */
function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const stepValue = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += stepValue;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  const formatted =
    count >= 1000
      ? new Intl.NumberFormat("tr-TR").format(count)
      : count.toString();

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  );
}

/* ── SVG Icon map ── */
const ICON_PATHS: Record<string, string> = {
  heart:
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  users:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  calendar:
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  hand:
    "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11",
  globe:
    "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
  star:
    "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  trophy:
    "M5 3h14M9 3v2.25M15 3v2.25M12 15l-3-3h6l-3 3zm0 0v4m-4 0h8M8 7a4 4 0 008 0M5 7a2 2 0 00-2 2v1a3 3 0 003 3h0M19 7a2 2 0 012 2v1a3 3 0 01-3 3h0",
  target:
    "M12 8V4m0 4a4 4 0 100 8 4 4 0 000-8zm-8 4h4m8 0h4M12 16v4M9 5l3-3 3 3",
};

/* ── Gradient ring colors per icon ── */
const ICON_COLORS: Record<string, { ring: string; text: string; glow: string }> = {
  heart:    { ring: "from-rose-400 to-pink-500",    text: "text-rose-500",    glow: "shadow-rose-500/20" },
  users:    { ring: "from-blue-400 to-indigo-500",  text: "text-blue-500",    glow: "shadow-blue-500/20" },
  calendar: { ring: "from-amber-400 to-orange-500", text: "text-amber-500",   glow: "shadow-amber-500/20" },
  hand:     { ring: "from-emerald-400 to-teal-500", text: "text-emerald-500", glow: "shadow-emerald-500/20" },
  globe:    { ring: "from-cyan-400 to-blue-500",    text: "text-cyan-500",    glow: "shadow-cyan-500/20" },
  star:     { ring: "from-yellow-400 to-amber-500", text: "text-yellow-500",  glow: "shadow-yellow-500/20" },
  trophy:   { ring: "from-purple-400 to-violet-500", text: "text-purple-500", glow: "shadow-purple-500/20" },
  target:   { ring: "from-red-400 to-rose-500",     text: "text-red-500",     glow: "shadow-red-500/20" },
};

function getIconColor(icon: string) {
  return ICON_COLORS[icon] || ICON_COLORS.star;
}

export default function StatsClient({ title, subtitle, items }: StatsClientProps) {
  return (
    <section className="relative overflow-hidden">
      {/* ── Gradient background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-background to-accent/[0.06]" />

      {/* ── Decorative elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/[0.04] rounded-full blur-3xl" />
        {/* Grid pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stats-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stats-grid)" className="text-foreground" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 py-8 md:py-12">
        {/* ── Section header ── */}
        {(title || subtitle) && (
          <div className="text-center mb-6 md:mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* ── Stats grid ── */}
        <div className={`grid gap-4 md:gap-5 ${
          items.length <= 3
            ? "grid-cols-1 sm:grid-cols-3 max-w-3xl mx-auto"
            : items.length <= 4
            ? "grid-cols-2 lg:grid-cols-4"
            : "grid-cols-2 lg:grid-cols-4"
        }`}>
          {items.map((stat, idx) => {
            const iconPath = ICON_PATHS[stat.icon] || ICON_PATHS.star;
            const colors = getIconColor(stat.icon);

            return (
              <div
                key={idx}
                className="group relative"
              >
                {/* Card */}
                <div className="relative bg-background/60 backdrop-blur-sm rounded-xl border border-border/60 p-4 md:p-5 text-center transition-all duration-500 hover:shadow-lg hover:shadow-primary/[0.04] hover:-translate-y-0.5 hover:border-primary/20">
                  {/* Subtle top accent line */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-gradient-to-r ${colors.ring} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Icon with gradient ring */}
                  <div className="relative inline-flex items-center justify-center mb-3">
                    {/* Icon container */}
                    <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${colors.ring} p-[2px] shadow-md ${colors.glow} group-hover:shadow-lg transition-shadow duration-500`}>
                      <div className="w-full h-full rounded-[10px] bg-background flex items-center justify-center">
                        <svg
                          className={`w-5 h-5 md:w-6 md:h-6 ${colors.text} transition-transform duration-500 group-hover:scale-110`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d={iconPath}
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Number */}
                  <div className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-1 tracking-tight">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <p className="text-xs md:text-sm text-muted font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
