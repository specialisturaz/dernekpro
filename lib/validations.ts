import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre zorunludur"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
    email: z.email("Geçerli bir e-posta adresi girin"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(/[A-Z]/, "En az bir büyük harf içermelidir")
      .regex(/[a-z]/, "En az bir küçük harf içermelidir")
      .regex(/[0-9]/, "En az bir rakam içermelidir"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      error: "Kullanım koşullarını kabul etmelisiniz",
    }),
    acceptKvkk: z.literal(true, {
      error: "KVKK metnini onaylamalısınız",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const memberRegisterSchema = z
  .object({
    fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
    email: z.email("Geçerli bir e-posta adresi girin"),
    phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
    tcNo: z.string().length(11, "TC Kimlik No 11 haneli olmalıdır").optional(),
    birthDate: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    occupation: z.string().optional(),
    education: z.string().optional(),
    memberTypeId: z.string().optional(),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(/[A-Z]/, "En az bir büyük harf içermelidir")
      .regex(/[a-z]/, "En az bir küçük harf içermelidir")
      .regex(/[0-9]/, "En az bir rakam içermelidir"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      error: "Tüzüğü kabul etmelisiniz",
    }),
    acceptKvkk: z.literal(true, {
      error: "KVKK metnini onaylamalısınız",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

// ===== THEME VALIDATION =====
const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const themeColorsSchema = z.object({
  primary: z.string().regex(hexColorRegex, "Geçerli bir renk kodu girin"),
  primaryLight: z.string().regex(hexColorRegex, "Geçerli bir renk kodu girin"),
  primaryDark: z.string().regex(hexColorRegex, "Geçerli bir renk kodu girin"),
  secondary: z.string().regex(hexColorRegex, "Geçerli bir renk kodu girin"),
  accent: z.string().regex(hexColorRegex, "Geçerli bir renk kodu girin"),
  text: z.string().regex(hexColorRegex, "Geçerli bir renk kodu girin"),
  textMuted: z.string().regex(hexColorRegex, "Geçerli bir renk kodu girin"),
  bg: z.string().regex(hexColorRegex, "Geçerli bir renk kodu girin"),
  bgAlt: z.string().regex(hexColorRegex, "Geçerli bir renk kodu girin"),
  border: z.string().regex(hexColorRegex, "Geçerli bir renk kodu girin"),
});

export const themeSettingsSchema = z.object({
  light: themeColorsSchema,
  dark: themeColorsSchema,
  typography: z.object({
    fontPrimary: z.string().min(1),
    fontHeading: z.string().min(1),
  }),
  layout: z.object({
    borderRadius: z.number().min(0).max(32),
  }),
  activePreset: z.string().optional(),
});

// ===== LIVE STREAM VALIDATION =====
export const liveStreamSchema = z.object({
  title: z.string().min(2, "Başlık en az 2 karakter olmalıdır"),
  description: z.string().optional(),
  youtubeUrl: z
    .string()
    .url("Geçerli bir URL girin")
    .regex(
      /youtube\.com|youtu\.be/,
      "Geçerli bir YouTube URL'si girin"
    ),
  thumbnailUrl: z.string().url("Geçerli bir URL girin").optional().or(z.literal("")),
  scheduledAt: z.string().min(1, "Planlanan tarih zorunludur"),
  notifyUsers: z.boolean().default(false),
});

// ===== NOTIFICATION VALIDATION =====
export const notificationSchema = z.object({
  title: z.string().min(2, "Başlık en az 2 karakter olmalıdır"),
  message: z.string().min(5, "Mesaj en az 5 karakter olmalıdır"),
  type: z.enum([
    "GENERAL",
    "LIVE_STREAM",
    "EVENT",
    "ANNOUNCEMENT",
    "CAMPAIGN",
    "SYSTEM",
  ]),
  link: z.string().url("Geçerli bir URL girin").optional().or(z.literal("")),
  isGlobal: z.boolean().default(true),
  sendEmail: z.boolean().default(false),
  emailTemplateId: z.string().optional().or(z.literal("")),
});

// ===== EMAIL TEMPLATE VALIDATION =====
export const emailTemplateSchema = z.object({
  name: z
    .string()
    .min(2, "Şablon adı en az 2 karakter olmalıdır")
    .regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire kullanın"),
  subject: z.string().min(2, "Konu en az 2 karakter olmalıdır"),
  htmlContent: z.string().min(10, "HTML içerik en az 10 karakter olmalıdır"),
  variables: z.array(z.string()).default([]),
});

// ===== STORAGE VALIDATION =====
export const storageSettingsSchema = z.object({
  provider: z.enum(["local", "r2"]),
  r2: z
    .object({
      accountId: z.string().min(1, "Account ID zorunludur"),
      accessKeyId: z.string().min(1, "Access Key ID zorunludur"),
      secretAccessKey: z.string().min(1, "Secret Access Key zorunludur"),
      bucketName: z.string().min(1, "Bucket Name zorunludur"),
      publicUrl: z.string().optional().default(""),
    })
    .optional(),
});

// ===== FOOTER VALIDATION =====
export const footerSettingsSchema = z.object({
  brandName: z.string().min(1, "Marka adı zorunludur").max(100),
  tagline: z.string().max(300).optional().default(""),
  copyright: z.string().max(200).optional().default(""),
  showNewsletter: z.boolean().default(true),
  newsletterTitle: z.string().max(200).optional().default(""),
  newsletterDescription: z.string().max(500).optional().default(""),
});

// ===== STATS VALIDATION =====
export const statsSettingsSchema = z.object({
  title: z.string().max(200).optional().default(""),
  subtitle: z.string().max(500).optional().default(""),
  items: z.array(z.object({
    label: z.string().min(1, "Etiket zorunludur").max(100),
    value: z.number().min(0, "Değer 0 veya üzeri olmalıdır"),
    suffix: z.string().max(20).optional().default(""),
    icon: z.string().min(1, "İkon zorunludur"),
  })).min(1, "En az 1 istatistik gereklidir").max(8, "En fazla 8 istatistik eklenebilir"),
});

// ===== ABOUT SETTINGS VALIDATION =====
export const aboutSettingsSchema = z.object({
  title: z.string().max(200).optional().default(""),
  subtitle: z.string().max(200).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  mission: z.string().max(1000).optional().default(""),
  vision: z.string().max(1000).optional().default(""),
  imageUrl: z.string().max(500).optional().default(""),
  badgeText: z.string().max(50).optional().default(""),
  badgeSubtext: z.string().max(100).optional().default(""),
});

// ===== LOGO SETTINGS VALIDATION =====
export const logoSettingsSchema = z.object({
  logoUrl: z.string().max(500).optional().default(""),
  faviconUrl: z.string().max(500).optional().default(""),
  logoWidth: z.number().min(20).max(400).optional().default(140),
  logoHeight: z.number().min(16).max(200).optional().default(40),
});

// ===== CONTACT PAGE VALIDATION =====
export const contactPageSettingsSchema = z.object({
  address: z.string().max(500).optional().default(""),
  phone: z.string().max(100).optional().default(""),
  email: z.string().max(200).optional().default(""),
  workingHours: z.string().max(300).optional().default(""),
  mapLat: z.number().min(-90).max(90).optional().default(41.0082),
  mapLng: z.number().min(-180).max(180).optional().default(28.9784),
  mapZoom: z.number().min(1).max(20).optional().default(13),
  mapEmbed: z.string().max(2000).optional().default(""),
  socialMedia: z.array(z.object({
    platform: z.string().min(1).max(50),
    url: z.string().max(500),
  })).max(10).optional().default([]),
  faq: z.array(z.object({
    question: z.string().min(1).max(300),
    answer: z.string().min(1).max(1000),
  })).max(20).optional().default([]),
  // Sayfa içerikleri
  heroTitle: z.string().max(100).optional().default(""),
  heroDescription: z.string().max(300).optional().default(""),
  formTitle: z.string().max(100).optional().default(""),
  formDescription: z.string().max(500).optional().default(""),
  formTopics: z.array(z.string().min(1).max(100)).max(15).optional().default([]),
  mapTitle: z.string().max(100).optional().default(""),
  mapDescription: z.string().max(500).optional().default(""),
  socialTitle: z.string().max(100).optional().default(""),
  socialDescription: z.string().max(300).optional().default(""),
  ctaPrimaryText: z.string().max(50).optional().default(""),
  ctaPrimaryLink: z.string().max(200).optional().default(""),
  ctaSecondaryText: z.string().max(50).optional().default(""),
  ctaSecondaryLink: z.string().max(200).optional().default(""),
});

// ===== MAINTENANCE VALIDATION =====
export const maintenanceSchema = z.object({
  enabled: z.boolean(),
  message: z.string().optional(),
  allowedIps: z.array(z.string()).optional(),
});

// ===== PAGE VALIDATION =====
export const pageSchema = z.object({
  title: z.string().min(2, "Başlık en az 2 karakter olmalıdır"),
  slug: z
    .string()
    .min(2, "Slug en az 2 karakter olmalıdır")
    .regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  content: z.string().min(1, "İçerik zorunludur"),
  template: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  isPublished: z.boolean().default(false),
  customCss: z.string().optional(),
});

// ===== BRANCH VALIDATION =====
export const branchSchema = z.object({
  name: z.string().min(2, "Şube adı en az 2 karakter olmalıdır"),
  slug: z
    .string()
    .min(2, "Slug en az 2 karakter olmalıdır")
    .regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  code: z.string().optional(),
  type: z.enum(["MERKEZ", "SUBE", "TEMSILCILIK", "IRTIBAT_BUROSU"]),
  status: z.enum(["ACTIVE", "PASSIVE", "CLOSED"]).default("ACTIVE"),
  phone: z.string().optional(),
  email: z.email("Geçerli bir e-posta adresi girin").optional().or(z.literal("")),
  fax: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  presidentName: z.string().optional(),
  presidentPhone: z.string().optional(),
  presidentEmail: z.email("Geçerli bir e-posta adresi girin").optional().or(z.literal("")),
  presidentPhoto: z.string().url("Geçerli bir URL girin").optional().or(z.literal("")),
  workingHours: z.record(z.string(), z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean().optional(),
  })).optional(),
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    whatsapp: z.string().optional(),
  }).optional(),
  gallery: z.array(z.string().url("Geçerli bir URL girin")).default([]),
  description: z.string().optional(),
  foundedAt: z.string().optional(),
  memberCount: z.number().int().min(0).default(0),
  order: z.number().int().min(0).default(0),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MemberRegisterInput = z.infer<typeof memberRegisterSchema>;
export type ThemeSettingsInput = z.infer<typeof themeSettingsSchema>;
export type LiveStreamInput = z.infer<typeof liveStreamSchema>;
export type NotificationInput = z.infer<typeof notificationSchema>;
export type EmailTemplateInput = z.infer<typeof emailTemplateSchema>;
export type MaintenanceInput = z.infer<typeof maintenanceSchema>;
export type StorageSettingsInput = z.infer<typeof storageSettingsSchema>;
export type FooterSettingsInput = z.infer<typeof footerSettingsSchema>;
export type StatsSettingsInput = z.infer<typeof statsSettingsSchema>;
export type PageInput = z.infer<typeof pageSchema>;
export type AboutSettingsInput = z.infer<typeof aboutSettingsSchema>;
export type BranchInput = z.infer<typeof branchSchema>;
