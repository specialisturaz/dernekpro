import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { MODULE_REGISTRY } from "@/lib/modules";
import { checkDependencies } from "@/lib/modules";

export const dynamic = "force-dynamic";

// GET: Tum modulleri listele (aktif/pasif durumuyla)
export async function GET() {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const tenantModules = await prisma.tenantModule.findMany({
    where: { tenantId: auth.tenantId },
  });

  const tmMap = new Map(tenantModules.map((tm) => [tm.moduleCode, tm]));

  const modules = Object.values(MODULE_REGISTRY).map((mod) => {
    const tm = tmMap.get(mod.code);
    return {
      ...mod,
      // Core her zaman aktif; opsiyonel moduller DB kaydi yoksa varsayilan aktif
      isActive: mod.isCore ? true : (tm ? tm.isActive : true),
      activatedAt: tm?.activatedAt ?? null,
      settings: tm?.settings ?? null,
    };
  });

  return NextResponse.json({ success: true, data: modules });
}

// PATCH: Modul aktif/pasif toggle
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const body = await req.json();
  const { moduleCode, isActive } = body;

  if (!moduleCode || typeof isActive !== "boolean") {
    return NextResponse.json({ success: false, message: "Geçersiz istek" }, { status: 400 });
  }

  const mod = MODULE_REGISTRY[moduleCode];
  if (!mod) {
    return NextResponse.json({ success: false, message: "Modül bulunamadı" }, { status: 404 });
  }

  if (mod.isCore) {
    return NextResponse.json({ success: false, message: "Çekirdek modüller devre dışı bırakılamaz" }, { status: 400 });
  }

  // Aktif etme: bagimlilik kontrolu
  if (isActive && mod.dependencies?.length) {
    const activeTMs = await prisma.tenantModule.findMany({
      where: { tenantId: auth.tenantId, isActive: true },
      select: { moduleCode: true },
    });
    const coreCodes = Object.values(MODULE_REGISTRY)
      .filter((m) => m.isCore)
      .map((m) => m.code);
    const allActive = [...coreCodes, ...activeTMs.map((t) => t.moduleCode)];
    const missing = checkDependencies(moduleCode, allActive);
    if (missing.length > 0) {
      const names = missing.map((c) => MODULE_REGISTRY[c]?.name || c).join(", ");
      return NextResponse.json({
        success: false,
        message: `Önce şu modülleri aktif edin: ${names}`,
      }, { status: 400 });
    }
  }

  const tm = await prisma.tenantModule.upsert({
    where: { tenantId_moduleCode: { tenantId: auth.tenantId, moduleCode } },
    update: { isActive, ...(isActive ? { activatedAt: new Date() } : {}) },
    create: {
      tenantId: auth.tenantId,
      moduleCode,
      isActive,
      activatedAt: isActive ? new Date() : null,
    },
  });

  return NextResponse.json({ success: true, data: tm });
}
