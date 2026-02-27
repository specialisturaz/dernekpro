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
    const type = searchParams.get("type") || "NEWS";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where = {
      tenantId: tenant.id,
      type: type as "NEWS" | "ACTIVITY" | "ANNOUNCEMENT",
      status: "PUBLISHED" as const,
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          tags: true,
          isFeatured: true,
          publishedAt: true,
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, fullName: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
