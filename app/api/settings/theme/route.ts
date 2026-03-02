import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_THEME } from "@/lib/theme-defaults";
import type { ThemeSettings } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/settings/theme — public endpoint (no auth), cacheable
export async function GET() {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;

    const tenant = tenantId
      ? await prisma.tenant.findUnique({
          where: { id: tenantId },
          select: { settings: true },
        })
      : await prisma.tenant.findFirst({
          where: { isActive: true },
          select: { settings: true },
          orderBy: { createdAt: "asc" },
        });

    const settings = (tenant?.settings as Record<string, unknown>) || {};
    const theme: ThemeSettings = (settings.theme as ThemeSettings) || DEFAULT_THEME;

    return NextResponse.json(
      { success: true, data: theme },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    console.error("Theme API error:", err);
    return NextResponse.json(
      { success: true, data: DEFAULT_THEME },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  }
}
