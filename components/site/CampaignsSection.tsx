import Link from "next/link";
import Image from "next/image";
import { formatCurrency, getProgressPercentage } from "@/lib/utils";
import { getDefaultTenant } from "@/lib/tenant";
import { isModuleActive } from "@/lib/modules/utils";
import { getCampaigns } from "@/lib/data";

export default async function CampaignsSection() {
  // Kampanya modulu pasifse section'i gosterme
  const tenant = await getDefaultTenant();
  if (tenant) {
    const active = await isModuleActive(tenant.id, "campaigns");
    if (!active) return null;
  }

  const campaigns = (await getCampaigns()).slice(0, 3);

  if (campaigns.length === 0) return null;

  return (
    <section className="section-padding bg-background-alt">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Kampanyalarımız
          </span>
          <h2 className="mt-3">
            Aktif <span className="text-primary">Bağış Kampanyaları</span>
          </h2>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            Devam eden kampanyalarımıza destek olarak binlerce insanın hayatına
            dokunabilirsiniz.
          </p>
        </div>

        {/* Campaign Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {
            const percentage = getProgressPercentage(
              campaign.collectedAmount,
              campaign.targetAmount
            );
            return (
              <div key={campaign.id} className="card group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  {campaign.coverImage ? (
                    <Image
                      src={campaign.coverImage}
                      alt={campaign.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <svg className="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                      %{percentage} tamamlandı
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2">
                    {campaign.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-primary">
                        {formatCurrency(campaign.collectedAmount)}
                      </span>
                      <span className="text-muted font-medium">
                        {formatCurrency(campaign.targetAmount)}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-accent rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/bagis/${campaign.slug}`}
                    className="btn-primary w-full text-center text-sm py-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Bağış Yap
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link href="/bagis" className="btn-outline inline-flex items-center gap-2">
            Tüm Kampanyaları Gör
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
