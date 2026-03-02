import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || undefined,
  };
}

export default async function CMSPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-8">
            {page.title}
          </h1>

          <div
            className="prose prose-lg max-w-none text-foreground/80"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </div>

      {page.customCss && (
        <style dangerouslySetInnerHTML={{ __html: page.customCss }} />
      )}
    </div>
  );
}
