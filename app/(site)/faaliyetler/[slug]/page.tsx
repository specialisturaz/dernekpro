import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";
import { getPostBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = await getPostBySlug(params.slug, "ACTIVITY");
  if (!result) return { title: "Faaliyet Bulunamadı" };
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
      canonical: `${SITE_URL}/faaliyetler/${params.slug}`,
    },
  };
}

export default async function FaaliyetDetayPage({ params }: { params: { slug: string } }) {
  const result = await getPostBySlug(params.slug, "ACTIVITY");
  if (!result) notFound();

  const { post, related } = result;

  const articleJsonLd = generateArticleJsonLd({
    title: post.title,
    description: post.excerpt || "",
    url: `${SITE_URL}/faaliyetler/${post.slug}`,
    image: post.coverImage || `${SITE_URL}/images/og-default.jpg`,
    publishedTime: String(post.publishedAt || new Date().toISOString()),
    author: post.author?.name || "DernekPro",
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Ana Sayfa", href: "/" },
    { name: "Faaliyetler", href: "/faaliyetler" },
    { name: post.title, href: `/faaliyetler/${post.slug}` },
  ]);

  return (
    <main>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href="/faaliyetler" className="hover:text-white">Faaliyetler</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{post.title}</span>
          </nav>
          {post.category && (
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">{post.category.name}</span>
          )}
          <h1 className="text-3xl md:text-5xl font-bold font-heading mt-3 mb-4">{post.title}</h1>
          {post.publishedAt && (
            <span className="text-white/70 text-sm">
              {new Date(post.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          )}
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              {post.coverImage && (
                <div className="aspect-video rounded-[var(--border-radius)] mb-8 overflow-hidden border border-border">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="prose prose-lg max-w-none text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            <aside className="space-y-6">
              {related.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-bold font-heading text-foreground mb-4">Diğer Faaliyetler</h3>
                  <div className="space-y-4">
                    {related.map((item, i) => (
                      <Link key={item.id} href={`/faaliyetler/${item.slug}`} className="block group">
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
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
