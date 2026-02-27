import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteFile } from "@/lib/upload";

// PATCH /api/admin/sponsor-children/[id] — Sponsor cocugu guncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.sponsorChild.findFirst({
      where: { id, tenantId: admin.tenantId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Sponsor cocugu bulunamadi." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    const fields = [
      "name",
      "age",
      "gender",
      "country",
      "city",
      "story",
      "photoUrl",
      "goalAmount",
      "collected",
      "isActive",
      "isFeatured",
      "category",
    ];

    for (const field of fields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    // Eger yeni foto yuklendiyse eski fotoyu sil
    if (body.photoUrl && body.photoUrl !== existing.photoUrl) {
      try {
        await deleteFile(existing.photoUrl, admin.tenantId);
      } catch {
        // Dosya zaten silinmis olabilir
      }
    }

    const child = await prisma.sponsorChild.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Sponsor cocugu basariyla guncellendi.",
      data: child,
    });
  } catch (error) {
    console.error("Admin sponsor children PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Sponsor cocugu guncellenirken hata olustu." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/sponsor-children/[id] — Sponsor cocugu sil
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.sponsorChild.findFirst({
      where: { id, tenantId: admin.tenantId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Sponsor cocugu bulunamadi." },
        { status: 404 }
      );
    }

    // Fotograf dosyasini sil
    if (existing.photoUrl) {
      try {
        await deleteFile(existing.photoUrl, admin.tenantId);
      } catch {
        // Dosya zaten silinmis olabilir
      }
    }

    await prisma.sponsorChild.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Sponsor cocugu basariyla silindi.",
    });
  } catch (error) {
    console.error("Admin sponsor children DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Sponsor cocugu silinirken hata olustu." },
      { status: 500 }
    );
  }
}
