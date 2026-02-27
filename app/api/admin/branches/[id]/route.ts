import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { branchSchema } from "@/lib/validations";

// GET: Tek sube detay
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  const branch = await prisma.branch.findFirst({
    where: { id, tenantId: auth.tenantId },
  });

  if (!branch) {
    return NextResponse.json({ success: false, message: "Şube bulunamadı" }, { status: 404 });
  }

  // Mesaj sayisi
  const messageCount = await prisma.branchMessage.count({
    where: { branchId: id, tenantId: auth.tenantId },
  });

  return NextResponse.json({
    success: true,
    data: { ...branch, messageCount },
  });
}

// PUT: Sube guncelle
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.branch.findFirst({
    where: { id, tenantId: auth.tenantId },
  });
  if (!existing) {
    return NextResponse.json({ success: false, message: "Şube bulunamadı" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = branchSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Geçersiz veri";
    return NextResponse.json({ success: false, message: firstError }, { status: 400 });
  }

  // Slug unique kontrolu (kendisi haric)
  const slugConflict = await prisma.branch.findFirst({
    where: { tenantId: auth.tenantId, slug: parsed.data.slug, NOT: { id } },
  });
  if (slugConflict) {
    return NextResponse.json({ success: false, message: "Bu slug zaten kullanılıyor" }, { status: 400 });
  }

  const branch = await prisma.branch.update({
    where: { id },
    data: {
      ...parsed.data,
      foundedAt: parsed.data.foundedAt ? new Date(parsed.data.foundedAt) : null,
    },
  });

  return NextResponse.json({ success: true, data: branch });
}

// DELETE: Sube sil
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.branch.findFirst({
    where: { id, tenantId: auth.tenantId },
  });
  if (!existing) {
    return NextResponse.json({ success: false, message: "Şube bulunamadı" }, { status: 404 });
  }

  // Cascade: once mesajlari sil
  await prisma.branchMessage.deleteMany({ where: { branchId: id } });
  await prisma.branch.delete({ where: { id } });

  return NextResponse.json({ success: true, message: "Şube silindi" });
}
