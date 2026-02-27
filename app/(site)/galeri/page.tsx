import type { Metadata } from "next";
import GalleryClient from "@/components/site/GalleryClient";
import { getGalleryAlbums } from "@/lib/data";

export const dynamic = "force-dynamic";

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

export default async function GaleriPage() {
  const albums = await getGalleryAlbums();

  return <GalleryClient initialAlbums={albums} />;
}
