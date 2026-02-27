import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/donations — list donations with campaign relation
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const donationType = searchParams.get("donationType") || undefined;

  const where: Record<string, unknown> = { tenantId: admin.tenantId };
  if (status) where.status = status;
  if (donationType) where.donationType = donationType;
  if (search) {
    where.OR = [
      { donorName: { contains: search, mode: "insensitive" } },
      { donorEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  const [donations, total, totalAmount, completedCount] = await Promise.all([
    prisma.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        donorName: true,
        donorEmail: true,
        amount: true,
        donationType: true,
        paymentMethod: true,
        status: true,
        isAnonymous: true,
        isRecurring: true,
        createdAt: true,
        campaign: { select: { id: true, title: true } },
      },
    }),
    prisma.donation.count({ where }),
    prisma.donation.aggregate({
      where: { tenantId: admin.tenantId },
      _sum: { amount: true },
    }),
    prisma.donation.count({
      where: { tenantId: admin.tenantId, status: "COMPLETED" },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      donations,
      summary: {
        total,
        totalAmount: totalAmount._sum.amount || 0,
        completedCount,
      },
    },
  });
}
