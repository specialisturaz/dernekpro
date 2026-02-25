import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  createSession,
  setAuthCookies,
  type JWTPayload,
} from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

// Default tenant ID for development — in production this comes from subdomain
const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || "default";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Doğrulama hatası", errors: result.error.issues },
        { status: 400 }
      );
    }

    const { fullName, email, password } = result.data;

    // Ensure tenant exists
    let tenant = await prisma.tenant.findUnique({
      where: { subdomain: DEFAULT_TENANT_ID },
    });

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          subdomain: DEFAULT_TENANT_ID,
          name: "DernekPro Demo",
          plan: "STARTER",
        },
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { tenantId_email: { tenantId: tenant.id, email } },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Bu e-posta adresi zaten kayıtlı" },
        { status: 409 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email,
        passwordHash,
        fullName,
        role: "ADMIN", // First user gets admin role
      },
    });

    // Create session
    const jwtPayload: JWTPayload = {
      userId: user.id,
      tenantId: tenant.id,
      email: user.email,
      role: user.role,
      type: "user",
    };

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const { accessToken, refreshToken } = await createSession(
      user.id,
      jwtPayload,
      ip,
      userAgent
    );

    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      {
        success: true,
        message: "Kayıt başarılı",
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
