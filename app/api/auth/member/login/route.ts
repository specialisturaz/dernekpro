import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  verifyPassword,
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
    const rememberMe = body.rememberMe === true;

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

    // Find member
    const member = await prisma.member.findUnique({
      where: { tenantId_email: { tenantId: tenant.id, email } },
    });

    if (!member || !member.passwordHash) {
      return NextResponse.json(
        { success: false, message: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    if (member.status !== "ACTIVE") {
      const statusMessages: Record<string, string> = {
        PENDING: "Üyelik başvurunuz henüz onaylanmamıştır",
        PASSIVE: "Üyeliğiniz pasif durumdadır",
        SUSPENDED: "Üyeliğiniz askıya alınmıştır",
        REJECTED: "Üyelik başvurunuz reddedilmiştir",
      };
      return NextResponse.json(
        { success: false, message: statusMessages[member.status] || "Giriş yapılamaz" },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, member.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    // Create session — members use a separate User record for sessions
    // or we create session directly. Here we use member ID.
    const jwtPayload: JWTPayload = {
      userId: member.id,
      tenantId: tenant.id,
      email: member.email,
      role: "MEMBER",
      type: "member",
    };

    // Members use JWT without DB session (Session table requires User FK)
    const accessToken = (await import("@/lib/auth")).createAccessToken(jwtPayload);
    const refreshToken = (await import("@/lib/auth")).createRefreshToken(jwtPayload, rememberMe);

    const [at, rt] = await Promise.all([accessToken, refreshToken]);

    await setAuthCookies(at, rt, rememberMe);

    return NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      data: {
        id: member.id,
        email: member.email,
        fullName: member.fullName,
        type: "member",
      },
    });
  } catch (error) {
    console.error("Member login error:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
