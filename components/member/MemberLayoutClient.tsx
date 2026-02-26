"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

const navItems = [
  {
    href: "/hesabim",
    label: "Genel Bakış",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    exact: true,
  },
  {
    href: "/hesabim/profil",
    label: "Profilim",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    href: "/hesabim/aidatlar",
    label: "Aidat Ödemeleri",
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    href: "/hesabim/bagislarim",
    label: "Bağışlarım",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function MemberLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, fetchUser, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-background-alt">
      {/* Top Bar */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold font-heading text-primary">
                Dernek<span className="text-secondary">Pro</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/hesabim"
                className={`text-sm font-semibold transition-colors ${
                  pathname.startsWith("/hesabim")
                    ? "text-primary"
                    : "text-muted hover:text-primary"
                }`}
              >
                Panel
              </Link>
              <Link
                href="/"
                className="text-sm text-muted hover:text-primary transition-colors"
              >
                Ana Sayfa
              </Link>
            </nav>

            {/* User & Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-10 h-10 rounded-full bg-background-alt border border-border flex items-center justify-center text-muted"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {user ? getInitials(user.fullName) : ".."}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {user?.fullName || "Yükleniyor..."}
                  </p>
                  <p className="text-xs text-muted">Üye</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-border p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold font-heading text-primary">
                Dernek<span className="text-secondary">Pro</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-muted hover:text-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-[var(--border-radius)] text-sm font-medium transition-colors ${
                    isActive(item.href, item.exact)
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:bg-background-alt hover:text-foreground"
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              ))}
              <hr className="border-border my-2" />
              <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Ana Sayfa
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--border-radius)] text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Çıkış Yap
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Sidebar + Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <nav className="card p-4 sticky top-24 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-[var(--border-radius)] text-sm font-medium transition-colors ${
                    isActive(item.href, item.exact)
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:bg-background-alt hover:text-foreground"
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              ))}

              <hr className="border-border my-2" />

              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--border-radius)] text-sm font-medium text-muted hover:bg-background-alt hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Ana Sayfa
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--border-radius)] text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Çıkış Yap
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
