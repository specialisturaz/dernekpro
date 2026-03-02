import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeImageUrl } from "@/lib/utils";

// PATCH /api/admin/campaigns/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.campaign.findFirst({
      where: { id, tenantId: admin.tenantId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: "Kampanya bulunamadı" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.coverImage !== undefined) updateData.coverImage = normalizeImageUrl(body.coverImage, "campaigns");
    if (body.targetAmount !== undefined) updateData.targetAmount = parseFloat(body.targetAmount) || 0;
    if (body.deadline !== undefined) updateData.deadline = body.deadline ? new Date(body.deadline) : null;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updated = await prisma.campaign.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: "Kampanya güncellendi", data: updated });
  } catch (error) {
    console.error("Admin campaign PATCH error:", error);
    return NextResponse.json({ success: false, message: "Kampanya güncellenirken hata oluştu" }, { status: 500 });
  }
}

// DELETE /api/admin/campaigns/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.campaign.findFirst({
      where: { id, tenantId: admin.tenantId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: "Kampanya bulunamadı" }, { status: 404 });
    }

    await prisma.campaign.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Kampanya silindi" });
  } catch (error) {
    console.error("Admin campaign DELETE error:", error);
    return NextResponse.json({ success: false, message: "Kampanya silinirken hata oluştu" }, { status: 500 });
  }
}
