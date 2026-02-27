import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/gallery/[slug] — public endpoint (no auth)
// Returns album detail with all images ordered by `order` asc
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

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
        { success: false, message: "Tenant bulunamadi" },
        { status: 404 }
      );
    }

    const album = await prisma.galleryAlbum.findUnique({
      where: {
        tenantId_slug: {
          tenantId: tenant.id,
          slug,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        createdAt: true,
        images: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            url: true,
            thumbnailUrl: true,
            alt: true,
            order: true,
          },
        },
      },
    });

    if (!album) {
      return NextResponse.json(
        { success: false, message: "Album bulunamadi" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: album },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Gallery album detail API error:", error);
    return NextResponse.json(
      { success: false, message: "Album verileri alinamadi" },
      { status: 500 }
    );
  }
}
