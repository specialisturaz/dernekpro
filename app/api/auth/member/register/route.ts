import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { memberRegisterSchema } from "@/lib/validations";

const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || "default";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = memberRegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Doğrulama hatası", errors: result.error.issues },
        { status: 400 }
      );
    }

    const {
      fullName, email, phone, password,
      tcNo, birthDate, gender, address, city,
      occupation, education, memberTypeId,
    } = result.data;

    // Find tenant
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain: DEFAULT_TENANT_ID },
    });

    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Dernek bulunamadı" },
        { status: 404 }
      );
    }

    // Check if member already exists
    const existingMember = await prisma.member.findUnique({
      where: { tenantId_email: { tenantId: tenant.id, email } },
    });

    if (existingMember) {
      return NextResponse.json(
        { success: false, message: "Bu e-posta adresi zaten kayıtlı" },
        { status: 409 }
      );
    }

    // Create member with PENDING status (needs admin approval)
    const passwordHash = await hashPassword(password);
    const member = await prisma.member.create({
      data: {
        tenantId: tenant.id,
        email,
        passwordHash,
        fullName,
        phone,
        tcNo,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        gender: gender as "MALE" | "FEMALE" | undefined,
        address,
        city,
        occupation,
        education,
        memberTypeId,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Üyelik başvurunuz alınmıştır. Yönetim kurulu onayından sonra hesabınız aktif olacaktır.",
        data: {
          id: member.id,
          email: member.email,
          fullName: member.fullName,
          status: member.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Member register error:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
