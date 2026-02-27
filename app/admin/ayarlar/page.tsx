"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useThemeStore } from "@/store/theme";
import { PRESET_THEMES, AVAILABLE_FONTS, COLOR_LABELS } from "@/lib/theme-defaults";
import { generateColorVariants, getContrastColor } from "@/lib/color-utils";
import ColorPicker from "@/components/admin/ColorPicker";
import ImageUpload from "@/components/admin/ImageUpload";
import type { ThemeColors } from "@/types";

const TABS = [
  { id: "logo", label: "Logo & Favicon", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "colors", label: "Renk Paleti", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { id: "text", label: "Metin Renkleri", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { id: "background", label: "Arka Plan", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
  { id: "borders", label: "Kenarlık ve Köşeler", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" },
  { id: "fonts", label: "Yazı Tipleri", icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" },
  { id: "dark", label: "Karanlık Mod", icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" },
  { id: "presets", label: "Hazır Temalar", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { id: "maintenance", label: "Bakım Modu", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  { id: "storage", label: "Depolama", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" },
  { id: "footer", label: "Footer", icon: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2zM3 17h18" },
  { id: "stats", label: "İstatistikler", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "about", label: "Hakkımızda", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "contact", label: "İletişim", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
] as const;

type TabId = typeof TABS[number]["id"];

// Color groups for the Renk Paleti tab
const primaryColorKeys: (keyof ThemeColors)[] = ["primary", "primaryLight", "primaryDark"];
const accentColorKeys: (keyof ThemeColors)[] = ["secondary", "accent"];
const textColorKeys: (keyof ThemeColors)[] = ["text", "textMuted"];
const bgColorKeys: (keyof ThemeColors)[] = ["bg", "bgAlt"];
const borderColorKeys: (keyof ThemeColors)[] = ["border"];

export default function AyarlarPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabId) || "colors";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [maintenanceSaving, setMaintenanceSaving] = useState(false);

  // Storage state
  const [storageProvider, setStorageProvider] = useState<"local" | "r2">("r2");
  const [storageR2, setStorageR2] = useState({
    accountId: "",
    accessKeyId: "",
    secretAccessKey: "",
    bucketName: "",
    publicUrl: "",
  });
  const [storageSaving, setStorageSaving] = useState(false);

  // Footer state
  const [footerSettings, setFooterSettings] = useState({
    brandName: "DernekPro",
    tagline: "",
    copyright: "",
    showNewsletter: true,
    newsletterTitle: "",
    newsletterDescription: "",
  });
  const [footerSaving, setFooterSaving] = useState(false);

  // Stats state
  const [statsSettings, setStatsSettings] = useState(() => ({
    title: "",
    subtitle: "",
    items: [
      { label: "Yardım Kampanyası", value: 150, suffix: "+", icon: "heart" },
      { label: "Ulaşılan Kişi", value: 50000, suffix: "+", icon: "users" },
      { label: "Yıllık Deneyim", value: 15, suffix: " Yıl", icon: "calendar" },
      { label: "Gönüllü Bağışçı", value: 3500, suffix: "+", icon: "hand" },
    ],
  }));
  const [statsSaving, setStatsSaving] = useState(false);

  // Contact page state
  const [contactSettings, setContactSettings] = useState(() => ({
    address: "",
    phone: "",
    email: "",
    workingHours: "",
    mapLat: 41.0082,
    mapLng: 28.9784,
    mapZoom: 13,
    socialMedia: [] as { platform: string; url: string }[],
    faq: [] as { question: string; answer: string }[],
    mapEmbed: "",
    heroTitle: "",
    heroDescription: "",
    formTitle: "",
    formDescription: "",
    formTopics: [] as string[],
    mapTitle: "",
    mapDescription: "",
    socialTitle: "",
    socialDescription: "",
    ctaPrimaryText: "",
    ctaPrimaryLink: "",
    ctaSecondaryText: "",
    ctaSecondaryLink: "",
  }));
  const [contactSaving, setContactSaving] = useState(false);

  // About state
  const [aboutSettings, setAboutSettings] = useState({
    title: "",
    subtitle: "",
    description: "",
    mission: "",
    vision: "",
    imageUrl: "",
    badgeText: "",
    badgeSubtext: "",
  });
  const [aboutSaving, setAboutSaving] = useState(false);

  // Logo state
  const [logoSettings, setLogoSettings] = useState({
    logoUrl: "",
    faviconUrl: "",
    logoWidth: 140,
    logoHeight: 40,
  });
  const [logoSaving, setLogoSaving] = useState(false);

  const {
    theme, isLoading, isSaving, hasChanges, isDark,
    loadTheme, updateLightColor, updateDarkColor,
    updateTypography, updateBorderRadius,
    applyPreset, saveTheme, resetToDefault, cancelChanges,
    toggleDarkPreview,
  } = useThemeStore();

  useEffect(() => {
    loadTheme();
    // Load maintenance settings
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          if (data.data.maintenance) {
            setMaintenanceEnabled(data.data.maintenance.enabled || false);
            setMaintenanceMessage(data.data.maintenance.message || "");
          }
          if (data.data.storage) {
            setStorageProvider(data.data.storage.provider || "r2");
            if (data.data.storage.r2) {
              setStorageR2({
                accountId: data.data.storage.r2.accountId || "",
                accessKeyId: data.data.storage.r2.accessKeyId || "",
                secretAccessKey: data.data.storage.r2.secretAccessKey || "",
                bucketName: data.data.storage.r2.bucketName || "",
                publicUrl: data.data.storage.r2.publicUrl || "",
              });
            }
          }
          if (data.data.footer) {
            setFooterSettings({
              brandName: data.data.footer.brandName || "DernekPro",
              tagline: data.data.footer.tagline || "",
              copyright: data.data.footer.copyright || "",
              showNewsletter: data.data.footer.showNewsletter ?? true,
              newsletterTitle: data.data.footer.newsletterTitle || "",
              newsletterDescription: data.data.footer.newsletterDescription || "",
            });
          }
          if (data.data.stats) {
            setStatsSettings((prev) => ({
              title: data.data.stats.title || "",
              subtitle: data.data.stats.subtitle || "",
              items: data.data.stats.items || prev.items,
            }));
          }
          if (data.data.contactPage) {
            setContactSettings((prev) => ({
              address: data.data.contactPage.address || prev.address,
              phone: data.data.contactPage.phone || prev.phone,
              email: data.data.contactPage.email || prev.email,
              workingHours: data.data.contactPage.workingHours || prev.workingHours,
              mapLat: data.data.contactPage.mapLat ?? prev.mapLat,
              mapLng: data.data.contactPage.mapLng ?? prev.mapLng,
              mapZoom: data.data.contactPage.mapZoom ?? prev.mapZoom,
              socialMedia: data.data.contactPage.socialMedia || prev.socialMedia,
              faq: data.data.contactPage.faq || prev.faq,
              mapEmbed: data.data.contactPage.mapEmbed || prev.mapEmbed,
              heroTitle: data.data.contactPage.heroTitle || prev.heroTitle,
              heroDescription: data.data.contactPage.heroDescription || prev.heroDescription,
              formTitle: data.data.contactPage.formTitle || prev.formTitle,
              formDescription: data.data.contactPage.formDescription || prev.formDescription,
              formTopics: data.data.contactPage.formTopics || prev.formTopics,
              mapTitle: data.data.contactPage.mapTitle || prev.mapTitle,
              mapDescription: data.data.contactPage.mapDescription || prev.mapDescription,
              socialTitle: data.data.contactPage.socialTitle || prev.socialTitle,
              socialDescription: data.data.contactPage.socialDescription || prev.socialDescription,
              ctaPrimaryText: data.data.contactPage.ctaPrimaryText || prev.ctaPrimaryText,
              ctaPrimaryLink: data.data.contactPage.ctaPrimaryLink || prev.ctaPrimaryLink,
              ctaSecondaryText: data.data.contactPage.ctaSecondaryText || prev.ctaSecondaryText,
              ctaSecondaryLink: data.data.contactPage.ctaSecondaryLink || prev.ctaSecondaryLink,
            }));
          }
          if (data.data.about) {
            setAboutSettings((prev) => ({
              title: data.data.about.title || prev.title,
              subtitle: data.data.about.subtitle || prev.subtitle,
              description: data.data.about.description || prev.description,
              mission: data.data.about.mission || prev.mission,
              vision: data.data.about.vision || prev.vision,
              imageUrl: data.data.about.imageUrl || prev.imageUrl,
              badgeText: data.data.about.badgeText || prev.badgeText,
              badgeSubtext: data.data.about.badgeSubtext || prev.badgeSubtext,
            }));
          }
          if (data.data.logo) {
            setLogoSettings((prev) => ({
              logoUrl: data.data.logo.logoUrl || prev.logoUrl,
              faviconUrl: data.data.logo.faviconUrl || prev.faviconUrl,
              logoWidth: data.data.logo.logoWidth ?? prev.logoWidth,
              logoHeight: data.data.logo.logoHeight ?? prev.logoHeight,
            }));
          }
        }
      })
      .catch(() => {});
  }, [loadTheme]);

  const handleMaintenanceSave = async () => {
    setMaintenanceSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenance: {
            enabled: maintenanceEnabled,
            message: maintenanceMessage,
          },
        }),
      });
      const data = await res.json();
      setToast({
        type: data.success ? "success" : "error",
        message: data.message || "Hata oluştu",
      });
    } catch {
      setToast({ type: "error", message: "Bağlantı hatası" });
    }
    setMaintenanceSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStorageSave = async () => {
    setStorageSaving(true);
    try {
      const payload: Record<string, unknown> = { provider: storageProvider };
      if (storageProvider === "r2") {
        payload.r2 = storageR2;
      }
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storage: payload }),
      });
      const data = await res.json();
      setToast({
        type: data.success ? "success" : "error",
        message: data.message || "Hata oluştu",
      });
    } catch {
      setToast({ type: "error", message: "Bağlantı hatası" });
    }
    setStorageSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFooterSave = async () => {
    setFooterSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ footer: footerSettings }),
      });
      const data = await res.json();
      setToast({
        type: data.success ? "success" : "error",
        message: data.message || "Hata oluştu",
      });
    } catch {
      setToast({ type: "error", message: "Bağlantı hatası" });
    }
    setFooterSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatsSave = async () => {
    setStatsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats: statsSettings }),
      });
      const data = await res.json();
      setToast({
        type: data.success ? "success" : "error",
        message: data.message || "Hata oluştu",
      });
    } catch {
      setToast({ type: "error", message: "Bağlantı hatası" });
    }
    setStatsSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleContactSave = async () => {
    setContactSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactPage: contactSettings }),
      });
      const data = await res.json();
      setToast({
        type: data.success ? "success" : "error",
        message: data.message || "Hata oluştu",
      });
    } catch {
      setToast({ type: "error", message: "Bağlantı hatası" });
    }
    setContactSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAboutSave = async () => {
    setAboutSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about: aboutSettings }),
      });
      const data = await res.json();
      setToast({
        type: data.success ? "success" : "error",
        message: data.message || "Hata oluştu",
      });
    } catch {
      setToast({ type: "error", message: "Bağlantı hatası" });
    }
    setAboutSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogoSave = async () => {
    setLogoSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo: logoSettings }),
      });
      const data = await res.json();
      setToast({
        type: data.success ? "success" : "error",
        message: data.message || "Hata oluştu",
      });
    } catch {
      setToast({ type: "error", message: "Bağlantı hatası" });
    }
    setLogoSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

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
          {/* ===== LOGO & FAVICON ===== */}
          {activeTab === "logo" && (
            <>
              <div className="card p-6">
                <h3 className="font-bold text-foreground mb-1">Site Logosu</h3>
                <p className="text-sm text-muted mb-4">
                  Navbar ve footer&apos;da görüntülenecek logo görseli. Şeffaf arka planlı PNG veya SVG önerilir.
                </p>
                <ImageUpload
                  value={logoSettings.logoUrl}
                  onChange={(url) => setLogoSettings((prev) => ({ ...prev, logoUrl: url }))}
                  folder="branding"
                  label="Logo Yükle"
                />
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-foreground mb-1">Favicon</h3>
                <p className="text-sm text-muted mb-4">
                  Tarayıcı sekmesinde görüntülenecek ikon. 32x32 veya 64x64 PNG önerilir.
                </p>
                <ImageUpload
                  value={logoSettings.faviconUrl}
                  onChange={(url) => setLogoSettings((prev) => ({ ...prev, faviconUrl: url }))}
                  folder="branding"
                  label="Favicon Yükle"
                  accept="image/png,image/x-icon,image/svg+xml"
                />
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-foreground mb-4">Logo Boyutları</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Genişlik: {logoSettings.logoWidth}px
                    </label>
                    <input
                      type="range"
                      min={20}
                      max={400}
                      value={logoSettings.logoWidth}
                      onChange={(e) => setLogoSettings((prev) => ({ ...prev, logoWidth: Number(e.target.value) }))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted mt-1">
                      <span>20px</span>
                      <span>400px</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Yükseklik: {logoSettings.logoHeight}px
                    </label>
                    <input
                      type="range"
                      min={16}
                      max={200}
                      value={logoSettings.logoHeight}
                      onChange={(e) => setLogoSettings((prev) => ({ ...prev, logoHeight: Number(e.target.value) }))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted mt-1">
                      <span>16px</span>
                      <span>200px</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Canlı Önizleme */}
              {logoSettings.logoUrl && (
                <div className="card p-6">
                  <h3 className="font-bold text-foreground mb-4">Canlı Önizleme</h3>
                  <div className="space-y-4">
                    <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
                      <span className="text-xs text-muted mr-2">Navbar:</span>
                      <img
                        src={logoSettings.logoUrl}
                        alt="Logo önizleme"
                        style={{ width: logoSettings.logoWidth, height: logoSettings.logoHeight }}
                        className="object-contain"
                      />
                    </div>
                    <div className="bg-primary-dark rounded-xl p-4 flex items-center gap-3">
                      <span className="text-xs text-white/50 mr-2">Footer:</span>
                      <img
                        src={logoSettings.logoUrl}
                        alt="Logo footer önizleme"
                        style={{ width: Math.round(logoSettings.logoWidth * 0.75), height: Math.round(logoSettings.logoHeight * 0.75) }}
                        className="object-contain brightness-0 invert"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleLogoSave}
                  disabled={logoSaving}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {logoSaving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </>
          )}

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
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-bold text-foreground mb-2">Hazır Temalar</h3>
                <p className="text-sm text-muted">Bir tema seçin, ardından istediğiniz renkleri özelleştirin. {Object.keys(PRESET_THEMES).length} hazır tema mevcuttur.</p>
              </div>
              {Object.entries(
                Object.entries(PRESET_THEMES).reduce<Record<string, Array<{ id: string; label: string; description: string; category?: string; light: ThemeColors; dark: ThemeColors }>>>((acc, [id, preset]) => {
                  const cat = preset.category || "Genel";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push({ id, ...preset });
                  return acc;
                }, {})
              ).map(([category, presets]) => (
                <div key={category} className="card p-6">
                  <h4 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-primary rounded-full" />
                    {category}
                    <span className="text-xs font-normal text-muted">({presets.length})</span>
                  </h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {presets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                          theme.activePreset === preset.id
                            ? "border-primary shadow-md bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex -space-x-1">
                            {[preset.light.primary, preset.light.primaryDark, preset.light.secondary, preset.light.accent].map((color, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          {theme.activePreset === preset.id && (
                            <span className="ml-auto text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Aktif</span>
                          )}
                        </div>
                        <h4 className="font-semibold text-foreground text-xs">{preset.label}</h4>
                        <p className="text-[11px] text-muted mt-0.5 leading-tight">{preset.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== BAKIM MODU ===== */}
          {activeTab === "maintenance" && (
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-2">Bakım Modu</h3>
              <p className="text-sm text-muted mb-6">
                Bakım modunu aktif ettiğinizde, siteye gelen ziyaretçiler bakım
                sayfasını görür. Admin paneli etkilenmez.
              </p>

              {/* Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border mb-6">
                <div>
                  <p className="font-semibold text-foreground">
                    Bakım Modu {maintenanceEnabled ? "Aktif" : "Pasif"}
                  </p>
                  <p className="text-sm text-muted">
                    {maintenanceEnabled
                      ? "Site ziyaretçileri bakım sayfasını görüyor"
                      : "Site normal şekilde çalışıyor"}
                  </p>
                </div>
                <button
                  onClick={() => setMaintenanceEnabled(!maintenanceEnabled)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    maintenanceEnabled ? "bg-red-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow ${
                      maintenanceEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Warning */}
              {maintenanceEnabled && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Dikkat!</p>
                    <p>Bakım modu aktif olduğunda tüm ziyaretçiler bakım sayfasını görecektir. Sadece admin paneline giriş yapanlar siteyi yönetebilir.</p>
                  </div>
                </div>
              )}

              {/* Custom message */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Bakım Mesajı (Opsiyonel)
                </label>
                <textarea
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  placeholder="Sitemiz şu anda bakım çalışması nedeniyle geçici olarak hizmet dışıdır..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
                <p className="text-xs text-muted mt-1">
                  Boş bırakırsanız varsayılan bakım mesajı gösterilir.
                </p>
              </div>

              {/* Save button */}
              <button
                onClick={handleMaintenanceSave}
                disabled={maintenanceSaving}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors ${
                  maintenanceEnabled
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-primary hover:bg-primary/90"
                } disabled:opacity-50`}
              >
                {maintenanceSaving
                  ? "Kaydediliyor..."
                  : maintenanceEnabled
                  ? "Bakım Modunu Aktif Et ve Kaydet"
                  : "Kaydet"}
              </button>
            </div>
          )}

          {/* ===== DEPOLAMA ===== */}
          {activeTab === "storage" && (
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-2">Depolama Ayarları</h3>
              <p className="text-sm text-muted mb-6">
                Yüklenen dosyaların nerede saklanacağını seçin. Cloudflare R2 veya sunucu üzerinde yerel depolama kullanabilirsiniz.
              </p>

              {/* Provider seçimi */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-semibold text-foreground block">Depolama Sağlayıcı</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStorageProvider("local")}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      storageProvider === "local"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        storageProvider === "local" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">Yerel Sunucu</p>
                        <p className="text-xs text-muted">Dosyalar sunucunuzda saklanır</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStorageProvider("r2")}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      storageProvider === "r2"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        storageProvider === "r2" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">Cloudflare R2</p>
                        <p className="text-xs text-muted">Bulut depolama (CDN destekli)</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Local bilgi */}
              {storageProvider === "local" && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-6 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Yerel Depolama</p>
                    <p>Dosyalar sunucunuzun <code className="bg-blue-100 px-1 rounded">public/uploads</code> klasörüne kaydedilecektir. Harici servis gerektirmez.</p>
                  </div>
                </div>
              )}

              {/* R2 Ayarları */}
              {storageProvider === "r2" && (
                <div className="space-y-4 mb-6">
                  <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-lg text-sm flex items-start gap-3 mb-4">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    <div>
                      <p className="font-semibold">Cloudflare R2</p>
                      <p>Cloudflare R2 hesabınızdan API anahtarlarınızı girin. Bu bilgiler sunucuda şifreli saklanır.</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">Account ID</label>
                    <input
                      type="text"
                      value={storageR2.accountId}
                      onChange={(e) => setStorageR2({ ...storageR2, accountId: e.target.value })}
                      placeholder="Cloudflare Account ID"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">Access Key ID</label>
                    <input
                      type="text"
                      value={storageR2.accessKeyId}
                      onChange={(e) => setStorageR2({ ...storageR2, accessKeyId: e.target.value })}
                      placeholder="R2 Access Key ID"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">Secret Access Key</label>
                    <input
                      type="password"
                      value={storageR2.secretAccessKey}
                      onChange={(e) => setStorageR2({ ...storageR2, secretAccessKey: e.target.value })}
                      placeholder="R2 Secret Access Key"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                    <p className="text-xs text-muted mt-1">Güvenlik nedeniyle mevcut anahtar maskelenmiş gösterilir</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-1.5 block">Bucket Name</label>
                      <input
                        type="text"
                        value={storageR2.bucketName}
                        onChange={(e) => setStorageR2({ ...storageR2, bucketName: e.target.value })}
                        placeholder="dernekpro"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-1.5 block">Public URL</label>
                      <input
                        type="text"
                        value={storageR2.publicUrl}
                        onChange={(e) => setStorageR2({ ...storageR2, publicUrl: e.target.value })}
                        placeholder="https://pub-xxx.r2.dev"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                      <p className="text-xs text-muted mt-1">R2 bucket&apos;ınızın herkese açık URL&apos;si (opsiyonel)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Kaydet */}
              <button
                onClick={handleStorageSave}
                disabled={storageSaving}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {storageSaving ? "Kaydediliyor..." : "Depolama Ayarlarını Kaydet"}
              </button>
            </div>
          )}

          {/* ===== FOOTER ===== */}
          {activeTab === "stats" && (
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-2">İstatistik Ayarları</h3>
              <p className="text-sm text-muted mb-6">
                Ana sayfadaki istatistik bölümünün içeriklerini düzenleyin.
              </p>

              <div className="space-y-5">
                {/* Başlık */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Bölüm Başlığı</label>
                  <input
                    type="text"
                    value={statsSettings.title}
                    onChange={(e) => setStatsSettings({ ...statsSettings, title: e.target.value })}
                    placeholder="Rakamlarla Biz"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <p className="text-xs text-muted mt-1">İstatistik bölümünün üst başlığı (boş bırakılırsa gizlenir)</p>
                </div>

                {/* Alt Başlık */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Alt Başlık</label>
                  <textarea
                    value={statsSettings.subtitle}
                    onChange={(e) => setStatsSettings({ ...statsSettings, subtitle: e.target.value })}
                    placeholder="Yılların deneyimi ve binlerce gönüllünün desteğiyle..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                </div>

                {/* İstatistik Kartları */}
                <div className="border-t border-border pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-foreground">İstatistik Kartları</label>
                    {statsSettings.items.length < 8 && (
                      <button
                        type="button"
                        onClick={() =>
                          setStatsSettings({
                            ...statsSettings,
                            items: [...statsSettings.items, { label: "", value: 0, suffix: "+", icon: "star" }],
                          })
                        }
                        className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Ekle
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {statsSettings.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border bg-background-alt/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-muted uppercase">Kart {idx + 1}</span>
                          {statsSettings.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = statsSettings.items.filter((_, i) => i !== idx);
                                setStatsSettings({ ...statsSettings, items: updated });
                              }}
                              className="text-xs text-red-500 hover:text-red-600 font-semibold"
                            >
                              Sil
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Etiket */}
                          <div>
                            <label className="text-xs font-medium text-muted mb-1 block">Etiket</label>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => {
                                const updated = [...statsSettings.items];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                setStatsSettings({ ...statsSettings, items: updated });
                              }}
                              placeholder="Yardım Kampanyası"
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            />
                          </div>

                          {/* Değer */}
                          <div>
                            <label className="text-xs font-medium text-muted mb-1 block">Değer</label>
                            <input
                              type="number"
                              value={item.value}
                              onChange={(e) => {
                                const updated = [...statsSettings.items];
                                updated[idx] = { ...updated[idx], value: Number(e.target.value) || 0 };
                                setStatsSettings({ ...statsSettings, items: updated });
                              }}
                              placeholder="150"
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            />
                          </div>

                          {/* Sonek */}
                          <div>
                            <label className="text-xs font-medium text-muted mb-1 block">Sonek</label>
                            <input
                              type="text"
                              value={item.suffix}
                              onChange={(e) => {
                                const updated = [...statsSettings.items];
                                updated[idx] = { ...updated[idx], suffix: e.target.value };
                                setStatsSettings({ ...statsSettings, items: updated });
                              }}
                              placeholder="+"
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            />
                            <p className="text-xs text-muted mt-0.5">Ör: +, Yıl, K, M</p>
                          </div>

                          {/* İkon */}
                          <div>
                            <label className="text-xs font-medium text-muted mb-1 block">İkon</label>
                            <select
                              value={item.icon}
                              onChange={(e) => {
                                const updated = [...statsSettings.items];
                                updated[idx] = { ...updated[idx], icon: e.target.value };
                                setStatsSettings({ ...statsSettings, items: updated });
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            >
                              <option value="heart">❤️ Kalp</option>
                              <option value="users">👥 Kullanıcılar</option>
                              <option value="calendar">📅 Takvim</option>
                              <option value="hand">🤲 El</option>
                              <option value="globe">🌍 Dünya</option>
                              <option value="star">⭐ Yıldız</option>
                              <option value="trophy">🏆 Kupa</option>
                              <option value="target">🎯 Hedef</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kaydet */}
              <button
                onClick={handleStatsSave}
                disabled={statsSaving}
                className="mt-6 px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {statsSaving ? "Kaydediliyor..." : "İstatistik Ayarlarını Kaydet"}
              </button>
            </div>
          )}

          {activeTab === "about" && (
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-2">Hakkımızda Bölümü</h3>
              <p className="text-sm text-muted mb-6">
                Ana sayfadaki &quot;Hakkımızda&quot; bölümünün içeriklerini düzenleyin.
              </p>

              <div className="space-y-5">
                {/* Genel */}
                <div className="p-4 rounded-lg border border-border bg-background-alt/20">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Genel Bilgiler
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted mb-1 block">Başlık</label>
                      <input
                        value={aboutSettings.title}
                        onChange={(e) => setAboutSettings({ ...aboutSettings, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Güçlü Sivil Toplum, Güçlü Toplum"
                        maxLength={200}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted mb-1 block">Alt Başlık</label>
                      <input
                        value={aboutSettings.subtitle}
                        onChange={(e) => setAboutSettings({ ...aboutSettings, subtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Hakkımızda"
                        maxLength={200}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted mb-1 block">Açıklama</label>
                      <textarea
                        rows={4}
                        value={aboutSettings.description}
                        onChange={(e) => setAboutSettings({ ...aboutSettings, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        placeholder="Derneğinizin kısa tanıtım metni..."
                        maxLength={2000}
                      />
                      <p className="text-xs text-muted mt-1">{aboutSettings.description.length}/2000 karakter</p>
                    </div>
                  </div>
                </div>

                {/* Misyon / Vizyon */}
                <div className="p-4 rounded-lg border border-border bg-background-alt/20">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    Misyon &amp; Vizyon
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted mb-1 block">Misyon</label>
                      <textarea
                        rows={3}
                        value={aboutSettings.mission}
                        onChange={(e) => setAboutSettings({ ...aboutSettings, mission: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        placeholder="Toplumsal dayanışmayı güçlendirerek..."
                        maxLength={1000}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted mb-1 block">Vizyon</label>
                      <textarea
                        rows={3}
                        value={aboutSettings.vision}
                        onChange={(e) => setAboutSettings({ ...aboutSettings, vision: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        placeholder="Her bireyin eşit haklara sahip olduğu..."
                        maxLength={1000}
                      />
                    </div>
                  </div>
                </div>

                {/* Görsel */}
                <div className="p-4 rounded-lg border border-border bg-background-alt/20">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Görsel
                  </h4>
                  <div>
                    <label className="text-xs text-muted mb-1 block">Görsel URL</label>
                    <input
                      value={aboutSettings.imageUrl}
                      onChange={(e) => setAboutSettings({ ...aboutSettings, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="https://example.com/about-image.jpg"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted mt-1">Boş bırakılırsa gradient arka plan gösterilir</p>
                    {aboutSettings.imageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border w-48 h-32 relative">
                        <img src={aboutSettings.imageUrl} alt="Önizleme" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* İstatistik Badge */}
                <div className="p-4 rounded-lg border border-border bg-background-alt/20">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    Floating Badge
                  </h4>
                  <p className="text-xs text-muted mb-3">Görsel üzerinde kayan istatistik rozeti</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted mb-1 block">Badge Metni</label>
                      <input
                        value={aboutSettings.badgeText}
                        onChange={(e) => setAboutSettings({ ...aboutSettings, badgeText: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="50K+"
                        maxLength={50}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted mb-1 block">Badge Alt Metni</label>
                      <input
                        value={aboutSettings.badgeSubtext}
                        onChange={(e) => setAboutSettings({ ...aboutSettings, badgeSubtext: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Ulaşılan Kişi"
                        maxLength={100}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kaydet */}
              <button
                onClick={handleAboutSave}
                disabled={aboutSaving}
                className="mt-6 px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {aboutSaving ? "Kaydediliyor..." : "Hakkımızda Ayarlarını Kaydet"}
              </button>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-2">İletişim Sayfası Ayarları</h3>
              <p className="text-sm text-muted mb-6">
                İletişim sayfasında görüntülenecek bilgileri, harita konumunu, SSS ve sosyal medya bağlantılarını düzenleyin.
              </p>

              <div className="space-y-5">
                {/* Sayfa İçerikleri */}
                <div className="p-4 rounded-lg border border-border bg-background-alt/20">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" /></svg>
                    Hero Bölümü
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted mb-1 block">Hero Başlık</label>
                      <input
                        value={contactSettings.heroTitle}
                        onChange={(e) => setContactSettings({ ...contactSettings, heroTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="İletişim"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted mb-1 block">Hero Açıklama</label>
                      <textarea
                        rows={2}
                        value={contactSettings.heroDescription}
                        onChange={(e) => setContactSettings({ ...contactSettings, heroDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Her türlü soru, öneri ve iş birliği teklifleriniz için bizimle iletişime geçebilirsiniz."
                        maxLength={300}
                      />
                    </div>
                  </div>
                </div>

                {/* Adres */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Adres</label>
                  <textarea
                    rows={2}
                    value={contactSettings.address}
                    onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Beşiktaş Mahallesi, Dernek Sokak No:42/A..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">Telefon</label>
                    <textarea
                      rows={2}
                      value={contactSettings.phone}
                      onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="+90 (212) 555 0 123"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">E-posta</label>
                    <textarea
                      rows={2}
                      value={contactSettings.email}
                      onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="info@dernek.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Çalışma Saatleri</label>
                  <textarea
                    rows={2}
                    value={contactSettings.workingHours}
                    onChange={(e) => setContactSettings({ ...contactSettings, workingHours: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Pazartesi - Cuma: 09:00 - 18:00"
                  />
                </div>

                {/* Form Bölümü */}
                <div className="p-4 rounded-lg border border-border bg-background-alt/20">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Form Bölümü
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted mb-1 block">Form Başlık</label>
                      <input
                        value={contactSettings.formTitle}
                        onChange={(e) => setContactSettings({ ...contactSettings, formTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Mesaj Gönderin"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted mb-1 block">Form Açıklama</label>
                      <textarea
                        rows={2}
                        value={contactSettings.formDescription}
                        onChange={(e) => setContactSettings({ ...contactSettings, formDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Formu doldurarak bize ulaşabilirsiniz."
                        maxLength={500}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs text-muted">Form Konuları</label>
                        {contactSettings.formTopics.length < 15 && (
                          <button
                            onClick={() => setContactSettings({ ...contactSettings, formTopics: [...contactSettings.formTopics, ""] })}
                            className="text-xs text-primary hover:text-primary/80 font-medium"
                          >
                            + Konu Ekle
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {contactSettings.formTopics.map((topic, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              value={topic}
                              onChange={(e) => {
                                const updated = [...contactSettings.formTopics];
                                updated[idx] = e.target.value;
                                setContactSettings({ ...contactSettings, formTopics: updated });
                              }}
                              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                              placeholder="Konu adı..."
                              maxLength={100}
                            />
                            <button
                              onClick={() => {
                                const updated = contactSettings.formTopics.filter((_, i) => i !== idx);
                                setContactSettings({ ...contactSettings, formTopics: updated });
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))}
                        {contactSettings.formTopics.length === 0 && (
                          <p className="text-xs text-muted italic">Boş bırakılırsa varsayılan konular kullanılır</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Harita */}
                <div className="p-4 rounded-lg border border-border bg-background-alt/20">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Harita Bölümü
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted mb-1 block">Harita Başlık</label>
                      <input
                        value={contactSettings.mapTitle}
                        onChange={(e) => setContactSettings({ ...contactSettings, mapTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Bizi Bulun"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted mb-1 block">Harita Açıklama</label>
                      <textarea
                        rows={2}
                        value={contactSettings.mapDescription}
                        onChange={(e) => setContactSettings({ ...contactSettings, mapDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Merkez ofisimiz ve şubelerimizi haritadan görüntüleyebilirsiniz."
                        maxLength={500}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs text-muted mb-1 block">Google Maps Iframe Kodu</label>
                    <textarea
                      rows={4}
                      value={contactSettings.mapEmbed}
                      onChange={(e) => setContactSettings({ ...contactSettings, mapEmbed: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder='Google Maps > Paylaş > Haritayı yerleştir bölümünden kopyalanan <iframe ...> kodunu yapıştırın'
                    />
                    <p className="text-xs text-muted mt-1">Google Maps&apos;te konum arayın &gt; Paylaş &gt; Haritayı yerleştir &gt; HTML&apos;yi kopyala</p>
                    {contactSettings.mapEmbed && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border" dangerouslySetInnerHTML={{ __html: contactSettings.mapEmbed.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="200"') }} />
                    )}
                  </div>
                </div>

                {/* Sosyal Medya Bölümü */}
                <div className="p-4 rounded-lg border border-border bg-background-alt/20">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                    Sosyal Medya Bölümü
                  </h4>
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="text-xs text-muted mb-1 block">Sosyal Medya Başlık</label>
                      <input
                        value={contactSettings.socialTitle}
                        onChange={(e) => setContactSettings({ ...contactSettings, socialTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Sosyal Medyada Takip Edin"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted mb-1 block">Sosyal Medya Açıklama</label>
                      <textarea
                        rows={2}
                        value={contactSettings.socialDescription}
                        onChange={(e) => setContactSettings({ ...contactSettings, socialDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Güncel gelişmelerden haberdar olmak için sosyal medya hesaplarımızı takip edin."
                        maxLength={300}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-foreground">Sosyal Medya Linkleri</h4>
                    <button
                      onClick={() => setContactSettings({ ...contactSettings, socialMedia: [...contactSettings.socialMedia, { platform: "", url: "" }] })}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      + Ekle
                    </button>
                  </div>
                  <div className="space-y-2">
                    {contactSettings.socialMedia.map((sm, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <select
                          value={sm.platform}
                          onChange={(e) => {
                            const updated = [...contactSettings.socialMedia];
                            updated[idx] = { ...updated[idx], platform: e.target.value };
                            setContactSettings({ ...contactSettings, socialMedia: updated });
                          }}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="">Platform Seçin</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Twitter">Twitter / X</option>
                          <option value="YouTube">YouTube</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="TikTok">TikTok</option>
                          <option value="WhatsApp">WhatsApp</option>
                        </select>
                        <input
                          value={sm.url}
                          onChange={(e) => {
                            const updated = [...contactSettings.socialMedia];
                            updated[idx] = { ...updated[idx], url: e.target.value };
                            setContactSettings({ ...contactSettings, socialMedia: updated });
                          }}
                          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="https://..."
                        />
                        <button
                          onClick={() => {
                            const updated = contactSettings.socialMedia.filter((_, i) => i !== idx);
                            setContactSettings({ ...contactSettings, socialMedia: updated });
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                    {contactSettings.socialMedia.length === 0 && (
                      <p className="text-xs text-muted italic">Henüz sosyal medya bağlantısı eklenmemiş</p>
                    )}
                  </div>
                </div>

                {/* SSS */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-foreground">Sıkça Sorulan Sorular (SSS)</h4>
                    <button
                      onClick={() => setContactSettings({ ...contactSettings, faq: [...contactSettings.faq, { question: "", answer: "" }] })}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      + Soru Ekle
                    </button>
                  </div>
                  <div className="space-y-3">
                    {contactSettings.faq.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-border bg-background-alt/30">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <input
                            value={item.question}
                            onChange={(e) => {
                              const updated = [...contactSettings.faq];
                              updated[idx] = { ...updated[idx], question: e.target.value };
                              setContactSettings({ ...contactSettings, faq: updated });
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="Soru..."
                          />
                          <button
                            onClick={() => {
                              const updated = contactSettings.faq.filter((_, i) => i !== idx);
                              setContactSettings({ ...contactSettings, faq: updated });
                            }}
                            className="text-red-500 hover:text-red-700 p-1 mt-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={item.answer}
                          onChange={(e) => {
                            const updated = [...contactSettings.faq];
                            updated[idx] = { ...updated[idx], answer: e.target.value };
                            setContactSettings({ ...contactSettings, faq: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Cevap..."
                        />
                      </div>
                    ))}
                    {contactSettings.faq.length === 0 && (
                      <p className="text-xs text-muted italic">Henüz SSS eklenmemiş</p>
                    )}
                  </div>
                </div>

                {/* CTA Butonları */}
                <div className="p-4 rounded-lg border border-border bg-background-alt/20">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    CTA Butonları
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="text-xs text-muted font-semibold">Birincil Buton</p>
                      <div>
                        <label className="text-xs text-muted mb-1 block">Buton Metni</label>
                        <input
                          value={contactSettings.ctaPrimaryText}
                          onChange={(e) => setContactSettings({ ...contactSettings, ctaPrimaryText: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Üye Ol"
                          maxLength={50}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted mb-1 block">Buton Linki</label>
                        <input
                          value={contactSettings.ctaPrimaryLink}
                          onChange={(e) => setContactSettings({ ...contactSettings, ctaPrimaryLink: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="/uye-ol"
                          maxLength={200}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs text-muted font-semibold">İkincil Buton</p>
                      <div>
                        <label className="text-xs text-muted mb-1 block">Buton Metni</label>
                        <input
                          value={contactSettings.ctaSecondaryText}
                          onChange={(e) => setContactSettings({ ...contactSettings, ctaSecondaryText: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Bağış Yap"
                          maxLength={50}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted mb-1 block">Buton Linki</label>
                        <input
                          value={contactSettings.ctaSecondaryLink}
                          onChange={(e) => setContactSettings({ ...contactSettings, ctaSecondaryLink: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="/bagis"
                          maxLength={200}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kaydet */}
              <button
                onClick={handleContactSave}
                disabled={contactSaving}
                className="mt-6 px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {contactSaving ? "Kaydediliyor..." : "İletişim Ayarlarını Kaydet"}
              </button>
            </div>
          )}

          {activeTab === "footer" && (
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-2">Footer Ayarları</h3>
              <p className="text-sm text-muted mb-6">
                Sitenizin alt bilgi bölümündeki içerikleri özelleştirin.
              </p>

              <div className="space-y-5">
                {/* Marka Adı */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Marka Adı</label>
                  <input
                    type="text"
                    value={footerSettings.brandName}
                    onChange={(e) => setFooterSettings({ ...footerSettings, brandName: e.target.value })}
                    placeholder="DernekPro"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <p className="text-xs text-muted mt-1">Footer&apos;da logo yanında gösterilen marka adı</p>
                </div>

                {/* Tagline */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Slogan / Tagline</label>
                  <textarea
                    value={footerSettings.tagline}
                    onChange={(e) => setFooterSettings({ ...footerSettings, tagline: e.target.value })}
                    placeholder="Türkiye'nin en kapsamlı dernek yönetim ve web sitesi platformu."
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                  <p className="text-xs text-muted mt-1">Footer marka bölümünde gösterilen kısa açıklama</p>
                </div>

                {/* Copyright */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Copyright Metni</label>
                  <input
                    type="text"
                    value={footerSettings.copyright}
                    onChange={(e) => setFooterSettings({ ...footerSettings, copyright: e.target.value })}
                    placeholder="DernekPro. Tüm hakları saklıdır."
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <p className="text-xs text-muted mt-1">Yıl otomatik eklenir. Ör: &copy; 2025 [copyright metni]</p>
                </div>

                {/* Bülten Ayarları */}
                <div className="border-t border-border pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground block">Bülten Abonelik Bölümü</label>
                      <p className="text-xs text-muted mt-0.5">Footer üstündeki e-posta abonelik bandını göster/gizle</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFooterSettings({ ...footerSettings, showNewsletter: !footerSettings.showNewsletter })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        footerSettings.showNewsletter ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          footerSettings.showNewsletter ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {footerSettings.showNewsletter && (
                    <div className="space-y-4 pl-0">
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-1.5 block">Bülten Başlığı</label>
                        <input
                          type="text"
                          value={footerSettings.newsletterTitle}
                          onChange={(e) => setFooterSettings({ ...footerSettings, newsletterTitle: e.target.value })}
                          placeholder="Bültenimize Abone Olun"
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-1.5 block">Bülten Açıklaması</label>
                        <input
                          type="text"
                          value={footerSettings.newsletterDescription}
                          onChange={(e) => setFooterSettings({ ...footerSettings, newsletterDescription: e.target.value })}
                          placeholder="Faaliyetler, etkinlikler ve duyurulardan haberdar olun."
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Kaydet */}
              <button
                onClick={handleFooterSave}
                disabled={footerSaving}
                className="mt-6 px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {footerSaving ? "Kaydediliyor..." : "Footer Ayarlarını Kaydet"}
              </button>
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
