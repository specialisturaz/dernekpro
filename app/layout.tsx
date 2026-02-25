import type { Metadata } from "next";
import { Nunito, Merriweather } from "next/font/google";
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
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://dernekpro.com"
  ),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "DernekPro",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${nunito.variable} ${merriweather.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
