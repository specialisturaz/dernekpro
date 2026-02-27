import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { branchSchema } from "@/lib/validations";
import { isModuleActive } from "@/lib/modules";

// GET: Sube listesi + filtre + pagination
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const active = await isModuleActive(auth.tenantId, "branches");
  if (!active) {
    return NextResponse.json({ success: false, message: "Şube modülü aktif değil" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const status = searchParams.get("status") || undefined;
  const type = searchParams.get("type") || undefined;
  const city = searchParams.get("city") || undefined;
  const search = searchParams.get("search") || undefined;

  const where: Record<string, unknown> = { tenantId: auth.tenantId };
  if (status) where.status = status;
  if (type) where.type = type;
  if (city) where.city = city;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
    ];
  }

  const [branches, total] = await Promise.all([
    prisma.branch.findMany({
      where,
      orderBy: { order: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.branch.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      branches,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}

// POST: Yeni sube olustur
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  const active = await isModuleActive(auth.tenantId, "branches");
  if (!active) {
    return NextResponse.json({ success: false, message: "Şube modülü aktif değil" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = branchSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Geçersiz veri";
    return NextResponse.json({ success: false, message: firstError }, { status: 400 });
  }

  // Slug unique kontrolu
  const existing = await prisma.branch.findFirst({
    where: { tenantId: auth.tenantId, slug: parsed.data.slug },
  });
  if (existing) {
    return NextResponse.json({ success: false, message: "Bu slug zaten kullanılıyor" }, { status: 400 });
  }

  const branch = await prisma.branch.create({
    data: {
      tenantId: auth.tenantId,
      ...parsed.data,
      foundedAt: parsed.data.foundedAt ? new Date(parsed.data.foundedAt) : null,
    },
  });

  return NextResponse.json({ success: true, data: branch }, { status: 201 });
}
