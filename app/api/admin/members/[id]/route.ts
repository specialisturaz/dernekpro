import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET single member
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const member = await prisma.member.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
    include: {
      memberType: { select: { name: true } },
      dues: { orderBy: { period: "desc" }, take: 12 },
      donations: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!member) {
    return NextResponse.json({ success: false, message: "Üye bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: member });
}

// PATCH update member (status, info)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const { status, fullName, phone, city, address, occupation, education, memberTypeId } = body;

  // Verify member belongs to tenant
  const existing = await prisma.member.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json({ success: false, message: "Üye bulunamadı" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (fullName) data.fullName = fullName;
  if (phone !== undefined) data.phone = phone;
  if (city !== undefined) data.city = city;
  if (address !== undefined) data.address = address;
  if (occupation !== undefined) data.occupation = occupation;
  if (education !== undefined) data.education = education;
  if (memberTypeId !== undefined) data.memberTypeId = memberTypeId;

  // When approving, set joinedAt
  if (status === "ACTIVE" && existing.status === "PENDING") {
    data.joinedAt = new Date();
  }

  const member = await prisma.member.update({
    where: { id: params.id },
    data,
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
    },
  });

  return NextResponse.json({
    success: true,
    message: status === "ACTIVE" ? "Üye onaylandı" :
             status === "REJECTED" ? "Üye başvurusu reddedildi" :
             "Üye güncellendi",
    data: member,
  });
}

// DELETE member
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const existing = await prisma.member.findFirst({
    where: { id: params.id, tenantId: admin.tenantId },
  });

  if (!existing) {
    return NextResponse.json({ success: false, message: "Üye bulunamadı" }, { status: 404 });
  }

  await prisma.member.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true, message: "Üye silindi" });
}
