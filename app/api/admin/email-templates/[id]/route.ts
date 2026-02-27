import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/email-templates/[id] — single template
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = params;

  const template = await prisma.emailTemplate.findFirst({
    where: { id, tenantId: admin.tenantId },
  });

  if (!template) {
    return NextResponse.json(
      { success: false, message: "Şablon bulunamadı" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: template });
}

// PATCH /api/admin/email-templates/[id] — update template
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = params;

  const existing = await prisma.emailTemplate.findFirst({
    where: { id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Şablon bulunamadı" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const { name, subject, htmlContent, variables } = body;

  // Check name uniqueness if name changed
  if (name && name !== existing.name) {
    const duplicate = await prisma.emailTemplate.findFirst({
      where: { tenantId: admin.tenantId, name, id: { not: id } },
    });
    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "Bu isimle bir şablon zaten mevcut" },
        { status: 409 }
      );
    }
  }

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (subject !== undefined) updateData.subject = subject;
  if (htmlContent !== undefined) updateData.htmlContent = htmlContent;
  if (variables !== undefined) updateData.variables = variables;

  const template = await prisma.emailTemplate.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({
    success: true,
    message: "Şablon güncellendi",
    data: template,
  });
}

// DELETE /api/admin/email-templates/[id] — delete template
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = params;

  const existing = await prisma.emailTemplate.findFirst({
    where: { id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Şablon bulunamadı" },
      { status: 404 }
    );
  }

  if (existing.isDefault) {
    return NextResponse.json(
      { success: false, message: "Varsayılan şablonlar silinemez" },
      { status: 400 }
    );
  }

  await prisma.emailTemplate.delete({ where: { id } });

  return NextResponse.json({ success: true, message: "Şablon silindi" });
}
