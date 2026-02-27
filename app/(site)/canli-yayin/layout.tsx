import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canli Yayin",
  description: "Dernegimizin canli yayin sayfasi. Etkinliklerimizi ve ozel yayinlarimizi canli olarak takip edin.",
  openGraph: {
    title: "Canli Yayin",
    description: "Dernegimizin canli yayin sayfasi. Etkinliklerimizi canli olarak takip edin.",
  },
};

export default function CanliYayinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
