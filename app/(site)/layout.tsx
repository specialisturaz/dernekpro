import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import CookieConsent from "@/components/site/CookieConsent";
import LiveStreamBar from "@/components/site/LiveStreamBar";
import MaintenancePage from "./bakim/page";
import { prisma } from "@/lib/db";
import type { MaintenanceSettings } from "@/types";
import {
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
  SITE_URL,
} from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";

async function getMaintenanceStatus(): Promise<MaintenanceSettings | null> {
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

    const settings = (tenant?.settings as Record<string, unknown>) || {};
    const maintenance = settings.maintenance as MaintenanceSettings | undefined;
    return maintenance?.enabled ? maintenance : null;
  } catch {
    return null;
  }
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const maintenance = await getMaintenanceStatus();

  if (maintenance) {
    return <MaintenancePage message={maintenance.message} />;
  }

  const organizationJsonLd = generateOrganizationJsonLd({
    name: "DernekPro",
    url: SITE_URL,
    logo: `${SITE_URL}/images/og-default.jpg`,
    address: { city: "İstanbul", country: "TR" },
  });

  const webSiteJsonLd = generateWebSiteJsonLd();

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={webSiteJsonLd} />
      <Header />
      <LiveStreamBar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CookieConsent />
      <WhatsAppButton />
    </>
  );
}
