import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-me"
);

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "default-refresh-secret-change-me"
);

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "FINANCIAL", "MODERATOR"];

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; role: string; type: string };
  } catch {
    return null;
  }
}

async function verifyRefresh(token: string) {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as { userId: string; role: string; type: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // ===== ADMIN ROUTES =====
  if (pathname.startsWith("/admin")) {
    // Access token geçerliyse devam et
    if (accessToken) {
      const payload = await verifyToken(accessToken);
      if (payload && payload.type === "user" && ADMIN_ROLES.includes(payload.role)) {
        return NextResponse.next();
      }
    }

    // Access token expire olduysa, refresh token varsa izin ver
    // (getAuthFromCookies API route'ta yeni access token oluşturacak)
    if (refreshToken) {
      const refreshPayload = await verifyRefresh(refreshToken);
      if (refreshPayload && refreshPayload.type === "user" && ADMIN_ROLES.includes(refreshPayload.role)) {
        return NextResponse.next();
      }
    }

    return NextResponse.redirect(new URL("/giris?redirect=/admin/dashboard", request.url));
  }

  // ===== MEMBER ROUTES =====
  if (pathname.startsWith("/hesabim")) {
    if (accessToken) {
      const payload = await verifyToken(accessToken);
      if (payload) return NextResponse.next();
    }

    // Refresh token ile de kontrol et
    if (refreshToken) {
      const refreshPayload = await verifyRefresh(refreshToken);
      if (refreshPayload) return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/giris?redirect=/hesabim", request.url));
  }

  // ===== AUTH ROUTES (redirect if already logged in) =====
  if (pathname === "/giris" || pathname === "/kayit") {
    if (accessToken) {
      const payload = await verifyToken(accessToken);
      if (payload) {
        if (payload.type === "user" && ADMIN_ROLES.includes(payload.role)) {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/hesabim", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/hesabim/:path*", "/giris", "/kayit"],
};
