import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

// GET: Subeye ait mesajlari listele
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  const messages = await prisma.branchMessage.findMany({
    where: { branchId: id, tenantId: auth.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: messages });
}
