import { NextResponse } from "next/server";
import { requireMember } from "@/lib/member-auth";
import { prisma } from "@/lib/db";

// GET /api/member/donations — current member's donations
export async function GET() {
  const payload = await requireMember();
  if (!payload) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const donations = await prisma.donation.findMany({
    where: { memberId: payload.userId },
    orderBy: { createdAt: "desc" },
    include: {
      campaign: { select: { title: true } },
    },
  });

  const totalAmount = donations
    .filter((d) => d.status === "COMPLETED")
    .reduce((s, d) => s + d.amount, 0);

  return NextResponse.json({
    success: true,
    data: {
      donations,
      summary: {
        totalAmount,
        totalCount: donations.length,
        completedCount: donations.filter((d) => d.status === "COMPLETED").length,
      },
    },
  });
}
