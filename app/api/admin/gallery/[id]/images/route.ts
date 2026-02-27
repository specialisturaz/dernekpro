import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { uploadFile, deleteFile } from "@/lib/upload";

// POST /api/admin/gallery/[id]/images — upload images to album
export async function POST(
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
    // Verify album belongs to admin's tenant
    const album = await prisma.galleryAlbum.findFirst({
      where: { id, tenantId: admin.tenantId },
    });

    if (!album) {
      return NextResponse.json(
        { success: false, message: "Album bulunamadi" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "En az bir dosya gerekli" },
        { status: 400 }
      );
    }

    // Get current max order for this album
    const maxOrder = await prisma.galleryImage.aggregate({
      where: { albumId: id },
      _max: { order: true },
    });
    let nextOrder = (maxOrder._max.order ?? -1) + 1;

    const uploadedImages = [];

    for (const file of files) {
      const result = await uploadFile(file, "gallery", admin.tenantId);

      const image = await prisma.galleryImage.create({
        data: {
          albumId: id,
          url: result.url,
          alt: file.name.replace(/\.[^.]+$/, ""),
          order: nextOrder,
        },
      });

      uploadedImages.push(image);
      nextOrder++;
    }

    return NextResponse.json(
      {
        success: true,
        message: `${uploadedImages.length} gorsel yuklendi`,
        data: uploadedImages,
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gorseller yuklenirken hata olustu";
    console.error("Admin gallery images POST error:", error);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/gallery/[id]/images?imageId=xxx — delete a single image
export async function DELETE(
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
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("imageId");

  if (!imageId) {
    return NextResponse.json(
      { success: false, message: "imageId parametresi zorunludur" },
      { status: 400 }
    );
  }

  try {
    // Verify album belongs to admin's tenant
    const album = await prisma.galleryAlbum.findFirst({
      where: { id, tenantId: admin.tenantId },
    });

    if (!album) {
      return NextResponse.json(
        { success: false, message: "Album bulunamadi" },
        { status: 404 }
      );
    }

    // Verify image belongs to this album
    const image = await prisma.galleryImage.findFirst({
      where: { id: imageId, albumId: id },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Gorsel bulunamadi" },
        { status: 404 }
      );
    }

    // Delete the file from storage
    try {
      await deleteFile(image.url, admin.tenantId);
      if (image.thumbnailUrl) {
        await deleteFile(image.thumbnailUrl, admin.tenantId);
      }
    } catch {
      // Continue even if file deletion fails — file may already be removed
    }

    // Delete the database record
    await prisma.galleryImage.delete({ where: { id: imageId } });

    return NextResponse.json({
      success: true,
      message: "Gorsel silindi",
    });
  } catch (error) {
    console.error("Admin gallery images DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Gorsel silinirken hata olustu" },
      { status: 500 }
    );
  }
}
