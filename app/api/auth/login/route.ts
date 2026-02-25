import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  verifyPassword,
  createSession,
  setAuthCookies,
  type JWTPayload,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || "default";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Doğrulama hatası", errors: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find tenant
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain: DEFAULT_TENANT_ID },
    });

    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { tenantId_email: { tenantId: tenant.id, email } },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
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

    return NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
