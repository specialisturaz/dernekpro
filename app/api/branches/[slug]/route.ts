import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET: Public sube detay (slug ile)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const tenant = await prisma.tenant.findFirst({ select: { id: true } });
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Bulunamadı" }, { status: 404 });
    }

    const branch = await prisma.branch.findFirst({
      where: { tenantId: tenant.id, slug, status: "ACTIVE" },
    });

    if (!branch) {
      return NextResponse.json({ success: false, message: "Şube bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: branch });
  } catch {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
