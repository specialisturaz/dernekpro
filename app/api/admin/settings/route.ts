import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { DEFAULT_THEME } from "@/lib/theme-defaults";
import { themeSettingsSchema } from "@/lib/validations";
import type { ThemeSettings } from "@/types";

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

  return NextResponse.json({
    success: true,
    data: {
      theme,
      tenant: { name: tenant?.name, logo: tenant?.logo, favicon: tenant?.favicon },
    },
  });
}

// PATCH /api/admin/settings — save theme settings
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const body = await req.json();

  // Validate theme data
  const parsed = themeSettingsSchema.safeParse(body.theme);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Geçersiz tema verileri", errors: parsed.error.issues },
      { status: 400 }
    );
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: admin.tenantId },
    select: { settings: true },
  });

  const existingSettings = (tenant?.settings as Record<string, unknown>) || {};

  const updatedSettings = {
    ...existingSettings,
    theme: parsed.data,
  };

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
