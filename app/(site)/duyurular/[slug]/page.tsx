import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";
import { getPostBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = await getPostBySlug(params.slug, "ANNOUNCEMENT");
  if (!result) return { title: "Duyuru Bulunamadı" };
  const post = result.post;
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      ...(post.publishedAt && { publishedTime: String(post.publishedAt) }),
      ...(post.coverImage && { images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] }),
    },
    alternates: {
      canonical: `${SITE_URL}/duyurular/${params.slug}`,
    },
  };
}

export default async function DuyuruDetayPage({ params }: { params: { slug: string } }) {
  const result = await getPostBySlug(params.slug, "ANNOUNCEMENT");
  if (!result) notFound();

  const { post, related } = result;

  const articleJsonLd = generateArticleJsonLd({
    title: post.title,
    description: post.excerpt || "",
    url: `${SITE_URL}/duyurular/${post.slug}`,
    image: post.coverImage || `${SITE_URL}/images/og-default.jpg`,
    publishedTime: String(post.publishedAt || new Date().toISOString()),
    author: post.author?.name || "DernekPro",
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Ana Sayfa", href: "/" },
    { name: "Duyurular", href: "/duyurular" },
    { name: post.title, href: `/duyurular/${post.slug}` },
  ]);

  return (
    <main>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <section className="bg-primary text-white pt-28 pb-8 md:pt-32 md:pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href="/duyurular" className="hover:text-white">Duyurular</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{post.title}</span>
          </nav>
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
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <div className="prose prose-lg max-w-none text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            <aside className="space-y-6">
              {related.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-bold font-heading text-foreground mb-4">Diğer Duyurular</h3>
                  <div className="space-y-4">
                    {related.map((item, i) => (
                      <Link key={item.id} href={`/duyurular/${item.slug}`} className="block group">
                        {item.publishedAt && (
                          <span className="text-xs text-muted">
                            {new Date(item.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                          </span>
                        )}
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mt-1">
                          {item.title}
                        </h4>
                        {i < related.length - 1 && <hr className="border-border mt-4" />}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
