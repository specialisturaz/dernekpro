import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const tenantId = admin.tenantId;

  const [
    totalMembers,
    pendingMembers,
    activeMembers,
    totalDonations,
    monthlyDonationSum,
    upcomingEvents,
    unreadMessages,
    recentMembers,
    recentDonations,
    recentMessages,
  ] = await Promise.all([
    prisma.member.count({ where: { tenantId } }),
    prisma.member.count({ where: { tenantId, status: "PENDING" } }),
    prisma.member.count({ where: { tenantId, status: "ACTIVE" } }),
    prisma.donation.count({ where: { tenantId, status: "COMPLETED" } }),
    prisma.donation.aggregate({
      where: {
        tenantId,
        status: "COMPLETED",
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { amount: true },
    }),
    prisma.event.count({
      where: { tenantId, status: "UPCOMING" },
    }),
    prisma.contact.count({ where: { tenantId, isRead: false } }),
    prisma.member.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        city: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.donation.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        donorName: true,
        amount: true,
        isAnonymous: true,
        status: true,
        createdAt: true,
        campaign: { select: { title: true } },
      },
    }),
    prisma.contact.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        subject: true,
        isRead: true,
        createdAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      stats: {
        totalMembers,
        pendingMembers,
        activeMembers,
        totalDonations,
        monthlyDonationSum: monthlyDonationSum._sum.amount || 0,
        upcomingEvents,
        unreadMessages,
      },
      recentMembers,
      recentDonations,
      recentMessages,
    },
  });
}
