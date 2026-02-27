import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultTenant } from "@/lib/tenant";
import { isModuleActive } from "@/lib/modules/utils";

// GET /api/sponsor-children — Aktif sponsor cocuklari listele (public)
export async function GET(request: NextRequest) {
  try {
    const tenant = await getDefaultTenant();
    if (!tenant) {
      return NextResponse.json({ success: true, data: [] });
    }

    const moduleActive = await isModuleActive(tenant.id, "child-sponsorship");
    if (!moduleActive) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {
      tenantId: tenant.id,
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const children = await prisma.sponsorChild.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: parseInt(limit, 10) } : {}),
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        country: true,
        city: true,
        story: true,
        photoUrl: true,
        goalAmount: true,
        collected: true,
        category: true,
        isFeatured: true,
      },
    });

    // Hikayeyi 200 karakterle sinirla
    const data = children.map((child) => ({
      ...child,
      story: child.story.length > 200 ? child.story.slice(0, 200) + "..." : child.story,
    }));

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Sponsor children GET error:", error);
    return NextResponse.json(
      { success: false, message: "Sponsor cocuklari yuklenirken hata olustu." },
      { status: 500 }
    );
  }
}
