import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Faaliyetler",
  description: "Derneğimizin gerçekleştirdiği ve devam eden faaliyetler.",
  openGraph: {
    title: "Faaliyetler",
    description: "Derneğimizin gerçekleştirdiği ve devam eden faaliyetler.",
  },
  alternates: {
    canonical: "/faaliyetler",
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

async function getFaaliyetler(): Promise<Post[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts?type=ACTIVITY&limit=50`, { cache: "no-store" });
    const json = await res.json();
    if (json.success) return json.data;
  } catch {
    // fallback
  }
  return [];
}

export default async function FaaliyetlerPage() {
  const faaliyetler = await getFaaliyetler();

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 md:py-24 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 relative">
          <nav className="text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Faaliyetler</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Faaliyetlerimiz</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Eğitimden sağlığa, gıdadan barınmaya kadar geniş bir yelpazede topluma değer katan projelerimizi inceleyin.
          </p>
        </div>
      </section>

      {/* Faaliyet Grid */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-6">
          {faaliyetler.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-muted/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold text-foreground mb-2">Henüz faaliyet bulunmuyor</h2>
              <p className="text-muted">Yakında faaliyetlerimiz burada yayınlanacak.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faaliyetler.map((faaliyet) => (
                <Link
                  key={faaliyet.id}
                  href={`/faaliyetler/${faaliyet.slug}`}
                  className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    {faaliyet.coverImage ? (
                      <img
                        src={faaliyet.coverImage}
                        alt={faaliyet.title}
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
                    <div className="flex items-center gap-2 mb-3">
                      {faaliyet.category && (
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {faaliyet.category.name}
                        </span>
                      )}
                      {faaliyet.publishedAt && (
                        <span className="text-xs text-muted">
                          {new Date(faaliyet.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors">
                      {faaliyet.title}
                    </h3>
                    {faaliyet.excerpt && (
                      <p className="text-muted text-sm line-clamp-3">{faaliyet.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                      Detayları Gör
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-sm text-muted">{faaliyetler.length} faaliyet gösteriliyor</p>
          </div>
        </div>
      </section>
    </main>
  );
}
