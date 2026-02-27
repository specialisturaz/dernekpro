import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/notifications/[id] — notification detail with read stats
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = params;

  const notification = await prisma.notification.findFirst({
    where: { id, tenantId: admin.tenantId },
    include: {
      emailTemplate: { select: { name: true, subject: true } },
      _count: { select: { reads: true } },
    },
  });

  if (!notification) {
    return NextResponse.json(
      { success: false, message: "Bildirim bulunamadı" },
      { status: 404 }
    );
  }

  const totalMembers = await prisma.member.count({
    where: { tenantId: admin.tenantId, status: "ACTIVE" },
  });

  return NextResponse.json({
    success: true,
    data: {
      ...notification,
      readCount: notification._count.reads,
      totalMembers,
      _count: undefined,
    },
  });
}

// DELETE /api/admin/notifications/[id] — delete notification (cascade reads)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = params;

  const existing = await prisma.notification.findFirst({
    where: { id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Bildirim bulunamadı" },
      { status: 404 }
    );
  }

  await prisma.notification.delete({ where: { id } });

  return NextResponse.json({ success: true, message: "Bildirim silindi" });
}
