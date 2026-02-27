import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/pages/[slug] — public endpoint, no auth required
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Resolve tenant: use DEFAULT_TENANT_ID or first active tenant
    const tenantId = process.env.DEFAULT_TENANT_ID;

    const tenant = tenantId
      ? await prisma.tenant.findUnique({
          where: { id: tenantId },
          select: { id: true },
        })
      : await prisma.tenant.findFirst({
          where: { isActive: true },
          select: { id: true },
          orderBy: { createdAt: "asc" },
        });

    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Sayfa bulunamadi" },
        { status: 404 }
      );
    }

    const page = await prisma.page.findFirst({
      where: {
        slug: params.slug,
        tenantId: tenant.id,
        isPublished: true,
      },
    });

    if (!page) {
      return NextResponse.json(
        { success: false, message: "Sayfa bulunamadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("Public page GET error:", error);
    return NextResponse.json(
      { success: false, message: "Sayfa getirilirken hata olustu" },
      { status: 500 }
    );
  }
}
