import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// PATCH /api/admin/bank-accounts/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.bankAccount.findFirst({
      where: { id, tenantId: admin.tenantId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: "Hesap bulunamadı" }, { status: 404 });
    }

    const updated = await prisma.bankAccount.update({
      where: { id },
      data: {
        bankName: body.bankName ?? existing.bankName,
        bankLogo: body.bankLogo !== undefined ? (body.bankLogo || null) : existing.bankLogo,
        accountName: body.accountName ?? existing.accountName,
        iban: body.iban ?? existing.iban,
        accountNo: body.accountNo !== undefined ? (body.accountNo || null) : existing.accountNo,
        branchName: body.branchName !== undefined ? (body.branchName || null) : existing.branchName,
        branchCode: body.branchCode !== undefined ? (body.branchCode || null) : existing.branchCode,
        currency: body.currency ?? existing.currency,
        description: body.description !== undefined ? (body.description || null) : existing.description,
        isActive: body.isActive ?? existing.isActive,
        order: body.order ?? existing.order,
      },
    });

    return NextResponse.json({ success: true, message: "Hesap güncellendi", data: updated });
  } catch (error) {
    console.error("Bank account PATCH error:", error);
    return NextResponse.json({ success: false, message: "Hesap güncellenirken hata oluştu" }, { status: 500 });
  }
}

// DELETE /api/admin/bank-accounts/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.bankAccount.findFirst({
      where: { id, tenantId: admin.tenantId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: "Hesap bulunamadı" }, { status: 404 });
    }

    await prisma.bankAccount.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Hesap silindi" });
  } catch (error) {
    console.error("Bank account DELETE error:", error);
    return NextResponse.json({ success: false, message: "Hesap silinirken hata oluştu" }, { status: 500 });
  }
}
