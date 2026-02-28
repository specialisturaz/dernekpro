import Image from "next/image";
import Link from "next/link";
import { getDefaultTenant } from "@/lib/tenant";
import { isModuleActive } from "@/lib/modules/utils";
import { getSponsorChildren } from "@/lib/data";

const categoryLabels: Record<string, string> = {
  giydirme: "Giydirme",
  egitim: "Eğitim",
  saglik: "Sağlık",
  genel: "Genel",
};

const categoryColors: Record<string, string> = {
  giydirme: "bg-rose-100 text-rose-700",
  egitim: "bg-blue-100 text-blue-700",
  saglik: "bg-emerald-100 text-emerald-700",
  genel: "bg-amber-100 text-amber-700",
};

export default async function ChildSponsorSection() {
  const tenant = await getDefaultTenant();
  if (tenant) {
    const active = await isModuleActive(tenant.id, "child-sponsorship");
    if (!active) return null;
  }

  const allChildren = await getSponsorChildren();
  const children = allChildren.filter((c) => c.isFeatured).slice(0, 4);
  if (children.length === 0) return null;

  return (
    <section className="py-10 bg-gradient-to-b from-rose-50/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-rose-500 text-xs font-semibold uppercase tracking-wider">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Çocuk Sponsorluk
            </span>
            <h2 className="mt-1 text-xl md:text-2xl font-bold font-heading text-foreground">
              Bir Çocuğun Hayatına Dokunun
            </h2>
          </div>
          <Link
            href="/hesaplar"
            className="mt-3 md:mt-0 text-primary font-semibold text-sm hover:underline inline-flex items-center gap-1"
          >
            Tümünü Gör
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Cards — compact horizontal scroll on mobile, grid on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {children.map((child) => {
            const progress = child.goalAmount > 0
              ? Math.min(100, Math.round((child.collected / child.goalAmount) * 100))
              : 0;

            return (
              <Link
                key={child.id}
                href="/hesaplar"
                className="card overflow-hidden group hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
              >
                {/* Photo */}
                <div className="aspect-[3/2] relative overflow-hidden">
                  <Image
                    src={child.photoUrl}
                    alt={child.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-2">
                    <p className="text-white font-semibold text-xs drop-shadow-lg">
                      {child.name}, {child.age}
                    </p>
                  </div>
                  <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${categoryColors[child.category] || categoryColors.genel}`}>
                    {categoryLabels[child.category] || child.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-2.5 space-y-2">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-muted">%{progress}</span>
                      <span className="font-semibold text-foreground">
                        {new Intl.NumberFormat("tr-TR").format(child.goalAmount)} ₺
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-primary/10">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <span className="block text-center py-1 rounded bg-primary/10 text-primary text-[10px] font-semibold group-hover:bg-primary group-hover:text-white transition-colors">
                    Sponsor Ol
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
