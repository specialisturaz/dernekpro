import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireMember } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

// GET /api/notifications/unread-count — member's unread notification count
export async function GET() {
  const member = await requireMember();
  if (!member) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const totalNotifications = await prisma.notification.count({
    where: {
      tenantId: member.tenantId,
      isGlobal: true,
    },
  });

  const readCount = await prisma.notificationRead.count({
    where: {
      memberId: member.userId,
      notification: {
        tenantId: member.tenantId,
        isGlobal: true,
      },
    },
  });

  const unreadCount = totalNotifications - readCount;

  return NextResponse.json({
    success: true,
    data: { unreadCount: Math.max(0, unreadCount) },
  });
}
