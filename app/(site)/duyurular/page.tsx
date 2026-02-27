import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Duyurular",
  description: "Derneğimizin resmi duyuruları, önemli bilgilendirmeler ve güncel açıklamalar.",
  openGraph: {
    title: "Duyurular",
    description: "Derneğimizin resmi duyuruları, önemli bilgilendirmeler ve güncel açıklamalar.",
  },
  alternates: {
    canonical: "/duyurular",
  },
};

export default async function DuyurularPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const { data: duyurular, pagination } = await getPosts("ANNOUNCEMENT", page, 12);

  const pinned = duyurular.filter((d) => d.isFeatured);
  const rest = duyurular.filter((d) => !d.isFeatured);

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
            <span className="text-white">Duyurular</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Duyurular</h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl">
            Derneğimize ait resmi duyurular, önemli bilgilendirmeler ve açıklamaları bu sayfada bulabilirsiniz.
          </p>
        </div>
      </section>

      {/* Duyuru Listesi */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4 max-w-4xl">
          {duyurular.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <h2 className="text-xl font-bold text-foreground mb-2">Henüz duyuru bulunmuyor</h2>
              <p className="text-muted">Yakında duyurular burada yayınlanacak.</p>
            </div>
          ) : (
            <>
              {/* Sabitlenmiş */}
              {pinned.map((duyuru) => (
                <Link
                  key={duyuru.id}
                  href={`/duyurular/${duyuru.slug}`}
                  className="block mb-6 p-6 rounded-[var(--border-radius)] border-2 border-primary bg-accent hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                    </svg>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Sabitlenmiş Duyuru</span>
                  </div>
                  <h2 className="text-xl font-bold font-heading text-foreground mb-2">{duyuru.title}</h2>
                  {duyuru.excerpt && <p className="text-muted text-sm mb-3">{duyuru.excerpt}</p>}
                  {duyuru.publishedAt && (
                    <span className="text-xs text-muted">
                      {new Date(duyuru.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  )}
                </Link>
              ))}

              {/* Diğer Duyurular */}
              <div className="space-y-4">
                {rest.map((duyuru) => (
                  <Link
                    key={duyuru.id}
                    href={`/duyurular/${duyuru.slug}`}
                    className="block p-5 rounded-[var(--border-radius)] border bg-background border-border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {duyuru.category && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                              {duyuru.category.name}
                            </span>
                          )}
                          {duyuru.publishedAt && (
                            <span className="text-xs text-muted">
                              {new Date(duyuru.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold font-heading text-foreground mb-1">{duyuru.title}</h3>
                        {duyuru.excerpt && <p className="text-muted text-sm">{duyuru.excerpt}</p>}
                      </div>
                      <svg className="w-5 h-5 text-muted flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  {page > 1 && (
                    <Link href={`/duyurular?page=${page - 1}`} className="px-4 py-2 rounded border border-border text-muted hover:bg-background transition-colors">Önceki</Link>
                  )}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <Link key={p} href={`/duyurular?page=${p}`} className={`px-4 py-2 rounded font-semibold ${p === page ? "bg-primary text-white" : "border border-border text-muted hover:bg-background transition-colors"}`}>{p}</Link>
                  ))}
                  {page < pagination.totalPages && (
                    <Link href={`/duyurular?page=${page + 1}`} className="px-4 py-2 rounded border border-border text-muted hover:bg-background transition-colors">Sonraki</Link>
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
