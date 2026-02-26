import { create } from "zustand";
import type { ThemeSettings, ThemeColors } from "@/types";
import { DEFAULT_THEME, PRESET_THEMES } from "@/lib/theme-defaults";
import { applyThemeToDOM } from "@/components/ThemeProvider";

interface ThemeState {
  theme: ThemeSettings;
  originalTheme: ThemeSettings;
  isDark: boolean;
  isLoading: boolean;
  isSaving: boolean;
  hasChanges: boolean;

  loadTheme: () => Promise<void>;
  updateLightColor: (key: keyof ThemeColors, value: string) => void;
  updateDarkColor: (key: keyof ThemeColors, value: string) => void;
  updateTypography: (key: "fontPrimary" | "fontHeading", value: string) => void;
  updateBorderRadius: (value: number) => void;
  applyPreset: (presetId: string) => void;
  saveTheme: () => Promise<{ success: boolean; message: string }>;
  resetToDefault: () => void;
  cancelChanges: () => void;
  toggleDarkPreview: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: DEFAULT_THEME,
  originalTheme: DEFAULT_THEME,
  isDark: false,
  isLoading: false,
  isSaving: false,
  hasChanges: false,

  loadTheme: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success && json.data.theme) {
        const theme = json.data.theme as ThemeSettings;
        set({ theme, originalTheme: theme, isLoading: false });
        applyThemeToDOM(theme, get().isDark);
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  updateLightColor: (key, value) => {
    const { theme, isDark } = get();
    const newTheme: ThemeSettings = {
      ...theme,
      light: { ...theme.light, [key]: value },
    };
    set({ theme: newTheme, hasChanges: true });
    applyThemeToDOM(newTheme, isDark);
  },

  updateDarkColor: (key, value) => {
    const { theme, isDark } = get();
    const newTheme: ThemeSettings = {
      ...theme,
      dark: { ...theme.dark, [key]: value },
    };
    set({ theme: newTheme, hasChanges: true });
    applyThemeToDOM(newTheme, isDark);
  },

  updateTypography: (key, value) => {
    const { theme, isDark } = get();
    const newTheme: ThemeSettings = {
      ...theme,
      typography: { ...theme.typography, [key]: value },
    };
    set({ theme: newTheme, hasChanges: true });
    applyThemeToDOM(newTheme, isDark);
  },

  updateBorderRadius: (value) => {
    const { theme, isDark } = get();
    const newTheme: ThemeSettings = {
      ...theme,
      layout: { ...theme.layout, borderRadius: value },
    };
    set({ theme: newTheme, hasChanges: true });
    applyThemeToDOM(newTheme, isDark);
  },

  applyPreset: (presetId) => {
    const preset = PRESET_THEMES[presetId];
    if (!preset) return;
    const { theme, isDark } = get();
    const newTheme: ThemeSettings = {
      ...theme,
      light: { ...preset.light },
      dark: { ...preset.dark },
      activePreset: presetId,
    };
    set({ theme: newTheme, hasChanges: true });
    applyThemeToDOM(newTheme, isDark);
  },

  saveTheme: async () => {
    set({ isSaving: true });
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: get().theme }),
      });
      const json = await res.json();
      if (json.success) {
        const saved = get().theme;
        set({ originalTheme: saved, hasChanges: false, isSaving: false });
        localStorage.setItem("dernekpro-theme", JSON.stringify(saved));
        return { success: true, message: json.message || "Kaydedildi" };
      }
      set({ isSaving: false });
      return { success: false, message: json.message || "Kaydetme başarısız" };
    } catch {
      set({ isSaving: false });
      return { success: false, message: "Bağlantı hatası" };
    }
  },

  resetToDefault: () => {
    const { isDark } = get();
    set({ theme: { ...DEFAULT_THEME }, hasChanges: true });
    applyThemeToDOM(DEFAULT_THEME, isDark);
  },

  cancelChanges: () => {
    const { originalTheme, isDark } = get();
    set({ theme: originalTheme, hasChanges: false });
    applyThemeToDOM(originalTheme, isDark);
  },

  toggleDarkPreview: () => {
    const newIsDark = !get().isDark;
    set({ isDark: newIsDark });
    applyThemeToDOM(get().theme, newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
}));
