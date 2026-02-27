import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultTenant } from "@/lib/tenant";

export const dynamic = "force-dynamic";

// GET /api/campaigns/completed — public completed campaigns
export async function GET(req: NextRequest) {
  try {
    const tenant = await getDefaultTenant();
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant bulunamadı" }, { status: 404 });
    }

    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "6");

    const campaigns = await prisma.campaign.findMany({
      where: {
        tenantId: tenant.id,
        status: "COMPLETED",
        isActive: true,
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        targetAmount: true,
        collectedAmount: true,
      },
    });

    return NextResponse.json({ success: true, data: campaigns });
  } catch (error) {
    console.error("Completed campaigns GET error:", error);
    return NextResponse.json({ success: false, message: "Veriler yüklenirken hata oluştu" }, { status: 500 });
  }
}
