import type { Metadata } from "next";
import { Nunito, Merriweather } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-primary",
  display: "swap",
  weight: ["300", "400", "600", "700", "800"],
});

const merriweather = Merriweather({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  display: "swap",
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "DernekPro — Dernek Yönetim ve Web Sistemi",
    template: "%s | DernekPro",
  },
  description:
    "Türkiye'nin en kapsamlı dernek yönetim ve web sitesi platformu. Üye yönetimi, bağış sistemi, etkinlik takvimi ve daha fazlası.",
  keywords: [
    "dernek yönetimi",
    "dernek web sitesi",
    "bağış sistemi",
    "üye yönetimi",
    "STK",
    "sivil toplum",
    "dernek",
    "yardım derneği",
    "bağış",
    "etkinlik",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://dernekpro.com"
  ),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "DernekPro",
    title: "DernekPro — Dernek Yönetim ve Web Sistemi",
    description:
      "Türkiye'nin en kapsamlı dernek yönetim ve web sitesi platformu. Üye yönetimi, bağış sistemi, etkinlik takvimi ve daha fazlası.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "DernekPro — Dernek Yönetim ve Web Sistemi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DernekPro — Dernek Yönetim ve Web Sistemi",
    description:
      "Türkiye'nin en kapsamlı dernek yönetim ve web sitesi platformu.",
    images: ["/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://dernekpro.com",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
  category: "nonprofit",
};

// Blocking inline script to prevent theme FOUC (Flash of Unstyled Content).
// Reads the cached theme from localStorage and applies CSS custom properties
// synchronously before React hydrates, so users never see the default green theme
// flash before their saved custom theme loads.
const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('dernekpro-theme');
    if (!t) return;
    var p = JSON.parse(t);
    var c = p.light;
    if (!c) return;
    var r = document.documentElement;
    var m = {
      primary: '--color-primary',
      primaryLight: '--color-primary-light',
      primaryDark: '--color-primary-dark',
      secondary: '--color-secondary',
      accent: '--color-accent',
      text: '--color-text',
      textMuted: '--color-text-muted',
      bg: '--color-bg',
      bgAlt: '--color-bg-alt',
      border: '--color-border'
    };
    for (var k in m) {
      if (c[k]) r.style.setProperty(m[k], c[k]);
    }
    if (p.typography) {
      if (p.typography.fontPrimary) r.style.setProperty('--font-primary', '"' + p.typography.fontPrimary + '", system-ui, sans-serif');
      if (p.typography.fontHeading) r.style.setProperty('--font-heading', '"' + p.typography.fontHeading + '", serif');
    }
    if (p.layout && p.layout.borderRadius !== undefined) {
      r.style.setProperty('--border-radius', p.layout.borderRadius + 'px');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${nunito.variable} ${merriweather.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
