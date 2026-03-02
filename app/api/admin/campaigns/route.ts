import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeImageUrl } from "@/lib/utils";

// GET /api/admin/campaigns — list all campaigns
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const campaigns = await prisma.campaign.findMany({
      where: { tenantId: admin.tenantId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { donations: true } },
      },
    });

    const normalized = campaigns.map((c) => ({
      ...c,
      coverImage: normalizeImageUrl(c.coverImage, "campaigns"),
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    console.error("Admin campaigns GET error:", error);
    return NextResponse.json({ success: false, message: "Kampanyalar yüklenirken hata oluştu" }, { status: 500 });
  }
}

// POST /api/admin/campaigns — create new campaign
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, coverImage, targetAmount, deadline, status } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, message: "Başlık ve açıklama zorunludur" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || `kampanya-${Date.now()}`;

    // Check slug uniqueness
    const existing = await prisma.campaign.findUnique({
      where: { tenantId_slug: { tenantId: admin.tenantId, slug } },
    });

    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const campaign = await prisma.campaign.create({
      data: {
        tenantId: admin.tenantId,
        title,
        slug: finalSlug,
        description,
        coverImage: normalizeImageUrl(coverImage, "campaigns"),
        targetAmount: parseFloat(targetAmount) || 0,
        deadline: deadline ? new Date(deadline) : null,
        status: status || "ACTIVE",
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, message: "Kampanya oluşturuldu", data: campaign }, { status: 201 });
  } catch (error) {
    console.error("Admin campaigns POST error:", error);
    return NextResponse.json({ success: false, message: "Kampanya oluşturulurken hata oluştu" }, { status: 500 });
  }
}
