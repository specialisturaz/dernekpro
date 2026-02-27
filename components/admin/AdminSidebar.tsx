"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface NavLink {
  label: string;
  href: string;
  icon: string;
}

interface NavGroup {
  label: string;
  items: NavLink[];
}

interface AdminSidebarProps {
  navGroups: NavGroup[];
  loading?: boolean;
}

export default function AdminSidebar({ navGroups, loading }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-primary-dark text-white flex-shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold font-heading">
              Dernek<span className="text-secondary">Pro</span>
            </span>
          </Link>
          <p className="text-xs text-white/50 mt-1">Yönetim Paneli</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-4 px-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-3 w-16 bg-white/10 rounded animate-pulse mb-3" />
                  <div className="space-y-2">
                    <div className="h-8 bg-white/5 rounded animate-pulse" />
                    <div className="h-8 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 py-2 mt-4 first:mt-0">
                  {group.label}
                </p>
                {group.items.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                    </svg>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))
          )}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.fullName || "Admin"}</p>
              <p className="text-xs text-white/50">{user?.role || "Yönetici"}</p>
            </div>
            <button
              onClick={() => logout()}
              className="text-white/50 hover:text-white transition-colors"
              title="Çıkış Yap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Mobile sidebar overlay
export function MobileSidebar({
  open,
  onClose,
  navGroups,
}: {
  open: boolean;
  onClose: () => void;
  navGroups: NavGroup[];
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <aside className="fixed inset-y-0 left-0 w-72 flex flex-col bg-primary-dark text-white z-50">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <span className="text-xl font-bold font-heading">
              Dernek<span className="text-secondary">Pro</span>
            </span>
          </Link>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 py-2 mt-4 first:mt-0">
                {group.label}
              </p>
              {group.items.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.fullName || "Admin"}</p>
              <p className="text-xs text-white/50">{user?.role || "Yönetici"}</p>
            </div>
            <button
              onClick={() => logout()}
              className="text-white/50 hover:text-white transition-colors"
              title="Çıkış Yap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
