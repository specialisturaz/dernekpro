import type { ThemeSettings, ThemeColors } from "@/types";

// ===== DEFAULT COLORS — matches globals.css exactly =====
export const DEFAULT_LIGHT_COLORS: ThemeColors = {
  primary: "#1a5c38",
  primaryLight: "#2d8a52",
  primaryDark: "#0f3d24",
  secondary: "#c8860a",
  accent: "#e8f5ee",
  text: "#1a1a1a",
  textMuted: "#6b7280",
  bg: "#ffffff",
  bgAlt: "#f8faf9",
  border: "#e5e7eb",
};

export const DEFAULT_DARK_COLORS: ThemeColors = {
  primary: "#2d8a52",
  primaryLight: "#3da564",
  primaryDark: "#1a5c38",
  secondary: "#d4a037",
  accent: "#1a2e22",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  bg: "#0f172a",
  bgAlt: "#1e293b",
  border: "#334155",
};

export const DEFAULT_THEME: ThemeSettings = {
  light: DEFAULT_LIGHT_COLORS,
  dark: DEFAULT_DARK_COLORS,
  typography: {
    fontPrimary: "Nunito",
    fontHeading: "Merriweather",
  },
  layout: {
    borderRadius: 12,
  },
};

// ===== CSS VARIABLE MAPPING =====
export const COLOR_TO_CSS_VAR: Record<keyof ThemeColors, string> = {
  primary: "--color-primary",
  primaryLight: "--color-primary-light",
  primaryDark: "--color-primary-dark",
  secondary: "--color-secondary",
  accent: "--color-accent",
  text: "--color-text",
  textMuted: "--color-text-muted",
  bg: "--color-bg",
  bgAlt: "--color-bg-alt",
  border: "--color-border",
};

// ===== COLOR LABELS (Turkish) =====
export const COLOR_LABELS: Record<keyof ThemeColors, { label: string; description: string }> = {
  primary: { label: "Ana Renk", description: "Butonlar, linkler ve vurgular" },
  primaryLight: { label: "Ana Renk (Açık)", description: "Hover ve açık tonlar" },
  primaryDark: { label: "Ana Renk (Koyu)", description: "Hover koyu ve başlıklar" },
  secondary: { label: "İkincil Renk", description: "Altın/turuncu vurgular" },
  accent: { label: "Aksan Renk", description: "Açık arka plan vurguları" },
  text: { label: "Ana Metin", description: "Başlıklar ve ana metin rengi" },
  textMuted: { label: "Soluk Metin", description: "Alt yazılar ve açıklamalar" },
  bg: { label: "Arka Plan", description: "Ana sayfa arka planı" },
  bgAlt: { label: "Alternatif Arka Plan", description: "Bölüm ayırıcı arka plan" },
  border: { label: "Kenarlık", description: "Kartlar ve çizgiler" },
};

// ===== PRESET THEMES =====
export const PRESET_THEMES: Record<string, { label: string; description: string; light: ThemeColors; dark: ThemeColors }> = {
  "yesil-doga": {
    label: "Yeşil Doğa",
    description: "Varsayılan doğa teması",
    light: { ...DEFAULT_LIGHT_COLORS },
    dark: { ...DEFAULT_DARK_COLORS },
  },
  "mavi-okyanus": {
    label: "Mavi Okyanus",
    description: "Profesyonel mavi tema",
    light: {
      primary: "#1e40af",
      primaryLight: "#3b82f6",
      primaryDark: "#1e3a8a",
      secondary: "#f59e0b",
      accent: "#eff6ff",
      text: "#1e293b",
      textMuted: "#64748b",
      bg: "#ffffff",
      bgAlt: "#f8fafc",
      border: "#e2e8f0",
    },
    dark: {
      primary: "#3b82f6",
      primaryLight: "#60a5fa",
      primaryDark: "#1e40af",
      secondary: "#fbbf24",
      accent: "#1e293b",
      text: "#f1f5f9",
      textMuted: "#94a3b8",
      bg: "#0f172a",
      bgAlt: "#1e293b",
      border: "#334155",
    },
  },
  "kirmizi-ates": {
    label: "Kırmızı Ateş",
    description: "Enerjik kırmızı tema",
    light: {
      primary: "#dc2626",
      primaryLight: "#ef4444",
      primaryDark: "#991b1b",
      secondary: "#ea580c",
      accent: "#fef2f2",
      text: "#1c1917",
      textMuted: "#78716c",
      bg: "#ffffff",
      bgAlt: "#fafaf9",
      border: "#e7e5e4",
    },
    dark: {
      primary: "#ef4444",
      primaryLight: "#f87171",
      primaryDark: "#dc2626",
      secondary: "#f97316",
      accent: "#292524",
      text: "#fafaf9",
      textMuted: "#a8a29e",
      bg: "#1c1917",
      bgAlt: "#292524",
      border: "#44403c",
    },
  },
  "mor-gece": {
    label: "Mor Gece",
    description: "Şık mor tema",
    light: {
      primary: "#7c3aed",
      primaryLight: "#a78bfa",
      primaryDark: "#5b21b6",
      secondary: "#06b6d4",
      accent: "#f5f3ff",
      text: "#1e1b4b",
      textMuted: "#6b7280",
      bg: "#ffffff",
      bgAlt: "#faf5ff",
      border: "#e9d5ff",
    },
    dark: {
      primary: "#a78bfa",
      primaryLight: "#c4b5fd",
      primaryDark: "#7c3aed",
      secondary: "#22d3ee",
      accent: "#1e1b4b",
      text: "#f5f3ff",
      textMuted: "#a5b4fc",
      bg: "#0f0a1e",
      bgAlt: "#1e1b4b",
      border: "#3730a3",
    },
  },
  "turuncu-gunes": {
    label: "Turuncu Güneş",
    description: "Sıcak turuncu tema",
    light: {
      primary: "#ea580c",
      primaryLight: "#f97316",
      primaryDark: "#c2410c",
      secondary: "#0891b2",
      accent: "#fff7ed",
      text: "#1c1917",
      textMuted: "#78716c",
      bg: "#ffffff",
      bgAlt: "#fffbeb",
      border: "#fed7aa",
    },
    dark: {
      primary: "#f97316",
      primaryLight: "#fb923c",
      primaryDark: "#ea580c",
      secondary: "#22d3ee",
      accent: "#431407",
      text: "#fef3c7",
      textMuted: "#a8a29e",
      bg: "#1c1917",
      bgAlt: "#292524",
      border: "#44403c",
    },
  },
};

// ===== AVAILABLE FONTS =====
export const AVAILABLE_FONTS = {
  body: [
    { value: "Nunito", label: "Nunito" },
    { value: "Inter", label: "Inter" },
    { value: "Poppins", label: "Poppins" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Roboto", label: "Roboto" },
    { value: "Lato", label: "Lato" },
    { value: "Source Sans 3", label: "Source Sans 3" },
    { value: "Montserrat", label: "Montserrat" },
  ],
  heading: [
    { value: "Merriweather", label: "Merriweather" },
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Lora", label: "Lora" },
    { value: "Poppins", label: "Poppins" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Raleway", label: "Raleway" },
    { value: "Oswald", label: "Oswald" },
    { value: "Nunito", label: "Nunito" },
  ],
};
