import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tags: string[];
  publishedAt: string | null;
  category: { id: string; name: string; slug: string } | null;
  author: { id: string; name: string } | null;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  category: { name: string } | null;
}

async function getHaber(slug: string): Promise<{ post: Post; related: RelatedPost[] } | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts/${slug}?type=NEWS`, { next: { revalidate: 60 } });
    const json = await res.json();
    if (json.success) return { post: json.data, related: json.related || [] };
  } catch {
    // fallback
  }
  return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = await getHaber(params.slug);
  if (!result) return { title: "Haber Bulunamadı" };
  const post = result.post;
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      ...(post.publishedAt && { publishedTime: post.publishedAt }),
      ...(post.coverImage && { images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] }),
    },
    alternates: {
      canonical: `${SITE_URL}/haberler/${params.slug}`,
    },
  };
}

export default async function HaberDetayPage({ params }: { params: { slug: string } }) {
  const result = await getHaber(params.slug);
  if (!result) notFound();

  const { post, related } = result;

  const articleJsonLd = generateArticleJsonLd({
    title: post.title,
    description: post.excerpt || "",
    url: `${SITE_URL}/haberler/${post.slug}`,
    image: post.coverImage || `${SITE_URL}/images/og-default.jpg`,
    publishedTime: post.publishedAt || new Date().toISOString(),
    author: post.author?.name || "DernekPro",
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Ana Sayfa", href: "/" },
    { name: "Haberler", href: "/haberler" },
    { name: post.title, href: `/haberler/${post.slug}` },
  ]);

  return (
    <main>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {/* Breadcrumb */}
      <section className="bg-primary text-white pt-28 pb-8 md:pt-32 md:pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href="/haberler" className="hover:text-white">Haberler</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{post.title}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                {post.category.name}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            )}
            {post.author && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.author.name}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* İçerik */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              {post.coverImage && (
                <div className="aspect-video rounded-[var(--border-radius)] mb-8 overflow-hidden border border-border">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div
                className="prose prose-lg max-w-none text-muted leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-background-alt text-muted px-3 py-1 rounded-full border border-border">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Paylaş */}
              <div className="mt-10 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-semibold">Bu haberi paylaş:</span>
                  <div className="flex gap-3">
                    {["Facebook", "Twitter", "WhatsApp", "LinkedIn"].map((p) => (
                      <button
                        key={p}
                        className="w-10 h-10 rounded-full bg-background-alt border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors text-xs font-bold"
                        title={p}
                      >
                        {p[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {related.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-bold font-heading text-foreground mb-4">İlgili Haberler</h3>
                  <div className="space-y-4">
                    {related.map((haber, i) => (
                      <Link key={haber.id} href={`/haberler/${haber.slug}`} className="block group">
                        {haber.publishedAt && (
                          <span className="text-xs text-muted">
                            {new Date(haber.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                          </span>
                        )}
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mt-1">
                          {haber.title}
                        </h4>
                        {i < related.length - 1 && <hr className="border-border mt-4" />}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="card p-6 bg-accent">
                <h3 className="text-lg font-bold font-heading text-foreground mb-2">E-Bülten Aboneliği</h3>
                <p className="text-muted text-sm mb-4">Haberlerimizden anında haberdar olmak için e-bültenimize abone olun.</p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <button className="btn-primary w-full text-sm">Abone Ol</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
