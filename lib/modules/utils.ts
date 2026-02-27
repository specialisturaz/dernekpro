import { prisma } from "@/lib/db";
import { MODULE_REGISTRY, MENU_GROUP_ORDER } from "./registry";
import type { ModuleDefinition, ModuleCategory } from "./registry";
import { getDefaultTenant } from "@/lib/tenant";

/**
 * Tenant icin aktif modul kodlarini dondurur.
 * Core moduller her zaman dahildir.
 * DB'de kaydi olmayan opsiyonel moduller varsayilan olarak aktif kabul edilir.
 */
export async function getActiveModuleCodes(tenantId: string): Promise<string[]> {
  // DB'den tum tenant modul kayitlarini cek
  const tenantModules = await prisma.tenantModule.findMany({
    where: { tenantId },
    select: { moduleCode: true, isActive: true },
  });

  const tmMap = new Map(tenantModules.map((tm) => [tm.moduleCode, tm.isActive]));

  // Tum registry modulleri icin aktiflik durumunu belirle
  const activeCodes: string[] = [];
  for (const mod of Object.values(MODULE_REGISTRY)) {
    if (mod.isCore) {
      // Core her zaman aktif
      activeCodes.push(mod.code);
    } else if (tmMap.has(mod.code)) {
      // DB kaydi varsa DB'deki degeri kullan
      if (tmMap.get(mod.code)) activeCodes.push(mod.code);
    } else {
      // DB kaydi yoksa varsayilan aktif
      activeCodes.push(mod.code);
    }
  }

  return activeCodes;
}

/**
 * Tenant icin aktif ModuleDefinition dizisi dondurur.
 */
export async function getActiveModules(tenantId: string): Promise<ModuleDefinition[]> {
  const codes = await getActiveModuleCodes(tenantId);
  return codes
    .map((code) => MODULE_REGISTRY[code])
    .filter(Boolean);
}

/**
 * Tek bir modulun aktif olup olmadigini kontrol eder.
 */
export async function isModuleActive(tenantId: string, moduleCode: string): Promise<boolean> {
  const def = MODULE_REGISTRY[moduleCode];
  if (!def) return false;
  if (def.isCore) return true;

  const tm = await prisma.tenantModule.findUnique({
    where: { tenantId_moduleCode: { tenantId, moduleCode } },
    select: { isActive: true },
  });

  // DB kaydi yoksa varsayilan aktif
  return tm ? tm.isActive : true;
}

/**
 * Modul bagimliliklarini kontrol eder.
 * Eksik bagimlilik kodlarini dondurur (bos dizi = OK).
 */
export function checkDependencies(
  moduleCode: string,
  activeCodes: string[]
): string[] {
  const def = MODULE_REGISTRY[moduleCode];
  if (!def || !def.dependencies?.length) return [];

  const activeSet = new Set(activeCodes);
  return def.dependencies.filter((dep) => !activeSet.has(dep));
}

/**
 * Tum modulleri kategoriye gore gruplayarak dondurur.
 */
export function getModulesByCategory(): Record<ModuleCategory, ModuleDefinition[]> {
  const result: Record<ModuleCategory, ModuleDefinition[]> = {
    icerik: [],
    yonetim: [],
    finans: [],
    iletisim: [],
    sistem: [],
  };

  for (const mod of Object.values(MODULE_REGISTRY)) {
    result[mod.category].push(mod);
  }

  return result;
}

/**
 * Online bagis modulu aktif degilse bagis linkleri /hesaplar'a yonlendirilir.
 */
export async function getDonationHref(): Promise<string> {
  try {
    const tenant = await getDefaultTenant();
    if (!tenant) return "/bagis";
    const active = await isModuleActive(tenant.id, "donations");
    return active ? "/bagis" : "/hesaplar";
  } catch {
    return "/bagis";
  }
}

/**
 * Aktif modullerin admin menu ogelerini gruplanmis olarak dondurur.
 * AdminSidebar icin kullanilir.
 */
export async function getAdminNavGroups(tenantId: string) {
  const modules = await getActiveModules(tenantId);

  // Gruplamayi olustur
  const groupMap: Record<string, { label: string; icon: string; href: string }[]> = {};

  for (const mod of modules) {
    const group = mod.adminMenuGroup;
    if (!groupMap[group]) groupMap[group] = [];
    for (const item of mod.adminMenuItems) {
      groupMap[group].push(item);
    }
  }

  // "Moduller" linkini Sistem grubuna ekle
  if (!groupMap["Sistem"]) groupMap["Sistem"] = [];
  groupMap["Sistem"].unshift({
    label: "Moduller",
    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    href: "/admin/moduller",
  });

  // Siralama
  const sortedGroups = Object.entries(groupMap)
    .sort(([a], [b]) => (MENU_GROUP_ORDER[a] ?? 99) - (MENU_GROUP_ORDER[b] ?? 99))
    .map(([label, items]) => ({ label, items }));

  return sortedGroups;
}
