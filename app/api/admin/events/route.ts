import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// GET events list
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = { tenantId: admin.tenantId };
  if (status) where.status = status;
  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { startAt: "desc" },
    include: { _count: { select: { registrations: true } } },
  });

  return NextResponse.json({ success: true, data: { events } });
}

// POST create new event
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const body = await req.json();
  const slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöçĞÜŞİÖÇ]+/gi, "-")
    .replace(/^-|-$/g, "");

  const event = await prisma.event.create({
    data: {
      tenantId: admin.tenantId,
      title: body.title,
      slug,
      description: body.description || "",
      coverImage: body.coverImage || null,
      startAt: new Date(body.startAt),
      endAt: new Date(body.endAt),
      location: body.location || null,
      eventType: body.eventType || "IN_PERSON",
      capacity: body.capacity ? parseInt(body.capacity) : null,
      isFree: body.isFree !== false,
      price: body.price ? parseFloat(body.price) : null,
      requiresRegistration: body.requiresRegistration || false,
      status: body.status || "UPCOMING",
    },
  });

  return NextResponse.json(
    { success: true, message: "Etkinlik oluşturuldu", data: event },
    { status: 201 }
  );
}
