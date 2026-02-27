"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";

export interface SlideData {
  id: string;
  mediaUrl: string;
  mobileMediaUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  badge?: string | null;
  bgColor?: string | null;
  accentColor?: string | null;
  statsLabel?: string | null;
  statsValue?: string | null;
  slideDate?: string | null;
  location?: string | null;
}

const FALLBACK_SLIDES: SlideData[] = [
  {
    id: "fallback-1",
    badge: "Toplumsal Dayanisma",
    title: "Birlikte Daha\nGucluyuz",
    subtitle:
      "Toplumsal dayanisma ve gonulluluk ruhuyla binlerce aileye umut oluyoruz. Her el uzatma, bir hayat degistiriyor.",
    buttonText: "Bize Katilin",
    buttonLink: "/uye-ol",
    mediaUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=85",
    bgColor: "#1a3a2a",
    accentColor: "#c8956c",
    statsLabel: "Desteklenen Aile",
    statsValue: "2,500+",
    slideDate: "Devam Ediyor",
    location: "Turkiye Geneli",
  },
  {
    id: "fallback-2",
    badge: "Egitim Projeleri",
    title: "Egitimde Firsat\nEsitligi",
    subtitle:
      "Burs programlarimiz ve egitim desteklerimizle genclerimizin gelecegine yatirim yapiyoruz.",
    buttonText: "Burs Programi",
    buttonLink: "/faaliyetler",
    mediaUrl:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1400&q=85",
    bgColor: "#1e3a5f",
    accentColor: "#64b5f6",
    statsLabel: "Burslu Ogrenci",
    statsValue: "450+",
    slideDate: "2024-2025 Donemi",
    location: "12 Sehir",
  },
  {
    id: "fallback-3",
    badge: "Gonulluluk",
    title: "Gonulluterimizle\nBuyuyoruz",
    subtitle:
      "Yuzlerce gonullumuzle birlikte Turkiye genelinde sosyal sorumluluk projelerine imza atiyoruz.",
    buttonText: "Gonullu Ol",
    buttonLink: "/uye-ol",
    mediaUrl:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1400&q=85",
    bgColor: "#2d1b4e",
    accentColor: "#ce93d8",
    statsLabel: "Aktif Gonullu",
    statsValue: "800+",
    slideDate: "Her Gun",
    location: "Tum Subeler",
  },
  {
    id: "fallback-4",
    badge: "Kultur & Etkinlik",
    title: "Kulturel Mirasa\nSahip Cikiyoruz",
    subtitle:
      "Konferanslar, festivaller ve sanat etkinlikleriyle kulturel degerlerimizi gelecek nesillere aktariyoruz.",
    buttonText: "Etkinlikler",
    buttonLink: "/etkinlikler",
    mediaUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=85",
    bgColor: "#3e2723",
    accentColor: "#ffb74d",
    statsLabel: "Yillik Etkinlik",
    statsValue: "120+",
    slideDate: "Yil Boyunca",
    location: "Coklu Mekan",
  },
  {
    id: "fallback-5",
    badge: "Yardim Kampanyasi",
    title: "Her Bagis\nBir Umut",
    subtitle:
      "Ihtiyac sahibi ailelerimize ulasmak icin duzenledigimiz kampanyalara siz de destek olun.",
    buttonText: "Bagis Yap",
    buttonLink: "/bagis",
    mediaUrl:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1400&q=85",
    bgColor: "#1b5e20",
    accentColor: "#81c784",
    statsLabel: "Toplam Bagis",
    statsValue: "₺2.5M+",
    slideDate: "Suresiz",
    location: "Online & Subeler",
  },
];

const AUTOPLAY_INTERVAL = 7000;

interface HeroSectionProps {
  slides?: SlideData[];
}

