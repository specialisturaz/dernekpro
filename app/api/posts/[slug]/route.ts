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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "NEWS";

    const post = await prisma.post.findFirst({
      where: {
        tenantId: tenant.id,
        slug: params.slug,
        type: type as "NEWS" | "ACTIVITY" | "ANNOUNCEMENT",
        status: "PUBLISHED",
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, fullName: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ success: false, message: "İçerik bulunamadı" }, { status: 404 });
    }

    // İlgili postlar
    const related = await prisma.post.findMany({
      where: {
        tenantId: tenant.id,
        type: type as "NEWS" | "ACTIVITY" | "ANNOUNCEMENT",
        status: "PUBLISHED",
        id: { not: post.id },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        category: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
      related,
    });
  } catch {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
