"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mainNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import NotificationBell from "@/components/site/NotificationBell";
import type { MenuItem } from "@/types";

interface ActiveStream {
  id: string;
  title: string;
  status: string;
}

interface Branding {
  name: string;
  logoUrl: string;
  logoWidth: number;
  logoHeight: number;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<ActiveStream | null>(null);
  const [navItems, setNavItems] = useState<MenuItem[]>(mainNavigation);
  const [branding, setBranding] = useState<Branding>({ name: "", logoUrl: "", logoWidth: 140, logoHeight: 40 });
  const { user } = useAuthStore();
  const isMember = user && user.type === "member";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dinamik navigasyon fetch
  useEffect(() => {
    const fetchNav = async () => {
      try {
        const res = await fetch("/api/navigation");
        const json = await res.json();
        if (json.success && json.data) {
          setNavItems(json.data);
        }
        if (json.branding) {
          setBranding(json.branding);
        }
      } catch {
        // Fallback: mainNavigation zaten set
      }
    };
    fetchNav();
  }, []);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await fetch("/api/livestreams/active");
        const json = await res.json();
        if (json.success && json.data) {
          setActiveStream(json.data);
        } else {
          setActiveStream(null);
        }
      } catch {
        // silently fail
      }
    };
    fetchStream();
    const interval = setInterval(fetchStream, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
      )}
    >
      {/* Top Bar */}
      <div
        className={cn(
          "bg-primary-dark text-white text-sm transition-all duration-300 overflow-hidden",
          isScrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +90 (212) 000 00 00
            </span>
            <span className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@dernekpro.com
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/giris" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Üye Girişi
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/uye-ol" className="bg-white/15 hover:bg-white/25 px-3 py-1 rounded-md text-white transition-colors text-xs font-semibold">
              Üye Ol
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.name || "Logo"}
                width={branding.logoWidth}
                height={branding.logoHeight}
                className="object-contain"
              />
            ) : (
              <>
                <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">
                    {branding.name ? branding.name.charAt(0) : "D"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-xl text-foreground leading-tight">
                    {branding.name || "DernekPro"}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 ml-12">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() =>
                  item.children && setActiveDropdown(item.id)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                    item.label === "Destek Ol" || item.label === "Hesap Numaralarımız"
                      ? "bg-secondary text-white hover:bg-secondary/90 ml-3 shadow-sm hover:shadow-md"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {item.label}
                  {item.children && (
                    <svg
                      className={cn(
                        "w-3.5 h-3.5 inline-block ml-1 transition-transform duration-200",
                        activeDropdown === item.id && "rotate-180"
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && activeDropdown === item.id && (
                  <div className="absolute top-full left-0 mt-2 w-60 bg-background rounded-xl shadow-xl border border-border/50 py-2 animate-fade-in">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <span className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Live Stream Button */}
            {activeStream && (
              <Link
                href="/canli-yayin"
                className="ml-3 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                </span>
                Canli Yayin
              </Link>
            )}

            {/* Notification Bell — only for logged-in members */}
            {isMember && (
              <div className="ml-2">
                <NotificationBell />
              </div>
            )}
          </div>

          {/* Notification Bell for mobile — before hamburger */}
          {isMember && (
            <div className="lg:hidden mr-1">
              <NotificationBell />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-lg hover:bg-primary/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menüyü aç/kapat"
          >
            <svg
              className="w-6 h-6 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden absolute inset-x-0 top-full bg-background border-t border-border shadow-xl transition-all duration-300 overflow-hidden",
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-6 py-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  "block px-4 py-3 rounded-lg font-semibold transition-colors",
                  item.label === "Destek Ol" || item.label === "Hesap Numaralarımız"
                    ? "bg-secondary text-white text-center mt-3"
                    : "text-foreground hover:bg-primary/5 hover:text-primary"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-4 space-y-0.5 mt-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.href}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="w-1 h-1 bg-muted/50 rounded-full" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* Mobile Live Stream Button */}
          {activeStream && (
            <Link
              href="/canli-yayin"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              Canli Yayin
            </Link>
          )}

          <div className="border-t border-border pt-4 mt-4 flex gap-3">
            <Link
              href="/giris"
              className="flex-1 text-center py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Üye Girişi
            </Link>
            <Link
              href="/uye-ol"
              className="flex-1 text-center py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Üye Ol
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
