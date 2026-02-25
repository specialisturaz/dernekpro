import { MenuItem } from "@/types";

export const mainNavigation: MenuItem[] = [
  { id: "1", label: "Ana Sayfa", href: "/", order: 1 },
  {
    id: "2",
    label: "Hakkımızda",
    href: "/hakkimizda",
    order: 2,
    children: [
      { id: "2-1", label: "Tarihçe", href: "/hakkimizda", order: 1 },
      { id: "2-2", label: "Yönetim Kurulu", href: "/hakkimizda/yonetim-kurulu", order: 2 },
      { id: "2-3", label: "Dernek Tüzüğü", href: "/hakkimizda/tuzuk", order: 3 },
      { id: "2-4", label: "Bize Katıl", href: "/uye-ol", order: 4 },
    ],
  },
  {
    id: "3",
    label: "Faaliyetler",
    href: "/faaliyetler",
    order: 3,
  },
  {
    id: "4",
    label: "Haberler",
    href: "/haberler",
    order: 4,
  },
  {
    id: "5",
    label: "Etkinlikler",
    href: "/etkinlikler",
    order: 5,
  },
  {
    id: "6",
    label: "Galeri",
    href: "/galeri",
    order: 6,
  },
  {
    id: "7",
    label: "Bağış Yap",
    href: "/bagis",
    order: 7,
  },
  {
    id: "8",
    label: "İletişim",
    href: "/iletisim",
    order: 8,
  },
];
