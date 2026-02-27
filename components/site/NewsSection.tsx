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

async function getLatestNews(): Promise<NewsItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts?type=NEWS&limit=3`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

export default async function NewsSection() {
  const news = await getLatestNews();

  if (news.length === 0) return null;

  return (
    <section className="section-padding bg-background-alt">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Haberler & Duyurular
            </span>
            <h2 className="mt-3">
              Son <span className="text-primary">Gelişmeler</span>
            </h2>
          </div>
          <Link
            href="/haberler"
            className="mt-4 md:mt-0 text-primary font-semibold hover:underline inline-flex items-center gap-1"
          >
            Tüm Haberler
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* News Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/haberler/${item.slug}`}
              className="card group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="aspect-video relative overflow-hidden">
                {item.coverImage ? (
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {item.category && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold">
                      {item.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {item.publishedAt && (
                  <time className="text-xs text-muted font-medium">
                    {formatDate(item.publishedAt)}
                  </time>
                )}
                <h3 className="font-bold text-lg mt-2 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="text-sm text-muted line-clamp-2">
                    {item.excerpt}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary">
                  Devamını Oku
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
