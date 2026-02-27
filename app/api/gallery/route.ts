import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/gallery — public endpoint (no auth)
// Supports ?category=xxx filtering
export async function GET(req: NextRequest) {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

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
        { success: false, message: "Tenant bulunamadi" },
        { status: 404 }
      );
    }

    const where: Record<string, unknown> = { tenantId: tenant.id };
    if (category && category !== "tumu") {
      where.category = category;
    }

    const albums = await prisma.galleryAlbum.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        category: true,
        createdAt: true,
        _count: {
          select: { images: true },
        },
      },
    });

    const data = albums.map((album) => ({
      id: album.id,
      title: album.title,
      slug: album.slug,
      coverImage: album.coverImage,
      category: album.category || "genel",
      createdAt: album.createdAt,
      imageCount: album._count.images,
    }));

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Gallery API error:", error);
    return NextResponse.json(
      { success: false, message: "Galeri verileri alinamadi" },
      { status: 500 }
    );
  }
}
