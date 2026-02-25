import Link from "next/link";

const categories = [
  "Tümü",
  "Eğitim",
  "Sağlık",
  "Gıda",
  "Su",
  "Barınma",
  "Tarım",
];

const demoActivities = [
  {
    id: "1",
    title: "Tarımsal Sulama Projesi",
    slug: "tarimsal-sulama-projesi",
    category: "Tarım",
    excerpt: "Afrika'da tarımsal sulama altyapısı kurarak çiftçilere destek oluyoruz.",
    status: "Devam Ediyor",
    coverImage: null,
  },
  {
    id: "2",
    title: "Okul İnşaat Projesi",
    slug: "okul-insaat-projesi",
    category: "Eğitim",
    excerpt: "İhtiyaç bölgelerinde okullar inşa ederek eğitime erişimi artırıyoruz.",
    status: "Tamamlandı",
    coverImage: null,
  },
  {
    id: "3",
    title: "Sağlık Taraması Kampanyası",
    slug: "saglik-taramasi-kampanyasi",
    category: "Sağlık",
    excerpt: "Kırsal bölgelerde ücretsiz sağlık taraması gerçekleştiriyoruz.",
    status: "Tamamlandı",
    coverImage: null,
  },
  {
    id: "4",
    title: "Ramazan Gıda Dağıtımı",
    slug: "ramazan-gida-dagitimi",
    category: "Gıda",
    excerpt: "Ramazan ayında ihtiyaç sahibi ailelere gıda paketi ulaştırıyoruz.",
    status: "Devam Ediyor",
    coverImage: null,
  },
  {
    id: "5",
    title: "Süt Keçisi Projesi",
    slug: "sut-kecisi-projesi",
    category: "Tarım",
    excerpt: "Kırsal kesimdeki ailelere sürdürülebilir geçim kaynağı sağlıyoruz.",
    status: "Devam Ediyor",
    coverImage: null,
  },
  {
    id: "6",
    title: "Su Kuyusu Açma",
    slug: "su-kuyusu-acma",
    category: "Su",
    excerpt: "Temiz suya erişimi olmayan bölgelerde su kuyuları açıyoruz.",
    status: "Devam Ediyor",
    coverImage: null,
  },
];

const categoryColors: Record<string, string> = {
  Eğitim: "bg-blue-100 text-blue-700",
  Sağlık: "bg-red-100 text-red-700",
  Gıda: "bg-amber-100 text-amber-700",
  Su: "bg-cyan-100 text-cyan-700",
  Barınma: "bg-purple-100 text-purple-700",
  Tarım: "bg-green-100 text-green-700",
};

export default function ActivitiesSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Faaliyetlerimiz
          </span>
          <h2 className="mt-3">
            Yaptığımız <span className="text-primary">Çalışmalar</span>
          </h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat === "Tümü"
                  ? "bg-primary text-white"
                  : "bg-accent text-foreground hover:bg-primary hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Activity Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoActivities.map((activity) => (
            <Link
              key={activity.id}
              href={`/faaliyetler/${activity.slug}`}
              className="card group"
            >
              {/* Image */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      categoryColors[activity.category] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {activity.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      activity.status === "Devam Ediyor"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                  {activity.title}
                </h3>
                <p className="text-sm text-muted line-clamp-2">
                  {activity.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary">
                  Detayları Gör
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link href="/faaliyetler" className="btn-outline">
            Tüm Faaliyetleri Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
