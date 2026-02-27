import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
}

async function getLatestAnnouncements(): Promise<Announcement[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts?type=ANNOUNCEMENT&limit=4`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

export default async function AnnouncementsSection() {
  const announcements = await getLatestAnnouncements();

  if (announcements.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-background to-orange-50/40" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-100/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-100/15 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-10 md:py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
                Duyurular
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
              Önemli <span className="text-amber-600">Duyurular</span>
            </h2>
          </div>
          <Link
            href="/duyurular"
            className="mt-4 md:mt-0 text-amber-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            Tüm Duyurular
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Announcements List */}
        <div className="grid gap-4 md:grid-cols-2">
          {announcements.map((item) => (
            <Link
              key={item.id}
              href={`/duyurular/${item.slug}`}
              className="group flex items-start gap-4 p-4 md:p-5 rounded-xl bg-background/80 backdrop-blur-sm border border-amber-200/60 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/[0.06] transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mt-0.5">
                {item.isFeatured ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.isFeatured && (
                    <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded uppercase">
                      Önemli
                    </span>
                  )}
                  {item.publishedAt && (
                    <time className="text-xs text-muted">
                      {formatDate(item.publishedAt)}
                    </time>
                  )}
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-amber-600 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="text-sm text-muted line-clamp-1 mt-0.5">
                    {item.excerpt}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-muted group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
