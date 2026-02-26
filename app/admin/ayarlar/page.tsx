"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/theme";
import { PRESET_THEMES, AVAILABLE_FONTS, COLOR_LABELS } from "@/lib/theme-defaults";
import { generateColorVariants, getContrastColor } from "@/lib/color-utils";
import ColorPicker from "@/components/admin/ColorPicker";
import type { ThemeColors } from "@/types";

const TABS = [
  { id: "colors", label: "Renk Paleti", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { id: "text", label: "Metin Renkleri", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { id: "background", label: "Arka Plan", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
  { id: "borders", label: "Kenarlık ve Köşeler", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" },
  { id: "fonts", label: "Yazı Tipleri", icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" },
  { id: "dark", label: "Karanlık Mod", icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" },
  { id: "presets", label: "Hazır Temalar", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
] as const;

type TabId = typeof TABS[number]["id"];

// Color groups for the Renk Paleti tab
const primaryColorKeys: (keyof ThemeColors)[] = ["primary", "primaryLight", "primaryDark"];
const accentColorKeys: (keyof ThemeColors)[] = ["secondary", "accent"];
const textColorKeys: (keyof ThemeColors)[] = ["text", "textMuted"];
const bgColorKeys: (keyof ThemeColors)[] = ["bg", "bgAlt"];
const borderColorKeys: (keyof ThemeColors)[] = ["border"];

export default function AyarlarPage() {
  const [activeTab, setActiveTab] = useState<TabId>("colors");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    theme, isLoading, isSaving, hasChanges, isDark,
    loadTheme, updateLightColor, updateDarkColor,
    updateTypography, updateBorderRadius,
    applyPreset, saveTheme, resetToDefault, cancelChanges,
    toggleDarkPreview,
  } = useThemeStore();

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const handleSave = async () => {
    const result = await saveTheme();
    setToast({ type: result.success ? "success" : "error", message: result.message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAutoVariants = () => {
    const variants = generateColorVariants(theme.light.primary);
    updateLightColor("primaryLight", variants.primaryLight);
    updateLightColor("primaryDark", variants.primaryDark);
  };

  const handleAutoVariantsDark = () => {
    const variants = generateColorVariants(theme.dark.primary);
    updateDarkColor("primaryLight", variants.primaryLight);
    updateDarkColor("primaryDark", variants.primaryDark);
  };

  const handleCopyLightToDark = () => {
    // Copy light colors to dark with slight adjustments (these will need manual fine-tuning)
    const lightColors = theme.light;
    (Object.keys(lightColors) as (keyof ThemeColors)[]).forEach((key) => {
      updateDarkColor(key, lightColors[key]);
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="card p-6 h-96 animate-pulse bg-gray-100" />
      </div>
    );
  }

  const renderColorPickers = (
    keys: (keyof ThemeColors)[],
    mode: "light" | "dark"
  ) => {
    const colors = mode === "light" ? theme.light : theme.dark;
    const updater = mode === "light" ? updateLightColor : updateDarkColor;
    return (
      <div className="space-y-3">
        {keys.map((key) => (
          <ColorPicker
            key={key}
            label={COLOR_LABELS[key].label}
            description={COLOR_LABELS[key].description}
            value={colors[key]}
            onChange={(val) => updater(key, val)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Tema Ayarları</h1>
        <p className="text-muted text-sm">Sitenizin renk, yazı tipi ve görünüm ayarlarını yönetin</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`p-3 rounded-lg text-sm ${toast.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          {toast.message}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tab Navigation (Sidebar) */}
        <div className="lg:col-span-1">
          <nav className="card p-3 space-y-1 sticky top-24">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-background-alt hover:text-foreground"
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}

            {/* Dark mode preview toggle */}
            <hr className="border-border my-2" />
            <button
              onClick={toggleDarkPreview}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isDark ? "bg-gray-800 text-yellow-400" : "text-muted hover:bg-background-alt"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isDark ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" : "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"} />
              </svg>
              {isDark ? "Açık Mod Önizle" : "Karanlık Mod Önizle"}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* ===== RENK PALETİ ===== */}
          {activeTab === "colors" && (
            <>
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Ana Renkler</h3>
                  <button
                    onClick={handleAutoVariants}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    Varyantları Otomatik Üret
                  </button>
                </div>
                {renderColorPickers(primaryColorKeys, "light")}
              </div>
              <div className="card p-6">
                <h3 className="font-bold text-foreground mb-4">Aksan Renkler</h3>
                {renderColorPickers(accentColorKeys, "light")}
              </div>
            </>
          )}

          {/* ===== METİN RENKLERİ ===== */}
          {activeTab === "text" && (
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-4">Metin Renkleri</h3>
              {renderColorPickers(textColorKeys, "light")}
              <div className="mt-6 p-4 rounded-lg border border-border">
                <p className="text-sm font-semibold" style={{ color: theme.light.text }}>Bu bir başlık metni örneğidir</p>
                <p className="text-sm mt-1" style={{ color: theme.light.textMuted }}>Bu da soluk/açıklama metni örneğidir</p>
              </div>
            </div>
          )}

          {/* ===== ARKA PLAN ===== */}
          {activeTab === "background" && (
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-4">Arka Plan Renkleri</h3>
              {renderColorPickers(bgColorKeys, "light")}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-6 rounded-lg border border-border" style={{ backgroundColor: theme.light.bg }}>
                  <p className="text-sm font-semibold" style={{ color: theme.light.text }}>Ana Arka Plan</p>
                </div>
                <div className="p-6 rounded-lg border border-border" style={{ backgroundColor: theme.light.bgAlt }}>
                  <p className="text-sm font-semibold" style={{ color: theme.light.text }}>Alternatif Arka Plan</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== KENARLIK VE KÖŞELER ===== */}
          {activeTab === "borders" && (
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-4">Kenarlık ve Köşeler</h3>
              {renderColorPickers(borderColorKeys, "light")}
              <div className="mt-6">
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Köşe Yarıçapı: {theme.layout.borderRadius}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={32}
                  step={1}
                  value={theme.layout.borderRadius}
                  onChange={(e) => updateBorderRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>0px (Keskin)</span>
                  <span>16px (Yuvarlak)</span>
                  <span>32px (Tam Yuvarlak)</span>
                </div>
              </div>
              {/* Preview */}
              <div className="mt-6 flex gap-4">
                {[0, 4, 8, 12, 16, 24].map((r) => (
                  <button
                    key={r}
                    onClick={() => updateBorderRadius(r)}
                    className={`w-16 h-16 border-2 flex items-center justify-center text-xs font-semibold transition-colors ${
                      theme.layout.borderRadius === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted hover:border-primary/50"
                    }`}
                    style={{ borderRadius: `${r}px` }}
                  >
                    {r}px
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== YAZI TİPLERİ ===== */}
          {activeTab === "fonts" && (
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-4">Yazı Tipleri</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Gövde Yazı Tipi</label>
                  <select
                    value={theme.typography.fontPrimary}
                    onChange={(e) => updateTypography("fontPrimary", e.target.value)}
                    className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    {AVAILABLE_FONTS.body.map((font) => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted mt-1">Paragraflar, açıklamalar ve genel metin için kullanılır</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Başlık Yazı Tipi</label>
                  <select
                    value={theme.typography.fontHeading}
                    onChange={(e) => updateTypography("fontHeading", e.target.value)}
                    className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    {AVAILABLE_FONTS.heading.map((font) => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted mt-1">H1-H6 başlıklar ve önemli metinler için kullanılır</p>
                </div>
                {/* Font Preview */}
                <div className="p-6 rounded-lg border border-border bg-background-alt">
                  <h4 className="text-xl font-bold mb-2" style={{ fontFamily: `"${theme.typography.fontHeading}", serif` }}>
                    Başlık Önizleme - {theme.typography.fontHeading}
                  </h4>
                  <p className="text-sm" style={{ fontFamily: `"${theme.typography.fontPrimary}", sans-serif` }}>
                    Bu bir gövde metin önizlemesidir. {theme.typography.fontPrimary} yazı tipi ile görüntüleniyor.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===== KARANLIK MOD ===== */}
          {activeTab === "dark" && (
            <>
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Karanlık Mod Renkleri</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAutoVariantsDark}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      Varyantları Otomatik Üret
                    </button>
                    <button
                      onClick={handleCopyLightToDark}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground transition-colors"
                    >
                      Açıktan Kopyala
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted mb-4">
                  Karanlık mod aktifken kullanılacak renkler. Önizlemek için sol menüden &quot;Karanlık Mod Önizle&quot; butonuna tıklayın.
                </p>
                {renderColorPickers([...primaryColorKeys, ...accentColorKeys], "dark")}
              </div>
              <div className="card p-6">
                <h3 className="font-bold text-foreground mb-4">Karanlık Mod — Metin ve Arka Plan</h3>
                {renderColorPickers([...textColorKeys, ...bgColorKeys, ...borderColorKeys], "dark")}
              </div>
            </>
          )}

          {/* ===== HAZIR TEMALAR ===== */}
          {activeTab === "presets" && (
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-2">Hazır Temalar</h3>
              <p className="text-sm text-muted mb-6">Bir tema seçin, ardından istediğiniz renkleri özelleştirin.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(PRESET_THEMES).map(([id, preset]) => (
                  <button
                    key={id}
                    onClick={() => applyPreset(id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      theme.activePreset === id
                        ? "border-primary shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex -space-x-1">
                        {[preset.light.primary, preset.light.secondary, preset.light.accent, preset.light.primaryDark, preset.light.bg].map((color, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full border-2 border-white"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <h4 className="font-semibold text-foreground text-sm">{preset.label}</h4>
                    <p className="text-xs text-muted mt-0.5">{preset.description}</p>
                    {theme.activePreset === id && (
                      <span className="inline-block mt-2 text-xs font-semibold text-primary">Aktif</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== CANLI ÖNİZLEME ===== */}
          <div className="card p-6">
            <h3 className="font-bold text-foreground mb-4">Canlı Önizleme</h3>
            <div className="p-6 rounded-lg border border-border" style={{ backgroundColor: isDark ? theme.dark.bg : theme.light.bg }}>
              <div className="space-y-4">
                {/* Sample heading */}
                <h4
                  className="text-xl font-bold"
                  style={{
                    color: isDark ? theme.dark.text : theme.light.text,
                    fontFamily: `"${theme.typography.fontHeading}", serif`,
                  }}
                >
                  Örnek Başlık
                </h4>
                <p
                  className="text-sm"
                  style={{
                    color: isDark ? theme.dark.textMuted : theme.light.textMuted,
                    fontFamily: `"${theme.typography.fontPrimary}", sans-serif`,
                  }}
                >
                  Bu bir açıklama metni örneğidir. Seçtiğiniz renkler burada görünür.
                </p>

                {/* Sample buttons */}
                <div className="flex gap-3">
                  <button
                    className="px-5 py-2.5 text-sm font-semibold text-white shadow-md"
                    style={{
                      backgroundColor: isDark ? theme.dark.primary : theme.light.primary,
                      borderRadius: `${theme.layout.borderRadius}px`,
                      color: getContrastColor(isDark ? theme.dark.primary : theme.light.primary),
                    }}
                  >
                    Ana Buton
                  </button>
                  <button
                    className="px-5 py-2.5 text-sm font-semibold text-white shadow-md"
                    style={{
                      backgroundColor: isDark ? theme.dark.secondary : theme.light.secondary,
                      borderRadius: `${theme.layout.borderRadius}px`,
                      color: getContrastColor(isDark ? theme.dark.secondary : theme.light.secondary),
                    }}
                  >
                    İkincil Buton
                  </button>
                  <button
                    className="px-5 py-2.5 text-sm font-semibold border-2"
                    style={{
                      borderColor: isDark ? theme.dark.primary : theme.light.primary,
                      color: isDark ? theme.dark.primary : theme.light.primary,
                      borderRadius: `${theme.layout.borderRadius}px`,
                      backgroundColor: "transparent",
                    }}
                  >
                    Çerçeveli
                  </button>
                </div>

                {/* Sample card */}
                <div
                  className="p-4 border shadow-sm"
                  style={{
                    backgroundColor: isDark ? theme.dark.bgAlt : theme.light.bgAlt,
                    borderColor: isDark ? theme.dark.border : theme.light.border,
                    borderRadius: `${theme.layout.borderRadius}px`,
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: isDark ? theme.dark.text : theme.light.text }}>
                    Örnek Kart
                  </p>
                  <p className="text-xs mt-1" style={{ color: isDark ? theme.dark.textMuted : theme.light.textMuted }}>
                    Bu bir kart bileşeni önizlemesidir.
                  </p>
                </div>

                {/* Sample input */}
                <div
                  className="px-4 py-3 text-sm border"
                  style={{
                    backgroundColor: isDark ? theme.dark.bg : theme.light.bg,
                    borderColor: isDark ? theme.dark.border : theme.light.border,
                    color: isDark ? theme.dark.textMuted : theme.light.textMuted,
                    borderRadius: `${theme.layout.borderRadius}px`,
                  }}
                >
                  Örnek giriş alanı...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-sm font-semibold text-foreground">Kaydedilmemiş değişiklikler var</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetToDefault}
                className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground border border-border rounded-lg transition-colors"
              >
                Varsayılana Dön
              </button>
              <button
                onClick={cancelChanges}
                className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground border border-border rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
              >
                {isSaving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
