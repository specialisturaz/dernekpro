import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default tenant
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: "default" },
    update: {},
    create: {
      subdomain: "default",
      name: "DernekPro Demo Derneği",
      shortName: "DernekPro",
      plan: "ENTERPRISE",
      settings: {
        colors: {
          primary: "#1a5c38",
          primaryLight: "#2d8a52",
          primaryDark: "#0f3d24",
          secondary: "#c8860a",
          accent: "#e8f5ee",
        },
        contact: {
          phone: "+90 (212) 000 00 00",
          email: "info@dernekpro.com",
          address: "İstanbul, Türkiye",
        },
        social: {
          facebook: "https://facebook.com/dernekpro",
          instagram: "https://instagram.com/dernekpro",
          twitter: "https://twitter.com/dernekpro",
        },
      },
    },
  });

  console.log(`Tenant created: ${tenant.name} (${tenant.id})`);

  // Create admin user
  const adminPassword = await hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: "admin@dernekpro.com" } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: "admin@dernekpro.com",
      passwordHash: adminPassword,
      fullName: "Admin Kullanıcı",
      role: "SUPER_ADMIN",
    },
  });

  console.log(`Admin user created: ${admin.email}`);

  // Create membership types
  const types = [
    { name: "Asil Üye", annualFee: 500, order: 1 },
    { name: "Onursal Üye", annualFee: 0, order: 2 },
    { name: "Öğrenci Üye", annualFee: 100, order: 3 },
  ];

  for (const type of types) {
    await prisma.membershipType.upsert({
      where: {
        id: `${tenant.id}-${type.name.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: {},
      create: {
        id: `${tenant.id}-${type.name.toLowerCase().replace(/\s+/g, "-")}`,
        tenantId: tenant.id,
        ...type,
      },
    });
  }

  console.log("Membership types created");

  // Create categories
  const categories = [
    { name: "Eğitim", slug: "egitim" },
    { name: "Sağlık", slug: "saglik" },
    { name: "Gıda", slug: "gida" },
    { name: "Su", slug: "su" },
    { name: "Barınma", slug: "barinma" },
    { name: "Tarım", slug: "tarim" },
    { name: "Yetim Yardımı", slug: "yetim-yardimi" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: cat.slug } },
      update: {},
      create: {
        tenantId: tenant.id,
        ...cat,
      },
    });
  }

  console.log("Categories created");

  // Create demo campaigns
  const campaigns = [
    {
      title: "Yetim Yardımı Kampanyası",
      slug: "yetim-yardimi-kampanyasi",
      description: "Yetim çocuklara eğitim, gıda ve barınma desteği sağlıyoruz.",
      targetAmount: 500000,
      collectedAmount: 325000,
    },
    {
      title: "Su Kuyusu Projesi — Afrika",
      slug: "su-kuyusu-projesi-afrika",
      description: "Temiz suya erişimi olmayan köylere su kuyusu açıyoruz.",
      targetAmount: 250000,
      collectedAmount: 180000,
    },
    {
      title: "Ramazan Gıda Paketi",
      slug: "ramazan-gida-paketi",
      description: "Ramazan ayında ihtiyaç sahibi ailelere gıda paketi ulaştırıyoruz.",
      targetAmount: 100000,
      collectedAmount: 72000,
    },
  ];

  for (const campaign of campaigns) {
    await prisma.campaign.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: campaign.slug } },
      update: {},
      create: {
        tenantId: tenant.id,
        ...campaign,
      },
    });
  }

  console.log("Demo campaigns created");

  // Create demo news
  const news = [
    {
      type: "NEWS" as const,
      title: "Burkina Faso'da 10 Yeni Su Kuyusu Açıldı",
      slug: "burkina-faso-su-kuyusu",
      excerpt: "Afrika'da yürüttüğümüz su kuyusu projesi kapsamında 10 yeni kuyu daha hizmete açıldı.",
      content: "<p>Afrika'da yürüttüğümüz su kuyusu projesi kapsamında 10 yeni kuyu daha hizmete açıldı. Bu projemiz sayesinde binlerce kişi temiz suya kavuştu.</p>",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-02-20"),
      isFeatured: true,
    },
    {
      type: "NEWS" as const,
      title: "Yıllık Genel Kurul Toplantısı Gerçekleştirildi",
      slug: "yillik-genel-kurul",
      excerpt: "Derneğimizin yıllık genel kurul toplantısı üyelerin katılımıyla başarıyla tamamlandı.",
      content: "<p>Derneğimizin yıllık genel kurul toplantısı üyelerin katılımıyla başarıyla tamamlandı.</p>",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-02-15"),
      isFeatured: false,
    },
  ];

  for (const post of news) {
    await prisma.post.upsert({
      where: { tenantId_slug_type: { tenantId: tenant.id, slug: post.slug, type: post.type } },
      update: {},
      create: {
        tenantId: tenant.id,
        authorId: admin.id,
        ...post,
      },
    });
  }

  console.log("Demo news created");

  console.log("\nSeed completed successfully!");
  console.log("---");
  console.log("Admin Login:");
  console.log("  Email: admin@dernekpro.com");
  console.log("  Password: Admin123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
