import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/bank-accounts
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const accounts = await prisma.bankAccount.findMany({
      where: { tenantId: admin.tenantId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: accounts });
  } catch (error) {
    console.error("Bank accounts GET error:", error);
    return NextResponse.json({ success: false, message: "Hesaplar yüklenirken hata oluştu" }, { status: 500 });
  }
}

// POST /api/admin/bank-accounts
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bankName, bankLogo, accountName, iban, accountNo, branchName, branchCode, currency, description, order } = body;

    if (!bankName || !accountName || !iban) {
      return NextResponse.json(
        { success: false, message: "Banka adı, hesap sahibi ve IBAN zorunludur" },
        { status: 400 }
      );
    }

    const account = await prisma.bankAccount.create({
      data: {
        tenantId: admin.tenantId,
        bankName,
        bankLogo: bankLogo || null,
        accountName,
        iban,
        accountNo: accountNo || null,
        branchName: branchName || null,
        branchCode: branchCode || null,
        currency: currency || "TRY",
        description: description || null,
        order: order ?? 0,
      },
    });

    return NextResponse.json({ success: true, message: "Hesap oluşturuldu", data: account }, { status: 201 });
  } catch (error) {
    console.error("Bank account POST error:", error);
    return NextResponse.json({ success: false, message: "Hesap oluşturulurken hata oluştu" }, { status: 500 });
  }
}
