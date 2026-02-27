import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  category: { name: string } | null;
}

interface Announcement {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
}

async function getNewsAndAnnouncements(): Promise<{
  news: NewsItem[];
  announcements: Announcement[];
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const [newsRes, annRes] = await Promise.all([
      fetch(`${baseUrl}/api/posts?type=NEWS&limit=3`, { next: { revalidate: 120 } }),
      fetch(`${baseUrl}/api/posts?type=ANNOUNCEMENT&limit=4`, { next: { revalidate: 120 } }),
    ]);

    const newsJson = newsRes.ok ? await newsRes.json() : { success: false };
    const annJson = annRes.ok ? await annRes.json() : { success: false };

    return {
      news: newsJson.success ? newsJson.data : [],
      announcements: annJson.success ? annJson.data : [],
    };
  } catch {
    return { news: [], announcements: [] };
  }
}

export default async function NewsAnnouncementsSection() {
  const { news, announcements } = await getNewsAndAnnouncements();
  if (news.length === 0 && announcements.length === 0) return null;

  return (
    <section className="section-padding bg-background-alt">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Haberler & Duyurular
          </span>
          <h2 className="mt-3">
            Son <span className="text-primary">Gelişmeler</span>
          </h2>
        </div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: News (3 columns) */}
          {news.length > 0 && (
            <div className={`${announcements.length > 0 ? "lg:col-span-3" : "lg:col-span-5"}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Haberler
                </h3>
                <Link href="/haberler" className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1">
                  Tümü
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/haberler/${item.slug}`}
                    className="card group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {item.coverImage ? (
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <svg className="w-10 h-10 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      {item.category && (
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-0.5 bg-primary text-white rounded-full text-[10px] font-semibold">
                            {item.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      {item.publishedAt && (
                        <time className="text-[11px] text-muted font-medium">
                          {formatDate(item.publishedAt)}
                        </time>
                      )}
                      <h4 className="font-bold text-sm mt-1 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Right: Announcements (2 columns) */}
          {announcements.length > 0 && (
            <div className={`${news.length > 0 ? "lg:col-span-2" : "lg:col-span-5"}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  Duyurular
                </h3>
                <Link href="/duyurular" className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1">
                  Tümü
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <Link
                    key={ann.id}
                    href={`/duyurular/${ann.slug}`}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-background hover:border-amber-300 hover:shadow-sm transition-all group"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {ann.isFeatured ? (
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {ann.title}
                      </h4>
                      {ann.publishedAt && (
                        <time className="text-[11px] text-muted mt-1 block">
                          {formatDate(ann.publishedAt)}
                        </time>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-muted group-hover:text-primary flex-shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
