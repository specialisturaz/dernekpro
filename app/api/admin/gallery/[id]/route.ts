import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteFile } from "@/lib/upload";

// PATCH /api/admin/gallery/[id] — update album
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const existing = await prisma.galleryAlbum.findFirst({
      where: { id, tenantId: admin.tenantId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Album bulunamadi" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.category !== undefined) data.category = body.category;
    if (body.coverImage !== undefined) data.coverImage = body.coverImage;

    // Handle slug: auto-generate from title if title changed but slug not provided
    if (body.slug !== undefined) {
      data.slug = body.slug;
    } else if (body.title !== undefined) {
      data.slug = body.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    }

    // Check slug uniqueness if slug is changing
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.galleryAlbum.findUnique({
        where: {
          tenantId_slug: {
            tenantId: admin.tenantId,
            slug: data.slug as string,
          },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, message: "Bu slug zaten kullaniliyor" },
          { status: 409 }
        );
      }
    }

    const album = await prisma.galleryAlbum.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Album guncellendi",
      data: album,
    });
  } catch (error) {
    console.error("Admin gallery PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Album guncellenirken hata olustu" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/gallery/[id] — delete album and all its images
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const existing = await prisma.galleryAlbum.findFirst({
      where: { id, tenantId: admin.tenantId },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Album bulunamadi" },
        { status: 404 }
      );
    }

    // Delete image files from storage
    for (const image of existing.images) {
      try {
        await deleteFile(image.url, admin.tenantId);
        if (image.thumbnailUrl) {
          await deleteFile(image.thumbnailUrl, admin.tenantId);
        }
      } catch {
        // Continue even if file deletion fails — file may already be removed
      }
    }

    // Delete cover image from storage if it exists
    if (existing.coverImage) {
      try {
        await deleteFile(existing.coverImage, admin.tenantId);
      } catch {
        // Continue even if file deletion fails
      }
    }

    // Delete album (cascades to gallery_images via Prisma onDelete)
    await prisma.galleryAlbum.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Album ve tum gorseller silindi",
    });
  } catch (error) {
    console.error("Admin gallery DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Album silinirken hata olustu" },
      { status: 500 }
    );
  }
}
