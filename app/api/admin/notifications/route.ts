import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { sendBulkEmail, renderTemplate } from "@/lib/email";

// GET /api/admin/notifications — list notifications
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const type = searchParams.get("type") || undefined;

  const where: Record<string, unknown> = { tenantId: admin.tenantId };
  if (type) where.type = type;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: { reads: true },
        },
      },
    }),
    prisma.notification.count({ where }),
  ]);

  const data = notifications.map((n) => ({
    ...n,
    readCount: n._count.reads,
    _count: undefined,
  }));

  return NextResponse.json({
    success: true,
    data: {
      notifications: data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
}

// POST /api/admin/notifications — create and send notification
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const { title, message, type, link, isGlobal, sendEmail, emailTemplateId } = body;

  if (!title || !message) {
    return NextResponse.json(
      { success: false, message: "Başlık ve mesaj zorunludur" },
      { status: 400 }
    );
  }

  const notification = await prisma.notification.create({
    data: {
      tenantId: admin.tenantId,
      title,
      message,
      type: type || "GENERAL",
      link: link || null,
      isGlobal: isGlobal !== undefined ? isGlobal : true,
      sendEmail: sendEmail || false,
      emailTemplateId: emailTemplateId || null,
      sentAt: new Date(),
    },
  });

  // Send email if requested
  let emailResult = null;
  if (sendEmail && emailTemplateId) {
    try {
      const emailTemplate = await prisma.emailTemplate.findFirst({
        where: { id: emailTemplateId, tenantId: admin.tenantId },
      });

      if (emailTemplate) {
        const activeMembers = await prisma.member.findMany({
          where: {
            tenantId: admin.tenantId,
            status: "ACTIVE",
            email: { not: "" },
          },
          select: { email: true, fullName: true },
        });

        const recipients = activeMembers
          .filter((m) => m.email)
          .map((m) => ({
            email: m.email,
            variables: {
              fullName: m.fullName,
              title: notification.title,
              message: notification.message,
              link: notification.link || "",
            },
          }));

        if (recipients.length > 0) {
          const renderedSubject = renderTemplate(emailTemplate.subject, {
            title: notification.title,
          });
          emailResult = await sendBulkEmail(
            recipients,
            renderedSubject,
            emailTemplate.htmlContent
          );
        }
      }
    } catch (error) {
      console.error("[notifications] E-posta gönderim hatası:", error);
    }
  }

  return NextResponse.json(
    {
      success: true,
      message: "Bildirim oluşturuldu",
      data: { notification, emailResult },
    },
    { status: 201 }
  );
}
