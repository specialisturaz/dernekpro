import { prisma } from "@/lib/db";
import type { StatsSettings } from "@/types";
import StatsClient from "./StatsClient";

const DEFAULT_STATS: StatsSettings = {
  title: "",
  subtitle: "",
  items: [
    { label: "Yardım Kampanyası", value: 150, suffix: "+", icon: "heart" },
    { label: "Ulaşılan Kişi", value: 50000, suffix: "+", icon: "users" },
    { label: "Yıllık Deneyim", value: 15, suffix: " Yıl", icon: "calendar" },
    { label: "Gönüllü Bağışçı", value: 3500, suffix: "+", icon: "hand" },
  ],
};

async function getStatsSettings(): Promise<StatsSettings> {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({
          where: { id: tenantId },
          select: { settings: true },
        })
      : await prisma.tenant.findFirst({
          where: { isActive: true },
          select: { settings: true },
          orderBy: { createdAt: "asc" },
        });

    if (!tenant) return DEFAULT_STATS;

    const settings = (tenant.settings as Record<string, unknown>) || {};
    const stats = settings.stats as StatsSettings | undefined;

    return stats && stats.items?.length > 0 ? stats : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

export default async function StatsSection() {
  const stats = await getStatsSettings();

  return (
    <StatsClient
      title={stats.title}
      subtitle={stats.subtitle}
      items={stats.items}
    />
  );
}
