import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_THEME } from "@/lib/theme-defaults";
import type { ThemeSettings } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/settings/theme — public endpoint (no auth), cacheable
export async function GET() {
  const tenantId = process.env.DEFAULT_TENANT_ID || "default";

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { settings: true },
  });

  const settings = (tenant?.settings as Record<string, unknown>) || {};
  const theme: ThemeSettings = (settings.theme as ThemeSettings) || DEFAULT_THEME;

  return NextResponse.json(
    { success: true, data: theme },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
