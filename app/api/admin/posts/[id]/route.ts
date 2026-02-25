import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET single post
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const post = await prisma.post.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
    include: {
      category: { select: { id: true, name: true } },
      author: { select: { fullName: true } },
    },
  });

  if (!post) {
    return NextResponse.json({ success: false, message: "İçerik bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: post });
}

// PATCH update post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const existing = await prisma.post.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json({ success: false, message: "İçerik bulunamadı" }, { status: 404 });
  }

  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, categoryId, tags, status, isFeatured } = body;

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (slug !== undefined) data.slug = slug;
  if (excerpt !== undefined) data.excerpt = excerpt;
  if (content !== undefined) data.content = content;
  if (coverImage !== undefined) data.coverImage = coverImage;
  if (categoryId !== undefined) data.categoryId = categoryId;
  if (tags !== undefined) data.tags = tags;
  if (status !== undefined) data.status = status;
  if (isFeatured !== undefined) data.isFeatured = isFeatured;

  // Set publishedAt when publishing
  if (status === "PUBLISHED" && existing.status !== "PUBLISHED") {
    data.publishedAt = new Date();
  }

  const post = await prisma.post.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ success: true, message: "İçerik güncellendi", data: post });
}

// DELETE post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const existing = await prisma.post.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json({ success: false, message: "İçerik bulunamadı" }, { status: 404 });
  }

  await prisma.post.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true, message: "İçerik silindi" });
}
