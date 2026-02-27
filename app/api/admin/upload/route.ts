import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { uploadFile } from "@/lib/upload";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Dosya gerekli" },
        { status: 400 }
      );
    }

    const result = await uploadFile(file, folder, admin.tenantId);

    const media = await prisma.media.create({
      data: {
        tenantId: admin.tenantId,
        fileName: result.key.split("/").pop()!,
        originalName: file.name,
        mimeType: result.mimeType,
        size: result.size,
        url: result.url,
        folder,
        uploadedBy: admin.userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Dosya yuklendi",
      data: {
        id: media.id,
        url: media.url,
        fileName: media.originalName,
        mimeType: media.mimeType,
        size: media.size,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Dosya yuklenirken hata olustu";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
