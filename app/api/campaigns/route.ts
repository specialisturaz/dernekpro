import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultTenant } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tenant = await getDefaultTenant();
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant bulunamadı" }, { status: 404 });
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        targetAmount: true,
        collectedAmount: true,
        deadline: true,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: campaigns });
  } catch {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
