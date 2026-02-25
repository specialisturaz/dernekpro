import Link from "next/link";
import { formatCurrency, getProgressPercentage } from "@/lib/utils";

const demoCampaigns = [
  {
    id: "1",
    title: "Yetim Yardımı Kampanyası",
    slug: "yetim-yardimi-kampanyasi",
    description: "Yetim çocuklara eğitim, gıda ve barınma desteği sağlıyoruz.",
    targetAmount: 500000,
    collectedAmount: 325000,
    coverImage: null,
  },
  {
    id: "2",
    title: "Su Kuyusu Projesi — Afrika",
    slug: "su-kuyusu-projesi-afrika",
    description: "Temiz suya erişimi olmayan köylere su kuyusu açıyoruz.",
    targetAmount: 250000,
    collectedAmount: 180000,
    coverImage: null,
  },
  {
    id: "3",
    title: "Ramazan Gıda Paketi",
    slug: "ramazan-gida-paketi",
    description: "Ramazan ayında ihtiyaç sahibi ailelere gıda paketi ulaştırıyoruz.",
    targetAmount: 100000,
    collectedAmount: 72000,
    coverImage: null,
  },
];

export default function CampaignsSection() {
  return (
    <section className="section-padding bg-background-alt">
      <div className="container mx-auto px-4">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoCampaigns.map((campaign) => {
            const percentage = getProgressPercentage(
              campaign.collectedAmount,
              campaign.targetAmount
            );
            return (
              <div key={campaign.id} className="card group">
                {/* Image */}
                <div className="aspect-video bg-gradient-to-br from-primary/30 to-accent relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-primary/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2">
                    {campaign.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-primary">
                        {formatCurrency(campaign.collectedAmount)}
                      </span>
                      <span className="text-muted">
                        {formatCurrency(campaign.targetAmount)}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-accent rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted mt-1 text-right">
                      %{percentage} tamamlandı
                    </p>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/bagis/${campaign.slug}`}
                    className="btn-primary w-full text-center text-sm py-2.5"
                  >
                    Bağış Yap
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link href="/bagis" className="btn-outline">
            Tüm Kampanyaları Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
