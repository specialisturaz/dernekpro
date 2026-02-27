// ===== THEME =====
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  text: string;
  textMuted: string;
  bg: string;
  bgAlt: string;
  border: string;
}

export interface ThemeSettings {
  light: ThemeColors;
  dark: ThemeColors;
  typography: {
    fontPrimary: string;
    fontHeading: string;
  };
  layout: {
    borderRadius: number;
  };
  activePreset?: string;
}

// ===== TENANT (SaaS) =====
export interface Tenant {
  id: string;
  subdomain: string;
  customDomain?: string;
  name: string;
  shortName?: string;
  logo?: string;
  favicon?: string;
  plan: "starter" | "professional" | "enterprise";
  settings: TenantSettings;
  createdAt: Date;
  isActive: boolean;
}

export interface MaintenanceSettings {
  enabled: boolean;
  message?: string;
  allowedIps?: string[];
}

export interface StorageSettings {
  provider: "local" | "r2";
  r2?: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicUrl: string;
  };
}

export interface FooterSettings {
  brandName: string;
  tagline: string;
  copyright: string;
  showNewsletter: boolean;
  newsletterTitle: string;
  newsletterDescription: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface StatsSettings {
  title: string;
  subtitle: string;
  items: StatItem[];
}

export interface ContactPageSettings {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  mapLat: number;
  mapLng: number;
  mapZoom: number;
  mapEmbed?: string;
  socialMedia: { platform: string; url: string }[];
  faq: { question: string; answer: string }[];
  // Sayfa içerikleri
  heroTitle?: string;
  heroDescription?: string;
  formTitle?: string;
  formDescription?: string;
  formTopics?: string[];
  mapTitle?: string;
  mapDescription?: string;
  socialTitle?: string;
  socialDescription?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
}

export interface AboutSettings {
  title: string;
  subtitle: string;
  description: string;
  mission: string;
  vision: string;
  imageUrl: string;
  badgeText: string;
  badgeSubtext: string;
}

export interface LogoSettings {
  logoUrl: string;
  faviconUrl: string;
  logoWidth: number;
  logoHeight: number;
}

export interface TenantSettings {
  theme?: ThemeSettings;
  maintenance?: MaintenanceSettings;
  storage?: StorageSettings;
  footer?: FooterSettings;
  stats?: StatsSettings;
  about?: AboutSettings;
  logo?: LogoSettings;
  contactPage?: ContactPageSettings;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    googleAnalyticsId?: string;
  };
  contact: {
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    workingHours?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  features: {
    donations: boolean;
    membership: boolean;
    events: boolean;
    gallery: boolean;
    blog: boolean;
    darkMode: boolean;
    multiLanguage: boolean;
  };
}

// ===== ICERIK (Content) =====
export type PostType = "news" | "activity" | "announcement";
export type PostStatus = "draft" | "published" | "archived";

export interface Post {
  id: string;
  tenantId: string;
  type: PostType;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  coverImageAlt?: string;
  category?: Category;
  categoryId?: string;
  tags: string[];
  author?: User;
  authorId?: string;
  status: PostStatus;
  publishedAt?: Date;
  isFeatured: boolean;
  seo?: SEOMeta;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  order: number;
}

export interface SEOMeta {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

// ===== ETKINLIK =====
export type EventType = "online" | "in_person" | "hybrid";

export interface Event {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  startAt: Date;
  endAt: Date;
  location?: string;
  latitude?: number;
  longitude?: number;
  eventType: EventType;
  capacity?: number;
  registeredCount: number;
  isFree: boolean;
  price?: number;
  requiresRegistration: boolean;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  createdAt: Date;
}

// ===== GALERI =====
export interface GalleryAlbum {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  coverImage?: string;
  category?: string;
  description?: string;
  imageCount: number;
  createdAt: Date;
}

export interface GalleryImage {
  id: string;
  albumId: string;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  order: number;
}

// ===== UYE (Member) =====
export type MemberStatus = "active" | "passive" | "suspended" | "pending";
export type MemberType = "regular" | "honorary" | "student";

export interface Member {
  id: string;
  tenantId: string;
  fullName: string;
  email: string;
  phone?: string;
  tcNo?: string; // Encrypted
  birthDate?: Date;
  gender?: "male" | "female";
  address?: string;
  city?: string;
  occupation?: string;
  education?: string;
  memberType: MemberType;
  status: MemberStatus;
  referenceId?: string;
  photo?: string;
  joinedAt: Date;
  createdAt: Date;
}

// ===== AIDAT (Dues) =====
export interface Due {
  id: string;
  tenantId: string;
  memberId: string;
  member?: Member;
  period: string; // e.g., "2024-01"
  amount: number;
  paidAt?: Date;
  status: "paid" | "pending" | "overdue";
}

// ===== BAGIS (Donation) =====
export type PaymentMethod = "credit_card" | "bank_transfer" | "cash";
export type DonationType = "general" | "zekat" | "fitre" | "sadaka" | "kurban" | "adak" | "akika";

export type CampaignStatus = "ACTIVE" | "COMPLETED" | "PAUSED";

export interface Campaign {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  targetAmount: number;
  collectedAmount: number;
  deadline?: Date;
  isActive: boolean;
  status: CampaignStatus;
  createdAt: Date;
}

export interface Donation {
  id: string;
  tenantId: string;
  campaignId?: string;
  campaign?: Campaign;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number;
  donationType: DonationType;
  paymentMethod: PaymentMethod;
  isAnonymous: boolean;
  isRecurring: boolean;
  status: "completed" | "pending" | "failed" | "refunded";
  transactionId?: string;
  createdAt: Date;
}

// ===== MUHASEBE =====
export interface Transaction {
  id: string;
  tenantId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  receiptUrl?: string;
  createdAt: Date;
}

// ===== KULLANICI (Admin Users) =====
export type UserRole = "super_admin" | "admin" | "editor" | "financial" | "moderator" | "member";

export interface User {
  id: string;
  tenantId: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
}

// ===== SAYFA (CMS Pages) =====
export interface Page {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string;
  template?: string;
  seo?: SEOMeta;
  isPublished: boolean;
  order: number;
  sections?: unknown;
  customCss?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== CANLI YAYIN =====
export type LiveStreamStatus = "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";

export interface LiveStream {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  scheduledAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  status: LiveStreamStatus;
  notifyUsers: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== BILDIRIM =====
export type NotificationType =
  | "GENERAL"
  | "LIVE_STREAM"
  | "EVENT"
  | "ANNOUNCEMENT"
  | "CAMPAIGN"
  | "SYSTEM";

export interface Notification {
  id: string;
  tenantId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isGlobal: boolean;
  sendEmail: boolean;
  emailTemplateId?: string;
  sentAt?: Date;
  createdAt: Date;
  readCount?: number;
}

export interface NotificationRead {
  id: string;
  notificationId: string;
  memberId: string;
  readAt: Date;
}

// ===== E-POSTA SABLONU =====
export interface EmailTemplate {
  id: string;
  tenantId: string;
  name: string;
  subject: string;
  htmlContent: string;
  variables: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== SLIDER =====
export interface Slide {
  id: string;
  tenantId: string;
  type: "image" | "video";
  mediaUrl: string;
  mobileMediaUrl?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
  isActive: boolean;
}

// ===== NAVIGATION =====
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
  isExternal?: boolean;
  order: number;
}

// ===== SUBE (Branch) =====
export type BranchType = "MERKEZ" | "SUBE" | "TEMSILCILIK" | "IRTIBAT_BUROSU";
export type BranchStatus = "ACTIVE" | "PASSIVE" | "CLOSED";

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  code?: string;
  type: BranchType;
  status: BranchStatus;
  phone?: string;
  email?: string;
  fax?: string;
  address?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  presidentName?: string;
  presidentPhone?: string;
  presidentEmail?: string;
  presidentPhoto?: string;
  workingHours?: Record<string, { open: string; close: string; closed?: boolean }>;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
  };
  gallery: string[];
  description?: string;
  foundedAt?: Date;
  memberCount: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BranchMessage {
  id: string;
  tenantId: string;
  branchId: string;
  branch?: Branch;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// ===== COCUK SPONSORLUK =====
export type SponsorCategory = "giydirme" | "egitim" | "saglik" | "genel";

export interface SponsorChild {
  id: string;
  tenantId: string;
  name: string;
  age: number;
  gender: "male" | "female";
  country: string;
  city?: string;
  story: string;
  photoUrl: string;
  goalAmount: number;
  collected: number;
  isActive: boolean;
  isFeatured: boolean;
  category: SponsorCategory;
  createdAt: Date;
  updatedAt: Date;
}

// ===== API Response =====
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
