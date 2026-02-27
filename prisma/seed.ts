import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ============================================================
  // 1. TENANT
  // ============================================================
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: "default" },
    update: {},
    create: {
      subdomain: "default",
      name: "SİEMDER",
      shortName: "SİEMDER",
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
          phone: "+90 (531) 325 01 66",
          email: "info@siemder.org.tr",
          address: "Balat, Manyasizade Cd. 58/B, 34087 Fatih/İstanbul",
        },
        social: {
          facebook: "https://facebook.com/siemder",
          instagram: "https://instagram.com/siemder",
          twitter: "https://twitter.com/siemder",
        },
        contactPage: {
          address: "Balat, Manyasizade Cd. 58/B, 34087 Fatih/İstanbul",
          phone: "+90 (531) 325 01 66",
          email: "info@siemder.org.tr",
          workingHours: "Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 10:00 - 14:00",
          mapLat: 41.027125,
          mapLng: 28.946794,
          mapZoom: 15,
          mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6019.829134666171!2d28.946794!3d41.027125!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba1be83fc27b%3A0x774f394c9df5de46!2zU8SwRU1ERVI!5e0!3m2!1str!2sus!4v1772199232154!5m2!1str!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
          socialMedia: [],
          faq: [],
        },
      },
    },
  });

  console.log(`Tenant created: ${tenant.name} (${tenant.id})`);

  // ============================================================
  // 2. ADMIN USER
  // ============================================================
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

  // ============================================================
  // 3. MEMBERSHIP TYPES
  // ============================================================
  const types = [
    { name: "Asil Üye", annualFee: 500, order: 1 },
    { name: "Onursal Üye", annualFee: 0, order: 2 },
    { name: "Öğrenci Üye", annualFee: 100, order: 3 },
  ];

  const membershipTypeMap: Record<string, string> = {};

  for (const type of types) {
    const id = `${tenant.id}-${type.name.toLowerCase().replace(/\s+/g, "-")}`;
    await prisma.membershipType.upsert({
      where: { id },
      update: {},
      create: {
        id,
        tenantId: tenant.id,
        ...type,
      },
    });
    membershipTypeMap[type.name] = id;
  }

  console.log("Membership types created");

  // ============================================================
  // 4. CATEGORIES
  // ============================================================
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

  // ============================================================
  // 5. CAMPAIGNS
  // ============================================================
  const campaignsData = [
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

  const campaignRecords: Record<string, string> = {};

  for (const campaign of campaignsData) {
    const record = await prisma.campaign.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: campaign.slug } },
      update: {},
      create: {
        tenantId: tenant.id,
        ...campaign,
      },
    });
    campaignRecords[campaign.slug] = record.id;
  }

  console.log("Demo campaigns created");

  // ============================================================
  // 6. ORIGINAL NEWS POSTS
  // ============================================================
  const news = [
    {
      type: "NEWS" as const,
      title: "Burkina Faso'da 10 Yeni Su Kuyusu Açıldı",
      slug: "burkina-faso-su-kuyusu",
      excerpt: "Afrika'da yürüttüğümüz su kuyusu projesi kapsamında 10 yeni kuyu daha hizmete açıldı.",
      content:
        "<p>Afrika'da yürüttüğümüz su kuyusu projesi kapsamında 10 yeni kuyu daha hizmete açıldı. Bu projemiz sayesinde binlerce kişi temiz suya kavuştu.</p>",
      coverImage: "https://picsum.photos/seed/seed-burkina/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-02-20"),
      isFeatured: true,
    },
    {
      type: "NEWS" as const,
      title: "Yıllık Genel Kurul Toplantısı Gerçekleştirildi",
      slug: "yillik-genel-kurul",
      excerpt: "Derneğimizin yıllık genel kurul toplantısı üyelerin katılımıyla başarıyla tamamlandı.",
      content:
        "<p>Derneğimizin yıllık genel kurul toplantısı üyelerin katılımıyla başarıyla tamamlandı.</p>",
      coverImage: "https://picsum.photos/seed/seed-kurul/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-02-15"),
      isFeatured: false,
    },
  ];

  for (const post of news) {
    await prisma.post.upsert({
      where: { tenantId_slug_type: { tenantId: tenant.id, slug: post.slug, type: post.type } },
      update: { coverImage: post.coverImage, content: post.content, excerpt: post.excerpt },
      create: {
        tenantId: tenant.id,
        authorId: admin.id,
        ...post,
      },
    });
  }

  console.log("Demo news created");

  // ============================================================
  // 7. DEMO MEMBERS (5 members with Turkish names)
  // ============================================================
  const memberPassword = await hash("Uye123!", 12);

  const membersData = [
    {
      email: "ahmet.yilmaz@example.com",
      fullName: "Ahmet Yılmaz",
      phone: "+90 532 111 22 33",
      city: "İstanbul",
      occupation: "Mühendis",
      status: "ACTIVE" as const,
      memberTypeId: membershipTypeMap["Asil Üye"],
      gender: "MALE" as const,
      joinedAt: new Date("2024-03-15"),
    },
    {
      email: "fatma.demir@example.com",
      fullName: "Fatma Demir",
      phone: "+90 533 222 33 44",
      city: "Ankara",
      occupation: "Öğretmen",
      status: "ACTIVE" as const,
      memberTypeId: membershipTypeMap["Asil Üye"],
      gender: "FEMALE" as const,
      joinedAt: new Date("2024-06-01"),
    },
    {
      email: "mehmet.kaya@example.com",
      fullName: "Mehmet Kaya",
      phone: "+90 535 333 44 55",
      city: "İzmir",
      occupation: "Doktor",
      status: "PENDING" as const,
      memberTypeId: membershipTypeMap["Asil Üye"],
      gender: "MALE" as const,
      joinedAt: null,
    },
    {
      email: "elif.ozturk@example.com",
      fullName: "Elif Öztürk",
      phone: "+90 536 444 55 66",
      city: "Bursa",
      occupation: "Üniversite Öğrencisi",
      status: "ACTIVE" as const,
      memberTypeId: membershipTypeMap["Öğrenci Üye"],
      gender: "FEMALE" as const,
      joinedAt: new Date("2025-01-10"),
    },
    {
      email: "mustafa.sahin@example.com",
      fullName: "Mustafa Şahin",
      phone: "+90 537 555 66 77",
      city: "Konya",
      occupation: "Emekli",
      status: "PASSIVE" as const,
      memberTypeId: membershipTypeMap["Onursal Üye"],
      gender: "MALE" as const,
      joinedAt: new Date("2023-09-20"),
    },
  ];

  const memberRecords: Record<string, string> = {};

  for (const member of membersData) {
    const record = await prisma.member.upsert({
      where: {
        tenantId_email: { tenantId: tenant.id, email: member.email },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        passwordHash: memberPassword,
        ...member,
      },
    });
    memberRecords[member.email] = record.id;
  }

  console.log("Demo members created (5)");

  // ============================================================
  // 8. DEMO EVENTS (5 events)
  // ============================================================
  const eventsData = [
    {
      title: "Ramazan İftar Programı",
      slug: "ramazan-iftar-programi-2026",
      coverImage: null as string | null,
      description:
        "Derneğimiz tarafından düzenlenen geleneksel iftar programına tüm üyelerimiz ve hayırseverler davetlidir. İftar sonrası sohbet ve dua programı da gerçekleştirilecektir.",
      startAt: new Date("2026-03-15T18:30:00"),
      endAt: new Date("2026-03-15T22:00:00"),
      location: "DernekPro Konferans Salonu, Fatih, İstanbul",
      eventType: "IN_PERSON" as const,
      capacity: 200,
      isFree: true,
      requiresRegistration: true,
      status: "UPCOMING" as const,
    },
    {
      title: "Sivil Toplum ve Gönüllülük Konferansı",
      slug: "sivil-toplum-gonulluluk-konferansi",
      coverImage: null as string | null,
      description:
        "Alanında uzman akademisyenler ve sivil toplum liderlerinin katılımıyla sivil toplumda gönüllülük kültürü konulu konferans düzenlenecektir. Konferansa online katılım da mümkündür.",
      startAt: new Date("2026-04-10T10:00:00"),
      endAt: new Date("2026-04-10T17:00:00"),
      location: "Online - Zoom",
      eventType: "HYBRID" as const,
      capacity: 500,
      isFree: true,
      requiresRegistration: true,
      status: "UPCOMING" as const,
    },
    {
      title: "Aile Pikniği ve Doğa Yürüyüşü",
      slug: "aile-piknigi-doga-yuruyusu",
      coverImage: null as string | null,
      description:
        "Bahar ayının güzelliklerini doğada hep birlikte yaşayalım. Ailece katılabileceğiniz piknik etkinliğimizde mangal, oyunlar ve doğa yürüyüşü programı yer almaktadır.",
      startAt: new Date("2026-05-17T09:00:00"),
      endAt: new Date("2026-05-17T18:00:00"),
      location: "Belgrad Ormanı, Sarıyer, İstanbul",
      eventType: "IN_PERSON" as const,
      capacity: 150,
      isFree: true,
      requiresRegistration: false,
      status: "UPCOMING" as const,
    },
    {
      title: "Halı Saha Futbol Turnuvası",
      slug: "hali-saha-futbol-turnuvasi",
      coverImage: null as string | null,
      description:
        "Üyelerimiz arasında düzenlenen geleneksel halı saha futbol turnuvasında takımınızla birlikte yerinizi alın. Turnuva sonunda dereceye giren takımlara ödüller verilecektir.",
      startAt: new Date("2026-02-01T14:00:00"),
      endAt: new Date("2026-02-01T19:00:00"),
      location: "Yıldız Halı Saha Tesisleri, Beşiktaş, İstanbul",
      eventType: "IN_PERSON" as const,
      capacity: 80,
      isFree: false,
      price: 50,
      requiresRegistration: true,
      status: "COMPLETED" as const,
    },
    {
      title: "Tarihi Yarımada Kültür Gezisi",
      slug: "tarihi-yarimada-kultur-gezisi",
      coverImage: null as string | null,
      description:
        "Profesyonel rehber eşliğinde Sultanahmet, Ayasofya, Topkapı Sarayı ve Kapalıçarşı'yı kapsayan kültürel gezi programı. Öğle yemeği dahildir.",
      startAt: new Date("2026-02-22T08:30:00"),
      endAt: new Date("2026-02-22T17:30:00"),
      location: "Sultanahmet Meydanı, Fatih, İstanbul",
      eventType: "IN_PERSON" as const,
      capacity: 40,
      isFree: false,
      price: 150,
      requiresRegistration: true,
      status: "ONGOING" as const,
    },
  ];

  // SİEMDER Duyurularından eklenen etkinlikler
  const siemderEvents = [
    {
      title: "Yemek Organizasyonu",
      slug: "yemek-organizasyonu",
      description:
        "Regaib gecesi hayırseverlerimizin desteği ile Yemek Organizasyonu düzenledik.",
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-19-at-21.52.18.jpeg",
      startAt: new Date("2021-02-19T18:00:00"),
      endAt: new Date("2021-02-19T22:00:00"),
      location: "Fatih, İstanbul",
      eventType: "IN_PERSON" as const,
      capacity: 100,
      isFree: true,
      requiresRegistration: false,
      status: "COMPLETED" as const,
    },
    {
      title: "Zekat ve Fitre Organizasyonu",
      slug: "zekat-fitre-organizasyonu",
      description:
        "SİEMDER zekat ve fitrelerinizi vekaleten kabul ediyor ve tamamen İslamî şartlara uygun, ihtiyaç sahiplerine ulaştırıyor.",
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20170626-WA0032.jpg",
      startAt: new Date("2021-02-21T09:00:00"),
      endAt: new Date("2021-02-21T18:00:00"),
      location: "Balat, Fatih/İstanbul",
      eventType: "IN_PERSON" as const,
      isFree: true,
      requiresRegistration: false,
      status: "COMPLETED" as const,
    },
    {
      title: "Tarımsal Sulama Projesi Destek Kampanyası",
      slug: "tarimsal-sulama-destek-kampanyasi",
      description:
        "Afrika'da bir çok bölgede gerçekleştireceğimiz Tarımsal Sulama Projelerimiz için desteklerinizi bekliyoruz.",
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-01-at-01.51.51-1-2.jpeg",
      startAt: new Date("2021-02-21T09:00:00"),
      endAt: new Date("2021-03-21T18:00:00"),
      location: "Online",
      eventType: "ONLINE" as const,
      isFree: true,
      requiresRegistration: false,
      status: "COMPLETED" as const,
    },
    {
      title: "Kurban ve Adak Organizasyonu",
      slug: "kurban-adak-organizasyonu",
      description:
        "Akika, Adak ve Kurban bayramında, bağışçılarımızın vekâletlerini alarak yurtdışında Afrika'daki ihtiyaç sahiplerine kurban etlerini ulaştırıyoruz. İslâmi hassasiyetle ve vekâlet bilincinde kestiğimiz kurbanların etlerini ailelere, medreselere ve aşevlerine dağıtıyoruz.",
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/Kurban_Adak.png",
      startAt: new Date("2021-02-21T06:00:00"),
      endAt: new Date("2021-02-21T18:00:00"),
      location: "Burkina Faso, Bouna",
      eventType: "IN_PERSON" as const,
      isFree: true,
      requiresRegistration: false,
      status: "COMPLETED" as const,
    },
  ];

  for (const event of [...eventsData, ...siemderEvents]) {
    await prisma.event.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: event.slug } },
      update: { coverImage: event.coverImage ?? null, description: event.description },
      create: {
        tenantId: tenant.id,
        ...event,
      },
    });
  }

  console.log("Demo events created (5 + 4 SİEMDER)");

  // ============================================================
  // 8.5 GALLERY ALBUMS
  // ============================================================
  const galleryData = [
    {
      title: "Süt Keçisi Projesi",
      slug: "sut-kecisi-projesi",
      category: "Proje",
      description: "Burkina Faso'da sürdürülebilir süt keçisi projemizden kareler",
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/20190812_122126-scaled-1.jpg",
      images: [
        "https://siemder.org.tr/wp-content/uploads/2021/02/20190812_122126-scaled-1.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/20190812_141557-scaled-1.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/20190812_141713-scaled-1.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/20190812_141839-scaled-1.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/20190812_142030-scaled-1.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/20190812_142503-scaled-1.jpg",
      ],
    },
    {
      title: "Pirinç ve Gıda Yardımları",
      slug: "pirinc-gida-yardimlari",
      category: "Genel",
      description: "Bouna'daki ihtiyaç sahibi ailelere kumanya dağıtımından görüntüler",
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/pirinc_yardim.jpg",
      images: [
        "https://siemder.org.tr/wp-content/uploads/2021/02/pirinc_yardim.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180530-WA0025.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180518-WA0034.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20170617-WA0017.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20170615-WA0010.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20170614-WA0016.jpg",
      ],
    },
    {
      title: "Kırık Çıkık Polikliniği",
      slug: "kirik-cikik-poliklinigi-galeri",
      category: "Proje",
      description: "20 odalı 40+ yataklı sağlık kliniğimizin inşaat ve hizmet görüntüleri",
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20190126-WA0017-1.jpg",
      images: [
        "https://siemder.org.tr/wp-content/uploads/2021/02/20190428_085333-scaled-1.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/20190428_0853220-scaled-1.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20190126-WA0017-1.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180913-WA0007.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20181111-WA0030.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20190329-WA0038.jpg",
      ],
    },
    {
      title: "Yemek Organizasyonu",
      slug: "yemek-organizasyonu-galeri",
      category: "Etkinlik",
      description: "Regaib gecesi hayırseverlerimizin desteğiyle düzenlenen yemek etkinliği",
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-19-at-21.52.18.jpeg",
      images: [
        "https://siemder.org.tr/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-19-at-21.52.18.jpeg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-19-at-18.09.25.jpeg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-19-at-18.24.40.jpeg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-19-at-18.54.51-1.jpeg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-19-at-18.54.52.jpeg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-19-at-21.48.45-1.jpeg",
      ],
    },
    {
      title: "Tarım ve Hayvancılık",
      slug: "tarim-hayvancilik",
      category: "Genel",
      description: "Tarım destekleri ve hayvancılık projelerimizden kareler",
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/20190730_100401-2048x1152-1.jpg",
      images: [
        "https://siemder.org.tr/wp-content/uploads/2021/02/20190730_100401-2048x1152-1.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/20190812_122118-2048x1152-1.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180313-WA0003-1.jpg",
        "https://siemder.org.tr/wp-content/uploads/2021/02/20190808_130011-scaled-1.jpg",
      ],
    },
  ];

  for (const album of galleryData) {
    const existing = await prisma.galleryAlbum.findUnique({
      where: { tenantId_slug: { tenantId: tenant.id, slug: album.slug } },
    });

    if (existing) {
      await prisma.galleryAlbum.update({
        where: { id: existing.id },
        data: { coverImage: album.coverImage, description: album.description },
      });
    } else {
      const created = await prisma.galleryAlbum.create({
        data: {
          tenantId: tenant.id,
          title: album.title,
          slug: album.slug,
          category: album.category,
          description: album.description,
          coverImage: album.coverImage,
        },
      });

      for (let i = 0; i < album.images.length; i++) {
        await prisma.galleryImage.create({
          data: {
            albumId: created.id,
            url: album.images[i],
            alt: `${album.title} - ${i + 1}`,
            order: i,
          },
        });
      }
    }
  }

  console.log("Gallery albums created (5 albums, 28 images)");

  // ============================================================
  // 9. DEMO DONATIONS (10 donations)
  // ============================================================
  const donationsData = [
    {
      campaignId: campaignRecords["yetim-yardimi-kampanyasi"],
      memberId: memberRecords["ahmet.yilmaz@example.com"],
      donorName: "Ahmet Yılmaz",
      donorEmail: "ahmet.yilmaz@example.com",
      amount: 5000,
      donationType: "GENERAL" as const,
      paymentMethod: "CREDIT_CARD" as const,
      status: "COMPLETED" as const,
      isAnonymous: false,
    },
    {
      campaignId: campaignRecords["su-kuyusu-projesi-afrika"],
      memberId: memberRecords["fatma.demir@example.com"],
      donorName: "Fatma Demir",
      donorEmail: "fatma.demir@example.com",
      amount: 2500,
      donationType: "SADAKA" as const,
      paymentMethod: "BANK_TRANSFER" as const,
      status: "COMPLETED" as const,
      isAnonymous: false,
    },
    {
      campaignId: campaignRecords["ramazan-gida-paketi"],
      memberId: null,
      donorName: "Hayırsever Vatandaş",
      donorEmail: null,
      amount: 10000,
      donationType: "ZEKAT" as const,
      paymentMethod: "BANK_TRANSFER" as const,
      status: "COMPLETED" as const,
      isAnonymous: true,
    },
    {
      campaignId: campaignRecords["yetim-yardimi-kampanyasi"],
      memberId: memberRecords["mustafa.sahin@example.com"],
      donorName: "Mustafa Şahin",
      donorEmail: "mustafa.sahin@example.com",
      amount: 1000,
      donationType: "FITRE" as const,
      paymentMethod: "CASH" as const,
      status: "COMPLETED" as const,
      isAnonymous: false,
    },
    {
      campaignId: campaignRecords["su-kuyusu-projesi-afrika"],
      memberId: null,
      donorName: "Hasan Çelik",
      donorEmail: "hasan.celik@example.com",
      amount: 7500,
      donationType: "SADAKA" as const,
      paymentMethod: "CREDIT_CARD" as const,
      status: "COMPLETED" as const,
      isAnonymous: false,
    },
    {
      campaignId: campaignRecords["ramazan-gida-paketi"],
      memberId: memberRecords["elif.ozturk@example.com"],
      donorName: "Elif Öztürk",
      donorEmail: "elif.ozturk@example.com",
      amount: 250,
      donationType: "GENERAL" as const,
      paymentMethod: "CREDIT_CARD" as const,
      status: "PENDING" as const,
      isAnonymous: false,
    },
    {
      campaignId: null,
      memberId: null,
      donorName: "Anonim Bağışçı",
      donorEmail: null,
      amount: 20000,
      donationType: "KURBAN" as const,
      paymentMethod: "BANK_TRANSFER" as const,
      status: "COMPLETED" as const,
      isAnonymous: true,
    },
    {
      campaignId: campaignRecords["yetim-yardimi-kampanyasi"],
      memberId: memberRecords["ahmet.yilmaz@example.com"],
      donorName: "Ahmet Yılmaz",
      donorEmail: "ahmet.yilmaz@example.com",
      amount: 3000,
      donationType: "ZEKAT" as const,
      paymentMethod: "CREDIT_CARD" as const,
      status: "COMPLETED" as const,
      isAnonymous: false,
    },
    {
      campaignId: campaignRecords["su-kuyusu-projesi-afrika"],
      memberId: null,
      donorName: "Ayşe Yıldız",
      donorEmail: "ayse.yildiz@example.com",
      amount: 1500,
      donationType: "ADAK" as const,
      paymentMethod: "CASH" as const,
      status: "PENDING" as const,
      isAnonymous: false,
    },
    {
      campaignId: campaignRecords["ramazan-gida-paketi"],
      memberId: memberRecords["fatma.demir@example.com"],
      donorName: "Fatma Demir",
      donorEmail: "fatma.demir@example.com",
      amount: 500,
      donationType: "AKIKA" as const,
      paymentMethod: "CREDIT_CARD" as const,
      status: "COMPLETED" as const,
      isAnonymous: false,
    },
  ];

  // Donations have no unique compound key, so use create with try/catch
  for (const donation of donationsData) {
    try {
      await prisma.donation.create({
        data: {
          tenantId: tenant.id,
          ...donation,
        },
      });
    } catch {
      // Skip if duplicate (re-running seed)
    }
  }

  console.log("Demo donations created (10)");

  // ============================================================
  // 10. DEMO CONTACT MESSAGES (5 contacts)
  // ============================================================
  const contactsData = [
    {
      name: "Ali Veli",
      email: "ali.veli@example.com",
      phone: "+90 538 111 00 00",
      subject: "Üyelik Başvurusu Hakkında",
      message:
        "Merhaba, derneğinize üye olmak istiyorum. Başvuru süreci hakkında bilgi alabilir miyim? Gerekli belgeler nelerdir?",
      isRead: true,
    },
    {
      name: "Zeynep Arslan",
      email: "zeynep.arslan@example.com",
      phone: "+90 539 222 11 11",
      subject: "Bağış Makbuzu Talebi",
      message:
        "Geçen hafta yaptığım 5.000 TL bağış için makbuz almak istiyorum. Bağış referans numaram: #2026-0215. Teşekkürler.",
      isRead: true,
    },
    {
      name: "Osman Koç",
      email: "osman.koc@example.com",
      phone: null,
      subject: "Etkinlik Sorusu",
      message:
        "İftar programına katılmak istiyorum ancak kayıt formunda sorun yaşıyorum. Yardımcı olabilir misiniz?",
      isRead: false,
    },
    {
      name: "Selin Aydın",
      email: "selin.aydin@example.com",
      phone: "+90 541 444 33 33",
      subject: "Gönüllü Olmak İstiyorum",
      message:
        "Derneğinizin faaliyetlerini sosyal medyadan takip ediyorum ve gönüllü olarak katkıda bulunmak istiyorum. Gönüllülük programınız var mı?",
      isRead: false,
    },
    {
      name: "Burak Erdoğan",
      email: "burak.erdogan@example.com",
      phone: "+90 542 555 44 44",
      subject: "Kurumsal İş Birliği Teklifi",
      message:
        "Firmamız adına derneğinizle kurumsal iş birliği yapmak istiyoruz. Eğitim alanında ortak projeler geliştirebiliriz. Görüşme için uygun bir zaman belirleyebilir miyiz?",
      isRead: false,
    },
  ];

  // Contact has no unique compound key, so use create with try/catch
  for (const contact of contactsData) {
    try {
      await prisma.contact.create({
        data: {
          tenantId: tenant.id,
          ...contact,
        },
      });
    } catch {
      // Skip if duplicate (re-running seed)
    }
  }

  console.log("Demo contact messages created (5)");

  // ============================================================
  // 11. ADDITIONAL NEWS POSTS (3 more)
  // ============================================================
  const additionalNews = [
    {
      type: "NEWS" as const,
      title: "Eğitim Bursu Programı Başvuruları Başladı",
      slug: "egitim-bursu-basvurulari-2026",
      excerpt:
        "2026-2027 eğitim-öğretim yılı için burs başvuruları başlamıştır. İhtiyaç sahibi başarılı öğrenciler hemen başvurabilir.",
      content:
        "<p>Derneğimizin her yıl düzenlediği eğitim bursu programı kapsamında 2026-2027 eğitim-öğretim yılı için başvurular başlamıştır.</p><p>Burs programımız üniversite öğrencilerine yönelik olup aylık 2.000 TL destek sağlamaktadır. Başvuru son tarihi 30 Nisan 2026'dır.</p><p>Başvuru şartları ve detaylı bilgi için dernek merkezimizi ziyaret edebilir veya telefon ile bilgi alabilirsiniz.</p>",
      coverImage: "https://picsum.photos/seed/seed-burs/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-02-25"),
      isFeatured: true,
    },
    {
      type: "NEWS" as const,
      title: "Kış Yardım Kampanyası Tamamlandı",
      slug: "kis-yardim-kampanyasi-tamamlandi",
      excerpt:
        "Kış aylarında ihtiyaç sahibi 500 aileye kömür, battaniye ve gıda yardımı ulaştırıldı.",
      content:
        "<p>Derneğimizin koordinasyonunda yürütülen kış yardım kampanyası başarıyla tamamlanmıştır.</p><p>Kampanya süresince İstanbul, Ankara ve Bursa'da toplam 500 aileye kömür, battaniye ve gıda yardımı ulaştırılmıştır. Yardım programına 150'den fazla gönüllümüz destek vermiştir.</p><p>Bağışçılarımıza ve gönüllülerimize teşekkür ederiz.</p>",
      coverImage: "https://picsum.photos/seed/seed-kis/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-02-10"),
      isFeatured: false,
    },
    {
      type: "NEWS" as const,
      title: "Derneğimiz ISO 9001 Kalite Belgesini Aldı",
      slug: "iso-9001-kalite-belgesi",
      excerpt:
        "Derneğimiz, yürüttüğü faaliyetlerde kalite standartlarını belgeleyerek ISO 9001 sertifikası almaya hak kazanmıştır.",
      content:
        "<p>Derneğimiz, sivil toplum kuruluşları arasında sayılı örneklerden biri olarak ISO 9001:2015 Kalite Yönetim Sistemi belgesini almaya hak kazanmıştır.</p><p>Bu belge, derneğimizin bağış yönetimi, üye hizmetleri ve proje süreçlerinde uluslararası kalite standartlarına uygun faaliyet gösterdiğini kanıtlamaktadır.</p>",
      coverImage: "https://picsum.photos/seed/seed-iso/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-01-28"),
      isFeatured: false,
    },
  ];

  for (const post of additionalNews) {
    await prisma.post.upsert({
      where: {
        tenantId_slug_type: { tenantId: tenant.id, slug: post.slug, type: post.type },
      },
      update: { coverImage: post.coverImage, content: post.content, excerpt: post.excerpt },
      create: {
        tenantId: tenant.id,
        authorId: admin.id,
        ...post,
      },
    });
  }

  console.log("Additional news posts created (3)");

  // ============================================================
  // 12. ACTIVITY POSTS (3 activities)
  // ============================================================
  const activities = [
    {
      type: "ACTIVITY" as const,
      title: "Eğitim Faaliyetleri",
      slug: "egitim-faaliyetleri",
      excerpt: "Burkina Faso'da bulunan Kardeş Köyümüz Bouna'da, yeni açtığımız eğitim kurumuyla birlikte, oradaki çocukların okul öncesi eğitime destek veriyoruz.",
      content: `<p>Burkina Faso'da bulunan Kardeş Köyümüz Bouna'da, yeni açtığımız eğitim kurumuyla birlikte, oradaki çocukların okul öncesi eğitime destek veriyoruz.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180729-WA0020-1080x700-1.jpg" alt="Eğitim Faaliyetleri" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180729-WA0020-1080x700-1.jpg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-21"),
      isFeatured: true,
    },
    {
      type: "ACTIVITY" as const,
      title: "Tarımsal Sulama Baraj Projesi",
      slug: "tarimsal-sulama-baraj-projesi",
      excerpt: "Afrika'da su kaynaklarına erişim zorluğu günlük ihtiyaçları, tarım ve hayvancılık faaliyetlerini olumsuz etkilemektedir.",
      content: `<p>Afrika'da su kaynaklarına erişim zorluğu günlük ihtiyaçları, tarım ve hayvancılık faaliyetlerini olumsuz etkilemektedir. Bu sorunu çözmek amacıyla tarımsal sulama baraj projemizi hayata geçirdik.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-01-at-01.51.51-1.jpeg" alt="Baraj Projesi" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-01-at-01.51.51-1.jpeg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-21"),
      isFeatured: false,
    },
    {
      type: "ACTIVITY" as const,
      title: "Süt Keçisi Yardımları",
      slug: "sut-kecisi-yardimlari",
      excerpt: "Ailelere yaptığımız temel yardımlardan sonra kalıcı ve sürdürülebilir bir proje olan süt keçisi projesi, özellikle Afrika ülkelerinde başarı ile uygulanan bir projedir.",
      content: `<p>Ailelere yaptığımız temel yardımlardan sonra kalıcı ve sürdürülebilir bir proje olan süt keçisi projesi, özellikle Afrika ülkelerinde başarı ile uygulanan bir projedir. Bu proje ile amacımız, balık vermekten ziyade, balık tutmayı öğretmektir.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/20190812_122126-scaled-1.jpg" alt="Süt Keçisi Yardımları 1" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/20190812_141557-scaled-1.jpg" alt="Süt Keçisi Yardımları 2" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/20190812_141713-scaled-1.jpg" alt="Süt Keçisi Yardımları 3" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/20190812_141839-scaled-1.jpg" alt="Süt Keçisi Yardımları 4" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/20190812_142030-scaled-1.jpg" alt="Süt Keçisi Yardımları 5" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/20190812_142503-scaled-1.jpg" alt="Süt Keçisi Yardımları 6" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/20190812_122126-scaled-1.jpg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-21"),
      isFeatured: false,
    },
    {
      type: "ACTIVITY" as const,
      title: "Yetim Yardımları",
      slug: "yetim-yardimlari",
      excerpt: "Doğal afetler ve savaşlar nedeniyle yetim kalan çocuklara destek veriyor, onları kendi toplulukları içinde koruyoruz.",
      content: `<p>Doğal afetler ve savaşlar nedeniyle yetim kalan çocuklara destek veriyor, onları kendi toplulukları içinde koruyoruz. Yetim çocuklarımızın eğitim, sağlık ve temel ihtiyaçlarını karşılıyoruz.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/20190808_130011-scaled-1.jpg" alt="Yetim Yardımları" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/20190808_130011-scaled-1.jpg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-21"),
      isFeatured: false,
    },
    {
      type: "ACTIVITY" as const,
      title: "Tarım Destekleri",
      slug: "tarim-destekleri",
      excerpt: "Afrika'nın tarım potansiyelini ve mevsimsel yağış düzenlerini değerlendirerek ailelere tarımsal destek sağlıyoruz.",
      content: `<p>Afrika'nın tarım potansiyelini ve mevsimsel yağış düzenlerini değerlendirerek ailelere tarımsal destek sağlıyoruz. Tohum, gübre ve tarım aletleri desteğiyle ailelerin kendi kendine yetmesini hedefliyoruz.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/20190730_100401-2048x1152-1.jpg" alt="Tarım Destekleri" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/20190730_100401-2048x1152-1.jpg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-21"),
      isFeatured: false,
    },
    {
      type: "ACTIVITY" as const,
      title: "Pirinç Yardımları",
      slug: "pirinc-yardimlari",
      excerpt: "Afrika'da Kardeş köyümüz olan Bouna'da tüm ihtiyaç sahibi ailelere kumanya yardımında bulunuyoruz.",
      content: `<p>Afrika'da Kardeş köyümüz olan Bouna'da tüm ihtiyaç sahibi ailelere kumanya yardımında bulunuyoruz. İçerisinde temel gıda malzemelerinin bulunduğu kumanya paketleri, ailelerin sofrasında aş oluyor.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/pirinc_yardim.jpg" alt="Pirinç Yardımları 1" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180530-WA0025.jpg" alt="Pirinç Yardımları 2" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180518-WA0034.jpg" alt="Pirinç Yardımları 3" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20170617-WA0017.jpg" alt="Pirinç Yardımları 4" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20170615-WA0010.jpg" alt="Pirinç Yardımları 5" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20170614-WA0016.jpg" alt="Pirinç Yardımları 6" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/pirinc_yardim.jpg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-22"),
      isFeatured: false,
    },
    {
      type: "ACTIVITY" as const,
      title: "Nakit Yardımları",
      slug: "nakit-yardimlari",
      excerpt: "SİEMDER olarak zekat, fitre, sadaka ve bağış gibi nakdi yardımları vekaleten kabul ediyor ihtiyaç sahiplerine ulaştırıyoruz.",
      content: `<p>SİEMDER olarak zekat, fitre, sadaka ve bağış gibi nakdi yardımları vekaleten kabul ediyor ihtiyaç sahiplerine ulaştırıyoruz.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/nakit.png" alt="Nakit Yardımları" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/nakit.png",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-21"),
      isFeatured: false,
    },
    {
      type: "ACTIVITY" as const,
      title: "Mescit İnşası",
      slug: "mescit-insasi",
      excerpt: "Bouna'da ibadet ve cemaatle namaz kılınması için bir mescit inşa ettik.",
      content: `<p>Bouna'da ibadet ve cemaatle namaz kılınması için bir mescit inşa ettik. Mescidimiz Bouna halkına hizmet vermektedir.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180313-WA0003-1.jpg" alt="Mescit İnşası" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180313-WA0003-1.jpg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-21"),
      isFeatured: false,
    },
    {
      type: "ACTIVITY" as const,
      title: "Kurban Yardımları",
      slug: "kurban-yardimlari",
      excerpt: "Kurban bayramlarında ve yıl içerisinde bağışçılarımız adına kurban kesimi ve dağıtımı yapıyoruz.",
      content: `<p>Kurban bayramlarında ve yıl içerisinde bağışçılarımız adına kurban kesimi ve dağıtımı yapıyoruz. Kesilen kurbanlar ihtiyaç sahibi ailelere ulaştırılmaktadır.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/20190812_122118-2048x1152-1.jpg" alt="Kurban Yardımları" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/20190812_122118-2048x1152-1.jpg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-21"),
      isFeatured: false,
    },
    {
      type: "ACTIVITY" as const,
      title: "Kırık Çıkık Polikliniği",
      slug: "kirik-cikik-poliklinigi",
      excerpt: "Bouna halkının sağlıklı ve steril ortamda kırık çıkık tedavisi alabilmesi için 20 odalı 40+ yataklı bir klinik inşa ettik.",
      content: `<p>Bouna halkının derme çatma yıkık döküntülü yerlerde kırık çıkık tedavileri yapılmaktaydı. Daha sağlıklı ve daha steril ortamın oluşması için sizin yardımlarınız ile kollarımızı sıvadık. 20 odalı 40+ yataklı kliniğimiz sizin yardımlarınız sayesinde tamamlanmış olup Bouna halkına hizmet vermektedir.</p><p>Ayrıca köylerde yapılan sağlık taraması sonucu sünnet olması gereken çocuklar tespit edildi. Yapılan organizasyonla kliniğimizde 5.000'den fazla çocuk toplu olarak sünnet edildi.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/20190428_085333-scaled-1.jpg" alt="Klinik 1" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/20190428_0853220-scaled-1.jpg" alt="Klinik 2" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20190126-WA0017-1.jpg" alt="Klinik 3" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180913-WA0007.jpg" alt="Klinik 4" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20181111-WA0030.jpg" alt="Klinik 5" class="rounded-lg w-full object-cover" />
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20190329-WA0038.jpg" alt="Klinik 6" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20190126-WA0017-1.jpg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-21"),
      isFeatured: false,
    },
    {
      type: "ACTIVITY" as const,
      title: "İftar Programları",
      slug: "iftar-programlari",
      excerpt: "SİEMDER Derneği, Ramazan-ı Şerif'te mağdur ve mazlum coğrafyalarda hız kesmeden yardım çalışmalarına devam ediyor.",
      content: `<p>SİEMDER Derneği, Ramazan-ı Şerif'te mağdur ve mazlum coğrafyalarda hız kesmeden yardım çalışmalarına devam ediyor. İftar sofralarımızla ihtiyaç sahibi ailelerin yanında oluyoruz.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20170610-WA0011-400x400-1-e1612730892242.jpg" alt="İftar Programı" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20170610-WA0011-400x400-1-e1612730892242.jpg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-08"),
      isFeatured: false,
    },
    {
      type: "ACTIVITY" as const,
      title: "Değirmen İnşası",
      slug: "degirmen-insasi",
      excerpt: "Burkina Faso Bouna'da tahıl öğütme sorununa çözüm olarak bir değirmen inşa ettik.",
      content: `<p>Burkina Faso Bouna'da tahıl öğütme sorununa çözüm olarak bir değirmen inşa ettik. Değirmenimiz bölge halkının tahıl ihtiyacını karşılamaktadır.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20190103-WA0030.jpg" alt="Değirmen İnşası" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20190103-WA0030.jpg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-07"),
      isFeatured: false,
    },
    {
      type: "ACTIVITY" as const,
      title: "Barınma Destekleri",
      slug: "barinma-destekleri",
      excerpt: "Bouna'da hasar gören evlerin onarımı ve ihtiyaç sahibi ailelere barınma desteği sağlıyoruz.",
      content: `<p>Bouna'da hasar gören evlerin onarımı ve ihtiyaç sahibi ailelere barınma desteği sağlıyoruz. Ailelerin güvenli bir çatı altında yaşaması için çalışmalarımız devam etmektedir.</p>
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
<img src="https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180912-WA0012-400x400-1.jpg" alt="Barınma Destekleri" class="rounded-lg w-full object-cover" />
</div>`,
      coverImage: "https://siemder.org.tr/wp-content/uploads/2021/02/IMG-20180912-WA0012-400x400-1.jpg",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2021-02-07"),
      isFeatured: false,
    },
  ];

  for (const post of activities) {
    await prisma.post.upsert({
      where: {
        tenantId_slug_type: { tenantId: tenant.id, slug: post.slug, type: post.type },
      },
      update: { coverImage: post.coverImage, content: post.content, excerpt: post.excerpt },
      create: {
        tenantId: tenant.id,
        authorId: admin.id,
        ...post,
      },
    });
  }

  console.log("Activity posts created (13 - SİEMDER faaliyetleri)");

  // ============================================================
  // 13. ANNOUNCEMENT POSTS (2 announcements)
  // ============================================================
  const announcements = [
    {
      type: "ANNOUNCEMENT" as const,
      title: "2026 Yılı Aidat Ödemeleri Hakkında",
      slug: "2026-yili-aidat-odemeleri",
      excerpt:
        "2026 yılı üyelik aidatlarının ödeme süreci ve yeni aidat tutarları hakkında bilgilendirme.",
      coverImage: "https://picsum.photos/seed/seed-aidat/800/450",
      content:
        "<p>Değerli Üyelerimiz,</p><p>2026 yılı üyelik aidatları belirlenmiştir. Asil üyeler için yıllık aidat 500 TL, öğrenci üyeler için 100 TL olarak uygulanacaktır. Onursal üyelerimizden aidat alınmamaktadır.</p><p>Aidatlarınızı banka havalesi, kredi kartı veya dernek merkezimize nakit olarak ödeyebilirsiniz. İlk çeyrek ödemeleri için son tarih 31 Mart 2026'dır.</p><p>Saygılarımızla,<br/>DernekPro Yönetim Kurulu</p>",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-01-15"),
      isFeatured: true,
    },
    {
      type: "ANNOUNCEMENT" as const,
      title: "Dernek Merkezi Taşınma Duyurusu",
      slug: "dernek-merkezi-tasinma-duyurusu",
      excerpt:
        "Dernek merkezimiz 1 Mart 2026 itibarıyla yeni adresinde hizmet vermeye başlayacaktır.",
      coverImage: "https://picsum.photos/seed/seed-tasinma/800/450",
      content:
        "<p>Değerli Üyelerimiz,</p><p>Derneğimizin artan faaliyetleri ve üye sayımızdaki büyüme nedeniyle daha geniş bir hizmet mekanına taşınıyoruz.</p><p><strong>Yeni Adresimiz:</strong> Atatürk Caddesi No: 45, Kat: 3, Fatih/İstanbul</p><p>1 Mart 2026 tarihinden itibaren tüm hizmetlerimiz yeni adresimizde devam edecektir. Taşınma sürecinde 28 Şubat günü dernek merkezimiz kapalı olacaktır.</p><p>Anlayışınız için teşekkür ederiz.<br/>DernekPro Yönetim Kurulu</p>",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-02-20"),
      isFeatured: false,
    },
  ];

  for (const post of announcements) {
    await prisma.post.upsert({
      where: {
        tenantId_slug_type: { tenantId: tenant.id, slug: post.slug, type: post.type },
      },
      update: { coverImage: post.coverImage, content: post.content, excerpt: post.excerpt },
      create: {
        tenantId: tenant.id,
        authorId: admin.id,
        ...post,
      },
    });
  }

  console.log("Announcement posts created (2)");

  // ============================================================
  // 14. DEMO DUES (5 dues for different members and periods)
  // ============================================================
  const duesData = [
    {
      memberId: memberRecords["ahmet.yilmaz@example.com"],
      period: "2026-01",
      amount: 500,
      paidAt: new Date("2026-01-10"),
      status: "PAID" as const,
    },
    {
      memberId: memberRecords["ahmet.yilmaz@example.com"],
      period: "2026-02",
      amount: 500,
      paidAt: null,
      status: "PENDING" as const,
    },
    {
      memberId: memberRecords["fatma.demir@example.com"],
      period: "2026-01",
      amount: 500,
      paidAt: new Date("2026-01-20"),
      status: "PAID" as const,
    },
    {
      memberId: memberRecords["elif.ozturk@example.com"],
      period: "2026-01",
      amount: 100,
      paidAt: null,
      status: "OVERDUE" as const,
    },
    {
      memberId: memberRecords["fatma.demir@example.com"],
      period: "2026-02",
      amount: 500,
      paidAt: new Date("2026-02-15"),
      status: "PAID" as const,
    },
  ];

  for (const due of duesData) {
    await prisma.due.upsert({
      where: {
        tenantId_memberId_period: {
          tenantId: tenant.id,
          memberId: due.memberId,
          period: due.period,
        },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        ...due,
      },
    });
  }

  console.log("Demo dues created (5)");

  // ============================================================
  // 15. EMAIL TEMPLATES (3 default templates)
  // ============================================================
  const emailTemplates = [
    {
      name: "hosgeldiniz",
      subject: "DernekPro'ya Hoş Geldiniz!",
      htmlContent: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
  <div style="text-align:center;padding:20px;background:#1a5c38;border-radius:8px 8px 0 0;">
    <h1 style="color:#fff;margin:0;">DernekPro</h1>
  </div>
  <div style="padding:30px;background:#fff;border:1px solid #e5e7eb;">
    <h2 style="color:#1a5c38;">Hoş Geldiniz, {{fullName}}!</h2>
    <p>Derneğimize üye olduğunuz için teşekkür ederiz. Artık tüm etkinlik ve kampanyalarımızdan haberdar olabilirsiniz.</p>
    <div style="text-align:center;margin:30px 0;">
      <a href="{{loginUrl}}" style="background:#1a5c38;color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px;font-weight:bold;">Hesabınıza Giriş Yapın</a>
    </div>
    <p style="color:#666;font-size:14px;">Herhangi bir sorunuz olursa bizimle iletişime geçmekten çekinmeyin.</p>
  </div>
  <div style="text-align:center;padding:15px;color:#999;font-size:12px;">
    © 2026 DernekPro. Tüm hakları saklıdır.
  </div>
</body>
</html>`,
      variables: ["fullName", "loginUrl"],
      isDefault: true,
    },
    {
      name: "bildirim",
      subject: "{{title}} — DernekPro Bildirimi",
      htmlContent: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
  <div style="text-align:center;padding:20px;background:#1a5c38;border-radius:8px 8px 0 0;">
    <h1 style="color:#fff;margin:0;">DernekPro</h1>
  </div>
  <div style="padding:30px;background:#fff;border:1px solid #e5e7eb;">
    <p>Sayın {{fullName}},</p>
    <h2 style="color:#1a5c38;">{{title}}</h2>
    <p>{{message}}</p>
    {{#if link}}
    <div style="text-align:center;margin:30px 0;">
      <a href="{{link}}" style="background:#c8860a;color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px;font-weight:bold;">Detayları Görüntüle</a>
    </div>
    {{/if}}
  </div>
  <div style="text-align:center;padding:15px;color:#999;font-size:12px;">
    © 2026 DernekPro. Tüm hakları saklıdır.
  </div>
</body>
</html>`,
      variables: ["fullName", "title", "message", "link"],
      isDefault: true,
    },
    {
      name: "canli-yayin",
      subject: "🔴 Canlı Yayın: {{streamTitle}} — DernekPro",
      htmlContent: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
  <div style="text-align:center;padding:20px;background:#dc2626;border-radius:8px 8px 0 0;">
    <h1 style="color:#fff;margin:0;">🔴 CANLI YAYIN</h1>
  </div>
  <div style="padding:30px;background:#fff;border:1px solid #e5e7eb;">
    <p>Sayın {{fullName}},</p>
    <h2 style="color:#dc2626;">{{streamTitle}}</h2>
    <p style="font-size:16px;">Canlı yayınımız <strong>{{scheduledAt}}</strong> tarihinde başlayacaktır.</p>
    <p>Yayını kaçırmamak için şimdiden takvime ekleyin!</p>
    <div style="text-align:center;margin:30px 0;">
      <a href="{{watchUrl}}" style="background:#dc2626;color:#fff;padding:14px 35px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:16px;">Canlı Yayını İzle</a>
    </div>
  </div>
  <div style="text-align:center;padding:15px;color:#999;font-size:12px;">
    © 2026 DernekPro. Tüm hakları saklıdır.
  </div>
</body>
</html>`,
      variables: ["fullName", "streamTitle", "scheduledAt", "watchUrl"],
      isDefault: true,
    },
  ];

  for (const tpl of emailTemplates) {
    await prisma.emailTemplate.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: tpl.name } },
      update: {},
      create: {
        tenantId: tenant.id,
        ...tpl,
      },
    });
  }

  console.log("Email templates created (3)");

  // ============================================================
  // 16. HOMEPAGE PAGE RECORD (for page builder)
  // ============================================================
  await prisma.page.upsert({
    where: { tenantId_slug: { tenantId: tenant.id, slug: "anasayfa" } },
    update: {},
    create: {
      tenantId: tenant.id,
      title: "Ana Sayfa",
      slug: "anasayfa",
      content: "",
      isPublished: true,
      order: 0,
      sections: [
        { id: "section-hero", type: "hero", visible: true, order: 0, config: {} },
        { id: "section-stats", type: "stats", visible: true, order: 1, config: {} },
        { id: "section-campaign", type: "campaign", visible: true, order: 2, config: {} },
        { id: "section-news", type: "news", visible: true, order: 3, config: {} },
        { id: "section-events", type: "events", visible: true, order: 4, config: {} },
        { id: "section-donation-banner", type: "donation-banner", visible: true, order: 5, config: {} },
      ],
    },
  });

  // Static pages with rich HTML content
  const staticPages = [
    {
      title: "Hakkımızda",
      slug: "hakkimizda",
      metaDesc: "Toplumsal dayanışma ve yardımlaşma amacıyla kurulan derneğimiz, binlerce gönüllü ile birlikte topluma değer katmaya devam ediyor.",
      content: `<h2>Tarihçemiz</h2>
<p>Derneğimiz, toplumsal dayanışma ve yardımlaşma amacıyla bir grup gönüllü tarafından 2012 yılında kurulmuştur. Kuruluşumuzdan bugüne topluma değer katan projeler yürütmekteyiz.</p>

<h3>2012 — Kuruluşumuz</h3>
<p>Derneğimiz, toplumsal dayanışma ve yardımlaşma amacıyla bir grup gönüllü tarafından kuruldu.</p>

<h3>2015 — İlk Büyük Projemiz</h3>
<p>Eğitim bursu programımız ile 100 öğrenciye burs sağlamaya başladık.</p>

<h3>2018 — Uluslararası İş Birlikleri</h3>
<p>Avrupa ve Ortadoğu'daki sivil toplum kuruluşları ile iş birliği protokolleri imzaladık.</p>

<h3>2021 — Dijital Dönüşüm</h3>
<p>Online platformumuzu hayata geçirerek dijital çağda dernek yönetimini modernize ettik.</p>

<h3>2024 — 2.500 Üye Hedefi</h3>
<p>Aktif üye sayımız 2.500'u aşarak Türkiye'nin en büyük toplumsal dayanışma derneklerinden biri olduk.</p>

<h2>Misyonumuz</h2>
<p>Toplumsal dayanışma ve yardımlaşma bilincini geliştirmek, ihtiyaç sahibi bireylere ve topluluklara destek sağlamak, eğitim, sağlık ve çevre alanlarında sürdürülebilir projeler üretmektir.</p>
<ul>
<li>Eğitimde fırsat eşitliği sağlamak</li>
<li>Toplumsal dayanışmayı güçlendirmek</li>
<li>Sürdürülebilir projeler geliştirmek</li>
<li>Gönüllü katılımı teşvik etmek</li>
</ul>

<h2>Vizyonumuz</h2>
<p>Türkiye'de ve dünyada toplumsal kalkınma alanında öncü, yenilikçi ve güvenilir bir sivil toplum kuruluşu olmak; bireylerin ve toplulukların yaşam kalitesini artırmaya yönelik çalışmalarda lider rol üstlenmektir.</p>
<ul>
<li>Ulusal ve uluslararası alanda söz sahibi olmak</li>
<li>Teknoloji odaklı toplumsal çözümler üretmek</li>
<li>Genç nesillere ilham vermek</li>
<li>Şeffaf ve hesap verebilir yönetim anlayışı</li>
</ul>

<h2>Rakamlarla Biz</h2>
<ul>
<li><strong>2.500+</strong> Aktif Üye</li>
<li><strong>150+</strong> Tamamlanan Proje</li>
<li><strong>50+</strong> Partner Kurum</li>
<li><strong>12</strong> Yıllık Deneyim</li>
</ul>`,
      isPublished: true,
      order: 1,
    },
    {
      title: "Dernek Tüzüğü",
      slug: "tuzuk",
      metaDesc: "Derneğimizin kuruluş amacı, üyelik koşulları, yönetim yapısı ve mali hükümlerini içeren tüzük metnidir.",
      content: `<h2>Bölüm 1 — Kuruluş ve Amaç</h2>

<h3>Madde 1 — Derneğin Adı ve Merkezi</h3>
<p>Derneğin adı "DernekPro Derneği" olup merkezi İstanbul'dur. Dernek, gerekli görülen yerlerde şube açabilir.</p>

<h3>Madde 2 — Derneğin Amacı</h3>
<p>Dernek; toplumsal dayanışma ve yardımlaşmayı teşvik etmek, eğitim, kültür, sağlık ve çevre alanlarında projeler geliştirmek, üyeleri arasında sosyal bağları güçlendirmek amacıyla kurulmuştur.</p>

<h3>Madde 3 — Derneğin Faaliyet Alanları</h3>
<p>Dernek, amacını gerçekleştirmek için şu faaliyetlerde bulunur: eğitim bursları sağlamak, sosyal yardım kampanyaları düzenlemek, kültürel etkinlikler organize etmek, çevre bilinci oluşturmak, uluslararası iş birlikleri kurmak ve gönüllülük programları yürütmek.</p>

<h3>Madde 4 — Derneğin Kuruluş Tarihi</h3>
<p>Dernek, Türk Medeni Kanunu ve 5253 sayılı Dernekler Kanunu hükümlerine uygun olarak kurulmuş olup tüzel kişilik kazanmıştır.</p>

<h2>Bölüm 2 — Üyelik</h2>

<h3>Madde 5 — Üye Olma Hakkı ve Koşulları</h3>
<p>Fiil ehliyetine sahip, 18 yaşını doldurmuş, derneğin amaç ve ilkelerini benimsemiş her gerçek ve tüzel kişi derneğe üye olabilir. Üyelik başvurusu yazılı olarak yapılır ve yönetim kurulunca 30 gün içinde karara bağlanır.</p>

<h3>Madde 6 — Üyelik Türleri</h3>
<p>Dernek üyelikleri şu şekilde sınıflandırılır:</p>
<ul>
<li><strong>Asıl Üye:</strong> Derneğin tüm haklarından yararlanan ve yükümlülüklerini yerine getiren üyelerdir.</li>
<li><strong>Onursal Üye:</strong> Derneğe maddi veya manevi katkıda bulunan kişilere yönetim kurulu kararıyla verilen üyeliktir. Onursal üyelerin oy hakkı yoktur.</li>
<li><strong>Fahri Üye:</strong> Derneğin amaçlarına hizmet eden kişi ve kuruluşlara verilen üyeliktir.</li>
</ul>

<h3>Madde 7 — Üyelerin Hak ve Yükümlülükleri</h3>
<p>Her asıl üye genel kurulda bir oy hakkına sahiptir. Üyeler, dernek tüzüğüne ve genel kurul kararlarına uymak, belirlenen aidatları zamanında ödemek ve derneğin amaçlarına uygun davranmakla yükümlüdür.</p>

<h3>Madde 8 — Üyelikten Çıkma ve Çıkarılma</h3>
<p>Her üye yazılı olarak bildirmek kaydıyla üyelikten çıkma hakkına sahiptir. Dernek tüzüğüne aykırı davranan, aidatını altı ay üst üste ödemeyen veya derneğin amacına aykırı faaliyette bulunan üyeler, yönetim kurulu kararıyla üyelikten çıkarılabilir.</p>

<h2>Bölüm 3 — Organlar</h2>

<h3>Madde 9 — Derneğin Organları</h3>
<p>Derneğin organları şunlardır: (a) Genel Kurul, (b) Yönetim Kurulu, (c) Denetim Kurulu. Genel kurul, derneğin en yetkili karar organıdır.</p>

<h3>Madde 10 — Genel Kurul</h3>
<p>Genel kurul, derneğin asıl üyelerinden oluşur. Olağan genel kurul toplantısı üç yılda bir yapılır. Yönetim kurulu veya denetim kurulunun gerekli gördüğü hallerde ya da üyelerin beşte birinin yazılı isteği üzerine olağanüstü genel kurul toplanır.</p>

<h3>Madde 11 — Yönetim Kurulu</h3>
<p>Yönetim kurulu, genel kurul tarafından gizli oyla seçilen 7 asıl ve 7 yedek üyeden oluşur. Görev süresi üç yıldır. Yönetim kurulu; başkan, başkan yardımcısı, genel sekreter ve sayman seçerek görev dağılımı yapar.</p>

<h3>Madde 12 — Denetim Kurulu</h3>
<p>Denetim kurulu, genel kurul tarafından seçilen 3 asıl ve 3 yedek üyeden oluşur. Denetim kurulu; derneğin tüzükte gösterilen amaç doğrultusunda faaliyet gösterip göstermediğini, hesap ve işlemlerin mevzuata uygun olup olmadığını denetler.</p>

<h2>Bölüm 4 — Mali Hükümler</h2>

<h3>Madde 13 — Gelir Kaynakları</h3>
<p>Derneğin gelir kaynakları şunlardır: üye aidatları, bağış ve yardımlar, dernek faaliyetlerinden elde edilen gelirler, yayın ve etkinlik gelirleri, sponsorluk gelirleri ve diğer gelirler.</p>

<h3>Madde 14 — Aidat Miktarı</h3>
<p>Üye giriş aidatı ve yıllık aidat miktarı genel kurul tarafından belirlenir. Aidatlarını zamanında ödemeyen üyelere yönetim kurulunca yazılı uyarı yapılır.</p>

<h3>Madde 15 — Harcama Usulü ve Defter Tutma</h3>
<p>Derneğin tüm gelir ve giderleri yasal defterlere işlenir. Harcamalar yönetim kurulu kararı ile yapılır. Belirli bir tutarı aşan harcamalar için banka aracılığıyla ödeme zorunludur.</p>

<h2>Bölüm 5 — Genel Hükümler</h2>

<h3>Madde 16 — Tüzük Değişikliği</h3>
<p>Tüzük değişikliği, genel kurul kararı ile yapılır. Tüzük değişikliği için toplantıya katılan üyelerin üçte ikisinin oyu gereklidir.</p>

<h3>Madde 17 — Derneğin Feshi ve Tasfiye</h3>
<p>Dernek genel kurulu her zaman derneğin feshine karar verebilir. Fesih kararı için toplantıya katılan üyelerin üçte ikisinin oyu gereklidir. Fesih halinde derneğin mal varlığı, genel kurul kararı ile belirlenen ve derneğin amaçlarına en yakın bir kuruluşa devredilir.</p>

<h3>Madde 18 — Hüküm Eksikliği</h3>
<p>Bu tüzükte belirtilmeyen konularda Türk Medeni Kanunu, 5253 sayılı Dernekler Kanunu ve ilgili mevzuat hükümleri uygulanır.</p>`,
      isPublished: true,
      order: 2,
    },
    {
      title: "Yönetim Kurulu",
      slug: "yonetim-kurulu",
      metaDesc: "Derneğimizin yönetim ve denetim kurulu üyeleri ile tanışın.",
      content: `<h2>Yönetim Kurulu</h2>
<p>Derneğimizin yönetim kurulu, genel kurul tarafından seçilen 7 asıl üyeden oluşmaktadır.</p>

<h3>Ahmet Yılmaz — Genel Başkan</h3>
<p>Derneğimizin kurucu üyelerinden olup, 2018 yılından bu yana genel başkanlık görevini yürütmektedir.</p>

<h3>Fatma Demir — Başkan Yardımcısı</h3>
<p>Eğitim projeleri koordinasyonu ve uluslararası ilişkilerden sorumlu başkan yardımcısıdır.</p>

<h3>Mehmet Kaya — Genel Sekreter</h3>
<p>Dernek iç işleyişi, yazışmalar ve kurumsal iletişimden sorumludur.</p>

<h3>Ayşe Çelik — Sayman</h3>
<p>Derneğin mali işleri, bütçe planlaması ve bağış yönetiminden sorumludur.</p>

<h3>Ali Öztürk — Yönetim Kurulu Üyesi</h3>
<p>Sosyal medya ve dijital iletişim stratejilerinden sorumludur.</p>

<h3>Zeynep Aksoy — Yönetim Kurulu Üyesi</h3>
<p>Etkinlik organizasyonu ve gönüllü koordinasyonundan sorumludur.</p>

<h3>Hasan Yıldız — Yönetim Kurulu Üyesi</h3>
<p>Hukuki danışmanlık ve mevzuat uyumundan sorumludur.</p>

<h2>Denetim Kurulu</h2>
<p>Derneğimizin mali ve idari denetimini yürüten kurul üyelerimiz.</p>

<h3>Elif Şahin — Denetim Kurulu Başkanı</h3>
<p>Mali denetim ve iç kontrol süreçlerinden sorumludur.</p>

<h3>Burak Arslan — Denetim Kurulu Üyesi</h3>
<p>Faaliyet denetimi ve raporlamasından sorumludur.</p>

<h3>Selin Koç — Denetim Kurulu Üyesi</h3>
<p>Mevzuat uyumu ve tüzük denetiminden sorumludur.</p>`,
      isPublished: true,
      order: 3,
    },
    {
      title: "İletişim",
      slug: "iletisim",
      metaDesc: "Her türlü soru, öneri ve iş birliği teklifleriniz için bizimle iletişime geçebilirsiniz.",
      content: `<h2>İletişim Bilgileri</h2>

<h3>Adres</h3>
<p>Beşiktaş Mahallesi, Dernek Sokak No:42/A<br>34353 Beşiktaş / İstanbul</p>

<h3>Telefon</h3>
<p>+90 (212) 555 0 123<br>+90 (212) 555 0 124</p>

<h3>E-posta</h3>
<p>info@dernekpro.com<br>destek@dernekpro.com</p>

<h3>Çalışma Saatleri</h3>
<p>Pazartesi - Cuma: 09:00 - 18:00<br>Cumartesi: 10:00 - 14:00</p>

<h2>Sosyal Medya</h2>
<p>Güncel gelişmelerden haberdar olmak için sosyal medya hesaplarımızı takip edin.</p>`,
      isPublished: true,
      order: 4,
    },
    {
      title: "Bağış",
      slug: "bagis",
      metaDesc: "Derneğimize bağış yaparak toplumsal projelere destek olun.",
      content: `<h2>Bağışlarınız Nasıl Kullanılır?</h2>
<p>Tam şeffaflık ilkesiyle yönetilen bağış sistemimiz ile her kuruşun nereye harcandığı takip edilebilir.</p>
<ul>
<li><strong>Eğitim (%40):</strong> Öğrenci bursları, kitap yardımı ve eğitim programlarına aktarılır.</li>
<li><strong>Sağlık (%30):</strong> Sağlık taraması, tedavi desteği ve sağlık eğitimi projelerine ayrılır.</li>
<li><strong>Çevre (%30):</strong> Çevre koruma, ağaçlandırma ve sürdürülebilirlik projelerine harcanır.</li>
</ul>

<h2>Banka Havalesi ile Bağış</h2>
<p>Online ödeme yerine banka havalesi tercih ediyorsanız aşağıdaki hesap bilgilerini kullanabilirsiniz.</p>
<p><strong>Hesap Sahibi:</strong> DernekPro Derneği<br>
<strong>Banka:</strong> Türkiye İş Bankası<br>
<strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00</p>`,
      isPublished: true,
      order: 5,
    },
    {
      title: "Üye Ol",
      slug: "uye-ol",
      metaDesc: "Derneğimize üye olarak toplumsal değişimin bir parçası olun.",
      content: `<h2>Üyelik Avantajları</h2>
<ul>
<li>Tüm etkinliklere öncelikli katılım hakkı</li>
<li>Aylık bülten ve özel içeriklere erişim</li>
<li>Yönetim ve karar süreçlerinde oy hakkı</li>
<li>Diğer üyelerle networking imkânı</li>
</ul>

<h2>Üyelik Türleri</h2>
<h3>Asıl Üye — 500 TL/yıl</h3>
<p>Tam oy hakkı, tüm etkinliklere erişim, aylık bülten.</p>

<h3>Öğrenci Üye — 100 TL/yıl</h3>
<p>Öğrenci belgesi ile başvuru, etkinliklere ücretsiz katılım.</p>

<h3>Onursal Üye</h3>
<p>Yönetim kurulu kararıyla, derneğe katkıda bulunan kişilere verilir.</p>`,
      isPublished: true,
      order: 6,
    },
    {
      title: "Canlı Yayın",
      slug: "canli-yayin",
      metaDesc: "Derneğimizin canlı yayın ve video içeriklerini buradan takip edebilirsiniz.",
      content: `<h2>Canlı Yayınlar</h2>
<p>Derneğimizin düzenlediği konferans, seminer ve özel programları canlı olarak bu sayfadan takip edebilirsiniz.</p>
<p>Yaklaşan canlı yayınlarımız için duyurular bölümünü ve sosyal medya hesaplarımızı takip edin.</p>`,
      isPublished: true,
      order: 7,
    },
  ];

  for (const page of staticPages) {
    await prisma.page.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: page.slug } },
      update: {
        title: page.title,
        content: page.content,
        metaDesc: page.metaDesc,
        isPublished: page.isPublished,
        order: page.order,
      },
      create: {
        tenantId: tenant.id,
        ...page,
      },
    });
  }

  console.log("Pages created (homepage + 7 static pages)");

  // ============================================================
  // SLIDES (Ana Sayfa Slider)
  // ============================================================
  const slidesData = [
    {
      id: "slide-1",
      mediaUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=85",
      title: "Birlikte Daha\nGucluyuz",
      subtitle: "Toplumsal dayanisma ve gonulluluk ruhuyla binlerce aileye umut oluyoruz. Her el uzatma, bir hayat degistiriyor.",
      buttonText: "Bize Katilin",
      buttonLink: "/uye-ol",
      badge: "Toplumsal Dayanisma",
      bgColor: "#1a3a2a",
      accentColor: "#c8956c",
      statsLabel: "Desteklenen Aile",
      statsValue: "2,500+",
      slideDate: "Devam Ediyor",
      location: "Turkiye Geneli",
      order: 0,
    },
    {
      id: "slide-2",
      mediaUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1400&q=85",
      title: "Egitimde Firsat\nEsitligi",
      subtitle: "Burs programlarimiz ve egitim desteklerimizle genclerimizin gelecegine yatirim yapiyoruz.",
      buttonText: "Burs Programi",
      buttonLink: "/faaliyetler",
      badge: "Egitim Projeleri",
      bgColor: "#1e3a5f",
      accentColor: "#64b5f6",
      statsLabel: "Burslu Ogrenci",
      statsValue: "450+",
      slideDate: "2024-2025 Donemi",
      location: "12 Sehir",
      order: 1,
    },
    {
      id: "slide-3",
      mediaUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1400&q=85",
      title: "Gonulluterimizle\nBuyuyoruz",
      subtitle: "Yuzlerce gonullumuzle birlikte Turkiye genelinde sosyal sorumluluk projelerine imza atiyoruz.",
      buttonText: "Gonullu Ol",
      buttonLink: "/uye-ol",
      badge: "Gonulluluk",
      bgColor: "#2d1b4e",
      accentColor: "#ce93d8",
      statsLabel: "Aktif Gonullu",
      statsValue: "800+",
      slideDate: "Her Gun",
      location: "Tum Subeler",
      order: 2,
    },
    {
      id: "slide-4",
      mediaUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=85",
      title: "Kulturel Mirasa\nSahip Cikiyoruz",
      subtitle: "Konferanslar, festivaller ve sanat etkinlikleriyle kulturel degerlerimizi gelecek nesillere aktariyoruz.",
      buttonText: "Etkinlikler",
      buttonLink: "/etkinlikler",
      badge: "Kultur & Etkinlik",
      bgColor: "#3e2723",
      accentColor: "#ffb74d",
      statsLabel: "Yillik Etkinlik",
      statsValue: "120+",
      slideDate: "Yil Boyunca",
      location: "Coklu Mekan",
      order: 3,
    },
    {
      id: "slide-5",
      mediaUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1400&q=85",
      title: "Her Bagis\nBir Umut",
      subtitle: "Ihtiyac sahibi ailelerimize ulasmak icin duzenledigimiz kampanyalara siz de destek olun.",
      buttonText: "Bagis Yap",
      buttonLink: "/bagis",
      badge: "Yardim Kampanyasi",
      bgColor: "#1b5e20",
      accentColor: "#81c784",
      statsLabel: "Toplam Bagis",
      statsValue: "₺2.5M+",
      slideDate: "Suresiz",
      location: "Online & Subeler",
      order: 4,
    },
  ];

  for (const slide of slidesData) {
    await prisma.slide.upsert({
      where: { id: slide.id },
      update: {
        mediaUrl: slide.mediaUrl,
        title: slide.title,
        subtitle: slide.subtitle,
        buttonText: slide.buttonText,
        buttonLink: slide.buttonLink,
        badge: slide.badge,
        bgColor: slide.bgColor,
        accentColor: slide.accentColor,
        statsLabel: slide.statsLabel,
        statsValue: slide.statsValue,
        slideDate: slide.slideDate,
        location: slide.location,
        order: slide.order,
      },
      create: {
        id: slide.id,
        tenantId: tenant.id,
        mediaUrl: slide.mediaUrl,
        title: slide.title,
        subtitle: slide.subtitle,
        buttonText: slide.buttonText,
        buttonLink: slide.buttonLink,
        badge: slide.badge,
        bgColor: slide.bgColor,
        accentColor: slide.accentColor,
        statsLabel: slide.statsLabel,
        statsValue: slide.statsValue,
        slideDate: slide.slideDate,
        location: slide.location,
        order: slide.order,
      },
    });
  }

  console.log("Slides created (5 homepage slides)");

  // ============================================================
  // DONE
  // ============================================================
  console.log("\nSeed completed successfully!");
  console.log("---");
  console.log("Admin Login:");
  console.log("  Email: admin@dernekpro.com");
  console.log("  Password: Admin123!");
  console.log("---");
  console.log("Demo Member Login:");
  console.log("  Email: ahmet.yilmaz@example.com");
  console.log("  Password: Uye123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
