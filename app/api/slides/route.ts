import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultTenant } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tenant = await getDefaultTenant();
    if (!tenant) {
      return NextResponse.json({ success: true, data: [] });
    }

    const slides = await prisma.slide.findMany({
      where: { tenantId: tenant.id, isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        mediaUrl: true,
        mobileMediaUrl: true,
        title: true,
        subtitle: true,
        buttonText: true,
        buttonLink: true,
        type: true,
        badge: true,
        bgColor: true,
        accentColor: true,
        statsLabel: true,
        statsValue: true,
        slideDate: true,
        location: true,
      },
    });

    return NextResponse.json({ success: true, data: slides });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}
