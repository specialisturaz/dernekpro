import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET single event
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const event = await prisma.event.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
    include: { _count: { select: { registrations: true } } },
  });

  if (!event) {
    return NextResponse.json({ success: false, message: "Etkinlik bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: event });
}

// PATCH update event
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const existing = await prisma.event.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json({ success: false, message: "Etkinlik bulunamadı" }, { status: 404 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.title !== undefined) data.title = body.title;
  if (body.slug !== undefined) data.slug = body.slug;
  if (body.description !== undefined) data.description = body.description;
  if (body.coverImage !== undefined) data.coverImage = body.coverImage || null;
  if (body.startAt !== undefined) data.startAt = new Date(body.startAt);
  if (body.endAt !== undefined) data.endAt = new Date(body.endAt);
  if (body.location !== undefined) data.location = body.location || null;
  if (body.eventType !== undefined) data.eventType = body.eventType;
  if (body.capacity !== undefined) data.capacity = body.capacity ? parseInt(body.capacity) : null;
  if (body.isFree !== undefined) data.isFree = body.isFree;
  if (body.price !== undefined) data.price = body.price ? parseFloat(body.price) : null;
  if (body.requiresRegistration !== undefined) data.requiresRegistration = body.requiresRegistration;
  if (body.status !== undefined) data.status = body.status;

  const event = await prisma.event.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ success: true, message: "Etkinlik güncellendi", data: event });
}

// DELETE event
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const existing = await prisma.event.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json({ success: false, message: "Etkinlik bulunamadı" }, { status: 404 });
  }

  await prisma.event.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true, message: "Etkinlik silindi" });
}
