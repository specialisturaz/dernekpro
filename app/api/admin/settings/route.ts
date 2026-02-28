import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { DEFAULT_THEME } from "@/lib/theme-defaults";
import { themeSettingsSchema, maintenanceSchema, storageSettingsSchema, footerSettingsSchema, statsSettingsSchema, contactPageSettingsSchema, aboutSettingsSchema, logoSettingsSchema } from "@/lib/validations";
import type { ThemeSettings, MaintenanceSettings, StorageSettings, FooterSettings, StatsSettings, ContactPageSettings, AboutSettings, LogoSettings } from "@/types";

// GET /api/admin/settings — load tenant settings
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: admin.tenantId },
    select: { settings: true, name: true, logo: true, favicon: true },
  });

  const settings = (tenant?.settings as Record<string, unknown>) || {};
  const theme: ThemeSettings = (settings.theme as ThemeSettings) || DEFAULT_THEME;
  const maintenance: MaintenanceSettings = (settings.maintenance as MaintenanceSettings) || {
    enabled: false,
    message: "",
  };
  const storage: StorageSettings = (settings.storage as StorageSettings) || {
    provider: "local",
  };
  const footer: FooterSettings = (settings.footer as FooterSettings) || {
    brandName: tenant?.name || "DernekPro",
    tagline: "",
    copyright: "",
    showNewsletter: true,
    newsletterTitle: "",
    newsletterDescription: "",
  };
  const contactPage: ContactPageSettings = (settings.contactPage as ContactPageSettings) || {
    address: "Beşiktaş Mahallesi, Dernek Sokak No:42/A\n34353 Beşiktaş / İstanbul",
    phone: "+90 (212) 555 0 123\n+90 (212) 555 0 124",
    email: "info@dernekpro.com\ndestek@dernekpro.com",
    workingHours: "Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 10:00 - 14:00",
    mapLat: 41.0082,
    mapLng: 28.9784,
    mapZoom: 13,
    socialMedia: [],
    faq: [],
  };
  const stats: StatsSettings = (settings.stats as StatsSettings) || {
    title: "",
    subtitle: "",
    items: [
      { label: "Yardım Kampanyası", value: 150, suffix: "+", icon: "heart" },
      { label: "Ulaşılan Kişi", value: 50000, suffix: "+", icon: "users" },
      { label: "Yıllık Deneyim", value: 15, suffix: " Yıl", icon: "calendar" },
      { label: "Gönüllü Bağışçı", value: 3500, suffix: "+", icon: "hand" },
    ],
  };
  const about: AboutSettings = (settings.about as AboutSettings) || {
    title: "",
    subtitle: "",
    description: "",
    mission: "",
    vision: "",
    imageUrl: "",
    badgeText: "",
    badgeSubtext: "",
  };
  const logo: LogoSettings = (settings.logo as LogoSettings) || {
    logoUrl: "",
    faviconUrl: "",
    logoWidth: 140,
    logoHeight: 40,
  };

  // R2 secretAccessKey'i maskele
  const maskedStorage = { ...storage };
  if (maskedStorage.r2?.secretAccessKey) {
    const key = maskedStorage.r2.secretAccessKey;
    maskedStorage.r2 = {
      ...maskedStorage.r2,
      secretAccessKey: key.length > 4 ? "***" + key.slice(-4) : "****",
    };
  }

  return NextResponse.json({
    success: true,
    data: {
      theme,
      maintenance,
      storage: maskedStorage,
      footer,
      stats,
      about,
      logo,
      contactPage,
      tenant: { name: tenant?.name, logo: tenant?.logo, favicon: tenant?.favicon },
    },
  });
}

