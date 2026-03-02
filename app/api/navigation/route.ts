import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mainNavigation } from "@/lib/navigation";
import { MODULE_REGISTRY } from "@/lib/modules";
import { isModuleActive } from "@/lib/modules/utils";
import type { MenuItem } from "@/types";

export const dynamic = "force-dynamic";

// GET: Public navigasyon — tenant'in aktif modullerine gore ek ogeler ekler
export async function GET() {
  // Branding verisini ayri try/catch ile al — modul hatalari branding'i etkilemesin
  let branding: { name: string; logoUrl: string; logoWidth: number; logoHeight: number } | null = null;
  let tenantId: string | null = null;

  try {
    const tenant = await prisma.tenant.findFirst({
      select: { id: true, name: true, settings: true },
    });
    if (tenant) {
      tenantId = tenant.id;
      const tenantSettings = (tenant.settings as Record<string, unknown>) || {};
      const logoConfig = (tenantSettings.logo as { logoUrl?: string; logoWidth?: number; logoHeight?: number }) || {};
      branding = {
        name: tenant.name,
        logoUrl: logoConfig.logoUrl || "",
        logoWidth: logoConfig.logoWidth || 140,
        logoHeight: logoConfig.logoHeight || 40,
      };
    }
  } catch {
    // Tenant sorgusu basarisiz — branding null kalir
  }

  // Navigasyon + modul sorgulari
  try {
    if (!tenantId) {
      return NextResponse.json({ success: true, data: mainNavigation, branding });
    }

    // Aktif opsiyonel modulleri cek
    let tenantModules: { moduleCode: string }[] = [];
    let campaignsActive = true; // varsayilan aktif
    try {
      tenantModules = await prisma.tenantModule.findMany({
        where: { tenantId, isActive: true },
        select: { moduleCode: true },
      });
      campaignsActive = await isModuleActive(tenantId, "donations");
    } catch {
      // TenantModule tablosu yoksa veya hata olursa varsayilan degerleri kullan
    }

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

    // Admin panelinden eklenen yayinlanmis sayfalari cek
    let cmsPages: { id: string; title: string; slug: string; order: number }[] = [];
    try {
      cmsPages = await prisma.page.findMany({
        where: { tenantId, isPublished: true },
        select: { id: true, title: true, slug: true, order: true },
        orderBy: { order: "asc" },
      });
    } catch {
      // Page tablosu yoksa veya hata olursa bos kalir
    }

    // Static nav + ek ogeler
    const nav = [...mainNavigation].map((item): MenuItem => {
      if (item.label === "Destek Ol" && !campaignsActive) {
        return { id: item.id, label: "Hesap Numaralarımız", href: "/hesaplar", order: item.order };
      }
      return item;
    });
    for (const extra of extraNavItems) {
      if (!nav.find((n) => n.href === extra.href)) {
        nav.push(extra);
      }
    }

    // CMS sayfalarini navigasyona ekle
    for (const page of cmsPages) {
      const pageHref = `/${page.slug}`;
      if (!nav.find((n) => n.href === pageHref)) {
        nav.push({
          id: `page-${page.id}`,
          label: page.title,
          href: pageHref,
          order: page.order > 0 ? page.order : 90,
        });
      }
    }

    nav.sort((a, b) => a.order - b.order);

    return NextResponse.json({ success: true, data: nav, branding });
  } catch {
    return NextResponse.json({ success: true, data: mainNavigation, branding });
  }
}
