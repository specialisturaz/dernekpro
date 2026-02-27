import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/contacts — list contacts ordered by createdAt desc
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;

  const where: Record<string, unknown> = { tenantId: admin.tenantId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { subject: { contains: search, mode: "insensitive" } },
    ];
  }

  const [contacts, total, unreadCount] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contact.count({ where: { tenantId: admin.tenantId } }),
    prisma.contact.count({ where: { tenantId: admin.tenantId, isRead: false } }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      contacts,
      summary: { total, unreadCount },
    },
  });
}

// PATCH /api/admin/contacts — mark as read/unread (pass id and isRead in body)
export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const { id, isRead } = body;

  if (!id || typeof isRead !== "boolean") {
    return NextResponse.json(
      { success: false, message: "Geçersiz parametreler" },
      { status: 400 }
    );
  }

  const existing = await prisma.contact.findFirst({
    where: { id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Mesaj bulunamadı" },
      { status: 404 }
    );
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: { isRead },
  });

  return NextResponse.json({
    success: true,
    message: isRead ? "Okundu olarak işaretlendi" : "Okunmadı olarak işaretlendi",
    data: contact,
  });
}

// DELETE /api/admin/contacts — delete contact (pass id as query param)
export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Mesaj ID gerekli" },
      { status: 400 }
    );
  }

  const existing = await prisma.contact.findFirst({
    where: { id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Mesaj bulunamadı" },
      { status: 404 }
    );
  }

  await prisma.contact.delete({ where: { id } });

  return NextResponse.json({ success: true, message: "Mesaj silindi" });
}
