import { prisma } from "./db";

export async function getDefaultTenant() {
  const tenantId = process.env.DEFAULT_TENANT_ID;
  if (tenantId) {
    return prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });
  }
  return prisma.tenant.findFirst({
    where: { isActive: true },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
}