export default function HeroSection({ slides: propSlides }: HeroSectionProps) {
  const slides =
    propSlides && propSlides.length > 0 ? propSlides : FALLBACK_SLIDES;

  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const progressRef = useRef<number>(0);
  const startTimeRef = useRef(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

  const total = slides.length;
  const slide = slides[current];

  const goTo = useCallback(
    (index: number) => {
      if (index === current) return;
      setPrev(current);
      setCurrent(((index % total) + total) % total);
      setProgress(0);
      startTimeRef.current = Date.now();
      setTimeout(() => setPrev(null), 900);
    },
    [current, total]
  );

  const next = useCallback(
    () => goTo((current + 1) % total),
    [current, total, goTo]
  );
  const prevFn = useCallback(
    () => goTo((current - 1 + total) % total),
    [current, total, goTo]
  );

  // Autoplay
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    startTimeRef.current =
      Date.now() - (progress / 100) * AUTOPLAY_INTERVAL;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / AUTOPLAY_INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        next();
      } else {
        progressRef.current = requestAnimationFrame(tick);
      }
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isHovered, current, next]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prevFn();
      else if (e.key === " " || e.key === "p") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prevFn]);

  // Mouse parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  // Touch
  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 60) {
      if (diff < 0) next(); else prevFn();
    }
    setTouchStart(null);
  };

  const parallaxX = (mousePos.x - 0.5) * -20;
  const parallaxY = (mousePos.y - 0.5) * -12;

  const accent = slide.accentColor || "#c8956c";

  if (slides.length === 0) return null;

  return (
    <section className="w-full">
      {/* Main Slider — Full Width */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden h-[55vh] sm:h-[65vh] lg:h-[calc(100vh-80px)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 0.5, y: 0.5 });
        }}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Slider"
        tabIndex={0}
      >
        {/* Slide Layers */}
        {slides.map((s, i) => {
          const isActive = i === current;
          const isPrev = i === prev;
          const show = isActive || isPrev;
          const sAccent = s.accentColor || "#c8956c";
          const sBg = s.bgColor || "#1a3a2a";

          return (
            <div
              key={s.id}
              className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                visibility: show ? "visible" : "hidden",
                zIndex: isActive ? 2 : isPrev ? 1 : 0,
              }}
            >
              {/* BG Image with Parallax + Ken Burns */}
              <div className="absolute inset-[-30px] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] ease-out"
                  style={{
                    backgroundImage: `url(${s.mediaUrl})`,
                    transform: isActive
                      ? `scale(1.12) translate(${parallaxX}px, ${parallaxY}px)`
                      : "scale(1.0)",
                  }}
                />
              </div>

              {/* Multi-layer overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(135deg, ${sBg}cc 0%, transparent 60%),
                    linear-gradient(180deg, transparent 30%, ${sBg}ee 100%),
                    linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 40%)
                  `,
                }}
              />

              {/* Grain */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: "128px",
                }}
              />

              {/* Decorative floating elements — hidden on mobile */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
                <div
                  className="absolute w-[500px] h-[500px] rounded-full opacity-10 hero-float-blob"
                  style={{
                    background: `radial-gradient(circle, ${sAccent}44, transparent 70%)`,
                    top: "-15%",
                    right: "-10%",
                    animationPlayState: isActive ? "running" : "paused",
                  }}
                />
                <div
                  className="absolute w-[300px] h-[300px] rounded-full opacity-[0.07] hero-float-blob-reverse"
                  style={{
                    background: `radial-gradient(circle, white, transparent 70%)`,
                    bottom: "-5%",
                    left: "20%",
                    animationPlayState: isActive ? "running" : "paused",
                  }}
                />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 pb-16 sm:p-8 sm:pb-20 lg:p-14 lg:pb-24 z-10">
                {/* Badge */}
                {s.badge && (
                  <div
                    className="transition-all duration-700 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0)"
                        : "translateY(24px)",
                      transitionDelay: isActive ? "200ms" : "0ms",
                    }}
                  >
                    <span
                      className="inline-flex items-center gap-1.5 text-[9px] sm:text-xs font-bold uppercase tracking-[0.15em] px-2.5 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-xl border"
                      style={{
                        background: `${sAccent}22`,
                        borderColor: `${sAccent}33`,
                        color: sAccent,
                      }}
                    >
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {s.badge}
                    </span>
                  </div>
                )}

                {/* Title */}
                {s.title && (
                  <div
                    className="mt-2 sm:mt-4 transition-all duration-700 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0)"
                        : "translateY(32px)",
                      transitionDelay: isActive ? "350ms" : "0ms",
                    }}
                  >
                    <h2 className="text-lg sm:text-3xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight whitespace-pre-line drop-shadow-lg font-heading">
                      {s.title}
                    </h2>
                  </div>
                )}

                {/* Description */}
                {s.subtitle && (
                  <div
                    className="mt-2 sm:mt-4 transition-all duration-700 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0)"
                        : "translateY(28px)",
                      transitionDelay: isActive ? "450ms" : "0ms",
                    }}
                  >
                    <p className="text-xs sm:text-base text-white/75 max-w-lg leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {s.subtitle}
                    </p>
                  </div>
                )}

                {/* Meta row — hidden on mobile */}
                {(s.slideDate || s.location || s.statsValue) && (
                  <div
                    className="hidden sm:flex flex-wrap items-center gap-3 sm:gap-5 mt-4 sm:mt-5 transition-all duration-700 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0)"
                        : "translateY(24px)",
                      transitionDelay: isActive ? "550ms" : "0ms",
                    }}
                  >
                    {s.slideDate && (
                      <span className="flex items-center gap-1.5 text-xs text-white/50">
                        <Calendar className="w-3.5 h-3.5" />
                        {s.slideDate}
                      </span>
                    )}
                    {s.location && (
                      <span className="flex items-center gap-1.5 text-xs text-white/50">
                        <MapPin className="w-3.5 h-3.5" />
                        {s.location}
                      </span>
                    )}
                    {s.statsValue && s.statsLabel && (
                      <span className="flex items-center gap-1.5 text-xs text-white/50">
                        <Users className="w-3.5 h-3.5" />
                        {s.statsValue} {s.statsLabel}
                      </span>
                    )}
                  </div>
                )}

                {/* CTA + Stats */}
                <div
                  className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-6 transition-all duration-700 ease-out"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? "translateY(0)"
                      : "translateY(24px)",
                    transitionDelay: isActive ? "650ms" : "0ms",
                  }}
                >
                  {s.buttonText && s.buttonLink && (
                    <Link
                      href={s.buttonLink}
                      className="group inline-flex items-center gap-2 px-4 py-2 sm:px-7 sm:py-3.5 rounded-full text-xs sm:text-base font-bold text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg hover:shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${sAccent}, ${sAccent}cc)`,
                        boxShadow: `0 8px 32px ${sAccent}44`,
                      }}
                    >
                      {s.buttonText}
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  )}

                  {/* Stat pill — hidden on mobile */}
                  {s.statsValue && s.statsLabel && (
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.1]">
                      <div className="text-xl sm:text-2xl font-extrabold text-white leading-none">
                        {s.statsValue}
                      </div>
                      <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider leading-tight">
                        {s.statsLabel}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Nav Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prevFn}
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-black/30 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Onceki"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-black/30 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Sonraki"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Play/Pause */}
        {total > 1 && (
          <div className="absolute top-3 sm:top-5 left-3 sm:left-5 z-20">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-xl border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              aria-label={isPlaying ? "Duraklat" : "Oynat"}
            >
              {isPlaying ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3 ml-0.5" />
              )}
            </button>
          </div>
        )}

        {/* Counter */}
        {total > 1 && (
          <div className="absolute top-3 sm:top-5 right-3 sm:right-5 z-20 flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-xs font-bold">
            <span className="text-white text-xs sm:text-sm">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="text-white/30 mx-0.5">/</span>
            <span className="text-white/50 text-xs sm:text-sm">
              {String(total).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Dots with Progress */}
        {total > 1 && (
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-black/20 backdrop-blur-xl border border-white/[0.08]">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative cursor-pointer transition-all duration-500 outline-none"
                style={{
                  width: i === current ? 24 : 6,
                  height: 6,
                  borderRadius: 100,
                  overflow: "hidden",
                  background:
                    i === current
                      ? `${accent}44`
                      : "rgba(255,255,255,0.2)",
                }}
                aria-label={`Slide ${i + 1}`}
              >
                {i === current && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: accent,
                      boxShadow: `0 0 8px ${accent}66`,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Progress Bar (bottom edge) */}
        {total > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.06] z-20">
            <div
              className="h-full rounded-r-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
                transition: "width 80ms linear",
              }}
            />
          </div>
        )}
      </div>

      {/* Thumbnails — removed to keep slider compact */}
      {false && total > 1 && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto pb-1 hero-scrollbar-hide">
            {slides.map((s, i) => {
              const sAccent = s.accentColor || "#c8956c";
              return (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className={`
                    relative flex-shrink-0 w-[72px] sm:w-[130px] h-[44px] sm:h-[76px] rounded-lg sm:rounded-2xl overflow-hidden cursor-pointer
                    transition-all duration-400 outline-none border-2
                    ${
                      i === current
                        ? "opacity-100 scale-100 shadow-lg"
                        : "opacity-40 hover:opacity-70 scale-[0.97] hover:scale-100"
                    }
                  `}
                  style={{
                    borderColor:
                      i === current ? sAccent : "transparent",
                    boxShadow:
                      i === current
                        ? `0 4px 20px ${sAccent}33`
                        : "none",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.mediaUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {s.badge && (
                    <span className="absolute bottom-1 left-1.5 text-[8px] sm:text-[10px] font-bold text-white/90 drop-shadow hidden sm:block">
                      {s.badge}
                    </span>
                  )}
                  {i === current && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ background: accent }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Keyboard Hints — removed to keep slider compact */}
    </section>
  );
}
