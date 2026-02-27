import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET single livestream
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz" },
      { status: 401 }
    );
  }

  const liveStream = await prisma.liveStream.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
  });

  if (!liveStream) {
    return NextResponse.json(
      { success: false, message: "Canlı yayın bulunamadı" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: liveStream });
}

// PATCH update livestream
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz" },
      { status: 401 }
    );
  }

  const existing = await prisma.liveStream.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Canlı yayın bulunamadı" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.youtubeUrl !== undefined) data.youtubeUrl = body.youtubeUrl;
  if (body.thumbnailUrl !== undefined) data.thumbnailUrl = body.thumbnailUrl;
  if (body.scheduledAt !== undefined)
    data.scheduledAt = new Date(body.scheduledAt);
  if (body.notifyUsers !== undefined) data.notifyUsers = body.notifyUsers;

  // Status transitions
  if (body.status !== undefined) {
    data.status = body.status;
    if (body.status === "LIVE" && existing.status !== "LIVE") {
      data.startedAt = new Date();
    }
    if (body.status === "ENDED" && existing.status !== "ENDED") {
      data.endedAt = new Date();
    }
  }

  const liveStream = await prisma.liveStream.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({
    success: true,
    message: "Canlı yayın güncellendi",
    data: liveStream,
  });
}

// DELETE livestream
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz" },
      { status: 401 }
    );
  }

  const existing = await prisma.liveStream.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Canlı yayın bulunamadı" },
      { status: 404 }
    );
  }

  await prisma.liveStream.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true, message: "Canlı yayın silindi" });
}
