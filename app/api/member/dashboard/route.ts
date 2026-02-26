import { NextResponse } from "next/server";
import { requireMember } from "@/lib/member-auth";
import { prisma } from "@/lib/db";

// GET /api/member/dashboard — aggregated stats for member dashboard
export async function GET() {
  const payload = await requireMember();
  if (!payload) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const memberId = payload.userId;

  const [member, donations, dues, upcomingEvents] = await Promise.all([
    prisma.member.findUnique({
      where: { id: memberId },
      select: { fullName: true, status: true, joinedAt: true, createdAt: true },
    }),

    prisma.donation.findMany({
      where: { memberId, status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { campaign: { select: { title: true } } },
    }),

    prisma.due.findMany({
      where: { memberId },
      orderBy: { period: "desc" },
      take: 12,
    }),

    prisma.eventRegistration.findMany({
      where: { memberId },
      include: {
        event: {
          select: {
            title: true,
            startAt: true,
            endAt: true,
            location: true,
            eventType: true,
            status: true,
          },
        },
      },
      orderBy: { event: { startAt: "asc" } },
      take: 5,
    }),
  ]);

  // Calculate stats
  const allDonations = await prisma.donation.aggregate({
    where: { memberId, status: "COMPLETED" },
    _sum: { amount: true },
    _count: true,
  });

  const pendingDues = dues.filter((d) => d.status === "PENDING" || d.status === "OVERDUE");

  // Membership duration
  const memberSince = member?.joinedAt || member?.createdAt;
  let membershipYears = 0;
  if (memberSince) {
    membershipYears = Math.floor(
      (Date.now() - new Date(memberSince).getTime()) / (1000 * 60 * 60 * 24 * 365)
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      member: {
        fullName: member?.fullName || "",
        status: member?.status || "PENDING",
        memberSince,
        membershipYears,
      },
      stats: {
        totalDonations: allDonations._sum.amount || 0,
        donationCount: allDonations._count || 0,
        pendingDuesCount: pendingDues.length,
        pendingDuesAmount: pendingDues.reduce((s, d) => s + d.amount, 0),
        dueStatus: pendingDues.length === 0 ? "Güncel" : `${pendingDues.length} bekleyen`,
      },
      recentDonations: donations.map((d) => ({
        id: d.id,
        amount: d.amount,
        type: d.donationType,
        campaign: d.campaign?.title || null,
        date: d.createdAt,
        status: d.status,
      })),
      recentDues: dues.slice(0, 6).map((d) => ({
        id: d.id,
        period: d.period,
        amount: d.amount,
        status: d.status,
        paidAt: d.paidAt,
      })),
      upcomingEvents: upcomingEvents
        .filter((r) => r.event.status === "UPCOMING" || r.event.status === "ONGOING")
        .map((r) => ({
          id: r.eventId,
          title: r.event.title,
          startAt: r.event.startAt,
          location: r.event.location,
          eventType: r.event.eventType,
        })),
    },
  });
}
