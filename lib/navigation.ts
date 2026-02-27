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
    children: [
      { id: "3-1", label: "Faaliyetlerimiz", href: "/faaliyetler", order: 1 },
      { id: "3-2", label: "Haberler", href: "/haberler", order: 2 },
      { id: "3-3", label: "Etkinlikler", href: "/etkinlikler", order: 3 },
      { id: "3-4", label: "Galeri", href: "/galeri", order: 4 },
    ],
  },
  {
    id: "4",
    label: "Destek Ol",
    href: "/bagis",
    order: 4,
    children: [
      { id: "4-1", label: "Bağış Yap", href: "/bagis", order: 1 },
      { id: "4-2", label: "Hesap Numaralarımız", href: "/hesaplar", order: 2 },
    ],
  },
  {
    id: "5",
    label: "İletişim",
    href: "/iletisim",
    order: 5,
  },
];
