import { NextResponse } from "next/server";
import { requireMember } from "@/lib/member-auth";
import { prisma } from "@/lib/db";

// GET /api/member/dues — current member's dues
export async function GET() {
  const payload = await requireMember();
  if (!payload) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const dues = await prisma.due.findMany({
    where: { memberId: payload.userId },
    orderBy: { period: "desc" },
  });

  // Summary
  const totalPaid = dues.filter((d) => d.status === "PAID").reduce((s, d) => s + d.amount, 0);
  const totalPending = dues.filter((d) => d.status === "PENDING").reduce((s, d) => s + d.amount, 0);
  const totalOverdue = dues.filter((d) => d.status === "OVERDUE").reduce((s, d) => s + d.amount, 0);

  return NextResponse.json({
    success: true,
    data: {
      dues,
      summary: {
        totalPaid,
        totalPending,
        totalOverdue,
        totalCount: dues.length,
        paidCount: dues.filter((d) => d.status === "PAID").length,
        pendingCount: dues.filter((d) => d.status === "PENDING").length,
        overdueCount: dues.filter((d) => d.status === "OVERDUE").length,
      },
    },
  });
}
