import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/pages/[id] — get single page
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz" },
        { status: 401 }
      );
    }

    const page = await prisma.page.findFirst({
      where: { id: params.id, tenantId: admin.tenantId },
    });

    if (!page) {
      return NextResponse.json(
        { success: false, message: "Sayfa bulunamadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("Page GET error:", error);
    return NextResponse.json(
      { success: false, message: "Sayfa getirilirken hata olustu" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/pages/[id] — update page
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz" },
        { status: 401 }
      );
    }

    const existing = await prisma.page.findFirst({
      where: { id: params.id, tenantId: admin.tenantId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Sayfa bulunamadi" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      content,
      metaTitle,
      metaDesc,
      isPublished,
      customCss,
      sections,
    } = body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (content !== undefined) data.content = content;
    if (metaTitle !== undefined) data.metaTitle = metaTitle;
    if (metaDesc !== undefined) data.metaDesc = metaDesc;
    if (isPublished !== undefined) data.isPublished = isPublished;
    if (customCss !== undefined) data.customCss = customCss;
    if (sections !== undefined) data.sections = sections;

    // If slug is being changed, check uniqueness within tenant
    if (slug !== undefined && slug !== existing.slug) {
      const slugExists = await prisma.page.findFirst({
        where: {
          tenantId: admin.tenantId,
          slug,
          id: { not: params.id },
        },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, message: "Bu slug zaten kullaniliyor" },
          { status: 400 }
        );
      }
    }

    const page = await prisma.page.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Sayfa guncellendi",
      data: page,
    });
  } catch (error) {
    console.error("Page PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Sayfa guncellenirken hata olustu" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/pages/[id] — delete page
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz" },
        { status: 401 }
      );
    }

    const existing = await prisma.page.findFirst({
      where: { id: params.id, tenantId: admin.tenantId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Sayfa bulunamadi" },
        { status: 404 }
      );
    }

    await prisma.page.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: "Sayfa silindi",
    });
  } catch (error) {
    console.error("Page DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Sayfa silinirken hata olustu" },
      { status: 500 }
    );
  }
}
