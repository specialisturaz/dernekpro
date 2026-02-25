import Link from "next/link";
import { formatDate } from "@/lib/utils";

const demoNews = [
  {
    id: "1",
    title: "Burkina Faso'da 10 Yeni Su Kuyusu Açıldı",
    slug: "burkina-faso-su-kuyusu",
    excerpt:
      "Afrika'da yürüttüğümüz su kuyusu projesi kapsamında 10 yeni kuyu daha hizmete açıldı.",
    publishedAt: "2026-02-20",
    category: "Proje",
    coverImage: null,
  },
  {
    id: "2",
    title: "Yıllık Genel Kurul Toplantısı Gerçekleştirildi",
    slug: "yillik-genel-kurul",
    excerpt:
      "Derneğimizin yıllık genel kurul toplantısı üyelerin katılımıyla başarıyla tamamlandı.",
    publishedAt: "2026-02-15",
    category: "Duyuru",
    coverImage: null,
  },
  {
    id: "3",
    title: "Kış Yardım Kampanyası Başladı",
    slug: "kis-yardim-kampanyasi",
    excerpt:
      "Soğuk kış aylarında ihtiyaç sahibi ailelere sıcak giysi ve yakacak yardımı ulaştırıyoruz.",
    publishedAt: "2026-02-10",
    category: "Kampanya",
    coverImage: null,
  },
];

export default function NewsSection() {
  return (
    <section className="section-padding bg-background-alt">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Haberler & Duyurular
            </span>
            <h2 className="mt-3">
              Son <span className="text-primary">Gelişmeler</span>
            </h2>
          </div>
          <Link
            href="/haberler"
            className="mt-4 md:mt-0 text-primary font-semibold hover:underline inline-flex items-center gap-1"
          >
            Tüm Haberler
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* News Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoNews.map((news) => (
            <Link
              key={news.id}
              href={`/haberler/${news.slug}`}
              className="card group"
            >
              {/* Image */}
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent relative overflow-hidden">
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 bg-primary text-white rounded-full text-xs font-medium">
                    {news.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <time className="text-xs text-muted">
                  {formatDate(news.publishedAt)}
                </time>
                <h3 className="font-bold mt-2 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-sm text-muted line-clamp-2">
                  {news.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary">
                  Devamını Oku
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
