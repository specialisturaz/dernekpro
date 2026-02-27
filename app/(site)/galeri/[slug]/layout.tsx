import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri Albumu",
  description: "Dernegimizin etkinlik ve faaliyet fotograflari.",
  openGraph: {
    title: "Galeri Albumu",
    description: "Dernegimizin etkinlik ve faaliyet fotograflari.",
  },
};

export default function GaleriAlbumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
