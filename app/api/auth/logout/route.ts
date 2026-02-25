import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { invalidateSession, clearAuthCookies } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (accessToken) {
      await invalidateSession(accessToken);
    }

    await clearAuthCookies();

    return NextResponse.json({
      success: true,
      message: "Çıkış yapıldı",
    });
  } catch (error) {
    console.error("Logout error:", error);
    await clearAuthCookies();
    return NextResponse.json({
      success: true,
      message: "Çıkış yapıldı",
    });
  }
}
