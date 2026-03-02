import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

function generateSlug(title: string): string {
  const turkishMap: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return title
    .split("")
    .map((ch) => turkishMap[ch] || ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET /api/admin/pages — list all pages for tenant
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;

  const where: Record<string, unknown> = { tenantId: admin.tenantId };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  const pages = await prisma.page.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      template: true,
      isPublished: true,
      order: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    success: true,
    data: { pages },
  });
}

// POST /api/admin/pages — create new page
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, template, metaTitle, metaDesc, isPublished, showInMenu, order } = body;

  if (!title || !content) {
    return NextResponse.json(
      { success: false, message: "Başlık ve içerik zorunludur" },
      { status: 400 }
    );
  }

  // Auto-generate slug from title
  let slug = generateSlug(title);

  // Ensure slug uniqueness within tenant
  const existing = await prisma.page.findFirst({
    where: { tenantId: admin.tenantId, slug },
  });

  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const page = await prisma.page.create({
    data: {
      tenantId: admin.tenantId,
      title,
      slug,
      content,
      template: template || null,
      metaTitle: metaTitle || null,
      metaDesc: metaDesc || null,
      isPublished: isPublished ?? false,
      showInMenu: showInMenu ?? false,
      order: order ?? 0,
    },
  });

  return NextResponse.json(
    { success: true, message: "Sayfa oluşturuldu", data: page },
    { status: 201 }
  );
}
