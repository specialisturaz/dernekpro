import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireMember } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

// GET /api/member/notifications — member's notifications with read status
export async function GET() {
  const member = await requireMember();
  if (!member) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: {
      tenantId: member.tenantId,
      isGlobal: true,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      message: true,
      type: true,
      link: true,
      createdAt: true,
      reads: {
        where: { memberId: member.userId },
        select: { id: true },
      },
    },
  });

  const data = notifications.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    link: n.link,
    createdAt: n.createdAt,
    isRead: n.reads.length > 0,
  }));

  return NextResponse.json({ success: true, data });
}

// PATCH /api/member/notifications — mark notification as read
export async function PATCH(request: NextRequest) {
  const member = await requireMember();
  if (!member) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const body = await request.json();
  const { notificationId } = body;

  if (!notificationId) {
    return NextResponse.json(
      { success: false, message: "Bildirim ID gerekli" },
      { status: 400 }
    );
  }

  // Verify notification exists and belongs to the same tenant
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, tenantId: member.tenantId },
  });

  if (!notification) {
    return NextResponse.json(
      { success: false, message: "Bildirim bulunamadı" },
      { status: 404 }
    );
  }

  await prisma.notificationRead.upsert({
    where: {
      notificationId_memberId: {
        notificationId,
        memberId: member.userId,
      },
    },
    create: {
      notificationId,
      memberId: member.userId,
    },
    update: {},
  });

  return NextResponse.json({ success: true, message: "Bildirim okundu olarak işaretlendi" });
}
