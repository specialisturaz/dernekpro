import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET posts list
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const type = searchParams.get("type") || undefined;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  const where: Record<string, unknown> = { tenantId: admin.tenantId };
  if (type) where.type = type;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        type: true,
        title: true,
        slug: true,
        status: true,
        isFeatured: true,
        publishedAt: true,
        createdAt: true,
        category: { select: { name: true } },
        author: { select: { fullName: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
}

// POST create new post
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const { type, title, slug, excerpt, content, coverImage, categoryId, tags, status, isFeatured } = body;

  if (!type || !title || !slug || !content) {
    return NextResponse.json(
      { success: false, message: "Başlık, slug, tür ve içerik zorunludur" },
      { status: 400 }
    );
  }

  // Check slug uniqueness
  const existing = await prisma.post.findFirst({
    where: { tenantId: admin.tenantId, slug, type },
  });

  if (existing) {
    return NextResponse.json(
      { success: false, message: "Bu slug zaten kullanılıyor" },
      { status: 409 }
    );
  }

  const post = await prisma.post.create({
    data: {
      tenantId: admin.tenantId,
      type,
      title,
      slug,
      excerpt: excerpt || "",
      content,
      coverImage,
      categoryId,
      tags: tags || [],
      authorId: admin.userId,
      status: status || "DRAFT",
      isFeatured: isFeatured || false,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json(
    { success: true, message: "İçerik oluşturuldu", data: post },
    { status: 201 }
  );
}
