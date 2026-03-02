"use client";

import { useEffect } from "react";
import type { ThemeSettings, ThemeColors } from "@/types";
import { COLOR_TO_CSS_VAR } from "@/lib/theme-defaults";

function loadGoogleFont(fontFamily: string) {
  if (typeof document === "undefined") return;
  const linkId = `gfont-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@300;400;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

function applyColorsToDOM(colors: ThemeColors) {
  const root = document.documentElement;
  for (const [key, cssVar] of Object.entries(COLOR_TO_CSS_VAR)) {
    const value = colors[key as keyof ThemeColors];
    if (value) {
      root.style.setProperty(cssVar, value);
    }
  }
}

function applyTypographyToDOM(typography: ThemeSettings["typography"]) {
  const root = document.documentElement;

  // Load fonts if not default
  if (typography.fontPrimary !== "Nunito") loadGoogleFont(typography.fontPrimary);
  if (typography.fontHeading !== "Merriweather") loadGoogleFont(typography.fontHeading);

  root.style.setProperty("--font-primary", `"${typography.fontPrimary}", system-ui, sans-serif`);
  root.style.setProperty("--font-heading", `"${typography.fontHeading}", serif`);
}

function applyLayoutToDOM(layout: ThemeSettings["layout"]) {
  document.documentElement.style.setProperty("--border-radius", `${layout.borderRadius}px`);
}

export function applyThemeToDOM(theme: ThemeSettings, isDark = false) {
  const colors = isDark ? theme.dark : theme.light;
  applyColorsToDOM(colors);
  applyTypographyToDOM(theme.typography);
  applyLayoutToDOM(theme.layout);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Try localStorage cache first (prevents flash)
    const cached = localStorage.getItem("dernekpro-theme");
    let cachedJson = "";
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as ThemeSettings;
        if (parsed.light && parsed.dark) {
          applyThemeToDOM(parsed);
          cachedJson = cached;
        }
      } catch {
        // Invalid cache
      }
    }

    // 2. Fetch from API (source of truth) — only if cache is old or missing
    const lastFetch = localStorage.getItem("dernekpro-theme-ts");
    const now = Date.now();
    // 5 dakika icinde tekrar fetch etme — flash onlenir
    if (lastFetch && cachedJson && now - Number(lastFetch) < 5 * 60 * 1000) {
      return;
    }

    fetch("/api/settings/theme")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const theme = json.data as ThemeSettings;
          // Validate structure before applying
          if (theme.light && theme.dark && theme.typography && theme.layout) {
            const newJson = JSON.stringify(theme);
            // Sadece tema degistiyse DOM'a uygula (flash onleme)
            if (newJson !== cachedJson) {
              applyThemeToDOM(theme);
            }
            localStorage.setItem("dernekpro-theme", newJson);
            localStorage.setItem("dernekpro-theme-ts", String(now));
          }
        }
      })
      .catch(() => {
        // Fallback to defaults already in CSS
      });
  }, []);

  return <>{children}</>;
}
