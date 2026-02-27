export interface ModuleMenuItem {
  href: string;
  label: string;
  icon: string; // SVG path d attribute
}

export interface ModuleNavItem {
  id: string;
  label: string;
  href: string;
  order: number;
  children?: { id: string; label: string; href: string; order: number }[];
}

export type ModuleCategory = "icerik" | "yonetim" | "finans" | "iletisim" | "sistem";

export interface ModuleDefinition {
  code: string;
  name: string;
  description: string;
  category: ModuleCategory;
  icon: string;
  isCore: boolean;
  dependencies?: string[];
  adminMenuItems: ModuleMenuItem[];
  adminMenuGroup: string;
  publicNavItems?: ModuleNavItem[];
}

const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  icerik: "Icerik",
  yonetim: "Yonetim",
  finans: "Finans",
  iletisim: "Iletisim",
  sistem: "Sistem",
};

export { CATEGORY_LABELS };

export const MODULE_REGISTRY: Record<string, ModuleDefinition> = {
  // ===== CORE MODULLER (devre disi birakilamaz) =====
  dashboard: {
    code: "dashboard",
    name: "Dashboard",
    description: "Yonetim paneli ana sayfasi ve istatistikler",
    category: "sistem",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    isCore: true,
    adminMenuItems: [
      { href: "/admin/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    ],
    adminMenuGroup: "Genel",
  },

  settings: {
    code: "settings",
    name: "Ayarlar",
    description: "Sistem ve tema ayarlari",
    category: "sistem",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    isCore: true,
    adminMenuItems: [
      { href: "/admin/ayarlar", label: "Ayarlar", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    ],
    adminMenuGroup: "Sistem",
  },

  // ===== OPSIYONEL MODULLER (varsayilan olarak aktif, kapatilabilir) =====
  posts: {
    code: "posts",
    name: "Icerik Yonetimi",
    description: "Haberler, duyurular ve faaliyetleri yonetin",
    category: "icerik",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/icerik/haberler", label: "Haberler", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
      { href: "/admin/icerik/duyurular", label: "Duyurular", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
      { href: "/admin/icerik/faaliyetler", label: "Faaliyetler", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    ],
    adminMenuGroup: "Icerik",
  },

  events: {
    code: "events",
    name: "Etkinlikler",
    description: "Etkinlik takvimi ve kayit yonetimi",
    category: "icerik",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/icerik/etkinlikler", label: "Etkinlikler", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    ],
    adminMenuGroup: "Icerik",
  },

  pages: {
    code: "pages",
    name: "Sayfalar",
    description: "CMS sayfalari ve icerik yonetimi",
    category: "icerik",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/icerik/sayfa-duzenleyici", label: "Sayfalar", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    ],
    adminMenuGroup: "Icerik",
  },

  gallery: {
    code: "gallery",
    name: "Galeri",
    description: "Fotograf ve video galeri yonetimi",
    category: "icerik",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/icerik/galeri", label: "Galeri", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    ],
    adminMenuGroup: "Icerik",
    publicNavItems: [
      { id: "galeri", label: "Galeri", href: "/galeri", order: 4 },
    ],
  },

  slider: {
    code: "slider",
    name: "Slider",
    description: "Ana sayfa slider yonetimi",
    category: "icerik",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/icerik/slider", label: "Slider", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    ],
    adminMenuGroup: "Icerik",
  },

  "live-stream": {
    code: "live-stream",
    name: "Canli Yayin",
    description: "YouTube canli yayin yonetimi",
    category: "icerik",
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/icerik/canli-yayin", label: "Canli Yayin", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    ],
    adminMenuGroup: "Icerik",
  },

  "email-templates": {
    code: "email-templates",
    name: "E-posta Sablonlari",
    description: "E-posta sablon yonetimi",
    category: "iletisim",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/icerik/email-sablonlari", label: "E-posta Sablonlari", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    ],
    adminMenuGroup: "Icerik",
  },

  members: {
    code: "members",
    name: "Uye Yonetimi",
    description: "Uye kayitlari ve profil yonetimi",
    category: "yonetim",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/uyeler", label: "Uyeler", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    ],
    adminMenuGroup: "Yonetim",
  },

  notifications: {
    code: "notifications",
    name: "Bildirimler",
    description: "Site ici bildirim yonetimi",
    category: "iletisim",
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/bildirimler", label: "Bildirimler", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    ],
    adminMenuGroup: "Yonetim",
  },

  donations: {
    code: "donations",
    name: "Bagislar",
    description: "Online bagis toplama ve yonetimi",
    category: "finans",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/bagislar", label: "Bagislar", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    ],
    adminMenuGroup: "Yonetim",
  },

  messages: {
    code: "messages",
    name: "Mesajlar",
    description: "Iletisim formu mesajlari",
    category: "iletisim",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/mesajlar", label: "Mesajlar", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    ],
    adminMenuGroup: "Yonetim",
  },

  "child-sponsorship": {
    code: "child-sponsorship",
    name: "Cocuk Sponsorluk",
    description: "Cocuk giydirme, egitim ve saglik sponsorluk programlari",
    category: "icerik",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/cocuk-sponsorluk", label: "Cocuk Sponsorluk", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    ],
    adminMenuGroup: "Icerik",
    publicNavItems: [
      { id: "cocuk-sponsorluk", label: "Cocuk Sponsorluk", href: "/cocuk-sponsorluk", order: 5 },
    ],
  },

  campaigns: {
    code: "campaigns",
    name: "Kampanyalar",
    description: "Bagis kampanyalari olusturma ve yonetimi",
    category: "finans",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/icerik/kampanyalar", label: "Kampanyalar", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
    ],
    adminMenuGroup: "Finans",
    publicNavItems: [
      { id: "bagis", label: "Bagis", href: "/bagis", order: 3 },
    ],
  },

  "bank-accounts": {
    code: "bank-accounts",
    name: "Banka Hesaplari",
    description: "Dernek banka hesaplari ve IBAN bilgileri",
    category: "finans",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    isCore: false,
    adminMenuItems: [
      { href: "/admin/icerik/hesaplar", label: "Banka Hesaplari", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    ],
    adminMenuGroup: "Finans",
    publicNavItems: [
      { id: "hesaplar", label: "Hesaplar", href: "/hesaplar", order: 7 },
    ],
  },

  branches: {
    code: "branches",
    name: "Sube Yonetimi",
    description: "Dernek subelerini, temsilciliklerini ve irtibat burolarini yonetin. Iletisim sayfasinda otomatik listelenir.",
    category: "yonetim",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    isCore: false,
    dependencies: [],
    adminMenuItems: [
      { href: "/admin/subeler", label: "Subeler", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    ],
    adminMenuGroup: "Yonetim",
    publicNavItems: [
      { id: "subeler", label: "Subelerimiz", href: "/subeler", order: 6 },
    ],
  },
};

// Menu grubu siralama
export const MENU_GROUP_ORDER: Record<string, number> = {
  Genel: 0,
  Icerik: 1,
  Yonetim: 2,
  Finans: 3,
  Iletisim: 4,
  Sistem: 9,
};
