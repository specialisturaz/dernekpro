import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isModuleActive } from "@/lib/modules";

export const dynamic = "force-dynamic";

// GET: Aktif subeleri public olarak listele (auth gerekmez)
export async function GET() {
  try {
    // Ilk tenant'i kullan
    const tenant = await prisma.tenant.findFirst({ select: { id: true } });
    if (!tenant) {
      return NextResponse.json({ success: true, data: [] });
    }

    const active = await isModuleActive(tenant.id, "branches");
    if (!active) {
      return NextResponse.json({ success: true, data: [] });
    }

    const branches = await prisma.branch.findMany({
      where: { tenantId: tenant.id, status: "ACTIVE" },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        code: true,
        type: true,
        phone: true,
        email: true,
        address: true,
        city: true,
        district: true,
        latitude: true,
        longitude: true,
        presidentName: true,
      },
    });

    return NextResponse.json({ success: true, data: branches });
  } catch {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
