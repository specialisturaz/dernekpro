import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultTenant } from "@/lib/tenant";

export async function GET(request: NextRequest) {
  try {
    const tenant = await getDefaultTenant();
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant bulunamadı" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where = {
      tenantId: tenant.id,
      status: { not: "CANCELLED" as const },
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { startAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          coverImage: true,
          startAt: true,
          endAt: true,
          location: true,
          eventType: true,
          capacity: true,
          isFree: true,
          price: true,
          requiresRegistration: true,
          status: true,
        },
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
