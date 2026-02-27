import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DernekPro — Dernek Yönetim ve Web Sistemi",
    short_name: "DernekPro",
    description:
      "Türkiye'nin en kapsamlı dernek yönetim ve web sitesi platformu.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a5c38",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
