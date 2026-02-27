import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  const slide = await prisma.slide.findFirst({
    where: { id, tenantId: admin.tenantId },
  });

  if (!slide) {
    return NextResponse.json({ success: false, message: "Slide bulunamadi." }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: slide });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.slide.findFirst({
    where: { id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json({ success: false, message: "Slide bulunamadi." }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    const fields = [
      "mediaUrl", "mobileMediaUrl", "title", "subtitle", "buttonText",
      "buttonLink", "type", "order", "isActive", "badge", "bgColor",
      "accentColor", "statsLabel", "statsValue", "slideDate", "location",
    ];

    for (const field of fields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    const slide = await prisma.slide.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: slide });
  } catch {
    return NextResponse.json(
      { success: false, message: "Slide guncellenirken hata olustu." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.slide.findFirst({
    where: { id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json({ success: false, message: "Slide bulunamadi." }, { status: 404 });
  }

  await prisma.slide.delete({ where: { id } });

  return NextResponse.json({ success: true, message: "Slide silindi." });
}