// PATCH /api/admin/settings — save theme or maintenance settings
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const body = await req.json();

  const tenant = await prisma.tenant.findUnique({
    where: { id: admin.tenantId },
    select: { settings: true },
  });

  const existingSettings = (tenant?.settings as Record<string, unknown>) || {};

  // Handle logo settings
  if (body.logo !== undefined) {
    const parsed = logoSettingsSchema.safeParse(body.logo);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Geçersiz logo ayarları", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatedSettings = { ...existingSettings, logo: parsed.data };
    await prisma.tenant.update({
      where: { id: admin.tenantId },
      data: {
        settings: updatedSettings,
        logo: parsed.data.logoUrl || null,
        favicon: parsed.data.faviconUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Logo ayarları kaydedildi",
      data: { logo: parsed.data },
    });
  }

  // Handle about settings
  if (body.about !== undefined) {
    const parsed = aboutSettingsSchema.safeParse(body.about);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Geçersiz hakkımızda ayarları", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatedSettings = { ...existingSettings, about: parsed.data };
    await prisma.tenant.update({
      where: { id: admin.tenantId },
      data: { settings: updatedSettings },
    });

    return NextResponse.json({
      success: true,
      message: "Hakkımızda ayarları kaydedildi",
      data: { about: parsed.data },
    });
  }

  // Handle contact page settings
  if (body.contactPage !== undefined) {
    const parsed = contactPageSettingsSchema.safeParse(body.contactPage);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Geçersiz iletişim ayarları", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatedSettings = { ...existingSettings, contactPage: parsed.data };
    await prisma.tenant.update({
      where: { id: admin.tenantId },
      data: { settings: updatedSettings },
    });

    return NextResponse.json({
      success: true,
      message: "İletişim ayarları kaydedildi",
      data: { contactPage: parsed.data },
    });
  }

  // Handle stats settings
  if (body.stats !== undefined) {
    const parsed = statsSettingsSchema.safeParse(body.stats);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Geçersiz istatistik ayarları", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatedSettings = { ...existingSettings, stats: parsed.data };
    await prisma.tenant.update({
      where: { id: admin.tenantId },
      data: { settings: updatedSettings },
    });

    return NextResponse.json({
      success: true,
      message: "İstatistik ayarları kaydedildi",
      data: { stats: parsed.data },
    });
  }

  // Handle footer settings
  if (body.footer !== undefined) {
    const parsed = footerSettingsSchema.safeParse(body.footer);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Geçersiz footer ayarları", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatedSettings = { ...existingSettings, footer: parsed.data };
    await prisma.tenant.update({
      where: { id: admin.tenantId },
      data: { settings: updatedSettings },
    });

    return NextResponse.json({
      success: true,
      message: "Footer ayarları kaydedildi",
      data: { footer: parsed.data },
    });
  }

  // Handle storage settings
  if (body.storage !== undefined) {
    const parsed = storageSettingsSchema.safeParse(body.storage);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Geçersiz depolama ayarları", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    // secretAccessKey maskeliyse mevcut değeri koru
    const existingStorage = (existingSettings.storage as StorageSettings | undefined);
    if (
      parsed.data.r2?.secretAccessKey?.startsWith("***") &&
      existingStorage?.r2?.secretAccessKey
    ) {
      parsed.data.r2.secretAccessKey = existingStorage.r2.secretAccessKey;
    }

    const updatedSettings = { ...existingSettings, storage: parsed.data };
    await prisma.tenant.update({
      where: { id: admin.tenantId },
      data: { settings: updatedSettings },
    });

    return NextResponse.json({
      success: true,
      message: "Depolama ayarları kaydedildi",
      data: { storage: parsed.data },
    });
  }

  // Handle maintenance settings
  if (body.maintenance !== undefined) {
    const parsed = maintenanceSchema.safeParse(body.maintenance);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Geçersiz bakım modu verileri", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatedSettings = { ...existingSettings, maintenance: parsed.data };
    await prisma.tenant.update({
      where: { id: admin.tenantId },
      data: { settings: updatedSettings },
    });

    return NextResponse.json({
      success: true,
      message: parsed.data.enabled ? "Bakım modu aktif edildi" : "Bakım modu kapatıldı",
      data: { maintenance: parsed.data },
    });
  }

  // Handle theme settings
  if (body.theme !== undefined) {
    const parsed = themeSettingsSchema.safeParse(body.theme);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Geçersiz tema verileri", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatedSettings = { ...existingSettings, theme: parsed.data };
    await prisma.tenant.update({
      where: { id: admin.tenantId },
      data: { settings: updatedSettings },
    });

    return NextResponse.json({
      success: true,
      message: "Tema ayarları kaydedildi",
      data: { theme: parsed.data },
    });
  }

  return NextResponse.json(
    { success: false, message: "Güncellenecek veri belirtilmedi" },
    { status: 400 }
  );
}
