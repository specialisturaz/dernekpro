import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET livestreams list
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = { tenantId: admin.tenantId };
  if (status) where.status = status;

  const liveStreams = await prisma.liveStream.findMany({
    where,
    orderBy: { scheduledAt: "desc" },
  });

  return NextResponse.json({ success: true, data: { liveStreams } });
}

// POST create new livestream
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const liveStream = await prisma.liveStream.create({
    data: {
      tenantId: admin.tenantId,
      title: body.title,
      description: body.description || null,
      youtubeUrl: body.youtubeUrl,
      thumbnailUrl: body.thumbnailUrl || null,
      scheduledAt: new Date(body.scheduledAt),
      notifyUsers: body.notifyUsers || false,
    },
  });

  return NextResponse.json(
    { success: true, message: "Canlı yayın oluşturuldu", data: liveStream },
    { status: 201 }
  );
}
