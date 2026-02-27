import Image from "next/image";
import Link from "next/link";

interface CompletedProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  targetAmount: number;
  collectedAmount: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(amount);
}

async function getCompletedProjects(): Promise<CompletedProject[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/campaigns/completed?limit=6`, { next: { revalidate: 120 } });
    const json = await res.json();
    if (json.success) return json.data;
  } catch { /* fallback */ }
  return [];
}

export default async function CompletedProjectsSection() {
  const projects = await getCompletedProjects();

  if (projects.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-background to-teal-50/60" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
            Tamamlanan Projeler
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
            Başarıyla Tamamladığımız Projeler
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Gönüllülerimiz ve bağışçılarımızın desteğiyle hayata geçirdiğimiz projeler
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const progress = project.targetAmount > 0
              ? Math.min(100, Math.round((project.collectedAmount / project.targetAmount) * 100))
              : 100;

            return (
              <div key={project.id} className="group relative">
                <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl border border-border/60 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/[0.06] hover:-translate-y-1 transition-all duration-500">
                  {/* Cover Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Completed badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Tamamlandı
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white line-clamp-2">{project.title}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-sm text-muted line-clamp-2 mb-4">{project.description}</p>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-emerald-600 font-bold">%{progress} Tamamlandı</span>
                        <span className="text-muted">
                          {formatCurrency(project.collectedAmount)} / {formatCurrency(project.targetAmount)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/bagis"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Tüm Kampanyaları Gör
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
