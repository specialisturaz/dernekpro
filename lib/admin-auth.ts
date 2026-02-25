import { getAuthFromCookies, type JWTPayload } from "./auth";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "FINANCIAL", "MODERATOR"];

export async function requireAdmin(): Promise<JWTPayload | null> {
  const payload = await getAuthFromCookies();
  if (!payload) return null;
  if (payload.type !== "user") return null;
  if (!ADMIN_ROLES.includes(payload.role)) return null;
  return payload;
}
