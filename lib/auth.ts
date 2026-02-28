import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-me"
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "default-refresh-secret-change-me"
);

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const REMEMBER_ME_REFRESH_EXPIRY = "30d";
const REMEMBER_ME_SESSION_DAYS = 30;

export interface JWTPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  type: "user" | "member";
}

// ===== PASSWORD =====
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

// ===== JWT =====
export async function createAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function createRefreshToken(payload: JWTPayload, rememberMe = false): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(rememberMe ? REMEMBER_ME_REFRESH_EXPIRY : REFRESH_TOKEN_EXPIRY)
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ===== SESSION =====
export async function createSession(
  userId: string,
  payload: JWTPayload,
  ip?: string,
  userAgent?: string,
  rememberMe = false
) {
  const accessToken = await createAccessToken(payload);
  const refreshToken = await createRefreshToken(payload, rememberMe);

  const expiresAt = new Date();
  const sessionDays = rememberMe ? REMEMBER_ME_SESSION_DAYS : 7;
  expiresAt.setDate(expiresAt.getDate() + sessionDays);

  await prisma.session.create({
    data: {
      userId,
      token: accessToken,
      refreshToken,
      expiresAt,
      ipAddress: ip,
      userAgent,
    },
  });

  return { accessToken, refreshToken, rememberMe };
}

export async function invalidateSession(token: string) {
  try {
    await prisma.session.delete({ where: { token } });
  } catch {
    // Session may already be deleted
  }
}

export async function invalidateAllUserSessions(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}

// ===== COOKIES =====
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  rememberMe = false
) {
  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // "Beni Hatırla" seçiliyse 30 gün, değilse tarayıcı kapanınca sona erer
    ...(rememberMe ? { maxAge: REMEMBER_ME_SESSION_DAYS * 24 * 60 * 60 } : {}),
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function getAuthFromCookies(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  // 1. Access token geçerliyse direkt dön
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) return payload;
  }

  // 2. Access token expire olduysa refresh token ile yenile
  const refreshTokenValue = cookieStore.get("refresh_token")?.value;
  if (!refreshTokenValue) return null;

  const refreshPayload = await verifyRefreshToken(refreshTokenValue);
  if (!refreshPayload) return null;

  // 3. Veritabanında session kontrolü
  const session = await prisma.session.findUnique({
    where: { refreshToken: refreshTokenValue },
  });

  if (!session || session.expiresAt < new Date()) return null;

  // 4. Yeni access token oluştur ve cookie'ye yaz
  const newPayload: JWTPayload = {
    userId: refreshPayload.userId,
    tenantId: refreshPayload.tenantId,
    email: refreshPayload.email,
    role: refreshPayload.role,
    type: refreshPayload.type,
  };

  const newAccessToken = await createAccessToken(newPayload);

  // Session'daki token'ı güncelle
  await prisma.session.update({
    where: { id: session.id },
    data: { token: newAccessToken },
  });

  // Yeni access token cookie'sini set et
  cookieStore.set("access_token", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  return newPayload;
}

// ===== CURRENT USER HELPER =====
export async function getCurrentUser() {
  const payload = await getAuthFromCookies();
  if (!payload) return null;

  if (payload.type === "user") {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        tenantId: true,
        email: true,
        fullName: true,
        role: true,
        avatar: true,
        isActive: true,
      },
    });
    if (!user || !user.isActive) return null;
    return { ...user, type: "user" as const };
  }

  if (payload.type === "member") {
    const member = await prisma.member.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        tenantId: true,
        email: true,
        fullName: true,
        status: true,
        photo: true,
      },
    });
    if (!member || member.status !== "ACTIVE") return null;
    return { ...member, type: "member" as const, role: "MEMBER" as const };
  }

  return null;
}
