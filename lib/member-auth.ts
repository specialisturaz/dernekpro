import { getAuthFromCookies, type JWTPayload } from "./auth";

export async function requireMember(): Promise<JWTPayload | null> {
  const payload = await getAuthFromCookies();
  if (!payload) return null;
  if (payload.type !== "member") return null;
  return payload;
}
