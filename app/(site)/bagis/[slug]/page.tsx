import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const campaign = await getCampaignBySlug(params.slug);
  if (!campaign) return { title: "Kampanya Bulunamadı" };
  return {
    title: campaign.title,
    description: campaign.description?.substring(0, 160) || undefined,
    openGraph: {
      title: campaign.title,
      description: campaign.description?.substring(0, 160) || undefined,
      ...(campaign.coverImage && { images: [{ url: campaign.coverImage, width: 1200, height: 630, alt: campaign.title }] }),
    },
    alternates: {
      canonical: `${SITE_URL}/bagis/${params.slug}`,
    },
  };
}

export default async function KampanyaDetayPage({ params }: { params: { slug: string } }) {
  const campaign = await getCampaignBySlug(params.slug);
  if (!campaign) notFound();

  const yuzde = campaign.targetAmount > 0
    ? Math.min(100, Math.round((campaign.collectedAmount / campaign.targetAmount) * 100))
    : 0;
  const kalan = Math.max(0, campaign.targetAmount - campaign.collectedAmount);

  return (
    <main>
      {/* Hero */}
      <section className="bg-primary text-white pt-28 pb-8 md:pt-32 md:pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href="/bagis" className="hover:text-white">Bağış</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{campaign.title}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">{campaign.title}</h1>
          {campaign.description && (
            <p className="text-lg text-white/80 max-w-2xl">
              {campaign.description.length > 200
                ? campaign.description.substring(0, 200) + "..."
                : campaign.description}
            </p>
          )}
        </div>
      </section>

      {/* İlerleme Çubuğu */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-3xl font-bold font-heading text-primary">
                  {campaign.collectedAmount.toLocaleString("tr-TR")} TL
                </span>
                <span className="text-muted ml-2">/ {campaign.targetAmount.toLocaleString("tr-TR")} TL hedef</span>
              </div>
            </div>
            <div className="w-full bg-background-alt rounded-full h-4 border border-border">
              <div className="bg-primary h-4 rounded-full transition-all" style={{ width: `${yuzde}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted">
              <span>%{yuzde} tamamlandı</span>
              <span>Kalan: {kalan.toLocaleString("tr-TR")} TL</span>
            </div>
          </div>
        </div>
      </section>

      {/* İçerik */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sol: Detay */}
            <div className="lg:col-span-2">
              {campaign.coverImage && (
                <div className="aspect-video rounded-[var(--border-radius)] mb-8 overflow-hidden border border-border">
                  <img src={campaign.coverImage} alt={campaign.title} className="w-full h-full object-cover" />
                </div>
              )}

              <article className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold font-heading text-foreground mb-4">Kampanya Hakkında</h2>
                <div className="text-muted leading-relaxed whitespace-pre-line">{campaign.description}</div>
              </article>

              {campaign.deadline && (
                <div className="mt-8 p-4 bg-accent rounded-[var(--border-radius)] border border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-foreground font-semibold">
                      Son Tarih: {new Date(campaign.deadline).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Sağ: Bağış Formu */}
            <aside className="space-y-6">
              <div className="card p-6 sticky top-4">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">Bu Kampanyaya Destek Ol</h3>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[100, 250, 500, 1000, 2500, 5000].map((tutar) => (
                    <button
                      key={tutar}
                      className={`py-2 rounded-[var(--border-radius)] border text-sm font-semibold transition-colors ${
                        tutar === 500
                          ? "border-primary bg-primary text-white"
                          : "border-border text-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {tutar >= 1000 ? `${(tutar / 1000).toFixed(tutar % 1000 === 0 ? 0 : 1)}K` : tutar}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  placeholder="Diğer tutar (TL)"
                  className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mb-4"
                />

                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Ad Soyad"
                    className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <input
                    type="email"
                    placeholder="E-posta"
                    className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-xs text-muted">Anonim bağış yap</span>
                </label>

                <button className="btn-primary w-full">Bağış Yap</button>

                <p className="text-xs text-muted text-center mt-3">
                  Güvenli ödeme altyapısı ile korunmaktadır.
                </p>
              </div>

              {/* Paylaş */}
              <div className="card p-6">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">Kampanyayı Paylaş</h3>
                <p className="text-muted text-sm mb-3">Paylaşarak daha fazla kişiye ulaşmasına yardımcı olun.</p>
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
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
