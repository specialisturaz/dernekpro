import { prisma } from "./db";

/**
 * Shared data-fetching functions for site pages.
 * Pages call these directly instead of fetching their own API routes.
 * All functions serialize results (Date → string) for compatibility with client components.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

async function getTenantId(): Promise<string | null> {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    if (tenantId) return tenantId;
    const tenant = await prisma.tenant.findFirst({
      where: { isActive: true },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });
    return tenant?.id ?? null;
  } catch {
    return null;
  }
}

// ─── Posts (Faaliyetler / Haberler / Duyurular) ───

export async function getPosts(
  type: "ACTIVITY" | "NEWS" | "ANNOUNCEMENT",
  page = 1,
  limit = 50
) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };

    const where = { tenantId, type, status: "PUBLISHED" as const };
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          tags: true,
          isFeatured: true,
          publishedAt: true,
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, fullName: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return serialize({
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };
  }
}

export async function getPostBySlug(slug: string, type: "ACTIVITY" | "NEWS" | "ANNOUNCEMENT") {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return null;

    const post = await prisma.post.findFirst({
      where: { tenantId, slug, type, status: "PUBLISHED" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, fullName: true } },
      },
    });

    if (!post) return null;

    const related = await prisma.post.findMany({
      where: { tenantId, type, status: "PUBLISHED", id: { not: post.id } },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        category: { select: { name: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });

    return serialize({
      post: {
        ...post,
        author: post.author ? { id: post.author.id, name: post.author.fullName } : null,
      },
      related,
    });
  } catch {
    return null;
  }
}

// ─── Events (Etkinlikler) ───

export async function getEvents(limit = 50) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return [];

    const events = await prisma.event.findMany({
      where: { tenantId, status: { not: "CANCELLED" } },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        startAt: true,
        endAt: true,
        location: true,
        eventType: true,
        capacity: true,
        isFree: true,
        price: true,
        requiresRegistration: true,
        status: true,
      },
      orderBy: { startAt: "desc" },
      take: limit,
    });

    return serialize(events);
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return null;

    const event = await prisma.event.findFirst({
      where: { tenantId, slug, status: { not: "CANCELLED" } },
    });

    return event ? serialize(event) : null;
  } catch {
    return null;
  }
}

// ─── Campaigns (Bağış) ───

export async function getCampaigns() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return [];

    const campaigns = await prisma.campaign.findMany({
      where: { tenantId, isActive: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        targetAmount: true,
        collectedAmount: true,
        deadline: true,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return serialize(campaigns);
  } catch {
    return [];
  }
}

// ─── Gallery (Galeri) ───

export async function getGalleryAlbums() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return [];

    const albums = await prisma.galleryAlbum.findMany({
      where: { tenantId },
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        category: true,
        createdAt: true,
        _count: { select: { images: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return serialize(
      albums.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        coverImage: a.coverImage,
        category: a.category || "genel",
        createdAt: a.createdAt,
        imageCount: a._count.images,
      }))
    );
  } catch {
    return [];
  }
}

// ─── Sponsor Children (Çocuk Sponsorluk) ───

export async function getSponsorChildren() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return [];

    const children = await prisma.sponsorChild.findMany({
      where: { tenantId, isActive: true },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        country: true,
        city: true,
        story: true,
        photoUrl: true,
        goalAmount: true,
        collected: true,
        category: true,
        isFeatured: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return serialize(
      children.map((c) => ({
        ...c,
        story: c.story && c.story.length > 200 ? c.story.slice(0, 200) + "..." : c.story,
      }))
    );
  } catch {
    return [];
  }
}
