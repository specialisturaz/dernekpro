import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultTenant } from "@/lib/tenant";

export const dynamic = "force-dynamic";

// GET /api/bank-accounts — public endpoint
export async function GET() {
  try {
    const tenant = await getDefaultTenant();
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Tenant bulunamadı" }, { status: 404 });
    }

    const accounts = await prisma.bankAccount.findMany({
      where: { tenantId: tenant.id, isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        bankName: true,
        bankLogo: true,
        accountName: true,
        iban: true,
        accountNo: true,
        branchName: true,
        branchCode: true,
        currency: true,
        description: true,
      },
    });

    return NextResponse.json({ success: true, data: accounts });
  } catch (error) {
    console.error("Bank accounts public GET error:", error);
    return NextResponse.json({ success: false, message: "Hesaplar yüklenirken hata oluştu" }, { status: 500 });
  }
}
