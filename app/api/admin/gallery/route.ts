import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/gallery — list all albums for admin's tenant
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz" },
      { status: 401 }
    );
  }

  try {
    const albums = await prisma.galleryAlbum.findMany({
      where: { tenantId: admin.tenantId },
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { order: "asc" }, select: { id: true, url: true, alt: true } },
        _count: { select: { images: true } },
      },
    });

    const mapped = albums.map((album) => ({
      ...album,
      images: album.images.map((img) => ({
        id: img.id,
        url: img.url,
        caption: img.alt || "",
      })),
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    console.error("Admin gallery GET error:", error);
    return NextResponse.json(
      { success: false, message: "Albumler yuklenirken hata olustu" },
      { status: 500 }
    );
  }
}

// POST /api/admin/gallery — create a new album
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, slug, category, description, coverImage } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Album basligi zorunludur" },
        { status: 400 }
      );
    }

    // Generate slug from title if not provided
    const finalSlug = slug
      ? slug
      : title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

    // Verify tenantId + slug uniqueness
    const existing = await prisma.galleryAlbum.findUnique({
      where: {
        tenantId_slug: {
          tenantId: admin.tenantId,
          slug: finalSlug,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Bu slug zaten kullaniliyor" },
        { status: 409 }
      );
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        tenantId: admin.tenantId,
        title,
        slug: finalSlug,
        category: category || "genel",
        description: description || null,
        coverImage: coverImage || null,
      },
    });

    return NextResponse.json(
      { success: true, message: "Album olusturuldu", data: album },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin gallery POST error:", error);
    return NextResponse.json(
      { success: false, message: "Album olusturulurken hata olustu" },
      { status: 500 }
    );
  }
}
