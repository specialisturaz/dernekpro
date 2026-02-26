import { NextRequest, NextResponse } from "next/server";
import { requireMember } from "@/lib/member-auth";
import { prisma } from "@/lib/db";

// GET /api/member/profile — current member's profile
export async function GET() {
  const payload = await requireMember();
  if (!payload) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const member = await prisma.member.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      birthDate: true,
      gender: true,
      address: true,
      city: true,
      occupation: true,
      education: true,
      photo: true,
      status: true,
      joinedAt: true,
      createdAt: true,
      memberType: { select: { name: true } },
    },
  });

  if (!member) {
    return NextResponse.json({ success: false, message: "Üye bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: member });
}

// PATCH /api/member/profile — update own profile
export async function PATCH(req: NextRequest) {
  const payload = await requireMember();
  if (!payload) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const body = await req.json();

  // Only allow certain fields to be updated by the member
  const allowedFields = ["fullName", "phone", "address", "city", "occupation", "education", "photo"];
  const updateData: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ success: false, message: "Güncellenecek alan bulunamadı" }, { status: 400 });
  }

  const updated = await prisma.member.update({
    where: { id: payload.userId },
    data: updateData,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      occupation: true,
      education: true,
      photo: true,
    },
  });

  return NextResponse.json({ success: true, data: updated, message: "Profil güncellendi" });
}
