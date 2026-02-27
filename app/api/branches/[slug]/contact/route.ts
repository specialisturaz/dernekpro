import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.email("Geçerli bir e-posta adresi girin"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Konu en az 2 karakter olmalıdır"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
});

// POST: Subeye mesaj gonder
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const tenant = await prisma.tenant.findFirst({ select: { id: true } });
    if (!tenant) {
      return NextResponse.json({ success: false, message: "Bulunamadı" }, { status: 404 });
    }

    const branch = await prisma.branch.findFirst({
      where: { tenantId: tenant.id, slug, status: "ACTIVE" },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ success: false, message: "Şube bulunamadı" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Geçersiz veri";
      return NextResponse.json({ success: false, message: firstError }, { status: 400 });
    }

    await prisma.branchMessage.create({
      data: {
        tenantId: tenant.id,
        branchId: branch.id,
        ...parsed.data,
      },
    });

    return NextResponse.json({ success: true, message: "Mesajınız iletildi" }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
