import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
  type JWTPayload,
} from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshTokenValue = cookieStore.get("refresh_token")?.value;

    if (!refreshTokenValue) {
      return NextResponse.json(
        { success: false, message: "Refresh token bulunamadı" },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshTokenValue);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Geçersiz refresh token" },
        { status: 401 }
      );
    }

    // Check session exists in DB
    const session = await prisma.session.findUnique({
      where: { refreshToken: refreshTokenValue },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, message: "Oturum süresi dolmuş" },
        { status: 401 }
      );
    }

    // Create new tokens
    const newPayload: JWTPayload = {
      userId: payload.userId,
      tenantId: payload.tenantId,
      email: payload.email,
      role: payload.role,
      type: payload.type,
    };

    const newAccessToken = await createAccessToken(newPayload);
    const newRefreshToken = await createRefreshToken(newPayload);

    // Update session
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 7);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: newExpiry,
      },
    });

    await setAuthCookies(newAccessToken, newRefreshToken);

    return NextResponse.json({
      success: true,
      message: "Token yenilendi",
    });
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
