import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminNavGroups } from "@/lib/modules";

export const dynamic = "force-dynamic";

// GET: Aktif modullere gore sidebar navigasyon gruplari
export async function GET() {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const navGroups = await getAdminNavGroups(auth.tenantId);

  return NextResponse.json({ success: true, data: navGroups });
}
