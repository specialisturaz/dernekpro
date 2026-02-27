import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Haberler",
  description: "Derneğimizin son haberleri, basın bültenleri ve güncel gelişmeler.",
  openGraph: {
    title: "Haberler",
    description: "Derneğimizin son haberleri, basın bültenleri ve güncel gelişmeler.",
  },
  alternates: {
    canonical: "/haberler",
  },
};

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  isFeatured: boolean;
  publishedAt: string | null;
  category: { id: string; name: string; slug: string } | null;
}

async function getHaberler(page = 1): Promise<{ data: Post[]; pagination: { page: number; totalPages: number; total: number } }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts?type=NEWS&page=${page}&limit=12`, {
      next: { revalidate: 60 },
    });
    const json = await res.json();
    if (json.success) return { data: json.data, pagination: json.pagination };
  } catch {
    // fallback
  }
  return { data: [], pagination: { page: 1, totalPages: 1, total: 0 } };
}

export default async function HaberlerPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const { data: haberler, pagination } = await getHaberler(page);

  const featured = haberler.find((h) => h.isFeatured) || haberler[0];
  const rest = haberler.filter((h) => h.id !== featured?.id);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-primary text-white pt-32 pb-10 md:pt-36 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Haberler</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Haberler</h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl">
            Derneğimizin güncel haberleri, basın bültenleri ve önemli gelişmelerden haberdar olun.
          </p>
        </div>
      </section>

      {/* İçerik */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          {haberler.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h2 className="text-xl font-bold text-foreground mb-2">Henüz haber bulunmuyor</h2>
              <p className="text-muted">Yakında haberler burada yayınlanacak.</p>
            </div>
          ) : (
            <>
              {/* Öne Çıkan Haber */}
              {featured && (
                <Link href={`/haberler/${featured.slug}`} className="card grid md:grid-cols-2 group mb-8">
                  <div className="aspect-video md:aspect-auto relative overflow-hidden bg-gray-100">
                    {featured.coverImage ? (
                      <img
                        src={featured.coverImage}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[250px] flex items-center justify-center bg-primary/5">
                        <svg className="w-16 h-16 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      {featured.category && (
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {featured.category.name}
                        </span>
                      )}
                      {featured.publishedAt && (
                        <span className="text-xs text-muted">
                          {new Date(featured.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-3 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && <p className="text-muted mb-4">{featured.excerpt}</p>}
                    <span className="text-primary font-semibold text-sm inline-flex items-center gap-1">
                      Devamını Oku
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              )}

              {/* Haber Listesi */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((haber) => (
                    <Link key={haber.id} href={`/haberler/${haber.slug}`} className="card group">
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        {haber.coverImage ? (
                          <img
                            src={haber.coverImage}
                            alt={haber.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <svg className="w-10 h-10 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          {haber.category && (
                            <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                              {haber.category.name}
                            </span>
                          )}
                          {haber.publishedAt && (
                            <span className="text-xs text-muted">
                              {new Date(haber.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors">
                          {haber.title}
                        </h3>
                        {haber.excerpt && <p className="text-muted text-sm line-clamp-2">{haber.excerpt}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  {page > 1 && (
                    <Link href={`/haberler?page=${page - 1}`} className="px-4 py-2 rounded border border-border text-muted hover:bg-background-alt transition-colors">
                      Önceki
                    </Link>
                  )}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/haberler?page=${p}`}
                      className={`px-4 py-2 rounded font-semibold ${p === page ? "bg-primary text-white" : "border border-border text-muted hover:bg-background-alt transition-colors"}`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < pagination.totalPages && (
                    <Link href={`/haberler?page=${page + 1}`} className="px-4 py-2 rounded border border-border text-muted hover:bg-background-alt transition-colors">
                      Sonraki
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
