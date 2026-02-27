"use client";

import { useState, useEffect } from "react";
import { CATEGORY_LABELS } from "@/lib/modules/registry";
import type { ModuleCategory } from "@/lib/modules/registry";

interface ModuleItem {
  code: string;
  name: string;
  description: string;
  category: ModuleCategory;
  icon: string;
  isCore: boolean;
  isActive: boolean;
  activatedAt: string | null;
}

export default function ModullerPage() {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchModules = async () => {
    try {
      const res = await fetch("/api/admin/modules", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setModules(json.data);
      }
    } catch {
      console.error("Modüller yüklenemedi");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleToggle = async (code: string, currentActive: boolean) => {
    setToggling(code);
    try {
      const res = await fetch("/api/admin/modules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleCode: code, isActive: !currentActive }),
        cache: "no-store",
      });
      const json = await res.json();
      if (json.success) {
        setToast({
          type: "success",
          message: !currentActive ? "Modül aktif edildi" : "Modül devre dışı bırakıldı",
        });
        await fetchModules();
        // Sidebar'i guncelle
        window.dispatchEvent(new Event("modules-changed"));
      } else {
        setToast({ type: "error", message: json.message || "Hata oluştu" });
      }
    } catch (err) {
      console.error("Modül toggle hatası:", err);
      setToast({ type: "error", message: "Bağlantı hatası" });
    }
    setToggling(null);
    setTimeout(() => setToast(null), 3000);
  };

  // Kategorilere gore grupla
  const grouped: Record<string, ModuleItem[]> = {};
  for (const mod of modules) {
    if (!grouped[mod.category]) grouped[mod.category] = [];
    grouped[mod.category].push(mod);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6 h-40 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">
          Modül Yönetimi
        </h1>
        <p className="text-muted text-sm">
          Derneğiniz için aktif modülleri yönetin
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`p-3 rounded-lg text-sm ${
            toast.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Kategorilere gore moduller */}
      {(Object.keys(CATEGORY_LABELS) as ModuleCategory[]).map((cat) => {
        const catModules = grouped[cat];
        if (!catModules?.length) return null;

        return (
          <div key={cat}>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              {CATEGORY_LABELS[cat]}
              <span className="text-xs font-normal text-muted bg-background-alt px-2 py-0.5 rounded-full">
                {catModules.length} modül
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catModules.map((mod) => (
                <div
                  key={mod.code}
                  className={`card p-5 transition-all ${
                    mod.isActive
                      ? "border-primary/30 bg-primary/5"
                      : "opacity-60 border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          mod.isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={mod.icon}
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {mod.name}
                        </h3>
                        {mod.isCore && (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            Çekirdek
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={mod.isActive}
                      onClick={() => !mod.isCore && handleToggle(mod.code, mod.isActive)}
                      disabled={mod.isCore || toggling === mod.code}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 ${
                        mod.isCore
                          ? "bg-primary/40 cursor-not-allowed"
                          : toggling === mod.code
                          ? "bg-gray-400 cursor-wait"
                          : mod.isActive
                          ? "bg-primary cursor-pointer"
                          : "bg-gray-300 cursor-pointer"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                          mod.isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {mod.description}
                  </p>
                  {!mod.isCore && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${mod.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                      <span className="text-[11px] text-muted">
                        {mod.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
