import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultTenant } from "@/lib/tenant";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tenant = await getDefaultTenant();
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant bulunamadı" }, { status: 404 });
    }

    const event = await prisma.event.findFirst({
      where: {
        tenantId: tenant.id,
        slug: params.slug,
        status: { not: "CANCELLED" },
      },
    });

    if (!event) {
      return NextResponse.json({ success: false, message: "Etkinlik bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
