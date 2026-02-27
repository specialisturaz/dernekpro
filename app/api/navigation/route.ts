import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mainNavigation } from "@/lib/navigation";
import { MODULE_REGISTRY } from "@/lib/modules";
import { isModuleActive } from "@/lib/modules/utils";
import type { MenuItem } from "@/types";

// GET: Public navigasyon — tenant'in aktif modullerine gore ek ogeler ekler
export async function GET() {
  try {
    // Ilk tenant'i kullan (tek-tenant kurulum)
    const tenant = await prisma.tenant.findFirst({
      select: { id: true, name: true, settings: true },
    });
    if (!tenant) {
      return NextResponse.json({ success: true, data: mainNavigation, branding: null });
    }

    // Branding verisi
    const tenantSettings = (tenant.settings as Record<string, unknown>) || {};
    const logoConfig = (tenantSettings.logo as { logoUrl?: string; logoWidth?: number; logoHeight?: number }) || {};
    const branding = {
      name: tenant.name,
      logoUrl: logoConfig.logoUrl || "",
      logoWidth: logoConfig.logoWidth || 140,
      logoHeight: logoConfig.logoHeight || 40,
    };

    // Aktif opsiyonel modulleri cek
    const tenantModules = await prisma.tenantModule.findMany({
      where: { tenantId: tenant.id, isActive: true },
      select: { moduleCode: true },
    });

    // Online bagis modulu aktif mi kontrol et
    const campaignsActive = await isModuleActive(tenant.id, "donations");

    // Opsiyonel modullerin public nav items'larini topla
    const extraNavItems: MenuItem[] = [];
    for (const tm of tenantModules) {
      const mod = MODULE_REGISTRY[tm.moduleCode];
      if (mod?.publicNavItems) {
        for (const item of mod.publicNavItems) {
          extraNavItems.push({
            id: item.id,
            label: item.label,
            href: item.href,
            order: item.order,
            children: item.children?.map((c) => ({
              id: c.id,
              label: c.label,
              href: c.href,
              order: c.order,
            })),
          });
        }
      }
    }

    // Static nav + ek ogeler
    // Kampanya modulu pasifse "Destek Ol" dropdown'unu tek "Hesap Numaralarimiz" butonuna donustur
    const nav = [...mainNavigation].map((item): MenuItem => {
      if (item.label === "Destek Ol" && !campaignsActive) {
        return { id: item.id, label: "Hesap Numaralarımız", href: "/hesaplar", order: item.order };
      }
      return item;
    });
    for (const extra of extraNavItems) {
      // Zaten varsa ekleme
      if (!nav.find((n) => n.href === extra.href)) {
        nav.push(extra);
      }
    }

    // Order'a gore sirala
    nav.sort((a, b) => a.order - b.order);

    return NextResponse.json({ success: true, data: nav, branding });
  } catch {
    return NextResponse.json({ success: true, data: mainNavigation, branding: null });
  }
}
