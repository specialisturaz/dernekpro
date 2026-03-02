import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET active or next scheduled livestream (public)
export async function GET() {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({
          where: { id: tenantId },
          select: { id: true },
        })
      : await prisma.tenant.findFirst({
          where: { isActive: true },
          select: { id: true },
          orderBy: { createdAt: "asc" },
        });

    if (!tenant) {
      return NextResponse.json(
        { success: true, data: null },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );
    }

    // First try to find a LIVE stream
    const liveStream = await prisma.liveStream.findFirst({
      where: {
        tenantId: tenant.id,
        status: "LIVE",
      },
    });

    if (liveStream) {
      return NextResponse.json(
        { success: true, data: liveStream },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );
    }

    // If no live stream, find the nearest scheduled one
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const scheduledStream = await prisma.liveStream.findFirst({
      where: {
        tenantId: tenant.id,
        status: "SCHEDULED",
        scheduledAt: { gte: oneDayAgo },
      },
      orderBy: { scheduledAt: "asc" },
    });

    // Auto-start: if scheduled time has passed, transition to LIVE automatically
    if (scheduledStream && new Date(scheduledStream.scheduledAt) <= new Date()) {
      const updated = await prisma.liveStream.update({
        where: { id: scheduledStream.id },
        data: { status: "LIVE", startedAt: new Date() },
      });
      return NextResponse.json(
        { success: true, data: updated },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );
    }

    return NextResponse.json(
      { success: true, data: scheduledStream },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
