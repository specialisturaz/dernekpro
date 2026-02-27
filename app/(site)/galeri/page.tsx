import type { Metadata } from "next";
import GalleryClient from "@/components/site/GalleryClient";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Dernegimizin etkinlik, proje ve faaliyet fotograflari, video arsivi ve album koleksiyonu.",
  openGraph: {
    title: "Galeri",
    description: "Dernegimizin etkinlik, proje ve faaliyet fotograflari, video arsivi ve album koleksiyonu.",
  },
  alternates: {
    canonical: "/galeri",
  },
};

interface Album {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
  imageCount: number;
  coverImage: string | null;
  category: string;
}

async function getAlbums(): Promise<Album[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/gallery`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      return json.data;
    }
    return [];
  } catch {
    return [];
  }
}

export default async function GaleriPage() {
  const albums = await getAlbums();

  return <GalleryClient initialAlbums={albums} />;
}
