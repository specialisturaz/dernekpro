import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/admin/email-templates — list email templates
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const templates = await prisma.emailTemplate.findMany({
    where: { tenantId: admin.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: templates });
}

// POST /api/admin/email-templates — create new template
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const { name, subject, htmlContent, variables } = body;

  if (!name || !subject || !htmlContent) {
    return NextResponse.json(
      { success: false, message: "Ad, konu ve HTML içerik zorunludur" },
      { status: 400 }
    );
  }

  // Check name uniqueness
  const existing = await prisma.emailTemplate.findFirst({
    where: { tenantId: admin.tenantId, name },
  });

  if (existing) {
    return NextResponse.json(
      { success: false, message: "Bu isimle bir şablon zaten mevcut" },
      { status: 409 }
    );
  }

  const template = await prisma.emailTemplate.create({
    data: {
      tenantId: admin.tenantId,
      name,
      subject,
      htmlContent,
      variables: variables || [],
    },
  });

  return NextResponse.json(
    { success: true, message: "E-posta şablonu oluşturuldu", data: template },
    { status: 201 }
  );
}
