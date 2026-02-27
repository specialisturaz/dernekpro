import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const slides = await prisma.slide.findMany({
      where: { tenantId: admin.tenantId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: slides });
  } catch (err) {
    console.error("Admin slides GET error:", err);
    return NextResponse.json(
      { success: false, message: "Slide'lar yuklenirken veritabani hatasi olustu." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      mediaUrl, mobileMediaUrl, title, subtitle, buttonText, buttonLink,
      type, order, isActive, badge, bgColor, accentColor,
      statsLabel, statsValue, slideDate, location,
    } = body;

    if (!mediaUrl) {
      return NextResponse.json(
        { success: false, message: "Gorsel URL zorunludur." },
        { status: 400 }
      );
    }

    // Get max order
    const maxOrder = await prisma.slide.aggregate({
      where: { tenantId: admin.tenantId },
      _max: { order: true },
    });

    const slide = await prisma.slide.create({
      data: {
        tenantId: admin.tenantId,
        mediaUrl,
        mobileMediaUrl: mobileMediaUrl || null,
        title: title || null,
        subtitle: subtitle || null,
        buttonText: buttonText || null,
        buttonLink: buttonLink || null,
        type: type || "image",
        order: order ?? (maxOrder._max.order ?? -1) + 1,
        isActive: isActive ?? true,
        badge: badge || null,
        bgColor: bgColor || null,
        accentColor: accentColor || null,
        statsLabel: statsLabel || null,
        statsValue: statsValue || null,
        slideDate: slideDate || null,
        location: location || null,
      },
    });

    return NextResponse.json({ success: true, data: slide });
  } catch {
    return NextResponse.json(
      { success: false, message: "Slide olusturulurken hata olustu." },
      { status: 500 }
    );
  }
}
