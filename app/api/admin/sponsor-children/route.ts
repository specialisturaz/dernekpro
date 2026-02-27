import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/sponsor-children — Tum sponsor cocuklari listele (admin)
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const [children, totalCount, activeCount, featuredCount] = await Promise.all([
      prisma.sponsorChild.findMany({
        where: { tenantId: admin.tenantId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.sponsorChild.count({
        where: { tenantId: admin.tenantId },
      }),
      prisma.sponsorChild.count({
        where: { tenantId: admin.tenantId, isActive: true },
      }),
      prisma.sponsorChild.count({
        where: { tenantId: admin.tenantId, isFeatured: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: children,
      counts: {
        total: totalCount,
        active: activeCount,
        featured: featuredCount,
      },
    });
  } catch (error) {
    console.error("Admin sponsor children GET error:", error);
    return NextResponse.json(
      { success: false, message: "Sponsor cocuklari yuklenirken veritabani hatasi olustu." },
      { status: 500 }
    );
  }
}

// POST /api/admin/sponsor-children — Yeni sponsor cocugu olustur
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      age,
      gender,
      country,
      city,
      story,
      photoUrl,
      goalAmount,
      category,
      isFeatured,
    } = body;

    // Zorunlu alan kontrolleri
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Cocuk adi zorunludur." },
        { status: 400 }
      );
    }

    if (age === undefined || age === null || typeof age !== "number" || age < 0) {
      return NextResponse.json(
        { success: false, message: "Gecerli bir yas girilmelidir." },
        { status: 400 }
      );
    }

    if (!story || typeof story !== "string" || !story.trim()) {
      return NextResponse.json(
        { success: false, message: "Hikaye alani zorunludur." },
        { status: 400 }
      );
    }

    if (!photoUrl || typeof photoUrl !== "string" || !photoUrl.trim()) {
      return NextResponse.json(
        { success: false, message: "Fotograf URL zorunludur." },
        { status: 400 }
      );
    }

    if (goalAmount === undefined || goalAmount === null || typeof goalAmount !== "number" || goalAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Hedef tutar sifirdan buyuk olmalidir." },
        { status: 400 }
      );
    }

    const child = await prisma.sponsorChild.create({
      data: {
        tenantId: admin.tenantId,
        name: name.trim(),
        age,
        gender: gender || "male",
        country: country || "Türkiye",
        city: city || null,
        story: story.trim(),
        photoUrl: photoUrl.trim(),
        goalAmount,
        category: category || "giydirme",
        isFeatured: isFeatured ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Sponsor cocugu basariyla olusturuldu.",
      data: child,
    });
  } catch (error) {
    console.error("Admin sponsor children POST error:", error);
    return NextResponse.json(
      { success: false, message: "Sponsor cocugu olusturulurken hata olustu." },
      { status: 500 }
    );
  }
}
