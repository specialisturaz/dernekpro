import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/contact — public contact form submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validasyon
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Ad, e-posta ve mesaj zorunludur." },
        { status: 400 }
      );
    }

    // E-posta format kontrolu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Gecerli bir e-posta adresi giriniz." },
        { status: 400 }
      );
    }

    // Mesaj uzunluk kontrolu
    if (message.length < 10) {
      return NextResponse.json(
        { success: false, message: "Mesaj en az 10 karakter olmalidir." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { success: false, message: "Mesaj en fazla 5000 karakter olabilir." },
        { status: 400 }
      );
    }

    // Tenant bul
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({ where: { id: tenantId }, select: { id: true } })
      : await prisma.tenant.findFirst({
          where: { isActive: true },
          select: { id: true },
          orderBy: { createdAt: "asc" },
        });

    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Sistem hatasi. Lutfen daha sonra tekrar deneyiniz." },
        { status: 500 }
      );
    }

    // Contact kaydi olustur
    await prisma.contact.create({
      data: {
        tenantId: tenant.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mesajiniz basariyla gonderildi. En kisa surede size donecegiz.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Bir hata olustu. Lutfen tekrar deneyiniz." },
      { status: 500 }
    );
  }
}
