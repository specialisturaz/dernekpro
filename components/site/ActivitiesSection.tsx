import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/lib/data";

const categoryColors: Record<string, string> = {
  "Eğitim": "bg-blue-100 text-blue-700",
  "Sağlık": "bg-red-100 text-red-700",
  "Gıda": "bg-amber-100 text-amber-700",
  "Su": "bg-cyan-100 text-cyan-700",
  "Barınma": "bg-purple-100 text-purple-700",
  "Tarım": "bg-green-100 text-green-700",
  "İnsani Yardım": "bg-rose-100 text-rose-700",
  "Hayvancılık": "bg-emerald-100 text-emerald-700",
};

const GRADIENTS = [
  "from-blue-500/20 to-indigo-500/10",
  "from-emerald-500/20 to-teal-500/10",
  "from-orange-500/20 to-red-500/10",
  "from-purple-500/20 to-pink-500/10",
  "from-cyan-500/20 to-blue-500/10",
  "from-rose-500/20 to-red-500/10",
];

export default async function ActivitiesSection() {
  const { data: activities } = await getPosts("ACTIVITY", 1, 6);
  if (activities.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Faaliyetlerimiz
            </span>
            <h2 className="mt-3">
              Yaptığımız <span className="text-primary">Çalışmalar</span>
            </h2>
          </div>
          <Link
            href="/faaliyetler"
            className="mt-4 md:mt-0 text-primary font-semibold hover:underline inline-flex items-center gap-1"
          >
            Tüm Faaliyetleri Gör
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Activity Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, idx) => (
            <Link
              key={activity.id}
              href={`/faaliyetler/${activity.slug}`}
              className="card group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="aspect-video relative overflow-hidden">
                {activity.coverImage ? (
                  <Image
                    src={activity.coverImage}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]} flex items-center justify-center`}>
                    <svg className="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {activity.category && (
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[activity.category.name] || "bg-gray-100 text-gray-700"}`}>
                      {activity.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {activity.title}
                </h3>
                {activity.excerpt && (
                  <p className="text-sm text-muted line-clamp-2">{activity.excerpt}</p>
                )}
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
      </div>
    </section>
  );
}
